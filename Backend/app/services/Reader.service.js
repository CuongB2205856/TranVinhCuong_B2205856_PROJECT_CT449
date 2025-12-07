// backend/app/services/Reader.service.js

const Reader = require("../models/Reader.model");
const jwt = require("jsonwebtoken");
const config = require("../config");

const signToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// --- [THÊM MỚI] Hàm tạo mã độc giả tự động ---
const generateReaderId = () => {
  // Logic: DG + timestamp (lấy 6 số cuối) + 2 số ngẫu nhiên -> Đảm bảo duy nhất
  const uniqueSuffix = Date.now().toString().slice(-6) + Math.floor(Math.random() * 99).toString().padStart(2, '0');
  return `DG${uniqueSuffix}`;
};
// ---------------------------------------------

class ReaderService {
  // [CREATE] Create new reader
  async createReader(data) {
    try {
      // --- [SỬA LỖI TẠI ĐÂY] ---
      // Nếu dữ liệu chưa có _id, hãy tự động tạo
      if (!data._id) {
        data._id = generateReaderId();
      }
      // ------------------------

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
    const reader = await Reader.findById(id);

    if (!reader) {
      const error = new Error(`Update failed: Reader not found with ID ${id}`);
      error.statusCode = 404;
      throw error;
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== '_id') {
        reader[key] = updateData[key];
      }
    });

    const updatedReader = await reader.save();
    return updatedReader;
  }

  // [AUTH] Login
  async checkLogin(phone, password) {
    const reader = await Reader.findOne({ DienThoai: phone }).select("+Password");

    if (!reader || !reader.Password) {
      throw Object.assign(
        new Error("Incorrect phone number or password."),
        { statusCode: 401 }
      );
    }

    const isMatch = await reader.comparePassword(password);

    if (!isMatch) {
      throw Object.assign(
        new Error("Incorrect phone number or password."),
        { statusCode: 401 }
      );
    }

    const token = signToken(reader._id);
    reader.Password = undefined;

    return { user: reader, token };
  }
}

module.exports = new ReaderService();