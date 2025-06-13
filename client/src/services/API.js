import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/v1", 
})

export default {
  post: {
    upload: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response from upload:", response?.data);
      return response?.data;
    },
  },
  get: {
    preview: async () => {
      const response = await apiClient.get("/api/preview");
      console.log("Preview response:", response?.data);
      return response?.data;
    },
  },
};