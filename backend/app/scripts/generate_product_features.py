"""
Generate and cache AI features for all products
Run with: python -m app.scripts.generate_product_features
"""

from app.database import SessionLocal
from app.models import Product
from app.services.ai_service import AIService
import asyncio


async def generate_all_features():
    """Generate key features for all products and store in attributes"""
    db = SessionLocal()
    ai_service = AIService()
    
    try:
        # Get all active products
        products = db.query(Product).filter(Product.is_active == True).all()
        print(f"🔄 Generating features for {len(products)} products...")
        
        updated_count = 0
        skipped_count = 0
        
        for product in products:
            # Skip if features already exist
            if product.attributes and product.attributes.get('ai_key_features'):
                skipped_count += 1
                continue
            
            try:
                # Convert Product object to dictionary for AI service
                product_dict = {
                    'name': product.name,
                    'brand': product.brand,
                    'description': product.description,
                    'pet_type': product.pet_type,
                    'attributes': product.attributes or {}
                }
                
                # Generate features using AI
                features = await ai_service.generate_product_key_features(product_dict)
                
                # Store in attributes
                if not product.attributes:
                    product.attributes = {}
                
                updated_attrs = dict(product.attributes)
                updated_attrs['ai_key_features'] = features
                product.attributes = updated_attrs

                # Mark as modified (important for JSONB fields)
                from sqlalchemy.orm.attributes import flag_modified
                flag_modified(product, 'attributes')

                db.commit()
                updated_count += 1
                
                if updated_count % 10 == 0:
                    print(f"✅ Progress: {updated_count}/{len(products)}")
                
            except Exception as e:
                print(f"❌ Failed for {product.name}: {e}")
                db.rollback()
                continue
        
        print(f"\n🎉 Successfully generated features for {updated_count} products")
        print(f"⏭️  Skipped {skipped_count} products (already had features)")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    asyncio.run(generate_all_features())