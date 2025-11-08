// backend/app/services/Theodoimuonsach.Service.js

const MuonSachModel = require('../models/Theodoimuonsach.model');
const DocgiaModel = require('../models/Docgia.model');
const SachModel = require('../models/Sach.model');

class TheoDoiMuonSachService {
    
    // [CREATE] Tạo phiếu mượn mới (Sử dụng Atomic Update và Manual Rollback)
    async createPhieuMuon(data) {
        const { MaDocGia, MaSach } = data;

        // 1. Kiểm tra tồn tại và hợp lệ (Không đổi)
        const docGia = await DocgiaModel.findById(MaDocGia);
        const sach = await SachModel.findById(MaSach);

        if (!docGia) 
            throw Object.assign(new Error("Mã Độc Giả không tồn tại."), { statusCode: 404 });
        if (!sach) 
            throw Object.assign(new Error("Mã Sách không tồn tại."), { statusCode: 404 });
        
        if (sach.SoQuyen <= 0) 
            throw Object.assign(new Error(`Sách ${sach.TenSach} đã hết, không thể cho mượn.`), { statusCode: 400 });

        
        // 2. GIẢI PHÁP: THỰC HIỆN CẬP NHẬT ATOMIC (GIẢM KHO) TRƯỚC
        let isStockReduced = false; // Biến cờ kiểm tra giảm kho
        
        try {
            // A. Giảm số lượng sách trong kho (Atomic update)
            await SachModel.findByIdAndUpdate(
                MaSach, 
                { $inc: { SoQuyen: -1 } }
            );
            isStockReduced = true;

            // B. Tạo phiếu mượn mới (Ghi nhận yêu cầu)
            const newPhieu = await MuonSachModel.create({ 
                MaDocGia, 
                MaSach,
                NgayMuon: data.NgayMuon || new Date()
            });

            return newPhieu; 
        } catch (error) {
            // C. HOÀN TÁC THỦ CÔNG (MANUAL ROLLBACK)
            // Nếu stock đã bị giảm nhưng việc tạo phiếu mượn thất bại, TĂNG lại kho.
            if (isStockReduced) {
                 await SachModel.findByIdAndUpdate(MaSach, { $inc: { SoQuyen: 1 } }); 
            }
            
            throw Object.assign(new Error(`Lỗi hệ thống khi tạo giao dịch mượn: ${error.message}`), { statusCode: 500 });
        }
    }
    
    // [UPDATE] Hàm trả sách (Tương tự, không cần Transaction)
    async updateTraSach(phieuMuonId) {
        const phieu = await MuonSachModel.findById(phieuMuonId);
        // ... (Logic kiểm tra phiếu) ...

        try {
            // Tăng số lượng sách trong kho
            await SachModel.findByIdAndUpdate(phieu.MaSach, { $inc: { SoQuyen: 1 } }); 

            // Cập nhật ngày trả
            phieu.NgayTra = new Date();
            await phieu.save();

            return phieu;
        } catch (error) {
            // Xử lý lỗi
            throw Object.assign(new Error("Lỗi hệ thống khi cập nhật trả sách."), { statusCode: 500 });
        }
    }
}

module.exports = new TheoDoiMuonSachService();