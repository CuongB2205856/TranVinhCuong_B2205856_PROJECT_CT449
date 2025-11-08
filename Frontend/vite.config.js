// frontend/vite.config.js
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Tên Server Backend của bạn:
const BACKEND_URL = "http://localhost:3000";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  // [CẤU HÌNH PROXY MỚI]
  server: {
    port: 8080, // Cổng Frontend (chạy trên 8080)
    proxy: {
      // Bất kỳ yêu cầu nào bắt đầu bằng /api đều được chuyển tiếp đến Backend
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // Chỉ cần nếu backend không có /api
      },
    },
  },
});
