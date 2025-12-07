"""
Seed Database with Sample Dog Food Products
Run with: python -m app.scripts.seed_data
"""

from app.database import SessionLocal
from app.models import Product
import uuid


def seed_products():
    """Add 15 realistic dog food products"""
    db = SessionLocal()
    
    products = [
        {
            "name": "Life Protection Formula Small Breed Adult",
            "brand": "Blue Buffalo",
            "description": "Protein-rich formula with real lamb, wholesome grains, and LifeSource Bits.",
            "price": 47.98,
            "price_unit": "15 lb bag",
            "image_url": "https://example.com/blue-buffalo-small.jpg",
            "rating": 4.6,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["small"],
                "primary_protein": "lamb",
                "ingredients": {
                    "full_list": ["deboned lamb", "lamb meal", "brown rice", "barley", "oatmeal", "peas", "tomato pomace", "flaxseed", "fish oil", "sweet potato"],
                    "allergens": ["lamb", "rice", "barley", "oats", "fish"],
                    "contains": []
                },
                "nutrition": {
                    "protein_pct": 24,
                    "fat_pct": 14,
                    "fiber_pct": 5,
                    "calories_per_cup": 377
                },
                "features": ["natural", "no_chicken_by_product_meals", "antioxidants"]
            }
        },
        {
            "name": "Pro Plan Sensitive Skin & Stomach",
            "brand": "Purina",
            "description": "High-quality salmon as the first ingredient, gentle on sensitive systems.",
            "price": 55.99,
            "price_unit": "30 lb bag",
            "image_url": "https://example.com/purina-sensitive.jpg",
            "rating": 4.7,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["all_sizes"],
                "primary_protein": "salmon",
                "ingredients": {
                    "full_list": ["salmon", "rice", "barley", "canola meal", "oat meal", "fish oil", "dried egg product", "sunflower oil"],
                    "allergens": ["salmon", "fish", "rice", "barley", "oats", "eggs"],
                    "contains": []
                },
                "nutrition": {
                    "protein_pct": 26,
                    "fat_pct": 16,
                    "fiber_pct": 3,
                    "calories_per_cup": 450
                },
                "features": ["sensitive_stomach", "skin_health", "omega_fatty_acids", "probiotics"]
            }
        },
        {
            "name": "Size Health Nutrition Small Adult",
            "brand": "Royal Canin",
            "description": "Tailored nutrition for small breed dogs with a mature digestive system.",
            "price": 52.99,
            "price_unit": "13 lb bag",
            "image_url": "https://example.com/royal-canin-small.jpg",
            "rating": 4.5,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["small"],
                "primary_protein": "chicken",
                "ingredients": {
                    "full_list": ["chicken by-product meal", "brewers rice", "corn", "chicken fat", "wheat gluten", "natural flavors", "dried plain beet pulp"],
                    "allergens": ["chicken", "rice", "corn", "wheat"],
                    "contains": ["chicken_meal", "chicken"]
                },
                "nutrition": {
                    "protein_pct": 25,
                    "fat_pct": 16,
                    "fiber_pct": 3.3,
                    "calories_per_cup": 382
                },
                "features": ["small_kibble", "digestive_health", "skin_coat"]
            }
        },
        {
            "name": "CORE Grain-Free Small Breed",
            "brand": "Wellness",
            "description": "Grain-free, protein-focused nutrition with turkey and chicken.",
            "price": 58.99,
            "price_unit": "18 lb bag",
            "image_url": "https://example.com/wellness-core.jpg",
            "rating": 4.8,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["small"],
                "primary_protein": "turkey",
                "ingredients": {
                    "full_list": ["deboned turkey", "turkey meal", "chicken meal", "peas", "lentils", "dried ground potatoes", "chicken fat", "tomato pomace", "salmon oil"],
                    "allergens": ["turkey", "chicken", "fish"],
                    "contains": ["chicken_meal", "chicken", "turkey"]
                },
                "nutrition": {
                    "protein_pct": 34,
                    "fat_pct": 16,
                    "fiber_pct": 4.5,
                    "calories_per_cup": 421
                },
                "features": ["grain_free", "high_protein", "probiotics", "omega_fatty_acids"]
            }
        },
        {
            "name": "Science Diet Small Paws Adult",
            "brand": "Hill's",
            "description": "Precisely balanced nutrition for small breed dogs, clinically proven.",
            "price": 45.99,
            "price_unit": "15.5 lb bag",
            "image_url": "https://example.com/hills-science.jpg",
            "rating": 4.4,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["small"],
                "primary_protein": "chicken",
                "ingredients": {
                    "full_list": ["chicken", "whole grain wheat", "cracked pearled barley", "whole grain sorghum", "whole grain corn", "chicken meal", "corn gluten meal", "chicken fat"],
                    "allergens": ["chicken", "wheat", "barley", "corn"],
                    "contains": ["chicken_meal", "chicken"]
                },
                "nutrition": {
                    "protein_pct": 21.6,
                    "fat_pct": 15.4,
                    "fiber_pct": 2.5,
                    "calories_per_cup": 393
                },
                "features": ["veterinarian_recommended", "precise_nutrition", "easy_to_digest"]
            }
        },
        {
            "name": "High Prairie Grain-Free",
            "brand": "Taste of the Wild",
            "description": "Roasted bison and venison with sweet potatoes, grain-free formula.",
            "price": 54.99,
            "price_unit": "28 lb bag",
            "image_url": "https://example.com/totw-prairie.jpg",
            "rating": 4.6,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["all_life_stages"],
                "size_suitability": ["all_sizes"],
                "primary_protein": "bison",
                "ingredients": {
                    "full_list": ["bison", "lamb meal", "sweet potatoes", "peas", "potatoes", "canola oil", "egg product", "roasted venison", "beef", "salmon oil"],
                    "allergens": ["lamb", "eggs", "fish", "beef"],
                    "contains": []
                },
                "nutrition": {
                    "protein_pct": 32,
                    "fat_pct": 18,
                    "fiber_pct": 4,
                    "calories_per_cup": 370
                },
                "features": ["grain_free", "high_protein", "probiotics", "novel_protein"]
            }
        },
        {
            "name": "Original Small Breed Formula",
            "brand": "Orijen",
            "description": "Biologically appropriate, fresh chicken and turkey with 85% quality animal ingredients.",
            "price": 89.99,
            "price_unit": "13 lb bag",
            "image_url": "https://example.com/orijen-small.jpg",
            "rating": 4.9,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["all_life_stages"],
                "size_suitability": ["small"],
                "primary_protein": "chicken",
                "ingredients": {
                    "full_list": ["fresh chicken meat", "fresh turkey meat", "fresh whole eggs", "fresh chicken liver", "fresh whole herring", "fresh turkey liver", "chicken", "turkey", "whole mackerel"],
                    "allergens": ["chicken", "turkey", "eggs", "fish"],
                    "contains": ["chicken", "turkey"]
                },
                "nutrition": {
                    "protein_pct": 38,
                    "fat_pct": 18,
                    "fiber_pct": 5,
                    "calories_per_cup": 449
                },
                "features": ["grain_free", "high_protein", "fresh_ingredients", "premium"]
            }
        },
        {
            "name": "Grain Free Real Beef Recipe",
            "brand": "Merrick",
            "description": "Deboned beef as #1 ingredient, grain-free with sweet potatoes.",
            "price": 61.98,
            "price_unit": "22 lb bag",
            "image_url": "https://example.com/merrick-beef.jpg",
            "rating": 4.7,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["all_sizes"],
                "primary_protein": "beef",
                "ingredients": {
                    "full_list": ["deboned beef", "lamb meal", "sweet potatoes", "peas", "potatoes", "natural flavor", "salmon meal", "chicken meal", "beef fat"],
                    "allergens": ["beef", "lamb", "salmon", "chicken", "fish"],
                    "contains": ["chicken_meal", "salmon_meal"]
                },
                "nutrition": {
                    "protein_pct": 38,
                    "fat_pct": 15,
                    "fiber_pct": 3.5,
                    "calories_per_cup": 378
                },
                "features": ["grain_free", "high_protein", "glucosamine", "omega_fatty_acids"]
            }
        },
        {
            "name": "Natural Choice Small Breed Adult",
            "brand": "Nutro",
            "description": "Farm-raised chicken, wholesome whole grains, essential antioxidants.",
            "price": 42.99,
            "price_unit": "15 lb bag",
            "image_url": "https://example.com/nutro-small.jpg",
            "rating": 4.5,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["small"],
                "primary_protein": "chicken",
                "ingredients": {
                    "full_list": ["chicken", "chicken meal", "whole brown rice", "split peas", "rice bran", "chicken fat", "oatmeal", "dried plain beet pulp", "natural flavor"],
                    "allergens": ["chicken", "rice", "oats"],
                    "contains": ["chicken_meal", "chicken"]
                },
                "nutrition": {
                    "protein_pct": 27,
                    "fat_pct": 16,
                    "fiber_pct": 4,
                    "calories_per_cup": 360
                },
                "features": ["natural", "non_gmo", "small_kibble"]
            }
        },
        {
            "name": "PURE Small Breed Lamb Formula",
            "brand": "Canidae",
            "description": "Limited ingredient diet, 8 key ingredients, easily digestible.",
            "price": 54.99,
            "price_unit": "20 lb bag",
            "image_url": "https://example.com/canidae-pure.jpg",
            "rating": 4.6,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["small"],
                "primary_protein": "lamb",
                "ingredients": {
                    "full_list": ["lamb", "lamb meal", "sweet potatoes", "peas", "potatoes", "canola oil", "menhaden fish meal", "natural flavor"],
                    "allergens": ["lamb", "fish"],
                    "contains": []
                },
                "nutrition": {
                    "protein_pct": 28,
                    "fat_pct": 15,
                    "fiber_pct": 4,
                    "calories_per_cup": 468
                },
                "features": ["grain_free", "limited_ingredient", "probiotics", "no_corn_wheat_soy"]
            }
        },
        {
            "name": "Adult Chicken & Sweet Potato",
            "brand": "Diamond Naturals",
            "description": "High-quality protein with superfoods and probiotics for immune support.",
            "price": 39.99,
            "price_unit": "30 lb bag",
            "image_url": "https://example.com/diamond-chicken.jpg",
            "rating": 4.4,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["all_sizes"],
                "primary_protein": "chicken",
                "ingredients": {
                    "full_list": ["chicken meal", "whole grain brown rice", "cracked pearled barley", "chicken fat", "peas", "sweet potatoes", "dried beet pulp", "fish meal"],
                    "allergens": ["chicken", "rice", "barley", "fish"],
                    "contains": ["chicken_meal"]
                },
                "nutrition": {
                    "protein_pct": 26,
                    "fat_pct": 16,
                    "fiber_pct": 4,
                    "calories_per_cup": 342
                },
                "features": ["probiotics", "antioxidants", "omega_fatty_acids", "budget_friendly"]
            }
        },
        {
            "name": "True Instinct High Protein Turkey",
            "brand": "Nature's Recipe",
            "description": "Grain-free with real turkey as #1 ingredient, nutrient-dense.",
            "price": 48.99,
            "price_unit": "20 lb bag",
            "image_url": "https://example.com/natures-recipe-turkey.jpg",
            "rating": 4.3,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["all_sizes"],
                "primary_protein": "turkey",
                "ingredients": {
                    "full_list": ["turkey", "turkey meal", "peas", "chickpeas", "lentils", "pork fat", "natural flavor", "dried plain beet pulp", "flaxseed"],
                    "allergens": ["turkey", "pork"],
                    "contains": []
                },
                "nutrition": {
                    "protein_pct": 32,
                    "fat_pct": 16,
                    "fiber_pct": 5,
                    "calories_per_cup": 401
                },
                "features": ["grain_free", "high_protein", "no_corn_wheat_soy"]
            }
        },
        {
            "name": "Wholesome Essentials Adult Salmon",
            "brand": "Rachael Ray Nutrish",
            "description": "Real salmon, wholesome veggies, no poultry by-product meal.",
            "price": 44.99,
            "price_unit": "23 lb bag",
            "image_url": "https://example.com/nutrish-salmon.jpg",
            "rating": 4.4,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["all_sizes"],
                "primary_protein": "salmon",
                "ingredients": {
                    "full_list": ["salmon", "salmon meal", "brown rice", "dried peas", "soybean meal", "oatmeal", "dried beet pulp", "menhaden fish oil"],
                    "allergens": ["salmon", "fish", "rice", "soy", "oats"],
                    "contains": []
                },
                "nutrition": {
                    "protein_pct": 26,
                    "fat_pct": 14,
                    "fiber_pct": 4,
                    "calories_per_cup": 325
                },
                "features": ["real_salmon", "no_poultry_by_products", "omega_fatty_acids"]
            }
        },
        {
            "name": "Small & Mighty Natural Duck",
            "brand": "Earthborn Holistic",
            "description": "Small kibble, premium duck protein, grain and gluten free.",
            "price": 56.99,
            "price_unit": "20 lb bag",
            "image_url": "https://example.com/earthborn-duck.jpg",
            "rating": 4.7,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["small"],
                "primary_protein": "duck",
                "ingredients": {
                    "full_list": ["duck meal", "peas", "pea protein", "tapioca", "dried egg product", "canola oil", "pea fiber", "flaxseed", "apples"],
                    "allergens": ["duck", "eggs"],
                    "contains": []
                },
                "nutrition": {
                    "protein_pct": 30,
                    "fat_pct": 20,
                    "fiber_pct": 5,
                    "calories_per_cup": 442
                },
                "features": ["grain_free", "gluten_free", "novel_protein", "l_carnitine"]
            }
        },
        {
            "name": "Wild Frontier Small Breed Beef",
            "brand": "Nutro",
            "description": "High-protein, grain-free, inspired by ancestral diet with beef.",
            "price": 52.99,
            "price_unit": "12 lb bag",
            "image_url": "https://example.com/nutro-wild.jpg",
            "rating": 4.5,
            "pet_type": "dog",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["small"],
                "primary_protein": "beef",
                "ingredients": {
                    "full_list": ["beef", "beef meal", "chickpeas", "split peas", "dried potatoes", "lentils", "pork meal", "beef fat", "natural flavor"],
                    "allergens": ["beef", "pork"],
                    "contains": []
                },
                "nutrition": {
                    "protein_pct": 32,
                    "fat_pct": 16,
                    "fiber_pct": 5,
                    "calories_per_cup": 390
                },
                "features": ["grain_free", "high_protein", "non_gmo", "small_kibble"]
            }
        }
    ]
    
    print("Seeding dog food products...")
    added_count = 0
    
    for product_data in products:
        # Check if product already exists
        existing = db.query(Product).filter(
            Product.name == product_data["name"],
            Product.brand == product_data["brand"]
        ).first()
        
        if not existing:
            product = Product(**product_data)
            db.add(product)
            added_count += 1
            print(f"  ✓ Added: {product_data['brand']} - {product_data['name']}")
        else:
            print(f"  - Skipped (exists): {product_data['brand']} - {product_data['name']}")
    
    db.commit()
    db.close()
    
    print(f"\n✓ Seeding complete! Added {added_count} products.")
    print(f"Total products in database: {len(products)}")
    print("\nReady to start the server: python main.py")


if __name__ == "__main__":
    seed_products()
