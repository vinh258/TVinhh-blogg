// ============================================================
// MODEL: Post & Topic (Buổi 09: đã kết nối MongoDB bằng Mongoose)
// Chức năng: Định nghĩa Schema/Model Mongoose + toàn bộ logic xử lý
// liên quan (tìm kiếm, lọc, tạo mới, xóa...) làm việc trực tiếp
// với MongoDB thay vì mảng dữ liệu giả (dummy data) như trước.
// Đây là tầng "Model" trong mô hình MVC — Controller sẽ gọi các
// hàm ở đây, KHÔNG được thao tác trực tiếp với Mongoose Model.
// ============================================================

const mongoose = require('mongoose');
const { posts: seedPosts, topics: seedTopics } = require('../data/blog'); // Chỉ dùng để NẠP DỮ LIỆU MẪU ban đầu vào MongoDB

// ---------- Schema: Topic (chủ đề) ----------
const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String }
}, { versionKey: false });

// ---------- Schema: Post (bài viết) ----------
const postSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  topic: { type: String, required: true },
  topicSlug: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, default: '' },
  author: { type: String },
  authorEmail: { type: String },
  authorAvatar: { type: String },
  date: { type: String },
  dateFormatted: { type: String },
  readTime: { type: Number, default: 1 },
  views: { type: Number, default: 0 },
  image: { type: String },
  featured: { type: Boolean, default: false }
}, { versionKey: false });

// Tránh lỗi "OverwriteModelError" khi nodemon reload
const Topic = mongoose.models.Topic || mongoose.model('Topic', topicSchema);
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

/**
 * Hàm: seedIfEmpty
 * Tác dụng: Nạp dữ liệu mẫu (từ src/data/blog.js) vào MongoDB
 * NHƯNG chỉ khi collection đang RỖNG (lần chạy đầu tiên).
 * Được gọi 1 lần ở index.js lúc khởi động server.
 */
async function seedIfEmpty() {
  const topicCount = await Topic.countDocuments();
  if (topicCount === 0) {
    await Topic.insertMany(seedTopics);
    console.log('🌱 Đã nạp dữ liệu mẫu: topics');
  }

  const postCount = await Post.countDocuments();
  if (postCount === 0) {
    await Post.insertMany(seedPosts);
    console.log('🌱 Đã nạp dữ liệu mẫu: posts');
  }
}

/**
 * Hàm: toSlug
 * Tác dụng: Chuyển tiêu đề tiếng Việt có dấu thành slug URL-friendly
 * Ví dụ: "Bí quyết sống khỏe" → "bi-quyet-song-khoe"
 */
function toSlug(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Xóa dấu (thanh điệu)
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')  // Xóa ký tự đặc biệt
    .replace(/\s+/g, '-')  // Khoảng trắng → gạch ngang
    .replace(/-+/g, '-')  // Gộp nhiều gạch ngang liên tiếp
    .replace(/^-|-$/g, '');  // Xóa gạch ngang ở đầu/cuối
}

/**
 * Hàm: formatDateVi
 * Tác dụng: Định dạng ngày kiểu Việt Nam, ví dụ: "20 Th07, 2026"
 */
function formatDateVi(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day} Th${month}, ${date.getFullYear()}`;
}

/**
 * Hàm: getAllPosts
 * Tác dụng: Lấy toàn bộ danh sách bài viết từ MongoDB
 */
async function getAllPosts() {
  return Post.find().sort({ date: -1 }).lean();
}

/**
 * Hàm: getLatestPosts
 * Tác dụng: Lấy n bài viết mới nhất (dùng cho trang chủ, gợi ý...)
 */
async function getLatestPosts(limit) {
  return Post.find().sort({ date: -1 }).limit(limit).lean();
}

/**
 * Hàm: getFeaturedPost
 * Tác dụng: Lấy bài viết nổi bật (featured: true), nếu không có thì lấy bài mới nhất
 */
async function getFeaturedPost() {
  const featured = await Post.findOne({ featured: true }).lean();
  if (featured) return featured;
  return Post.findOne().sort({ date: -1 }).lean();
}

/**
 * Hàm: getAllTopics
 * Tác dụng: Lấy danh sách chủ đề gốc (chưa tính số lượng)
 */
async function getAllTopics() {
  return Topic.find().lean();
}

/**
 * Hàm: getTopicsWithCounts
 * Tác dụng: Tính số lượng bài viết THỰC TẾ cho từng chủ đề (phân loại)
 * dựa trên trường topicSlug của mỗi bài viết trong MongoDB,
 * thay vì số đếm cố định.
 * Param: activeSlug - slug của chủ đề đang được chọn (để đánh dấu "active")
 */
async function getTopicsWithCounts(activeSlug) {
  const topics = await Topic.find().lean();

  const counted = await Promise.all(
    topics.map(async (topic) => ({
      ...topic,
      count: await Post.countDocuments({ topicSlug: topic.slug }),
      active: topic.slug === activeSlug
    }))
  );

  return counted;
}

/**
 * Hàm: findTopicBySlug
 * Tác dụng: Tìm 1 chủ đề theo slug
 */
async function findTopicBySlug(slug) {
  return Topic.findOne({ slug }).lean();
}

/**
 * Hàm: getPostsByTopic
 * Tác dụng: PHÂN LOẠI bài viết — trả về các bài viết thuộc 1 chủ đề
 */
async function getPostsByTopic(topicSlug) {
  return Post.find({ topicSlug }).sort({ date: -1 }).lean();
}

/**
 * Hàm: getPostBySlug
 * Tác dụng: Tìm 1 bài viết theo slug (dùng cho trang chi tiết)
 */
async function getPostBySlug(slug) {
  return Post.findOne({ slug }).lean();
}

/**
 * Hàm: getRelatedPosts
 * Tác dụng: Lấy các bài viết liên quan (cùng chủ đề, không tính chính nó)
 * Nếu không có bài cùng chủ đề → lấy tạm các bài mới nhất khác
 */
async function getRelatedPosts(post, limit = 2) {
  const sameTopicPosts = await Post.find({
    topicSlug: post.topicSlug,
    slug: { $ne: post.slug }
  }).limit(limit).lean();

  if (sameTopicPosts.length) {
    return sameTopicPosts;
  }

  return Post.find({ slug: { $ne: post.slug } }).limit(limit).lean();
}

/**
 * Hàm: createPost
 * Tác dụng: Tạo 1 bài viết mới, lưu vào MongoDB
 * Param: data - { title, topicSlug, image, excerpt, content, author, authorEmail }
 * Trả về: { success, error, post }
 */
async function createPost(data) {
  const { title, topicSlug, image, excerpt, content, author, authorEmail } = data;

  // Kiểm tra: các trường bắt buộc phải được điền
  if (!title || !title.trim() || !topicSlug || !excerpt || !excerpt.trim()) {
    return { success: false, error: 'Vui lòng điền đầy đủ Tiêu đề, Chủ đề và Mô tả ngắn' };
  }

  // Tìm chủ đề tương ứng (nếu không hợp lệ → dùng chủ đề đầu tiên)
  const topic = (await findTopicBySlug(topicSlug)) || (await Topic.findOne().lean());

  // Tạo slug duy nhất từ tiêu đề (tránh trùng với bài viết đã có trong MongoDB)
  const baseSlug = toSlug(title) || 'bai-viet';
  let uniqueSlug = baseSlug;
  let counter = 2;
  while (await Post.exists({ slug: uniqueSlug })) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  const now = new Date();

  // Ước tính thời gian đọc dựa trên số từ của nội dung
  const wordCount = (content && content.trim() ? content : excerpt).trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const newPost = await Post.create({
    slug: uniqueSlug,
    title: title.trim(),
    topic: topic.name,
    topicSlug: topic.slug,
    excerpt: excerpt.trim(),
    content: content ? content.trim() : '',
    author,
    authorEmail,
    authorAvatar: `https://i.pravatar.cc/100?u=${encodeURIComponent(authorEmail)}`,
    date: now.toISOString().slice(0, 10),
    dateFormatted: formatDateVi(now),
    readTime,
    views: 0,
    image: (image && image.trim()) || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop',
    featured: false
  });

  return { success: true, post: newPost.toObject() };
}

/**
 * Hàm: deletePost
 * Tác dụng: Xóa 1 bài viết trong MongoDB — CHỈ khi authorEmail trùng khớp (đúng chủ sở hữu)
 * Trả về: { success, error, post }
 */
async function deletePost(slug, authorEmail) {
  const post = await Post.findOne({ slug }).lean();

  if (!post) {
    return { success: false, error: 'Không tìm thấy bài viết cần xóa' };
  }

  if (post.authorEmail !== authorEmail) {
    return { success: false, error: 'Bạn không có quyền xóa bài viết này' };
  }

  await Post.deleteOne({ slug });
  return { success: true, post };
}

/**
 * Hàm: getPostsByAuthor
 * Tác dụng: Lấy các bài viết do 1 user cụ thể đăng (dùng cho dashboard)
 */
async function getPostsByAuthor(authorEmail) {
  return Post.find({ authorEmail }).sort({ date: -1 }).lean();
}

module.exports = {
  seedIfEmpty,
  toSlug,
  formatDateVi,
  getAllPosts,
  getLatestPosts,
  getFeaturedPost,
  getAllTopics,
  getTopicsWithCounts,
  findTopicBySlug,
  getPostsByTopic,
  getPostBySlug,
  getRelatedPosts,
  createPost,
  deletePost,
  getPostsByAuthor
};
