// backend/app/routes/Book.route.js
const express = require("express");
const router = express.Router();
const bookController = require("../controllers/Book.controller");
const auth = require("../middlewares/auth");

// 1. Route Public (Lấy danh sách cho khách)
router.get("/", auth.optionalProtect, bookController.getAllBooks);

// ⚠️ QUAN TRỌNG: Route Admin PHẢI nằm TRÊN route lấy chi tiết (/:id)
// Nếu để dưới, code sẽ chạy vào /:id và báo lỗi CastError (500)
router.get("/admin", auth.protect, bookController.getAllBooksAdmin);

// 2. Route Chi tiết (Lấy 1 sách theo ID)
// Cái này phải nằm cuối cùng trong nhóm GET
router.get("/:id", auth.optionalProtect, bookController.getBookById);

// 3. Các route Tạo/Sửa/Xóa (Dành cho Admin)
router.post("/", auth.protect, bookController.createBook);
router.put("/:id", auth.protect, bookController.updateBook);
router.delete("/:id", auth.protect, bookController.deleteBook);

module.exports = router;
