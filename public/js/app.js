// ============================================================
// TVinhhh - Main JavaScript File
// Chức năng: Quản lý chế độ sáng/tối, menu di động, form
// ============================================================

// ========== PHẦN 1: QUẢN LÝ CHÍNH ĐỀ (LIGHT/DARK MODE) ==========

// Lấy phần tử <html> gốc của trang để thêm/xóa class theme
const html = document.documentElement;

// Tên khóa để lưu giá trị theme vào localStorage (bộ nhớ trình duyệt)
const themeKey = 'tvinhhh-theme';

/**
 * Hàm: Lấy chế độ theme đã lưu từ bộ nhớ trình duyệt
 * Return: 'dark', 'light', hoặc null nếu chưa lưu
 * Tác dụng: Kiểm tra người dùng đang dùng theme nào
 */
function getStoredTheme() {
  return localStorage.getItem(themeKey);
}

/**
 * Hàm: Áp dụng chế độ theme cho toàn trang
 * Param: theme - 'dark' hoặc 'light'
 * Tác dụng: 
 *   - Thêm/xóa class CSS để thay đổi giao diện
 *   - Cập nhật biểu tượng nút theme (mặt trăng/mặt trời)
 */
function applyTheme(theme) {
  // Kiểm tra: nếu theme = 'dark' thì isDark = true, ngược lại = false
  const isDark = theme === 'dark';
  
  // Xóa tất cả class theme cũ
  html.classList.remove('light-theme', 'dark-theme');
  
  // Thêm class theme mới (nếu dark thì thêm 'dark-theme', còn không thì 'light-theme')
  html.classList.add(isDark ? 'dark-theme' : 'light-theme');

  // Cập nhật tất cả nút theme
  document.querySelectorAll('.theme-btn').forEach((btn) => {
    // Xóa class 'light' hoặc 'dark' cũ
    btn.classList.remove('light', 'dark');
    // Thêm class mới để hiển thị icon đúng
    btn.classList.add(isDark ? 'dark' : 'light');
  });
}

/**
 * Hàm: Chuyển đổi giữa chế độ sáng và tối
 * Tác dụng:
 *   - Kiểm tra theme hiện tại
 *   - Đổi sang theme đối diện
 *   - Lưu lựa chọn vào localStorage (để lần tới vẫn nhớ)
 */
function toggleTheme() {
  // Kiểm tra: nếu đang là dark-theme thì chuyển sang 'light', ngược lại chuyển sang 'dark'
  const next = html.classList.contains('dark-theme') ? 'light' : 'dark';
  
  // Lưu theme vào bộ nhớ trình duyệt
  localStorage.setItem(themeKey, next);
  
  // Áp dụng theme mới
  applyTheme(next);
}

// Khi trang tải lần đầu, áp dụng theme đã lưu (hoặc mặc định 'light')
applyTheme(getStoredTheme() || 'light');

// Gắn sự kiện click cho tất cả nút theme
document.querySelectorAll('.theme-btn').forEach((btn) => {
  // Khi click nút → gọi hàm toggleTheme để chuyển đổi theme
  btn.addEventListener('click', toggleTheme);
});

// ========== PHẦN 2: QUẢN LÝ MENU DI ĐỘNG (MOBILE MENU) ==========

// Lấy phần tử menu di động
const mobileNav = document.querySelector('.mobile-nav');

// Lấy lớp phủ tối phía sau menu di động
const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');

// Lấy nút mở menu (hamburger icon)
const navMenuBtn = document.querySelector('.nav-menu-btn');

// Lấy nút đóng menu (X icon)
const navCloseBtn = document.querySelector('.nav-close-btn');

/**
 * Hàm: Mở menu di động
 * Tác dụng:
 *   - Thêm class 'active' để hiển thị menu + lớp phủ
 *   - Ẩn thanh cuộn (scroll) khi menu mở
 */
function openMobileNav() {
  // Thêm class 'active' để làm menu xuất hiện (CSS sẽ hiển thị)
  mobileNav?.classList.add('active');
  mobileNavOverlay?.classList.add('active');

  // Ẩn thanh cuộn trang (overflow: hidden) để người dùng không thể cuộn khi menu mở
  document.body.style.overflow = 'hidden';
}

/**
 * Hàm: Đóng menu di động
 * Tác dụng:
 *   - Xóa class 'active' để ẩn menu + lớp phủ
 *   - Cho phép cuộn trang trở lại
 */
function closeMobileNav() {
  // Xóa class 'active' để ẩn menu
  mobileNav?.classList.remove('active');
  mobileNavOverlay?.classList.remove('active');

  // Đóng luôn dropdown "Liên hệ" bên trong menu di động (nếu đang mở)
  closeAllContactDropdowns();

  // Cho phép cuộn lại (overflow: auto hoặc '')
  document.body.style.overflow = '';
}

// Gắn sự kiện click cho nút mở menu (hamburger icon)
// ?.addEventListener = kiểm tra nếu nút tồn tại mới thêm sự kiện
navMenuBtn?.addEventListener('click', openMobileNav);

// Gắn sự kiện click cho nút đóng menu (X icon)
navCloseBtn?.addEventListener('click', closeMobileNav);

// Click vào lớp phủ tối (bên ngoài menu) → cũng đóng menu
mobileNavOverlay?.addEventListener('click', closeMobileNav);

// Khi click vào bất kỳ link nào trong menu → tự động đóng menu
mobileNav?.querySelectorAll('.nav-link').forEach((link) => {
  // Lặp qua tất cả link
  link.addEventListener('click', closeMobileNav);
});

// ========== PHẦN 3: DROPDOWN THÔNG TIN LIÊN HỆ ==========

/**
 * Hàm: Đóng tất cả dropdown "Liên hệ" đang mở (desktop + mobile)
 */
function closeAllContactDropdowns() {
  document.querySelectorAll('.contact-dropdown.active').forEach((panel) => {
    panel.classList.remove('active');
  });
  document.querySelectorAll('.contact-trigger').forEach((trigger) => {
    trigger.setAttribute('aria-expanded', 'false');
  });
}

// Gắn sự kiện click cho từng nút "Liên hệ" (cả bản desktop và mobile)
document.querySelectorAll('.contact-trigger').forEach((trigger) => {
  const panel = document.getElementById(trigger.getAttribute('aria-controls'));
  if (!panel) return;

  trigger.addEventListener('click', (e) => {
    // Chặn sự kiện "nổi bọt" ra document, tránh bị đóng ngay lập tức
    e.stopPropagation();

    const willOpen = !panel.classList.contains('active');

    // Đóng hết dropdown khác đang mở trước khi mở dropdown này
    closeAllContactDropdowns();

    if (willOpen) {
      panel.classList.add('active');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

// Bấm ra ngoài dropdown "Liên hệ" → tự động đóng lại
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-item-contact')) {
    closeAllContactDropdowns();
  }
});

// ========== PHẦN 5 & 6: FORM ĐĂNG KÝ NHẬN TIN & FORM LIÊN HỆ ==========
// Ghi chú: 2 form này giờ gửi dữ liệu THẬT lên server (POST /newsletter và
// POST /contact) nên không cần JS preventDefault() nữa — để trình duyệt
// submit bình thường, server sẽ xử lý và redirect lại kèm thông báo.

// ========== PHẦN 7: XÁC NHẬN TRƯỚC KHI XÓA BÀI VIẾT (dashboard) ==========

/**
 * Sự kiện: Submit form "Xóa bài viết" trong dashboard
 * Tác dụng: Hiện hộp thoại xác nhận trước khi xóa thật sự.
 * Dùng event delegation (document.addEventListener) vì các form này
 * được tạo động từ dữ liệu bài viết của user, có thể có nhiều form cùng lúc.
 */
document.addEventListener('submit', (e) => {
  const form = e.target.closest('.delete-post-form');
  if (!form) return;

  const title = form.dataset.postTitle || 'bài viết này';
  const confirmed = confirm(`Bạn có chắc muốn xóa "${title}"? Không thể hoàn tác.`);

  if (!confirmed) {
    e.preventDefault();
  }
});
