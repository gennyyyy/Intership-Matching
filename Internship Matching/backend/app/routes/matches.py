from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models.match import Match, MatchOut
from app.models.internship import Internship, InternshipOut
from app.models.user import User
from app.middleware.auth import get_current_student
from app.database import get_db
from app.services.matching import MatchingService

router = APIRouter()

class MatchWithInternship(MatchOut):
    """Extended match model with internship details"""
    internship: InternshipOut

@router.get("", response_model=List[MatchWithInternship])
def get_my_matches(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get matched internships for current student"""

    # Generate/update matches for the student
    MatchingService.find_matches_for_student(current_user, db)

    # Retrieve matches sorted by score (highest first)
    matches = db.query(Match).filter(
        Match.student_id == current_user.id
    ).order_by(Match.match_score.desc()).all()

    # Enrich matches with internship details
    result = []
    for match in matches:
        internship = db.query(Internship).filter(Internship.id == match.internship_id).first()
        if internship and internship.status == "open":  # Only show open internships
            match_dict = MatchOut.model_validate(match).model_dump()
            match_dict["internship"] = InternshipOut.model_validate(internship).model_dump()
            result.append(match_dict)

    return result

@router.post("/regenerate", status_code=status.HTTP_200_OK)
def regenerate_my_matches(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Force regenerate matches for current student"""

    # Delete existing matches
    db.query(Match).filter(Match.student_id == current_user.id).delete()
    db.commit()

    # Generate new matches
    matches = MatchingService.find_matches_for_student(current_user, db)

    return {
        "message": "Matches regenerated successfully",
        "total_matches": len(matches)
    }
