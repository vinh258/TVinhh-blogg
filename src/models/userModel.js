// ============================================================
// MODEL: User, Session, Newsletter, Contact
// Chức năng: Lưu trữ dữ liệu người dùng/phiên đăng nhập/tin nhắn
// + toàn bộ logic xử lý liên quan. Đây là tầng "Model" trong MVC.
// LƯU Ý: Dữ liệu lưu trong bộ nhớ (RAM) — mất hết khi restart server
// vì đây là project demo, chưa kết nối database thật.
// ============================================================

// Map lưu thông tin users (email → {fullName, email, password})
const users = new Map();

// Map lưu thông tin sessions (sessionId → {email, fullName})
const sessions = new Map();

// Mảng lưu danh sách email đã đăng ký nhận tin (từ form "Đăng ký nhận tin" ở trang chủ)
const newsletterSubscribers = [];

// Mảng lưu tin nhắn liên hệ (từ form ở trang /contact)
const contactMessages = [];

/**
 * Hàm: findUserByEmail
 * Tác dụng: Tìm user theo email
 */
function findUserByEmail(email) {
  return users.get(email);
}

/**
 * Hàm: registerUser
 * Tác dụng: Đăng ký user mới sau khi kiểm tra hợp lệ
 * Trả về: { success, error }
 */
function registerUser({ fullName, email, password, confirmPassword }) {
  // Kiểm tra: tất cả trường đều được điền
  if (!fullName || !email || !password || !confirmPassword) {
    return { success: false, error: 'Vui lòng điền đầy đủ thông tin' };
  }

  // Kiểm tra: mật khẩu và xác nhận mật khẩu khớp
  if (password !== confirmPassword) {
    return { success: false, error: 'Mật khẩu không trùng khớp' };
  }

  // Kiểm tra: email chưa được sử dụng
  if (users.has(email)) {
    return { success: false, error: 'Email đã được sử dụng' };
  }

  // Tất cả kiểm tra OK → lưu user vào users map
  users.set(email, { fullName, email, password });

  return { success: true };
}

/**
 * Hàm: verifyLogin
 * Tác dụng: Kiểm tra email/password đăng nhập có chính xác không
 * Trả về: { success, error, user }
 */
function verifyLogin(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Vui lòng điền đầy đủ thông tin' };
  }

  const user = users.get(email);

  if (!user || user.password !== password) {
    return { success: false, error: 'Email hoặc mật khẩu không chính xác' };
  }

  return { success: true, user };
}

/**
 * Hàm: createSession
 * Tác dụng: Tạo 1 phiên đăng nhập mới, trả về sessionId
 */
function createSession(email, fullName) {
  const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36);
  sessions.set(sessionId, { email, fullName });
  return sessionId;
}

/**
 * Hàm: getSession
 * Tác dụng: Lấy thông tin user từ sessionId (nếu hợp lệ)
 */
function getSession(sessionId) {
  return sessions.get(sessionId);
}

/**
 * Hàm: deleteSession
 * Tác dụng: Xóa 1 phiên đăng nhập (dùng khi logout)
 */
function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

/**
 * Hàm: addNewsletterSubscriber
 * Tác dụng: Lưu 1 lượt đăng ký nhận tin
 * Trả về: { success, entry }
 */
function addNewsletterSubscriber({ email, message }) {
  if (!email || !email.trim()) {
    return { success: false };
  }

  const entry = { email: email.trim(), message: message ? message.trim() : '', time: new Date() };
  newsletterSubscribers.push(entry);
  return { success: true, entry };
}

/**
 * Hàm: addContactMessage
 * Tác dụng: Lưu 1 tin nhắn liên hệ
 * Trả về: { success, entry }
 */
function addContactMessage({ name, email, subject, message }) {
  if (!name || !email || !message) {
    return { success: false };
  }

  const entry = {
    name: name.trim(),
    email: email.trim(),
    subject: subject ? subject.trim() : '',
    message: message.trim(),
    time: new Date()
  };
  contactMessages.push(entry);
  return { success: true, entry };
}

/**
 * Hàm: getUsersMasked
 * Tác dụng: Lấy danh sách user đã đăng ký, mật khẩu được che bớt (dùng cho trang /admin)
 */
function getUsersMasked() {
  return Array.from(users.values()).map((u) => ({
    ...u,
    password: u.password.slice(0, 2) + '•'.repeat(Math.max(u.password.length - 2, 3))
  }));
}

/**
 * Hàm: getActiveSessions
 * Tác dụng: Lấy danh sách các phiên đang đăng nhập (dùng cho trang /admin)
 */
function getActiveSessions() {
  return Array.from(sessions.values());
}

/**
 * Hàm: getNewsletterSubscribers / getContactMessages
 * Tác dụng: Lấy danh sách đăng ký nhận tin / tin nhắn liên hệ (dùng cho trang /admin)
 */
function getNewsletterSubscribers() {
  return newsletterSubscribers;
}

function getContactMessages() {
  return contactMessages;
}

module.exports = {
  findUserByEmail,
  registerUser,
  verifyLogin,
  createSession,
  getSession,
  deleteSession,
  addNewsletterSubscriber,
  addContactMessage,
  getUsersMasked,
  getActiveSessions,
  getNewsletterSubscribers,
  getContactMessages
};
