// backend/app/routes/Docgia.route.js

const express = require('express');
const router = express.Router();
const docgiaController = require('../controllers/Docgia.controller');

// Lấy tất cả độc giả và Đăng ký độc giả mới
router.route('/')
    .get(docgiaController.getAllDocgia)
    .post(docgiaController.createDocgia);

// Lấy độc giả theo ID và Cập nhật
router.route('/:id')
    .get(docgiaController.getDocgiaById)
    .put(docgiaController.updateDocgia);

module.exports = router;