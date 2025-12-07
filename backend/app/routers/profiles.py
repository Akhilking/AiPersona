"""
Profile API Router
Handles pet profile CRUD operations
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models import Profile
from app.schemas import ProfileCreate, ProfileUpdate, ProfileResponse
from app.services.profile_service import ProfileService

router = APIRouter()


@router.post("/", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_profile(profile: ProfileCreate, db: Session = Depends(get_db)):
    """Create a new pet profile"""
    service = ProfileService(db)
    return service.create_profile(profile)


@router.get("/{profile_id}", response_model=ProfileResponse)
async def get_profile(profile_id: UUID, db: Session = Depends(get_db)):
    """Get profile by ID"""
    service = ProfileService(db)
    profile = service.get_profile(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.get("/", response_model=List[ProfileResponse])
async def list_profiles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all profiles"""
    service = ProfileService(db)
    return service.list_profiles(skip=skip, limit=limit)


@router.put("/{profile_id}", response_model=ProfileResponse)
async def update_profile(
    profile_id: UUID, 
    profile_update: ProfileUpdate, 
    db: Session = Depends(get_db)
):
    """Update an existing profile"""
    service = ProfileService(db)
    profile = service.update_profile(profile_id, profile_update)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile(profile_id: UUID, db: Session = Depends(get_db)):
    """Delete a profile"""
    service = ProfileService(db)
    success = service.delete_profile(profile_id)
    if not success:
        raise HTTPException(status_code=404, detail="Profile not found")
    return None
