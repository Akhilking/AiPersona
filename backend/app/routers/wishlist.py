"""
Wishlist API Router - Supabase REST API version
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID

from app.database import get_db
from app.routers.auth import get_current_user
from app.schemas import WishlistResponse, WishlistCreate

router = APIRouter()


@router.get("/", response_model=List[WishlistResponse])
async def get_wishlist(
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Get user's wishlist with product details"""
    try:
        # Fetch wishlist items with product data using Supabase
        response = db.table('wishlists')\
            .select('*, product:products(*)')\
            .eq('user_id', str(current_user['id']))\
            .execute()
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch wishlist: {str(e)}")


@router.post("/", status_code=status.HTTP_201_CREATED)
async def add_to_wishlist(
    wishlist_item: WishlistCreate,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Add a product to wishlist"""
    try:
        # Check if already exists
        existing = db.table('wishlists')\
            .select('id')\
            .eq('user_id', str(current_user['id']))\
            .eq('product_id', str(wishlist_item.product_id))\
            .execute()
        
        if existing.data:
            raise HTTPException(status_code=400, detail="Product already in wishlist")
        
        # Insert new wishlist item
        data = {
            'user_id': str(current_user['id']),
            'product_id': str(wishlist_item.product_id),
            'profile_id': str(wishlist_item.profile_id) if wishlist_item.profile_id else None,
            'notes': wishlist_item.notes
        }
        
        result = db.table('wishlists').insert(data).execute()
        return result.data[0]
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add to wishlist: {str(e)}")


@router.delete("/{wishlist_id}")
async def remove_from_wishlist(
    wishlist_id: UUID,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Remove an item from wishlist by wishlist ID"""
    try:
        # Verify ownership before deleting
        existing = db.table('wishlists')\
            .select('id')\
            .eq('id', str(wishlist_id))\
            .eq('user_id', str(current_user['id']))\
            .execute()
        
        if not existing.data:
            raise HTTPException(status_code=404, detail="Wishlist item not found")
        
        # Delete the item
        db.table('wishlists')\
            .delete()\
            .eq('id', str(wishlist_id))\
            .execute()
        
        return {"message": "Item removed from wishlist"}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to remove from wishlist: {str(e)}")


@router.delete("/product/{product_id}")
async def remove_by_product_id(
    product_id: UUID,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """Remove an item from wishlist by product ID"""
    try:
        # Delete by product_id and user_id
        result = db.table('wishlists')\
            .delete()\
            .eq('user_id', str(current_user['id']))\
            .eq('product_id', str(product_id))\
            .execute()
        
        # Supabase doesn't return deleted count, so we can't verify if something was deleted
        # Just return success
        return {"message": "Item removed from wishlist"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to remove from wishlist: {str(e)}")