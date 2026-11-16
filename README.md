# 📋 TaskFlow — Full-Stack Task Management App

> **Pluto Academy MERN Stack Internship — Project 01**  
> Built by **Shivshankar Dhareppa Mali**  
> Candidate Offer Reference: `PA-OL-MS-2026-0237`  
> GitHub Repository: [https://github.com/shiv123-coder/pluto-task-manager-mern](https://github.com/shiv123-coder/pluto-task-manager-mern)

TaskFlow is a production-ready, full-stack Task Management application built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js). It provides secure user authentication with JWT, strict user-level task isolation, dynamic real-time CRUD workflows, customizable priorities, due-date tracking, search, and status filtering.

---

## 📚 Core Concepts & Topics Covered

### 1. Authentication & Security
- **JWT (JSON Web Tokens):** Stateless authentication with encrypted user payload and expiration.
- **Bcrypt Hashing:** Salted password hashing with pre-save hooks to prevent cleartext exposure.
- **Protected Routes Middleware:** Intercepting HTTP requests, verifying Bearer tokens, and attaching the authenticated user context (`req.user`).
- **Security & Hygiene:** CORS origin controls, custom error sanitization, and strict environment variable separation (`.env`).

### 2. Backend Architecture & RESTful API Design
- **MVC Architecture:** Structured separation into Config, Models, Controllers, Middleware, and Routes.
- **Express Router:** Modular endpoint grouping (`/api/auth` and `/api/tasks`).
- **Data Validation & Sanitization:** Server-side request payload checks, regex email validation, and length boundaries.
- **Centralized Error Handling:** Custom 404 handler and unified Express error handler supporting Mongoose CastErrors, duplicate key codes (11000), and validation failures.

### 3. Database Modeling & Cloud NoSQL (MongoDB Atlas)
- **Mongoose ODM:** Explicit schemas with strong type definitions, defaults, and timestamps.
- **Document Relationships:** Referential integrity linking each `Task` to a specific `User` via ObjectId (`ref: 'User'`).
- **Query Optimization:** Case-insensitive search with `$regex`, multi-parameter filtering (`status`, `priority`), and compound sorting by due dates or creation timestamps.

### 4. Modern React Frontend (React 19 + Vite)
- **State Management:** Global `AuthContext` with persistent session recovery via `localStorage`.
- **Navigation & Routing:** React Router DOM v7 client-side routing with `ProtectedRoute` guards.
- **HTTP Client Interceptors:** Axios instance with automated Bearer token attachment and automatic 401 redirect handling.
- **Optimistic UI Updates:** Instant visual state transitions when toggling task completion and deleting items before server round-trips.

### 5. UI/UX Design & Styling
- **Tailwind CSS v4:** Modern utility styling, responsive grid layouts, and color-coded status/priority badges.
- **Lucide Icons:** Clean visual cues and iconography.
- **Interactive States:** Loading skeletons, confirmation dialogs, modal forms, and friendly empty states.

---

## 🌟 Key Features

- **🔐 Robust JWT Authentication:**
  - Secure account registration and login with bcrypt salted password hashing (salt rounds: 10).
  - Protected API routes using JSON Web Tokens (JWT) passed via `Authorization: Bearer <token>`.
  - Auto-login session persistence with automatic token expiration handling.
  - Demo 1-click credential auto-fill for instant evaluator testing.

- **⚡ Full Task CRUD & Workflow Management:**
  - Create new tasks with title, description, priority, status, and due dates.
  - Interactive status toggling (Pending ↔ Completed) with optimistic UI updates.
  - Edit existing tasks in a modern modal interface.
  - Delete tasks with confirmation dialogs.

- **🔍 Search, Filtering & Sorting:**
  - Live text search querying task titles and detailed notes simultaneously.
  - Multi-tab status filtering: *All*, *Pending*, *In Progress*, *Completed*.
  - Priority filter dropdown: *All*, *High*, *Medium*, *Low*.
  - Flexible sorting: *Newest First*, *Oldest First*, *Due Date (Soonest)*, *Due Date (Latest)*.

- **📊 Live Productivity Metrics:**
  - Summary widgets calculating total tasks, completed count, active/in-progress tasks, and a dynamic progress bar for completion rate.

- **🎨 Modern Responsive UI:**
  - Designed with React 19, Tailwind CSS v4, and Lucide React icons.
  - Responsive layouts optimized for desktop, tablet, and mobile displays.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js (Vite), React Router DOM v7, Axios, Tailwind CSS v4, Lucide React |
| **Backend** | Node.js, Express.js, Mongoose ODM, JSON Web Token (jsonwebtoken), Bcryptjs, CORS, Dotenv |
| **Database** | MongoDB Atlas Cloud Cluster |
| **Deployment** | Vercel (Frontend SPA), Render (Backend REST API) |

---

## 📂 Project Structure

```
project-01-task-manager/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection logic
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, and profile
│   │   └── taskController.js     # Task CRUD with filtering and search
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification middleware
│   │   └── errorMiddleware.js    # 404 & centralized error handlers
│   ├── models/
│   │   ├── User.js               # User Mongoose schema with bcrypt hook
│   │   └── Task.js               # Task Mongoose schema with user ref
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   └── taskRoutes.js         # Protected task endpoints
│   ├── .env.example              # Sample environment variables
│   ├── server.js                 # Express app initialization
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx        # Top header navigation & profile
    │   │   ├── ProtectedRoute.jsx# Auth route guard
    │   │   ├── TaskCard.jsx      # Task presentation card with actions
    │   │   └── TaskModal.jsx     # Task creation & editing dialog
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state & persistent session
    │   ├── pages/
    │   │   ├── Dashboard.jsx     # Main workspace with stats, filters & tasks
    │   │   ├── Login.jsx         # User login with demo auto-fill
    │   │   └── Register.jsx      # Account registration
    │   ├── services/
    │   │   └── api.js            # Axios client with interceptors
    │   ├── App.jsx               # Route definitions
    │   ├── main.jsx              # React DOM root
    │   └── index.css             # Tailwind CSS imports
    ├── index.html
    ├── vercel.json               # SPA routing configuration for Vercel
    └── package.json
```

---

## 🚀 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |

### Tasks (`/api/tasks`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Private | Get all tasks (supports `?status=`, `?priority=`, `?search=`, `?sortBy=`) |
| `POST` | `/api/tasks` | Private | Create a new task |
| `GET` | `/api/tasks/:id` | Private | Get task details by ID |
| `PUT` | `/api/tasks/:id` | Private | Update task properties |
| `DELETE`| `/api/tasks/:id` | Private | Remove task from database |

---

## ⚙️ Local Development Setup

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

---

## 💡 Challenge Solved (Submission Note)

> **Biggest Challenge Solved:**  
> Architecting resilient state synchronization between client-side optimistic UI updates (for immediate status toggling and deletions) and backend Mongoose/JWT operations, while preventing race conditions and unauthorized cross-user data leakage through strict user-bound database queries.
