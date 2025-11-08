// backend/app/controllers/Docgia.controller.js (ĐÃ SỬA CHỮA)

const docgiaService = require("../services/Docgia.service");

// [GET] /api/docgia: Lấy tất cả độc giả
exports.getAllDocgia = async (req, res, next) => {
  try {
    const docgiaList = await docgiaService.getAllDocgia(req.query.ten);
    res.status(200).json(docgiaList);
  } catch (error) {
    next(error);
  }
};

// [POST] /api/docgia: Đăng ký độc giả mới
exports.createDocgia = async (req, res, next) => {
  try {
    const newDocgia = await docgiaService.createDocgia(req.body);
    // Logic của bạn trả về newDocgia, nhưng không trả về token trong hàm này.
    // Nếu bạn muốn đăng nhập tự động, hàm Service phải trả về { user, token }.
    res
      .status(201)
      .json({ message: "Đăng ký độc giả thành công.", data: newDocgia });
  } catch (error) {
    next(error);
  }
};

// [GET] /api/docgia/:id: Lấy độc giả theo ID
exports.getDocgiaById = async (req, res, next) => {
  try {
    const docgia = await docgiaService.getDocgiaById(req.params.id);
    res.status(200).json(docgia);
  } catch (error) {
    next(error);
  }
};

// [PUT] /api/docgia/:id: Cập nhật độc giả
exports.updateDocgia = async (req, res, next) => {
  try {
    const updatedDocgia = await docgiaService.updateDocgia(
      req.params.id,
      req.body
    );
    res
      .status(200)
      .json({ message: "Cập nhật độc giả thành công.", data: updatedDocgia });
  } catch (error) {
    next(error);
  }
};
// -----------------------------------------------------------------
// ✅ KHẮC PHỤC LỖI: Đặt hàm login NGANG CẤP với các hàm export khác
// -----------------------------------------------------------------

exports.login = async (req, res, next) => {
  try {
    const { DienThoai, Password } = req.body;

    if (!DienThoai || !Password) {
      const error = new Error("Vui lòng cung cấp Số điện thoại và Mật khẩu.");
      error.statusCode = 400;
      return next(error);
    }

    // Service trả về { user, token }
    const { user, token } = await docgiaService.checkLogin(
      DienThoai,
      Password
    );

    res.status(200).json({
      status: "success",
      token, // Trả về Token
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};