// ============================================================
// TVinhhh - Server Backend (Node.js + Express)
// Tổ chức theo mô hình MVC (Model - View - Controller):
//   - Model      → src/models/        (dữ liệu + logic nghiệp vụ)
//   - View       → views/             (giao diện .hbs)
//   - Controller → src/controllers/   (xử lý request, gọi Model, trả về View)
//   - Routes     → src/routes/        (liên kết URL ↔ Controller)
//   - Middleware → src/middlewares/   (xử lý request trước khi tới Controller)
// File này CHỈ làm nhiệm vụ khởi động server và liên kết mọi thứ lại,
// không chứa logic nghiệp vụ.
// ============================================================

const express = require('express');            // Framework web
const path = require('path');                  // Xử lý đường dẫn file
const { engine } = require('express-handlebars'); // Template engine

// ---------- Kết nối MongoDB (Buổi 09) ----------
const connectDB = require('./src/config/db');
const { seedIfEmpty } = require('./src/models/postModel');

// ---------- Middlewares tự viết ----------
const cookieParser = require('./src/middlewares/cookieParser');
const sessionAuth = require('./src/middlewares/sessionAuth');
const visitLogger = require('./src/middlewares/visitLogger');

// ---------- Routes (liên kết URL ↔ Controller) ----------
const webRoutes = require('./src/routes/webRoutes');

// ========== CẤU HÌNH SERVER ==========

const app = express();  // Tạo ứng dụng Express
const port = process.env.PORT || 13000;  // Cổng server (localhost:10000)

const publicDir = path.join(__dirname, 'public');  // Thư mục public (CSS, JS, images)
const viewsDir = path.join(__dirname, 'views');    // Thư mục views (HTML templates)

// ========== MIDDLEWARE (Xử lý request trước khi đến routes) ==========

// Phục vụ file tĩnh (CSS, JS, images) từ thư mục public
app.use(express.static(publicDir));

// Ghi log mỗi lượt truy cập ra terminal (đặt SAU static để không log file tĩnh)
app.use(visitLogger);

// Xử lý form data & JSON từ request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Đọc cookie từ header "Cookie" của request → req.cookies
app.use(cookieParser);

// Kiểm tra session đăng nhập → req.user (nếu đã đăng nhập)
app.use(sessionAuth);

// ========== CẤU HÌNH HANDLEBARS TEMPLATE ENGINE ==========

app.engine('hbs', engine({
  extname: '.hbs',  // Phần mở rộng file template
  defaultLayout: 'main',  // File layout mặc định
  layoutsDir: path.join(viewsDir, 'layouts'),  // Thư mục layouts
  partialsDir: path.join(viewsDir, 'partials'),  // Thư mục partials (header, footer)
  helpers: {
    // Helper: so sánh 2 giá trị bằng nhau (dùng trong {{#if (eq a b)}})
    eq: (a, b) => a === b,
    // Helper: định dạng ngày giờ kiểu Việt Nam (dùng trong trang /admin)
    formatDate: (d) => new Date(d).toLocaleString('vi-VN')
  }
}));

app.set('view engine', 'hbs');  // Sử dụng Handlebars làm template engine
app.set('views', viewsDir);  // Thư mục chứa views

// ========== GẮN ROUTES ==========

// Toàn bộ route của web (/, /posts, /topics, /blog/:slug, /login, /dashboard, ...)
// đã được định nghĩa và liên kết với Controller tương ứng trong src/routes/webRoutes.js
app.use('/', webRoutes);

/**
 * ROUTE: Tất cả URL không khớp (404)
 * Tác dụng: Hiển thị trang lỗi 404
 */
app.use((req, res) => {
  res.status(404).render('404', { title: 'Không tìm thấy trang' });
});

// ========== KHỞI ĐỘNG SERVER ==========

async function startServer() {
  // 1. Kết nối MongoDB bằng Mongoose
  await connectDB();

  // 2. Nếu database chưa có dữ liệu → nạp dữ liệu mẫu (chỉ chạy 1 lần đầu tiên)
  await seedIfEmpty();

  // 3. Khởi động server sau khi đã sẵn sàng dữ liệu
  app.listen(port, () => {
    console.log(`✨ TVinhhh đang chạy tại http://localhost:${port}`);
  });
}

startServer();
