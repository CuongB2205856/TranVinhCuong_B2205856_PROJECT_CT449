// backend/app/controllers/Docgia.controller.js

const docgiaService = require('../services/Docgia.service');

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
        res.status(201).json({ message: "Đăng ký độc giả thành công.", data: newDocgia });
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
        const updatedDocgia = await docgiaService.updateDocgia(req.params.id, req.body);
        res.status(200).json({ message: "Cập nhật độc giả thành công.", data: updatedDocgia });
    } catch (error) {
        next(error);
    }
};