# Internship Matching System - API Documentation

## Base URL
```
http://localhost:8000
```

## API Endpoints

### Authentication

#### Register
- **POST** `/api/auth/register`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student"  // or "employer" or "admin"
}
```
- **Response**: User object (without password)

#### Login
- **POST** `/api/auth/login`
- **Form Data**:
  - `username`: email
  - `password`: password
- **Response**:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

### Users

#### Get Current User Profile
- **GET** `/api/users/me`
- **Auth**: Required
- **Response**: User profile with student_profile or employer_profile

#### Update Profile
- **PUT** `/api/users/me`
- **Auth**: Required
- **Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "student_profile": {
    "university": "University Name",
    "course": "Computer Science",
    "year_level": 3,
    "skills": ["Python", "React", "SQL"],
    "gpa": 3.5,
    "preferred_location": "New York",
    "preferred_field": "Software Development"
  }
}
```
or for employers:
```json
{
  "employer_profile": {
    "company_name": "Tech Corp",
    "company_description": "A tech company",
    "industry": "Technology",
    "website": "https://techcorp.com"
  }
}
```

### Internships

#### List Internships
- **GET** `/api/internships`
- **Auth**: Required
- **Query Params**:
  - `skip`: 0 (pagination offset)
  - `limit`: 100 (max 100)
  - `field`: filter by field
  - `location`: filter by location
  - `status`: open/closed/filled (default: open)

#### Get Internship by ID
- **GET** `/api/internships/{internship_id}`
- **Auth**: Required

#### Create Internship
- **POST** `/api/internships`
- **Auth**: Required (Employer only)
- **Body**:
```json
{
  "title": "Software Engineering Intern",
  "description": "Work on exciting projects...",
  "requirements": ["Currently enrolled in CS program", "Available 20hrs/week"],
  "required_skills": ["Python", "React", "Git"],
  "location": "New York",
  "duration": "3 months",
  "is_paid": true,
  "stipend": 2000,
  "slots": 2,
  "field": "Software Development",
  "deadline": "2026-06-30T00:00:00"
}
```

#### Update Internship
- **PUT** `/api/internships/{internship_id}`
- **Auth**: Required (Employer only, own postings)
- **Body**: Same as create (all fields optional)

#### Delete Internship
- **DELETE** `/api/internships/{internship_id}`
- **Auth**: Required (Employer only, own postings)

#### Get My Postings
- **GET** `/api/internships/employer/my-postings`
- **Auth**: Required (Employer only)

### Applications

#### Apply to Internship
- **POST** `/api/applications`
- **Auth**: Required (Student only)
- **Body**:
```json
{
  "internship_id": 1,
  "cover_letter": "I am interested in this position because..."
}
```

#### Get My Applications
- **GET** `/api/applications`
- **Auth**: Required
- **Description**:
  - Students: Returns their own applications
  - Employers: Returns applications to their internships

#### Get Application by ID
- **GET** `/api/applications/{application_id}`
- **Auth**: Required

#### Get Internship Applicants
- **GET** `/api/applications/internship/{internship_id}/applicants`
- **Auth**: Required (Employer only, own internships)

#### Update Application Status
- **PUT** `/api/applications/{application_id}/status`
- **Auth**: Required
- **Body**:
```json
{
  "status": "accepted"  // or "rejected" (employer) or "withdrawn" (student)
}
```

### Matches (Student AI Matching)

#### Get My Matches
- **GET** `/api/matches`
- **Auth**: Required (Student only)
- **Description**: Returns matched internships with scores, automatically generates/updates matches
- **Response**: Array of matches with internship details

#### Regenerate Matches
- **POST** `/api/matches/regenerate`
- **Auth**: Required (Student only)
- **Description**: Deletes old matches and generates fresh ones

### Admin

#### Get All Users
- **GET** `/api/admin/users`
- **Auth**: Required (Admin only)
- **Query Params**:
  - `skip`: pagination offset
  - `limit`: max results
  - `role`: filter by role (student/employer/admin)

#### Get User by ID
- **GET** `/api/admin/users/{user_id}`
- **Auth**: Required (Admin only)

#### Delete User
- **DELETE** `/api/admin/users/{user_id}`
- **Auth**: Required (Admin only)

#### Get System Statistics
- **GET** `/api/admin/stats`
- **Auth**: Required (Admin only)
- **Response**:
```json
{
  "users": {
    "total": 100,
    "students": 80,
    "employers": 18,
    "admins": 2
  },
  "internships": {
    "total": 50,
    "open": 30,
    "closed": 10,
    "filled": 10
  },
  "applications": {
    "total": 200,
    "pending": 100,
    "accepted": 50,
    "rejected": 50
  },
  "matches": {
    "total": 300,
    "average_score": 72.5
  }
}
```

#### Approve Internship
- **POST** `/api/admin/internships/{internship_id}/approve`
- **Auth**: Required (Admin only)

#### Reject Internship
- **POST** `/api/admin/internships/{internship_id}/reject`
- **Auth**: Required (Admin only)

## Matching Algorithm

The system uses a skill-based weighted scoring algorithm:

**Match Score = (Skill Match × 0.40) + (Field Match × 0.25) + (Location Match × 0.20) + (GPA Factor × 0.15)**

- **Skill Match (40%)**: Percentage of required skills the student has
- **Field Match (25%)**: Does preferred field match internship field (binary)
- **Location Match (20%)**: Does preferred location match internship location (binary)
- **GPA Factor (15%)**: GPA normalized to 0-1 scale (threshold: 3.0)

Minimum match score: 60% (configurable)

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Get the token from the login endpoint and include it in subsequent requests.

## Interactive API Documentation

When the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
