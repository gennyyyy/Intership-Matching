import pytest
from fastapi import status

class TestRegistration:
    """Test user registration endpoints"""

    def test_register_new_user_success(self, client, sample_user_data):
        """Test successful user registration"""
        response = client.post("/api/auth/register", json=sample_user_data)

        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["email"] == sample_user_data["email"]
        assert data["first_name"] == sample_user_data["first_name"]
        assert data["last_name"] == sample_user_data["last_name"]
        assert data["role"] == sample_user_data["role"]
        assert "id" in data
        assert "created_at" in data
        assert "password" not in data
        assert "password_hash" not in data

    def test_register_duplicate_email(self, client, sample_user_data):
        """Test registration with duplicate email fails"""
        # Register first user
        client.post("/api/auth/register", json=sample_user_data)

        # Try to register again with same email
        response = client.post("/api/auth/register", json=sample_user_data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "already registered" in response.json()["detail"].lower()

    def test_register_invalid_email(self, client, sample_user_data):
        """Test registration with invalid email fails"""
        sample_user_data["email"] = "invalid-email"
        response = client.post("/api/auth/register", json=sample_user_data)

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_invalid_role(self, client, sample_user_data):
        """Test registration with invalid role fails"""
        sample_user_data["role"] = "invalid_role"
        response = client.post("/api/auth/register", json=sample_user_data)

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_missing_fields(self, client):
        """Test registration with missing required fields fails"""
        incomplete_data = {
            "email": "test@example.com",
            "first_name": "John"
            # Missing last_name, role, password
        }
        response = client.post("/api/auth/register", json=incomplete_data)

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_student_profile_initialization(self, client, sample_user_data):
        """Test that student profile is initialized for student role"""
        sample_user_data["role"] = "student"
        response = client.post("/api/auth/register", json=sample_user_data)

        assert response.status_code == status.HTTP_201_CREATED

    def test_register_employer_profile_initialization(self, client, sample_user_data):
        """Test that employer profile is initialized for employer role"""
        sample_user_data["role"] = "employer"
        response = client.post("/api/auth/register", json=sample_user_data)

        assert response.status_code == status.HTTP_201_CREATED


class TestLogin:
    """Test user login endpoints"""

    def test_login_success(self, client, sample_user_data):
        """Test successful login"""
        # Register user first
        client.post("/api/auth/register", json=sample_user_data)

        # Login
        login_data = {
            "username": sample_user_data["email"],
            "password": sample_user_data["password"]
        }
        response = client.post("/api/auth/login", data=login_data)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 0

    def test_login_wrong_password(self, client, sample_user_data):
        """Test login with wrong password fails"""
        # Register user first
        client.post("/api/auth/register", json=sample_user_data)

        # Try login with wrong password
        login_data = {
            "username": sample_user_data["email"],
            "password": "wrongpassword"
        }
        response = client.post("/api/auth/login", data=login_data)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "incorrect" in response.json()["detail"].lower()

    def test_login_nonexistent_user(self, client):
        """Test login with non-existent user fails"""
        login_data = {
            "username": "nonexistent@example.com",
            "password": "password123"
        }
        response = client.post("/api/auth/login", data=login_data)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_missing_credentials(self, client):
        """Test login with missing credentials fails"""
        response = client.post("/api/auth/login", data={})

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestHealthCheck:
    """Test application health endpoints"""

    def test_root_endpoint(self, client):
        """Test root endpoint returns welcome message"""
        response = client.get("/")

        assert response.status_code == status.HTTP_200_OK
        assert "message" in response.json()

    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get("/health")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "healthy"
        assert "database" in data
        assert data["type"] == "SQLite"
