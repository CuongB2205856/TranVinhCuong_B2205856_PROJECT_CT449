// backend/app/services/Docgia.Service.js

const DocgiaModel = require("../models/Docgia.model"); // <-- Import Model mới
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

class DocgiaService {
  // [CREATE] Đăng ký độc giả mới
  async createDocgia(docgiaData) {
    try {
      return await DocgiaModel.create(docgiaData);
    } catch (error) {
      if (error.name === "ValidationError" || error.code === 11000) {
        error.statusCode = 400;
      }
      throw error;
    }
  }

  // [READ] Lấy danh sách độc giả (có thể tìm kiếm theo tên)
  async getAllDocgia(ten) {
    const filter = {};
    if (ten) {
      filter.Ten = { $regex: new RegExp(ten), $options: "i" };
    }
    return DocgiaModel.find(filter);
  }

  // [READ] Lấy thông tin độc giả theo Mã Độc Giả (ID)
  async getDocgiaById(id) {
    const docgia = await DocgiaModel.findById(id);
    if (!docgia) {
      const error = new Error(`Không tìm thấy độc giả có mã: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    return docgia;
  }

  // [UPDATE] Cập nhật thông tin độc giả
  async updateDocgia(id, updateData) {
    const updatedDocgia = await DocgiaModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDocgia) {
      const error = new Error(
        `Cập nhật thất bại: Không tìm thấy độc giả có mã ${id}`
      );
      error.statusCode = 404;
      throw error;
    }
    return updatedDocgia;
  }
  async checkLogin(dienThoai, password) {
    // 1. Tìm độc giả bằng Số điện thoại (sử dụng findOne vì DienThoai là unique)
    const docgia = await DocgiaModel.findOne({ DienThoai: dienThoai }).select(
      "+Password"
    );

    if (!docgia || !docgia.Password) {
      // Nếu không tìm thấy SĐT
      throw Object.assign(
        new Error("Số điện thoại hoặc mật khẩu không đúng."),
        { statusCode: 401 }
      );
    }

    // 2. So sánh mật khẩu (dùng phương thức của Model)
    const isMatch = await docgia.comparePassword(password);

    if (!isMatch) {
      // Nếu mật khẩu không khớp
      throw Object.assign(
        new Error("Số điện thoại hoặc mật khẩu không đúng."),
        { statusCode: 401 }
      );
    }

    // 3. Tạo JWT Token và trả về thông tin
    const token = signToken(docgia._id);

    // Loại bỏ mật khẩu trước khi trả về
    docgia.Password = undefined;

    // Trả về { user, token }
    return { user: docgia, token };
  }
}

module.exports = new DocgiaService();
