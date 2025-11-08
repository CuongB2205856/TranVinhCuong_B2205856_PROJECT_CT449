// backend/app/routes/Sach.route.js

const express = require('express');
const router = express.Router();
const sachController = require('../controllers/Sach.controller'); // Import Controller
const authMiddleware = require('../middlewares/auth'); // Middleware xác thực

router.get('/',
    authMiddleware.optionalProtect, // Sử dụng middleware tùy chọn
    sachController.getAllSach); // Lấy tất cả sách
router.get('/:id',
    authMiddleware.optionalProtect, // Sử dụng middleware tùy chọn
    sachController.getSachById); // Lấy sách theo ID
router.use(
    authMiddleware.protect // Bắt buộc đăng nhập cho các route dưới
);
// Lấy tất cả sách và Thêm sách mới
router.route('/:id')
    .put(authMiddleware.restrictTo('Thủ thư'), sachController.updateSach) 
    .delete(authMiddleware.restrictTo('Quản lý'), sachController.deleteSach);

router.post('/', authMiddleware.restrictTo('Thủ thư'), sachController.createSach);

module.exports = router;