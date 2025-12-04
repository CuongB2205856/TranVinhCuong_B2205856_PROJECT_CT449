// backend/app/services/Staff.service.js

const Staff = require("../models/Staff.model");
const Book = require("../models/Book.model");          
const Borrowing = require("../models/Borrowing.model");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

class StaffService {
  // [CREATE] Create staff
  async createStaff(data) {
    try {
      return await Staff.create(data);
    } catch (error) {
      if (error.name === "ValidationError" || error.code === 11000) {
        error.statusCode = 400;
      }
      throw error;
    }
  }

  // [READ] Get all staff
  async getAllStaff() {
    return Staff.find();
  }

  // [AUTH] Login
  async checkLogin(staffId, password) {
    // 1. Tìm staff (Model Staff dùng alias _id = MSNV, nên findById vẫn work)
    const staff = await Staff.findById(staffId).select("+Password");

    if (!staff || !staff.Password) {
      throw Object.assign(
        new Error("Incorrect Staff ID or password."),
        { statusCode: 401 }
      );
    }

    // 2. So sánh pass
    const isMatch = await staff.comparePassword(password);

    if (!isMatch) {
      throw Object.assign(
        new Error("Incorrect Staff ID or password."),
        { statusCode: 401 }
      );
    }
    
    // 3. Tạo token
    const token = signToken(staff._id); 

    staff.Password = undefined;
    return { user: staff, token };
  }async getSystemStats() {
    // 1. Thống kê Sách
    const totalBooks = await Book.countDocuments(); // Tổng số đầu sách (Titles)
    
    // Tính tổng giá trị kho sách hiện tại (Số quyển * Đơn giá)
    const totalValueResult = await Book.aggregate([
        { 
            $group: { 
                _id: null, 
                total: { $sum: { $multiply: ["$DonGia", "$SoQuyen"] } } 
            } 
        }
    ]);
    const totalValue = totalValueResult.length > 0 ? totalValueResult[0].total : 0;

    // 2. Thống kê Mượn Trả
    const borrowingStats = await Borrowing.aggregate([
        {
            $group: {
                _id: "$TrangThai",
                count: { $sum: 1 }
            }
        }
    ]);

    // Chuyển mảng thành object cho dễ dùng
    const statsMap = borrowingStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
    }, {});

    return {
        books: {
            totalTitles: totalBooks,
            totalValue: totalValue
        },
        borrowing: {
            dang_muon: statsMap['dang_muon'] || 0,     // Sách đang mượn (Chưa trả)
            da_tra: statsMap['da_tra'] || 0,           // Sách đã trả
            cho_xac_nhan: statsMap['cho_xac_nhan'] || 0,
            da_tu_choi: statsMap['da_tu_choi'] || 0
        }
    };
  }
}

module.exports = new StaffService();