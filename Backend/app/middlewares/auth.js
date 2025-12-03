// backend/app/middlewares/auth.js

const jwt = require('jsonwebtoken');
const StaffModel = require('../models/Staff.model');   // <-- Đã đổi tên file
const ReaderModel = require('../models/Reader.model'); // <-- Đã đổi tên file
const JWT_SECRET = process.env.JWT_SECRET;

// --- 1. PROTECT: Require Login ---
exports.protect = async (req, res, next) => {
    let token;
    // 1) Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(Object.assign(new Error("You are not logged in! Please log in to get access."), { statusCode: 401 }));
    }

    // 2) Verify Token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id; 

        // Check both collections (Staff & Reader)
        const [staffUser, readerUser] = await Promise.all([
            StaffModel.findById(userId),
            ReaderModel.findById(userId),
        ]);
        
        const currentUser = staffUser || readerUser;

        if (!currentUser) {
            throw new Error("The user belonging to this token does no longer exist."); 
        }

        // Grant access
        req.user = currentUser.toObject(); 
        
        // Determine Role (Position)
        // Lưu ý: Staff vẫn giữ field 'Chucvu' (tiếng Việt) trong DB
        req.user.Position = staffUser ? currentUser.Chucvu : 'Reader'; 
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             error.statusCode = 401; 
             error.message = "Session expired or invalid token. Please log in again.";
        } else {
             error.statusCode = error.statusCode || 401; 
        }
        next(error);
    }
};

// --- 2. OPTIONAL PROTECT: Identify user if logged in, else continue as guest ---
exports.optionalProtect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const [staffUser, readerUser] = await Promise.all([
                StaffModel.findById(decoded.id),
                ReaderModel.findById(decoded.id),
            ]);
            
            const currentUser = staffUser || readerUser;
            
            if (currentUser) {
                req.user = currentUser.toObject();
                req.user.Position = staffUser ? currentUser.Chucvu : 'Reader';
            }
        } catch (error) {
            // Ignore invalid token, treat as guest
            req.user = null;
        }
    }
    next(); 
};

// --- 3. RESTRICT TO: Role-based authorization ---
exports.restrictTo = (...positions) => {
    return (req, res, next) => {
        // positions: danh sách các chức vụ được phép (ví dụ: 'Admin', 'Thủ thư')
        // req.user.Position: chức vụ hiện tại của user
        if (!req.user || !positions.includes(req.user.Position)) {
            return next(
                Object.assign(new Error('You do not have permission to perform this action.'), { statusCode: 403 })
            );
        }
        next();
    };
};