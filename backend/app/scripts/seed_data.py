"""
Comprehensive Seed Database with Realistic Products for All Categories
Run with: python -m app.scripts.seed_data
"""

from app.database import supabase
import uuid
from datetime import datetime


def seed_products():
    """Add realistic products across all categories with sub-categories"""
    
    # ============= DOG PRODUCTS (15) =============
    dog_products = [
        # Dog Food (5 products)
        {
            "id": str(uuid.uuid4()),
            "name": "Life Protection Formula Chicken & Brown Rice",
            "brand": "Blue Buffalo",
            "description": "Real chicken, wholesome grains, and LifeSource Bits with antioxidants for adult dogs.",
            "price": 54.98,
            "price_unit": "30 lb bag",
            "image_url": "https://images.unsplash.com/photo-1534351450181-ea9f78427fe8?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "dog",
            "product_category": "food",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["all_sizes"],
                "primary_protein": "chicken",
                "grain_free": False,
                "ingredients": {
                    "full_list": ["deboned chicken", "chicken meal", "brown rice", "barley", "oatmeal"],
                    "allergens": ["chicken", "rice", "barley", "oats"]
                },
                "nutrition": {
                    "protein_pct": 24,
                    "fat_pct": 14,
                    "fiber_pct": 5,
                    "calories_per_cup": 377
                }
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Taste of the Wild High Prairie",
            "brand": "Taste of the Wild",
            "description": "Grain-free formula with roasted bison and venison. High protein for active dogs.",
            "price": 52.99,
            "price_unit": "28 lb bag",
            "image_url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "dog",
            "product_category": "food",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["medium", "large"],
                "primary_protein": "bison",
                "grain_free": True,
                "nutrition": {
                    "protein_pct": 32,
                    "fat_pct": 18,
                    "calories_per_cup": 370
                }
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Purina Pro Plan Puppy Formula",
            "brand": "Purina Pro Plan",
            "description": "DHA from omega-rich fish oil for brain development. Chicken as #1 ingredient.",
            "price": 47.98,
            "price_unit": "34 lb bag",
            "image_url": "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "dog",
            "product_category": "food",
            "attributes": {
                "life_stage": ["puppy"],
                "size_suitability": ["all_sizes"],
                "primary_protein": "chicken",
                "grain_free": False,
                "nutrition": {
                    "protein_pct": 28,
                    "fat_pct": 17,
                    "DHA": True
                }
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Hill's Science Diet Senior 7+",
            "brand": "Hill's Science Diet",
            "description": "Easy to digest formula for older dogs. Supports healthy brain, kidneys, and joints.",
            "price": 59.99,
            "price_unit": "30 lb bag",
            "image_url": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "dog",
            "product_category": "food",
            "attributes": {
                "life_stage": ["senior"],
                "size_suitability": ["all_sizes"],
                "primary_protein": "chicken",
                "special_diet": ["senior", "joint_support"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Royal Canin Small Breed Adult",
            "brand": "Royal Canin",
            "description": "Precise nutrition for small dogs. Supports dental health and skin/coat.",
            "price": 44.99,
            "price_unit": "13 lb bag",
            "image_url": "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=500&h=500&fit=crop",
            "rating": 4.5,
            "pet_type": "dog",
            "product_category": "food",
            "attributes": {
                "life_stage": ["adult"],
                "size_suitability": ["small"],
                "primary_protein": "chicken",
                "nutrition": {
                    "protein_pct": 25,
                    "fat_pct": 16
                }
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        
        # Dog Toys (5 products)
        {
            "id": str(uuid.uuid4()),
            "name": "KONG Classic Dog Toy",
            "brand": "KONG",
            "description": "Durable rubber toy for chewing, treating, and playing. Recommended by veterinarians worldwide.",
            "price": 13.99,
            "price_unit": "Large",
            "image_url": "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "dog",
            "product_category": "toys",
            "attributes": {
                "size_suitability": ["medium", "large"],
                "material": "natural rubber",
                "features": ["dishwasher safe", "made in USA", "treat dispenser"],
                "durability": "heavy duty"
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Chuckit! Ultra Ball",
            "brand": "Chuckit!",
            "description": "High-bounce rubber ball for fetch. Floats in water and is bright orange for visibility.",
            "price": 9.99,
            "price_unit": "2-pack Medium",
            "image_url": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "dog",
            "product_category": "toys",
            "attributes": {
                "size_suitability": ["all_sizes"],
                "material": "rubber",
                "features": ["high bounce", "floats", "bright colors"],
                "activity": "fetch"
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Outward Hound Hide-A-Squirrel Puzzle Toy",
            "brand": "Outward Hound",
            "description": "Interactive puzzle plush toy. Includes 4 squeaky squirrels that hide in a tree trunk.",
            "price": 15.99,
            "price_unit": "Large",
            "image_url": "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "dog",
            "product_category": "toys",
            "attributes": {
                "size_suitability": ["all_sizes"],
                "type": "puzzle toy",
                "features": ["mental stimulation", "squeakers", "machine washable"],
                "pieces": 4
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "BeneB one Wishbone Dog Chew Toy",
            "brand": "Benebone",
            "description": "Real bacon flavor infused throughout. Made in USA with nylon and real bacon.",
            "price": 11.99,
            "price_unit": "Medium",
            "image_url": "https://images.unsplash.com/photo-1561212044-bac5ef688a07?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "dog",
            "product_category": "toys",
            "attributes": {
                "size_suitability": ["medium", "large"],
                "material": "nylon",
                "flavor": "bacon",
                "durability": "extreme"
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Rope Tug Toy 3-Pack",
            "brand": "Mammoth Pet",
            "description": "Cotton rope toys for tug-of-war and fetch. Helps clean teeth during play.",
            "price": 14.99,
            "price_unit": "3-pack",
            "image_url": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&h=500&fit=crop",
            "rating": 4.5,
            "pet_type": "dog",
            "product_category": "toys",
            "attributes": {
                "size_suitability": ["all_sizes"],
                "material": "cotton rope",
                "features": ["dental health", "interactive play"],
                "quantity": 3
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        
        # Dog Grooming (3 products)
        {
            "id": str(uuid.uuid4()),
            "name": "FURminator deShedding Tool",
            "brand": "FURminator",
            "description": "Reduces shedding up to 90%. Reaches beneath topcoat to remove loose undercoat hair.",
            "price": 39.99,
            "price_unit": "Large Long Hair",
            "image_url": "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "dog",
            "product_category": "grooming",
            "attributes": {
                "size_suitability": ["large"],
                "coat_type": "long_hair",
                "features": ["ejector button", "ergonomic handle"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Earthbath Oatmeal & Aloe Dog Shampoo",
            "brand": "Earthbath",
            "description": "Soap-free formula with colloidal oatmeal and organic aloe vera for sensitive skin.",
            "price": 15.99,
            "price_unit": "16 oz",
            "image_url": "https://images.unsplash.com/photo-1591856419428-e67b77e82909?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "dog",
            "product_category": "grooming",
            "attributes": {
                "skin_type": "sensitive",
                "scent": "vanilla_almond",
                "features": ["pH balanced", "biodegradable", "soap-free"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Safari Professional Nail Trimmer",
            "brand": "Safari",
            "description": "Precision nail trimmer with safety stop. Suitable for medium and large dogs.",
            "price": 8.99,
            "price_unit": "each",
            "image_url": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=500&fit=crop",
            "rating": 4.5,
            "pet_type": "dog",
            "product_category": "grooming",
            "attributes": {
                "size_suitability": ["medium", "large"],
                "features": ["safety stop", "non-slip grip", "sharp blades"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        
        # Dog Health (2 products)
        {
            "id": str(uuid.uuid4()),
            "name": "Cosequin Joint Health Supplement",
            "brand": "Nutramax",
            "description": "Veterinarian recommended joint supplement with glucosamine and chondroitin.",
            "price": 49.99,
            "price_unit": "110 chewable tablets",
            "image_url": "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "dog",
            "product_category": "health",
            "attributes": {
                "supplement_type": "joint_health",
                "form": "chewable",
                "key_ingredients": ["glucosamine", "chondroitin", "MSM"],
                "vet_recommended": True
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Zesty Paws Multivitamin Treats",
            "brand": "Zesty Paws",
            "description": "8-in-1 multivitamin with glucosamine, probiotics, and omega-3. Chicken flavor.",
            "price": 25.97,
            "price_unit": "90 soft chews",
            "image_url": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "dog",
            "product_category": "health",
            "attributes": {
                "supplement_type": "multivitamin",
                "form": "soft_chew",
                "benefits": ["joint", "digestive", "immune", "skin_coat"],
                "flavor": "chicken"
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
    ]
    
    # ============= CAT PRODUCTS (15) =============
    cat_products = [
        # Cat Food (5 products)
        {
            "id": str(uuid.uuid4()),
            "name": "Purina Fancy Feast Gourmet Wet Food",
            "brand": "Fancy Feast",
            "description": "Gourmet cat food with real seafood. Variety pack with ocean whitefish, tuna, and salmon.",
            "price": 19.99,
            "price_unit": "24-pack (3 oz cans)",
            "image_url": "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "cat",
            "product_category": "food",
            "attributes": {
                "life_stage": ["adult"],
                "form": "wet",
                "primary_protein": "seafood",
                "flavors": ["whitefish", "tuna", "salmon"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Royal Canin Indoor Adult Dry Cat Food",
            "brand": "Royal Canin",
            "description": "Formulated for indoor cats. Reduces stool odor and supports healthy digestion.",
            "price": 43.99,
            "price_unit": "15 lb bag",
            "image_url": "https://images.unsplash.com/photo-1611915387288-fd8d2f5f928b?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "cat",
            "product_category": "food",
            "attributes": {
                "life_stage": ["adult"],
                "form": "dry",
                "lifestyle": "indoor",
                "nutrition": {
                    "protein_pct": 25,
                    "fat_pct": 11,
                    "calories_per_cup": 338
                }
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Blue Buffalo Wilderness Grain-Free",
            "brand": "Blue Buffalo",
            "description": "High protein, grain-free formula. Deboned chicken with LifeSource Bits.",
            "price": 38.98,
            "price_unit": "11 lb bag",
            "image_url": "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "cat",
            "product_category": "food",
            "attributes": {
                "life_stage": ["adult"],
                "form": "dry",
                "grain_free": True,
                "primary_protein": "chicken",
                "nutrition": {
                    "protein_pct": 40,
                    "fat_pct": 18
                }
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Hill's Science Diet Kitten Formula",
            "brand": "Hill's Science Diet",
            "description": "Balanced nutrition for kittens up to 1 year. DHA for brain and eye development.",
            "price": 35.99,
            "price_unit": "7 lb bag",
            "image_url": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "cat",
            "product_category": "food",
            "attributes": {
                "life_stage": ["kitten"],
                "form": "dry",
                "primary_protein": "chicken",
                "nutrition": {
                    "protein_pct": 35,
                    "DHA": True
                }
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Wellness CORE Grain-Free Pate",
            "brand": "Wellness",
            "description": "High-protein wet food. Chicken and turkey recipe with vitamins and minerals.",
            "price": 29.99,
            "price_unit": "12-pack (5.5 oz cans)",
            "image_url": "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "cat",
            "product_category": "food",
            "attributes": {
                "life_stage": ["adult"],
                "form": "wet",
                "grain_free": True,
                "primary_protein": "chicken",
                "nutrition": {
                    "protein_pct": 12,
                    "fat_pct": 6
                }
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        
        # Cat Toys (5 products)
        {
            "id": str(uuid.uuid4()),
            "name": "Yeowww! Catnip Banana",
            "brand": "Yeowww!",
            "description": "100% organic catnip stuffed toy. No cotton, plastic, or chemicals.",
            "price": 6.99,
            "price_unit": "each",
            "image_url": "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "cat",
            "product_category": "toys",
            "attributes": {
                "material": "cotton_fabric",
                "catnip": "100% organic",
                "features": ["handmade", "USA grown catnip"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "SmartyKat Hot Pursuit Electronic Cat Toy",
            "brand": "SmartyKat",
            "description": "Electronic concealed motion toy. Feather wand spins unpredictably under fabric.",
            "price": 14.99,
            "price_unit": "each",
            "image_url": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&h=500&fit=crop",
            "rating": 4.5,
            "pet_type": "cat",
            "product_category": "toys",
            "attributes": {
                "type": "electronic",
                "features": ["auto shutoff", "4 speeds", "battery powered"],
                "activity": "chase"
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Cat Dancer Interactive Toy",
            "brand": "Cat Dancer",
            "description": "Simple spring wire with cardboard rolls. Provides hours of interactive play.",
            "price": 2.99,
            "price_unit": "each",
            "image_url": "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "cat",
            "product_category": "toys",
            "attributes": {
                "type": "wand",
                "material": "spring_wire",
                "features": ["interactive", "exercise"],
                "made_in": "USA"
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Bergan Turbo Scratcher Cat Toy",
            "brand": "Bergan",
            "description": "2-in-1 scratcher and toy. Ball spins around track while cat scratches center.",
            "price": 18.99,
            "price_unit": "each",
            "image_url": "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "cat",
            "product_category": "toys",
            "attributes": {
                "type": "scratcher_toy",
                "features": ["replaceable pad", "ball included"],
                "material": "cardboard_plastic"
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Petstages Tower of Tracks",
            "brand": "Petstages",
            "description": "3-tier track tower with non-slip base. Three levels of mental and physical stimulation.",
            "price": 16.99,
            "price_unit": "each",
            "image_url": "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=500&h=500&fit=crop",
            "rating": 4.5,
            "pet_type": "cat",
            "product_category": "toys",
            "attributes": {
                "type": "puzzle",
                "tiers": 3,
                "features": ["non-slip base", "bright balls", "solo play"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        
        # Cat Litter (3 products)
        {
            "id": str(uuid.uuid4()),
            "name": "Dr. Elsey's Ultra Cat Litter",
            "brand": "Dr. Elsey's",
            "description": "99.9% dust-free, hypoallergenic clay litter. Superior clumping and odor control.",
            "price": 19.99,
            "price_unit": "40 lb bag",
            "image_url": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "cat",
            "product_category": "litter",
            "attributes": {
                "type": "clay",
                "clumping": True,
                "features": ["dust-free", "hypoallergenic", "unscented"],
                "weight_lbs": 40
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "World's Best Cat Litter Multiple Cat",
            "brand": "World's Best",
            "description": "Natural corn-based clumping litter. Flushable and 99% dust-free.",
            "price": 24.99,
            "price_unit": "28 lb bag",
            "image_url": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "cat",
            "product_category": "litter",
            "attributes": {
                "type": "corn",
                "clumping": True,
                "features": ["flushable", "biodegradable", "lightweight"],
                "households": "multi_cat"
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Fresh Step Odor Shield Scented Litter",
            "brand": "Fresh Step",
            "description": "10 days of odor control. Ammonia block technology with Febreze freshness.",
            "price": 15.99,
            "price_unit": "25 lb box",
            "image_url": "https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=500&h=500&fit=crop",
            "rating": 4.5,
            "pet_type": "cat",
            "product_category": "litter",
            "attributes": {
                "type": "clay",
                "clumping": True,
                "scented": True,
                "features": ["ammonia block", "odor control"],
                "weight_lbs": 25
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        
        # Cat Health (2 products)
        {
            "id": str(uuid.uuid4()),
            "name": "Greenies Feline Dental Treats",
            "brand": "Greenies",
            "description": "Crunchy treats reduce tartar buildup. Salmon flavor with vitamins and minerals.",
            "price": 7.99,
            "price_unit": "2.1 oz",
            "image_url": "https://images.unsplash.com/photo-1573865526739-10c1c50f6b1f?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "cat",
            "product_category": "health",
            "attributes": {
                "type": "dental_treat",
                "flavor": "salmon",
                "benefits": ["tartar_control", "fresh_breath"],
                "form": "crunchy"
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Tomlyn Hairball Remedy Gel",
            "brand": "Tomlyn",
            "description": "Laxatone lubricant helps eliminate and prevent hairballs. Tuna flavor cats love.",
            "price": 8.99,
            "price_unit": "4.25 oz",
            "image_url": "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "cat",
            "product_category": "health",
            "attributes": {
                "type": "hairball_remedy",
                "form": "gel",
                "flavor": "tuna",
                "vet_recommended": True
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
    ]
    
    # ============= BIRD PRODUCTS (8) =============
    bird_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Kaytee Forti-Diet Pro Health Parakeet Food",
            "brand": "Kaytee",
            "description": "Nutritionally enhanced daily diet for parakeets. Probiotics for digestive health.",
            "price": 12.99,
            "price_unit": "5 lb bag",
            "image_url": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "bird",
            "product_category": "food",
            "attributes": {
                "bird_type": "parakeet",
                "nutrition": "complete_diet",
                "features": ["probiotics", "omega-3"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Zupreem FruitBlend Parrot Food",
            "brand": "Zupreem",
            "description": "Fruit-flavored pellets for medium parrots. Complete nutrition with natural fruit flavors.",
            "price": 19.99,
            "price_unit": "3.5 lb bag",
            "image_url": "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "bird",
            "product_category": "food",
            "attributes": {
                "bird_type": "parrot",
                "form": "pellets",
                "flavors": ["banana", "orange", "apple", "grape"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Kaytee Spray Millet Bird Treat",
            "brand": "Kaytee",
            "description": "100% natural spray millet. Ideal for birds of all sizes. 12 spray pack.",
            "price": 8.99,
            "price_unit": "12-pack",
            "image_url": "https://images.unsplash.com/photo-1523431278009-9cd3e672c0e0?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "bird",
            "product_category": "treats",
            "attributes": {
                "bird_type": "all",
                "natural": True,
                "quantity": 12
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "JW Pet Activitoy Birdie Basketball",
            "brand": "JW Pet",
            "description": "Interactive basketball toy for birds. Provides mental and physical stimulation.",
            "price": 6.99,
            "price_unit": "each",
            "image_url": "https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=500&h=500&fit=crop",
            "rating": 4.5,
            "pet_type": "bird",
            "product_category": "toys",
            "attributes": {
                "bird_type": "small_medium",
                "features": ["interactive", "colorful"],
                "activity": "play"
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Prevue Pet Birdie Basics Wood Bird Ladder",
            "brand": "Prevue Pet",
            "description": "11-step natural wood ladder. Encourages exercise and climbing.",
            "price": 5.99,
            "price_unit": "each",
            "image_url": "https://images.unsplash.com/photo-1586716402203-79219bede345?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "bird",
            "product_category": "toys",
            "attributes": {
                "bird_type": "all",
                "material": "natural_wood",
                "steps": 11,
                "length_inches": 13
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Penn-Plax Bird Life Rope Perch",
            "brand": "Penn-Plax",
            "description": "Bendable rope perch. Provides foot exercise and helps maintain nails.",
            "price": 9.99,
            "price_unit": "21 inch",
            "image_url": "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=500&h=500&fit=crop",
            "rating": 4.5,
            "pet_type": "bird",
            "product_category": "perch",
            "attributes": {
                "bird_type": "medium_large",
                "material": "cotton_rope",
                "bendable": True,
                "length_inches": 21
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Insight Clean Seed Silo Bird Feeder",
            "brand": "JW Pet",
            "description": "Clear plastic feeder with perch. Easy to fill and clean. Prevents seed waste.",
            "price": 7.99,
            "price_unit": "each",
            "image_url": "https://images.unsplash.com/photo-1535463731090-e34f4b5098c5?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "bird",
            "product_category": "feeder",
            "attributes": {
                "bird_type": "small_medium",
                "material": "plastic",
                "features": ["easy_fill", "waste_guard"],
                "capacity_oz": 4
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Ecotrition Vita-Sol Multi-Vitamin for Birds",
            "brand": "Ecotrition",
            "description": "Liquid vitamin supplement. Adds essential vitamins to drinking water.",
            "price": 6.99,
            "price_unit": "4 oz",
            "image_url": "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=500&h=500&fit=crop",
            "rating": 4.4,
            "pet_type": "bird",
            "product_category": "health",
            "attributes": {
                "bird_type": "all",
                "form": "liquid",
                "vitamins": ["A", "D3", "E", "B-complex"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
    ]
    
    # ============= FISH & AQUARIUM (6) =============
    fish_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Tetra TetraMin Tropical Flakes",
            "brand": "Tetra",
            "description": "Nutritionally balanced staple food for tropical fish. Clean & clear water formula.",
            "price": 9.99,
            "price_unit": "2.2 oz",
            "image_url": "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "fish",
            "product_category": "food",
            "attributes": {
                "fish_type": "tropical",
                "form": "flakes",
                "features": ["clear_water", "balanced_nutrition"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "API Stress Coat Water Conditioner",
            "brand": "API",
            "description": "Makes tap water safe for fish. Aloe vera formula heals damaged tissue and fins.",
            "price": 13.99,
            "price_unit": "16 oz",
            "image_url": "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "fish",
            "product_category": "water_treatment",
            "attributes": {
                "type": "conditioner",
                "features": ["removes_chlorine", "aloe_vera", "heals_tissue"],
                "treats_gallons": 960
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Aqueon Aquarium Water Changer",
            "brand": "Aqueon",
            "description": "Complete water changer system. Drains and fills aquarium with no lifting.",
            "price": 34.99,
            "price_unit": "25 feet",
            "image_url": "https://images.unsplash.com/photo-1520990269108-4ea6c8422e66?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "fish",
            "product_category": "maintenance",
            "attributes": {
                "type": "water_changer",
                "hose_length_ft": 25,
                "features": ["no_buckets", "spill_guard"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Fluval Bio-Foam Filter Pads",
            "brand": "Fluval",
            "description": "Complex pore structure for superior biological filtration. Prevents clogging.",
            "price": 8.99,
            "price_unit": "4-pack",
            "image_url": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "fish",
            "product_category": "filter",
            "attributes": {
                "type": "filter_media",
                "material": "foam",
                "quantity": 4,
                "filtration": "biological"
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Hygger Aquarium Air Stone Kit",
            "brand": "Hygger",
            "description": "Ultra-quiet air stone with check valve. Creates bubbles for oxygen and decoration.",
            "price": 11.99,
            "price_unit": "kit",
            "image_url": "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=500&h=500&fit=crop",
            "rating": 4.5,
            "pet_type": "fish",
            "product_category": "accessories",
            "attributes": {
                "type": "air_stone",
                "features": ["quiet", "check_valve", "LED_light"],
                "includes": ["tube", "valve", "stone"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Marina Aquarium Thermometer",
            "brand": "Marina",
            "description": "Floating thermometer with suction cup. Easy-to-read temperature scale.",
            "price": 3.99,
            "price_unit": "each",
            "image_url": "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=500&h=500&fit=crop",
            "rating": 4.4,
            "pet_type": "fish",
            "product_category": "accessories",
            "attributes": {
                "type": "thermometer",
                "mounting": "floating_suction",
                "scale": "fahrenheit_celsius"
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
    ]
    
    # ============= SMALL PETS (Hamster, Rabbit, Guinea Pig) (6) =============
    small_pet_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Oxbow Essentials Adult Rabbit Food",
            "brand": "Oxbow",
            "description": "Timothy-based pellets for adult rabbits. Supports digestive health.",
            "price": 19.99,
            "price_unit": "10 lb bag",
            "image_url": "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "small_pet",
            "product_category": "food",
            "attributes": {
                "animal": "rabbit",
                "life_stage": "adult",
                "main_ingredient": "timothy_hay",
                "features": ["high_fiber", "no_artificial_preservatives"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Kaytee Clean & Cozy Small Pet Bedding",
            "brand": "Kaytee",
            "description": "99.9% dust-free paper bedding. Absorbs 6x its weight. White color.",
            "price": 21.99,
            "price_unit": "49.2 liters",
            "image_url": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "small_pet",
            "product_category": "bedding",
            "attributes": {
                "animal": ["hamster", "rabbit", "guinea_pig"],
                "material": "paper",
                "features": ["dust_free", "super_absorbent", "odor_control"],
                "volume_liters": 49.2
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Niteangel Hamster Wooden Chew Toys",
            "brand": "Niteangel",
            "description": "6-pack natural wooden chew toys. Promotes dental health and entertainment.",
            "price": 12.99,
            "price_unit": "6-pack",
            "image_url": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "small_pet",
            "product_category": "toys",
            "attributes": {
                "animal": ["hamster", "gerbil"],
                "material": "natural_wood",
                "quantity": 6,
                "benefits": ["dental_health", "boredom_relief"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Living World Guinea Pig Food",
            "brand": "Living World",
            "description": "Premium mix with vitamin C. Fortified with essential nutrients for guinea pigs.",
            "price": 14.99,
            "price_unit": "5 lb bag",
            "image_url": "https://images.unsplash.com/photo-1612363148951-16bc1c000802?w=500&h=500&fit=crop",
            "rating": 4.5,
            "pet_type": "small_pet",
            "product_category": "food",
            "attributes": {
                "animal": "guinea_pig",
                "fortified": ["vitamin_C", "vitamins", "minerals"],
                "form": "pellets"
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Kaytee Comfort Exercise Wheel",
            "brand": "Kaytee",
            "description": "Silent spinner wheel for hamsters. Comfortable running surface. 8.5 inch diameter.",
            "price": 16.99,
            "price_unit": "8.5 inch",
            "image_url": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "small_pet",
            "product_category": "toys",
            "attributes": {
                "animal": ["hamster", "gerbil"],
                "diameter_inches": 8.5,
                "features": ["silent", "comfort_surface", "free_standing"],
                "type": "exercise_wheel"
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Living World Hay Feeder for Rabbits",
            "brand": "Living World",
            "description": "Minimizes hay waste. Attaches to cage. Keeps hay clean and accessible.",
            "price": 9.99,
            "price_unit": "each",
            "image_url": "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "small_pet",
            "product_category": "feeder",
            "attributes": {
                "animal": ["rabbit", "guinea_pig"],
                "type": "hay_feeder",
                "mounting": "cage_attach",
                "features": ["minimizes_waste", "hygienic"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
    ]
    
    # ============= SUPPLEMENTS & WELLNESS (4) =============
    supplement_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Nordic Naturals Pet Omega-3",
            "brand": "Nordic Naturals",
            "description": "Fish oil for dogs and cats. Supports skin, coat, heart, and immune health.",
            "price": 27.99,
            "price_unit": "8 oz",
            "image_url": "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "supplement",
            "product_category": "health",
            "attributes": {
                "suitable_for": ["dog", "cat"],
                "type": "omega_3",
                "form": "liquid",
                "benefits": ["skin_coat", "heart", "immune", "joint"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "VetriScience Composure Calming Chews",
            "brand": "VetriScience",
            "description": "Calming supplement for anxious dogs. Helps with stress, travel, and fireworks.",
            "price": 23.99,
            "price_unit": "30 chews",
            "image_url": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "supplement",
            "product_category": "health",
            "attributes": {
                "suitable_for": ["dog"],
                "type": "calming",
                "form": "chewable",
                "key_ingredients": ["thiamine", "L-theanine", "colostrum"],
                "use_cases": ["anxiety", "travel", "fireworks", "separation"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "PetHonesty Cranberry for Dogs",
            "brand": "PetHonesty",
            "description": "Urinary tract support chews. Cranberry extract with probiotics and marshmallow root.",
            "price": 24.99,
            "price_unit": "90 chews",
            "image_url": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&h=500&fit=crop",
            "rating": 4.5,
            "pet_type": "supplement",
            "product_category": "health",
            "attributes": {
                "suitable_for": ["dog"],
                "type": "urinary_health",
                "form": "soft_chew",
                "key_ingredients": ["cranberry", "probiotics", "marshmallow_root"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Purina FortiFlora Probiotic Supplement",
            "brand": "Purina",
            "description": "#1 vet-recommended probiotic. Supports digestive and immune health in cats.",
            "price": 32.99,
            "price_unit": "30 packets",
            "image_url": "https://images.unsplash.com/photo-1573865526739-10c1c50f6b1f?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "supplement",
            "product_category": "health",
            "attributes": {
                "suitable_for": ["cat"],
                "type": "probiotic",
                "form": "powder",
                "benefits": ["digestive_health", "immune_support", "diarrhea_relief"],
                "vet_recommended": True
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
    ]
    
    # ============= APPAREL & SHOES (4) =============
    apparel_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Nike Air Max 270 Running Shoes",
            "brand": "Nike",
            "description": "Max Air unit in heel provides ultra-soft cushioning. Breathable mesh upper.",
            "price": 150.00,
            "price_unit": "pair",
            "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "apparel",
            "product_category": "shoes",
            "attributes": {
                "type": "running_shoes",
                "gender": "unisex",
                "sizes": ["7", "8", "9", "10", "11", "12"],
                "colors": ["black", "white", "blue", "red"],
                "features": ["air_max", "breathable", "cushioned"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Adidas Ultraboost 22 Running Shoes",
            "brand": "Adidas",
            "description": "Responsive Boost cushioning. Primeknit upper adapts to your foot for comfort.",
            "price": 190.00,
            "price_unit": "pair",
            "image_url": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "apparel",
            "product_category": "shoes",
            "attributes": {
                "type": "running_shoes",
                "gender": "unisex",
                "sizes": ["6", "7", "8", "9", "10", "11", "12"],
                "technology": ["boost", "primeknit", "continental_rubber"],
                "features": ["energy_return", "adaptive_fit"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Lululemon Align High-Rise Leggings",
            "brand": "Lululemon",
            "description": "Buttery-soft Nulu fabric. High-rise design for comfort and coverage. 25 inch inseam.",
            "price": 98.00,
            "price_unit": "each",
            "image_url": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&h=500&fit=crop",
            "rating": 4.9,
            "pet_type": "apparel",
            "product_category": "clothing",
            "attributes": {
                "type": "leggings",
                "gender": "women",
                "sizes": ["2", "4", "6", "8", "10", "12"],
                "inseam_inches": 25,
                "fabric": "nulu",
                "features": ["high_rise", "buttery_soft", "no_pockets"]
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Patagonia Better Sweater Fleece Jacket",
            "brand": "Patagonia",
            "description": "Classic fleece jacket with sweater-knit face. Fair Trade Certified sewn.",
            "price": 139.00,
            "price_unit": "each",
            "image_url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "apparel",
            "product_category": "clothing",
            "attributes": {
                "type": "fleece_jacket",
                "gender": "unisex",
                "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
                "material": "polyester_fleece",
                "features": ["fair_trade", "zippered_pockets", "stand_up_collar"],
                "eco_friendly": True
            },
            "is_active": True,
            "created_at": datetime.now().isoformat()
        },
    ]
    
    # Combine all products
    all_products = (
        dog_products + cat_products + bird_products + 
        fish_products + small_pet_products + 
        supplement_products + apparel_products
    )
    
    # Clear existing products (Supabase will cascade delete recommendations)
    try:
        supabase.table('recommendations').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        supabase.table('products').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        print("✅ Cleared existing products and recommendations")
    except Exception as e:
        print(f"⚠️  Clear operation: {e}")
    
    # Insert products in batches (Supabase has limits)
    batch_size = 50
    for i in range(0, len(all_products), batch_size):
        batch = all_products[i:i+batch_size]
        try:
            supabase.table('products').insert(batch).execute()
            print(f"✅ Inserted batch {i//batch_size + 1} ({len(batch)} products)")
        except Exception as e:
            print(f"❌ Error inserting batch: {e}")
    
    print(f"\n✅ Seeded {len(all_products)} products with categories")
    print(f"   - Dog products: {len(dog_products)}")
    print(f"   - Cat products: {len(cat_products)}")
    print(f"   - Bird products: {len(bird_products)}")
    print(f"   - Fish products: {len(fish_products)}")
    print(f"   - Small pet products: {len(small_pet_products)}")
    print(f"   - Supplements: {len(supplement_products)}")
    print(f"   - Shoes/Apparel: {len(apparel_products)}")


if __name__ == "__main__":
    seed_products()