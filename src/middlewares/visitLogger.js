// ============================================================
// MIDDLEWARE: Visit Logger
// Chức năng: Ghi log MỖI LƯỢT TRUY CẬP ra terminal, giúp bạn
// thấy ngay trên terminal khi có ai đó vào trang web.
// (Được gắn SAU express.static trong index.js nên các file tĩnh
// CSS/JS/ảnh sẽ không bị log, chỉ log các trang thật + form submit)
// ============================================================

function visitLogger(req, res, next) {
  const time = new Date().toLocaleString('vi-VN');
  const ip = req.ip || req.socket.remoteAddress;
  console.log(`👀 [${time}] ${req.method} ${req.originalUrl}  —  IP: ${ip}`);
  next();
}

module.exports = visitLogger;
