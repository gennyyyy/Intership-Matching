from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.models.user import User, UserCreate, UserOut, Token
from app.utils.security import get_password_hash, verify_password, create_access_token
from app.database import get_db

router = APIRouter()

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user record
    new_user = User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        password_hash=get_password_hash(user.password),
    )

    # Initialize profile based on role
    if user.role == "student":
        new_user.student_profile = {}
    elif user.role == "employer":
        new_user.employer_profile = {}

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Return user data (without password hash)
    return UserOut.model_validate(new_user)

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": user.email, "role": user.role, "id": str(user.id)}
    )

    return {"access_token": access_token, "token_type": "bearer"}
