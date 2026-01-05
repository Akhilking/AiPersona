"""
Import products from external fake APIs for testing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
import requests
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Product
import uuid

def fetch_fake_store_products():
    """Fetch ALL products from Fake Store API"""
    try:
        print("  Attempting Fake Store API...")
        response = requests.get('https://fakestoreapi.com/products', timeout=10)
        if response.status_code == 200:
            products = response.json()
            print(f"  ✅ Got {len(products)} products from Fake Store API")
            return products
    except Exception as e:
        print(f"  ⚠️  Fake Store API failed: {str(e)}")
    return []

def fetch_platzi_products():
    """Fetch products from Platzi Fake Store API"""
    try:
        print("  Attempting Platzi Fake Store API...")
        response = requests.get('https://api.escuelajs.co/api/v1/products?limit=100', timeout=10)
        if response.status_code == 200:
            products = response.json()
            print(f"  ✅ Got {len(products)} products from Platzi API")
            return products
    except Exception as e:
        print(f"  ⚠️  Platzi API failed: {str(e)}")
    return []

def fetch_makeup_products():
    """Fetch beauty products from Makeup API"""
    try:
        print("  Attempting Makeup API...")
        response = requests.get('http://makeup-api.herokuapp.com/api/v1/products.json', timeout=15)
        if response.status_code == 200:
            products = response.json()
            # Limit to first 100 to avoid overwhelming database
            products = products[:100]
            print(f"  ✅ Got {len(products)} products from Makeup API")
            return products
    except Exception as e:
        print(f"  ⚠️  Makeup API failed: {str(e)}")
    return []

def fetch_dummyjson_products():
    """Fetch products from DummyJSON"""
    try:
        print("  Attempting DummyJSON...")
        response = requests.get('https://dummyjson.com/products?limit=100', timeout=10)
        if response.status_code == 200:
            products = response.json()['products']
            print(f"  ✅ Got {len(products)} products from DummyJSON")
            return products
    except Exception as e:
        print(f"  ⚠️  DummyJSON failed: {str(e)}")
    return []

def normalize_product_data(product, source):
    """Normalize product data from different API structures"""
    if source == 'makeup':
        return {
            'title': product.get('name', 'Unknown'),
            'description': product.get('description', ''),
            'price': float(product.get('price', 0)) if product.get('price') else 15.99,
            'image': product.get('image_link', ''),
            'category': product.get('product_type', 'beauty'),
            'brand': product.get('brand', 'Premium'),
            'rating': float(product.get('rating', 4.5)) if product.get('rating') else 4.5
        }
    elif source == 'platzi':
        return {
            'title': product.get('title', 'Unknown'),
            'description': product.get('description', ''),
            'price': float(product.get('price', 0)),
            'image': product.get('images', [''])[0] if product.get('images') else '',
            'category': product.get('category', {}).get('name', 'general') if isinstance(product.get('category'), dict) else 'general',
            'brand': 'Premium',
            'rating': 4.5
        }
    else:  # fake-store, dummyjson
        rating = product.get('rating', {})
        if isinstance(rating, dict):
            rating_value = float(rating.get('rate', 4.5))
        else:
            rating_value = float(rating) if rating else 4.5
            
        return {
            'title': product.get('title') or product.get('name', 'Unknown'),
            'description': product.get('description', ''),
            'price': float(product.get('price', 0)),
            'image': product.get('image') or product.get('thumbnail', ''),
            'category': product.get('category', 'general'),
            'brand': product.get('brand', 'Premium'),
            'rating': rating_value
        }

def create_product_attributes(profile_category: str, product_category: str, base_title: str) -> dict:
    """Create realistic product attributes based on category"""
    attributes = {
        'external_source': 'fake_api',
        'base_product': base_title
    }
    
    # DOG/CAT ATTRIBUTES
    if profile_category in ['dog', 'cat']:
        attributes.update({
            'life_stage': ['adult', 'all_life_stages'],
            'size_suitability': ['all_sizes'],
        })
        
        if product_category == 'food':
            attributes.update({
                'primary_protein': 'chicken',
                'grain_free': False,
                'ingredients': {
                    'full_list': ['chicken', 'rice', 'vegetables'],
                    'allergens': []
                },
                'nutrition': {
                    'protein_pct': 24,
                    'fat_pct': 14
                }
            })
        elif product_category == 'toys':
            attributes.update({
                'material': 'durable rubber/fabric',
                'features': ['interactive', 'safe materials']
            })
    
    # BABY ATTRIBUTES
    elif profile_category == 'baby':
        attributes.update({
            'age_range': '0-12 months',
            'hypoallergenic': True,
        })
        
        if product_category == 'care':
            attributes.update({
                'features': ['tear-free', 'gentle', 'pediatrician tested']
            })
    
    # HUMAN ATTRIBUTES
    elif profile_category == 'human':
        if product_category == 'skincare':
            attributes.update({
                'key_ingredients': ['Vitamin C', 'Hyaluronic Acid'],
                'skin_type': ['all'],
                'dermatologist_tested': True
            })
        elif product_category == 'supplements':
            attributes.update({
                'dosage': '1 capsule daily',
                'key_nutrients': ['Multivitamin', 'Minerals']
            })
        elif product_category == 'shoes':
            attributes.update({
                'material': 'synthetic/leather',
                'sizes_available': ['6-12']
            })
    
    return attributes

async def import_products():
    """Import products from multiple external APIs with variations"""
    db: Session = SessionLocal()
    
    try:
        print("🌐 Fetching products from multiple external sources...\n")
        
        all_external_products = []
        
        # Try all APIs
        apis = [
            ('fake-store', fetch_fake_store_products()),
            ('platzi', fetch_platzi_products()),
            ('makeup', fetch_makeup_products()),
            ('dummyjson', fetch_dummyjson_products()),
        ]
        
        for source, products in apis:
            if products:
                for product in products:
                    product['_source'] = source
                all_external_products.extend(products)
        
        if len(all_external_products) == 0:
            print("❌ No products fetched from any API. Check your internet connection.")
            return
        
        print(f"\n📦 Processing {len(all_external_products)} external products...")
        print("🎯 Creating variations across dog, cat, baby, human categories\n")
        
        imported_count = 0
        skipped_count = 0
        category_stats = {'dog': 0, 'cat': 0, 'baby': 0, 'human': 0}
        
        # Variation templates for different categories
        variation_templates = {
            'dog': [
                ('food', 'Premium Dog Food'),
                ('toys', 'Dog Play Toy'),
                ('grooming', 'Dog Grooming Care'),
            ],
            'cat': [
                ('food', 'Premium Cat Food'),
                ('toys', 'Cat Play Toy'),
                ('litter', 'Cat Care Product'),
            ],
            'baby': [
                ('care', 'Baby Care Product'),
                ('formula', 'Baby Nutrition'),
                ('toys', 'Baby Development Toy'),
            ],
            'human': [
                ('skincare', 'Skincare Solution'),
                ('supplements', 'Health Supplement'),
                ('shoes', 'Premium Footwear'),
                ('personal_care', 'Personal Care'),
            ]
        }
        
        # Process each product
        for ext_product in all_external_products:
            try:
                source = ext_product.get('_source', 'unknown')
                normalized = normalize_product_data(ext_product, source)
                
                # Create 1 variation per category (4 total per product)
                for prof_cat, variations in variation_templates.items():
                    # Pick one variation randomly based on product
                    prod_cat, name_prefix = variations[hash(normalized['title']) % len(variations)]
                    
                    # Create unique product name
                    base_title = normalized['title'][:50]
                    variant_title = f"{name_prefix} - {base_title}"
                    
                    # Check if product already exists
                    existing = db.query(Product).filter(Product.name == variant_title).first()
                    if existing:
                        skipped_count += 1
                        continue
                    
                    # Adjust price based on category
                    variant_price = normalized['price']
                    if prof_cat in ['dog', 'cat']:
                        variant_price = max(variant_price * 1.2, 9.99)
                    elif prof_cat == 'baby':
                        variant_price = max(variant_price * 1.5, 12.99)
                    else:
                        variant_price = max(variant_price, 5.99)
                    
                    # Create attributes
                    attributes = create_product_attributes(prof_cat, prod_cat, base_title)
                    attributes['original_category'] = normalized['category']
                    attributes['api_source'] = source
                    
                    # Create description
                    variant_desc = normalized['description'][:200] if normalized['description'] else f'Premium {prod_cat} product for {prof_cat}s'
                    
                    # Create new product
                    product = Product(
                        id=uuid.uuid4(),
                        name=variant_title[:200],
                        brand=normalized['brand'][:50],
                        description=variant_desc[:500],
                        price=round(variant_price, 2),
                        price_unit='each',
                        image_url=normalized['image'][:500] if normalized['image'] else '',
                        rating=normalized['rating'],
                        pet_type=prof_cat,
                        product_category=prod_cat,
                        attributes=attributes,
                        is_active=True
                    )
                    
                    db.add(product)
                    imported_count += 1
                    category_stats[prof_cat] += 1
                    
                    if imported_count % 50 == 0:
                        print(f"  ✅ Imported {imported_count} products...")
                        db.commit()  # Batch commit
                
            except Exception as e:
                print(f"  ⚠️  Error processing product: {str(e)}")
                continue
        
        db.commit()
        
        print(f"\n🎉 Successfully imported {imported_count} new products!")
        print(f"⏭️  Skipped {skipped_count} duplicates\n")
        
        print("📊 Products by category:")
        for cat, count in category_stats.items():
            print(f"  • {cat.capitalize()}: {count} products")
        
        print(f"\n💡 From {len(all_external_products)} base products, created {imported_count} variations")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(import_products())