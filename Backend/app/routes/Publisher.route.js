// backend/app/routes/Publisher.route.js

const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/Publisher.controller'); // Import controller mới

// Lấy tất cả & Thêm NXB mới
router.route('/')
    .get(publisherController.getAllPublishers)
    .post(publisherController.createPublisher);

// Xóa NXB
router.delete('/:id', publisherController.deletePublisher);

module.exports = router;