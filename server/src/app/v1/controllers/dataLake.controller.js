import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import xlsx from "xlsx";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Column alias mapping
const columnAliases = {
  // Source
  source: "source",

  // Destination
  "destination_database/storage_object_name": "destination",
  destination: "destination",

  // Load Type
  load_type: "loadType",
  "load type": "loadType",

  // ETL Pipeline
  etl_pipeline: "ETLPipeline",
  job_name: "ETLPipeline",

  // Destination Tables
  destination_tables: "destinationTables",
  "destination_table/storage_object_location": "destinationTables",

  // Total Tables
  total_tables: "totalDestinationTables",

  "sum_of_pipeline_duration(min)": "sumPipelineDuration",
};

function normalizeRow(row) {
  const obj = {};
  for (let key in row) {
    const normKey = key.trim().toLowerCase().replace(/\s+/g, "_");
    const mappedKey = columnAliases[normKey] || normKey;
    obj[mappedKey] = row[key];
  }

  // Fill totalDestinationTables if missing
  if (!obj.totalDestinationTables && obj.destinationTables) {
    const count = String(obj.destinationTables)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean).length;
    obj.totalDestinationTables = count;
  }

  return obj;
}

export function uploadFile(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    const normalizedData = json.map(normalizeRow);

    const resultMap = new Map();
    const allTables = new Set();
    const allPipelines = new Set();

    // Extract existing value for sumPipelineDuration (first non-empty row)
    let totalPipelineDurationMin = 0;
    for (const row of normalizedData) {
      const val = parseFloat(row.sumPipelineDuration);
      if (!isNaN(val)) {
        totalPipelineDurationMin += val;
      }
    }

    normalizedData.forEach((row) => {
      const source = row.source;
      const destinationDb = row.destination;
      const destinationTable = row.destinationTables;
      const loadType = row.loadType;
      const etlPipeline = row.ETLPipeline;
      const sourceDb = row.source_database_name;

      if (!source || !loadType) return;

      if (!resultMap.has(source)) {
        resultMap.set(source, {
          Destination: new Set(),
          DestinationDB: new Set(),
          LoadType: new Set(),
          Load_Type_Details: new Map(),
        });
      }

      const entry = resultMap.get(source);
      entry.Destination.add(sourceDb);
      entry.DestinationDB.add(destinationDb);
      entry.LoadType.add(loadType);

      if (!entry.Load_Type_Details.has(loadType)) {
        entry.Load_Type_Details.set(loadType, {
          Load_type: loadType,
          ETL_Pipeline: new Set(),
          Destination_Tables: new Set(),
        });
      }

      const detail = entry.Load_Type_Details.get(loadType);
      if (etlPipeline) detail.ETL_Pipeline.add(etlPipeline);
      if (destinationTable) {
        destinationTable
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .forEach((t) => detail.Destination_Tables.add(t));
      }
    });

    const output = Array.from(resultMap.entries()).map(([source, entry]) => {
      return {
        source,
        destination: Array.from(entry.DestinationDB),
        loadType: Array.from(entry.LoadType),
        loadTypeDetails: Array.from(entry.Load_Type_Details.values()).map(
          (detail) => {
            detail.Destination_Tables.forEach((t) => allTables.add(t));
            detail.ETL_Pipeline.forEach((p) => allPipelines.add(p));

            const pipelineTableMap = new Map();

            normalizedData.forEach((row) => {
              if (
                row.loadType === detail.Load_type &&
                row.ETLPipeline &&
                row.destinationTables
              ) {
                const pipeline = row.ETLPipeline;
                if (!pipelineTableMap.has(pipeline)) {
                  pipelineTableMap.set(pipeline, new Set());
                }

                const tables = String(row.destinationTables)
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean);
                tables.forEach((t) => pipelineTableMap.get(pipeline).add(t));
              }
            });

            const pipelineList = Array.from(detail.ETL_Pipeline);
            const destinationTables = pipelineList.map((pipeline) => {
              const tables = pipelineTableMap.get(pipeline) || new Set();
              return Array.from(tables).join(", ");
            });

            const totalDestinationTables = destinationTables.map((tblStr) =>
              tblStr.trim() === "" ? 0 : tblStr.split(",").length
            );

            return {
              loadType: detail.Load_type,
              ETLPipeline: pipelineList,
              destinationTables,
              totalDestinationTables,
            };
          }
        ),
      };
    });

    const finalResponse = {
      data: output,
      scoreValues: {
        sumTotalTables: allTables.size,
        orchestrationPipelines: allPipelines.size,
        totalPipelineDurationMin: totalPipelineDurationMin,
      },
    };

    // fs.unlinkSync(filePath); // optional cleanup
    res.json(finalResponse);
  } catch (error) {
    console.error("Processing error:", error);
    res.status(500).json({ error: "Failed to process file" });
  }
}

export function previewFile(req, res) {
  try {
    const uploadsPath = path.join(__dirname, "uploads");
    const files = fs.readdirSync(uploadsPath);
    if (files.length === 0) {
      return res.status(404).json({ error: "No files uploaded" });
    }

    const latestFile = path.join(uploadsPath, files[files.length - 1]);
    const workbook = xlsx.readFile(latestFile);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    res.json({ data: json });
  } catch (error) {
    console.error("Error in previewFile:", error);
    res.status(500).json({ error: "Unable to preview file" });
  }
}

export function test(req, res) {
  try {
    console.log("Test function called");
    res.status(200).json({ message: "Test successful" });
  } catch (error) {
    console.error("An error occurred in test function:", error);
    res.status(500).json({ message: "An error occurred" });
  }
}
