# 🎓 Internship Matching System

An intelligent web-based platform designed to bridge the gap between students and employers. The system utilizes a skill-based weighted matching algorithm to connect students with the most relevant internship opportunities.

---

## 🚀 Features

### 👨‍🎓 For Students
- **Smart Matching**: Receive internship recommendations based on skills, preferred field, location, and GPA.
- **Profile Management**: Build a professional profile including skills, academic background, and resume.
- **Application Tracking**: Apply to internships and monitor application status in real-time.
- **Browse & Search**: Filter internships by location, field, and requirements.

### 🏢 For Employers
- **Internship Management**: Create, update, and manage internship listings.
- **Applicant Review**: View student profiles and manage applications (Accept/Reject).
- **Company Branding**: Manage company information and industry details.

### 🛡️ For Administrators
- **System Overview**: Monitor user activity and system-wide statistics.
- **User Management**: Oversee student and employer accounts.
- **Quality Control**: Review and moderate internship postings.

---

## 🧠 Matching Algorithm
The core of the system is a weighted scoring engine that evaluates matches based on:
- **Skill Match (40%)**: Intersection of student skills and internship requirements.
- **Field Match (25%)**: Alignment between student's preferred field and the internship category.
- **Location Match (20%)**: Compatibility of student's preferred location.
- **GPA Factor (15%)**: Academic performance relative to requirements.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12+)
- **Database**: SQLite with [SQLAlchemy ORM](https://www.sqlalchemy.org/)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/)

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (3.12+)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Internship Matching"
   ```

2. **Frontend Setup**
   ```bash
   npm install
   ```

3. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   pip install -r requirements.txt
   cd ..
   ```

### Running the Application
To start both the frontend and backend simultaneously:
```bash
npm run dev:all
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📁 Project Structure
```
Internship Matching/
├── backend/                # FastAPI Application
│   ├── app/                # Source code
│   │   ├── models/         # SQLAlchemy Models
│   │   ├── routes/         # API Endpoints
│   │   ├── services/       # Matching Logic
│   │   └── database.py     # DB Connection
│   └── requirements.txt    # Python Dependencies
├── src/                    # React Application
│   ├── components/         # UI Components
│   ├── pages/              # Page Views
│   ├── services/           # API Integration
│   └── context/            # Global State (Auth)
├── public/                 # Static Assets
└── package.json            # Node Dependencies & Scripts
```

---

## 📝 License
This project is developed as part of an Internship Matching System implementation plan.
