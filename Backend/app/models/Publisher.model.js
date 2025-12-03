// backend/app/models/Publisher.model.js

const mongoose = require('mongoose');

const PublisherSchema = new mongoose.Schema({
    // --- PHẦN LIÊN QUAN CSDL (GIỮ NGUYÊN) ---
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
    collection: 'NhaXuatBan' // ⚠️ Collection cũ
});

// Export Model tên "Publisher"
module.exports = mongoose.model('Publisher', PublisherSchema);