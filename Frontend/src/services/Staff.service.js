
// src/services/Staff.service.js
import api from "./api.service";

class StaffService {
    // [GET] Lấy danh sách nhân viên
    async getAllStaff() {
        return (await api.get("/api/staffs")).data;
    }

    // [POST] Tạo nhân viên mới
    async createStaff(data) {
        return (await api.post("/api/staffs", data)).data;
    }

    // [GET] Lấy thống kê
    async getStats() {
        return (await api.get("/api/staffs/stats")).data;
    }
}

export default new StaffService();