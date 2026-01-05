"""
Profile Service
Business logic for profile management
"""

from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from datetime import datetime

from app.models import Profile
from app.schemas import ProfileCreate, ProfileUpdate


class ProfileService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_profile(self, profile_data: ProfileCreate, user_id: UUID) -> Profile:
        """Create a new pet profile with calculated fields"""
        
        # Calculate size category based on weight and category
        size_category = None
        if profile_data.weight_lbs and profile_data.profile_category in ["dog", "cat"]:
            if profile_data.weight_lbs <= 20:
                size_category = "small"
            elif profile_data.weight_lbs <= 50:
                size_category = "medium"
            else:
                size_category = "large"
        
        profile = Profile(
            user_id=user_id,
            name=profile_data.name,
            profile_category=profile_data.profile_category,
            pet_type=profile_data.profile_category if profile_data.profile_category in ["dog", "cat"] else None,
            age_years=profile_data.age_years,
            weight_lbs=profile_data.weight_lbs,
            size_category=size_category,
            allergies=profile_data.allergies,
            health_conditions=profile_data.health_conditions,
            preferences=profile_data.preferences,
            profile_data=profile_data.profile_data
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
    
    def update_profile(self, profile_id: UUID, profile_update: ProfileUpdate) -> Profile:
        """Update profile and invalidate cache if critical fields changed"""
        profile = self.get_profile(profile_id)
        if not profile:
            raise ValueError("Profile not found")
        
        # Check if critical fields are changing
        critical_fields = ['allergies', 'health_conditions', 'age_years', 'profile_category']
        should_invalidate = any(
            getattr(profile_update, field, None) is not None 
            for field in critical_fields
        )
        
        # Update fields
        for field, value in profile_update.dict(exclude_unset=True).items():
            setattr(profile, field, value)
        
        profile.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(profile)
        
        # Invalidate cache if needed
        if should_invalidate:
            self.invalidate_recommendation_cache(profile_id)
        
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
        """Calculate size category from weight"""
        if weight_lbs <= 20:
            return "small"
        elif weight_lbs <= 50:
            return "medium"
        else:
            return "large"
    
    def invalidate_recommendation_cache(self, profile_id: UUID) -> None:
        """Invalidate cached recommendations when profile changes"""
        profile = self.db.query(Profile).filter(Profile.id == profile_id).first()
        if profile:
            profile.recommended_product_ids = []
            profile.recommendations_generated_at = None
            profile.recommendations_cache_version += 1
            self.db.commit()
            print(f"🗑️ Invalidated recommendation cache for {profile.name}")