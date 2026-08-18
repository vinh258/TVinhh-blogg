// ============================================================
// CẤU HÌNH: Kết nối MongoDB bằng Mongoose
// Chức năng: Tạo kết nối tới MongoDB (Buổi 09), đọc chuỗi kết nối
// từ biến môi trường (file .env) thay vì viết cứng trong code (Buổi 13).
// index.js chỉ cần gọi connectDB() một lần lúc khởi động server.
// ============================================================

const mongoose = require('mongoose');

// Ưu tiên lấy chuỗi kết nối từ file .env (biến MONGODB_URI).
// Nếu bạn chưa tạo .env (VD: mới clone code về, chưa làm Buổi 13),
// tự động dùng lại MongoDB local để không bị vỡ các buổi học trước.
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog_education_dev';

/**
 * Hàm: maskPassword
 * Tác dụng: Che mật khẩu khi in chuỗi kết nối ra terminal —
 * TRÁNH lộ mật khẩu thật trong log (VD: khi bạn chụp màn hình gửi hỏi bài)
 */
function maskPassword(uri) {
  return uri.replace(/(:\/\/[^:]+:)([^@]+)(@)/, '$1********$3');
}

/**
 * Hàm: connectDB
 * Tác dụng: Kết nối tới MongoDB bằng Mongoose.
 * Nếu kết nối thất bại → DỪNG HẲN server (thay vì để chạy tiếp trong
 * trạng thái "chưa có DB", gây ra lỗi khó hiểu ở các bước sau như
 * "buffering timed out").
 */
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`🗄️  Đã kết nối MongoDB: ${maskPassword(MONGO_URI)}`);
  } catch (error) {
    console.error('❌ Kết nối MongoDB thất bại:', error.message);
    console.error('👉 Kiểm tra lại: (1) file .env có đúng biến MONGODB_URI chưa, (2) đúng Username/Password chưa, (3) đã "Allow Access from Anywhere" trong Atlas Network Access chưa.');
    process.exit(1); // Dừng hẳn server — không chạy tiếp khi chưa có DB
  }
}

module.exports = connectDB;
