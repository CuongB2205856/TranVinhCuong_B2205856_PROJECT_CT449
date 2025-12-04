// backend/app/routes/Publisher.route.js

const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/Publisher.controller');

// Lấy tất cả & Thêm mới
router.route('/')
    .get(publisherController.getAllPublishers)
    .post(publisherController.createPublisher);

// Lấy chi tiết, Cập nhật, Xóa
router.route('/:id')
    .get(publisherController.getPublisherById)
    .put(publisherController.updatePublisher)
    .delete(publisherController.deletePublisher);

module.exports = router;