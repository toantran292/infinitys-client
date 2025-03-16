import axios from "axios";
import { config } from "@/common/config";
import { getErrorMessage } from "@/common/error";
export const API_BASE = config.apiBaseUrl || "http://localhost:20250";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
    }
    const message = getErrorMessage(error);
    return Promise.reject(message);
  }
);

export default axiosInstance;
