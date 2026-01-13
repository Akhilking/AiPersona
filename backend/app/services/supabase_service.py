"""
Supabase database service
"""

from app.database import supabase
from typing import List, Dict, Optional
from uuid import UUID

class SupabaseService:
    
    @staticmethod
    def create_tables():
        """Create tables using Supabase SQL editor"""
        # You'll need to run this SQL in Supabase dashboard
        sql = """
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            full_name VARCHAR(255),
            hashed_password VARCHAR(255) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT NOW()
        );

        -- Profiles table
        CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            name VARCHAR(100) NOT NULL,
            profile_category VARCHAR(50) NOT NULL,
            age_years FLOAT NOT NULL,
            weight_lbs FLOAT,
            allergies TEXT[],
            health_conditions TEXT[],
            preferences JSONB,
            profile_data JSONB,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Products table
        CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            brand VARCHAR(100) NOT NULL,
            description TEXT,
            price FLOAT NOT NULL,
            price_unit VARCHAR(50),
            image_url TEXT,
            rating FLOAT DEFAULT 0,
            pet_type VARCHAR(50),
            product_category VARCHAR(50),
            attributes JSONB,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT NOW()
        );

        -- Recommendations table
        CREATE TABLE IF NOT EXISTS recommendations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            product_id UUID REFERENCES products(id) ON DELETE CASCADE,
            match_score INTEGER,
            explanation TEXT,
            pros TEXT[],
            cons TEXT[],
            is_safe BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT NOW()
        );

        -- Wishlists table
        CREATE TABLE IF NOT EXISTS wishlists (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            product_id UUID REFERENCES products(id) ON DELETE CASCADE,
            profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
            notes TEXT,
            added_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(user_id, product_id)
        );

        -- Indexes
        CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_products_category ON products(pet_type, product_category);
        CREATE INDEX IF NOT EXISTS idx_recommendations_profile ON recommendations(profile_id);
        CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
        """
        print(sql)
        return sql
    
    @staticmethod
    def get_products(limit: int = 100) -> List[Dict]:
        """Get products from Supabase"""
        response = supabase.table('products').select('*').limit(limit).execute()
        return response.data
    
    @staticmethod
    def create_product(product_data: Dict) -> Dict:
        """Create product in Supabase"""
        response = supabase.table('products').insert(product_data).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def get_profiles_by_user(user_id: str) -> List[Dict]:
        """Get profiles for a user"""
        response = supabase.table('profiles').select('*').eq('user_id', user_id).execute()
        return response.data
    
    @staticmethod
    def create_profile(profile_data: Dict) -> Dict:
        """Create profile in Supabase"""
        response = supabase.table('profiles').insert(profile_data).execute()
        return response.data[0] if response.data else None