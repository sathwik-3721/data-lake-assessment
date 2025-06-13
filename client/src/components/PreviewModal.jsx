// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// export default function PreviewModal({ open, onClose, previewData }) {
//   const [data, setData] = useState([]);
//   const [headers, setHeaders] = useState([]);

//   useEffect(() => {
//     if (open && previewData?.length) {
//       setData(previewData);

//       const allKeys = new Set();
//       previewData.forEach((row) => {
//         Object.keys(row).forEach((key) => allKeys.add(key));
//       });
//       setHeaders(Array.from(allKeys));
//     }
//   }, [open, previewData]);

//   if (!open) return null;

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-7xl overflow-auto">
//         <DialogHeader>
//           <DialogTitle>ETL File Preview</DialogTitle>
//         </DialogHeader>

//         {/* Table Wrapper with horizontal scroll */}
//         <div className="max-h-[500px] overflow-x-auto border rounded">
//           <table className="min-w-full table-auto border-collapse text-sm text-left">
//             <thead className="bg-gray-100 sticky top-0 z-10">
//               <tr>
//                 {headers.map((header, index) => (
//                   <th
//                     key={index}
//                     className="border px-4 py-2 font-semibold text-gray-800 whitespace-nowrap"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((row, rowIndex) => (
//                 <tr key={rowIndex} className="even:bg-gray-50">
//                   {headers.map((header, colIndex) => (
//                     <td
//                       key={colIndex}
//                       className="border px-4 py-2 whitespace-pre-wrap text-gray-700 align-top"
//                     >
//                       {row[header] ?? <span className="text-gray-400">—</span>}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@headlessui/react";

// Convert decimal (e.g., 0.29166) to time string
const convertDecimalToTime = (decimalTime) => {
  const num = parseFloat(decimalTime);
  if (isNaN(num)) return decimalTime;
  const totalMinutes = Math.floor(num * 24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const date = new Date(0, 0, 0, hours, minutes);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get unique values for a given field
const getUniqueValues = (data, key) => {
  return Array.from(
    new Set(data.map((item) => item[key]).filter(Boolean))
  ).sort();
};

// Export to CSV
const exportToCSV = (rows, headers) => {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => `"${(row[h] ?? "").toString().replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "etl_preview_export.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export default function PreviewModal({ open, onClose, previewData }) {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [sourceFilter, setSourceFilter] = useState("");
  const [loadTypeFilter, setLoadTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const sources = useMemo(
    () => getUniqueValues(previewData || [], "Source"),
    [previewData]
  );
  const loadTypes = useMemo(
    () => getUniqueValues(previewData || [], "Load Type"),
    [previewData]
  );

  useEffect(() => {
    if (open && previewData?.length) {
      setData(previewData);
      const allKeys = new Set();
      previewData.forEach((row) => {
        Object.keys(row).forEach((key) => allKeys.add(key));
      });
      setHeaders(Array.from(allKeys));
    }
  }, [open, previewData]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const sourceMatch = sourceFilter ? row["Source"] === sourceFilter : true;
      const loadTypeMatch = loadTypeFilter
        ? row["Load Type"] === loadTypeFilter
        : true;
      const searchMatch = searchTerm
        ? Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;
      return sourceMatch && loadTypeMatch && searchMatch;
    });
  }, [data, sourceFilter, loadTypeFilter, searchTerm]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl overflow-auto">
        <DialogHeader className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <DialogTitle className="text-lg font-bold">
            ETL File Preview
          </DialogTitle>

          {/* Filters + Search + Export */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Source</label>
              <select
                className="border px-2 py-1 rounded"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                <option value="">All</option>
                {sources.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">ETL Load Type</label>
              <select
                className="border px-2 py-1 rounded"
                value={loadTypeFilter}
                onChange={(e) => setLoadTypeFilter(e.target.value)}
              >
                <option value="">All</option>
                {loadTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-3 py-1 rounded w-48"
            />

            <Button
              title="Export as Excel file"
              onClick={() => exportToCSV(filteredData, headers)}
              className="relative bg-miracle-mediumBlue text-white text-sm px-4 py-1.5 rounded hover:bg-miracle-mediumBlue/90 transition"
            >
              Export
            </Button>
          </div>
        </DialogHeader>

        {/* Table */}
        <div className="max-h-[500px] overflow-x-auto border rounded mt-4">
          <table className="min-w-full table-auto border-collapse text-sm text-left">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="border px-4 py-2 font-semibold text-gray-800 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-gray-50">
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="border px-4 py-2 whitespace-pre-wrap text-gray-700 align-top"
                    >
                      {header === "Schedule Time(IST)"
                        ? convertDecimalToTime(row[header])
                        : row[header] ?? (
                            <span className="text-gray-400">—</span>
                          )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
