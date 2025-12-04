// backend/app/models/Book.model.js

const mongoose = require('mongoose');

// Schema phụ cho NXB (Embedded)
const PublisherEmbeddedSchema = new mongoose.Schema({
    // Giữ nguyên key khớp với dữ liệu cũ
    MaNXB: { type: String, required: true },
    TenNXB: { type: String, required: true }
}, { _id: false });

const BookSchema = new mongoose.Schema({
    // --- PHẦN LIÊN QUAN CSDL (GIỮ NGUYÊN) ---
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
        min: 0 
    },
    SoQuyen: { 
        type: Number, 
        required: [true, 'Số lượng quyển không được để trống.'], 
        default: 0, 
        min: 0
    },
    NamXuatBan: { 
        type: Number 
    },
    TacGia: { 
        type: String 
    },
    NXB: { 
        type: PublisherEmbeddedSchema, 
        required: [true, 'Thông tin NXB không được để trống.'] 
    },
    anh_bia: {
        type: String,
        default: "https://res.cloudinary.com/dquwesxem/image/upload/v1764848203/Cover-education-dress-book-read-shelving-tints-and-shades_299485_wh860_ya3gvx.png" // Mặc định rỗng hoặc link ảnh placeholder
    },
}, { 
    versionKey: false,
    collection: 'Sach' // ⚠️ Collection cũ
});

// Export Model tên "Book"
module.exports = mongoose.model('Book', BookSchema);