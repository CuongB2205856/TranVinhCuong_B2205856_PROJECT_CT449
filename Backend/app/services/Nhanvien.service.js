// backend/app/services/Nhanvien.Service.js

const NhanVienModel = require("../models/Nhanvien.model");

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

    if (!nhanVien) {
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

    // 3. Trả về thông tin nhân viên
    nhanVien.Password = undefined;
    return nhanVien;
  }
}

module.exports = new NhanVienService();
