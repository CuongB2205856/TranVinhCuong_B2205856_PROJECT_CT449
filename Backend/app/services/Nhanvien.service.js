const NhanVienModel = require("../models/Nhanvien.model");
const jwt = require("jsonwebtoken"); // <--- CẦN THÊM IMPORT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// [THÊM] Hàm tạo JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};
class NhanVienService {
  // [CREATE] Thêm nhân viên mới
  async createNhanVien(nhanVienData) {
    try {
      return await NhanVienModel.create(nhanVienData);
    } catch (error) {
      if (error.name === "ValidationError" || error.code === 11000) {
        error.statusCode = 400;
      }
      throw error;
    }
  }

  // [READ] Lấy thông tin nhân viên (trừ mật khẩu)
  async getAllNhanVien() {
    // Trường Password đã được đặt select: false trong Model
    return NhanVienModel.find();
  }

  // [LOGIC XÁC THỰC] Kiểm tra đăng nhập
  async checkLogin(msnv, password) {
    // 1. Tìm nhân viên (bắt buộc phải lấy Password)
    const nhanVien = await NhanVienModel.findById(msnv).select("+Password");

    if (!nhanVien || !nhanVien.Password) {
      throw Object.assign(
        new Error("Mã số nhân viên hoặc mật khẩu không đúng."),
        { statusCode: 401 }
      );
    }

    // 2. GỌI PHƯƠNG THỨC CỦA MODEL để so sánh mật khẩu đã hash
    const isMatch = await nhanVien.comparePassword(password); // <-- SỬ DỤNG CHỨC NĂNG CỦA MODEL!

    if (!isMatch) {
      throw Object.assign(
        new Error("Mã số nhân viên hoặc mật khẩu không đúng."),
        { statusCode: 401 }
      );
    }
    const token = signToken(nhanVien._id); // Tạo token

    nhanVien.Password = undefined;
    // SỬA: Trả về user VÀ token
    return { user: nhanVien, token };
  }
}

module.exports = new NhanVienService();
