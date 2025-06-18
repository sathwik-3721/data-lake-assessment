import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

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