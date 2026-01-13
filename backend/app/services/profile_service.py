from uuid import UUID
from typing import List, Optional, Dict
from datetime import datetime
import uuid as uuid_lib


class ProfileService:
    def __init__(self, db):
        self.db = db  # supabase client
    
    def create_profile(self, profile_data, user_id: UUID) -> Dict:
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
        
        profile = {
            "id": str(uuid_lib.uuid4()),
            "user_id": str(user_id),
            "name": profile_data.name,
            "profile_category": profile_data.profile_category,
            "age_years": profile_data.age_years,
            "weight_lbs": profile_data.weight_lbs,
            "size_category": size_category,
            "allergies": profile_data.allergies or [],
            "health_conditions": profile_data.health_conditions or [],
            "preferences": profile_data.preferences or {},
            "profile_data": profile_data.profile_data or {},
            "recommended_product_ids": [],
            "recommendations_cache_version": 1,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        response = self.db.table('profiles').insert(profile).execute()
        return response.data[0] if response.data else None
    
    def get_profile(self, profile_id: UUID) -> Optional[Dict]:
        """Get profile by ID"""
        response = self.db.table('profiles').select('*').eq('id', str(profile_id)).execute()
        return response.data[0] if response.data else None
    
    def list_profiles(self, user_id: UUID = None, skip: int = 0, limit: int = 100) -> List[Dict]:
        """List profiles with pagination"""
        query = self.db.table('profiles').select('*')
        
        if user_id:
            query = query.eq('user_id', str(user_id))
        
        response = query.range(skip, skip + limit - 1).execute()
        return response.data
    
    def update_profile(self, profile_id: UUID, profile_update) -> Dict:
        """Update profile and invalidate cache if critical fields changed"""
        profile = self.get_profile(profile_id)
        if not profile:
            raise ValueError("Profile not found")
        
        # Build update dict
        update_data = {}
        for field, value in profile_update.dict(exclude_unset=True).items():
            if value is not None:
                update_data[field] = value
        
        # Check if critical fields are changing
        critical_fields = ['allergies', 'health_conditions', 'age_years', 'profile_category']
        should_invalidate = any(field in update_data for field in critical_fields)
        
        update_data['updated_at'] = datetime.utcnow().isoformat()
        
        # Invalidate cache if needed
        if should_invalidate:
            update_data['recommended_product_ids'] = []
            update_data['recommendations_generated_at'] = None
            update_data['recommendations_cache_version'] = profile.get('recommendations_cache_version', 1) + 1
        
        response = self.db.table('profiles').update(update_data).eq('id', str(profile_id)).execute()
        return response.data[0] if response.data else None
    
    def delete_profile(self, profile_id: UUID) -> bool:
        """Delete a profile"""
        response = self.db.table('profiles').delete().eq('id', str(profile_id)).execute()
        return len(response.data) > 0
    
    def invalidate_recommendation_cache(self, profile_id: UUID) -> None:
        """Invalidate cached recommendations when profile changes"""
        profile = self.get_profile(profile_id)
        if profile:
            update_data = {
                'recommended_product_ids': [],
                'recommendations_generated_at': None,
                'recommendations_cache_version': profile.get('recommendations_cache_version', 1) + 1
            }
            self.db.table('profiles').update(update_data).eq('id', str(profile_id)).execute()
            print(f"🗑️ Invalidated recommendation cache for {profile['name']}")