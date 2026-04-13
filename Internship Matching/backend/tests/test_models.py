import pytest
from datetime import datetime
from pydantic import ValidationError
from app.models.user import UserBase, UserCreate, UserInDB, UserOut, Token, TokenData


class TestUserBase:
    """Test UserBase model validation"""

    def test_valid_user_base(self):
        """Test creating valid UserBase"""
        user = UserBase(
            email="test@example.com",
            first_name="John",
            last_name="Doe",
            role="student"
        )
        assert user.email == "test@example.com"
        assert user.first_name == "John"
        assert user.last_name == "Doe"
        assert user.role == "student"

    def test_invalid_email(self):
        """Test that invalid email raises validation error"""
        with pytest.raises(ValidationError):
            UserBase(
                email="invalid-email",
                first_name="John",
                last_name="Doe",
                role="student"
            )

    def test_invalid_role(self):
        """Test that invalid role raises validation error"""
        with pytest.raises(ValidationError):
            UserBase(
                email="test@example.com",
                first_name="John",
                last_name="Doe",
                role="invalid_role"
            )

    def test_valid_roles(self):
        """Test all valid roles"""
        valid_roles = ["student", "employer", "admin"]

        for role in valid_roles:
            user = UserBase(
                email="test@example.com",
                first_name="John",
                last_name="Doe",
                role=role
            )
            assert user.role == role

    def test_missing_required_fields(self):
        """Test that missing required fields raise validation error"""
        with pytest.raises(ValidationError):
            UserBase(
                email="test@example.com",
                first_name="John"
                # Missing last_name and role
            )


class TestUserCreate:
    """Test UserCreate model validation"""

    def test_valid_user_create(self):
        """Test creating valid UserCreate"""
        user = UserCreate(
            email="test@example.com",
            first_name="John",
            last_name="Doe",
            role="student",
            password="securepassword123"
        )
        assert user.password == "securepassword123"

    def test_missing_password(self):
        """Test that missing password raises validation error"""
        with pytest.raises(ValidationError):
            UserCreate(
                email="test@example.com",
                first_name="John",
                last_name="Doe",
                role="student"
            )


class TestUserInDB:
    """Test UserInDB model validation"""

    def test_valid_user_in_db(self):
        """Test creating valid UserInDB"""
        now = datetime.now()
        user = UserInDB(
            id=123,
            email="test@example.com",
            first_name="John",
            last_name="Doe",
            role="student",
            password_hash="hashed_password",
            created_at=now,
            updated_at=now
        )
        assert user.id == 123
        assert user.password_hash == "hashed_password"
        assert user.created_at == now
        assert user.updated_at == now


class TestUserOut:
    """Test UserOut model validation"""

    def test_valid_user_out(self):
        """Test creating valid UserOut"""
        now = datetime.now()
        user = UserOut(
            id=123,
            email="test@example.com",
            first_name="John",
            last_name="Doe",
            role="student",
            created_at=now
        )
        assert user.id == 123
        assert user.created_at == now
        assert not hasattr(user, "password")
        assert not hasattr(user, "password_hash")

    def test_user_out_excludes_sensitive_data(self):
        """Test that UserOut doesn't include password fields"""
        now = datetime.now()
        user = UserOut(
            id=123,
            email="test@example.com",
            first_name="John",
            last_name="Doe",
            role="student",
            created_at=now
        )
        # Ensure no password-related attributes
        user_dict = user.model_dump()
        assert "password" not in user_dict
        assert "password_hash" not in user_dict


class TestToken:
    """Test Token model validation"""

    def test_valid_token(self):
        """Test creating valid Token"""
        token = Token(
            access_token="some.jwt.token",
            token_type="bearer"
        )
        assert token.access_token == "some.jwt.token"
        assert token.token_type == "bearer"

    def test_missing_token_fields(self):
        """Test that missing token fields raise validation error"""
        with pytest.raises(ValidationError):
            Token(access_token="some.jwt.token")


class TestTokenData:
    """Test TokenData model validation"""

    def test_valid_token_data(self):
        """Test creating valid TokenData"""
        token_data = TokenData(email="test@example.com")
        assert token_data.email == "test@example.com"

    def test_optional_email(self):
        """Test that email is optional in TokenData"""
        token_data = TokenData()
        assert token_data.email is None

    def test_none_email(self):
        """Test TokenData with None email"""
        token_data = TokenData(email=None)
        assert token_data.email is None
