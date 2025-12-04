// backend/app/routes/Borrowing.route.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/Borrowing.controller');
const auth = require('../middlewares/auth');

router.use(auth.protect);

// Route cho Admin lấy toàn bộ (Giữ nguyên)
router.get('/', auth.restrictTo('Admin', 'Thủ thư'), controller.getAllBorrowings);

// Route cho Độc giả xem lịch sử của mình (Thêm mới)
// Lưu ý: Đặt route này TRƯỚC các route có tham số :id để tránh nhầm lẫn
router.get('/my-history', controller.getMyBorrowings); 

router.post('/', controller.createBorrowing);
router.put('/approve/:id', auth.restrictTo('Admin'), controller.approveBorrowing);
router.put('/reject/:id', auth.restrictTo('Admin'), controller.rejectBorrowing); // Thêm route từ chối
router.put('/return/:id', auth.restrictTo('Admin'), controller.returnBook);

module.exports = router;