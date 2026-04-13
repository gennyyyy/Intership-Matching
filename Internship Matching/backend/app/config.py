import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Database configuration - SQLite for now, can switch to MongoDB later
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./internship_matching.db")

    # MongoDB configuration (for future use)
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME = os.getenv("DB_NAME", "internship_matching")

    # JWT configuration
    JWT_SECRET = os.getenv("JWT_SECRET", "secret")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRY_HOURS = int(os.getenv("JWT_EXPIRY_HOURS", "24"))

settings = Settings()
