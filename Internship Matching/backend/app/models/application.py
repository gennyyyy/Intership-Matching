from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

# SQLAlchemy ORM Model
class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.id"), nullable=False)
    status = Column(String, default="pending")  # pending, accepted, rejected, withdrawn
    cover_letter = Column(String, nullable=True)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship to get student details
    student = relationship("User", foreign_keys=[student_id])

# Pydantic Models for API
class ApplicationBase(BaseModel):
    internship_id: int
    cover_letter: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationOut(ApplicationBase):
    id: int
    student_id: int
    status: str
    applied_at: datetime
    updated_at: datetime
    student_name: Optional[str] = None
    student_profile: Optional[dict] = None

    model_config = ConfigDict(from_attributes=True)

class ApplicationStatusUpdate(BaseModel):
    status: str = Field(pattern="^(pending|accepted|rejected|withdrawn)$")
