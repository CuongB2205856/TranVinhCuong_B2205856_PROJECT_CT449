// backend/server.js

require("dotenv").config(); // Load biến môi trường từ .env

const app = require("./app");
const config = require("./app/config"); // Chắc chắn folder config/index.js tồn tại
const MongoDB = require("./app/utils/mongodb.util"); // Chắc chắn file này tồn tại

// Start the server
async function startServer() {
  try {
    // Kết nối MongoDB
    await MongoDB.connect(config.db.uri); // Giả định config có cấu trúc này
    console.log("✅ Connected to the database!");

    const PORT = config.app.port || 3000;
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`   - API Readers:    http://localhost:${PORT}/api/readers`);
      console.log(`   - API Books:      http://localhost:${PORT}/api/books`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();