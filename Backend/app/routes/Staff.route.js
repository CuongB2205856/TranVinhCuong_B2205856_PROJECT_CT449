// backend/app/routes/Staff.route.js
const express = require("express");
const router = express.Router();
const staffController = require("../controllers/Staff.controller");
const auth = require("../middlewares/auth");

// ... (Các route login, stats, profile giữ nguyên) ...

router.post("/login", staffController.login);
router.get("/stats", auth.protect, auth.restrictTo("Admin", "Thủ thư"), staffController.getStats);
router.get("/profile", auth.protect, staffController.getProfile);
router.put("/profile", auth.protect, staffController.updateProfile);

// Route quản lý nhân viên (Chỉ Admin)
router
  .route("/")
  .get(auth.protect, auth.restrictTo("Admin"), staffController.getAllStaff)
  .post(auth.protect, auth.restrictTo("Admin"), staffController.createStaff);

// --- THÊM MỚI: Route Update cho Admin ---
router.put(
    "/:id", 
    auth.protect, 
    auth.restrictTo("Admin"), 
    staffController.updateStaffByAdmin
);

module.exports = router;