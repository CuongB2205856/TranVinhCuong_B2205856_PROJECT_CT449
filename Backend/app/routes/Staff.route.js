// backend/app/routes/Staff.route.js

const express = require('express');
const router = express.Router();
const staffController = require('../controllers/Staff.controller'); // Import controller mới
// const authMiddleware = require('../middlewares/auth'); 

// Đăng nhập nhân viên
router.post('/login', staffController.login);

// Quản lý Nhân viên
router.route('/')
    .get(staffController.getAllStaff)   // Lấy danh sách NV
    .post(staffController.createStaff); // Thêm NV mới

module.exports = router;