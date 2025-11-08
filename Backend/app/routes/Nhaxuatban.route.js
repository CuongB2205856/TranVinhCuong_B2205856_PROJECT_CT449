// backend/app/routes/Nhaxuatban.route.js

const express = require('express');
const router = express.Router();
const nxbController = require('../controllers/Nhaxuatban.controller');

// Lấy tất cả NXB và Thêm NXB mới
router.route('/')
    .get(nxbController.getAllNXB)
    .post(nxbController.createNXB);

// Xóa NXB theo ID
router.delete('/:id', nxbController.deleteNXB);

module.exports = router;