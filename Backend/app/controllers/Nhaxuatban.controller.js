// backend/app/controllers/Nhaxuatban.controller.js

const nxbService = require('../services/Nhaxuatban.service');

// [GET] /api/nxb: Lấy tất cả NXB
exports.getAllNXB = async (req, res, next) => {
    try {
        const nxbList = await nxbService.getAllNXB();
        res.status(200).json(nxbList);
    } catch (error) {
        next(error);
    }
};

// [POST] /api/nxb: Thêm NXB mới
exports.createNXB = async (req, res, next) => {
    try {
        const newNXB = await nxbService.createNXB(req.body);
        res.status(201).json({ message: "Thêm NXB thành công.", data: newNXB });
    } catch (error) {
        next(error);
    }
};

// [DELETE] /api/nxb/:id: Xóa NXB
exports.deleteNXB = async (req, res, next) => {
    try {
        const result = await nxbService.deleteNXB(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};