"""
Product Service - Supabase REST API version
Business logic for product management
"""

from typing import List, Optional, Dict
from uuid import UUID


class ProductService:
    def __init__(self, db):
        self.db = db  # supabase client
    
    def get_product(self, product_id: UUID) -> Optional[Dict]:
        """Get product by ID"""
        response = self.db.table('products').select('*').eq('id', str(product_id)).eq('is_active', True).execute()
        return response.data[0] if response.data else None
    
    def list_products(
        self, 
        pet_type: Optional[str] = None,
        product_category: Optional[str] = None,
        skip: int = 0, 
        limit: int = 50
    ) -> List[Dict]:
        """List products with optional filtering"""
        query = self.db.table('products').select('*').eq('is_active', True)
        
        if pet_type:
            query = query.eq('pet_type', pet_type)
        
        if product_category:
            query = query.eq('product_category', product_category)
        
        response = query.range(skip, skip + limit - 1).execute()
        return response.data
    
    def search_products(
        self, 
        query: str, 
        pet_type: Optional[str] = None
    ) -> List[Dict]:
        """Search products by name or brand"""
        response = self.db.table('products').select('*').eq('is_active', True).or_(
            f'name.ilike.%{query}%,brand.ilike.%{query}%'
        )
        
        if pet_type:
            response = response.eq('pet_type', pet_type)
        
        result = response.limit(20).execute()
        return result.data
    
    def get_products_by_ids(self, product_ids: List[UUID]) -> List[Dict]:
        """Get multiple products by their IDs"""
        str_ids = [str(pid) for pid in product_ids]
        response = self.db.table('products').select('*').in_('id', str_ids).eq('is_active', True).execute()
        return response.data
    
    def update_product(self, product_id: UUID, data: Dict) -> Optional[Dict]:
        """Update product"""
        response = self.db.table('products').update(data).eq('id', str(product_id)).execute()
        return response.data[0] if response.data else None