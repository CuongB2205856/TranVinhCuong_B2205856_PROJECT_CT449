// backend/app/models/Docgia.model.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DocgiaSchema = new mongoose.Schema({
    // Sử dụng MaDocGia làm _id (Khóa chính)
    _id: { 
        type: String, 
        alias: 'MaDocGia',
    }, 
    HoLot: { 
        type: String, 
        required: [true, 'Họ lót không được để trống.'] 
    },
    Ten: { 
        type: String, 
        required: [true, 'Tên không được để trống.'] 
    },
    NgaySinh: { 
        type: Date 
    },
    Phai: { 
        type: String,
        enum: ['Nam', 'Nữ', 'Khác']
    },
    DiaChi: { 
        type: String 
    },
    DienThoai: { 
        type: String,
        required: [true, 'Số điện thoại không được để trống.'],
        unique: true,
        match: [/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ.']
    },
    Password: {
        type: String,
        required: [true, 'Mật khẩu không được để trống.'],
        select: false, // Không trả về mặc định
    },
}, { 
    versionKey: false,
    collection: 'Docgia'
});DocgiaSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// 🧩 Hàm so sánh mật khẩu khi đăng nhập
DocgiaSchema.methods.comparePassword = async function (enteredPassword) {
    // So sánh mật khẩu nhập vào với mật khẩu đã hash trong DB
    return await bcrypt.compare(enteredPassword, this.Password);
};

module.exports = mongoose.model('Docgia', DocgiaSchema);