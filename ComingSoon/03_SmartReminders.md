# 🔔 Tính Năng: Smart Reminders (Nhắc Nhở Thông Minh)

> **Phase:** 2.1 | **Mức độ ưu tiên:** 🔴 Cao | **Ước lượng:** 3 ngày
> **Trạng thái:** 🟡 Chưa triển khai

---

## 🎯 Tính năng này là gì?

**Smart Reminders** là hệ thống nhắc nhở chủ động — tự động thông báo trước giờ dạy, nhắc deadline task, và gửi cảnh báo khi có sự kiện quan trọng. Hoạt động qua **Browser Push Notifications**, kể cả khi tab app không mở.

---

## 💡 Tính năng này giúp ích gì?

### 1. Không bao giờ quên giờ dạy
- Nhận thông báo **15/30/60 phút** trước mỗi buổi dạy
- Tuỳ chỉnh thời gian nhắc theo ý muốn cho từng lớp
- Đặc biệt hữu ích khi có lớp dạy thêm (make-up) ngoài lịch cố định
- VD: "⏰ Còn 30 phút nữa dạy lớp 10A1 tại CS1 (13:30 - 15:00)"

### 2. Nhắc deadline task trước khi quá muộn
- **Task deadline alerts** — nhắc trước 1 ngày và 1 giờ khi task sắp hết hạn
- Không cần phải mở app để check — thông báo sẽ pop-up ngay trên trình duyệt
- Giảm thiểu tình trạng quên task quan trọng

### 3. Nhắc nhở định kỳ
- **Recurring reminders** — nhắc hàng ngày (VD: "Đánh dấu điểm danh hôm nay")
- Nhắc hàng tuần (VD: "Kiểm tra lịch dạy tuần sau")
- Tạo thói quen sử dụng app đều đặn

### 4. Thông báo chủ động kể cả khi không mở app
- Dùng **Web Push API** — thông báo hiện trên màn hình kể cả khi đang dùng app khác
- Hoạt động giống notification của Messenger, Gmail trên trình duyệt
- Có thể click vào thông báo để mở ngay trang liên quan

### 5. (Tuỳ chọn) Email tổng kết
- Gửi email tổng kết cuối ngày: bao nhiêu buổi đã dạy, thu nhập hôm nay
- Email tổng kết cuối tuần: tổng thu nhập, số buổi huỷ, các task chưa hoàn thành

---

## 📋 Chi tiết tính năng

| Tính năng | Mô tả |
|-----------|-------|
| ⏰ Teaching session reminders | Nhắc 15/30/60 phút trước giờ dạy |
| 📅 Task deadline alerts | Nhắc trước 1 ngày, 1 giờ khi sắp hết hạn |
| 🔄 Recurring reminders | Nhắc hàng ngày / hàng tuần |
| 🌐 Browser Push Notifications | Push notification qua Web Push API |
| 📧 Email notifications | (Optional) Email tổng kết cuối ngày/tuần |
| ⚙️ Cài đặt tuỳ chỉnh | Modal cài đặt on/off, thời gian nhắc |

---

## 🔧 Thay đổi kỹ thuật cần thiết

| File | Thao tác | Mô tả |
|------|----------|-------|
| `server/prisma/schema.prisma` | **Sửa** | Thêm model `Reminder` + `NotificationPreference` |
| `server/src/controllers/reminder.controller.js` | **Tạo mới** | CRUD reminders + scheduling logic |
| `server/src/routes/reminder.routes.js` | **Tạo mới** | Routes cho reminders API |
| `client/src/components/ReminderSettingsModal.jsx` | **Tạo mới** | UI cài đặt nhắc nhở |
| `client/src/context/NotificationContext.jsx` | **Sửa** | Tích hợp Web Push API |
| `client/public/service-worker.js` | **Tạo mới** | Service worker nhận push events |

### Schema mới:
```prisma
model Reminder {
  id            String   @id @default(uuid())
  userId        String   @map("user_id")
  type          String   // "session" | "task_deadline" | "custom"
  referenceId   String?  @map("reference_id") // taskId or sessionId
  minutesBefore Int      @default(30)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now()) @map("created_at")
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("reminders")
}

model NotificationPreference {
  id                    String  @id @default(uuid())
  userId                String  @unique @map("user_id")
  pushEnabled           Boolean @default(true)
  emailEnabled          Boolean @default(false)
  sessionReminderMin    Int     @default(30)
  taskDeadlineReminder  Boolean @default(true)
  dailySummary          Boolean @default(false)
  weeklySummary         Boolean @default(false)
  user                  User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("notification_preferences")
}
```
