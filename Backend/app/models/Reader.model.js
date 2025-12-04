// backend/app/models/Reader.model.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ReaderSchema = new mongoose.Schema(
  {
    // --- PHẦN LIÊN QUAN CSDL (GIỮ NGUYÊN) ---
    _id: {
      type: String,
      alias: "MaDocGia", // Alias để code có thể gọi reader.MaDocGia
    },
    HoLot: {
      type: String,
      required: [true, "Họ lót không được để trống."],
    },
    Ten: {
      type: String,
      required: [true, "Tên không được để trống."],
    },
    NgaySinh: {
      type: Date,
    },
    Phai: {
      type: String,
      enum: ["Nam", "Nữ", "Khác"], // Enum giữ nguyên nếu DB lưu tiếng Việt
    },
    DiaChi: {
      type: String,
    },
    DienThoai: {
      type: String,
      required: [true, "Số điện thoại không được để trống."],
      unique: true,
      match: [/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, "Số điện thoại không hợp lệ."],
    },
    Password: {
      type: String,
      required: [true, "Mật khẩu không được để trống."],
      select: false,
    },
    HinhAnh: {
      type: String,
      default: "",
    },
  },
  {
    versionKey: false,
    collection: "Docgia", // ⚠️ QUAN TRỌNG: Phải trỏ đúng collection cũ trong DB
  }
);

// --- PHẦN LOGIC NODEJS (ĐỔI TÊN BIẾN) ---

// Middleware hash password
ReaderSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Hàm so sánh password
ReaderSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};

// Export với tên Model là "Reader" nhưng map vào collection "Docgia"
module.exports = mongoose.model("Reader", ReaderSchema);
