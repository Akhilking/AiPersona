"""
Profile API Router - Supabase REST API version
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID

from app.database import get_db
from app.schemas import ProfileCreate, ProfileUpdate, ProfileResponse
from app.services.profile_service import ProfileService
from app.routers.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_profile(
    profile: ProfileCreate,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Create a new pet profile"""
    service = ProfileService(db)
    return service.create_profile(profile, user_id=UUID(current_user['id']))


@router.get("/{profile_id}", response_model=ProfileResponse)
async def get_profile(
    profile_id: UUID,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Get profile by ID"""
    service = ProfileService(db)
    profile = service.get_profile(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Check ownership
    if profile['user_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return profile


@router.put("/{profile_id}", response_model=ProfileResponse)
async def update_profile(
    profile_id: UUID,
    profile_update: ProfileUpdate,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Update an existing profile"""
    service = ProfileService(db)
    profile = service.get_profile(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Check ownership
    if profile['user_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return service.update_profile(profile_id, profile_update)


@router.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile(
    profile_id: UUID,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Delete a profile"""
    service = ProfileService(db)
    profile = service.get_profile(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Check ownership
    if profile['user_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    success = service.delete_profile(profile_id)
    if not success:
        raise HTTPException(status_code=404, detail="Profile not found")
    return None