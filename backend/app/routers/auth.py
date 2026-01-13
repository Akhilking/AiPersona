"""
Authentication API Router - Supabase REST API version
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from uuid import UUID

from app.database import get_db
from app.schemas import UserRegister, UserLogin, TokenResponse, UserResponse, ProfileResponse
from app.services.auth_service import AuthService
from app.services.profile_service import ProfileService

router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db = Depends(get_db)):
    """Register a new user"""
    service = AuthService(db)
    
    try:
        user = service.register_user(user_data)
        
        # Create JWT token
        access_token = service.create_access_token(
            data={"sub": user['id'], "email": user['email']}
        )
        
        return TokenResponse(
            access_token=access_token,
            user=UserResponse(**user)
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db = Depends(get_db)):
    """Login user"""
    service = AuthService(db)
    
    user = service.authenticate_user(credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create JWT token
    access_token = service.create_access_token(
        data={"sub": user['id'], "email": user['email']}
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(**user)
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db = Depends(get_db)
):
    """Get current authenticated user from JWT token"""
    token = credentials.credentials
    service = AuthService(db)
    
    payload = service.decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    user = service.get_user_by_id(UUID(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(**current_user)


@router.get("/me/profiles", response_model=List[ProfileResponse])
async def get_user_profiles(
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Get all profiles for current user"""
    service = ProfileService(db)
    profiles = service.list_profiles(user_id=UUID(current_user['id']))
    return profiles