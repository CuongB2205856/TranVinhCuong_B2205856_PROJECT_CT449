// backend/app/middleware/auth.js

const jwt = require('jsonwebtoken');
const NhanVienModel = require('../models/Nhanvien.model');
const JWT_SECRET = process.env.JWT_SECRET;

// --- 1. MIDDLEWARE BẮT BUỘC ĐĂNG NHẬP (Dùng cho mượn sách) ---
// Giữ lại hàm protect cũ, nhưng đảm bảo nó luôn yêu cầu token
exports.protect = async (req, res, next) => {
    // 1) Lấy token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        // Ném lỗi 401 nếu KHÔNG có token (Bắt buộc đăng nhập)
        return next(Object.assign(new Error("Bạn chưa đăng nhập! Vui lòng cung cấp Token."), { statusCode: 401 }));
    }

    // 2) Xác thực và kiểm tra người dùng tồn tại
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await NhanVienModel.findById(decoded.id); 

        if (!req.user) {
            throw new Error("Người dùng không còn tồn tại.");
        }
        next();
    } catch (error) {
        // ✅ THÊM LOGIC KIỂM TRA LỖI JWT TẠI ĐÂY
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             // Nếu token bị lỗi cú pháp hoặc đã hết hạn, đặt statusCode = 401
             error.statusCode = 401; 
             error.message = "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.";
        } else {
             // Lỗi khác (ví dụ: người dùng bị xóa khỏi DB)
             error.statusCode = error.statusCode || 401; 
        }
        next(error); // Chuyển lỗi 401 tới errorHandler
    }
};

// --- 2. MIDDLEWARE XEM/DUYỆT TÙY CHỌN (Dùng cho đọc giả) ---
// Middleware này sẽ cố gắng xác định người dùng nếu có token, nếu không có thì vẫn cho qua
exports.optionalProtect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        // Nếu có token, cố gắng xác thực
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = await NhanVienModel.findById(decoded.id); 
        } catch (error) {
            // Token bị lỗi/hết hạn, nhưng vẫn cho phép tiếp tục (người dùng ẩn danh)
            req.user = null;
        }
    }
    // Dù có hay không có user, vẫn cho phép tiếp tục
    next(); 
};

// --- 3. MIDDLEWARE PHÂN QUYỀN (Không đổi) ---
exports.restrictTo = (...chucVu) => {
    return (req, res, next) => {
        // Kiểm tra xem req.user có tồn tại không và chức vụ có hợp lệ không
        if (!req.user || !chucVu.includes(req.user.Chucvu)) {
            return next(
                Object.assign(new Error('Bạn không có quyền thực hiện thao tác này.'), { statusCode: 403 })
            );
        }
        next();
    };
};