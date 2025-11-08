// backend/app.js

const express = require('express');
const cors = require('cors');

// --- 1. Import Middleware Xử lý Lỗi ---
// Tên file là error.js, nằm trong thư mục app/middleware
const { notFound, errorHandler } = require('./app/middlewares/error'); 

// --- 2. Import tất cả 5 Routes ---
// Các file routes nằm trong thư mục app/routes
const docgiaRoutes = require('./app/routes/Docgia.route'); 
const nhanvienRoutes = require('./app/routes/Nhanvien.route');
const nxbRoutes = require('./app/routes/Nhaxuatban.route');
const sachRoutes = require('./app/routes/Sach.route');
const muonsachRoutes = require('./app/routes/Theodoimuonsach.route');


const app = express();

// Middleware cơ bản
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Endpoint mặc định
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Library Management API." });
});

// --- 3. Tích Hợp 5 Routes vào Base Path ---
// Tất cả các endpoint sẽ bắt đầu bằng /api/...
app.use('/api/docgia', docgiaRoutes);
app.use('/api/nhanvien', nhanvienRoutes); // Có thể dùng /api/auth cho login
app.use('/api/nxb', nxbRoutes);
app.use('/api/sach', sachRoutes); 
app.use('/api/muonsach', muonsachRoutes); // Route dành cho xác thực (login)

// --- 4. Middleware Xử lý Lỗi (Phải đặt cuối cùng) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;