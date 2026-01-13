"""
Products API Router - Supabase REST API version
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from uuid import UUID

from app.database import get_db
from app.schemas import ProductResponse
from app.services.product_service import ProductService

router = APIRouter()


@router.get("/", response_model=List[ProductResponse])
async def list_products(
    pet_type: Optional[str] = Query(None, pattern="^(dog|cat|baby|human)$"),
    product_category: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db = Depends(get_db)
):
    """
    List all products with optional filtering
    
    - **pet_type**: Filter by dog or cat
    - **product_category**: Filter by product category
    - **skip**: Number of items to skip (pagination)
    - **limit**: Max number of items to return
    """
    service = ProductService(db)
    return service.list_products(pet_type=pet_type, product_category=product_category, skip=skip, limit=limit)


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: UUID, db = Depends(get_db)):
    """Get a specific product by ID"""
    service = ProductService(db)
    product = service.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/search/", response_model=List[ProductResponse])
async def search_products(
    query: str = Query(..., min_length=2),
    pet_type: Optional[str] = Query(None, pattern="^(dog|cat)$"),
    db = Depends(get_db)
):
    """Search products by name or brand"""
    service = ProductService(db)
    return service.search_products(query=query, pet_type=pet_type)


@router.get("/{product_id}/key-features")
async def get_product_key_features(
    product_id: UUID, 
    db = Depends(get_db)
):
    """Get AI-generated key features for a product (cached or generate on-demand)"""
    from app.services.ai_service import AIService
    
    service = ProductService(db)
    product = service.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if features are already cached in attributes
    if product.get('attributes') and product['attributes'].get('ai_key_features'):
        return {
            "product_id": str(product_id),
            "key_features": product['attributes']['ai_key_features'],
            "cached": True
        }
    
    # Generate on-demand if not cached
    ai_service = AIService()
    
    # Convert dict to object-like for AI service compatibility
    class ProductObj:
        def __init__(self, data):
            for k, v in data.items():
                setattr(self, k, v)
    
    product_obj = ProductObj(product)
    key_features = await ai_service.generate_product_key_features(product_obj)
    
    # Cache for future use
    if not product.get('attributes'):
        product['attributes'] = {}
    product['attributes']['ai_key_features'] = key_features
    service.update_product(product_id, {"attributes": product['attributes']})
    
    return {
        "product_id": str(product_id),
        "key_features": key_features,
        "cached": False
    }