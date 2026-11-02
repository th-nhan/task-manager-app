# 🎨 Tính Năng: Multi-Theme & Custom Palettes (Đa Giao Diện)

> **Phase:** 5.2 | **Mức độ ưu tiên:** 🟢 Thấp | **Ước lượng:** 1-2 ngày
> **Trạng thái:** 🟢 Đã triển khai

---

## 🎯 Tính năng này là gì?

Thay vì chỉ hỗ trợ Dark/Light mode thông thường, hệ thống **Multi-Theme** cho phép người dùng tùy chỉnh phong cách giao diện của toàn bộ ứng dụng theo các bộ màu cá nhân hóa: **Pink (Mặc định - Tươi sáng, nữ tính)**, **Green (Hiện đại, coder style)**, **Dark (Tối cổ điển, dịu mắt ban đêm)**, và **Purple (Sang trọng, huyền ảo)**. 

Lựa chọn giao diện sẽ được lưu tự động vào trình duyệt qua các lần truy cập.

---

## 💡 Tính năng này giúp ích gì?

### 1. Cá nhân hóa trải nghiệm người dùng
- Cho phép người dùng tự do lựa chọn màu sắc phù hợp với sở thích hoặc tâm trạng làm việc.
- Tránh cảm giác nhàm chán khi dùng một màu sắc mặc định cố định trong thời gian dài.

### 2. Giảm mỏi mắt & Tối ưu theo môi trường
- **Dark & Green Theme**: Giảm ánh sáng xanh, cực kỳ thoải mái khi soạn bài, kiểm tra lương, hoặc quản lý task vào ban đêm, đồng thời tiết kiệm pin trên màn hình OLED.
- **Pink & Purple Theme**: Tươi tắn, rõ nét, hoàn hảo cho việc sử dụng vào ban ngày.

### 3. Triển khai nhanh chóng & An toàn
- Toàn bộ cơ chế đổi màu được xử lý hoàn toàn ở tầng Frontend thông qua **CSS Variables** và **Context API**, không làm ảnh hưởng đến cấu trúc Database hay Backend.

---

## 📋 Chi tiết tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🌸 Pink Theme | Giao diện hồng tươi sáng (Mặc định chính của ứng dụng) |
| 🟢 Green Theme | Giao diện tối lấy cảm hứng từ phong cách Coder / GitHub |
| 🌙 Dark Theme | Giao diện tối cổ điển với tông màu xanh đen dịu mắt |
| 💜 Purple Theme | Giao diện tím sang trọng, hiện đại |
| 🎛️ Theme Switcher | Dropdown hoặc nút chọn nhanh giao diện trên Header/Toolbar |
| 💾 Persist preference | Lưu lựa chọn giao diện vào `localStorage` |

---

## 🔧 Thay đổi kỹ thuật cần thiết

| File | Thao tác | Mô tả |
|------|----------|-------|
| `client/src/context/ThemeContext.jsx` | **Tạo mới** | Context quản lý state theme (`pink`, `green`, `dark`, `purple`) và đồng bộ vào `localStorage` |
| `client/src/index.css` | **Sửa** | Định nghĩa hệ thống CSS Variables tương ứng cho từng class theme |
| `client/src/main.jsx` | **Sửa** | Wrap ứng dụng với `ThemeProvider` |
| `client/src/components/DashboardHeader.jsx` | **Sửa** | Thêm UI chọn theme (Dropdown / Icon Switcher) |
| Tất cả component files | **Sửa** | Chuyển đổi các màu hardcode sang sử dụng CSS Variables |

---

### 🎨 Cấu hình CSS Variables (`client/src/index.css`)

```css
/* ==========================================
   1. PINK THEME (Mặc định - Tươi sáng)
   ========================================== */
:root, :root.pink {
  --bg-main: #FFF5F7;
  --bg-card: #FFFFFF;
  --text-main: #2D3748;
  --text-muted: #718096;
  --accent: #EC4899;       /* Hồng chủ đạo */
  --accent-hover: #DB2777;
  --border-color: #FED7E2;
}

/* ==========================================
   2. GREEN / GITHUB DARK THEME (Coder Style)
   ========================================== */
:root.green {
  --bg-main: #0D1117;
  --bg-card: #161B22;
  --text-main: #E6EDF3;
  --text-muted: #8B949E;
  --accent: #2EA043;       /* Xanh lá GitHub */
  --accent-hover: #238636;
  --border-color: #30363D;
}

/* ==========================================
   3. DARK THEME (Tối cổ điển, dịu mắt ban đêm)
   ========================================== */
:root.dark {
  --bg-main: #1A252F;
  --bg-card: #2C3E50;
  --text-main: #FFFFFF;
  --text-muted: #95A5A6;
  --accent: #3498DB;       /* Xanh dương làm điểm nhấn */
  --accent-hover: #2980B9;
  --border-color: #34495E;
}

/* ==========================================
   4. PURPLE THEME (Sang trọng, huyền ảo)
   ========================================== */
:root.purple {
  --bg-main: #FAF5FF;
  --bg-card: #FFFFFF;
  --text-main: #2D1B4E;
  --text-muted: #7C6F93;
  --accent: #7B3FC4;       /* Tím chủ đạo */
  --accent-hover: #6B21A8;
  --border-color: #E9D5FF;
}