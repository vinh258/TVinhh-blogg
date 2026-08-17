// ============================================================
// MIDDLEWARE: Cookie Parser
// Chức năng: Đọc cookie từ header "Cookie" của request và gán vào req.cookies
// (Express không tự parse cookie, cần middleware riêng để làm việc này)
// ============================================================

function cookieParser(req, res, next) {
  req.cookies = {};

  const cookieHeader = req.headers.cookie;

  if (cookieHeader) {
    cookieHeader.split(';').forEach((pair) => {
      const separatorIndex = pair.indexOf('=');
      if (separatorIndex === -1) return;

      const name = pair.slice(0, separatorIndex).trim();
      const value = pair.slice(separatorIndex + 1).trim();

      if (name) {
        req.cookies[name] = decodeURIComponent(value);
      }
    });
  }

  next();
}

module.exports = cookieParser;
