const mongoose = require('mongoose');
const config = require('../config'); // Tham chiếu đến config/index.js

class MongoDB {
    static async connect() {
        try {
            await mongoose.connect(config.db.uri);
            console.log('✅ MongoDB connection successful.');
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            // Ném lỗi để server.js có thể bắt và thoát ứng dụng
            throw error; 
        }
    }
}

module.exports = MongoDB;