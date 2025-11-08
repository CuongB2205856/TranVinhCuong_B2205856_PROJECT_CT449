// backend/app/controllers/Nhanvien.controller.js

const nhanvienService = require('../services/Nhanvien.service');

// [POST] /api/nhanvien/login: Đăng nhập
exports.login = async (req, res, next) => {
    try {
        const { MSNV, Password } = req.body;
        
        if (!MSNV || !Password) {
            const error = new Error("Vui lòng cung cấp Mã số NV và Mật khẩu.");
            error.statusCode = 400;
            return next(error);
        }

        const nhanVien = await nhanvienService.checkLogin(MSNV, Password);
        // Trả về thông tin user (không có mật khẩu) và có thể kèm Token
        res.status(200).json({ 
            message: "Đăng nhập thành công.", 
            user: nhanVien,
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
        res.status(201).json({ message: "Thêm nhân viên thành công.", data: newNhanVien });
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