// src/services/api.service.js
import axios from "axios";

// Tạo một instance của Axios
const api = axios.create({
  // Backend đang chạy ở cổng 3000. Nếu bạn dùng Vite Proxy, baseURL có thể là '/api'.
  // Nếu không dùng Proxy, phải là:
  baseURL: "http://localhost:3000", // Hoặc 3001, tùy theo backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn token vào headers nếu có (Giữ nguyên logic Interceptor)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ... (logic interceptors response khác)

// ⚠️ ĐÂY LÀ DÒNG QUAN TRỌNG NHẤT: Export Default là instance API
export default api;