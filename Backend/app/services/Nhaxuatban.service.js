// backend/app/services/Nhaxuatban.Service.js

const NhaXuatBanModel = require('../models/Nhaxuatban.model'); // <-- Import Model mới
const SachModel = require('../models/Sach.model'); // <-- Import Model mới (cần cho kiểm tra ràng buộc)

class NhaXuatBanService {
    // [CREATE] Thêm NXB mới
    async createNXB(nxbData) {
        try {
            return await NhaXuatBanModel.create(nxbData);
        } catch (error) {
            if (error.name === 'ValidationError' || error.code === 11000) {
                error.statusCode = 400; 
            }
            throw error;
        }
    }

    // [READ] Lấy danh sách tất cả NXB
    async getAllNXB() {
        return NhaXuatBanModel.find({});
    }

    // [READ] Lấy NXB theo Mã NXB (ID)
    async getNXBById(id) {
        const nxb = await NhaXuatBanModel.findById(id);
        if (!nxb) {
            const error = new Error(`Không tìm thấy Nhà Xuất Bản có mã: ${id}`);
            error.statusCode = 404;
            throw error;
        }
        return nxb;
    }

    // [UPDATE] Cập nhật thông tin NXB
    async updateNXB(id, updateData) {
        const updatedNXB = await NhaXuatBanModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedNXB) {
            const error = new Error(`Cập nhật thất bại: Không tìm thấy NXB có mã ${id}`);
            error.statusCode = 404;
            throw error;
        }
        return updatedNXB;
    }

    // [DELETE] Xóa NXB (Kiểm tra ràng buộc nghiệp vụ)
    async deleteNXB(id) {
        // Kiểm tra xem NXB này còn liên kết với sách nào không
        const relatedSach = await SachModel.findOne({ 'NXB.MaNXB': id }); 
        
        if (relatedSach) {
            const error = new Error(`Không thể xóa NXB ${id} vì đang có sách liên quan: ${relatedSach.TenSach}`);
            error.statusCode = 409; // 409 Conflict
            throw error;
        }
        
        const result = await NhaXuatBanModel.findByIdAndDelete(id);
        
        if (!result) {
            const error = new Error(`Xóa thất bại: Không tìm thấy NXB có mã ${id}`);
            error.statusCode = 404;
            throw error;
        }
        return { message: `Nhà Xuất Bản có mã ${id} đã được xóa thành công.` };
    }
}

module.exports = new NhaXuatBanService();