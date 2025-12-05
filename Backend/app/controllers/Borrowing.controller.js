// backend/app/controllers/Borrowing.controller.js
const BorrowingService = require('../services/Borrowing.service');

// Lấy danh sách phiếu
exports.getAllBorrowings = async (req, res, next) => {
    try {
        const list = await BorrowingService.getAllBorrowings();
        res.send(list);
    } catch (err) { next(err); }
};

// Tạo phiếu
exports.createBorrowing = async (req, res, next) => {
    try {
        const result = await BorrowingService.createBorrowing(req.body);
        res.status(201).send({ message: "Gửi yêu cầu thành công! Vui lòng chờ duyệt.", data: result });
    } catch (err) { next(err); }
};

// Duyệt phiếu
exports.approveBorrowing = async (req, res, next) => {
    try {
        const result = await BorrowingService.approveBorrowing(req.params.id);
        res.send({ message: "Đã duyệt phiếu mượn.", data: result });
    } catch (err) { next(err); }
};

// Trả sách
exports.returnBook = async (req, res, next) => {
    try {
        const result = await BorrowingService.returnBook(req.params.id);
        res.send({ message: "Trả sách thành công.", data: result });
    } catch (err) { next(err); }
};
// [GET] Lấy danh sách phiếu theo User (Dựa vào Token)
exports.getMyBorrowings = async (req, res, next) => {
    try {
        // req.user.id lấy từ middleware auth
        const list = await BorrowingService.getBorrowingsByReader(req.user._id);
        res.send(list);
    } catch (err) { next(err); }
};

// [PUT] Từ chối phiếu
exports.rejectBorrowing = async (req, res, next) => {
    try {
        const result = await BorrowingService.rejectBorrowing(req.params.id);
        res.send({ message: "Đã từ chối yêu cầu mượn sách.", data: result });
    } catch (err) { next(err); }
};
// [PUT] User hủy phiếu
exports.cancelBorrowing = async (req, res, next) => {
    try {
        // req.user._id lấy từ middleware auth
        const result = await BorrowingService.cancelBorrowing(req.params.id, req.user._id);
        res.send({ message: "Đã hủy yêu cầu mượn sách.", data: result });
    } catch (err) { next(err); }
};