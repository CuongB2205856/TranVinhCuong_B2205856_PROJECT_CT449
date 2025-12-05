// backend/app/config/index.js
const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/QL_Muon_Sach",
  },
  // --- THÊM PHẦN NÀY ĐỂ ĐỌC TỪ .ENV ---
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "30m", // Mặc định là 30 phút nếu .env lỗi
  },
};

module.exports = config;