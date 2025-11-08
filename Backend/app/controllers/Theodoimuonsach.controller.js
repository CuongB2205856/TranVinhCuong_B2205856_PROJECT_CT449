// backend/app/controllers/Theodoimuonsach.controller.js

const muonSachService = require('../services/Theodoimuonsach.service');

// [GET] /api/muonsach: Lấy danh sách phiếu mượn đang hoạt động
exports.getMuonSachDangMuon = async (req, res, next) => {
    try {
        const danhSach = await muonSachService.getPhieuMuonDangMuon();
        res.status(200).json(danhSach);
    } catch (error) {
        next(error);
    }
};

// [POST] /api/muonsach: Tạo phiếu mượn mới
exports.createMuonSach = async (req, res, next) => {
    try {
        const newPhieu = await muonSachService.createPhieuMuon(req.body);
        res.status(201).json({ message: "Tạo phiếu mượn thành công.", data: newPhieu });
    } catch (error) {
        next(error);
    }
};

// [PUT] /api/muonsach/tra/:id: Cập nhật trả sách theo ID phiếu mượn
exports.traSach = async (req, res, next) => {
    try {
        const phieuMuonId = req.params.id;
        const phieuTra = await muonSachService.updateTraSach(phieuMuonId);
        res.status(200).json({ message: "Trả sách thành công. Cập nhật số lượng kho.", data: phieuTra });
    } catch (error) {
        next(error);
    }
};