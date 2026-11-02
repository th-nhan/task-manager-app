# 📱 Tính Năng: PWA Support (Progressive Web App)

> **Phase:** 5.1 | **Mức độ ưu tiên:** 🟢 Thấp | **Ước lượng:** 3 ngày
> **Trạng thái:** 🟡 Chưa triển khai

---

## 🎯 Tính năng này là gì?

**PWA (Progressive Web App)** biến website thành ứng dụng cài được trên điện thoại và máy tính — giống app native nhưng không cần tải từ App Store/Google Play. Người dùng có thể **mở app từ màn hình chính**, sử dụng **offline**, và nhận **push notifications**.

---

## 💡 Tính năng này giúp ích gì?

### 1. Cài app như ứng dụng thật
- Nhấn "Add to Home Screen" → icon app xuất hiện trên màn hình điện thoại
- Mở app full-screen, không có thanh URL trình duyệt → trải nghiệm như native app
- Hoạt động trên Android, iOS, Windows, macOS — cùng một codebase
- Không cần deploy lên App Store, tiết kiệm chi phí

### 2. Sử dụng khi mất mạng
- **Offline support** — vẫn xem được thời khoá biểu, bảng lương, danh sách task khi không có internet
- Dữ liệu được cache thông minh — tự đồng bộ khi có mạng trở lại
- Đặc biệt hữu ích khi đi dạy ở khu vực sóng yếu

### 3. Đồng bộ ngầm
- **Background sync** — thay đổi offline sẽ tự động đẩy lên server khi có mạng
- VD: Đánh dấu "đã dạy" khi offline → tự sync lên DB khi online
- Không mất dữ liệu, không cần nhớ làm lại

### 4. Khởi động nhanh
- Service worker cache app shell → mở app trong < 1 giây
- Không phải chờ tải HTML/CSS/JS mỗi lần mở
- Splash screen đẹp khi mở app

---

## 📋 Chi tiết tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 📱 Install prompt | Banner "Cài đặt ứng dụng" trên trình duyệt |
| 🏠 Home screen icon | Icon app + splash screen |
| 🔌 Offline mode | Xem timetable, salary, tasks khi không có mạng |
| 🔄 Background sync | Tự đồng bộ thay đổi khi có mạng lại |
| ⚡ Fast loading | Cache app shell cho khởi động < 1s |
| 📐 Full-screen mode | Chạy full-screen, không hiện thanh URL |

---

## 🔧 Thay đổi kỹ thuật cần thiết

> **Sử dụng [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/)** thay vì viết service worker thủ công — plugin tự động generate service worker (dùng Workbox) và manifest, giảm boilerplate đáng kể.

### Cài đặt
```bash
npm install -D vite-plugin-pwa
```

### Các thay đổi cần thiết

| File | Thao tác | Mô tả |
|------|----------|-------|
| `vite.config.js` | **Sửa** | Thêm `VitePWA` plugin với manifest + workbox config |
| `client/public/icons/` | **Tạo mới** | App icons: 192x192, 512x512 (tối thiểu) |
| `client/src/components/UpdatePrompt.jsx` | **Tạo mới** | Banner thông báo có phiên bản mới (tuỳ chọn) |

> ❌ **Không cần** tạo `service-worker.js` thủ công \
> ❌ **Không cần** sửa `main.jsx` để register SW — plugin tự xử lý

### `vite.config.js` mẫu:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Task Manager & Salary Calculator',
        short_name: 'TaskManager',
        description: 'Quản lý công việc và tính lương dạy học',
        start_url: '/dashboard',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ec4899',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Cache API responses — dùng NetworkFirst để luôn lấy data mới nhất
        runtimeCaching: [
          {
            urlPattern: /^\/api\//,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache' },
          },
        ],
      },
    }),
  ],
})
```

### `UpdatePrompt.jsx` — Banner cập nhật (tuỳ chọn):
```jsx
import { useRegisterSW } from 'virtual:pwa-register/react'

export function UpdatePrompt() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="update-banner">
      <span>🆕 Có phiên bản mới!</span>
      <button onClick={() => updateServiceWorker(true)}>Cập nhật ngay</button>
    </div>
  )
}
```
