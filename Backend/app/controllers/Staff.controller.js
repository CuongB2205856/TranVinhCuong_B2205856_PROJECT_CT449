// backend/app/controllers/Staff.controller.js

const StaffService = require("../services/Staff.service");

// [POST] /api/Staff/login: Đăng nhập
exports.login = async (req, res, next) => {
  try {
    const { MSNV, Password } = req.body;

    if (!MSNV || !Password) {
      const error = new Error("Vui lòng cung cấp Mã số NV và Mật khẩu.");
      error.statusCode = 400;
      return next(error);
    }

    // Service trả về { user, token }
    const { user, token } = await StaffService.checkLogin(MSNV, Password);

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

// [POST] /api/Staff: Thêm nhân viên mới
exports.createStaff = async (req, res, next) => {
  try {
    const newStaff = await StaffService.createStaff(req.body);
    // Loại bỏ Password trước khi gửi response
    newStaff.Password = undefined;
    res
      .status(201)
      .json({ message: "Thêm nhân viên thành công.", data: newStaff });
  } catch (error) {
    next(error);
  }
};

// [GET] /api/Staff: Lấy danh sách nhân viên
exports.getAllStaff = async (req, res, next) => {
  try {
    const StaffList = await StaffService.getAllStaff();
    res.status(200).json(StaffList);
  } catch (error) {
    next(error);
  }
};
