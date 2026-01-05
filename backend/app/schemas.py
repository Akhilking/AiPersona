"""
Pydantic Schemas for Request/Response validation
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Optional, Any
from datetime import datetime
from uuid import UUID


# ============================================
# PROFILE SCHEMAS
# ============================================

class ProfileCreate(BaseModel):
    """Request body for creating a profile"""
    name: str = Field(..., min_length=1, max_length=100)
    profile_category: str = Field(..., pattern="^(dog|cat|baby|human)$")
    age_years: float = Field(..., ge=0, le=120)
    weight_lbs: Optional[float] = Field(None, ge=0, le=500)
    allergies: List[str] = Field(default_factory=list)
    health_conditions: List[str] = Field(default_factory=list)
    preferences: Dict[str, Any] = Field(default_factory=dict)
    profile_data: Dict[str, Any] = Field(default_factory=dict)
    
    @field_validator('allergies', 'health_conditions')
    @classmethod
    def lowercase_lists(cls, v):
        return [item.lower().strip() for item in v if item.strip()]


class ProfileUpdate(BaseModel):
    """Update existing profile"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    age_years: Optional[float] = Field(None, ge=0, le=120)  # FIXED: Changed from 30 to 120
    weight_lbs: Optional[float] = Field(None, ge=0, le=500)  # FIXED: Changed from 300 to 500
    allergies: Optional[List[str]] = None
    health_conditions: Optional[List[str]] = None
    preferences: Optional[Dict[str, Any]] = None
    
    @field_validator('allergies', 'health_conditions')
    @classmethod
    def lowercase_lists(cls, v):
        # ADDED: Same validation as ProfileCreate
        if v is None:
            return v
        return [item.lower().strip() for item in v if item.strip()]


class ProfileResponse(BaseModel):
    """Response format for profile data"""
    id: UUID
    name: str
    profile_category: str  
    pet_type: Optional[str] = None 
    age_years: float
    weight_lbs: Optional[float]
    size_category: Optional[str]
    allergies: List[str]
    health_conditions: List[str]
    preferences: Dict[str, Any]
    profile_data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============================================
# PRODUCT SCHEMAS
# ============================================

class ProductResponse(BaseModel):
    """Response format for product data"""
    id: UUID
    name: str
    brand: str
    description: Optional[str]
    price: float
    price_unit: str
    image_url: Optional[str]
    rating: float
    pet_type: str
    product_category: Optional[str] = None
    attributes: Dict[str, Any]
    is_active: bool
    
    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    """Paginated product list"""
    products: List[ProductResponse]
    total: int
    page: int
    page_size: int


# ============================================
# RECOMMENDATION SCHEMAS
# ============================================

class RecommendationRequest(BaseModel):
    """Request for personalized recommendations"""
    profile_id: UUID
    limit: Optional[int] = Field(default=10, ge=1, le=50, description="Max number of products")
    force_refresh: Optional[bool] = Field(default=False, description="Bypass cache")


class RecommendationItem(BaseModel):
    """Single product recommendation with AI analysis"""
    product: ProductResponse
    is_safe: bool
    match_score: int
    explanation: Optional[str]
    pros: List[str]
    cons: List[str]
    generated_at: datetime
    
    class Config:
        from_attributes = True


class RecommendationResponse(BaseModel):
    """List of recommendations for a profile"""
    profile: ProfileResponse
    recommendations: List[RecommendationItem]
    total_safe_products: int
    total_filtered_out: int
    generated_at: datetime


# ============================================
# COMPARISON SCHEMAS
# ============================================

class ComparisonRequest(BaseModel):
    """Request to compare multiple products"""
    profile_id: UUID
    product_ids: List[UUID] = Field(..., min_length=2, max_length=4, description="2-4 products to compare")


class ComparisonResponse(BaseModel):
    """AI-powered product comparison"""
    profile: ProfileResponse
    products: List[ProductResponse]
    recommendations: List[RecommendationItem]
    comparison_summary: str  # AI-generated summary
    best_choice: Optional[UUID]  # Product ID of best match
    generated_at: datetime

# ============================================
# AUTH SCHEMAS
# ============================================

class UserRegister(BaseModel):
    """User registration request"""
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=6, max_length=100)
    full_name: Optional[str] = Field(None, max_length=255)


class UserLogin(BaseModel):
    """User login request"""
    email: str
    password: str


class Token(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"

TokenResponse = Token  # Alias for clarity
class UserResponse(BaseModel):
    """User profile response"""
    id: UUID
    email: str
    full_name: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class TokenData(BaseModel):
    """JWT token payload"""
    user_id: Optional[str] = None