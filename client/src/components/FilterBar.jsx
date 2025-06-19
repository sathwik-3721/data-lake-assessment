import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Filter, Zap, Repeat } from "lucide-react";
import { SiSap, SiOracle } from "react-icons/si";
import { FaServer, FaNetworkWired, FaDatabase } from "react-icons/fa";

export default function FilterBar({
  sources,
  loadTypes,
  selectedSource,
  selectedLoadType,
  onToggleSource,
  onToggleLoadType,
}) {
  const getIcon = (label, isSelected) => {
    const iconColor = isSelected ? "text-miracle-mediumBlue" : "text-miracle-mediumBlue";

    switch (label) {
      case "SAP /ORACLE":
        return (
          <span className="flex gap-1 items-center">
            <SiSap size={24} className={iconColor} />
            <SiOracle size={16} className={iconColor} />
          </span>
        );
      case "SQL Server":
        return <FaServer size={16} className={iconColor} />;
      case "Opus":
        return <FaNetworkWired size={16} className={iconColor} />;
      case "Full Load":
        return <Repeat size={16} className={iconColor} />;
      case "Incremental Load":
        return <Zap size={16} className={iconColor} />;
      default:
        return <FaDatabase size={16} className={iconColor} />;
    }
  };
  return (
    <div className="flex justify-center items-start gap-6 mr-6">
      <div>
        <label className="flex items-center gap-1 mb-1 text-sm font-medium">
          <Filter size={16} /> Data Source
        </label>
        <Select
          value={selectedSource ?? undefined}
          onValueChange={(val) => onToggleSource(val === "all" ? null : val)}
        >
          <SelectTrigger className="w-48 border border-gray-300 rounded px-2 py-1 bg-white">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {sources.map((src) => (
              <SelectItem key={src} value={src}>
                <div
                  className={`flex items-center gap-2 ${
                    selectedSource === src
                      ? "bg-miracle-white text-black"
                      : ""
                  } rounded`}
                >
                  {getIcon(src, selectedSource === src)}
                  <span>{src}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ETL Load Type */}
      <div>
        <label className="flex items-center gap-1 mb-1 text-sm font-medium">
          <Filter size={16} /> ETL Load Type
        </label>
        <Select
          value={selectedLoadType ?? undefined}
          onValueChange={(val) => onToggleLoadType(val === "all" ? null : val)}
        >
          <SelectTrigger className="w-48 border border-gray-300 rounded px-2 py-1 bg-white">
            <SelectValue placeholder="All Load Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Load Types</SelectItem>
            {loadTypes.map((lt) => (
              <SelectItem key={lt} value={lt}>
                <div
                  className={`flex items-center gap-2 ${
                    selectedLoadType === lt
                      ? "bg-miracle-white text-black"
                      : ""
                  } rounded`}
                >
                  {getIcon(lt, selectedLoadType === lt)}
                  <span>{lt}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
