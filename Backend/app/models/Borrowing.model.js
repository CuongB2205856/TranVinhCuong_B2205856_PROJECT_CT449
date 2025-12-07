// backend/app/models/Borrowing.model.js
const mongoose = require("mongoose");

const BorrowingSchema = new mongoose.Schema(
  {
    MaDocGia: {
      type: String,
      ref: "Reader",
      required: true,
    },
    MaSach: {
      type: String,
      ref: "Book",
      required: true,
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
    TrangThai: {
      type: String,
      // [THÊM] 'da_huy' vào danh sách
      enum: ["cho_xac_nhan", "dang_muon", "da_tra", "da_tu_choi", "da_huy"],
      default: "cho_xac_nhan",
    },
  },
  { versionKey: false, collection: "TheoDoiMuonSach" }
);

module.exports = mongoose.model("Borrowing", BorrowingSchema);
