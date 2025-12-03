// backend/app/routes/Reader.route.js

const express = require('express');
const router = express.Router();
const readerController = require('../controllers/Reader.controller'); // Import controller mới

// Đăng nhập
router.post('/login', readerController.login);

// Lấy tất cả độc giả & Đăng ký độc giả mới
router.route('/')
    .get(readerController.getAllReaders)
    .post(readerController.createReader);

// Lấy chi tiết & Cập nhật độc giả
router.route('/:id')
    .get(readerController.getReaderById)
    .put(readerController.updateReader);

module.exports = router;