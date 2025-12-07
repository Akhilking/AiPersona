"""
Database initialization script
Creates all tables and sets up the schema
"""

from app.database import engine, Base
from app.models import Profile, Product, Recommendation

def init_db():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")
    print("\nTables created:")
    print("  - profiles")
    print("  - products")
    print("  - recommendations")
    print("\nReady for data seeding. Run: python -m app.scripts.seed_data")


if __name__ == "__main__":
    init_db()
