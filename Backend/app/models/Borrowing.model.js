// backend/app/models/Borrowing.model.js

const mongoose = require("mongoose");

const BorrowingSchema = new mongoose.Schema(
  {
    // --- PHẦN LIÊN QUAN CSDL (GIỮ NGUYÊN) ---
    MaDocGia: {
      type: String,
      // ⚠️ LƯU Ý: ref phải trỏ đến tên MODEL mới (Reader) chứ không phải tên Collection cũ
      ref: "Reader", 
      required: true
    },
    MaSach: {
      type: String,
      // ⚠️ LƯU Ý: ref trỏ đến Model "Book"
      ref: "Book", 
      required: true
    },
    NgayMuon: {
      type: Date,
      required: true,
      default: Date.now,
    },
    NgayTra: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    collection: "TheoDoiMuonSach", // ⚠️ Collection cũ
  }
);

module.exports = mongoose.model("Borrowing", BorrowingSchema);