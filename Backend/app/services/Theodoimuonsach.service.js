// backend/app/services/Theodoimuonsach.Service.js

const MuonSachModel = require('../models/Theodoimuonsach.model'); // <-- Import Model mới
const DocgiaModel = require('../models/Docgia.model');     // <-- Import Model mới
const SachModel = require('../models/Sach.model');         // <-- Import Model mới

class TheoDoiMuonSachService {

    // [CREATE] Tạo phiếu mượn mới
    async createPhieuMuon(data) {
        const { MaDocGia, MaSach } = data;

        // 1. Kiểm tra sự tồn tại và tính hợp lệ (Logic Nghiệp vụ)
        const docGia = await DocgiaModel.findById(MaDocGia);
        const sach = await SachModel.findById(MaSach);

        if (!docGia) throw Object.assign(new Error("Mã Độc Giả không tồn tại."), { statusCode: 404 });
        if (!sach) throw Object.assign(new Error("Mã Sách không tồn tại."), { statusCode: 404 });
        if (sach.SoQuyen <= 0) throw Object.assign(new Error("Sách đã hết, không thể cho mượn."), { statusCode: 400 });

        // 2. Thực thi Giao dịch (Transaction)
        const session = await MuonSachModel.startSession();
        session.startTransaction();
        try {
            // A. Giảm số lượng sách trong kho
            await SachModel.findByIdAndUpdate(
                MaSach, 
                { $inc: { SoQuyen: -1 } }, 
                { session }
            );

            // B. Tạo phiếu mượn
            const newPhieu = await MuonSachModel.create([{ ...data, MaDocGia, MaSach }], { session });

            await session.commitTransaction();
            return newPhieu[0];
        } catch (error) {
            await session.abortTransaction(); // Quay ngược lại nếu có lỗi
            throw error;
        } finally {
            session.endSession();
        }
    }

    // [READ] Lấy danh sách phiếu mượn đang hoạt động (Sử dụng Populate)
    async getPhieuMuonDangMuon() {
        // Chỉ lấy những phiếu chưa có NgayTra
        return MuonSachModel.find({ NgayTra: null })
            .populate('MaDocGia') // Điền thông tin Độc giả
            .populate('MaSach')   // Điền thông tin Sách
            .exec();
    }

    // [UPDATE] Cập nhật trả sách
    async updateTraSach(phieuMuonId) {
        const phieu = await MuonSachModel.findById(phieuMuonId);

        if (!phieu) throw Object.assign(new Error("Không tìm thấy phiếu mượn."), { statusCode: 404 });
        if (phieu.NgayTra) throw Object.assign(new Error("Sách này đã được trả."), { statusCode: 400 });

        // Logic tăng số lượng sách khi trả (Transaction)
        const session = await MuonSachModel.startSession();
        session.startTransaction();
        try {
            // A. Tăng số lượng sách trong kho
            await SachModel.findByIdAndUpdate(
                phieu.MaSach, 
                { $inc: { SoQuyen: 1 } }, 
                { session }
            );

            // B. Cập nhật ngày trả trên phiếu mượn
            phieu.NgayTra = new Date();
            await phieu.save({ session });

            await session.commitTransaction();
            return phieu;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

module.exports = new TheoDoiMuonSachService();