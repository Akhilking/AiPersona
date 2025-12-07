"""
Profile Service
Business logic for profile management
"""

from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional

from app.models import Profile
from app.schemas import ProfileCreate, ProfileUpdate


class ProfileService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_profile(self, profile_data: ProfileCreate) -> Profile:
        """Create a new pet profile with calculated fields"""
        
        # Calculate size category based on weight (for dogs)
        size_category = None
        if profile_data.pet_type == "dog" and profile_data.weight_lbs:
            size_category = self._calculate_size_category(profile_data.weight_lbs)
        
        profile = Profile(
            name=profile_data.name,
            pet_type=profile_data.pet_type,
            age_years=profile_data.age_years,
            weight_lbs=profile_data.weight_lbs,
            size_category=size_category,
            allergies=profile_data.allergies,
            health_conditions=profile_data.health_conditions,
            preferences=profile_data.preferences
        )
        
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile
    
    def get_profile(self, profile_id: UUID) -> Optional[Profile]:
        """Get profile by ID"""
        return self.db.query(Profile).filter(Profile.id == profile_id).first()
    
    def list_profiles(self, skip: int = 0, limit: int = 100) -> List[Profile]:
        """List all profiles with pagination"""
        return self.db.query(Profile).offset(skip).limit(limit).all()
    
    def update_profile(self, profile_id: UUID, profile_update: ProfileUpdate) -> Optional[Profile]:
        """Update an existing profile"""
        profile = self.get_profile(profile_id)
        if not profile:
            return None
        
        update_data = profile_update.model_dump(exclude_unset=True)
        
        # Recalculate size category if weight changed
        if "weight_lbs" in update_data and profile.pet_type == "dog":
            update_data["size_category"] = self._calculate_size_category(update_data["weight_lbs"])
        
        for field, value in update_data.items():
            setattr(profile, field, value)
        
        self.db.commit()
        self.db.refresh(profile)
        return profile
    
    def delete_profile(self, profile_id: UUID) -> bool:
        """Delete a profile"""
        profile = self.get_profile(profile_id)
        if not profile:
            return False
        
        self.db.delete(profile)
        self.db.commit()
        return True
    
    @staticmethod
    def _calculate_size_category(weight_lbs: float) -> str:
        """Calculate dog size category from weight"""
        if weight_lbs <= 20:
            return "small"
        elif weight_lbs <= 50:
            return "medium"
        else:
            return "large"
