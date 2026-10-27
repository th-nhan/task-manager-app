# 📊 Tính Năng: Task Completion Statistics

> **Phase:** 1.2 | **Mức độ ưu tiên:** 🔴 Cao | **Ước lượng:** 2 ngày
> **Trạng thái:** 🟡 Chưa triển khai

---

## 🎯 Tính năng này là gì?

**Task Completion Statistics** là widget thống kê hiệu suất hoàn thành task, được nhúng trực tiếp trên Dashboard chính. Nó biến việc quản lý công việc hàng ngày thành trải nghiệm trực quan và có tính "gamification" — khuyến khích người dùng duy trì thói quen hoàn thành task.

---

## 💡 Tính năng này giúp ích gì?

### 1. Biết ngay tình trạng công việc tuần/tháng
- **Circular progress bar** hiển thị % task hoàn thành trong tuần hiện tại và tháng hiện tại
- Mở Dashboard lên là thấy ngay: "Tuần này đã hoàn thành 12/18 tasks (67%)"
- Không cần phải đếm thủ công hay lọc qua từng view

### 2. Tạo động lực bằng Streak Counter
- **Streak counter** đếm số ngày liên tiếp bạn hoàn thành tất cả task trong ngày
- Giống như streak trên Duolingo — tạo cảm giác "không muốn phá vỡ chuỗi"
- VD: "🔥 7 ngày liên tiếp hoàn thành 100% tasks!"

### 3. Nhìn tổng quan cả năm qua Heatmap
- **Mini heatmap** kiểu GitHub contribution graph
- Mỗi ô là một ngày, màu đậm = nhiều task hoàn thành, màu nhạt = ít
- Nhìn cả năm trên một bảng → phát hiện khoảng thời gian nào mình năng suất nhất

### 4. So sánh tuần này với tuần trước
- Widget tự tính toán và hiển thị: "↑ 15% so với tuần trước"
- Giúp nhận biết xu hướng năng suất đang tăng hay giảm

---

## 📋 Chi tiết tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🔵 Circular progress bar | % task hoàn thành tuần/tháng hiện tại |
| 🔥 Streak counter | Số ngày liên tiếp hoàn thành tất cả tasks |
| 🟩 Mini heatmap | Contribution graph cả năm (giống GitHub) |
| 📈 Week-over-week comparison | So sánh năng suất tuần này vs tuần trước |

---

## 🔧 Thay đổi kỹ thuật cần thiết

| File | Thao tác | Mô tả |
|------|----------|-------|
| `client/src/components/TaskStatsWidget.jsx` | **Tạo mới** | Widget thống kê task với progress bar + heatmap |
| `client/src/pages/Dashboard.jsx` | **Sửa** | Embed widget vào dashboard header area |
| `server/src/controllers/task.controller.js` | **Sửa** | Thêm endpoint `GET /api/tasks/stats` trả về thống kê |

---

## 📸 Giao diện dự kiến

```
┌───────────────────────────────────────────────┐
│  📊 Task Statistics                           │
├───────────────────────────────────────────────┤
│                                               │
│   ╭─────╮    Tuần này: 12/18 (67%)           │
│   │ 67% │    Tháng này: 48/63 (76%)          │
│   ╰─────╯    🔥 Streak: 7 ngày               │
│              ↑ 15% so với tuần trước          │
│                                               │
│  ┌─ Heatmap 2026 ────────────────────────┐   │
│  │ ░░▒▒▓▓██░░▒▒▓▓██░░▒▒▓▓██░░▒▒▓▓██░░  │   │
│  │ ░░▒▒▓▓██░░▒▒▓▓██░░▒▒░░▒▒▓▓██░░▒▒▓▓  │   │
│  └───────────────────────────────────────┘   │
│   ░ Ít  ▒ TB  ▓ Nhiều  █ Tất cả             │
└───────────────────────────────────────────────┘
```
