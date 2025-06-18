// import React, { useRef, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Upload } from "lucide-react";
// import API from "@/services/API";
// import PreviewModal from "./PreviewModal";

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [isUpload, setIsUpload] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const fileInputRef = useRef(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [previewData, setPreviewData] = useState(null);

//   const keyDetails = [
//     "Client Name",
//     "Assessment Start Date",
//     "Assessment End Date",
//     "ETL Platform",
//     "ETL Data Platform Owner",
//     "Documents SharePoint Link",
//   ];

//   useEffect(() => {
//     const uploadStatus = localStorage.getItem("isUpload");
//     if (uploadStatus === "true") {
//       setIsUpload(true);
//     }
//   }, []);

//   const handleUpload = async (file) => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await API.post.upload(file);
//       console.log("Upload Success:", response);
//       setData(response);
//       localStorage.setItem("etlData", JSON.stringify(response));
//       console.log("etlData", localStorage.getItem("etlData"));
//       setIsUpload(true);
//     } catch (err) {
//       console.error("Upload failed:", err);
//       setError("Upload failed. Please try again.");
//     } finally {
//       setLoading(false);
//       setIsDragging(false);
//     }
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     const files = event.dataTransfer.files;
//     if (files.length > 0) {
//       handleUpload(files[0]);
//     }
//   };

//   const handlePreviewData = async () => {
//     try {
//       const apiResponse = await API.get.preview();
//       console.log("Preview Data:", apiResponse?.data);
//       setPreviewData(apiResponse?.data);
//       setShowPreview(true);
//     } catch (error) {
//       console.error("Error fetching preview data:", error);
//     }
//   };

//   const handleFileSelect = (event) => {
//     const files = event.target.files;

//     if (files.length > 0) {
//       handleUpload(files[0]);
//     }
//     localStorage.setItem("isUpload", "true");
//   };

//   return (
//     <div className="h-full font-sans bg-white text-gray-800">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
//           <img
//             src="https://images.miraclesoft.com/miracle-logo-dark.svg"
//             alt="Miracle Logo"
//             className="h-8 w-auto"
//           />
//           <h1 className="text-lg md:text-xl font-semibold text-center flex-1">
//             Customer Name ETL Assessment Report
//           </h1>
//           <div className="flex items-center gap-3">
//             <img
//               src="https://swimburger.net/media/ppnn3pcl/azure.png"
//               alt="Azure"
//               className="h-6"
//             />
//             <img
//               src="https://www.geekandjob.com/uploads/wiki/a73a9257693d0f4bee6f7a62a5f352eea0937c41.png"
//               alt="GCP"
//               className="h-8"
//             />
//             <img
//               src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
//               alt="AWS"
//               className="h-6 mt-2"
//             />
//           </div>
//         </div>
//       </header>


//       {/* Main Section */}
//       <section className="bg-gray-50 py-10 px-6">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
//           <div className="text-center lg:text-left text-4xl md:text-5xl font-extrabold text-gray-800 ">
//             <img
//               src="https://images.miraclesoft.com/miracle-logo-dark.svg"
//               alt="Miracle Logo"
//               className="h-16 w-auto"
//             />
//           </div>
//           <div>
//             <h2 className="text-3xl font-bold mb-4 text-gray-900">
//               Data and Advanced Analytics
//             </h2>
//             <p className="text-lg leading-relaxed text-gray-700">
//               Accelerate your business value with data and analytics to gain
//               valuable insights while delivering AI-powered solutions using data
//               visualization and data governance.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Detail Section */}
//       <section className="bg-gradient-to-br from-miracle-lightBlue via-blue-300 to-blue-500 py-10 px-6">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
//           <Card className="bg-white rounded-xl shadow-lg p-8 space-y-6">
//             <h3 className="text-2xl font-semibold border-b pb-4 border-gray-200">
//               ETL Assessment Report | Key Details :
//             </h3>
//             <div className="space-y-4">
//               {keyDetails.map((label) => (
//                 <div
//                   key={label}
//                   className="flex justify-between items-center text-md text-gray-800"
//                 >
//                   <span className="font-medium">{label}:</span>
//                   <span className="text-gray-600">&lt;&nbsp;&gt;</span>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {isUpload ? (
//             <div className="flex flex-col gap-6 items-start justify-center lg:pl-8">
//               <Button
//                 className="bg-blue-700 hover:bg-blue-800 transition-all duration-200 text-white rounded-lg py-4 px-8 text-lg font-medium shadow-md"
//                 onClick={() => navigate("/lineage")}
//               >
//                 🔍 View ETL Lineage Flow
//               </Button>

//               <Button
//                 onClick={() => handlePreviewData()}
//                 className="bg-blue-700 hover:bg-blue-800 transition-all duration-200 text-white rounded-lg py-4 px-8 text-lg font-medium shadow-md"
//               >
//                 📄 View ETL Detailed Info
//               </Button>

//               <PreviewModal
//                 open={showPreview}
//                 onClose={() => setShowPreview(false)}
//                 previewData={previewData}
//               />
//             </div>
//           ) : (
//             <div
//               className={`w-full h-fit m-auto max-w-xl mx-auto rounded-2xl border-2 border-dashed transition-all duration-300 p-10 backdrop-blur-sm bg-white/10 shadow-xl hover:shadow-2xl cursor-pointer ${
//                 isDragging
//                   ? "bg-blue-100 border-blue-600"
//                   : "border-transparent"
//               }`}
//               onDragOver={(e) => {
//                 e.preventDefault();
//                 setIsDragging(true);
//               }}
//               onDragLeave={() => setIsDragging(false)}
//               onDrop={handleDrop}
//               onClick={() => fileInputRef.current.click()}
//             >
//               <div className="flex flex-col items-center justify-center space-y-2">
//                 <Upload className="w-12 h-12 text-blue-700 mb-2 animate-none" />
//                 <p className="text-xl font-semibold text-blue-800">
//                   {loading ? "Uploading..." : "Upload Your Report"}
//                 </p>
//                 <p className="text-sm font-semibold text-gray-600">
//                   Drag & drop your file here or click to browse
//                 </p>
//                 {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
//               </div>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileSelect}
//                 className="hidden"
//               />
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

// import React, { useRef, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Upload } from "lucide-react";
// import API from "@/services/API";
// import PreviewModal from "./PreviewModal";

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);

//   const [isUpload, setIsUpload] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPreview, setShowPreview] = useState(false);
//   const [previewData, setPreviewData] = useState(null);

//   const keyDetails = [
//     "Client Name",
//     "Assessment Start Date",
//     "Assessment End Date",
//     "ETL Platform",
//     "ETL Data Platform Owner",
//     "Documents SharePoint Link",
//   ];

//   useEffect(() => {
//     const uploadStatus = localStorage.getItem("isUpload");
//     if (uploadStatus === "true") setIsUpload(true);
//   }, []);

//   const handleUpload = async (file) => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await API.post.upload(file);
//       setData(response);
//       localStorage.setItem("etlData", JSON.stringify(response));
//       setIsUpload(true);
//     } catch (err) {
//       setError("Upload failed. Please try again.");
//     } finally {
//       setLoading(false);
//       setIsDragging(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const files = e.dataTransfer.files;
//     if (files.length > 0) handleUpload(files[0]);
//   };

//   const handlePreviewData = async () => {
//     try {
//       const apiResponse = await API.get.preview();
//       setPreviewData(apiResponse?.data);
//       setShowPreview(true);
//     } catch (error) {
//       console.error("Error fetching preview data:", error);
//     }
//   };

//   const handleFileSelect = (e) => {
//     const files = e.target.files;
//     if (files.length > 0) handleUpload(files[0]);
//     localStorage.setItem("isUpload", "true");
//   };

//   return (
//     // <div className="min-h-screen bg-white font-sans text-gray-800">
//     // <div className="w-full h-full min-h-screen overflow-x-hidden overflow-y-auto bg-white font-sans text-gray-800">
//     <div className="w-full h-full min-h-screen overflow-x-hidden">
//       {/* Header */}
//       <header className="bg-white shadow border-b border-gray-200">
//         <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
//           <img
//             src="https://images.miraclesoft.com/miracle-logo-dark.svg"
//             alt="Miracle Logo"
//             className="h-8"
//           />
//           <h1 className="text-xl font-bold text-center flex-1">
//             Customer Name ETL Assessment Report
//           </h1>
//           <div className="flex items-center gap-3">
//             <img
//               src="https://swimburger.net/media/ppnn3pcl/azure.png"
//               alt="Azure"
//               className="h-6"
//             />
//             <img
//               src="https://www.geekandjob.com/uploads/wiki/a73a9257693d0f4bee6f7a62a5f352eea0937c41.png"
//               alt="GCP"
//               className="h-6"
//             />
//             <img
//               src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
//               alt="AWS"
//               className="h-6"
//             />
//           </div>
//         </div>
//       </header>

//       <section className="bg-gray-50 py-10 px-6">
//         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
//           <div className="text-center lg:text-left text-3xl lg:text-5xl font-extrabold text-gray-800">
//             &lt;CUSTOMER LOGO&gt;
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold mb-3 text-gray-900">
//               Data and Advanced Analytics
//             </h2>
//             <p className="text-lg text-gray-700 leading-relaxed">
//               Accelerate your business value with data and analytics to gain
//               valuable insights while delivering AI-powered solutions using data
//               visualization and data governance.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Main */}
//       <section className="bg-gradient-to-br from-blue-200 via-blue-400 to-blue-600 py-12 px-6">
//         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
//           <Card className="bg-white rounded-xl shadow-md p-8 space-y-6">
//             <h3 className="text-2xl font-semibold border-b pb-3 border-gray-200">
//               ETL Assessment Report | Key Details :
//             </h3>
//             <div className="space-y-4">
//               {keyDetails.map((label) => (
//                 <div key={label} className="flex justify-between">
//                   <span className="font-medium">{label}:</span>
//                   <span className="text-gray-600">&lt;&nbsp;&gt;</span>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {isUpload ? (
//             <div className="flex flex-col gap-6 justify-center">
//               <Button
//                 className="bg-blue-700 hover:bg-blue-800 text-white py-4 px-8 rounded-lg text-lg font-semibold transition shadow-lg"
//                 onClick={() => navigate("/lineage")}
//               >
//                 🔍 View ETL Lineage Flow
//               </Button>
//               <Button
//                 onClick={handlePreviewData}
//                 className="bg-blue-700 hover:bg-blue-800 text-white py-4 px-8 rounded-lg text-lg font-semibold transition shadow-lg"
//               >
//                 📄 View ETL Detailed Info
//               </Button>

//               <PreviewModal
//                 open={showPreview}
//                 onClose={() => setShowPreview(false)}
//                 previewData={previewData}
//               />
//             </div>
//           ) : (
//             <div
//               className={`m-auto w-full max-w-xl border-2 border-dashed p-10 rounded-2xl text-center bg-white/20 hover:shadow-2xl transition cursor-pointer ${
//                 isDragging
//                   ? "border-blue-600 bg-blue-100"
//                   : "border-transparent"
//               }`}
//               onDragOver={(e) => {
//                 e.preventDefault();
//                 setIsDragging(true);
//               }}
//               onDragLeave={() => setIsDragging(false)}
//               onDrop={handleDrop}
//               onClick={() => fileInputRef.current.click()}
//             >
//               <Upload className="w-12 h-12 text-blue-700 mx-auto mb-2" />
//               <p className="text-lg font-semibold text-blue-800">
//                 {loading ? "Uploading..." : "Upload Your Report"}
//               </p>
//               <p className="text-sm text-gray-700">
//                 Drag & drop your file here or click to browse
//               </p>
//               {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileSelect}
//                 className="hidden"
//               />
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ImageIcon, LinkIcon, X } from "lucide-react";
import API from "@/services/API";
import PreviewModal from "./PreviewModal";
import { useRef, useState, useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const logoFileInputRef = useRef(null);

  const [isUpload, setIsUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLogoDragging, setIsLogoDragging] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [reportDetails, setReportDetails] = useState({
    clientName: "",
    assessmentStartDate: "",
    assessmentEndDate: "",
    etlPlatform: "",
    etlDataPlatformOwner: "",
    documentsSharePointLink: "",
  });

  const [customerLogo, setCustomerLogo] = useState({
    type: null,
    data: null,
    preview: null,
  });
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const uploadStatus = localStorage.getItem("isUpload");
    if (uploadStatus === "true") setIsUpload(true);

    const savedDetails = localStorage.getItem("reportDetails");
    if (savedDetails) {
      setReportDetails(JSON.parse(savedDetails));
    }

    const savedLogo = localStorage.getItem("customerLogo");
    if (savedLogo) {
      const logoData = JSON.parse(savedLogo);
      setCustomerLogo(logoData);
      if (logoData.type === "url") {
        setLogoUrl(logoData.data);
      }
    }
  }, []);

  const handleUpload = async (file) => {
    try {
      setLoading(true);
      setError("");
      const response = await API.post.upload(file);
      setData(response);
      localStorage.setItem("etlData", JSON.stringify(response));
      setIsUpload(true);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) handleUpload(files[0]);
  };

  const handleLogoDrop = (e) => {
    e.preventDefault();
    setIsLogoDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleLogoUpload(files[0]);
    }
  };

  const handleLogoUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = {
          type: "file",
          data: file,
          preview: e.target.result,
        };
        setCustomerLogo(logoData);
        localStorage.setItem(
          "customerLogo",
          JSON.stringify({
            ...logoData,
            data: null,
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUrl = () => {
    if (logoUrl.trim()) {
      const logoData = {
        type: "url",
        data: logoUrl.trim(),
        preview: logoUrl.trim(),
      };
      setCustomerLogo(logoData);
      localStorage.setItem("customerLogo", JSON.stringify(logoData));
    }
  };

  const handleRemoveLogo = () => {
    setCustomerLogo({ type: null, data: null, preview: null });
    setLogoUrl("");
    localStorage.removeItem("customerLogo");
  };

  const handlePreviewData = async () => {
    try {
      const apiResponse = await API.get.preview();
      setPreviewData(apiResponse?.data);
      setShowPreview(true);
    } catch (error) {
      console.error("Error fetching preview data:", error);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) handleUpload(files[0]);
    localStorage.setItem("isUpload", "true");
  };

  const handleLogoFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) handleLogoUpload(files[0]);
  };

  const handleReportDetailChange = (field, value) => {
    const updatedDetails = { ...reportDetails, [field]: value };
    setReportDetails(updatedDetails);
    localStorage.setItem("reportDetails", JSON.stringify(updatedDetails));
  };

  const keyDetailsLabels = {
    clientName: "Client Name",
    assessmentStartDate: "Assessment Start Date",
    assessmentEndDate: "Assessment End Date",
    etlPlatform: "ETL Platform",
    etlDataPlatformOwner: "ETL Data Platform Owner",
    documentsSharePointLink: "Documents SharePoint Link",
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white shadow border-b border-gray-200 z-10 h-[10%]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <img
              src="https://images.miraclesoft.com/miracle-logo-dark.svg"
              alt="Miracle Logo"
              className="h-8"
            />
            <h1 className="text-lg sm:text-xl font-bold text-center flex-1">
              {reportDetails.clientName || "Customer Name"} ETL Assessment
              Report
            </h1>
            <div className="flex gap-3 items-center">
              {["azure", "gcp", "aws"].map((provider, i) => (
                <img
                  key={provider}
                  src={
                    provider === "azure"
                      ? "https://swimburger.net/media/ppnn3pcl/azure.png"
                      : provider === "gcp"
                      ? "https://www.geekandjob.com/uploads/wiki/a73a9257693d0f4bee6f7a62a5f352eea0937c41.png"
                      : "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
                  }
                  alt={provider}
                  className="h-5 sm:h-6 object-contain"
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto h-[90%]">
        {/* Customer Logo Section */}
        <section className="bg-gray-50 py-3 px-6 h-[30%]">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left">
              {customerLogo.preview ? (
                <div className="relative inline-block">
                  <img
                    src={customerLogo.preview}
                    alt="Customer Logo"
                    className="max-h-32 max-w-full object-contain"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* <div className="text-3xl lg:text-5xl font-extrabold text-gray-800 mb-4">
                    &lt;CUSTOMER LOGO&gt;
                  </div> */}
                  <Tabs
                    defaultValue="upload"
                    className="w-full max-w-md mx-auto lg:mx-0"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="upload"
                        className="flex items-center gap-2"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Upload
                      </TabsTrigger>
                      <TabsTrigger
                        value="url"
                        className="flex items-center gap-2"
                      >
                        <LinkIcon className="h-4 w-4" />
                        URL
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="mt-4">
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                          isLogoDragging
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsLogoDragging(true);
                        }}
                        onDragLeave={() => setIsLogoDragging(false)}
                        onDrop={handleLogoDrop}
                        onClick={() => logoFileInputRef.current?.click()}
                      >
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Drag & drop logo here or click to browse
                        </p>
                        <input
                          type="file"
                          ref={logoFileInputRef}
                          onChange={handleLogoFileSelect}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="url" className="mt-4">
                      <div className="space-y-3">
                        <Input
                          placeholder="Enter public image URL"
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleLogoUrl()
                          }
                        />
                        <Button
                          onClick={handleLogoUrl}
                          className="w-full"
                          size="sm"
                        >
                          Load Logo
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900">
                Data and Advanced Analytics
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Accelerate your business value with data and analytics to gain
                valuable insights while delivering AI-powered solutions using
                data visualization and data governance.
              </p>
            </div>
          </div>
        </section>

        {/* Report Details & File Upload */}
        <section className="bg-gradient-to-br from-blue-200 via-blue-400 to-blue-600 py-4 px-6 h-[70%]">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
            <Card className="bg-white rounded-xl shadow-md p-8 space-y-6 flex flex-col">
              <div className="flex justify-between items-center border-b pb-3 border-gray-200">
                <h3 className="text-2xl font-semibold">
                  ETL Assessment Report | Key Details:
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Save" : "Edit"}
                </Button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto flex-1">
                {Object.entries(keyDetailsLabels).map(([field, label]) => (
                  <div
                    key={field}
                    className="flex justify-between items-center gap-4 border-b border-gray-200 py-2"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {label}:
                    </span>
                    {isEditing ? (
                      field === "documentsSharePointLink" ? (
                        <Textarea
                          className="flex-1 min-h-[60px]"
                          value={reportDetails[field]}
                          onChange={(e) =>
                            handleReportDetailChange(field, e.target.value)
                          }
                        />
                      ) : field.includes("Date") ? (
                        <Input
                          type="date"
                          className="w-60"
                          value={reportDetails[field]}
                          onChange={(e) =>
                            handleReportDetailChange(field, e.target.value)
                          }
                        />
                      ) : (
                        <Input
                          className="w-60"
                          value={reportDetails[field]}
                          onChange={(e) =>
                            handleReportDetailChange(field, e.target.value)
                          }
                        />
                      )
                    ) : (
                      <span className="text-gray-800 text-sm font-medium min-w-[200px] text-right">
                        {reportDetails[field]?.trim() || "< >"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {isUpload ? (
              <div className="flex flex-col gap-6 justify-center m-auto">
                <Button
                  className="bg-blue-700 hover:bg-blue-800 text-white py-4 px-8 rounded-lg text-lg font-semibold transition shadow-lg"
                  onClick={() => navigate("/lineage")}
                >
                  🔍 View ETL Lineage Flow
                </Button>
                <Button
                  onClick={handlePreviewData}
                  className="bg-blue-700 hover:bg-blue-800 text-white py-4 px-8 rounded-lg text-lg font-semibold transition shadow-lg"
                >
                  📄 View ETL Detailed Info
                </Button>
                <PreviewModal
                  open={showPreview}
                  onClose={() => setShowPreview(false)}
                  previewData={previewData}
                />
              </div>
            ) : (
              <div
                className={`m-auto w-full max-w-xl border-2 border-dashed p-10 rounded-2xl text-center bg-white/20 hover:shadow-2xl transition cursor-pointer ${
                  isDragging
                    ? "border-blue-600 bg-blue-100"
                    : "border-transparent"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-blue-700 mx-auto mb-2" />
                <p className="text-lg font-semibold text-blue-800">
                  {loading ? "Uploading..." : "Upload Your Report"}
                </p>
                <p className="text-sm text-gray-700">
                  Drag & drop your file here or click to browse
                </p>
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
