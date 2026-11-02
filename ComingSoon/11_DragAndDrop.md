# 🖱️ Tính Năng: Drag & Drop Enhancements (Kéo Thả Nâng Cao)

> **Phase:** 5.3 | **Mức độ ưu tiên:** 🟢 Thấp | **Ước lượng:** 2 ngày
> **Trạng thái:** 🟡 Chưa triển khai

---

## 🎯 Tính năng này là gì?

**Drag & Drop Enhancements** nâng cấp trải nghiệm kéo thả cho cả module Task Management và Timetable. Cho phép kéo task giữa các cột Kanban, kéo đổi lịch dạy giữa các slot, và hỗ trợ thao tác kéo thả trên màn hình cảm ứng (mobile/tablet).

---

## 💡 Tính năng này giúp ích gì?

### 1. Quản lý task trực quan hơn
- **Kéo task giữa các cột Kanban** — đổi trạng thái TODO → IN_PROGRESS → DONE chỉ bằng kéo thả
- **Kéo task vào ngày khác trên Calendar** — thay đổi due date nhanh chóng
- Nhanh hơn nhiều so với click vào task → mở modal → sửa → lưu

### 2. Sắp xếp lịch dạy dễ dàng
- **Kéo timetable item** từ slot này sang slot khác
- Đổi lịch dạy nhanh khi có thay đổi đột xuất
- VD: Kéo lớp 10A1 từ "Thứ 2 Slot 1" sang "Thứ 4 Slot 3"

### 3. Hỗ trợ mobile/tablet
- **Touch support** — kéo thả bằng ngón tay trên màn hình cảm ứng
- Long press → drag → drop — thao tác quen thuộc trên mobile
- Giáo viên có thể sắp xếp lịch ngay trên điện thoại khi đang di chuyển

### 4. Trải nghiệm người dùng mượt mà
- **Animation** khi kéo — shadow, scale effect, placeholder hiển thị vị trí drop
- **Auto-scroll** — khi kéo tới rìa màn hình, tự động cuộn
- **Undo** — hoàn tác nhanh nếu thả nhầm vị trí

---

## 📋 Chi tiết tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🔄 Kanban drag & drop | Kéo task giữa cột TODO / IN_PROGRESS / DONE |
| 📅 Calendar drag | Kéo task sang ngày khác để đổi due date |
| 🗓️ Timetable drag | Kéo đổi slot dạy trong Weekly Grid |
| 📱 Touch support | Hỗ trợ kéo thả trên mobile/tablet |
| ✨ Drag animations | Shadow, scale, placeholder effects |
| ↩️ Undo action | Hoàn tác nhanh sau khi thả |

---

## 🔧 Thay đổi kỹ thuật cần thiết

| File | Thao tác | Mô tả |
|------|----------|-------|
| `package.json` (client) | **Sửa** | Thêm dependency `@dnd-kit/core` + `@dnd-kit/sortable` |
| `client/src/components/KanbanBoardView.jsx` | **Sửa** | Tích hợp drag & drop giữa các cột |
| `client/src/components/MonthCalendarView.jsx` | **Sửa** | Drag task sang ngày khác |
| `client/src/components/timetable/WeeklyGridView.jsx` | **Sửa** | Drag timetable item giữa slots |
| `client/src/hooks/useDragAndDrop.js` | **Tạo mới** | Custom hook cho drag & drop logic |
| `server/src/controllers/task.controller.js` | **Sửa** | API endpoint `PATCH` cho batch position update |
| `server/src/controllers/timetable.controller.js` | **Sửa** | API endpoint `PATCH` cho slot swap |

### Thư viện đề xuất:
```
@dnd-kit/core        — Core drag & drop
@dnd-kit/sortable    — Sortable lists
@dnd-kit/utilities   — Touch sensors cho mobile
```

> **Lưu ý:** `@dnd-kit` được chọn thay vì `react-beautiful-dnd` vì:
> - React 18/19 compatible (react-beautiful-dnd đã deprecated)
> - Built-in touch/keyboard support
> - Nhẹ hơn (~12KB gzipped)
> - API hiện đại, dùng hooks
