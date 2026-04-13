from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base

# SQLAlchemy ORM Model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # student, employer, admin
    password_hash = Column(String, nullable=False)
    student_profile = Column(JSON, nullable=True)
    employer_profile = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

# Pydantic Models for API
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: str = Field(pattern="^(student|employer|admin)$")

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: int
    password_hash: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserOut(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Profile Schemas
class StudentProfile(BaseModel):
    university: Optional[str] = None
    course: Optional[str] = None
    year_level: Optional[int] = None
    skills: List[str] = Field(default_factory=list)
    gpa: Optional[float] = None
    resume_url: Optional[str] = None
    preferred_location: Optional[str] = None
    preferred_field: Optional[str] = None

class EmployerProfile(BaseModel):
    company_name: Optional[str] = None
    company_description: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    looking_for: List[str] = Field(default_factory=list)

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    student_profile: Optional[StudentProfile] = None
    employer_profile: Optional[EmployerProfile] = None

class UserProfileOut(UserBase):
    id: int
    student_profile: Optional[dict] = None
    employer_profile: Optional[dict] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
