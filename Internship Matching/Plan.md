# 📋 Internship Matching System — Implementation Plan

> **Project:** Internship Matching System  
> **Date:** February 27, 2026  
> **SDLC Model:** Agile-Scrum  

---

## 1. Project Overview

The **Internship Matching System** is a web-based platform that connects students with internship opportunities by intelligently matching their skills, preferences, and academic background with employer requirements. The system provides role-based dashboards for students, employers/companies, and administrators.

---

## 2. Tech Stack Summary

| Layer        | Technology                | Version / Notes                                      |
|--------------|---------------------------|------------------------------------------------------|
| **Frontend** | React                     | v19.2.0 (already installed)                          |
| **Frontend** | Tailwind CSS              | v4.x — via `@tailwindcss/vite` plugin                |
| **Frontend** | Vite                      | v7.3.1 (already installed, build tool & dev server)   |
| **Backend**  | Python                    | 3.12+ — REST API using **FastAPI** or **Flask**      |
| **Database** | MongoDB                   | NoSQL document store via **PyMongo** driver           |
| **Auth**     | JWT (JSON Web Tokens)     | Stateless authentication across frontend & backend    |
| **SDLC**     | Agile-Scrum               | 2-week sprints with sprint planning, review, retro    |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                │
│  React 19 + Tailwind CSS 4 + React Router           │
│  ┌─────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Student  │  │ Employer │  │ Admin Dashboard   │  │
│  │Dashboard │  │Dashboard │  │                   │  │
│  └────┬─────┘  └────┬─────┘  └────────┬──────────┘  │
│       └──────────────┼─────────────────┘             │
│                      │  HTTP/REST (JSON)             │
└──────────────────────┼───────────────────────────────┘
                       │
┌──────────────────────┼───────────────────────────────┐
│              BACKEND (Python API Server)             │
│              FastAPI / Flask + PyMongo                │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │Auth/JWT  │  │Matching  │  │CRUD Controllers   │  │
│  │Middleware│  │Algorithm │  │(Users, Internships)│  │
│  └────┬─────┘  └────┬─────┘  └────────┬──────────┘  │
│       └──────────────┼─────────────────┘             │
│                      │                               │
└──────────────────────┼───────────────────────────────┘
                       │
┌──────────────────────┼───────────────────────────────┐
│                  MongoDB Database                    │
│  ┌────────┐  ┌────────────┐  ┌────────────────────┐ │
│  │ users  │  │internships │  │   applications     │ │
│  └────────┘  └────────────┘  └────────────────────┘ │
│  ┌─────────────────┐  ┌──────────────────────────┐  │
│  │   matches       │  │   notifications          │  │
│  └─────────────────┘  └──────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## 4. Frontend Architecture (React + Tailwind CSS)

### 4.1 Dependencies to Install

```bash
# Tailwind CSS v4 with Vite plugin (Context7-verified)
npm install tailwindcss @tailwindcss/vite

# Routing
npm install react-router-dom

# HTTP client
npm install axios

# State management (optional, for complex state)
npm install zustand
# OR use React Context API + useReducer (built-in)

# Icons
npm install lucide-react

# Form handling
npm install react-hook-form

# Toast notifications
npm install react-hot-toast
```

### 4.2 Vite Configuration Update

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000' // Proxy API calls to Python backend
    }
  }
});
```

### 4.3 Tailwind CSS Setup

```css
/* src/index.css */
@import "tailwindcss";
```

> **Note (Context7):** Tailwind CSS v4 no longer requires a `tailwind.config.js` file. Configuration is done via CSS using `@theme` directives directly in your stylesheet.

### 4.4 Proposed Folder Structure

```
src/
├── assets/                  # Static assets (images, icons)
├── components/              # Reusable UI components
│   ├── common/              # Buttons, Inputs, Cards, Modal, Navbar
│   ├── forms/               # LoginForm, RegisterForm, InternshipForm
│   └── layout/              # Header, Footer, Sidebar, PageLayout
├── pages/                   # Route-level page components
│   ├── auth/                # LoginPage, RegisterPage
│   ├── student/             # StudentDashboard, ProfilePage, MatchesPage
│   ├── employer/            # EmployerDashboard, PostInternship, ApplicantsPage
│   └── admin/               # AdminDashboard, ManageUsers, Reports
├── hooks/                   # Custom React hooks (useAuth, useFetch)
├── context/                 # React Context providers (AuthContext)
├── services/                # API service functions (axios calls)
│   ├── authService.js
│   ├── internshipService.js
│   └── matchService.js
├── utils/                   # Helper/utility functions
├── routes/                  # Route definitions & protected routes
│   └── AppRoutes.jsx
├── App.jsx                  # Root component
├── App.css                  # App-level styles (if needed)
├── index.css                # Tailwind CSS entry point
└── main.jsx                 # React DOM render entry
```

### 4.5 Key Frontend Features

| Feature                        | Description                                                       |
|--------------------------------|-------------------------------------------------------------------|
| **Authentication Pages**       | Login & Registration with role selection (Student / Employer)     |
| **Student Dashboard**          | View matched internships, application status, profile management  |
| **Employer Dashboard**         | Post internships, view applicants, manage listings                |
| **Admin Dashboard**            | Manage users, view system analytics, approve/reject postings      |
| **Internship Search/Browse**   | Filter by location, field, skills, duration                       |
| **Profile Management**         | Upload resume, edit skills, academic info                         |
| **Matching Results Page**      | AI/algorithm-suggested matches with relevance scores              |
| **Responsive Design**          | Mobile-first layout using Tailwind CSS                            |

---

## 5. Backend Architecture (Python)

### 5.1 Option A — FastAPI (Recommended)

```bash
pip install fastapi uvicorn pymongo python-jose[cryptography] passlib[bcrypt] python-multipart
```

### 5.2 Option B — Flask

```bash
pip install flask flask-cors pymongo PyJWT passlib[bcrypt]
```

### 5.3 Proposed Backend Folder Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # App entry point (FastAPI/Flask instance)
│   ├── config.py            # Environment config, MongoDB URI, JWT secret
│   ├── database.py          # PyMongo connection setup
│   ├── models/              # Data models / schemas
│   │   ├── user.py
│   │   ├── internship.py
│   │   ├── application.py
│   │   └── match.py
│   ├── routes/              # API route handlers
│   │   ├── auth.py          # POST /api/auth/login, /api/auth/register
│   │   ├── users.py         # GET/PUT /api/users/:id
│   │   ├── internships.py   # CRUD /api/internships
│   │   ├── applications.py  # CRUD /api/applications
│   │   └── matches.py       # GET /api/matches
│   ├── middleware/           # JWT auth middleware, CORS
│   │   └── auth.py
│   ├── services/            # Business logic
│   │   ├── matching.py      # Matching algorithm
│   │   └── notification.py
│   └── utils/               # Helpers (hashing, token generation)
│       └── security.py
├── requirements.txt
├── .env                     # Environment variables
└── run.py                   # Server startup script
```

### 5.4 PyMongo Connection Setup (Context7-verified)

```python
# backend/app/database.py
from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = MongoClient(MONGO_URI)
db = client["internship_matching"]

# Collections
users_collection = db["users"]
internships_collection = db["internships"]
applications_collection = db["applications"]
matches_collection = db["matches"]
```

### 5.5 Key API Endpoints

| Method   | Endpoint                       | Description                          | Auth     |
|----------|--------------------------------|--------------------------------------|----------|
| `POST`   | `/api/auth/register`           | Register a new user                  | Public   |
| `POST`   | `/api/auth/login`              | Login & receive JWT token            | Public   |
| `GET`    | `/api/users/me`                | Get current user profile             | Required |
| `PUT`    | `/api/users/me`                | Update user profile                  | Required |
| `GET`    | `/api/internships`             | List/search internships              | Required |
| `POST`   | `/api/internships`             | Create internship posting            | Employer |
| `PUT`    | `/api/internships/:id`         | Update internship                    | Employer |
| `DELETE` | `/api/internships/:id`         | Delete internship                    | Employer |
| `POST`   | `/api/applications`            | Apply to an internship               | Student  |
| `GET`    | `/api/applications`            | View applications (filtered by role) | Required |
| `PUT`    | `/api/applications/:id/status` | Accept/reject application            | Employer |
| `GET`    | `/api/matches`                 | Get matched internships for student  | Student  |
| `GET`    | `/api/admin/users`             | List all users                       | Admin    |
| `GET`    | `/api/admin/stats`             | System statistics                    | Admin    |

---

## 6. Database Design (MongoDB Collections)

### 6.1 `users` Collection

```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "password_hash": "string",
  "role": "student | employer | admin",
  "first_name": "string",
  "last_name": "string",
  "created_at": "datetime",
  "updated_at": "datetime",

  // Student-specific fields
  "student_profile": {
    "university": "string",
    "course": "string",
    "year_level": "number",
    "skills": ["string"],
    "gpa": "number",
    "resume_url": "string",
    "preferred_location": "string",
    "preferred_field": "string"
  },

  // Employer-specific fields
  "employer_profile": {
    "company_name": "string",
    "company_description": "string",
    "industry": "string",
    "website": "string",
    "logo_url": "string"
  }
}
```

### 6.2 `internships` Collection

```json
{
  "_id": "ObjectId",
  "employer_id": "ObjectId (ref: users)",
  "title": "string",
  "description": "string",
  "requirements": ["string"],
  "required_skills": ["string"],
  "location": "string",
  "duration": "string",
  "is_paid": "boolean",
  "stipend": "number",
  "slots": "number",
  "field": "string",
  "status": "open | closed | filled",
  "created_at": "datetime",
  "deadline": "datetime"
}
```

### 6.3 `applications` Collection

```json
{
  "_id": "ObjectId",
  "student_id": "ObjectId (ref: users)",
  "internship_id": "ObjectId (ref: internships)",
  "status": "pending | accepted | rejected | withdrawn",
  "cover_letter": "string",
  "applied_at": "datetime",
  "updated_at": "datetime"
}
```

### 6.4 `matches` Collection

```json
{
  "_id": "ObjectId",
  "student_id": "ObjectId (ref: users)",
  "internship_id": "ObjectId (ref: internships)",
  "match_score": "number (0-100)",
  "matched_skills": ["string"],
  "created_at": "datetime"
}
```

---

## 7. Matching Algorithm (Core Feature)

### Strategy: Skill-Based Weighted Scoring

```
Match Score = (Skill Match × 0.40) + (Field Match × 0.25) + (Location Match × 0.20) + (GPA Factor × 0.15)
```

| Factor          | Weight | Logic                                                       |
|-----------------|--------|-------------------------------------------------------------|
| Skill Match     | 40%    | Intersection of student skills & required skills             |
| Field Match     | 25%    | Student preferred field == internship field                   |
| Location Match  | 20%    | Student preferred location == internship location            |
| GPA Factor      | 15%    | GPA meets or exceeds a threshold (normalized 0–1)            |

Matches above a configurable threshold (e.g., 60%) are surfaced to the student.

---

## 8. Agile-Scrum Execution Plan

### 8.1 Scrum Roles

| Role             | Responsibility                                               |
|------------------|-------------------------------------------------------------|
| **Product Owner** | Defines features, prioritizes backlog, accepts deliverables |
| **Scrum Master**  | Facilitates ceremonies, removes blockers                    |
| **Dev Team**      | Designs, develops, tests, and deploys the system            |

### 8.2 Sprint Structure (2-Week Sprints)

| Ceremony              | Frequency       | Duration   |
|-----------------------|-----------------|------------|
| Sprint Planning       | Start of sprint | 1–2 hours  |
| Daily Standup         | Every day       | 15 minutes |
| Sprint Review (Demo)  | End of sprint   | 1 hour     |
| Sprint Retrospective  | End of sprint   | 30–60 min  |

---

### 8.3 Sprint Breakdown

#### 🟢 Sprint 1 — Foundation & Authentication (Weeks 1–2)

**Goal:** Project setup, authentication flow, and basic navigation.

| Task                                                  | Priority |
|-------------------------------------------------------|----------|
| Install Tailwind CSS v4 + configure Vite plugin       | High     |
| Set up React Router with page skeleton                | High     |
| Create backend project structure (FastAPI/Flask)      | High     |
| Connect backend to MongoDB via PyMongo                | High     |
| Implement User Registration API (`POST /auth/register`) | High   |
| Implement User Login API (`POST /auth/login`) + JWT   | High     |
| Build Login & Registration UI pages                   | High     |
| Implement AuthContext + Protected Routes in React     | High     |
| Design reusable UI components (Navbar, Button, Input) | Medium   |

**Deliverable:** Users can register, login, and access role-based dashboards.

---

#### 🟡 Sprint 2 — Profiles & Internship Management (Weeks 3–4)

**Goal:** Profile CRUD and internship posting/browsing.

| Task                                                   | Priority |
|--------------------------------------------------------|----------|
| Student profile page (view/edit skills, upload resume) | High     |
| Employer profile page (company info)                   | High     |
| Internship CRUD API endpoints                          | High     |
| Employer: Post Internship form UI                      | High     |
| Employer: Manage Listings page (edit/delete)           | High     |
| Student: Browse/Search Internships page with filters   | High     |
| Internship detail view page                            | Medium   |
| Input validation (frontend + backend)                  | Medium   |

**Deliverable:** Employers can post internships; students can browse and search listings.

---

#### 🔵 Sprint 3 — Applications & Matching System (Weeks 5–6)

**Goal:** Application workflow and matching algorithm.

| Task                                                      | Priority |
|-----------------------------------------------------------|----------|
| Application API endpoints (apply, view, update status)    | High     |
| Student: Apply to internship UI + cover letter            | High     |
| Student: My Applications page (track status)              | High     |
| Employer: View Applicants page per internship             | High     |
| Employer: Accept/Reject applications                      | High     |
| Implement matching algorithm in Python                    | High     |
| Matching API endpoint (`GET /matches`)                    | High     |
| Student: Match Results page with scores                   | High     |
| Notification system (in-app)                              | Medium   |

**Deliverable:** Full application flow + intelligent matching working end-to-end.

---

#### 🟣 Sprint 4 — Admin Panel & Polish (Weeks 7–8)

**Goal:** Admin features, UI polish, responsive design, and deployment prep.

| Task                                                    | Priority |
|---------------------------------------------------------|----------|
| Admin Dashboard: user management (view, deactivate)     | High     |
| Admin Dashboard: system statistics & reports            | High     |
| Admin: Approve/reject internship postings               | Medium   |
| Responsive design pass (mobile + tablet)                | High     |
| Loading states, error handling, empty states            | High     |
| Toast notifications for actions                         | Medium   |
| Performance optimization (lazy loading, code splitting) | Medium   |
| Final integration testing                               | High     |
| Deployment setup (Vercel/Netlify + cloud backend)       | High     |

**Deliverable:** Complete, polished, production-ready application.

---

## 9. Development Workflow

### 9.1 Git Branching Strategy

```
main              ← production-ready code
├── develop       ← integration branch
│   ├── feature/auth-login
│   ├── feature/student-dashboard
│   ├── feature/matching-algorithm
│   └── fix/api-validation
```

- **Feature branches** → PR to `develop` → Code Review → Merge
- **`develop`** → merged into `main` at end of each sprint

### 9.2 Development Servers

| Service     | Command                    | URL                     |
|-------------|----------------------------|-------------------------|
| Frontend    | `npm run dev`              | `http://localhost:5173`  |
| Backend     | `uvicorn app.main:app --reload` | `http://localhost:8000` |
| MongoDB     | `mongod` or MongoDB Atlas  | `mongodb://localhost:27017` |

---

## 10. Environment Variables

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:8000/api
```

### Backend (`.env`)
```
MONGO_URI=mongodb://localhost:27017
DB_NAME=internship_matching
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRY_HOURS=24
```

---

## 11. Definition of Done (DoD)

A feature is considered **Done** when:

- [x] Code is written and follows project conventions
- [x] API endpoint is functional and returns proper responses
- [x] Frontend UI is connected to the API and renders correctly
- [x] Input validation is implemented (frontend + backend)
- [x] Responsive design works on mobile and desktop
- [x] Code is peer-reviewed and merged into `develop`
- [x] No console errors or warnings

---

## 12. Risk Mitigation

| Risk                                    | Mitigation Strategy                                    |
|-----------------------------------------|--------------------------------------------------------|
| MongoDB connection issues               | Use MongoDB Atlas (cloud) as fallback                  |
| Scope creep                             | Strict sprint backlog; defer non-essential to backlog  |
| Matching algorithm inaccuracy           | Iterative tuning with test data; configurable weights  |
| Authentication vulnerabilities          | Use industry-standard JWT + bcrypt hashing             |
| Cross-platform responsive issues        | Mobile-first Tailwind CSS, test on multiple viewports  |

---

## 13. Quick Reference — Key Commands

```bash
# Frontend
cd "Internship Matching"
npm install                          # Install dependencies
npm run dev                          # Start dev server (port 5173)
npm run build                        # Production build

# Tailwind CSS (one-time setup)
npm install tailwindcss @tailwindcss/vite

# Backend
cd backend
pip install -r requirements.txt      # Install Python dependencies
uvicorn app.main:app --reload        # Start FastAPI server (port 8000)

# MongoDB
mongod --dbpath ./data/db            # Start local MongoDB
```

---

> **Next Step:** Begin **Sprint 1** — Install Tailwind CSS, set up routing, scaffold backend, and implement authentication.
