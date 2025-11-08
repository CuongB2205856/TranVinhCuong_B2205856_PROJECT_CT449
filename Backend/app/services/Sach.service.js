// backend/app/services/Sach.Service.js

const SachModel = require('../models/Sach.model'); // <-- Import Model mới

class sachService {
    // [CREATE] Thêm sách mới
    async createSach(sachData) {
        try {
            // Mongoose Model sẽ tự động kiểm tra validation (required, unique)
            return await SachModel.create(sachData);
        } catch (error) {
            if (error.name === 'ValidationError' || error.code === 11000) {
                error.statusCode = 400; // Lỗi validation/unique
            }
            throw error;
        }
    }

    // [READ] Lấy tất cả sách (Mặc định: chỉ lấy sách còn trong kho)
    async getAllSach(filter = {}) {
        return SachModel.find({ SoQuyen: { $gt: 0 } }); 
    }

    // [READ] Lấy sách theo Mã Sách (ID)
    async getSachById(id) {
        const sach = await SachModel.findById(id);
        if (!sach) {
            const error = new Error(`Không tìm thấy sách có mã: ${id}`);
            error.statusCode = 404;
            throw error;
        }
        return sach;
    }

    // [UPDATE] Cập nhật thông tin sách
    async updateSach(id, updateData) {
        const updatedSach = await SachModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true } // Trả về bản ghi mới và chạy validation
        );

        if (!updatedSach) {
            const error = new Error(`Cập nhật thất bại: Không tìm thấy sách có mã ${id}`);
            error.statusCode = 404;
            throw error;
        }
        return updatedSach;
    }

    // [DELETE] Xóa sách
    async deleteSach(id) {
        // Cần thêm logic kiểm tra xem sách này có đang được mượn hay không (Ràng buộc nghiệp vụ)
        // Hiện tại, chỉ xóa nếu tồn tại:
        const result = await SachModel.findByIdAndDelete(id);
        if (!result) {
            const error = new Error(`Xóa thất bại: Không tìm thấy sách có mã ${id}`);
            error.statusCode = 404;
            throw error;
        }
        return { message: `Sách có mã ${id} đã được xóa thành công.` };
    }
}

module.exports = new sachService();