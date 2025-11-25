📌 Task Manager with Role-Based Access

A MERN Stack Assignment – User & Admin Task Management System

🔗 Live Frontend: https://role-based-productivity-app.vercel.app/

🔗 GitHub Repository: https://github.com/eshwarpresi/Role-Based-Productivity-App.git

🚀 Overview

This is a Role-Based Task Manager where users can manage their own tasks and admins can view and manage tasks of all users.
The project includes JWT authentication, role-based authorization, task CRUD, and a clean React UI.

🛠️ Tech Stack
Frontend

React (Vite)

Axios

React Router

LocalStorage Auth

Backend

Node.js + Express

MongoDB + Mongoose

JWT Auth

bcryptjs (password hashing)

CORS

✨ Features
🔑 Authentication

User Registration

User Login

JWT-based authorization

Password hashing with bcrypt

Roles: user, admin

📝 Task Management

Each task includes:

Title (required)

Description (optional)

Status: pending / in-progress / completed

createdBy

createdAt / updatedAt

👤 User Capabilities

Create tasks

Edit own tasks

Delete own tasks

View only their tasks

👑 Admin Capabilities

View all tasks

Delete any task

🔗 API Endpoints
Auth Routes
Method	Endpoint	Description
POST	/api/register	Register new user
POST	/api/login	Login and get JWT token
Task Routes
Method	Endpoint	Description
POST	/api/tasks	Create a task
GET	/api/tasks	Get tasks (user = own tasks, admin = all tasks)
GET	/api/tasks/:id	Get specific task
PUT	/api/tasks/:id	Update own task
DELETE	/api/tasks/:id	Delete own task (admin can delete any)
🎨 Frontend Pages

Register Page

Login Page

Dashboard (User/Admin)

Create/Edit Task Page

UI Highlights

Minimal clean UI

Token stored in localStorage

Auth protected routes

Axios for API calls

⭐ Bonus Implementations (If included)

Search & Filter tasks

Pagination

Reusable components

JOI validation

Loading & Error states

📂 Folder Structure
/backend
   /controllers
   /models
   /routes
   /middleware
   server.js

/frontend
   /src
      /components
      /pages
      /context
      /hooks
      App.jsx

🧪 Setup Instructions (Local)
1️⃣ Clone Repository
git clone https://github.com/eshwarpresi/Role-Based-Productivity-App.git

🔧 Backend Setup
cd backend
npm install

Add .env file:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Start backend:
npm start

💻 Frontend Setup
cd frontend
npm install
npm run dev

🌍 Deployment

Frontend → Vercel
Backend → Render / Vercel Serverless / Railway

📸 Screenshots (Optional)

Add UI screenshots if needed.

🙌 Author

Eshwar Raju
Role-Based Productivity App – MERN Stack Assignment