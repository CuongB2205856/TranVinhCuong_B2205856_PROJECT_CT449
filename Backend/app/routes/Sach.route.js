// backend/app/routes/Sach.route.js (ĐÃ SỬA VÀ TỐI ƯU)

const express = require("express");
const router = express.Router();
const sachController = require("../controllers/Sach.controller"); 
const authMiddleware = require("../middlewares/auth"); 

// ----------------------------------------------------
// A. ROUTES CÔNG KHAI VÀ CRUD CHUNG
// ----------------------------------------------------

// GET /api/sach (Danh sách sách còn hàng)
router.get(
  "/",
  authMiddleware.optionalProtect, 
  sachController.getAllSach
);
router.get(
    "/all", // ✅ Tên route con TÁCH BIỆT
    authMiddleware.protect, // Bắt buộc đăng nhập
    //authMiddleware.restrictTo('Admin'), // Sửa quyền Admin
    sachController.getAllSachAdmin
);
// GET /api/sach/:id (Chi tiết sách)
router.get(
  "/:id",
  authMiddleware.optionalProtect, 
  sachController.getSachById
);


// ----------------------------------------------------
// B. ROUTES ADMIN (BẢO VỆ & LẤY TẤT CẢ)
// ----------------------------------------------------

// 1. GET /api/sach/all (Lấy TẤT CẢ sách cho Admin)


// 2. POST /api/sach (Tạo sách mới)
router.post(
    "/",
    authMiddleware.protect,
    authMiddleware.restrictTo("Admin"), // Chỉ Admin tạo được
    sachController.createSach
);

// 3. PUT/DELETE /api/sach/:id (Cập nhật/Xóa)
router.route("/:id")
  // PUT /api/sach/:id: Cập nhật sách
  .put(
    authMiddleware.protect,
    authMiddleware.restrictTo("Admin"),
    sachController.updateSach
  )
  // DELETE /api/sach/:id: Xóa sách
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo("Admin"),
    sachController.deleteSach
  );

module.exports = router;