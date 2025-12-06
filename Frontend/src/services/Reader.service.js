// src/services/Reader.service.js
import api from "./api.service";

class ReaderService {
    // [GET] /api/readers (Admin - Lấy danh sách)
    async getAllReaders() {
        return (await api.get("/api/readers")).data;
    }

    // [GET] /api/readers/:id
    async getReader(id) {
        return (await api.get(`/api/readers/${id}`)).data;
    }

    // [PUT] /api/readers/:id
    async updateReader(id, data) {
        return (await api.put(`/api/readers/${id}`, data)).data;
    }
}

export default new ReaderService();