// backend/app/routes/Staff.route.js
const express = require('express');
const router = express.Router();
const staffController = require('../controllers/Staff.controller');
const auth = require('../middlewares/auth'); // Import auth

// Route Login thì để public (ai cũng cần đăng nhập)
router.post('/login', staffController.login);

// --- CÁC ROUTE BÊN DƯỚI CẦN BẢO VỆ ---

// Xem thống kê: Chỉ Admin hoặc Thủ thư
router.get('/stats', 
    auth.protect, 
    auth.restrictTo('Admin', 'Thủ thư'), 
    staffController.getStats
); 

// Quản lý nhân viên: Chỉ Admin mới được xem và tạo nhân viên mới
router.route('/')
    .get(auth.protect, auth.restrictTo('Admin'), staffController.getAllStaff)
    .post(auth.protect, auth.restrictTo('Admin'), staffController.createStaff);

module.exports = router;