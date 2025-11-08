// frontend/src/services/muonsach.service.js

import api from "./api.service"; // Sử dụng Axios Instance đã cấu hình

class MuonSachService {
    // Endpoint: POST /api/muonsach
    /**
     * Gửi yêu cầu mượn sách.
     * @param {string} maSach Mã sách muốn mượn
     * @param {string} maDocGia Mã độc giả đang đăng nhập
     */
    async borrowBook(maSach, maDocGia) {
        try {
            // Frontend gửi MaSach. MaDocGia được lấy từ phiên (nếu cần) hoặc gửi cùng
            // Dựa trên Controller, Backend lấy MaDocGia từ req.user._id, nên Frontend chỉ cần gửi MaSach
            const response = await api.post('/api/muonsach', { 
                MaSach: maSach,
                MaDocGia: maDocGia // Chỉ gửi nếu bạn muốn Backend xác nhận lại ID
            }); 
            return response.data;
        } catch (error) {
            console.error("Error creating borrow transaction:", error);
            throw error;
        }
    }
    
    // Bạn có thể thêm hàm trả sách (returnBook) ở đây
}

export default new MuonSachService();