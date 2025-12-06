// src/services/Staff.service.js
import api from "./api.service";

class StaffService {
    async getAllStaff() {
        return (await api.get("/api/staffs")).data;
    }

    async createStaff(data) {
        return (await api.post("/api/staffs", data)).data;
    }

    async getStats() {
        return (await api.get("/api/staffs/stats")).data;
    }

    // --- THÊM MỚI ---
    async getProfile() {
        return (await api.get("/api/staffs/profile")).data;
    }

    async updateProfile(data) {
        return (await api.put("/api/staffs/profile", data)).data;
    }
    // --- THÊM MỚI ---
    async updateStaff(id, data) {
        return (await api.put(`/api/staffs/${id}`, data)).data;
    }
}

export default new StaffService();