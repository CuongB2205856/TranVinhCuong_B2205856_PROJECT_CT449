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
exports.getStats = async (req, res, next) => {
  try {
    const stats = await StaffService.getSystemStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

// --- THÊM MỚI: API Lấy Profile của chính mình ---
exports.getProfile = async (req, res, next) => {
  try {
    // req.user đã có sẵn từ middleware auth
    // Lấy lại từ DB để đảm bảo dữ liệu mới nhất
    const staff = await StaffService.getStaffById(req.user._id);
    res.status(200).json(staff);
  } catch (error) {
    next(error);
  }
};

// --- THÊM MỚI: API Cập nhật Profile ---
exports.updateProfile = async (req, res, next) => {
  try {
    const updatedStaff = await StaffService.updateStaff(req.user._id, req.body);
    res
      .status(200)
      .json({ message: "Cập nhật hồ sơ thành công.", data: updatedStaff });
  } catch (error) {
    next(error);
  }
};

exports.updateStaffByAdmin = async (req, res, next) => {
    try {
        const staffId = req.params.id; // Lấy ID từ URL
        const updatedStaff = await StaffService.updateStaff(staffId, req.body);
        
        // Ẩn mật khẩu nếu có trả về
        updatedStaff.Password = undefined; 
        
        res.status(200).json({ 
            message: "Cập nhật nhân viên thành công.", 
            data: updatedStaff 
        });
    } catch (error) {
        next(error);
    }
};
