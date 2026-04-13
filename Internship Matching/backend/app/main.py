from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, users, internships, applications, matches, admin

# Import models to ensure they are registered with Base
from app.models.user import User
from app.models.internship import Internship
from app.models.application import Application
from app.models.match import Match

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Internship Matching API",
    version="1.0.0",
    description="API for matching students with internship opportunities"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(internships.router, prefix="/api/internships", tags=["Internships"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(matches.router, prefix="/api/matches", tags=["Matches"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Internship Matching System API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected", "type": "SQLite"}
