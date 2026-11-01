# 👥 Tính Năng: Shared Tasks (Chia Sẻ & Cộng Tác Công Việc)

> **Phase:** 4.1 | **Mức độ ưu tiên:** 🟡 Trung bình | **Ước lượng:** 4 ngày
> **Trạng thái:** 🟡 Chưa triển khai

---

## 🎯 Tính năng này là gì?

**Shared Tasks** biến app từ công cụ cá nhân thành **nền tảng cộng tác nhóm**. Cho phép chia sẻ task với người dùng khác, phân công công việc, bình luận trao đổi, và đính kèm tài liệu — tất cả trong cùng một giao diện quen thuộc.

---

## 💡 Tính năng này giúp ích gì?

### 1. Làm việc nhóm dễ dàng
- **Chia sẻ task** qua email hoặc link — người được chia sẻ thấy task trên Dashboard của họ
- Phân quyền: **View only** (chỉ xem) hoặc **Edit** (được sửa)
- Phù hợp cho nhóm giáo viên cùng dạy một lớp, cùng soạn giáo án

### 2. Phân công công việc rõ ràng
- **Assignee** — gán task cho thành viên cụ thể
- Biết ai đang phụ trách task nào, tránh trùng lặp công việc
- VD: "Task soạn đề thi lớp 10 → gán cho Thầy B"

### 3. Trao đổi ngay trong task
- **Task comments** — bình luận trực tiếp trên task, không cần chuyển qua Zalo/Messenger
- Lịch sử trao đổi gắn liền với task → dễ truy vết
- Tag @mention người cụ thể trong comment

### 4. Đính kèm tài liệu
- **File attachments** — đính kèm giáo án, đề thi, tài liệu tham khảo
- Mọi thứ liên quan tới task nằm ở một chỗ
- Hỗ trợ: PDF, DOC, hình ảnh, file nhỏ (< 5MB)

---

## 📋 Chi tiết tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🔗 Task sharing | Chia sẻ task qua email/link |
| 👤 Assignee | Gán task cho thành viên khác |
| 🔐 Permission | Phân quyền View / Edit cho người được chia sẻ |
| 💬 Comments | Bình luận trên task, hỗ trợ @mention |
| 📎 File attachments | Đính kèm tài liệu vào task |
| 🔔 Share notifications | Thông báo khi được chia sẻ task mới |

---

## 🔧 Thay đổi kỹ thuật cần thiết

| File | Thao tác | Mô tả |
|------|----------|-------|
| `server/prisma/schema.prisma` | **Sửa** | Thêm `TaskShare`, `TaskComment` models |
| `server/src/controllers/taskShare.controller.js` | **Tạo mới** | Sharing logic + permission checks |
| `server/src/controllers/taskComment.controller.js` | **Tạo mới** | CRUD comments |
| `server/src/routes/taskShare.routes.js` | **Tạo mới** | Routes |
| `client/src/components/TaskShareModal.jsx` | **Tạo mới** | UI chia sẻ task |
| `client/src/components/TaskComments.jsx` | **Tạo mới** | UI bình luận |
| `client/src/api/taskShareApi.js` | **Tạo mới** | API client |
| `client/src/pages/Dashboard.jsx` | **Sửa** | Hiển thị shared tasks + comments |

### Schema mới:
```prisma
model TaskShare {
  id         String   @id @default(uuid())
  taskId     String   @map("task_id")
  sharedWith String   @map("shared_with")
  permission String   @default("view") // "view" | "edit"
  createdAt  DateTime @default(now()) @map("created_at")
  task       Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  @@map("task_shares")
}

model TaskComment {
  id        String   @id @default(uuid())
  taskId    String   @map("task_id")
  userId    String   @map("user_id")
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("task_comments")
}
```
