// backend/app/routes/Reader.route.js

const express = require('express');
const router = express.Router();
const readerController = require('../controllers/Reader.controller');
const auth = require('../middlewares/auth'); // 1. Import Middleware

// --- PHẦN PUBLIC (Không cần đăng nhập) ---

// Đăng nhập
router.post('/login', readerController.login);

// Đăng ký (Tạo độc giả mới) -> PHẢI PUBLIC để khách còn đăng ký được
router.post('/', readerController.createReader);

// --- PHẦN PROTECTED (Cần đăng nhập) ---
router.use(auth.protect); // Các route bên dưới yêu cầu phải có Token

// Lấy tất cả độc giả: Chỉ Admin hoặc Thủ thư mới được xem danh sách này
// (Không để độc giả thường xem danh sách của nhau)
router.get('/', auth.restrictTo('Admin', 'Thủ thư'), readerController.getAllReaders);

// Lấy chi tiết & Cập nhật
// (Độc giả có Token thì xem/sửa được. Lưu ý: Logic chặn sửa người khác nằm ở Controller)
router.route('/:id')
    .get(readerController.getReaderById)
    .put(readerController.updateReader);

module.exports = router;