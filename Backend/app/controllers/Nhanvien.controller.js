// backend/app/controllers/Nhanvien.controller.js

const nhanvienService = require("../services/Nhanvien.service");

// [POST] /api/nhanvien/login: Đăng nhập
exports.login = async (req, res, next) => {
  try {
    const { MSNV, Password } = req.body;

    if (!MSNV || !Password) {
      const error = new Error("Vui lòng cung cấp Mã số NV và Mật khẩu.");
      error.statusCode = 400;
      return next(error);
    }

    // Service trả về { user, token }
    const { user, token } = await nhanvienService.checkLogin(MSNV, Password);

    // SỬA: Trả về cấu trúc thành công của REST API
    res.status(200).json({
      status: "success",
      token, // ✅ TRẢ VỀ TOKEN ĐỂ FRONTEND LƯU
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// [POST] /api/nhanvien: Thêm nhân viên mới
exports.createNhanVien = async (req, res, next) => {
  try {
    const newNhanVien = await nhanvienService.createNhanVien(req.body);
    // Loại bỏ Password trước khi gửi response
    newNhanVien.Password = undefined;
    res
      .status(201)
      .json({ message: "Thêm nhân viên thành công.", data: newNhanVien });
  } catch (error) {
    next(error);
  }
};

// [GET] /api/nhanvien: Lấy danh sách nhân viên
exports.getAllNhanVien = async (req, res, next) => {
  try {
    const nhanVienList = await nhanvienService.getAllNhanVien();
    res.status(200).json(nhanVienList);
  } catch (error) {
    next(error);
  }
};
