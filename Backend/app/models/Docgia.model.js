// backend/app/models/Docgia.model.js

const mongoose = require('mongoose');

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
    }
}, { 
    versionKey: false,
    collection: 'Docgia'
});

module.exports = mongoose.model('Docgia', DocgiaSchema); // Tên Model là 'Docgia'