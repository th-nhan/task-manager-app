# Kế hoạch Triển khai: Tính tiền & Đối chiếu Ca dạy (TaskNote Payroll & Attendance)

## 1. Mục tiêu
Xây dựng tính năng tự động ghi nhận, đối chiếu ca dạy học và tính tổng thu nhập theo tháng cho giáo viên trực tiếp trên ứng dụng TaskNote:
- Đơn giá mặc định: **60.000 VNĐ / ca**.
- Đối chiếu giữa **Lịch dự kiến (Thời khóa biểu)** và **Lịch thực dạy (Nhật ký chấm công)**.
- Ghi nhận đầy đủ các ca: **Đã dạy (Completed)**, **Nghỉ (Cancelled)**, **Dạy bù (Make-up)**, **Dạy tăng cường (Extra)**.
- Thống kê tỷ lệ hoàn thành ca dạy, tổng thu nhập tháng và xuất file Excel đối soát.

---

## 2. Kiến trúc & Thiết kế kỹ thuật

### 2.1. Database (Prisma Schema - PostgreSQL)
- **Enum `SessionStatus`**:
  - `COMPLETED`: Ca đã dạy hoàn thành (+60.000đ).
  - `CANCELLED`: Ca nghỉ/hủy (0đ).
  - `MAKE_UP`: Ca dạy bù (+60.000đ).
  - `PENDING`: Ca dự kiến sắp tới.
- **Model `TeachingSession`**:
  - `id`: String (UUID)
  - `userId`: String (Foreign Key -> User)
  - `timetableItemId`: String? (Foreign Key -> TimetableItem, optional)
  - `date`: DateTime (Ngày diễn ra ca dạy)
  - `dayOfWeek`: String (Thứ 2, Thứ 3...)
  - `startTime`: String ("17:00")
  - `endTime`: String ("18:30")
  - `timeRange`: String ("17h00 – 18h30")
  - `className`: String (Tên lớp học)
  - `location`: String (Cơ sở dạy học)
  - `grade`: Int (Khối lớp)
  - `rate`: Int (Đơn giá ca dạy, mặc định 60,000 VNĐ)
  - `status`: SessionStatus (Mặc định PENDING hoặc COMPLETED)
  - `note`: String? (Ghi chú lý do nghỉ, bài dạy bù...)
  - `createdAt`, `updatedAt`

### 2.2. Backend API (`/api/teaching-sessions`)
- `GET /api/teaching-sessions?month=10&year=2026`: Lấy danh sách ca dạy theo tháng & năm kèm thống kê thu nhập.
- `POST /api/teaching-sessions/generate-month`: Tự động sinh lịch dạy của cả tháng dựa trên Thời khóa biểu hàng tuần đang áp dụng.
- `POST /api/teaching-sessions`: Thêm ca dạy bù / ca phát sinh ngoài lịch.
- `PUT /api/teaching-sessions/:id`: Cập nhật trạng thái (Đã dạy / Nghỉ / Bù), đơn giá, hoặc ghi chú.
- `DELETE /api/teaching-sessions/:id`: Xóa ca dạy.

### 2.4. Tách biệt rõ ràng: Lịch Học đặt tại Timetable Page, Tasks Month giữ thuần túy công việc
- **Tasks Month Tab ([MonthCalendarView.jsx](file:///u:/task-manager-app/client/src/components/MonthCalendarView.jsx))**:
  - Đã dọn dẹp sạch toàn bộ 35 ca học thử nghiệm khỏi bảng `Task`.
  - Giữ lại 100% các công việc cá nhân thực tế của bạn (*Update CV, Bơi, Ôn lý thuyết ReactJS, Thi bằng lái...*).
  - Loại bỏ hoàn toàn thanh lọc ca dạy và khay thẻ lớp học khỏi Tasks Month để trả lại giao diện Lịch Công Việc gọn gàng, tinh gọn.
- **Timetable Page ([SalaryAttendanceView.jsx](file:///u:/task-manager-app/client/src/components/timetable/SalaryAttendanceView.jsx))**:
  - **Ô TỔNG TIỀN NỔI BẬT (60.000 VNĐ / CA)**: Khối màu ngọc bích lớn ở đầu trang hiển thị tổng tiền thực nhận (`summary.totalEarnings` VNĐ, tự động cộng dồn 60.000đ/ca khi đánh dấu đã dạy), thu nhập theo tuần đang xem, số ca dự kiến, ca bù, ca hủy.
  - **Layout Grid theo tuần sắp theo khung giờ (Weekly Time-Slot Grid)**:
    - 9 hàng khung giờ chuẩn xác từ `07:00 – 08:30` đến `19:30 – 21:00` (giống Weekly Grid).
    - 7 cột tương ứng 7 ngày trong tuần (Thứ 2 đến Chủ Nhật) với ngày tháng chính xác của tuần đang chọn và nhãn "Hôm nay".
    - Tự động nạp lịch từ Weekly Grid sang để giáo viên không phải nhập thủ công.
    - Chuyển đổi trạng thái 1 chạm trực tiếp trên thẻ: `[✅ Đã dạy +60k]` | `[❌ Nghỉ 0k]` | `[🔄 Dạy bù +60k]` | `[⏳ Chờ +60k]`.
    - Nút chấm nhanh cả tuần: `[✅ Chấm cả tuần Đã dạy (+60k)]`.
  - **Tối ưu thanh điều hướng Timetable**:
    - Đã loại bỏ view `Weekend (Sat & Sun)` và `List View` (TaskView) theo yêu cầu.
    - Giữ lại 3 chế độ xem tinh gọn: `Weekly Grid` (Thời khóa biểu tuần), `By Grade` (Theo khối lớp), và `Tính Tiền Ca Dạy (60k)`.

---

## 3. Các bước thực hiện (Execution Checklist)

- [x] **Bước 1**: Cập nhật `schema.prisma` với model `TeachingSession` & enum `SessionStatus`.
- [x] **Bước 2**: Đồng bộ cơ sở dữ liệu (`prisma db push` thành công lên Supabase PostgreSQL và `prisma generate`).
- [x] **Bước 3**: Viết Backend Controller `teachingSession.controller.js` và Route `teachingSession.routes.js`.
- [x] **Bước 4**: Đăng ký route `/api/teaching-sessions` trong `server.js`.
- [x] **Bước 5**: Viết Frontend API client `client/src/api/teachingSessionApi.js`.
- [x] **Bước 6**: Xây dựng UI Component `SalaryAttendanceView.jsx` với Layout Weekly Time-Slot Grid, tự động nạp lịch từ Weekly Grid và Ô Tính Tổng Tiền 60k/ca.
- [x] **Bước 7**: Loại bỏ tab `Weekend` và `TaskView` (List View) khỏi `TimetablePage.jsx`.
- [x] **Bước 8**: Kiểm thử tính năng (Vite build thành công `✓ built in 4.38s`, 0 lỗi cú pháp).
