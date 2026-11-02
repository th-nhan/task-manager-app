# 📤 Tính Năng: Payroll Report Sharing (Chia Sẻ Bảng Lương)

> **Phase:** 4.2 | **Mức độ ưu tiên:** 🟡 Trung bình | **Ước lượng:** 3 ngày
> **Trạng thái:** 🟡 Chưa triển khai

---

## 🎯 Tính năng này là gì?

**Payroll Report Sharing** cho phép xuất bảng lương dạy học dưới dạng **PDF chuyên nghiệp**, tạo **link chia sẻ** (public/private), và gửi report qua email. Hiện tại app đã hỗ trợ export Excel — tính năng này nâng cấp thêm PDF đẹp và khả năng chia sẻ trực tuyến.

---

## 💡 Tính năng này giúp ích gì?

### 1. Báo cáo lương chuyên nghiệp cho trung tâm
- Xuất bảng lương dạng **PDF** có header, logo, bảng chi tiết — trình bày chuyên nghiệp
- Gửi cho trung tâm dạy học / quản lý để đối chiếu và thanh toán
- Không cần mở file Excel, không lo font chữ lỗi — PDF hiển thị đúng trên mọi thiết bị

### 2. Chia sẻ nhanh qua link
- Tạo **shareable link** — người nhận chỉ cần click link để xem bảng lương online
- Tuỳ chọn: **Public** (ai có link đều xem được) hoặc **Private** (cần đăng nhập)
- Đặt thời hạn link (VD: link hết hạn sau 7 ngày)
- Tiện hơn gửi file qua Zalo/Email

### 3. Gửi email report tự động
- Nhấn nút → gửi email bảng lương tháng tới quản lý
- Đính kèm PDF trong email
- Có thể cài đặt gửi tự động vào ngày cuối tháng

### 4. Lưu trữ lịch sử report
- Mỗi report được lưu lại — xem lại bảng lương bất kỳ tháng nào
- So sánh report giữa các tháng
- Bằng chứng thanh toán chính thức

---

## 📋 Chi tiết tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 📄 Export PDF | Xuất bảng lương đẹp, chuyên nghiệp dạng PDF |
| 🔗 Shareable link | Tạo link xem bảng lương online (public/private) |
| ⏰ Link expiry | Đặt thời hạn cho link chia sẻ |
| 📧 Email report | Gửi email kèm PDF bảng lương |
| 📂 Report history | Lưu trữ tất cả report đã xuất |

---

## 🔧 Thay đổi kỹ thuật cần thiết

| File | Thao tác | Mô tả |
|------|----------|-------|
| `server/src/controllers/payrollReport.controller.js` | **Tạo mới** | Logic tạo PDF, shareable link, email |
| `server/src/routes/payrollReport.routes.js` | **Tạo mới** | Routes |
| `server/prisma/schema.prisma` | **Sửa** | Thêm model `PayrollReport` |
| `client/src/components/timetable/PayrollExportModal.jsx` | **Tạo mới** | UI xuất và chia sẻ report |
| `client/src/api/payrollReportApi.js` | **Tạo mới** | API client |
| `client/src/components/timetable/SalaryAttendanceView.jsx` | **Sửa** | Thêm nút "Export PDF" + "Share" |
| `package.json` (server) | **Sửa** | Thêm dependency `puppeteer` hoặc `pdfkit` |

### Schema mới:
```prisma
model PayrollReport {
  id          String    @id @default(uuid())
  userId      String    @map("user_id")
  month       Int
  year        Int
  shareToken  String?   @unique @map("share_token")
  isPublic    Boolean   @default(false) @map("is_public")
  expiresAt   DateTime? @map("expires_at")
  pdfUrl      String?   @map("pdf_url")
  createdAt   DateTime  @default(now()) @map("created_at")
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("payroll_reports")
}
```
