"""
Product Service
Business logic for product management
"""

from sqlalchemy.orm import Session
from sqlalchemy import or_
from uuid import UUID
from typing import List, Optional

from app.models import Product


class ProductService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_product(self, product_id: UUID) -> Optional[Product]:
        """Get product by ID"""
        return self.db.query(Product).filter(
            Product.id == product_id,
            Product.is_active == True
        ).first()
    
    def list_products(
        self, 
        pet_type: Optional[str] = None, 
        skip: int = 0, 
        limit: int = 50
    ) -> List[Product]:
        """List products with optional filtering"""
        query = self.db.query(Product).filter(Product.is_active == True)
        
        if pet_type:
            query = query.filter(Product.pet_type == pet_type)
        
        return query.offset(skip).limit(limit).all()
    
    def search_products(
        self, 
        query: str, 
        pet_type: Optional[str] = None
    ) -> List[Product]:
        """Search products by name or brand"""
        search = f"%{query}%"
        db_query = self.db.query(Product).filter(
            Product.is_active == True,
            or_(
                Product.name.ilike(search),
                Product.brand.ilike(search)
            )
        )
        
        if pet_type:
            db_query = db_query.filter(Product.pet_type == pet_type)
        
        return db_query.limit(20).all()
    
    def get_products_by_ids(self, product_ids: List[UUID]) -> List[Product]:
        """Get multiple products by their IDs"""
        return self.db.query(Product).filter(
            Product.id.in_(product_ids),
            Product.is_active == True
        ).all()
