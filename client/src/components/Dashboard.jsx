import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import API from "@/services/API";
import PreviewModal from "./PreviewModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isUpload, setIsUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const keyDetails = [
    "Client Name",
    "Assessment Start Date",
    "Assessment End Date",
    "ETL Platform",
    "ETL Data Platform Owner",
    "Documents SharePoint Link",
  ];

  useEffect(() => {
    const uploadStatus = localStorage.getItem("isUpload");
    if (uploadStatus === "true") {
      setIsUpload(true);
    }
  }, []);

  const handleUpload = async (file) => {
    try {
      setLoading(true);
      setError("");
      const response = await API.post.upload(file);
      console.log("Upload Success:", response);
      setData(response);
      localStorage.setItem("etlData", JSON.stringify(response));
      console.log("etlData", localStorage.getItem("etlData"));
      setIsUpload(true);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
      setIsDragging(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handlePreviewData = async () => {
    try {
      const apiResponse = await API.get.preview();
      console.log("Preview Data:", apiResponse?.data);
      setPreviewData(apiResponse?.data);
      setShowPreview(true);
    } catch (error) {
      console.error("Error fetching preview data:", error);
    }
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      handleUpload(files[0]);
    }
    localStorage.setItem("isUpload", "true");
  };

  return (
    <div className="h-full font-sans bg-white text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <img
            src="https://images.miraclesoft.com/miracle-logo-dark.svg"
            alt="Miracle Logo"
            className="h-8 w-auto"
          />
          <h1 className="text-lg md:text-xl font-semibold text-center flex-1">
            Customer Name ETL Assessment Report
          </h1>
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
          <div className="text-center lg:text-left text-4xl md:text-5xl font-extrabold text-gray-800">
            &lt;CUSTOMER LOGO&gt;
          </div>
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

          {isUpload ? (
            <div className="flex flex-col gap-6 items-start justify-center lg:pl-8">
              <Button
                className="bg-blue-700 hover:bg-blue-800 transition-all duration-200 text-white rounded-lg py-4 px-8 text-lg font-medium shadow-md"
                onClick={() => navigate("/lineage")}
              >
                🔍 View ETL Lineage Flow
              </Button>

              <Button
                onClick={() => handlePreviewData()}
                className="bg-blue-700 hover:bg-blue-800 transition-all duration-200 text-white rounded-lg py-4 px-8 text-lg font-medium shadow-md"
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
              className={`w-full h-fit m-auto max-w-xl mx-auto rounded-2xl border-2 border-dashed transition-all duration-300 p-10 backdrop-blur-sm bg-white/10 shadow-xl hover:shadow-2xl cursor-pointer ${
                isDragging
                  ? "bg-blue-100 border-blue-600"
                  : "border-transparent"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="w-12 h-12 text-blue-700 mb-2 animate-none" />
                <p className="text-xl font-semibold text-blue-800">
                  {loading ? "Uploading..." : "Upload Your Report"}
                </p>
                <p className="text-sm font-semibold text-gray-600">
                  Drag & drop your file here or click to browse
                </p>
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              </div>
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
  );
}
