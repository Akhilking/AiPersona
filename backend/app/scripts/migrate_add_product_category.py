"""
Migration: Add product_category column to products table
Run with: python -m app.scripts.migrate_add_product_category
"""

from app.database import SessionLocal, engine
from sqlalchemy import text


def migrate():
    """Add product_category column to products table"""
    db = SessionLocal()
    
    try:
        # Check if column already exists
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='products' AND column_name='product_category'
        """))
        
        if result.fetchone():
            print("Column 'product_category' already exists")
            return
        
        # Add the column
        db.execute(text("""
            ALTER TABLE products 
            ADD COLUMN product_category VARCHAR
        """))
        db.commit()
        print("Successfully added 'product_category' column to products table")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    migrate()