// ============================================================
// MIDDLEWARE: Session Auth
// Chức năng: Kiểm tra session của user — nếu có sessionId hợp lệ
// trong cookie → lưu thông tin user vào req.user để các
// controller phía sau sử dụng.
// ============================================================

const userModel = require('../models/userModel');

function sessionAuth(req, res, next) {
  // Lấy sessionId từ cookies (nếu có)
  const sessionId = req.cookies ? req.cookies.sessionId : null;

  // Kiểm tra: nếu sessionId tồn tại và hợp lệ
  const session = sessionId ? userModel.getSession(sessionId) : null;

  if (session) {
    // Lưu thông tin user vào req.user để sử dụng ở routes/controllers khác
    req.user = session;
  }

  next();
}

module.exports = sessionAuth;
