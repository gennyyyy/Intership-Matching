from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User, UserProfileOut, UserProfileUpdate
from app.middleware.auth import get_current_user
from app.database import get_db

router = APIRouter()

@router.get("/me", response_model=UserProfileOut)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile"""
    return UserProfileOut.model_validate(current_user)

@router.put("/me", response_model=UserProfileOut)
def update_my_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""

    # Update basic fields
    if profile_update.first_name is not None:
        current_user.first_name = profile_update.first_name
    if profile_update.last_name is not None:
        current_user.last_name = profile_update.last_name

    # Update student profile
    if profile_update.student_profile is not None:
        if current_user.role != "student":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only students can update student profile"
            )
        # Update and re-assign for mutation tracking
        current_data = dict(current_user.student_profile or {})
        update_data = profile_update.student_profile.model_dump(exclude_unset=True)
        current_data.update(update_data)
        current_user.student_profile = current_data

    # Update employer profile
    if profile_update.employer_profile is not None:
        if current_user.role != "employer":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only employers can update employer profile"
            )
        # Update with new values via re-assignment for SQLAlchemy mutation tracking
        new_profile = dict(current_user.employer_profile or {})
        new_profile.update(profile_update.employer_profile.model_dump(exclude_unset=True))
        current_user.employer_profile = new_profile

    db.commit()
    db.refresh(current_user)

    return UserProfileOut.model_validate(current_user)
