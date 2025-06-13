// dataLake.controller.js
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import xlsx from "xlsx";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function uploadFile(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    const normalizedData = json.map((row) => {
      const obj = {};
      for (let key in row) {
        const normKey = key.trim().toLowerCase().replace(/\s+/g, "_");
        obj[normKey] = row[key];
      }
      return obj;
    });

    const resultMap = new Map();
    const allTables = new Set();
    const allPipelines = new Set();

    normalizedData.forEach((row) => {
      const source = row["source"];
      const destinationDb = row["destination_database/storage_object_name"];
      const destinationTable = row["destination_table/storage_object_location"];
      const loadType = row["load_type"];
      const etlPipeline = row["job_name"];
      const sourceDb = row["source_database_name"];

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
      if (destinationTable) detail.Destination_Tables.add(destinationTable);
    });

    const output = Array.from(resultMap.entries()).map(([source, entry]) => {
      return {
        source,
        destination: Array.from(entry.DestinationDB),
        loadType: Array.from(entry.LoadType),
        loadTypeDetails: Array.from(entry.Load_Type_Details.values()).map((detail) => {
          detail.Destination_Tables.forEach((t) => allTables.add(t));
          detail.ETL_Pipeline.forEach((p) => allPipelines.add(p));

          const pipelineTableMap = new Map();

          normalizedData.forEach((row) => {
            const lt = row["load_type"];
            const pipeline = row["job_name"];
            const table = row["destination_table/storage_object_location"];
            if (lt === detail.Load_type && pipeline && table) {
              if (!pipelineTableMap.has(pipeline)) {
                pipelineTableMap.set(pipeline, new Set());
              }
              pipelineTableMap.get(pipeline).add(table);
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
        }),
      };
    });

    const finalResponse = {
      data: output,
      scoreValues: {
        sumTotalTables: allTables.size,
        orchestrationPipelines: allPipelines.size,
      },
    };

    fs.unlinkSync(filePath); // Cleanup uploaded file
    res.json(finalResponse);
  } catch (error) {
    console.error("Processing error:", error);
    res.status(500).json({ error: "Failed to process file" });
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
