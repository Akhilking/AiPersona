"""Check products in database"""
from app.database import SessionLocal
from app.models import Product

db = SessionLocal()

try:
    # Count products
    total = db.query(Product).count()
    active = db.query(Product).filter(Product.is_active == True).count()
    
    print(f"📊 Database Status:")
    print(f"  Total Products: {total}")
    print(f"  Active Products: {active}")
    
    # Count by category
    for pet_type in ['dog', 'cat', 'baby', 'human']:
        count = db.query(Product).filter(
            Product.pet_type == pet_type,
            Product.is_active == True
        ).count()
        print(f"  {pet_type.capitalize()}: {count}")
    
    # Show first 5 products
    print(f"\n📦 Sample Products:")
    samples = db.query(Product).filter(Product.is_active == True).limit(5).all()
    for p in samples:
        print(f"  • {p.name[:60]}")
        print(f"    ${p.price} | {p.pet_type}/{p.product_category}")
        print(f"    Brand: {p.brand}")
        print()
    
    # Check if any products lack required fields
    print("🔍 Data Quality Check:")
    no_name = db.query(Product).filter(Product.name == None).count()
    no_price = db.query(Product).filter(Product.price == None).count()
    no_pet_type = db.query(Product).filter(Product.pet_type == None).count()
    
    print(f"  Missing name: {no_name}")
    print(f"  Missing price: {no_price}")
    print(f"  Missing pet_type: {no_pet_type}")
    
finally:
    db.close()