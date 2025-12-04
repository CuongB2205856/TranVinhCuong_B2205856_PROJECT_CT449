// backend/app/routes/Staff.route.js
const express = require('express');
const router = express.Router();
const staffController = require('../controllers/Staff.controller');
// const auth = require('../middlewares/auth'); // Nếu bạn muốn bảo vệ route này

router.post('/login', staffController.login);

// Thêm route thống kê (Đặt trước route /:id nếu có)
router.get('/stats', staffController.getStats); 

router.route('/')
    .get(staffController.getAllStaff)
    .post(staffController.createStaff);

module.exports = router;