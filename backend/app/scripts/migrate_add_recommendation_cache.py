"""
Migration: Add recommendation caching fields to profiles table
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.database import engine

def migrate():
    """Add recommendation cache columns to profiles table"""
    
    with engine.connect() as conn:
        try:
            # Add recommended_product_ids column (JSONB array)
            print("Adding recommended_product_ids column...")
            conn.execute(text("""
                ALTER TABLE profiles 
                ADD COLUMN IF NOT EXISTS recommended_product_ids JSONB DEFAULT '[]'::jsonb
            """))
            
            # Add recommendations_generated_at column
            print("Adding recommendations_generated_at column...")
            conn.execute(text("""
                ALTER TABLE profiles 
                ADD COLUMN IF NOT EXISTS recommendations_generated_at TIMESTAMP
            """))
            
            # Add recommendations_cache_version column
            print("Adding recommendations_cache_version column...")
            conn.execute(text("""
                ALTER TABLE profiles 
                ADD COLUMN IF NOT EXISTS recommendations_cache_version INTEGER DEFAULT 1
            """))
            
            conn.commit()
            print("✅ Migration completed successfully!")
            
        except Exception as e:
            conn.rollback()
            print(f"❌ Migration failed: {str(e)}")
            raise

if __name__ == "__main__":
    migrate()