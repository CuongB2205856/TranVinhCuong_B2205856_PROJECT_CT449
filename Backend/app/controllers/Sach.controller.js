// backend/app/controllers/Sach.controller.js

const sachService = require('../services/Sach.service')// Đảm bảo S lớn, service là tên file

// [GET] /api/sach: Lấy tất cả sách
exports.getAllSach = async (req, res, next) => {
    try {
        const sachList = await sachService.getAllSach(req.query.ten);
        res.status(200).json(sachList);
    } catch (error) {
        next(error);
    }
};

// [GET] /api/sach/:id: Lấy sách theo ID
exports.getSachById = async (req, res, next) => {
    try {
        const sach = await sachService.getSachById(req.params.id);
        res.status(200).json(sach);
    } catch (error) {
        next(error);
    }
};

// [POST] /api/sach: Thêm sách mới
exports.createSach = async (req, res, next) => {
    try {
        const newSach = await sachService.createSach(req.body);
        res.status(201).json({ message: "Thêm sách thành công.", data: newSach });
    } catch (error) {
        next(error);
    }
};

// [PUT] /api/sach/:id: Cập nhật sách
exports.updateSach = async (req, res, next) => {
    try {
        const updatedSach = await sachService.updateSach(req.params.id, req.body);
        res.status(200).json({ message: "Cập nhật sách thành công.", data: updatedSach });
    } catch (error) {
        next(error);
    }
};

// [DELETE] /api/sach/:id: Xóa sách
exports.deleteSach = async (req, res, next) => {
    try {
        const result = await sachService.deleteSach(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};