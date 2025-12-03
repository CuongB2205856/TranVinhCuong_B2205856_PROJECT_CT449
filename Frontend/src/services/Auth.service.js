import api from "./api.service";

class AuthService {
    // --- READER (Độc giả) ---
    
    // [POST] /api/readers/login
    async loginReader(phone, password) {
        // Backend Controller mong đợi: { Phone, Password }
        return (await api.post("/api/readers/login", { 
            Phone: phone, 
            Password: password 
        })).data;
    }

    // [POST] /api/readers (Đăng ký)
    async registerReader(data) {
        // Data gửi lên giữ nguyên keys tiếng Việt (HoLot, Ten...) 
        // vì Model Backend map trực tiếp vào DB cũ.
        return (await api.post("/api/readers", data)).data;
    }

    // --- STAFF (Nhân viên) ---

    // [POST] /api/staffs/login
    async loginStaff(staffId, password) {
        // Backend Controller mới mong đợi: { StaffId, Password }
        // (Nếu bạn giữ code cũ là MSNV thì đổi StaffId thành MSNV ở đây)
        return (await api.post("/api/staffs/login", { 
            MSNV: staffId, // Mapping StaffId -> MSNV cho khớp controller
            Password: password 
        })).data;
    }
}

export default new AuthService();