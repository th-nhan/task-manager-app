# 📋 TaskNote - Fullstack Task & Timetable Management App

A comprehensive full-stack personal task, productivity, and class timetable management application built with **React 19 (Vite)**, **Node.js (Express 5)**, **Prisma ORM**, and **PostgreSQL (Supabase)**.

---

## ✨ Key Features

### 🔐 1. Authentication & User Profile
- **Email & Password Authentication**: Secure sign-up and login with password hashing via `bcryptjs` and session management via JWT (`jsonwebtoken`).
- **Quick Google Login**: Seamless Google OAuth 2.0 integration (`@react-oauth/google` and `google-auth-library`).
- **Strict Input Validation**: Strong data sanitization and schema validation powered by `Zod`.
- **User Profile Management**:
  - Update full name and customize user Avatar (supports file uploads with client-side compression, preset avatars, and custom URLs).
  - Secure password change functionality.
  - Interactive personal analytics and task completion performance statistics.
- **Protected Routes**: Automatic redirection and route guards for authenticated dashboard pages.

### 📝 2. Multi-View Task Management
- **Full CRUD Operations**: Create, view details, edit, and delete tasks effortlessly.
- **Status & Priority Levels**:
  - Statuses: 📌 `TODO` | ⏳ `IN_PROGRESS` | ✅ `DONE`.
  - Priorities: `LOW` | `MEDIUM` | `HIGH`.
- **Deadlines & Time Tracking**: Set flexible start dates (`startDate`) and due dates (`dueDate`).
- **Multiple Display Modes**:
  - 📋 **List View**: Traditional list with keyword search, multi-condition filtering (by status, priority, category), and flexible sorting.
  - 📊 **Kanban Board View**: Drag & drop style visual task tracking organized by status columns.
  - 🗓️ **Month Calendar View**: High-level monthly overview of deadlines and scheduled tasks.
  - ⏱️ **Week Schedule View**: Day-by-day weekly breakdown of tasks and workloads.
- **Real-Time Progress Stats**: Overview metric cards displaying task counts by status directly in the dashboard header.

### 📅 3. Class & Timetable Management
- **Schedule Planner**: Add, edit, and organize class sessions, course subjects, classrooms/locations, and instructors.
- **Multiple Schedule Views**:
  - 📆 **Weekly Grid View**: Day-by-day timetable grid matching morning, afternoon, and evening slots.
  - 🏫 **Grade Group View**: Class categorization grouped by grade levels.
  - 🎯 **Weekend Focus View**: Dedicated focus mode for Saturday and Sunday study/work plans.
- **Excel Spreadsheet Import (`.xlsx`)**: Import schedules directly from Excel spreadsheets for automated bulk timetable generation.

### 🏷️ 4. Category & Color Tag Management
- Create custom categories to organize tasks according to your lifestyle (*Work*, *Study*, *Personal*, etc.).
- Assign distinct color palettes to each category for instant recognition.
- Safe deletion and category organization with cascade/set-null handling.

### 🎨 5. Modern UI & Experience (UI/UX)
- Sleek, modern, and accessible design system styled with **Tailwind CSS v4**.
- Intuitive icon set powered by **Lucide React**.
- Real-time **Toast Notification** system (success, error, warning, info).
- Fully responsive layout across all device viewports (Desktop, Tablet, Mobile).

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework & Tooling**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Authentication**: [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)
- **Spreadsheet Processing**: [xlsx](https://www.npmjs.com/package/xlsx)

### Backend (Server)
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database ORM**: [Prisma ORM 6](https://www.prisma.io/)
- **Database**: [PostgreSQL (Supabase)](https://supabase.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Security & Auth**: JWT, bcryptjs, google-auth-library, CORS

---

## 📁 Project Structure

```text
task-manager-app/
├── client/                           # Frontend React + Vite
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── api/                      # Axios instance & API endpoints
│   │   ├── components/               # Reusable UI components
│   │   │   ├── timetable/            # Timetable-specific components
│   │   │   │   ├── ClassDetailModal.jsx
│   │   │   │   ├── ExcelUploaderModal.jsx
│   │   │   │   ├── GradeGroupView.jsx
│   │   │   │   ├── TimetableFormModal.jsx
│   │   │   │   ├── TimetableListView.jsx
│   │   │   │   ├── TimetableStatsCards.jsx
│   │   │   │   ├── WeekendFocusView.jsx
│   │   │   │   └── WeeklyGridView.jsx
│   │   │   ├── CreateTaskModal.jsx   # Task creation/editing modal
│   │   │   ├── CustomSelect.jsx      # Custom select dropdown
│   │   │   ├── DashboardHeader.jsx   # Navigation header & user avatar
│   │   │   ├── DashboardToolbar.jsx  # Search, filter & view switcher toolbar
│   │   │   ├── KanbanBoardView.jsx   # Kanban Board interface
│   │   │   ├── MonthCalendarView.jsx # Monthly Calendar interface
│   │   │   ├── WeekScheduleView.jsx  # Weekly Schedule interface
│   │   │   ├── Notification.jsx      # Toast notification system
│   │   │   └── ProtectedRoute.jsx    # Route protection guard
│   │   ├── context/                  # Context API (AuthContext, NotificationContext)
│   │   ├── pages/                    # Main pages
│   │   │   ├── Dashboard.jsx         # Main task management dashboard
│   │   │   ├── TimetablePage.jsx     # Timetable planner page
│   │   │   ├── ProfilePage.jsx       # User profile & statistics page
│   │   │   ├── Login.jsx             # Sign in page
│   │   │   └── Register.jsx          # Sign up page
│   │   ├── App.jsx                   # Application routing & providers
│   │   ├── index.css                 # Global CSS & Tailwind imports
│   │   └── main.jsx                  # React entry point
│   ├── .env.example                  # Client environment variable template
│   ├── vercel.json                   # Vercel SPA rewrite configuration
│   ├── package.json
│   └── vite.config.js
│
├── server/                           # Backend Node.js + Express
│   ├── prisma/
│   │   └── schema.prisma             # Prisma database schema (PostgreSQL)
│   ├── src/
│   │   ├── config/                   # Prisma Client configuration
│   │   ├── controllers/              # Business logic (Auth, Task, Category)
│   │   ├── middlewares/              # JWT auth verification & Zod validation
│   │   ├── routes/                   # Express API routes
│   │   ├── validation/               # Zod validation schemas
│   │   └── server.js                 # Express server entry point
│   ├── .env.example                  # Server environment variable template
│   └── package.json
│
├── package.json                      # Root package.json (runs client & server concurrently)
└── README.md                         # Project documentation
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18.x or higher)
- A [Supabase](https://supabase.com/) PostgreSQL database (or local PostgreSQL instance).
- [Git](https://git-scm.com/)

### 2. Install Dependencies
Run the following command at the root directory:
```bash
npm run install:all
```

### 3. Configure Environment Variables

#### For Server (`server/.env`):
Create `server/.env` with the following variables:
```env
PORT=5000
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
```
*(Note: If your database password contains special characters like `#`, `%`, `@`, ensure they are URL-encoded, e.g., `#` becomes `%23`).*

#### For Client (`client/.env`):
Create `client/.env` with the following variables:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
```

### 4. Sync Database Schema
From the `server` directory:
```bash
cd server
npx prisma db push
cd ..
```

### 5. Start Development Servers
From the root directory:
```bash
npm run dev
```
- 🌐 **Frontend (Client)**: [http://localhost:5173](http://localhost:5173)
- 🚀 **Backend (Server)**: [http://localhost:5000](http://localhost:5000)

---

## ☁️ Deployment Guide

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com) (choose the region closest to your users, e.g., Singapore / Tokyo).
2. Navigate to **Project Settings** -> **Database** -> Copy the **Prisma Connection Pooling** string.
3. Run `npx prisma db push` from your local machine to automatically provision all database tables.

### 2. Backend Deployment (Render.com)
1. Log in to [Render.com](https://render.com) -> Select **New +** -> **Web Service** -> Connect your GitHub repository.
2. Configuration details:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `PORT`: `5000`
     - `DATABASE_URL`: *(Supabase Transaction Pooler connection string, port 6543)*
     - `DIRECT_URL`: *(Supabase Direct / Session Pooler connection string, port 5432)*
     - `JWT_SECRET`: `your_jwt_secret_key`
     - `GOOGLE_CLIENT_ID`: `your_google_client_id`
3. Click **Deploy** and copy your backend service URL (e.g., `https://task-manager-server.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. Log in to [Vercel](https://vercel.com) -> Click **Add New...** -> **Project** -> Import your GitHub repository.
2. Configuration details:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Environment Variables**:
     - `VITE_API_URL`: `https://task-manager-server.onrender.com/api` *(Make sure to append `/api`)*
     - `VITE_GOOGLE_CLIENT_ID`: `your_google_client_id`
3. Click **Deploy** to receive your live web application URL (e.g., `https://task-manager-app.vercel.app`).

### 4. Google Cloud OAuth 2.0 Configuration
1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Open your OAuth 2.0 Client ID and add your production Vercel domain:
   - **Authorized JavaScript origins**: `https://task-manager-app.vercel.app` *(keep `http://localhost:5173` for local dev)*
   - **Authorized redirect URIs**: `https://task-manager-app.vercel.app`
3. Click **Save** (allow 2–5 minutes for changes to propagate globally).

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user account | ❌ |
| `POST` | `/api/auth/login` | Authenticate with email & password | ❌ |
| `POST` | `/api/auth/google` | Sign in with Google OAuth credentials | ❌ |
| `GET` | `/api/auth/profile` | Retrieve current user profile & statistics | ✅ |
| `PUT` | `/api/auth/profile` | Update profile details and avatar | ✅ |
| `PUT` | `/api/auth/change-password` | Update account password | ✅ |

### 📋 Tasks (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/tasks` | Get task list (with filter, search, sort) | ✅ |
| `GET` | `/api/tasks/:id` | Get details for a single task | ✅ |
| `POST` | `/api/tasks` | Create a new task | ✅ |
| `PUT` | `/api/tasks/:id` | Update an existing task | ✅ |
| `DELETE` | `/api/tasks/:id` | Delete a task | ✅ |

### 🏷️ Categories (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/categories` | Retrieve all categories for current user | ✅ |
| `POST` | `/api/categories` | Create a category with custom color | ✅ |
| `DELETE` | `/api/categories/:id` | Delete a category | ✅ |

### 🩺 System Health
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Check backend server availability status |

---

## 🔒 License & Contributing
This project is open-source and built for personal productivity, educational, and full-stack development purposes. Contributions, feature requests, and feedback are welcome!
