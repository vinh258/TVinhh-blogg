// ============================================================
// CONTROLLER: Post & Topic
// Chức năng: Xử lý logic cho các trang liên quan tới bài viết/chủ đề
// (danh sách, phân loại, chi tiết, đăng bài mới, xóa bài).
// ============================================================

const postModel = require('../models/postModel');

/**
 * GET /posts
 * Hiển thị TẤT CẢ bài viết (mục "Bài viết" trên thanh điều hướng)
 */
async function listAllPosts(req, res) {
  const posts = await postModel.getAllPosts();
  const topics = await postModel.getTopicsWithCounts();

  res.render('posts', {
    title: 'Tất cả bài viết',
    pageHeading: 'Tất cả bài viết',
    pageSubtitle: `Tổng cộng ${posts.length} bài viết trên TVinhhh`,
    posts,
    topics,
    showAllActive: true,
    user: req.user
  });
}

/**
 * GET /topics
 * Hiển thị TẤT CẢ chủ đề/phân loại (mục "Chủ đề" trên thanh điều hướng)
 */
async function listTopics(req, res) {
  const topics = await postModel.getTopicsWithCounts();
  const allPosts = await postModel.getAllPosts();

  res.render('topics', {
    title: 'Chủ đề',
    topics,
    totalPosts: allPosts.length,
    user: req.user
  });
}

/**
 * GET /topic/:slug
 * PHÂN LOẠI bài viết — chỉ hiển thị bài viết thuộc 1 chủ đề
 * Ví dụ: /topic/lap-trinh → chỉ hiện bài viết chủ đề "Lập trình"
 */
async function listPostsByTopic(req, res) {
  const slug = req.params.slug;
  const topic = await postModel.findTopicBySlug(slug);

  // Nếu chủ đề không tồn tại → hiển thị lỗi 404
  if (!topic) {
    return res.status(404).render('404', { title: 'Không tìm thấy' });
  }

  const filteredPosts = await postModel.getPostsByTopic(slug);
  const topics = await postModel.getTopicsWithCounts(slug);

  res.render('posts', {
    title: topic.name,
    pageHeading: topic.name,
    pageSubtitle: `${filteredPosts.length} bài viết thuộc chủ đề "${topic.name}"`,
    posts: filteredPosts,
    topics,
    showAllActive: false,
    user: req.user
  });
}

/**
 * GET /blog/:slug
 * Hiển thị chi tiết bài viết theo slug
 * Ví dụ: /blog/nodejs-express-blog
 */
async function showPostDetail(req, res, next) {
  try {
    const post = await postModel.getPostBySlug(req.params.slug);

    // Nếu không tìm thấy → hiển thị lỗi 404
    if (!post) {
      return res.status(404).render('404', { title: 'Không tìm thấy' });
    }

    // Tách nội dung bài viết (nếu có) thành từng đoạn văn riêng để hiển thị
    const postView = {
      ...post,
      contentParagraphs: post.content
        ? post.content.split(/\r?\n+/).map((p) => p.trim()).filter(Boolean)
        : []
    };

    const relatedPosts = await postModel.getRelatedPosts(post, 2);

    res.render('post', { title: post.title, post: postView, relatedPosts, user: req.user });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /dashboard/new-post
 * Xử lý form "Đăng bài viết mới" trong dashboard
 * Bài viết mới sẽ được thêm vào đầu danh sách posts và hiển thị
 * ngay trên trang chủ, /posts, /topic/:slug và trang chi tiết.
 */
async function createNewPost(req, res) {
  // Kiểm tra: user đã đăng nhập chưa
  if (!req.user) {
    return res.redirect('/login');
  }

  const { title, topicSlug, image, excerpt, content } = req.body;

  const result = await postModel.createPost({
    title,
    topicSlug,
    image,
    excerpt,
    content,
    author: req.user.fullName,
    authorEmail: req.user.email
  });

  if (!result.success) {
    return res.redirect('/dashboard?error=' + encodeURIComponent(result.error));
  }

  // In ra terminal để bạn kiểm tra bài viết vừa đăng
  console.log('📝 [Đăng bài mới]', { slug: result.post.slug, title: result.post.title, author: result.post.author });

  // Chuyển hướng lại dashboard kèm thông báo đăng bài thành công
  res.redirect('/dashboard?published=' + encodeURIComponent(result.post.slug));
}

/**
 * POST /dashboard/delete-post/:slug
 * Xóa 1 bài viết — CHỈ tác giả của bài viết đó mới được xóa
 */
async function deletePost(req, res) {
  // Kiểm tra: user đã đăng nhập chưa
  if (!req.user) {
    return res.redirect('/login');
  }

  const result = await postModel.deletePost(req.params.slug, req.user.email);

  if (!result.success) {
    return res.redirect('/dashboard?error=' + encodeURIComponent(result.error));
  }

  // In ra terminal để bạn kiểm tra
  console.log('🗑️  [Đã xóa bài viết]', { slug: result.post.slug, title: result.post.title, by: req.user.email });

  // Chuyển hướng lại dashboard kèm thông báo xóa thành công
  res.redirect('/dashboard?deleted=' + encodeURIComponent(result.post.title));
}

module.exports = {
  listAllPosts,
  listTopics,
  listPostsByTopic,
  showPostDetail,
  createNewPost,
  deletePost
};
