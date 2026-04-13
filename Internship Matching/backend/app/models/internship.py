from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, JSON, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

# SQLAlchemy ORM Model
class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    requirements = Column(JSON, nullable=True)  # List of strings
    required_skills = Column(JSON, nullable=True)  # List of strings
    location = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    is_paid = Column(Boolean, default=False)
    stipend = Column(Float, nullable=True)
    slots = Column(Integer, default=1)
    field = Column(String, nullable=False)
    status = Column(String, default="open")  # open, closed, filled
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deadline = Column(DateTime(timezone=True), nullable=True)

# Pydantic Models for API
class InternshipBase(BaseModel):
    title: str
    description: str
    requirements: Optional[List[str]] = []
    required_skills: Optional[List[str]] = []
    location: str
    duration: str
    is_paid: bool = False
    stipend: Optional[float] = None
    slots: int = 1
    field: str
    deadline: Optional[datetime] = None

class InternshipCreate(InternshipBase):
    pass

class InternshipUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    required_skills: Optional[List[str]] = None
    location: Optional[str] = None
    duration: Optional[str] = None
    is_paid: Optional[bool] = None
    stipend: Optional[float] = None
    slots: Optional[int] = None
    field: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(open|closed|filled)$")
    deadline: Optional[datetime] = None

class InternshipOut(InternshipBase):
    id: int
    employer_id: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
