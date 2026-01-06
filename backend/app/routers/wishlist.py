"""
Wishlist API Router
Handles user wishlists
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models import User, Wishlist, Product
from app.routers.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()


class WishlistItemCreate(BaseModel):
    product_id: UUID
    profile_id: UUID | None = None
    notes: str | None = None


class WishlistItemResponse(BaseModel):
    id: UUID
    product_id: UUID
    profile_id: UUID | None
    added_at: str
    notes: str | None
    product: dict  # ProductResponse

    class Config:
        from_attributes = True


def serialize_product(product):
    """Convert SQLAlchemy Product to dict"""
    if not product:
        return None
    return {
        "id": str(product.id),
        "name": product.name,
        "brand": product.brand,
        "description": product.description,
        "price": product.price,
        "price_unit": product.price_unit,
        "image_url": product.image_url,
        "rating": product.rating,
        "pet_type": product.pet_type,
        "product_category": product.product_category,
        "attributes": product.attributes,
        "is_active": product.is_active,
    }


@router.get("/", response_model=List[WishlistItemResponse])
async def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's wishlist"""
    items = db.query(Wishlist).filter(Wishlist.user_id == current_user.id).all()
    
    # Populate product data
    result = []
    for item in items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        result.append({
            "id": item.id,
            "product_id": item.product_id,
            "profile_id": item.profile_id,
            "added_at": item.added_at.isoformat(),
            "notes": item.notes,
            "product": serialize_product(product)
        })
    
    return result


@router.post("/", response_model=WishlistItemResponse)
async def add_to_wishlist(
    item: WishlistItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add product to wishlist"""
    # Check if already in wishlist
    existing = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.product_id == item.product_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Product already in wishlist")
    
    # Verify product exists
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    wishlist_item = Wishlist(
        user_id=current_user.id,
        product_id=item.product_id,
        profile_id=item.profile_id,
        notes=item.notes
    )
    
    db.add(wishlist_item)
    db.commit()
    db.refresh(wishlist_item)
    
    return {
        "id": wishlist_item.id,
        "product_id": wishlist_item.product_id,
        "profile_id": wishlist_item.profile_id,
        "added_at": wishlist_item.added_at.isoformat(),
        "notes": wishlist_item.notes,
        "product": serialize_product(product)
    }


@router.delete("/{wishlist_id}")
async def remove_from_wishlist(
    wishlist_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove product from wishlist"""
    item = db.query(Wishlist).filter(
        Wishlist.id == wishlist_id,
        Wishlist.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    
    db.delete(item)
    db.commit()
    
    return {"message": "Product removed from wishlist"}


@router.delete("/product/{product_id}")
async def remove_product_from_wishlist(
    product_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove product from wishlist by product ID"""
    item = db.query(Wishlist).filter(
        Wishlist.product_id == product_id,
        Wishlist.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Product not in wishlist")
    
    db.delete(item)
    db.commit()
    
    return {"message": "Product removed from wishlist"}