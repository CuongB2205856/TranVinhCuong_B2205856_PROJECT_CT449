// backend/app/routes/Nhanvien.route.js

const express = require('express');
const router = express.Router();
const nhanvienController = require('../controllers/Nhanvien.controller');
// const authMiddleware = require('../middleware/auth'); // Middleware xác thực/phân quyền (nếu có)

// Quản lý Nhân viên (Cần thêm middleware kiểm tra quyền sau)
router.route('/')
    .get(nhanvienController.getAllNhanVien) // Lấy danh sách NV
    .post(nhanvienController.createNhanVien); // Thêm NV mới

module.exports = router;