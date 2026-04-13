from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models.application import Application, ApplicationCreate, ApplicationOut, ApplicationStatusUpdate
from app.models.internship import Internship
from app.models.user import User
from app.middleware.auth import get_current_user, get_current_student, get_current_employer
from app.database import get_db

router = APIRouter()

def format_application(app: Application) -> ApplicationOut:
    out = ApplicationOut.model_validate(app)
    if app.student:
        out.student_name = f"{app.student.first_name} {app.student.last_name}"
        out.student_profile = app.student.student_profile
    return out

@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def apply_to_internship(
    application: ApplicationCreate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Apply to an internship (Student only)"""

    # Check if internship exists and is open
    internship = db.query(Internship).filter(Internship.id == application.internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    if internship.status != "open":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This internship is no longer accepting applications"
        )

    # Check if already applied
    existing_application = db.query(Application).filter(
        Application.student_id == current_user.id,
        Application.internship_id == application.internship_id
    ).first()

    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this internship"
        )

    # Create application
    new_application = Application(
        student_id=current_user.id,
        internship_id=application.internship_id,
        cover_letter=application.cover_letter
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return format_application(new_application)

@router.get("", response_model=List[ApplicationOut])
def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get applications based on user role
    - Students: their own applications
    - Employers: applications to their internships
    """

    if current_user.role == "student":
        # Get student's applications
        applications = db.query(Application).filter(
            Application.student_id == current_user.id
        ).all()
    elif current_user.role == "employer":
        # Get applications to employer's internships
        applications = db.query(Application).join(
            Internship, Application.internship_id == Internship.id
        ).filter(Internship.employer_id == current_user.id).all()
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students and employers can view applications"
        )

    return [format_application(app) for app in applications]

@router.get("/{application_id}", response_model=ApplicationOut)
def get_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific application"""
    application = db.query(Application).filter(Application.id == application_id).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Check authorization
    if current_user.role == "student" and application.student_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    elif current_user.role == "employer":
        internship = db.query(Internship).filter(Internship.id == application.internship_id).first()
        if internship.employer_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return format_application(application)

@router.get("/internship/{internship_id}/applicants", response_model=List[ApplicationOut])
def get_internship_applicants(
    internship_id: int,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    """Get all applicants for a specific internship (Employer only)"""

    # Check if internship exists and belongs to employer
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    if internship.employer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view applicants for your own internships"
        )

    applications = db.query(Application).filter(
        Application.internship_id == internship_id
    ).all()

    return [format_application(app) for app in applications]

@router.put("/{application_id}/status", response_model=ApplicationOut)
def update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update application status
    - Students can withdraw their applications
    - Employers can accept/reject applications
    """

    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Students can only withdraw their own applications
    if current_user.role == "student":
        if application.student_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        if status_update.status != "withdrawn":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Students can only withdraw applications"
            )

    # Employers can accept/reject applications to their internships
    elif current_user.role == "employer":
        internship = db.query(Internship).filter(Internship.id == application.internship_id).first()
        if internship.employer_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        if status_update.status not in ["accepted", "rejected"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employers can only accept or reject applications"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students and employers can update application status"
        )

    application.status = status_update.status
    db.commit()
    db.refresh(application)

    return format_application(application)
