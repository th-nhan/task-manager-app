# 📋 Kế Hoạch Phát Triển Tính Năng Mới — Task Manager & Salary Calculator

> **Dự án:** [task-manager-app](file:///u:/task-manager-app)
> **Ngày lập:** 25/10/2026
> **Tổng số tính năng:** 11 tính năng | 5 Phase

---

## 📑 Danh Sách Tính Năng (Chi Tiết Từng File)

### 🔴 Phase 1 — Dashboard Tổng Quan & Thống Kê Nâng Cao (3-4 ngày)

| # | Tính năng | Giúp ích | File chi tiết |
|---|-----------|----------|---------------|
| 01 | 📈 **Salary Analytics Dashboard** | Biểu đồ thu nhập, trend, mục tiêu lương, top lớp | [01_SalaryAnalyticsDashboard.md](./01_SalaryAnalyticsDashboard.md) |
| 02 | 📊 **Task Completion Statistics** | Progress bar, streak, heatmap — gamified productivity | [02_TaskCompletionStatistics.md](./02_TaskCompletionStatistics.md) |

### 🔴 Phase 2 — Hệ Thống Nhắc Nhở & Notifications (3-5 ngày)

| # | Tính năng | Giúp ích | File chi tiết |
|---|-----------|----------|---------------|
| 03 | 🔔 **Smart Reminders** | Nhắc trước giờ dạy, deadline task, push notifications | [03_SmartReminders.md](./03_SmartReminders.md) |
| 04 | 🗂️ **Notification Center** | Lịch sử thông báo, đánh dấu đã đọc, lọc & deep link | [04_NotificationCenter.md](./04_NotificationCenter.md) |

### 🟡 Phase 3 — Quản Lý Tài Chính Mở Rộng (4-6 ngày)

| # | Tính năng | Giúp ích | File chi tiết |
|---|-----------|----------|---------------|
| 05 | 💵 **Multi-Rate Support** | Rate riêng cho từng lớp, template, bulk update | [05_MultiRateSupport.md](./05_MultiRateSupport.md) |
| 06 | 💸 **Expense Tracker** | Quản lý chi tiêu, thu vs chi, ngân sách tháng | [06_ExpenseTracker.md](./06_ExpenseTracker.md) |

### 🟡 Phase 4 — Collaboration & Sharing (5-7 ngày)

| # | Tính năng | Giúp ích | File chi tiết |
|---|-----------|----------|---------------|
| 07 | 👥 **Shared Tasks** | Chia sẻ task, assignee, comments, đính kèm file | [07_SharedTasks.md](./07_SharedTasks.md) |
| 08 | 📤 **Payroll Report Sharing** | Export PDF, shareable link, email bảng lương | [08_PayrollReportSharing.md](./08_PayrollReportSharing.md) |

### 🟢 Phase 5 — PWA & UX Nâng Cao (3-5 ngày)

| # | Tính năng | Giúp ích | File chi tiết |
|---|-----------|----------|---------------|
| 09 | 📱 **PWA Support** | Cài app trên điện thoại, offline, background sync | [09_PWASupport.md](./09_PWASupport.md) |
| 10 | 🌙 **Dark Mode** | Giao diện tối, tự động theo hệ thống, tiết kiệm pin | [10_DarkMode.md](./10_DarkMode.md) |
| 11 | 🖱️ **Drag & Drop** | Kéo thả task/timetable, hỗ trợ touch mobile | [11_DragAndDrop.md](./11_DragAndDrop.md) |

---

## 📅 Timeline Tổng Quan

```
Phase 1 (Tuần 1)  ████████░░░░░░░░░░░░░░░░  Analytics + Task Stats
Phase 2 (Tuần 2)  ░░░░░░░░████████░░░░░░░░  Reminders + Notifications
Phase 3 (Tuần 3)  ░░░░░░░░░░░░░░░░████████  Multi-Rate + Expenses
Phase 4 (Tuần 4-5)░░░░░░░░░░░░░░░░░░░░████  Shared Tasks + Payroll
Phase 5 (Tuần 5-6)░░░░░░░░░░░░░░░░░░░░░░██  PWA + Dark Mode + DnD
```

**Tổng thời gian ước lượng:** 18-27 ngày làm việc

---

## 🎯 Khuyến Nghị

> **Bắt đầu với:** Phase 1 (Analytics) + Feature 05 (Multi-Rate) — giá trị cao nhất, rủi ro thấp nhất.
>
> **Quick win:** Feature 10 (Dark Mode) — 1 ngày, không cần backend, impact lớn về UX.
