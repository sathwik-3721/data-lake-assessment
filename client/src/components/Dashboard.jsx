// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { FaMicrosoft, FaGoogle, FaAws } from "react-icons/fa";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-white font-sans h-fit">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 px-6 py-2">
//         <div className="flex items-center justify-between max-w-7xl mx-auto">
//           <div className="flex items-center">
//             <img
//               src="https://images.miraclesoft.com/miracle-logo-dark.svg"
//               alt="Miracle Logo"
//               className="h-8 w-auto"
//             />
//           </div>

//           <div className="flex-1 text-center">
//             <h1 className="text-xl font-semibold text-miracle-black">
//               {"Customer Name"} ETL Assessment Report
//             </h1>
//           </div>
//           <div className="flex items-center space-x-4 text-xl text-white">
//             <div className="bg-white rounded p-1">
//               <img
//                 src="https://swimburger.net/media/ppnn3pcl/azure.png"
//                 alt="Azure"
//                 className="h-8 w-auto"
//               />
//             </div>
//             <div className="bg-white rounded p-1">
//               <img
//                 src="https://www.geekandjob.com/uploads/wiki/a73a9257693d0f4bee6f7a62a5f352eea0937c41.png"
//                 alt="GCP"
//                 className="h-8 w-auto"
//               />
//             </div>
//             <div className="bg-white rounded p-1">
//               <img
//                 src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
//                 alt="AWS"
//                 className="h-8 w-auto"
//               />
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Section */}
//       <section className="bg-white px-6 py-3">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             {/* Left - Customer Logo with Watermark */}
//             <div className="relative">
//               <div className="relative z-10 text-4xl lg:text-5xl font-bold text-miracle-black text-center lg:text-left">
//                 {"<CUSTOMER LOGO>"}
//               </div>
//             </div>

//             {/* Right - Text Content */}
//             <div className="space-y-6">
//               <h2 className="text-3xl lg:text-4xl font-bold text-miracle-black">
//                 Data and Advanced Analytics
//               </h2>
//               <p className="text-lg text-miracle-darkGrey leading-relaxed">
//                 Accelerate your business value with data and analytics to gain
//                 valuable insights while delivering AI-powered solutions using
//                 data visualization and data governance.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Details and Navigation */}
//       <section className="bg-gradient-to-br from-miracle-lightBlue via-miracle-mediumBlue to-miracle-darkBlue px-6 py-7">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
//             {/* Left - Assessment Details */}
//             <Card className="bg-white p-8 shadow-lg border-0">
//               <h3 className="text-xl font-bold text-miracle-black mb-6">
//                 ETL Assessment Report | Key Details :
//               </h3>
//               <div className="space-y-4">
//                 {[
//                   "Client Name",
//                   "Assessment Start Date",
//                   "Assessment End Date",
//                   "ETL Platform",
//                   "ETL Data Platform Owner",
//                   "Documents SharePoint Link",
//                 ].map((label) => (
//                   <div
//                     key={label}
//                     className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
//                   >
//                     <span className="font-medium text-miracle-black">
//                       {label} :
//                     </span>
//                     <span className="text-miracle-darkGrey">{"< >"}</span>
//                   </div>
//                 ))}
//               </div>
//             </Card>

//             {/* Right - Action Buttons */}
//             <div className="flex flex-col space-y-6 lg:pl-8">
//               <Button
//                 className="bg-miracle-mediumBlue hover:bg-miracle-darkBlue text-white rounded-lg py-4 px-8 text-lg font-medium shadow-lg"
//                 onClick={() => navigate("/lineage")}
//               >
//                 Click for ETL Lineage Flow
//               </Button>
//               <Button
//                 className="bg-miracle-mediumBlue hover:bg-miracle-darkBlue text-white rounded-lg py-4 px-8 text-lg font-medium shadow-lg"
//                 onClick={() => alert("Coming soon...")}
//               >
//                 Click for ETL Detail Info
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const navigate = useNavigate();

  const keyDetails = [
    "Client Name",
    "Assessment Start Date",
    "Assessment End Date",
    "ETL Platform",
    "ETL Data Platform Owner",
    "Documents SharePoint Link",
  ];

  return (
    <div className="h-full font-sans bg-white text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <img
            src="https://images.miraclesoft.com/miracle-logo-dark.svg"
            alt="Miracle Logo"
            className="h-8 w-auto"
          />

          {/* Centered Title */}
          <h1 className="text-lg md:text-xl font-semibold text-center flex-1">
            Customer Name ETL Assessment Report
          </h1>

          {/* Cloud Logos */}
          <div className="flex items-center gap-3">
            <img
              src="https://swimburger.net/media/ppnn3pcl/azure.png"
              alt="Azure"
              className="h-6 md:h-8"
            />
            <img
              src="https://www.geekandjob.com/uploads/wiki/a73a9257693d0f4bee6f7a62a5f352eea0937c41.png"
              alt="GCP"
              className="h-6 md:h-8"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
              alt="AWS"
              className="h-6 md:h-8"
            />
          </div>
        </div>
      </header>

      {/* Main Section */}
      <section className="bg-gray-50 py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: Placeholder Logo */}
          <div className="text-center lg:text-left text-4xl md:text-5xl font-extrabold text-gray-800">
            &lt;CUSTOMER LOGO&gt;
          </div>

          {/* Right: Headline */}
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Data and Advanced Analytics
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Accelerate your business value with data and analytics to gain
              valuable insights while delivering AI-powered solutions using data
              visualization and data governance.
            </p>
          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section className="bg-gradient-to-br from-miracle-lightBlue via-blue-300 to-blue-500 py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - ETL Info */}
          <Card className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h3 className="text-2xl font-semibold border-b pb-4 border-gray-200">
              ETL Assessment Report | Key Details :
            </h3>

            <div className="space-y-4">
              {keyDetails.map((label) => (
                <div
                  key={label}
                  className="flex justify-between items-center text-md text-gray-800"
                >
                  <span className="font-medium">{label}:</span>
                  <span className="text-gray-600">&lt;&nbsp;&gt;</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Right - Buttons */}
          <div className="flex flex-col gap-6 items-start justify-center lg:pl-8">
            <Button
              className="bg-blue-700 hover:bg-blue-800 transition-all duration-200 text-white rounded-lg py-4 px-8 text-lg font-medium shadow-md"
              onClick={() => navigate("/lineage")}
            >
              🔍 Click for ETL Lineage Flow
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white rounded-lg py-4 px-8 text-lg font-medium shadow-md"
              onClick={() => alert("Coming soon...")}
            >
              📄 Click for ETL Detail Info
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
