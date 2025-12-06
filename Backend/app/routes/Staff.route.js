// backend/app/routes/Staff.route.js
const express = require("express");
const router = express.Router();
const staffController = require("../controllers/Staff.controller");
const auth = require("../middlewares/auth");

router.post("/login", staffController.login);

router.get(
  "/stats",
  auth.protect,
  auth.restrictTo("Admin", "Thủ thư"),
  staffController.getStats
);

// --- THÊM MỚI ROUTE PROFILE ---
// Đặt trước route / (getAllStaff) để tránh nhầm lẫn
router.get("/profile", auth.protect, staffController.getProfile);
router.put("/profile", auth.protect, staffController.updateProfile);

router
  .route("/")
  .get(auth.protect, auth.restrictTo("Admin"), staffController.getAllStaff)
  .post(auth.protect, auth.restrictTo("Admin"), staffController.createStaff);

module.exports = router;
