import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { TabsContent } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Upload, ImageIcon, LinkIcon, X, CheckCircle } from "lucide-react";
import API from "@/services/API";
import PreviewModal from "./PreviewModal";
import { toast } from "sonner";

export default function Dashboard({ setAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  const userData = JSON.parse(localStorage.getItem("userData"));
  const username = userData?.username || "User";

  const fileInputRef = useRef(null);
  const logoFileInputRef = useRef(null);

  const [isUpload, setIsUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLogoDragging, setIsLogoDragging] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoConfirmed, setLogoConfirmed] = useState(false);

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

  useEffect(() => {
    if (location.state?.loginSuccess) {
      toast(
        <div className="text-sm font-semibold text-green-600 font-sans">
          ✅ Login successful!
        </div>,
        { duration: 3000 }
      );
    }
  }, [location]);

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
      const preview =
        logoData.type === "url" ? logoData.data : logoData.preview;
      setCustomerLogo({ ...logoData, preview });
      if (logoData.type === "url") {
        setLogoUrl(logoData.data);
      }
    }
    const confirmed = localStorage.getItem("logoConfirmed") === "true";
    setLogoConfirmed(confirmed);
  }, []);

  const handleUpload = async (file) => {
    try {
      setLoading(true);
      setError("");
      const response = await API.post.upload(file);
      setData(response);
      localStorage.setItem("etlData", JSON.stringify(response));
      setIsUpload(true);
    } catch {
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
    if (files.length > 0) handleLogoUpload(files[0]);
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
          JSON.stringify({ ...logoData, data: null })
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
    setLogoLoaded(false);
    setLogoConfirmed(false); // ✅ reset flag
    localStorage.removeItem("customerLogo");
    localStorage.removeItem("logoConfirmed"); // ✅ clear flag
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

  const handlePreviewData = async () => {
    try {
      const apiResponse = await API.get.preview();
      setPreviewData(apiResponse?.data);
      setShowPreview(true);
    } catch (error) {
      console.error("Error fetching preview data:", error);
    }
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
      <header className="bg-white shadow border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <img
            src="https://images.miraclesoft.com/miracle-logo-dark.svg"
            alt="Miracle Logo"
            className="h-8"
          />

          <h1 className="text-lg sm:text-xl font-bold text-center flex-1">
            {reportDetails.clientName || "Customer Name"} ETL Assessment Report
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer h-9 w-9">
                <AvatarFallback className="bg-gray-200 text-gray-800 font-semibold">
                  {username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <div className="px-3 py-2 text-sm font-semibold text-miracle-darkBlue text-center">
                {username}
              </div>
              <DropdownMenuItem
                className="text-miracle-red font-semibold cursor-pointer hover:bg-miracle-red/20 transition-colors items-center justify-center"
                onClick={() => {
                  setAuthenticated(false);
                  localStorage.clear();
                  navigate("/login");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1">
        {/* Logo Upload Section */}
        <section className="bg-gray-50 py-6 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center min-h-[180px]">
            <div className="text-center lg:text-middle">
              {customerLogo.preview ? (
                <div className="relative inline-block">
                  <img
                    src={customerLogo.preview}
                    alt="Customer Logo"
                    className="max-h-32 max-w-full object-contain bg-white border"
                    onLoad={() => {
                      console.log(
                        "✅ Logo image loaded:",
                        customerLogo.preview
                      );
                      setLogoLoaded(true);
                    }}
                    onError={() => {
                      console.error(
                        "❌ Logo image failed:",
                        customerLogo.preview
                      );
                      handleRemoveLogo();
                    }}
                  />

                  {/* ❌ Remove button only if not confirmed */}
                  {!logoConfirmed && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute -top-2 -left-2 h-6 w-6 rounded-full p-0"
                      onClick={handleRemoveLogo}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}

                  {/* ✅ Tick mark only if logo is loaded and not confirmed */}
                  {logoLoaded && !logoConfirmed && (
                    <CheckCircle
                      className="absolute -bottom-2 -right-2 h-6 w-6 text-green-500 bg-white rounded-full shadow cursor-pointer"
                      onClick={() => {
                        setLogoConfirmed(true);
                        localStorage.setItem("logoConfirmed", "true"); // ✅ persist confirmation
                        console.log("✅ Logo confirmed.");
                      }}
                    />
                  )}
                </div>
              ) : (
                <Tabs
                  defaultValue="upload"
                  className="w-full max-w-md mx-auto lg:mx-0"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="upload"
                      className="flex items-center gap-2"
                    >
                      <ImageIcon className="h-4 w-4" /> Upload
                    </TabsTrigger>
                    <TabsTrigger
                      value="url"
                      className="flex items-center gap-2"
                    >
                      <LinkIcon className="h-4 w-4" /> URL
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
                        onKeyPress={(e) => e.key === "Enter" && handleLogoUrl()}
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

        {/* Details + Upload */}
        <section className="bg-gradient-to-br from-blue-200 via-blue-400 to-blue-600 py-4 px-4 md:px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
            <Card className="bg-white rounded-xl shadow-md p-7 space-y-6 flex flex-col">
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

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
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
