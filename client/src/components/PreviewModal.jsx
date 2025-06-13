import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PreviewModal({ open, onClose, previewData }) {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

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

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl overflow-auto">
        <DialogHeader>
          <DialogTitle>ETL File Preview</DialogTitle>
        </DialogHeader>

        {/* Table Wrapper with horizontal scroll */}
        <div className="max-h-[500px] overflow-x-auto border rounded">
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
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-gray-50">
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="border px-4 py-2 whitespace-pre-wrap text-gray-700 align-top"
                    >
                      {row[header] ?? <span className="text-gray-400">—</span>}
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
