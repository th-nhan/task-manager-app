# 📋 Task Manager App

Ứng dụng quản lý công việc và nhiệm vụ cá nhân toàn diện (Full-stack Task Management Application) được xây dựng trên nền tảng **React (Vite)**, **Node.js (Express)**, **Prisma ORM** và cơ sở dữ liệu **PostgreSQL**.

---

## ✨ Tính năng nổi bật (Features)

### 🔐 1. Xác thực & Người dùng (Authentication)
- **Đăng ký & Đăng nhập**: Xác thực bằng Email & Mật khẩu với mã hóa mật khẩu (`bcryptjs`) và xác thực JWT (`jsonwebtoken`).
- **Đăng nhập nhanh với Google**: Tích hợp Google OAuth 2.0 (`@react-oauth/google` và `google-auth-library`).
- **Xác thực dữ liệu đầu vào**: Kiểm tra tính hợp lệ của dữ liệu với thư viện `Zod`.
- **Bảo vệ đường dẫn (Protected Routes)**: Chỉ cho phép truy cập Dashboard khi đã đăng nhập.

### 📝 2. Quản lý công việc (Task Management)
- **CRUD Công việc**: Thêm mới, xem chi tiết, chỉnh sửa và xóa công việc dễ dàng.
- **Trạng thái công việc**: Hỗ trợ 3 trạng thái linh hoạt:
  - 📌 `TODO` (Cần làm)
  - ⏳ `IN_PROGRESS` (Đang thực hiện)
  - ✅ `DONE` (Hoàn thành)
- **Mức độ ưu tiên**: Phân loại theo mức độ quan trọng `LOW` (Thấp), `MEDIUM` (Trung bình), `HIGH` (Cao).
- **Hạn chót & Thời gian**: Thiết lập ngày bắt đầu (`startDate`) và hạn chót (`dueDate`).
- **Tìm kiếm & Lọc nâng cao**:
  - Tìm kiếm công việc theo từ khóa/tiêu đề.
  - Bộ lọc theo Trạng thái, Độ ưu tiên và Danh mục.
  - Sắp xếp theo ngày tạo, ngày hết hạn hoặc mức độ ưu tiên.
- **Thống kê tổng quan**: Đếm số lượng công việc theo từng trạng thái trực quan trên giao diện.

### 🏷️ 3. Quản lý danh mục (Category Management)
- Tạo danh mục phân loại công việc theo nhu cầu (ví dụ: *Công việc*, *Học tập*, *Cá nhân*,...).
- Tùy chỉnh màu sắc riêng biệt cho từng danh mục để nhận diện nhanh chóng.
- Xóa danh mục khi không còn sử dụng.

### 🎨 4. Giao diện & Trải nghiệm (UI/UX)
- Giao diện hiện đại, sạch sẽ và tối ưu trải nghiệm người dùng với **Tailwind CSS v4**.
- Bộ icon trực quan từ **Lucide React**.
- Hệ thống thông báo **Toast Notification** thời gian thực (thành công, lỗi, cảnh báo).
- Thiết kế tương thích đa thiết bị (**Responsive Design** cho cả PC, Tablet, Mobile).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### Frontend (Client)
- **Framework / Tooling**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Auth**: [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)

### Backend (Server)
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database ORM**: [Prisma ORM 6](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: JWT, bcryptjs, google-auth-library
- **Dev Tool**: Nodemon

---

## 📁 Cấu trúc thư mục dự án (Project Structure)

```text
task-manager-app/
├── client/                     # Frontend React + Vite
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/                # Cấu hình Axios & API client
│   │   ├── components/         # Components tái sử dụng (Modal, Notification, ProtectedRoute,...)
│   │   ├── context/            # Context API (AuthContext, NotificationContext)
│   │   ├── pages/              # Trang chính (Dashboard, Login, Register)
│   │   ├── App.jsx             # Routing & Providers
│   │   ├── index.css           # Global Tailwind CSS
│   │   └── main.jsx            # Entry point Frontend
│   ├── .env.example            # Biến môi trường mẫu Client
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Node.js + Express
│   ├── prisma/
│   │   └── schema.prisma       # Database schema & Prisma models
│   ├── src/
│   │   ├── config/             # Cấu hình kết nối (Prisma client)
│   │   ├── controllers/        # Xử lý logic nghiệp vụ (Auth, Tasks, Categories)
│   │   ├── middlewares/        # Middlewares (Auth verification, Zod validation)
│   │   ├── routes/             # Định tuyến API (auth, task, category)
│   │   ├── validation/         # Zod schemas xác thực dữ liệu
│   │   └── server.js           # Entry point Backend Express
│   ├── .env.example            # Biến môi trường mẫu Server
│   └── package.json
│
└── README.md                   # Tài liệu hướng dẫn dự án
```

---

## 🚀 Hướng dẫn cài đặt & Chạy ứng dụng (Getting Started)

### 1. Yêu cầu hệ thống (Prerequisites)
- [Node.js](https://nodejs.org/) (phiên bản 18.x trở lên)
- [PostgreSQL](https://www.postgresql.org/) đang chạy ở local hoặc cloud (Supabase, Neon, Railway,...)
- [Git](https://git-scm.com/)

---

### 2. Cài đặt Backend (Server)

1. Mở terminal và chuyển vào thư mục `server`:
   ```bash
   cd server
   ```

2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```

3. Thiết lập biến môi trường:
   - Tạo file `.env` từ `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Cập nhật thông tin trong file `server/.env`:
     ```env
     PORT=5000
     DATABASE_URL="postgresql://username:password@localhost:5432/taskdb?schema=public"
     JWT_SECRET=your_jwt_secret_key_here
     GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
     ```

4. Đồng bộ cơ sở dữ liệu với Prisma:
   ```bash
   npx prisma db push
   # hoặc npx prisma migrate dev
   ```

5. Khởi chạy Server ở chế độ phát triển:
   ```bash
   npm run dev
   ```
   > 🚀 Server sẽ chạy tại: `http://localhost:5000`

---

### 3. Cài đặt Frontend (Client)

1. Mở một terminal mới và chuyển vào thư mục `client`:
   ```bash
   cd client
   ```

2. Cài đặt các thư viện:
   ```bash
   npm install
   ```

3. Thiết lập biến môi trường:
   - Tạo file `.env` từ `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Cập nhật thông tin trong file `client/.env`:
     ```env
     VITE_API_URL=http://localhost:5000/api
     VITE_GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
     ```

4. Khởi chạy Client:
   ```bash
   npm run dev
   ```
   > 🌐 Giao diện web sẽ mở tại: `http://localhost:5173`

---

## 📡 Danh sách API Endpoints (API Reference)

### 🔐 Authentication (`/api/auth`)
| Phương thức | Endpoint | Mô tả | Yêu cầu Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Đăng ký tài khoản mới | ❌ |
| `POST` | `/api/auth/login` | Đăng nhập tài khoản | ❌ |
| `POST` | `/api/auth/google` | Đăng nhập qua tài khoản Google | ❌ |

### 📋 Tasks (`/api/tasks`)
| Phương thức | Endpoint | Mô tả | Yêu cầu Auth |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/tasks` | Lấy danh sách công việc (hỗ trợ filter/search/sort) | ✅ |
| `GET` | `/api/tasks/:id` | Xem chi tiết 1 công việc | ✅ |
| `POST` | `/api/tasks` | Tạo công việc mới | ✅ |
| `PUT` | `/api/tasks/:id` | Cập nhật thông tin công việc | ✅ |
| `DELETE` | `/api/tasks/:id` | Xóa công việc | ✅ |

### 🏷️ Categories (`/api/categories`)
| Phương thức | Endpoint | Mô tả | Yêu cầu Auth |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/categories` | Lấy danh sách danh mục của người dùng | ✅ |
| `POST` | `/api/categories` | Tạo danh mục mới kèm mã màu | ✅ |
| `DELETE` | `/api/categories/:id` | Xóa danh mục | ✅ |

---

## 🔒 Bản quyền & Đóng góp (License & Contributing)
Dự án được xây dựng phục vụ mục đích học tập và quản lý công việc cá nhân. Mọi đóng góp hoặc ý kiến phản hồi đều được hoan nghênh!
