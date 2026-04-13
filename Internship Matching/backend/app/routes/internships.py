from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.internship import Internship, InternshipCreate, InternshipUpdate, InternshipOut
from app.models.user import User
from app.middleware.auth import get_current_user, get_current_employer
from app.database import get_db

router = APIRouter()

@router.get("", response_model=List[InternshipOut])
def get_internships(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    field: Optional[str] = None,
    location: Optional[str] = None,
    status: Optional[str] = Query("open", pattern="^(open|closed|filled)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get list of internships with optional filters"""
    query = db.query(Internship)

    # Apply filters
    if status:
        query = query.filter(Internship.status == status)
    if field:
        query = query.filter(Internship.field.ilike(f"%{field}%"))
    if location:
        query = query.filter(Internship.location.ilike(f"%{location}%"))

    internships = query.offset(skip).limit(limit).all()
    return [InternshipOut.model_validate(i) for i in internships]

@router.get("/{internship_id}", response_model=InternshipOut)
def get_internship(
    internship_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific internship by ID"""
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    return InternshipOut.model_validate(internship)

@router.post("", response_model=InternshipOut, status_code=status.HTTP_201_CREATED)
def create_internship(
    internship: InternshipCreate,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    """Create a new internship posting (Employer only)"""
    new_internship = Internship(
        employer_id=current_user.id,
        **internship.model_dump()
    )

    db.add(new_internship)
    db.commit()
    db.refresh(new_internship)

    return InternshipOut.model_validate(new_internship)

@router.put("/{internship_id}", response_model=InternshipOut)
def update_internship(
    internship_id: int,
    internship_update: InternshipUpdate,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    """Update an internship posting (Employer only - own postings)"""
    internship = db.query(Internship).filter(Internship.id == internship_id).first()

    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    # Check if user owns this internship
    if internship.employer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own internship postings"
        )

    # Update fields
    update_data = internship_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(internship, field, value)

    db.commit()
    db.refresh(internship)

    return InternshipOut.model_validate(internship)

@router.delete("/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_internship(
    internship_id: int,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    """Delete an internship posting (Employer only - own postings)"""
    internship = db.query(Internship).filter(Internship.id == internship_id).first()

    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    # Check if user owns this internship
    if internship.employer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own internship postings"
        )

    db.delete(internship)
    db.commit()

    return None

@router.get("/employer/my-postings", response_model=List[InternshipOut])
def get_my_internships(
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    """Get all internship postings by current employer"""
    internships = db.query(Internship).filter(Internship.employer_id == current_user.id).all()
    return [InternshipOut.model_validate(i) for i in internships]
