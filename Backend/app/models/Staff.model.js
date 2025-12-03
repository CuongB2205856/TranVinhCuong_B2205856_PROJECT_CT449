// backend/app/models/Staff.model.js

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema(
  {
    // --- PHẦN LIÊN QUAN CSDL (GIỮ NGUYÊN) ---
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
      select: false,
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
    collection: "NhanVien", // ⚠️ Collection cũ
  }
);

// --- LOGIC NODEJS ---
StaffSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

StaffSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};

module.exports = mongoose.model("Staff", StaffSchema);