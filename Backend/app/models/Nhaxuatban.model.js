// backend/app/models/Nhaxuatban.model.js

const mongoose = require('mongoose');

const NhaXuatBanSchema = new mongoose.Schema({
    // Sử dụng MaNXB làm _id (Khóa chính)
    _id: { 
        type: String, 
        alias: 'MaNXB', 
    }, 
    TenNXB: { 
        type: String, 
        required: [true, 'Tên NXB không được để trống.'], 
        trim: true 
    },
    DiaChi: { 
        type: String 
    }
}, { 
    versionKey: false,
    collection: 'NhaXuatBan'
});

module.exports = mongoose.model('NhaXuatBan', NhaXuatBanSchema); // Tên Model là 'NhaXuatBan'