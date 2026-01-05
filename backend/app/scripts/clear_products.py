# """Clear all products from database"""
# import sys
# import os
# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# from app.database import SessionLocal
# from app.models import Product, Recommendation

# db = SessionLocal()

# try:
#     # Delete all recommendations first (foreign key constraint)
#     rec_count = db.query(Recommendation).delete()
    
#     # Delete all products
#     prod_count = db.query(Product).delete()
    
#     db.commit()
#     print(f"✅ Deleted {rec_count} recommendations")
#     print(f"✅ Deleted {prod_count} products")
#     print("\n🎉 Database cleared! Now run import script again.")
    
# except Exception as e:
#     db.rollback()
#     print(f"❌ Error: {e}")
# finally:
#     db.close()

# Clear all imported products
from app.database import SessionLocal
from app.models import Product, Recommendation

db = SessionLocal()

# Delete products from fake APIs
deleted = db.query(Product).filter(
    Product.attributes['external_source'].astext == 'fake_api'
).delete(synchronize_session=False)

db.commit()
print(f"✅ Deleted {deleted} imported fake products")
db.close()