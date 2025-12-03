// backend/app/routes/Book.route.js

const express = require("express");
const router = express.Router();
const bookController = require("../controllers/Book.controller"); // Import controller mới
const authMiddleware = require("../middlewares/auth"); 

// ----------------------------------------------------
// A. ROUTES PUBLIC / SEMI-PUBLIC
// ----------------------------------------------------

// GET /api/books (Danh sách sách hiển thị cho khách)
router.get(
  "/",
  authMiddleware.optionalProtect, 
  bookController.getAllBooks
);

// GET /api/books/admin (Danh sách đầy đủ cho Admin)
router.get(
    "/admin", // Đổi 'all' thành 'admin' cho rõ nghĩa
    authMiddleware.protect, 
    // authMiddleware.restrictTo('Admin'), // Bật lại khi cần
    bookController.getAllBooksAdmin
);

// GET /api/books/:id (Chi tiết sách)
router.get(
  "/:id",
  authMiddleware.optionalProtect, 
  bookController.getBookById
);

// ----------------------------------------------------
// B. ROUTES ADMIN (PROTECTED)
// ----------------------------------------------------

// POST /api/books (Tạo sách mới)
router.post(
    "/",
    authMiddleware.protect,
    authMiddleware.restrictTo("Admin"), // Chỉ Admin tạo được
    bookController.createBook
);

// PUT/DELETE /api/books/:id (Cập nhật/Xóa)
router.route("/:id")
  .put(
    authMiddleware.protect,
    authMiddleware.restrictTo("Admin"),
    bookController.updateBook
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo("Admin"),
    bookController.deleteBook
  );

module.exports = router;