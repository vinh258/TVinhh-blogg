// ============================================================
// CONTROLLER: Post & Topic
// Chức năng: Xử lý logic cho các trang liên quan tới bài viết/chủ đề
// (danh sách, phân loại, chi tiết, đăng bài mới, sửa bài, xóa bài).
// ============================================================

const postModel = require('../models/postModel');

/**
 * GET /posts
 * Hiển thị TẤT CẢ bài viết (mục "Bài viết" trên thanh điều hướng)
 */
async function listAllPosts(req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
}

/**
 * GET /topics
 * Hiển thị TẤT CẢ chủ đề/phân loại (mục "Chủ đề" trên thanh điều hướng)
 */
async function listTopics(req, res, next) {
  try {
    const topics = await postModel.getTopicsWithCounts();
    const allPosts = await postModel.getAllPosts();

    res.render('topics', {
      title: 'Chủ đề',
      topics,
      totalPosts: allPosts.length,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /topic/:slug
 * PHÂN LOẠI bài viết — chỉ hiển thị bài viết thuộc 1 chủ đề
 * Ví dụ: /topic/sieu-xe-y → chỉ hiện bài viết chủ đề "Siêu xe Ý"
 */
async function listPostsByTopic(req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
}

/**
 * GET /blog/:slug
 * Hiển thị chi tiết bài viết theo slug
 * Ví dụ: /blog/ferrari-488-gtb-huyen-thoai-y
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
 * GET /dashboard/my-blogs
 * Trang "Quản lý bài viết" dạng bảng — liệt kê toàn bộ bài viết của
 * chính user đang đăng nhập, kèm nút Sửa/Xóa ở mỗi dòng (Buổi 12).
 */
async function showMyBlogs(req, res, next) {
  // Kiểm tra: user đã đăng nhập chưa
  if (!req.user) {
    return res.redirect('/login');
  }

  try {
    const myPosts = await postModel.getPostsByAuthor(req.user.email);

    res.render('my-blogs', { title: 'Quản lý bài viết của tôi', myPosts, user: req.user });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /dashboard/edit-post/:slug
 * Hiển thị form sửa bài viết, điền sẵn dữ liệu cũ (Buổi 12 - Update)
 */
async function showEditForm(req, res, next) {
  // Kiểm tra: user đã đăng nhập chưa
  if (!req.user) {
    return res.redirect('/login');
  }

  try {
    const post = await postModel.getPostBySlug(req.params.slug);

    // Nếu không tìm thấy bài viết → 404
    if (!post) {
      return res.status(404).render('404', { title: 'Không tìm thấy' });
    }

    // Chỉ đúng tác giả mới được sửa bài viết của mình
    if (post.authorEmail !== req.user.email) {
      return res.redirect('/dashboard?error=' + encodeURIComponent('Bạn không có quyền sửa bài viết này'));
    }

    const topics = await postModel.getAllTopics();

    res.render('edit-post', { title: 'Sửa bài viết', post, topics, user: req.user });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /dashboard/edit-post/:slug
 * Nhận dữ liệu từ form sửa, gọi Model để cập nhật vào MongoDB
 */
async function updatePostHandler(req, res, next) {
  // Kiểm tra: user đã đăng nhập chưa
  if (!req.user) {
    return res.redirect('/login');
  }

  try {
    const { title, topicSlug, image, excerpt, content } = req.body;

    const result = await postModel.updatePost(req.params.slug, req.user.email, {
      title,
      topicSlug,
      image,
      excerpt,
      content
    });

    if (!result.success) {
      return res.redirect('/dashboard?error=' + encodeURIComponent(result.error));
    }

    // In ra terminal để bạn kiểm tra
    console.log('✏️  [Đã sửa bài viết]', { slug: result.post.slug, title: result.post.title });

    // Chuyển hướng lại dashboard kèm thông báo sửa thành công
    res.redirect('/dashboard?updated=' + encodeURIComponent(result.post.slug));
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
async function createNewPost(req, res, next) {
  // Kiểm tra: user đã đăng nhập chưa
  if (!req.user) {
    return res.redirect('/login');
  }

  try {
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
  } catch (error) {
    next(error);
  }
}

/**
 * POST /dashboard/delete-post/:slug
 * Xóa 1 bài viết — CHỈ tác giả của bài viết đó mới được xóa
 */
async function deletePost(req, res, next) {
  // Kiểm tra: user đã đăng nhập chưa
  if (!req.user) {
    return res.redirect('/login');
  }

  try {
    const result = await postModel.deletePost(req.params.slug, req.user.email);

    if (!result.success) {
      return res.redirect('/dashboard?error=' + encodeURIComponent(result.error));
    }

    // In ra terminal để bạn kiểm tra
    console.log('🗑️  [Đã xóa bài viết]', { slug: result.post.slug, title: result.post.title, by: req.user.email });

    // Chuyển hướng lại dashboard kèm thông báo xóa thành công
    res.redirect('/dashboard?deleted=' + encodeURIComponent(result.post.title));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listAllPosts,
  listTopics,
  listPostsByTopic,
  showPostDetail,
  showMyBlogs,
  showEditForm,
  updatePostHandler,
  createNewPost,
  deletePost
};
