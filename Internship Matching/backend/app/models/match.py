from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.database import Base

# SQLAlchemy ORM Model
class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.id"), nullable=False)
    match_score = Column(Float, nullable=False)
    matched_skills = Column(JSON, nullable=True)  # List of strings
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Pydantic Models for API
class MatchOut(BaseModel):
    id: int
    student_id: int
    internship_id: int
    match_score: float
    matched_skills: List[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
