# 📋 TaskFlow — Full-Stack Task Management App

> **Pluto Academy MERN Stack Internship — Project 01**  
> Built by **Shivshankar Dhareppa Mali**  
> Candidate Offer Reference: `PA-OL-MS-2026-0237`

TaskFlow is a production-ready, full-stack Task Management application built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js). It provides secure user authentication with JWT, strict user-level task isolation, dynamic real-time CRUD workflows, customizable priorities, due-date tracking, search, and status filtering.

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
| **Database** | MongoDB Atlas / Local MongoDB (9.0.4) |
| **Deployment** | Vercel (Frontend SPA), Render (Backend REST API) |

---

## 📂 Project Structure

```
project-01-task-manager/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
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

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local service or MongoDB Atlas cluster URI)
- Git

### 1. Backend Setup
```bash
cd backend
npm install

# Create environment configuration
cp .env.example .env
```

Configure your `.env` variables:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskmanager_db
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Or standard start
npm start
```
*Backend runs on `http://localhost:5000`.*

### 2. Frontend Setup
```bash
cd ../frontend
npm install

# Create environment configuration
cp .env.example .env
```

Ensure `.env` points to your backend:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend Vite development server:
```bash
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 💡 Challenge Solved (Submission Note)

> **Biggest Challenge Solved:**  
> Architecting resilient state synchronization between client-side optimistic UI updates (for immediate status toggling and deletions) and backend Mongoose/JWT operations, while preventing race conditions and unauthorized cross-user data leakage through strict user-bound database queries.

