// backend/app/models/Sach.model.js

const mongoose = require('mongoose');

// Schema cho Sub-document Nhà Xuất Bản (Nhúng)
const NXB_Schema = new mongoose.Schema({
    MaNXB: { type: String, required: [true, 'Mã NXB không được để trống.'] },
    TenNXB: { type: String, required: [true, 'Tên NXB không được để trống.'] }
}, { _id: false });

// Schema chính cho Sách
const SachSchema = new mongoose.Schema({
    // Sử dụng MaSach làm _id (Khóa chính)
    _id: { 
        type: String, 
        alias: 'MaSach', 
    }, 
    TenSach: { 
        type: String, 
        required: [true, 'Tên sách không được để trống.'], 
        trim: true 
    },
    DonGia: { 
        type: Number, 
        required: [true, 'Đơn giá không được để trống.'], 
        min: [0, 'Đơn giá phải lớn hơn hoặc bằng 0.'] 
    },
    SoQuyen: { 
        type: Number, 
        required: [true, 'Số lượng quyển không được để trống.'], 
        default: 0, 
        min: [0, 'Số lượng quyển phải lớn hơn hoặc bằng 0.'],
        validate: {
            validator: Number.isInteger,
            message: 'Số lượng quyển phải là số nguyên.'
        }
    },
    NamXuatBan: { 
        type: Number 
    },
    TacGia: { 
        type: String 
    },
    NXB: { 
        type: NXB_Schema, 
        required: [true, 'Thông tin NXB không được để trống.'] 
    }
}, { 
    versionKey: false,
    collection: 'Sach' 
});

module.exports = mongoose.model('Sach', SachSchema); // Tên Model là 'Sach'