import React from "react";

const ScoreCard = ({ totalTables, totalPipelines, totalMinutes }) => {
  return (
    <>
      <div className="flex justify-end mr-28 gap-12 mt-6 ">
        <div className="text-center">
          <div className="text-2xl font-bold">{totalTables}</div>
          <div className="text-sm text-gray-500">
            Total Tables in ETL Process
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{totalPipelines}</div>
          <div className="text-sm text-gray-500">
            Total Orchestration Pipelines
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">
            {(totalMinutes / 60).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">Pipeline Runtime Hrs</div>
        </div>
      </div>
      {/* <div className="border-b shadow-sm pb-4 bg-white"></div> */}
    </>
  );
};

export default ScoreCard;
