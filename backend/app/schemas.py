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
    """Request body for creating a pet profile"""
    name: str = Field(..., min_length=1, max_length=100, description="Pet's name")
    pet_type: str = Field(..., pattern="^(dog|cat)$", description="Type of pet")
    age_years: float = Field(..., ge=0, le=30, description="Age in years")
    weight_lbs: Optional[float] = Field(None, ge=0, le=300, description="Weight in pounds")
    allergies: List[str] = Field(default_factory=list, description="List of known allergens")
    health_conditions: List[str] = Field(default_factory=list, description="Health conditions")
    preferences: Dict[str, Any] = Field(default_factory=dict, description="Additional preferences")
    
    @field_validator('allergies', 'health_conditions')
    @classmethod
    def lowercase_lists(cls, v):
        """Normalize to lowercase for consistent matching"""
        return [item.lower().strip() for item in v if item.strip()]


class ProfileUpdate(BaseModel):
    """Update existing profile"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    age_years: Optional[float] = Field(None, ge=0, le=30)
    weight_lbs: Optional[float] = Field(None, ge=0, le=300)
    allergies: Optional[List[str]] = None
    health_conditions: Optional[List[str]] = None
    preferences: Optional[Dict[str, Any]] = None


class ProfileResponse(BaseModel):
    """Response format for profile data"""
    id: UUID
    name: str
    pet_type: str
    age_years: float
    weight_lbs: Optional[float]
    size_category: Optional[str]
    allergies: List[str]
    health_conditions: List[str]
    preferences: Dict[str, Any]
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
    product_ids: List[UUID] = Field(..., min_length=2, max_length=3, description="2-3 products to compare")


class ComparisonResponse(BaseModel):
    """AI-powered product comparison"""
    profile: ProfileResponse
    products: List[ProductResponse]
    recommendations: List[RecommendationItem]
    comparison_summary: str  # AI-generated summary
    best_choice: Optional[UUID]  # Product ID of best match
    generated_at: datetime


# ============================================
# ERROR SCHEMAS
# ============================================

class ErrorResponse(BaseModel):
    """Standard error response"""
    error: str
    detail: Optional[str] = None
    status_code: int
