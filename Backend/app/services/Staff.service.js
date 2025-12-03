// backend/app/services/Staff.service.js

const Staff = require("../models/Staff.model");
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
  }
}

module.exports = new StaffService();