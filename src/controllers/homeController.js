// ============================================================
// CONTROLLER: Home
// Chức năng: Xử lý logic cho trang chủ — lấy dữ liệu THẬT từ
// MongoDB (qua Mongoose - Buổi 09) và hiển thị ra giao diện
// home.hbs bằng vòng lặp {{#each}} (Buổi 10 - Read Data).
// ============================================================

const postModel = require('../models/postModel');

/**
 * GET /
 * Trang chủ — lấy dữ liệu từ MongoDB rồi render ra view home.hbs
 */
async function showHome(req, res, next) {
  try {
    // Lấy dữ liệu (dùng .lean() bên trong postModel) rồi truyền sang view
    const [posts, allPosts, topics, featuredPost] = await Promise.all([
      postModel.getLatestPosts(4),   // Xem trước 4 bài viết mới nhất (xem tất cả tại /posts)
      postModel.getAllPosts(),
      postModel.getTopicsWithCounts(),  // Danh sách chủ đề (kèm số lượng thực tế)
      postModel.getFeaturedPost()    // Bài viết nổi bật (sidebar)
    ]);

    res.render('home', {
      title: 'Trang chủ',
      posts,
      totalPosts: allPosts.length,
      topics,
      featuredPost,
      subscribed: req.query.subscribed,      // Hiện thông báo sau khi đăng ký nhận tin thành công
      subscribeError: req.query.subscribeError, // Hiện thông báo lỗi nếu thiếu email
      user: req.user                          // Thông tin user đăng nhập (hoặc undefined)
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { showHome };
