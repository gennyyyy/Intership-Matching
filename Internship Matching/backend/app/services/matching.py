from typing import List, Dict
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.internship import Internship
from app.models.match import Match

class MatchingService:
    """
    Matching Algorithm: Skill-Based Weighted Scoring

    Match Score = (Skill Match × 0.40) + (Field Match × 0.25) + (Location Match × 0.20) + (GPA Factor × 0.15)

    Factors:
    - Skill Match (40%): Intersection of student skills & required skills
    - Field Match (25%): Student preferred field == internship field
    - Location Match (20%): Student preferred location == internship location
    - GPA Factor (15%): GPA meets or exceeds threshold (normalized 0-1)
    """

    # Configurable weights
    SKILL_WEIGHT = 0.40
    FIELD_WEIGHT = 0.25
    LOCATION_WEIGHT = 0.20
    GPA_WEIGHT = 0.15

    # Configurable thresholds
    MIN_MATCH_SCORE = 60.0  # Only return matches above this score
    GPA_THRESHOLD = 3.0  # Base GPA threshold

    @staticmethod
    def calculate_skill_match(student_skills: List[str], required_skills: List[str]) -> tuple[float, List[str]]:
        """Calculate skill match percentage and return matched skills"""
        if not required_skills:
            return 1.0, []

        student_skills_lower = [s.lower().strip() for s in (student_skills or [])]
        required_skills_lower = [s.lower().strip() for s in required_skills]

        matched_skills = [
            skill for skill in required_skills
            if skill.lower().strip() in student_skills_lower
        ]

        match_ratio = len(matched_skills) / len(required_skills) if required_skills else 0
        return match_ratio, matched_skills

    @staticmethod
    def calculate_field_match(student_field: str, internship_field: str) -> float:
        """Calculate field match (binary: 1.0 or 0.0)"""
        if not student_field or not internship_field:
            return 0.0

        return 1.0 if student_field.lower().strip() == internship_field.lower().strip() else 0.0

    @staticmethod
    def calculate_location_match(student_location: str, internship_location: str) -> float:
        """Calculate location match (binary: 1.0 or 0.0)"""
        if not student_location or not internship_location:
            return 0.0

        return 1.0 if student_location.lower().strip() == internship_location.lower().strip() else 0.0

    @staticmethod
    def calculate_gpa_factor(student_gpa: float) -> float:
        """Calculate GPA factor (normalized 0-1)"""
        if student_gpa is None:
            return 0.5  # Neutral score if GPA not provided

        # Normalize GPA (assuming 4.0 scale)
        # Above threshold gets full score, below gets proportional
        if student_gpa >= MatchingService.GPA_THRESHOLD:
            return 1.0
        else:
            return student_gpa / MatchingService.GPA_THRESHOLD

    @staticmethod
    def calculate_match_score(student: User, internship: Internship) -> tuple[float, List[str]]:
        """Calculate overall match score between student and internship"""

        # Get student profile
        student_profile = student.student_profile or {}

        # Extract student attributes
        student_skills = student_profile.get("skills", [])
        student_field = student_profile.get("preferred_field", "")
        student_location = student_profile.get("preferred_location", "")
        student_gpa = student_profile.get("gpa")

        # Calculate individual factors
        skill_match, matched_skills = MatchingService.calculate_skill_match(
            student_skills, internship.required_skills or []
        )
        field_match = MatchingService.calculate_field_match(student_field, internship.field)
        location_match = MatchingService.calculate_location_match(student_location, internship.location)
        gpa_factor = MatchingService.calculate_gpa_factor(student_gpa)

        # Calculate weighted score (0-100 scale)
        match_score = (
            skill_match * MatchingService.SKILL_WEIGHT +
            field_match * MatchingService.FIELD_WEIGHT +
            location_match * MatchingService.LOCATION_WEIGHT +
            gpa_factor * MatchingService.GPA_WEIGHT
        ) * 100

        return round(match_score, 2), matched_skills

    @staticmethod
    def find_matches_for_student(student: User, db: Session) -> List[Match]:
        """Find and create matches for a student"""

        if student.role != "student":
            return []

        # Get all open internships
        open_internships = db.query(Internship).filter(Internship.status == "open").all()

        matches = []
        for internship in open_internships:
            match_score, matched_skills = MatchingService.calculate_match_score(student, internship)

            # Only include matches above threshold
            if match_score >= MatchingService.MIN_MATCH_SCORE:
                # Check if match already exists
                existing_match = db.query(Match).filter(
                    Match.student_id == student.id,
                    Match.internship_id == internship.id
                ).first()

                if existing_match:
                    # Update existing match
                    existing_match.match_score = match_score
                    existing_match.matched_skills = matched_skills
                    matches.append(existing_match)
                else:
                    # Create new match
                    new_match = Match(
                        student_id=student.id,
                        internship_id=internship.id,
                        match_score=match_score,
                        matched_skills=matched_skills
                    )
                    db.add(new_match)
                    matches.append(new_match)

        db.commit()
        return matches

    @staticmethod
    def regenerate_all_matches(db: Session):
        """Regenerate matches for all students"""
        students = db.query(User).filter(User.role == "student").all()

        for student in students:
            MatchingService.find_matches_for_student(student, db)

        db.commit()
