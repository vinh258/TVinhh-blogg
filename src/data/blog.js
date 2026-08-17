// ============================================================
// TVinhhh - Dữ liệu Blog (Chủ đề: Siêu xe)
// Chức năng: Lưu trữ danh sách bài viết, chủ đề (phân loại)
// ============================================================

/**
 * ARRAY: topics - Danh sách các chủ đề (dùng để PHÂN LOẠI bài viết)
 * Mỗi chủ đề là một object chứa:
 *   - name: Tên chủ đề hiển thị (ví dụ: Siêu xe Ý)
 *   - slug: Định danh dùng trên URL (ví dụ: sieu-xe-y) → /topic/sieu-xe-y
 *   - icon: Tên icon ionicon
 * Số lượng bài viết (count) của mỗi chủ đề được TÍNH TỰ ĐỘNG trong index.js
 * dựa trên trường "topicSlug" của từng bài viết, không hard-code nữa.
 */
const topics = [
  { name: 'Siêu xe Ý', slug: 'sieu-xe-y', icon: 'flame-outline' },
  { name: 'Siêu xe Đức', slug: 'sieu-xe-duc', icon: 'speedometer-outline' },
  { name: 'Siêu xe Mỹ', slug: 'sieu-xe-my', icon: 'flag-outline' },
  { name: 'Siêu xe Nhật', slug: 'sieu-xe-nhat', icon: 'timer-outline' },
  { name: 'Xe điện hiệu suất cao', slug: 'xe-dien-hieu-suat-cao', icon: 'battery-charging-outline' }
];

/**
 * ARRAY: posts - Danh sách các bài viết blog
 * Mỗi bài viết là một object chứa:
 *   - slug: URL friendly (ví dụ: ferrari-488-gtb-huyen-thoai)
 *   - title: Tiêu đề bài viết
 *   - topic: Tên chủ đề hiển thị (phải khớp với topics[].name)
 *   - topicSlug: Định danh chủ đề dùng để PHÂN LOẠI (phải khớp topics[].slug)
 *   - excerpt: Mô tả ngắn của bài viết
 *   - author: Tên tác giả
 *   - authorAvatar: URL ảnh đại diện tác giả
 *   - date: Ngày đăng (định dạng YYYY-MM-DD)
 *   - dateFormatted: Ngày đăng định dạng đẹp (ví dụ: 10 Th07, 2026)
 *   - readTime: Thời gian đọc (phút)
 *   - views: Lượt xem (dùng để hiển thị bài viết nổi bật)
 *   - image: URL ảnh thumbnail bài viết
 *   - featured: true nếu là bài viết nổi bật (hiển thị ở sidebar)
 */
const posts = [
  // ---------- Siêu xe Ý ----------
  {
    slug: 'ferrari-488-gtb-huyen-thoai-y',
    title: 'Ferrari 488 GTB: Biểu tượng siêu xe nước Ý',
    topic: 'Siêu xe Ý',
    topicSlug: 'sieu-xe-y',
    excerpt: 'Khám phá Ferrari 488 GTB — cỗ máy V8 twin-turbo mang tinh thần đua xe Công thức 1 vào một chiếc xe đường phố.',
    author: 'Minh Anh',
    authorAvatar: 'https://i.pravatar.cc/100?img=32',
    date: '2026-07-14',
    dateFormatted: '14 Th07, 2026',
    readTime: 6,
    views: 2450,
    image: 'https://images.unsplash.com/photo-1517876961536-0b1019bcabbc?w=600&h=400&fit=crop',
    featured: true
  },
  {
    slug: 'lamborghini-aventador-vang-ruc-ro',
    title: 'Lamborghini Aventador: Khi thiết kế táo bạo gặp sức mạnh V12',
    topic: 'Siêu xe Ý',
    topicSlug: 'sieu-xe-y',
    excerpt: 'Lamborghini Aventador nổi bật với đường nét góc cạnh và khối động cơ V12 hút khí tự nhiên hiếm hoi còn sót lại.',
    author: 'Hoàng Long',
    authorAvatar: 'https://i.pravatar.cc/100?img=12',
    date: '2026-07-12',
    dateFormatted: '12 Th07, 2026',
    readTime: 5,
    views: 1890,
    image: 'https://images.unsplash.com/photo-1551522196-26106cbc819e?w=600&h=400&fit=crop'
  },

  // ---------- Siêu xe Đức ----------
  {
    slug: 'porsche-911-bieu-tuong-vuot-thoi-gian',
    title: 'Porsche 911: Biểu tượng thiết kế vượt thời gian',
    topic: 'Siêu xe Đức',
    topicSlug: 'sieu-xe-duc',
    excerpt: 'Hơn 60 năm phát triển nhưng Porsche 911 vẫn giữ nguyên hình bóng đặc trưng — sự cân bằng hoàn hảo giữa hiệu năng và thực dụng.',
    author: 'Thu Hà',
    authorAvatar: 'https://i.pravatar.cc/100?img=45',
    date: '2026-07-10',
    dateFormatted: '10 Th07, 2026',
    readTime: 7,
    views: 2103,
    image: 'https://images.unsplash.com/photo-1618849985511-7dbc48d7d2e4?w=600&h=400&fit=crop'
  },
  {
    slug: 'bmw-m4-sedan-hieu-suat-cao',
    title: 'BMW M4: Tinh thần thể thao Đức trong từng khúc cua',
    topic: 'Siêu xe Đức',
    topicSlug: 'sieu-xe-duc',
    excerpt: 'BMW M4 kết hợp động cơ 6 xy-lanh thẳng hàng mạnh mẽ với khung gầm được tinh chỉnh riêng cho những cung đường đèo.',
    author: 'Quốc Bảo',
    authorAvatar: 'https://i.pravatar.cc/100?img=68',
    date: '2026-07-08',
    dateFormatted: '08 Th07, 2026',
    readTime: 5,
    views: 1320,
    image: 'https://images.unsplash.com/photo-1741531472824-b3fc55e2ff9c?w=600&h=400&fit=crop'
  },

  // ---------- Siêu xe Mỹ ----------
  {
    slug: 'chevrolet-corvette-c8-gia-tot-suc-manh-lon',
    title: 'Chevrolet Corvette C8: Siêu xe Mỹ với mức giá dễ chịu',
    topic: 'Siêu xe Mỹ',
    topicSlug: 'sieu-xe-my',
    excerpt: 'Lần đầu tiên trong lịch sử, Corvette chuyển sang bố trí động cơ giữa — mang lại khả năng vận hành ngang tầm siêu xe châu Âu.',
    author: 'Anh Tuấn',
    authorAvatar: 'https://i.pravatar.cc/100?img=15',
    date: '2026-07-06',
    dateFormatted: '06 Th07, 2026',
    readTime: 6,
    views: 1675,
    image: 'https://images.unsplash.com/photo-1750459273476-9219207066c2?w=600&h=400&fit=crop'
  },
  {
    slug: 'dodge-viper-huyen-thoai-v10-my',
    title: 'Dodge Viper: Huyền thoại động cơ V10 của nước Mỹ',
    topic: 'Siêu xe Mỹ',
    topicSlug: 'sieu-xe-my',
    excerpt: 'Không trợ lực, không khoan nhượng — Dodge Viper là bài kiểm tra bản lĩnh thực sự dành cho những tay lái đam mê tốc độ thuần túy.',
    author: 'Ngọc Trâm',
    authorAvatar: 'https://i.pravatar.cc/100?img=47',
    date: '2026-07-04',
    dateFormatted: '04 Th07, 2026',
    readTime: 5,
    views: 980,
    image: 'https://images.unsplash.com/photo-1741197696826-490c99db3e8c?w=600&h=400&fit=crop'
  },

  // ---------- Siêu xe Nhật ----------
  {
    slug: 'nissan-gtr-quai-vat-nhat-ban',
    title: 'Nissan GT-R: "Quái vật" đến từ Nhật Bản',
    topic: 'Siêu xe Nhật',
    topicSlug: 'sieu-xe-nhat',
    excerpt: 'Với hệ dẫn động 4 bánh thông minh và hộp số ly hợp kép, GT-R từng khiến nhiều siêu xe châu Âu đắt gấp nhiều lần phải dè chừng.',
    author: 'Minh Anh',
    authorAvatar: 'https://i.pravatar.cc/100?img=32',
    date: '2026-07-02',
    dateFormatted: '02 Th07, 2026',
    readTime: 6,
    views: 2210,
    image: 'https://images.unsplash.com/photo-1750181854463-ea89e622162d?w=600&h=400&fit=crop'
  },
  {
    slug: 'toyota-supra-tro-lai-ngoan-muc',
    title: 'Toyota Supra: Cuộc trở lại ngoạn mục sau nhiều năm vắng bóng',
    topic: 'Siêu xe Nhật',
    topicSlug: 'sieu-xe-nhat',
    excerpt: 'Sau gần 2 thập kỷ tạm biệt, Toyota Supra thế hệ mới quay trở lại với thiết kế cuốn hút và hiệu năng đáng nể.',
    author: 'Hoàng Long',
    authorAvatar: 'https://i.pravatar.cc/100?img=12',
    date: '2026-06-30',
    dateFormatted: '30 Th06, 2026',
    readTime: 4,
    views: 1450,
    image: 'https://images.unsplash.com/photo-1574921591060-1e526cb9f6f7?w=600&h=400&fit=crop'
  },

  // ---------- Xe điện hiệu suất cao ----------
  {
    slug: 'porsche-taycan-dien-hoa-tinh-than-porsche',
    title: 'Porsche Taycan: Điện hóa tinh thần thể thao Porsche',
    topic: 'Xe điện hiệu suất cao',
    topicSlug: 'xe-dien-hieu-suat-cao',
    excerpt: 'Porsche Taycan chứng minh xe điện vẫn có thể mang trọn cảm giác lái đặc trưng của một chiếc Porsche đích thực.',
    author: 'Thu Hà',
    authorAvatar: 'https://i.pravatar.cc/100?img=45',
    date: '2026-06-28',
    dateFormatted: '28 Th06, 2026',
    readTime: 6,
    views: 1120,
    image: 'https://images.unsplash.com/photo-1695121350962-30576570db02?w=600&h=400&fit=crop'
  },
  {
    slug: 'tesla-toc-do-sac-nhanh-cach-mang-dien',
    title: 'Tesla và cuộc cách mạng sạc nhanh cho xe hiệu suất cao',
    topic: 'Xe điện hiệu suất cao',
    topicSlug: 'xe-dien-hieu-suat-cao',
    excerpt: 'Không chỉ nhanh khi tăng tốc, hệ thống Supercharger của Tesla còn định nghĩa lại trải nghiệm sạc điện cho xe hiệu suất cao.',
    author: 'Quốc Bảo',
    authorAvatar: 'https://i.pravatar.cc/100?img=68',
    date: '2026-06-26',
    dateFormatted: '26 Th06, 2026',
    readTime: 5,
    views: 860,
    image: 'https://images.unsplash.com/photo-1554744512-783e8dc69b10?w=600&h=400&fit=crop'
  }
];

/**
 * EXPORT: Xuất dữ liệu để sử dụng trong file index.js
 */
module.exports = { posts, topics };