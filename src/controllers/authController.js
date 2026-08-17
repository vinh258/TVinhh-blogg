// ============================================================
// CONTROLLER: Auth (Đăng ký / Đăng nhập / Dashboard / Đăng xuất)
// Chức năng: Xử lý logic xác thực người dùng và trang cá nhân.
// ============================================================

const userModel = require('../models/userModel');
const postModel = require('../models/postModel');

/**
 * GET /register
 * Hiển thị form đăng ký
 */
function showRegisterForm(req, res) {
  res.render('register', { title: 'Đăng ký' });
}

/**
 * POST /register
 * Xử lý form đăng ký — kiểm tra tên, email, mật khẩu hợp lệ
 */
function register(req, res) {
  const { fullName, email, password, confirmPassword } = req.body;

  const result = userModel.registerUser({ fullName, email, password, confirmPassword });

  if (!result.success) {
    return res.render('register', { title: 'Đăng ký', error: result.error });
  }

  // In ra terminal để bạn kiểm tra dữ liệu vừa đăng ký
  console.log('🆕 [Đăng ký thành công]', { fullName, email });

  // Chuyển hướng tới trang đăng nhập với thông báo thành công
  res.redirect('/login?success=Đăng ký thành công. Vui lòng đăng nhập');
}

/**
 * GET /login
 * Hiển thị form đăng nhập
 * Query: success = thông báo từ trang đăng ký
 */
function showLoginForm(req, res) {
  res.render('login', {
    title: 'Đăng nhập',
    success: req.query.success  // Lấy thông báo từ query string (nếu có)
  });
}

/**
 * POST /login
 * Xử lý form đăng nhập — tạo session nếu email & password chính xác
 */
function login(req, res) {
  const { email, password } = req.body;

  const result = userModel.verifyLogin(email, password);

  if (!result.success) {
    return res.render('login', { title: 'Đăng nhập', error: result.error });
  }

  // Tất cả OK → tạo session mới
  const sessionId = userModel.createSession(email, result.user.fullName);

  // In ra terminal để bạn biết ai vừa đăng nhập
  console.log('🔓 [Đăng nhập thành công]', { email, fullName: result.user.fullName });

  // Gửi cookie sessionId cho client (httpOnly = không thể truy cập từ JS, an toàn hơn)
  res.cookie('sessionId', sessionId, {
    httpOnly: true,  // Chỉ server có thể truy cập
    maxAge: 24 * 60 * 60 * 1000  // Có hiệu lực 24 giờ
  });

  // Chuyển hướng tới dashboard
  res.redirect('/dashboard');
}

/**
 * GET /dashboard
 * Hiển thị trang dashboard cá nhân (chỉ user đã đăng nhập)
 */
async function showDashboard(req, res) {
  // Kiểm tra: user đã đăng nhập chưa
  if (!req.user) {
    return res.redirect('/login');
  }

  const [suggestedPosts, myPosts, topics] = await Promise.all([
    postModel.getLatestPosts(3),          // Gợi ý 3 bài viết mới nhất
    postModel.getPostsByAuthor(req.user.email), // Bài viết của chính user này
    postModel.getAllTopics()              // Danh sách chủ đề để chọn khi đăng bài mới
  ]);

  res.render('dashboard', {
    title: 'Dashboard cá nhân',
    user: req.user,
    suggestedPosts,
    myPosts,
    topics,
    published: req.query.published,  // Tiêu đề bài viết vừa đăng thành công (nếu có)
    deleted: req.query.deleted,  // Tên bài viết vừa xóa thành công (nếu có)
    formError: req.query.error  // Thông báo lỗi khi đăng bài / xóa bài (nếu có)
  });
}

/**
 * GET /logout
 * Đăng xuất user — xóa session và cookie
 */
function logout(req, res) {
  const sessionId = req.cookies?.sessionId;

  if (sessionId) {
    userModel.deleteSession(sessionId);
  }

  res.clearCookie('sessionId');
  res.redirect('/');
}

module.exports = {
  showRegisterForm,
  register,
  showLoginForm,
  login,
  showDashboard,
  logout
};
