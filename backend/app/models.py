"""
Database Models - Phase 1 (MVP)
Designed with JSONB fields for Phase 2+ extensibility
"""

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


class User(Base):
    """User accounts for authentication"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    profiles = relationship("Profile", back_populates="user", cascade="all, delete-orphan")
    
class Profile(Base):
    """
    Pet profiles for MVP (extensible to multi-niche in Phase 2)
    
    Phase 1: Hardcoded pet food attributes
    Phase 2+: Add niche_id FK, make profile_data fully dynamic
    """
    __tablename__ = "profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)  # Pet name
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="profiles")
    
    # Phase 1: Direct columns (will migrate to profile_data JSONB in Phase 2)
    pet_type = Column(String, nullable=False)  # dog, cat
    age_years = Column(Float, nullable=False)
    weight_lbs = Column(Float, nullable=True)
    size_category = Column(String, nullable=True)  # small, medium, large
    
    # JSONB for complex/flexible data (Phase 2 ready)
    allergies = Column(JSONB, default=list)  # ["chicken", "corn"]
    health_conditions = Column(JSONB, default=list)  # ["sensitive_stomach"]
    preferences = Column(JSONB, default=dict)  # {"grain_free": true, "price_range": "mid"}
    
    # Future: Full dynamic profile data
    # niche_id = Column(UUID(as_uuid=True), ForeignKey("niches.id"))
    # profile_data = Column(JSONB)  # All profile fields go here in Phase 2
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    recommendations = relationship("Recommendation", back_populates="profile", cascade="all, delete-orphan")


class Product(Base):
    """
    Products - Currently dog food (extensible to multi-niche)
    
    Phase 1: Pet food specific fields
    Phase 2+: Add niche_id, move all specific fields to attributes JSONB
    """
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Core fields (niche-agnostic)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    price_unit = Column(String, default="per bag")  # "15lb bag", "per unit"
    image_url = Column(String, nullable=True)
    rating = Column(Float, default=0.0)
    
    # Phase 1: Pet food specific
    pet_type = Column(String, nullable=False)  # dog, cat
    
    # JSONB for flexible attributes (Phase 2 ready)
    attributes = Column(JSONB, default=dict)
    """
    Phase 1 structure:
    {
        "life_stage": ["adult", "senior"],
        "size_suitability": ["small", "medium"],
        "primary_protein": "lamb",
        "ingredients": {
            "full_list": ["lamb", "rice", ...],
            "allergens": ["lamb", "rice"],
            "contains": ["chicken_meal"]  # Hidden allergens
        },
        "nutrition": {
            "protein_pct": 24,
            "fat_pct": 14,
            "fiber_pct": 5,
            "calories_per_cup": 350
        },
        "features": ["grain_free", "high_protein", "limited_ingredient"]
    }
    
    Phase 2+ (multi-niche):
    - Add niche_id FK
    - All above moves to attributes JSONB
    - Baby products: {"age_range": "0-6mo", "material": "silicone", ...}
    - Skincare: {"skin_types": ["dry"], "concerns": ["acne"], ...}
    """
    
    # Future Phase 2
    # niche_id = Column(UUID(as_uuid=True), ForeignKey("niches.id"))
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    recommendations = relationship("Recommendation", back_populates="product")


class Recommendation(Base):
    """
    Cached AI-generated recommendations
    Stores explanations, pros/cons to minimize API calls
    """
    __tablename__ = "recommendations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    
    # Filtering results
    is_safe = Column(Boolean, default=True)  # Passed allergy/safety filters
    match_score = Column(Integer, default=0)  # 0-100
    
    # AI-generated content
    explanation = Column(Text, nullable=True)  # Why this product fits/doesn't fit
    pros = Column(JSONB, default=list)  # ["Benefit 1", "Benefit 2", ...]
    cons = Column(JSONB, default=list)  # ["Consideration 1", ...]
    
    # Metadata
    generated_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)  # Cache expiration
    ai_provider = Column(String, default="openai")  # openai, anthropic
    
    # Relationships
    profile = relationship("Profile", back_populates="recommendations")
    product = relationship("Product", back_populates="recommendations")


# ============================================
# FUTURE PHASE 2+ MODELS (commented out)
# ============================================

"""
class Niche(Base):
    __tablename__ = "niches"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String, unique=True, nullable=False)  # pet-food, baby-products
    name = Column(String, nullable=False)
    description = Column(Text)
    icon = Column(String)
    is_active = Column(Boolean, default=True)
    priority = Column(Integer, default=0)
    metadata = Column(JSONB, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)


class ProfileSchema(Base):
    __tablename__ = "profile_schemas"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    niche_id = Column(UUID(as_uuid=True), ForeignKey("niches.id"))
    version = Column(String, default="1.0")
    schema = Column(JSONB, nullable=False)  # Full form definition
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class FilteringRule(Base):
    __tablename__ = "filtering_rules"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    niche_id = Column(UUID(as_uuid=True), ForeignKey("niches.id"))
    name = Column(String, nullable=False)
    rule_type = Column(String)  # exclusion, scoring, boost
    priority = Column(Integer, default=0)
    conditions = Column(JSONB, nullable=False)
    explanation_template = Column(Text)
    is_active = Column(Boolean, default=True)
"""
