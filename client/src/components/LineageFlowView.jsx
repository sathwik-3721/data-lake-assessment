// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import etlData from "../data/etlData.json";
// import FilterBar from "./FilterBar";
// import ScoreCard from "./ScoreCard";
// import LineageFlow from "./LineageFlow";
// import MiracleLogo from "../../public/labs.png";
// import { Button } from "./ui/button";
// import { ArrowLeft } from "lucide-react";

// const getAllSources = (data) => [...new Set(data.map((d) => d.source))];
// const getAllLoadTypes = (data) => [
//   ...new Set(data.flatMap((d) => d.Load_types)),
// ];

// export default function LineageFlowView() {
//   const navigate = useNavigate();
//   const [selectedSource, setSelectedSource] = useState(null);
//   const [selectedLoadType, setSelectedLoadType] = useState(null);

//   const toggleSource = (source) => {
//     setSelectedSource((prev) => (prev === source ? null : source));
//   };

//   const toggleLoadType = (type) => {
//     setSelectedLoadType((prev) => (prev === type ? null : type));
//   };

//   const filteredData = etlData
//     .filter(
//       (entry) =>
//         entry.source && (!selectedSource || entry.source === selectedSource)
//     )
//     .map((entry) => ({
//       ...entry,
//       Load_types: selectedLoadType
//         ? entry.Load_types?.filter((lt) => lt === selectedLoadType)
//         : entry.Load_types || [],
//       Load_Type_Details: selectedLoadType
//         ? entry.Load_Type_Details?.filter(
//             (d) => d.Load_type === selectedLoadType
//           )
//         : entry.Load_Type_Details || [],
//     }))
//     .filter((entry) => entry.Load_types?.length > 0);

//   const score = filteredData.reduce(
//     (acc, entry) => {
//       entry.Load_Type_Details?.forEach((detail) => {
//         acc.totalTables +=
//           detail.Total_Tables?.reduce((sum, count) => sum + count, 0) || 0;
//         acc.totalPipelines += detail.ETL_Pipeline?.length || 0;
//         acc.totalMinutes += detail.Duration_Minutes || 0;
//       });
//       return acc;
//     },
//     { totalTables: 0, totalPipelines: 0, totalMinutes: 0 }
//   );

//   return (
//     <main className="min-h-screen bg-white text-black font-sans">
//       <div className="sticky top-0 z-50 bg-white border-b shadow-sm px-4 py-2">
//         <div className="flex justify-between gap-4">
//           <div className="flex flex-col gap-4 items-start">
//             <Button
//               onClick={() => navigate("/")}
//               variant="outline"
//               className="text-sm bg-miracle-white text-miracle-black hover:bg-miracle-white transition"
//             >
//               <ArrowLeft className="w-5 h-5 -ml-2" />
//               Back
//             </Button>

//             <div className="flex items-center gap-3 w-[730px] rounded-lg p-2 ">
//               <img
//                 height={32}
//                 width={180}
//                 src={MiracleLogo}
//                 alt="Miracle Logo"
//               />
//               <h1 className="text-2xl font-bold text-center ml-32">
//                 ETL Lineage Flow
//               </h1>
//             </div>
//           </div>

//           {/* Filters + ScoreCard */}
//           <div className="flex flex-col items-end gap-1">
//             <FilterBar
//               sources={getAllSources(etlData)}
//               loadTypes={getAllLoadTypes(etlData)}
//               selectedSource={selectedSource}
//               selectedLoadType={selectedLoadType}
//               onToggleSource={toggleSource}
//               onToggleLoadType={toggleLoadType}
//             />
//             <ScoreCard
//               totalTables={score.totalTables}
//               totalPipelines={score.totalPipelines}
//               totalMinutes={score.totalMinutes}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ETL Flow */}
//       {/* <LineageFlow lineageData={filteredData} /> */}

//       <LineageFlow lineageData={filteredData} />
//     </main>
//   );
// }

// harish data
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import etlJson from "../data/etlData.json"; // now has { data: [...], scoreValues: {...} }
import FilterBar from "./FilterBar";
import ScoreCard from "./ScoreCard";
import LineageFlow from "./LineageFlow";
import MiracleLogo from "../../public/labs.png";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const { data: etlData } = etlJson;
const getAllSources = (data) => [...new Set(data.map((d) => d.source))];
const getAllLoadTypes = (data) => [
  ...new Set(data.flatMap((d) => d.loadType)),
];

export default function LineageFlowView() {
  const navigate = useNavigate();
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedLoadType, setSelectedLoadType] = useState(null);
  const { state } = useLocation();
  const etlDataFromState = state?.data;
  console.log("objects etlDataFromState : ", etlDataFromState);

  const toggleSource = (source) =>
    setSelectedSource((prev) => (prev === source ? null : source));
  const toggleLoadType = (type) =>
    setSelectedLoadType((prev) => (prev === type ? null : type));

  // filter & prune based on source + loadType
  const filteredData = etlData
    .filter(
      (entry) =>
        entry.source &&
        (!selectedSource || entry.source === selectedSource)
    )
    .map((entry) => ({
      ...entry,
      loadType: selectedLoadType
        ? entry.loadType.filter((lt) => lt === selectedLoadType)
        : entry.loadType,
      loadTypeDetails: selectedLoadType
        ? entry.loadTypeDetails.filter(
            (d) => d.loadType === selectedLoadType
          )
        : entry.loadTypeDetails,
    }))
    .filter((entry) => entry.loadType.length > 0);

  // recompute totals from ETLPipeline & totalDestinationTables
  const score = filteredData.reduce(
    (acc, entry) => {
      entry.loadTypeDetails?.forEach((detail) => {
        acc.totalTables += detail.totalDestinationTables?.[0] || 0;
        acc.totalPipelines += detail.ETLPipeline?.length || 0;
      });
      return acc;
    },
    { totalTables: 0, totalPipelines: 0 }
  );

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm px-4 py-2">
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-4 items-start">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="text-sm bg-miracle-white text-miracle-black hover:bg-miracle-white transition"
            >
              <ArrowLeft className="w-5 h-5 -ml-2" />
              Back
            </Button>

            <div className="flex items-center gap-3 w-[730px] rounded-lg p-2">
              <img
                height={32}
                width={180}
                src={MiracleLogo}
                alt="Miracle Logo"
              />
              <h1 className="text-2xl font-bold text-center ml-32">
                ETL Lineage Flow
              </h1>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <FilterBar
              sources={getAllSources(etlData)}
              loadTypes={getAllLoadTypes(etlData)}
              selectedSource={selectedSource}
              selectedLoadType={selectedLoadType}
              onToggleSource={toggleSource}
              onToggleLoadType={toggleLoadType}
            />
            <ScoreCard
              totalTables={score.totalTables}
              totalPipelines={score.totalPipelines}
            />
          </div>
        </div>
      </div>

      <LineageFlow lineageData={etlDataFromState} />
    </main>
  );
}
