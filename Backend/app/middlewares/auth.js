// backend/app/middleware/auth.js

const jwt = require('jsonwebtoken');
const NhanVienModel = require('../models/Nhanvien.model');
const DocgiaModel = require('../models/Docgia.model'); // ✅ THÊM IMPORT ĐỘC GIẢ
const JWT_SECRET = process.env.JWT_SECRET;

// --- 1. MIDDLEWARE BẮT BUỘC ĐĂNG NHẬP ---
exports.protect = async (req, res, next) => {
    // 1) Lấy token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        // Ném lỗi 401 nếu KHÔNG có token
        return next(Object.assign(new Error("Bạn chưa đăng nhập! Vui lòng cung cấp Token."), { statusCode: 401 }));
    }

    // 2) Xác thực Token và Tìm người dùng
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id; 

        // ⚠️ THỬ TÌM KIẾM TRONG CẢ HAI COLLECTIONS SONG SONG
        const [nhanVienUser, docGiaUser] = await Promise.all([
            NhanVienModel.findById(userId),
            DocgiaModel.findById(userId),
        ]);
        
        // 1. Xác định người dùng hợp lệ
        const currentUser = nhanVienUser || docGiaUser;

        if (!currentUser) {
            // Nếu không tìm thấy trong cả 2 Collection
            throw new Error("Người dùng không còn tồn tại."); 
        }

        // 2. Gắn thông tin người dùng vào request
        // .toObject() giúp chuyển từ Mongoose Document sang object JS thuần túy
        req.user = currentUser.toObject(); 
        
        // 3. Gắn loại tài khoản (quan trọng cho phân quyền)
        req.user.Chucvu = nhanVienUser ? currentUser.Chucvu : 'Độc giả'; 
        
        next();
    } catch (error) {
        // Xử lý lỗi JWT (Hết hạn/Sai chữ ký)
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             error.statusCode = 401; 
             error.message = "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.";
        } else {
             error.statusCode = error.statusCode || 401; 
        }
        next(error);
    }
};

// --- 2. MIDDLEWARE XEM/DUYỆT TÙY CHỌN (Không bắt buộc Token) ---
exports.optionalProtect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const [nhanVienUser, docGiaUser] = await Promise.all([
                NhanVienModel.findById(decoded.id),
                DocgiaModel.findById(decoded.id),
            ]);
            
            const currentUser = nhanVienUser || docGiaUser;
            
            if (currentUser) {
                req.user = currentUser.toObject();
                req.user.Chucvu = nhanVienUser ? currentUser.Chucvu : 'Độc giả';
            }
        } catch (error) {
            // Token bị lỗi/hết hạn, nhưng vẫn cho phép tiếp tục (người dùng ẩn danh)
            req.user = null;
        }
    }
    next(); 
};

// --- 3. MIDDLEWARE PHÂN QUYỀN ---
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