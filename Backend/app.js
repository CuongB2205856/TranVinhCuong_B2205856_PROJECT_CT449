// backend/app.js

const express = require('express');
const cors = require('cors');

// --- 1. Import Middleware Xử lý Lỗi ---
// Đảm bảo file error.js nằm đúng đường dẫn này
const { notFound, errorHandler } = require('./app/middlewares/error'); 

// --- 2. Import Routes (Tên file tiếng Anh mới) ---
const readerRouter = require('./app/routes/Reader.route');       // Cũ: Docgia
const bookRouter = require('./app/routes/Book.route');           // Cũ: Sach
const publisherRouter = require('./app/routes/Publisher.route'); // Cũ: Nhaxuatban
const staffRouter = require('./app/routes/Staff.route');         // Cũ: Nhanvien
const borrowingRouter = require('./app/routes/Borrowing.route'); // Cũ: Theodoimuonsach

const app = express();

// --- Middleware cơ bản ---
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- Endpoint kiểm tra sức khỏe server ---
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Library Management API (Standardized)." });
});

// --- 3. Tích Hợp Routes (Endpoint tiếng Anh) ---
app.use('/api/readers', readerRouter);       // Quản lý độc giả
app.use('/api/books', bookRouter);           // Quản lý sách
app.use('/api/publishers', publisherRouter); // Quản lý NXB
app.use('/api/staffs', staffRouter);         // Quản lý nhân viên
app.use('/api/borrowings', borrowingRouter); // Quản lý mượn trả

// --- 4. Middleware Xử lý Lỗi (Phải đặt cuối cùng) ---
// Nếu user gọi vào route không tồn tại -> notFound -> errorHandler
app.use(notFound);
app.use(errorHandler);

module.exports = app;