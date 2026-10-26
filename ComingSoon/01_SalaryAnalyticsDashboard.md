# 📈 Tính Năng: Salary Analytics Dashboard

> **Phase:** 1.1 | **Mức độ ưu tiên:** 🔴 Cao | **Ước lượng:** 3 ngày
> **Trạng thái:** 🟡 Chưa triển khai

---

## 🎯 Tính năng này là gì?

**Salary Analytics Dashboard** là trang thống kê lương chuyên sâu với các biểu đồ trực quan, giúp giáo viên có cái nhìn tổng quan về thu nhập dạy học qua nhiều tháng.

Thay vì chỉ xem thu nhập từng tháng riêng lẻ như hiện tại, tính năng này sẽ **tổng hợp và trực quan hóa dữ liệu** dưới dạng biểu đồ đẹp mắt, dễ phân tích.

---

## 💡 Tính năng này giúp ích gì?

### 1. Theo dõi xu hướng thu nhập
- Biểu đồ **Bar/Line chart** so sánh thu nhập 6-12 tháng gần nhất
- Nhìn một cái là biết tháng nào thu nhập cao nhất, tháng nào thấp nhất
- Phát hiện sớm xu hướng **thu nhập giảm** để điều chỉnh lịch dạy kịp thời

### 2. Phân tích hiệu suất giảng dạy
- **Pie chart** hiển thị tỷ lệ buổi dạy: Completed / Cancelled / Make-up / Pending
- Biết được bao nhiêu % buổi dạy bị huỷ → đánh giá sự ổn định của lịch dạy
- So sánh tỷ lệ huỷ giữa các tháng

### 3. Đặt mục tiêu thu nhập
- **Goal setting** — đặt target lương tháng (VD: 5 triệu/tháng)
- **Progress bar** trực quan hiển thị đã đạt bao nhiêu % mục tiêu
- Tạo động lực rõ ràng mỗi khi mở app

### 4. Biết được đâu là lớp/địa điểm "sinh lời" nhất
- **Bảng tổng kết** top lớp dạy nhiều buổi nhất
- Location nào mang lại thu nhập cao nhất
- Giúp quyết định nhận thêm lớp ở đâu, bỏ lớp nào

---

## 📋 Chi tiết tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 📊 Biểu đồ thu nhập theo tháng | Bar/Line chart — so sánh 6-12 tháng gần nhất |
| 🥧 Pie chart phân bổ trạng thái | Tỷ lệ Completed / Cancelled / Make-up / Pending |
| 📈 Trend line | Đường xu hướng thu nhập tăng/giảm |
| 🎯 Mục tiêu thu nhập | Đặt target lương tháng + progress bar |
| 📋 Bảng tổng kết | Top lớp + top location theo thu nhập |

---

## 🔧 Thay đổi kỹ thuật cần thiết

| File | Thao tác | Mô tả |
|------|----------|-------|
| `client/src/components/timetable/SalaryAnalyticsChart.jsx` | **Tạo mới** | Component biểu đồ (Recharts / Chart.js) |
| `client/src/pages/TimetablePage.jsx` | **Sửa** | Thêm tab "Analytics" vào view mode |
| `server/src/controllers/teachingSession.controller.js` | **Sửa** | API endpoint `/analytics` — dữ liệu thống kê 12 tháng |
| `server/src/routes/teachingSession.routes.js` | **Sửa** | Đăng ký route mới |
| `client/src/api/teachingSessionApi.js` | **Sửa** | Thêm method `getAnalytics()` |
| `package.json` (client) | **Sửa** | Thêm dependency `recharts` |

---

## 📸 Giao diện dự kiến

```
┌─────────────────────────────────────────────────┐
│  📈 Salary Analytics                    T10/2026│
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────┐ ┌──────────────────┐  │
│  │ Thu nhập 12 tháng    │ │  Tỷ lệ trạng thái│  │
│  │  ▓▓                  │ │    ╭───╮         │  │
│  │  ▓▓ ▓▓               │ │   │ 85%│ Taught  │  │
│  │  ▓▓ ▓▓ ▓▓            │ │    ╰───╯         │  │
│  │  ▓▓ ▓▓ ▓▓ ▓▓         │ │  10% Cancel      │  │
│  └──────────────────────┘ └──────────────────┘  │
│                                                 │
│  🎯 Mục tiêu: 5,000,000₫  ████████░░ 78%       │
│                                                 │
│  📋 Top lớp: 10A1 (32 buổi) | CS1 (2.4tr)     │
└─────────────────────────────────────────────────┘
```
