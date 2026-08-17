// ============================================================
// CONTROLLER: Contact & Newsletter
// Chức năng: Xử lý logic cho trang liên hệ và form đăng ký nhận tin.
// ============================================================

const userModel = require('../models/userModel');

/**
 * GET /contact
 * Hiển thị trang liên hệ đầy đủ (thông tin chi tiết)
 */
function showContactPage(req, res) {
  res.render('contact', {
    title: 'Liên hệ',
    sent: req.query.sent,  // Hiện thông báo sau khi gửi tin nhắn thành công
    user: req.user
  });
}

/**
 * POST /contact
 * Xử lý form "Gửi tin nhắn" ở trang /contact
 * Lưu tin nhắn vào bộ nhớ + in ra terminal để kiểm tra
 */
function sendContactMessage(req, res) {
  const { name, email, subject, message } = req.body;

  const result = userModel.addContactMessage({ name, email, subject, message });

  if (!result.success) {
    return res.redirect('/contact');
  }

  // In ra terminal để bạn kiểm tra tin nhắn vừa nhận
  console.log('✉️  [Tin nhắn liên hệ mới]', result.entry);

  res.redirect('/contact?sent=1');
}

/**
 * POST /newsletter
 * Xử lý form "Đăng ký nhận tin" ở sidebar trang chủ
 * Lưu email vào bộ nhớ + in ra terminal để kiểm tra
 */
function subscribeNewsletter(req, res) {
  const { email, message } = req.body;

  const result = userModel.addNewsletterSubscriber({ email, message });

  if (!result.success) {
    return res.redirect('/?subscribeError=1#blog');
  }

  // In ra terminal để bạn kiểm tra dữ liệu vừa nhận
  console.log('📧 [Đăng ký nhận tin mới]', result.entry);

  res.redirect('/?subscribed=1#blog');
}

module.exports = {
  showContactPage,
  sendContactMessage,
  subscribeNewsletter
};
