# 🗂️ Tính Năng: Notification Center (Trung Tâm Thông Báo)

> **Phase:** 2.2 | **Mức độ ưu tiên:** 🔴 Cao | **Ước lượng:** 2 ngày
> **Trạng thái:** 🟡 Chưa triển khai

---

## 🎯 Tính năng này là gì?

**Notification Center** là trang trung tâm thông báo tập trung, nơi lưu trữ **tất cả lịch sử thông báo** — từ nhắc nhở dạy học, deadline task, đến cập nhật hệ thống. Người dùng có thể xem lại, đánh dấu đã đọc, và lọc theo loại thông báo.

Hiện tại app đã có [NotificationDropdown](file:///u:/task-manager-app/client/src/components/NotificationDropdown.jsx) (chuông thông báo) nhưng chỉ là dropdown nhỏ và **không lưu lại lịch sử**. Tính năng này sẽ mở rộng thành một trang đầy đủ.

---

## 💡 Tính năng này giúp ích gì?

### 1. Không bỏ lỡ thông báo quan trọng
- Tất cả thông báo được **lưu vào database**, không mất khi tải lại trang
- Scroll ngược xem lại thông báo cũ từ ngày trước, tuần trước
- Biết chính xác thông báo nào đã đọc, thông báo nào chưa

### 2. Phân loại và lọc thông báo
- Lọc theo loại: **Dạy học** | **Task** | **Hệ thống**
- Lọc theo trạng thái: **Tất cả** | **Chưa đọc** | **Đã đọc**
- Tìm kiếm nhanh trong lịch sử thông báo

### 3. Batch actions
- **Đánh dấu tất cả đã đọc** — clear badge count nhanh
- **Xoá thông báo cũ** — dọn dẹp thông báo không cần thiết
- Giữ notification center gọn gàng, chỉ hiển thị điều quan trọng

### 4. Deep link tới nội dung liên quan
- Click thông báo "Sắp tới giờ dạy lớp 10A1" → nhảy thẳng tới trang Salary & Attendance
- Click "Task XYZ sắp hết hạn" → mở task detail trên Dashboard
- Tiết kiệm thời gian điều hướng

---

## 📋 Chi tiết tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 📜 Lịch sử thông báo | Lưu tất cả notification vào DB, xem lại bất cứ lúc nào |
| 🔴 Badge count | Số thông báo chưa đọc trên icon chuông |
| 🏷️ Phân loại | Filter theo loại (session / task / system) |
| ✅ Đánh dấu đã đọc | Từng cái hoặc batch "Mark all as read" |
| 🔗 Deep link | Click thông báo → nhảy tới page/item liên quan |
| 🗑️ Xoá thông báo | Xoá từng cái hoặc clear all |

---

## 🔧 Thay đổi kỹ thuật cần thiết

| File | Thao tác | Mô tả |
|------|----------|-------|
| `server/prisma/schema.prisma` | **Sửa** | Thêm model `Notification` (persisted) |
| `server/src/controllers/notification.controller.js` | **Tạo mới** | CRUD + mark as read + batch operations |
| `server/src/routes/notification.routes.js` | **Tạo mới** | Routes cho notification API |
| `client/src/components/NotificationCenter.jsx` | **Tạo mới** | Full-page notification center |
| `client/src/components/NotificationDropdown.jsx` | **Sửa** | Thêm link "Xem tất cả" tới center |
| `client/src/api/notificationApi.js` | **Tạo mới** | API client |

### Schema mới:
```prisma
model Notification {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  type        String   // "session_reminder" | "task_deadline" | "system"
  title       String
  message     String
  referenceId String?  @map("reference_id")
  link        String?  // deep link path (e.g. "/timetable?view=salary")
  isRead      Boolean  @default(false) @map("is_read")
  createdAt   DateTime @default(now()) @map("created_at")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("notifications")
}
```
