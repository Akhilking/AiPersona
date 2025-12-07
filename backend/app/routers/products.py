"""
Products API Router
Handles product listing and retrieval
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.database import get_db
from app.models import Product
from app.schemas import ProductResponse
from app.services.product_service import ProductService

router = APIRouter()


@router.get("/", response_model=List[ProductResponse])
async def list_products(
    pet_type: Optional[str] = Query(None, pattern="^(dog|cat)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    List all products with optional filtering
    
    - **pet_type**: Filter by dog or cat
    - **skip**: Number of items to skip (pagination)
    - **limit**: Max number of items to return
    """
    service = ProductService(db)
    return service.list_products(pet_type=pet_type, skip=skip, limit=limit)


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: UUID, db: Session = Depends(get_db)):
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
    db: Session = Depends(get_db)
):
    """Search products by name or brand"""
    service = ProductService(db)
    return service.search_products(query=query, pet_type=pet_type)
