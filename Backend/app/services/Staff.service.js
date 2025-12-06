// backend/app/services/Staff.service.js

const Staff = require("../models/Staff.model");
const Book = require("../models/Book.model");
const Borrowing = require("../models/Borrowing.model");
const jwt = require("jsonwebtoken");
const config = require("../config");

const signToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
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
    const staff = await Staff.findById(staffId).select("+Password");

    if (!staff || !staff.Password) {
      throw Object.assign(new Error("Incorrect Staff ID or password."), {
        statusCode: 401,
      });
    }

    const isMatch = await staff.comparePassword(password);

    if (!isMatch) {
      throw Object.assign(new Error("Incorrect Staff ID or password."), {
        statusCode: 401,
      });
    }

    const token = signToken(staff._id);
    staff.Password = undefined;
    return { user: staff, token };
  }

  // [GET] Thống kê hệ thống
  async getSystemStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalBooks = await Book.countDocuments();

    // TÍNH THU NHẬP THÁNG NÀY
    const revenueResult = await Borrowing.aggregate([
      {
        $match: {
          TrangThai: "da_tra",
          NgayTra: { $gte: startOfMonth, $lte: now },
        },
      },
      {
        $lookup: {
          from: "Sach",
          localField: "MaSach",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      { $unwind: "$bookInfo" },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$bookInfo.DonGia" },
        },
      },
    ]);

    const currentMonthRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalIncome : 0;

    const borrowingStats = await Borrowing.aggregate([
      {
        $group: {
          _id: "$TrangThai",
          count: { $sum: 1 },
        },
      },
    ]);

    const statsMap = borrowingStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return {
      books: {
        totalTitles: totalBooks,
        revenue: currentMonthRevenue,
      },
      borrowing: {
        dang_muon: statsMap["dang_muon"] || 0,
        da_tra: statsMap["da_tra"] || 0,
        cho_xac_nhan: statsMap["cho_xac_nhan"] || 0,
        da_tu_choi: statsMap["da_tu_choi"] || 0,
        da_huy: statsMap["da_huy"] || 0,
      },
    };
  }

  // --- THÊM MỚI ---
  async getStaffById(id) {
    return await Staff.findById(id);
  }

  async updateStaff(id, data) {
    // Nếu có update password thì Model sẽ tự hash lại nhờ pre('save')
    // Nhưng findByIdAndUpdate không chạy pre('save'), nên nếu đổi pass cần xử lý riêng hoặc dùng save()
    // Để đơn giản cho phần Info (không pass), ta dùng findByIdAndUpdate.
    // Nếu đổi pass, ta sẽ xử lý riêng ở controller hoặc tách hàm.

    // Tạm thời dùng cách find -> save để hỗ trợ cả đổi pass nếu data có Password
    const staff = await Staff.findById(id);
    if (!staff) throw new Error("Staff not found");

    Object.keys(data).forEach((key) => {
      if (key !== "_id" && key !== "MSNV") {
        staff[key] = data[key];
      }
    });

    return await staff.save();
  }
}

module.exports = new StaffService();
