// ============================================================
// CONTROLLER: Admin (trang kiểm tra dữ liệu)
// Chức năng: Xử lý logic cho trang /admin — xem nhanh dữ liệu
// server đang lưu trong bộ nhớ. CHỈ DÙNG ĐỂ DEMO/PHÁT TRIỂN.
// ============================================================

const userModel = require('../models/userModel');
const postModel = require('../models/postModel');

/**
 * GET /admin
 * Trang "kiểm tra dữ liệu" — xem nhanh mọi dữ liệu server đang lưu
 * trong bộ nhớ (users đã đăng ký, ai đang đăng nhập, danh sách nhận tin,
 * tin nhắn liên hệ). CHỈ DÙNG ĐỂ DEMO/PHÁT TRIỂN — trang này KHÔNG có
 * xác thực (auth), không nên public khi triển khai thật.
 */
async function showAdminPage(req, res, next) {
  try {
    const allPosts = await postModel.getAllPosts();

    res.render('admin', {
      title: 'Kiểm tra dữ liệu (Admin)',
      users: userModel.getUsersMasked(),  // Danh sách user đã đăng ký (mật khẩu đã che)
      sessions: userModel.getActiveSessions(),  // Danh sách phiên đang đăng nhập
      newsletterSubscribers: userModel.getNewsletterSubscribers(),
      contactMessages: userModel.getContactMessages(),
      totalPosts: allPosts.length,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { showAdminPage };
