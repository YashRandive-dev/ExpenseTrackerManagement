import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { Accept: "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      // token expired / invalid -> force re-login
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") window.location.href = "/login";
    } else if (error.code === "ECONNABORTED") {
      error.message = "Request timed out. Please try again.";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
