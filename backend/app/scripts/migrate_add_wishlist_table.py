"""
Migration: Create wishlists table
Run with: python -m app.scripts.migrate_add_wishlist_table
"""

from app.database import SessionLocal, engine
from sqlalchemy import text


def migrate():
    """Create wishlists table"""
    db = SessionLocal()
    
    try:
        # Check if table already exists
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema='public' AND table_name='wishlists'
        """))
        
        if result.fetchone():
            print("✅ Table 'wishlists' already exists")
            return
        
        # Create the wishlists table
        db.execute(text("""
            CREATE TABLE wishlists (
                id UUID PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                notes TEXT,
                UNIQUE(user_id, product_id)
            )
        """))
        
        # Create indexes for better performance
        db.execute(text("""
            CREATE INDEX idx_wishlists_user_id ON wishlists(user_id)
        """))
        
        db.execute(text("""
            CREATE INDEX idx_wishlists_product_id ON wishlists(product_id)
        """))
        
        db.commit()
        print("✅ Successfully created 'wishlists' table with indexes")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    migrate()