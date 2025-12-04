// backend/app/services/Reader.service.js

const Reader = require("../models/Reader.model"); // Import Model mới
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// Helper tạo Token
const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

class ReaderService {
  // [CREATE] Create new reader
  async createReader(data) {
    try {
      // Mapping dữ liệu nếu cần thiết (ví dụ nếu frontend gửi keys tiếng Anh)
      // Giả sử Controller gửi đúng keys khớp Model hoặc mapping tại đây
      return await Reader.create(data);
    } catch (error) {
      if (error.name === "ValidationError" || error.code === 11000) {
        error.statusCode = 400;
      }
      throw error;
    }
  }

  // [READ] Get all readers (search by name)
  async getAllReaders(name) {
    const filter = {};
    if (name) {
      // ⚠️ Lưu ý: Query DB vẫn dùng trường 'Ten' của dữ liệu cũ
      filter.Ten = { $regex: new RegExp(name), $options: "i" };
    }
    return Reader.find(filter);
  }

  // [READ] Get reader by ID
  async getReaderById(id) {
    const reader = await Reader.findById(id);
    if (!reader) {
      const error = new Error(`Reader not found with ID: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    return reader;
  }

  // [UPDATE] Update reader
  async updateReader(id, updateData) {
    // 1. Tìm bản ghi trước
    const reader = await Reader.findById(id);

    if (!reader) {
      const error = new Error(`Update failed: Reader not found with ID ${id}`);
      error.statusCode = 404;
      throw error;
    }

    // 2. Cập nhật từng trường dữ liệu
    Object.keys(updateData).forEach((key) => {
      // Bỏ qua _id để tránh lỗi
      if (key !== '_id') {
        reader[key] = updateData[key];
      }
    });

    // 3. Lưu lại -> Kích hoạt middleware pre('save') trong Model để hash password
    const updatedReader = await reader.save();

    return updatedReader;
  }
  // --------------------------------

  // [AUTH] Login
  async checkLogin(phone, password) {
    // 1. Tìm theo số điện thoại (DB field: DienThoai)
    const reader = await Reader.findOne({ DienThoai: phone }).select("+Password");

    if (!reader || !reader.Password) {
      throw Object.assign(
        new Error("Incorrect phone number or password."),
        { statusCode: 401 }
      );
    }

    // 2. So sánh mật khẩu
    const isMatch = await reader.comparePassword(password);

    if (!isMatch) {
      throw Object.assign(
        new Error("Incorrect phone number or password."),
        { statusCode: 401 }
      );
    }

    // 3. Tạo Token
    const token = signToken(reader._id);

    // Ẩn mật khẩu
    reader.Password = undefined;

    return { user: reader, token };
  }
}

module.exports = new ReaderService();