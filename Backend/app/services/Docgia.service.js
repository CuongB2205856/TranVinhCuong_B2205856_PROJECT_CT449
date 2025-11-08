// backend/app/services/Docgia.Service.js

const DocgiaModel = require('../models/Docgia.model'); // <-- Import Model mới

class DocgiaService {
    // [CREATE] Đăng ký độc giả mới
    async createDocgia(docgiaData) {
        try {
            return await DocgiaModel.create(docgiaData);
        } catch (error) {
            if (error.name === 'ValidationError' || error.code === 11000) {
                error.statusCode = 400; 
            }
            throw error;
        }
    }

    // [READ] Lấy danh sách độc giả (có thể tìm kiếm theo tên)
    async getAllDocgia(ten) {
        const filter = {};
        if (ten) {
            filter.Ten = { $regex: new RegExp(ten), $options: 'i' }; 
        }
        return DocgiaModel.find(filter);
    }

    // [READ] Lấy thông tin độc giả theo Mã Độc Giả (ID)
    async getDocgiaById(id) {
        const docgia = await DocgiaModel.findById(id);
        if (!docgia) {
            const error = new Error(`Không tìm thấy độc giả có mã: ${id}`);
            error.statusCode = 404;
            throw error;
        }
        return docgia;
    }

    // [UPDATE] Cập nhật thông tin độc giả
    async updateDocgia(id, updateData) {
        const updatedDocgia = await DocgiaModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedDocgia) {
            const error = new Error(`Cập nhật thất bại: Không tìm thấy độc giả có mã ${id}`);
            error.statusCode = 404;
            throw error;
        }
        return updatedDocgia;
    }
}

module.exports = new DocgiaService();