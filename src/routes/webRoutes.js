// ============================================================
// ROUTES: Kết nối URL (đường dẫn) với Controller tương ứng
// Đây là nơi "liên kết" toàn bộ các route của web lại với nhau.
// index.js chỉ cần gắn (app.use) router này là xong.
// ============================================================

const express = require('express');
const router = express.Router();

// Import các controller
const homeController = require('../controllers/homeController');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const contactController = require('../controllers/contactController');
const adminController = require('../controllers/adminController');

// ---------- Trang chủ ----------
router.get('/', homeController.showHome);

// ---------- Bài viết & Chủ đề ----------
router.get('/posts', postController.listAllPosts);
router.get('/topics', postController.listTopics);
router.get('/topic/:slug', postController.listPostsByTopic);
router.get('/blog/:slug', postController.showPostDetail);

// ---------- Đăng ký / Đăng nhập / Dashboard / Đăng xuất ----------
router.get('/register', authController.showRegisterForm);
router.post('/register', authController.register);
router.get('/login', authController.showLoginForm);
router.post('/login', authController.login);
router.get('/dashboard', authController.showDashboard);
router.get('/logout', authController.logout);

// ---------- Đăng bài mới / Sửa bài / Xóa bài (trong dashboard) ----------
router.post('/dashboard/new-post', postController.createNewPost);
router.get('/dashboard/my-blogs', postController.showMyBlogs);
router.get('/dashboard/edit-post/:slug', postController.showEditForm);
router.post('/dashboard/edit-post/:slug', postController.updatePostHandler);
router.post('/dashboard/delete-post/:slug', postController.deletePost);

// ---------- Liên hệ & Đăng ký nhận tin ----------
router.get('/contact', contactController.showContactPage);
router.post('/contact', contactController.sendContactMessage);
router.post('/newsletter', contactController.subscribeNewsletter);

// ---------- Trang kiểm tra dữ liệu (demo/dev) ----------
router.get('/admin', adminController.showAdminPage);

module.exports = router;
