const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const NhanVienSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      alias: "MSNV",
    },
    HoTenNV: {
      type: String,
      required: [true, "Họ tên nhân viên không được để trống."],
      trim: true,
    },
    Password: {
      type: String,
      required: [true, "Mật khẩu không được để trống."],
      select: false, // KHÔNG LẤY trường này theo mặc định khi dùng find()
    },
    Chucvu: {
      type: String,
      required: [true, "Chức vụ không được để trống."],
    },
    Diachi: {
      type: String,
    },
    SoDienThoai: {
      type: String,
      unique: true,
    },
  },
  {
    versionKey: false,
    collection: "NhanVien",
  }
);

// 🧠 Middleware: Tự động hash mật khẩu trước khi lưu
NhanVienSchema.pre("save", async function (next) {
  // Nếu mật khẩu chưa thay đổi → bỏ qua
  if (!this.isModified("Password")) return next();

  try {
    // Hash mật khẩu (số vòng salt = 10 là đủ bảo mật)
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🧩 Hàm so sánh mật khẩu khi đăng nhập
NhanVienSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};

module.exports = mongoose.model("NhanVien", NhanVienSchema);
