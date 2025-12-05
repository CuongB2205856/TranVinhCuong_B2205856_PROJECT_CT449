// src/services/api.service.js
import axios from "axios";
import router from "@/routers"; // Import router để thực hiện chuyển hướng

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: Gắn Token vào Header (Giữ nguyên code cũ của bạn)
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

// 2. Response Interceptor: Xử lý phản hồi và lỗi (THÊM MỚI PHẦN NÀY)
api.interceptors.response.use(
  (response) => {
    // Nếu API trả về thành công, trả về dữ liệu bình thường
    return response;
  },
  (error) => {
    // Kiểm tra nếu có phản hồi lỗi và mã lỗi là 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      
      // Lấy URL của request gây ra lỗi
      const originalRequestUrl = error.config.url;

      // ⚠️ QUAN TRỌNG: Loại trừ trường hợp đang cố gắng Đăng nhập
      // Nếu user nhập sai mật khẩu, server cũng trả về 401. 
      // Ta không muốn logout hay alert "Hết hạn" trong trường hợp đó.
      if (!originalRequestUrl.includes('/login')) {
        
        // Chỉ xử lý nếu trong localStorage đang có token (tức là user đang đăng nhập)
        if (localStorage.getItem("token")) {
            // 1. Xóa thông tin user trong LocalStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // 2. Hiển thị thông báo cho người dùng
            alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

            // 3. Chuyển hướng về trang đăng nhập
            // Kiểm tra xem user đang ở trang Admin hay Client để redirect đúng chỗ
            if (window.location.pathname.startsWith('/admin')) {
                router.push('/admin/login');
            } else {
                router.push('/login');
            }
        }
      }
    }
    
    // Trả lỗi về để các component vẫn có thể catch nếu cần (ví dụ hiển thị lỗi form)
    return Promise.reject(error);
  }
);

export default api;