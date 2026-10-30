# 💵 Tính Năng: Multi-Rate Support (Đa Mức Lương)

> **Phase:** 3.1 | **Mức độ ưu tiên:** 🟡 Trung bình — cao | **Ước lượng:** 3 ngày
> **Trạng thái:** 🟡 Chưa triển khai

---

## 🎯 Tính năng này là gì?

**Multi-Rate Support** cho phép cấu hình **nhiều mức lương khác nhau** cho từng lớp, từng cấp độ (grade), và từng cơ sở (location). Hiện tại toàn bộ hệ thống đang hardcode `rate: 60000` (60,000₫/buổi) — tính năng này sẽ thay thế bằng hệ thống rate linh hoạt.

---

## 💡 Tính năng này giúp ích gì?

### 1. Tính lương chính xác cho từng lớp
- Thực tế: lớp 10 có thể trả 60k, lớp 12 trả 80k, lớp ôn thi trả 100k
- Hiện tại app tính tất cả = 60,000₫ → **sai lệch thu nhập thực tế**
- Với Multi-Rate, mỗi lớp sẽ có mức lương riêng → báo cáo lương chính xác 100%

### 2. Rate templates tiết kiệm thời gian
- Tạo template: "Lớp 10 = 60k", "Lớp 12 = 80k", "Weekend = 90k"
- Khi thêm lớp mới, hệ thống **tự động áp dụng rate** dựa trên grade/location
- Không cần nhập rate thủ công cho từng lớp

### 3. Cập nhật lương hàng loạt
- **Bulk rate update** — khi trung tâm tăng lương, chỉ cần sửa 1 template
- Tất cả lớp thuộc template đó sẽ được cập nhật rate mới
- Tiết kiệm thời gian khi quản lý 15-20 lớp

### 4. Lưu lịch sử thay đổi lương
- **Rate history** — biết chính xác rate thay đổi từ khi nào
- Hữu ích khi cần đối chiếu với trung tâm dạy học
- VD: "Từ tháng 9 rate lớp 10 tăng từ 55k lên 60k"

---

## 📋 Chi tiết tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 💵 Rate per class | Mỗi lớp/timetable item có rate riêng |
| 📊 Rate templates | Tạo template rate theo grade/level/location |
| 🔄 Bulk rate update | Cập nhật hàng loạt theo filter |
| 📈 Rate history | Lưu lịch sử thay đổi rate |
| ⚡ Auto-fill | Khi tạo session mới, auto-fill rate từ config |

---

## 🔧 Thay đổi kỹ thuật cần thiết

| File | Thao tác | Mô tả |
|------|----------|-------|
| `server/prisma/schema.prisma` | **Sửa** | Thêm model `RateConfig` |
| `server/src/controllers/rateConfig.controller.js` | **Tạo mới** | CRUD rate configs |
| `server/src/routes/rateConfig.routes.js` | **Tạo mới** | Routes |
| `client/src/components/timetable/RateConfigModal.jsx` | **Tạo mới** | UI quản lý mức lương |
| `client/src/api/rateConfigApi.js` | **Tạo mới** | API client |
| `client/src/components/timetable/SalaryAttendanceView.jsx` | **Sửa** | Thay `rate: 60000` bằng rate từ config |
| `client/src/components/timetable/SessionFormModal.jsx` | **Sửa** | Auto-fill rate khi tạo session |

### Schema mới:
```prisma
model RateConfig {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  name      String   // "Grade 10 Standard", "Weekend Premium"
  grade     Int?
  location  String?
  level     String?
  rate      Int      @default(60000)
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now()) @map("created_at")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("rate_configs")
}
```

### Vị trí hardcode `60000` cần thay thế:
- [SalaryAttendanceView.jsx](file:///u:/task-manager-app/client/src/components/timetable/SalaryAttendanceView.jsx) — dòng 302, 412, 487, 501, 604, 678
- [SessionFormModal.jsx](file:///u:/task-manager-app/client/src/components/timetable/SessionFormModal.jsx)
