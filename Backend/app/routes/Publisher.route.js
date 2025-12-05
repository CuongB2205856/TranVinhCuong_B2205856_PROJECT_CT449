// backend/app/routes/Publisher.route.js

const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/Publisher.controller');

// 1. Import Middleware xác thực
const auth = require('../middlewares/auth'); 

// 2. Bảo vệ tất cả các route bên dưới (Phải đăng nhập mới được đi tiếp)
router.use(auth.protect);

// 3. Phân quyền: Chỉ Admin mới được thao tác (Tùy chọn, nhưng nên có)
router.use(auth.restrictTo('Admin')); 

router.route('/')
    .get(publisherController.getAllPublishers)
    .post(publisherController.createPublisher);

router.route('/:id')
    .get(publisherController.getPublisherById)
    .put(publisherController.updatePublisher)
    .delete(publisherController.deletePublisher);

module.exports = router;