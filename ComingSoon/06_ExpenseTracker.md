# 💸 Tính Năng: Expense Tracker (Quản Lý Chi Tiêu)

> **Phase:** 3.2 | **Mức độ ưu tiên:** 🟡 Trung bình | **Ước lượng:** 4 ngày
> **Trạng thái:** 🟡 Chưa triển khai

---

## 🎯 Tính năng này là gì?

**Expense Tracker** là tính năng quản lý chi tiêu cá nhân — ghi nhận các khoản chi, phân loại theo danh mục, và **so sánh trực quan thu nhập dạy học vs chi tiêu** hàng tháng. Kết hợp với module Salary đang có, tạo thành hệ thống quản lý tài chính cá nhân hoàn chỉnh.

---

## 💡 Tính năng này giúp ích gì?

### 1. Biết tiền đi đâu mỗi tháng
- Ghi nhanh từng khoản chi tiêu: "Ăn trưa 35k", "Xăng xe 100k", "Mua sách 200k"
- Phân loại tự động theo danh mục: 🍜 Ăn uống, 🚗 Đi lại, 📚 Giáo dục, 🎮 Giải trí, 💡 Sinh hoạt
- Cuối tháng biết chính xác tổng chi bao nhiêu, chi nhiều nhất vào mục gì

### 2. So sánh Thu nhập vs Chi tiêu
- Biểu đồ **Thu vs Chi** trực quan — bar chart song song
- Biết ngay tháng nào "dư", tháng nào "thiếu"
- Dùng chung data với module Salary — không cần nhập thu nhập lại

### 3. Đặt ngân sách tháng
- **Monthly budget** — đặt giới hạn chi tiêu (VD: tối đa 3 triệu/tháng)
- Cảnh báo khi chi tiêu đạt 80%, 100% ngân sách
- Progress bar hiển thị đã chi bao nhiêu % ngân sách

### 4. Tạo thói quen tiết kiệm
- Nhìn thấy "thâm hụt" rõ ràng → có động lực giảm chi
- Report cuối tháng: "Tháng này kiếm 4.2tr, chi 3.1tr → tiết kiệm 1.1tr 🎉"
- Theo dõi xu hướng tiết kiệm qua nhiều tháng

---

## 📋 Chi tiết tính năng

| Tính năng | Mô tả |
|-----------|-------|
| ➕ Ghi nhận chi tiêu | Thêm khoản chi với số tiền, danh mục, ghi chú |
| 🏷️ Danh mục chi tiêu | Ăn uống, Đi lại, Giáo dục, Sinh hoạt, Giải trí, Khác |
| 📊 Thu vs Chi chart | Biểu đồ so sánh thu nhập dạy học vs chi tiêu |
| 💰 Monthly budget | Đặt ngân sách tháng + cảnh báo vượt mức |
| 📅 Expense calendar | Lịch hiển thị chi tiêu theo ngày |
| 📤 Export report | Xuất báo cáo thu-chi ra Excel |

---

## 🔧 Thay đổi kỹ thuật cần thiết

| File | Thao tác | Mô tả |
|------|----------|-------|
| `server/prisma/schema.prisma` | **Sửa** | Thêm model `Expense` + `Budget` |
| `server/src/controllers/expense.controller.js` | **Tạo mới** | CRUD expenses + budget |
| `server/src/routes/expense.routes.js` | **Tạo mới** | Routes |
| `client/src/components/timetable/ExpenseTracker.jsx` | **Tạo mới** | UI chính quản lý chi tiêu |
| `client/src/components/timetable/ExpenseFormModal.jsx` | **Tạo mới** | Form thêm/sửa chi tiêu |
| `client/src/components/timetable/BudgetSettingsModal.jsx` | **Tạo mới** | Cài đặt ngân sách |
| `client/src/api/expenseApi.js` | **Tạo mới** | API client |
| `client/src/pages/TimetablePage.jsx` | **Sửa** | Thêm tab "Chi tiêu" hoặc gộp vào Salary |

### Schema mới:
```prisma
model Expense {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  amount      Int
  category    String   // "food", "transport", "education", "entertainment", "utilities", "other"
  description String?
  date        DateTime
  createdAt   DateTime @default(now()) @map("created_at")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("expenses")
}

model Budget {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  month     Int
  year      Int
  amount    Int
  createdAt DateTime @default(now()) @map("created_at")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, month, year])
  @@map("budgets")
}
```
