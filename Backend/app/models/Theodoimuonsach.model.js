// backend/app/models/Theodoimuonsach.model.js

const mongoose = require("mongoose");

const TheoDoiMuonSachSchema = new mongoose.Schema(
  {
    // Tham chiếu đến Docgia Model (Populate)
    MaDocGia: {
      type: String,
      ref: "Docgia", // Tên Model để Populate
    },
    // Tham chiếu đến Sach Model (Populate)
    MaSach: {
      type: String,
      required: [true, "Mã sách không được để trống."],
      ref: "Sach", // Tên Model để Populate
    },
    NgayMuon: {
      type: Date,
      required: true,
      default: Date.now,
    },
    NgayTra: {
      type: Date,
      default: null,
      validate: {
        validator: function (value) {
          // Ngày trả phải lớn hơn hoặc bằng ngày mượn
          return value === null || value >= this.NgayMuon;
        },
      },
    },
  },
  {
    versionKey: false,
    collection: "TheoDoiMuonSach",
  }
);

module.exports = mongoose.model("TheoDoiMuonSach", TheoDoiMuonSachSchema); // Tên Model là 'TheoDoiMuonSach'
