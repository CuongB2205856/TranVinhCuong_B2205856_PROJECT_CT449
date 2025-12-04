// src/services/Reader.service.js
import api from "./api.service";

class ReaderService {
    // [GET] /api/readers/:id
    async getReader(id) {
        return (await api.get(`/api/readers/${id}`)).data;
    }

    // [PUT] /api/readers/:id
    // Dùng để cập nhật thông tin cá nhân hoặc đổi mật khẩu
    async updateReader(id, data) {
        return (await api.put(`/api/readers/${id}`, data)).data;
    }
}

export default new ReaderService();