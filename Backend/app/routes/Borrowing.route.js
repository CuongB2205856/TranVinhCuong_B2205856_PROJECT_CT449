// backend/app/routes/Borrowing.route.js

const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/Borrowing.controller'); // Import controller mới
const authMiddleware = require('../middlewares/auth');

// Lấy danh sách đang mượn (Bổ sung thêm route GET này vì controller đã có hàm getActiveBorrowings)
router.get('/', 
    authMiddleware.protect,
    borrowingController.getActiveBorrowings
);

// Tạo phiếu mượn
router.post('/', 
    authMiddleware.protect, 
    borrowingController.createBorrowing
);

// Trả sách
// Đổi URL từ '/tra/:id' sang '/return/:id' cho đồng bộ tiếng Anh
router.put('/return/:id', 
    authMiddleware.protect, 
    borrowingController.returnBook
);

module.exports = router;