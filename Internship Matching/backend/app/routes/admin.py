from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.models.user import User, UserProfileOut
from app.models.internship import Internship
from app.models.application import Application
from app.models.match import Match
from app.middleware.auth import get_current_admin
from app.database import get_db

router = APIRouter()

@router.get("/users", response_model=List[UserProfileOut])
def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    role: str = Query(None, pattern="^(student|employer|admin)$"),
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all users with optional role filter (Admin only)"""
    query = db.query(User)

    if role:
        query = query.filter(User.role == role)

    users = query.offset(skip).limit(limit).all()
    return [UserProfileOut.model_validate(u) for u in users]

@router.get("/users/{user_id}", response_model=UserProfileOut)
def get_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get specific user by ID (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserProfileOut.model_validate(user)

@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a user (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent admin from deleting themselves
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    db.delete(user)
    db.commit()
    return None

@router.get("/stats")
def get_system_stats(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get system-wide statistics (Admin only)"""

    # User statistics
    total_users = db.query(func.count(User.id)).scalar()
    total_students = db.query(func.count(User.id)).filter(User.role == "student").scalar()
    total_employers = db.query(func.count(User.id)).filter(User.role == "employer").scalar()

    # Internship statistics
    total_internships = db.query(func.count(Internship.id)).scalar()
    open_internships = db.query(func.count(Internship.id)).filter(Internship.status == "open").scalar()
    closed_internships = db.query(func.count(Internship.id)).filter(Internship.status == "closed").scalar()
    filled_internships = db.query(func.count(Internship.id)).filter(Internship.status == "filled").scalar()

    # Application statistics
    total_applications = db.query(func.count(Application.id)).scalar()
    pending_applications = db.query(func.count(Application.id)).filter(Application.status == "pending").scalar()
    accepted_applications = db.query(func.count(Application.id)).filter(Application.status == "accepted").scalar()
    rejected_applications = db.query(func.count(Application.id)).filter(Application.status == "rejected").scalar()

    # Match statistics
    total_matches = db.query(func.count(Match.id)).scalar()
    avg_match_score = db.query(func.avg(Match.match_score)).scalar()

    return {
        "users": {
            "total": total_users,
            "students": total_students,
            "employers": total_employers,
            "admins": total_users - total_students - total_employers
        },
        "internships": {
            "total": total_internships,
            "open": open_internships,
            "closed": closed_internships,
            "filled": filled_internships
        },
        "applications": {
            "total": total_applications,
            "pending": pending_applications,
            "accepted": accepted_applications,
            "rejected": rejected_applications
        },
        "matches": {
            "total": total_matches,
            "average_score": round(avg_match_score, 2) if avg_match_score else 0
        }
    }

@router.post("/internships/{internship_id}/approve")
def approve_internship(
    internship_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Approve an internship posting (Admin only)"""
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    internship.status = "open"
    db.commit()

    return {"message": "Internship approved successfully"}

@router.post("/internships/{internship_id}/reject")
def reject_internship(
    internship_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Reject an internship posting (Admin only)"""
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    internship.status = "closed"
    db.commit()

    return {"message": "Internship rejected successfully"}
