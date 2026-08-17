// ============================================================
// CẤU HÌNH: Kết nối MongoDB bằng Mongoose
// Chức năng: Tạo kết nối tới MongoDB (Buổi 09).
// index.js chỉ cần gọi connectDB() một lần lúc khởi động server.
// ============================================================

const mongoose = require('mongoose');

// Chuỗi kết nối MongoDB (database: blog_education_dev)
const MONGO_URI = 'mongodb://127.0.0.1:27017/blog_education_dev';

/**
 * Hàm: connectDB
 * Tác dụng: Kết nối tới MongoDB bằng Mongoose
 */
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`🗄️  Đã kết nối MongoDB: ${MONGO_URI}`);
  } catch (error) {
    console.error('❌ Kết nối MongoDB thất bại:', error.message);
  }
}

module.exports = connectDB;
