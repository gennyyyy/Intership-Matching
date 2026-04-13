import pytest
from datetime import timedelta
from jose import jwt
from app.utils.security import (
    verify_password,
    get_password_hash,
    create_access_token
)
from app.config import settings


class TestPasswordHashing:
    """Test password hashing and verification"""

    def test_hash_password(self):
        """Test password hashing"""
        password = "testpassword123"
        hashed = get_password_hash(password)

        assert hashed is not None
        assert hashed != password
        assert len(hashed) > 0

    def test_verify_correct_password(self):
        """Test verification with correct password"""
        password = "testpassword123"
        hashed = get_password_hash(password)

        assert verify_password(password, hashed) is True

    def test_verify_incorrect_password(self):
        """Test verification with incorrect password"""
        password = "testpassword123"
        wrong_password = "wrongpassword"
        hashed = get_password_hash(password)

        assert verify_password(wrong_password, hashed) is False

    def test_different_hashes_for_same_password(self):
        """Test that hashing same password twice produces different hashes"""
        password = "testpassword123"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)

        # Hashes should be different due to salt
        assert hash1 != hash2
        # But both should verify correctly
        assert verify_password(password, hash1)
        assert verify_password(password, hash2)


class TestJWTTokens:
    """Test JWT token creation and validation"""

    def test_create_access_token(self):
        """Test creating an access token"""
        data = {"sub": "test@example.com", "role": "student"}
        token = create_access_token(data)

        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0

    def test_token_contains_correct_data(self):
        """Test that token contains the encoded data"""
        data = {"sub": "test@example.com", "role": "student", "id": "123"}
        token = create_access_token(data)

        # Decode token
        decoded = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])

        assert decoded["sub"] == "test@example.com"
        assert decoded["role"] == "student"
        assert decoded["id"] == "123"
        assert "exp" in decoded

    def test_token_with_custom_expiry(self):
        """Test creating token with custom expiry time"""
        data = {"sub": "test@example.com"}
        expires_delta = timedelta(hours=1)
        token = create_access_token(data, expires_delta)

        decoded = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])

        assert "exp" in decoded

    def test_token_with_default_expiry(self):
        """Test creating token with default expiry time"""
        data = {"sub": "test@example.com"}
        token = create_access_token(data)

        decoded = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])

        assert "exp" in decoded

    def test_token_signature_verification(self):
        """Test that token signature can be verified"""
        data = {"sub": "test@example.com"}
        token = create_access_token(data)

        # This should not raise an exception
        decoded = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        assert decoded is not None

    def test_invalid_token_signature(self):
        """Test that invalid token signature is rejected"""
        data = {"sub": "test@example.com"}
        token = create_access_token(data)

        # Try to decode with wrong secret
        with pytest.raises(Exception):
            jwt.decode(token, "wrong_secret", algorithms=[settings.JWT_ALGORITHM])
