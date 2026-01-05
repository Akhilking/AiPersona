"""
Comprehensive Seed Database with Realistic Products for All Categories
Run with: python -m app.scripts.seed_data
"""

from app.database import SessionLocal
from app.models import Product, Recommendation


def seed_products():
    """Add realistic products across all categories with sub-categories"""
    db = SessionLocal()
    
    # ============= DOG PRODUCTS (15) =============
    dog_products = [
        # Food (10 products - keeping existing ones)
        {
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
            }
        },
        # Toys (3 new products)
        {
            "name": "KONG Classic Dog Toy",
            "brand": "KONG",
            "description": "Durable rubber toy for chewing, treating, and playing. Recommended by veterinarians and trainers worldwide.",
            "price": 13.99,
            "price_unit": "Large",
            "image_url": "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "dog",
            "product_category": "toys",
            "attributes": {
                "size_suitability": ["medium", "large"],
                "material": "natural rubber",
                "features": ["dishwasher safe", "made in USA", "can stuff with treats"],
                "durability": "heavy duty"
            }
        },
        {
            "name": "Chuckit! Ultra Ball",
            "brand": "Chuckit!",
            "description": "High-bounce rubber ball designed for the most demanding use. Fits Chuckit! launchers.",
            "price": 9.99,
            "price_unit": "2-pack Medium",
            "image_url": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "dog",
            "product_category": "toys",
            "attributes": {
                "size_suitability": ["small", "medium", "large"],
                "material": "rubber",
                "features": ["high bounce", "floats", "bright colors"],
                "activity": "fetch"
            }
        },
        {
            "name": "Outward Hound Hide-A-Squirrel Puzzle Toy",
            "brand": "Outward Hound",
            "description": "Interactive puzzle plush toy that keeps dogs busy and engaged. Comes with squeaky squirrels.",
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
                "pieces": "4 squirrels included"
            }
        },
        # Grooming (2 new products)
        {
            "name": "FURminator deShedding Tool",
            "brand": "FURminator",
            "description": "Reduces shedding up to 90%. Reaches beneath topcoat to remove loose hair and undercoat.",
            "price": 39.99,
            "price_unit": "Large Dog - Short Hair",
            "image_url": "https://images.unsplash.com/photo-1544568100-847a948585b9?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "dog",
            "product_category": "grooming",
            "attributes": {
                "size_suitability": ["large"],
                "coat_type": "short hair",
                "features": ["stainless steel edge", "ergonomic handle", "FURejector button"],
                "use": "weekly brushing"
            }
        },
        {
            "name": "Earthbath Oatmeal & Aloe Pet Shampoo",
            "brand": "Earthbath",
            "description": "Soap-free shampoo for dogs with itchy, dry skin. pH-balanced and gentle.",
            "price": 16.99,
            "price_unit": "16 oz",
            "image_url": "https://images.unsplash.com/photo-1600077106724-946750eeaf8c?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "dog",
            "product_category": "grooming",
            "attributes": {
                "skin_type": ["sensitive", "dry", "itchy"],
                "key_ingredients": ["colloidal oatmeal", "aloe vera", "vitamin E"],
                "features": ["soap-free", "pH-balanced", "vanilla & almond scent"],
                "safe_for": "puppies 6+ weeks"
            }
        },
    ]
    
    # ============= CAT PRODUCTS (15) =============
    cat_products = [
        # Food (5 products)
        {
            "name": "Indoor Health Adult Cat Food",
            "brand": "Blue Buffalo",
            "description": "Natural ingredients with chicken, for healthy weight and hairball control.",
            "price": 24.98,
            "price_unit": "15 lb bag",
            "image_url": "https://images.unsplash.com/photo-1589883661923-6476cd823f67?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "cat",
            "product_category": "food",
            "attributes": {
                "life_stage": ["adult"],
                "primary_protein": "chicken",
                "grain_free": False,
                "ingredients": {
                    "full_list": ["deboned chicken", "chicken meal", "brown rice", "barley", "pea fiber"],
                    "allergens": ["chicken", "rice", "barley"]
                },
                "nutrition": {
                    "protein_pct": 32,
                    "fat_pct": 15,
                    "fiber_pct": 7,
                    "calories_per_cup": 391
                }
            }
        },
        # Litter (3 new products)
        {
            "name": "Dr. Elsey's Ultra Precious Cat Litter",
            "brand": "Dr. Elsey's",
            "description": "99.9% dust-free premium clumping litter with superior odor control. Perfect for multi-cat homes.",
            "price": 19.99,
            "price_unit": "40 lb bag",
            "image_url": "https://images.unsplash.com/photo-1573865526739-10c1deaeecfa?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "cat",
            "product_category": "litter",
            "attributes": {
                "type": "clay clumping",
                "features": ["99.9% dust-free", "hard clumping", "low tracking", "unscented"],
                "weight": "40 lbs",
                "ideal_for": "multi-cat homes"
            }
        },
        {
            "name": "World's Best Cat Litter - Multi-Cat",
            "brand": "World's Best",
            "description": "Natural corn-based litter that clumps tight and controls odor naturally. Flushable and septic safe.",
            "price": 24.99,
            "price_unit": "28 lb bag",
            "image_url": "https://images.unsplash.com/photo-1572183459734-37e60dd2714f?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "cat",
            "product_category": "litter",
            "attributes": {
                "type": "natural corn",
                "features": ["flushable", "septic safe", "quick clumping", "natural odor control"],
                "weight": "28 lbs",
                "eco_friendly": True
            }
        },
        {
            "name": "PetSafe ScoopFree Self-Cleaning Litter Box",
            "brand": "PetSafe",
            "description": "Automatic self-cleaning litter box with crystal litter. Hands-free cleanup for weeks.",
            "price": 179.95,
            "price_unit": "Complete kit",
            "image_url": "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500&h=500&fit=crop",
            "rating": 4.5,
            "pet_type": "cat",
            "product_category": "litter",
            "attributes": {
                "type": "automatic litter box",
                "features": ["self-cleaning", "health counter", "leak protection", "low tracking"],
                "litter_type": "crystal",
                "cleaning_schedule": "hands-free for weeks"
            }
        },
        # Toys (3 new products)
        {
            "name": "Yeowww! Catnip Banana",
            "brand": "Yeowww!",
            "description": "100% organic catnip in a fun banana shape. No added ingredients or fillers.",
            "price": 7.99,
            "price_unit": "Single toy",
            "image_url": "https://images.unsplash.com/photo-1611003228941-98852ba62227?w=500&h=500&fit=crop",
            "rating": 4.9,
            "pet_type": "cat",
            "product_category": "toys",
            "attributes": {
                "material": "durable cotton twill",
                "catnip": "100% organic",
                "size": "7 inches",
                "features": ["no stuffing", "no chemicals", "handmade in USA"]
            }
        },
        {
            "name": "Catit Senses 2.0 Ball Dome",
            "brand": "Catit",
            "description": "Interactive toy that stimulates cats' senses. Illuminated ball peaks curiosity.",
            "price": 12.99,
            "price_unit": "Single unit",
            "image_url": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "cat",
            "product_category": "toys",
            "attributes": {
                "type": "interactive",
                "features": ["motion-activated light", "peek-a-boo openings", "non-slip base"],
                "batteries": "included",
                "activity": "mental stimulation"
            }
        },
        {
            "name": "SmartyKat Hot Pursuit Electronic Toy",
            "brand": "SmartyKat",
            "description": "Concealed electronic motion toy with feathers and lights. Erratic movements mimic prey.",
            "price": 19.99,
            "price_unit": "Single toy",
            "image_url": "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=500&h=500&fit=crop",
            "rating": 4.5,
            "pet_type": "cat",
            "product_category": "toys",
            "attributes": {
                "type": "electronic",
                "features": ["4 speed settings", "auto-shutoff", "feather attachment", "LED lights"],
                "batteries": "4 AA (not included)",
                "activity": "exercise and play"
            }
        },
    ]
    
    # ============= BIRD PRODUCTS (10) =============
    bird_products = [
        {
            "name": "Nutriberries Parrot Food",
            "brand": "Lafeber",
            "description": "Nutritionally complete parrot food with natural colors, vitamins, and minerals. No artificial preservatives.",
            "price": 22.99,
            "price_unit": "12.5 oz",
            "image_url": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "bird",
            "product_category": "food",
            "attributes": {
                "bird_type": ["parrot", "macaw", "cockatoo"],
                "features": ["complete nutrition", "natural ingredients", "hulled seeds"],
                "form": "berry shaped pellets",
                "no_artificial": True
            }
        },
        {
            "name": "Roudybush Daily Maintenance Pellets",
            "brand": "Roudybush",
            "description": "Premium steam pelleted bird food. Complete and balanced nutrition for adult birds.",
            "price": 18.99,
            "price_unit": "25 lb bag",
            "image_url": "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "bird",
            "product_category": "food",
            "attributes": {
                "bird_type": ["parakeet", "cockatiel", "conure"],
                "features": ["steam pelleted", "complete nutrition", "no artificial colors"],
                "pellet_size": "small",
                "life_stage": "adult maintenance"
            }
        },
        {
            "name": "Java Wood Play Stand",
            "brand": "Prevue Pet",
            "description": "Natural java wood perch and play stand. Multiple perch levels for climbing and playing.",
            "price": 89.99,
            "price_unit": "Medium size",
            "image_url": "https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "bird",
            "product_category": "toys",
            "attributes": {
                "material": "natural java wood",
                "bird_type": ["medium to large parrots"],
                "features": ["multiple perches", "heavy duty cups", "rolling base"],
                "dimensions": "18x18x36 inches"
            }
        },
        {
            "name": "Bonka Bird Toys Foraging Wall",
            "brand": "Bonka Bird",
            "description": "Interactive foraging toy that encourages natural behaviors. Fill with treats for mental stimulation.",
            "price": 24.99,
            "price_unit": "Single toy",
            "image_url": "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "bird",
            "product_category": "toys",
            "attributes": {
                "type": "foraging toy",
                "bird_type": ["medium parrots"],
                "features": ["interactive", "fill with treats", "bright colors"],
                "material": "bird-safe plastic and wood"
            }
        },
    ]
    
    # ============= FISH PRODUCTS (8) =============
    fish_products = [
        {
            "name": "Tetra Min Tropical Flakes",
            "brand": "Tetra",
            "description": "Nutritionally balanced fish food for all tropical fish. Clean and clear water formula.",
            "price": 7.99,
            "price_unit": "2.2 oz",
            "image_url": "https://images.unsplash.com/photo-1520990053419-6e5faa65c6f5?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "fish",
            "product_category": "food",
            "attributes": {
                "fish_type": ["tropical fish", "goldfish"],
                "form": "flakes",
                "features": ["vitamin C boost", "clear water formula", "daily feeding"],
                "ingredients": ["fish meal", "wheat gluten", "spirulina"]
            }
        },
        {
            "name": "API Betta Pellets",
            "brand": "API",
            "description": "Nutritionally complete pellets specifically for betta fish. Enhances color naturally.",
            "price": 5.99,
            "price_unit": "1.5 oz",
            "image_url": "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "fish",
            "product_category": "food",
            "attributes": {
                "fish_type": ["betta"],
                "form": "floating pellets",
                "features": ["color enhancing", "high protein", "complete nutrition"],
                "feeding": "2-3 times daily"
            }
        },
        {
            "name": "Aqueon Aquarium Water Changer",
            "brand": "Aqueon",
            "description": "Complete water change system. No buckets, no spills, no stress.",
            "price": 29.99,
            "price_unit": "25 ft hose",
            "image_url": "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "fish",
            "product_category": "accessories",
            "attributes": {
                "type": "water changer",
                "features": ["switches from drain to fill", "no heavy lifting", "stress-free"],
                "hose_length": "25 feet",
                "tank_size": "up to 100 gallons"
            }
        },
        {
            "name": "Seachem Prime Water Conditioner",
            "brand": "Seachem",
            "description": "Complete and concentrated conditioner for both fresh and salt water. Removes chlorine and chloramine.",
            "price": 12.99,
            "price_unit": "500 ml",
            "image_url": "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=500&h=500&fit=crop",
            "rating": 4.9,
            "pet_type": "fish",
            "product_category": "accessories",
            "attributes": {
                "type": "water conditioner",
                "features": ["removes chlorine", "detoxifies ammonia", "concentrated formula"],
                "treats": "up to 5000 gallons",
                "safe_for": "all aquatic life"
            }
        },
    ]
    
    # ============= RABBIT & SMALL PETS (8) =============
    small_pet_products = [
        {
            "name": "Oxbow Essentials Bunny Basics Timothy Pellets",
            "brand": "Oxbow",
            "description": "Uniform pellets made from Timothy hay. Complete and balanced nutrition for adult rabbits.",
            "price": 21.99,
            "price_unit": "10 lb bag",
            "image_url": "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "rabbit",
            "product_category": "food",
            "attributes": {
                "animal_type": ["rabbit"],
                "hay_type": "timothy",
                "features": ["uniform pellets", "high fiber", "no artificial preservatives"],
                "life_stage": "adult",
                "protein_pct": 14
            }
        },
        {
            "name": "Kaytee Clean & Cozy Small Pet Bedding",
            "brand": "Kaytee",
            "description": "99.9% dust-free paper bedding. Super absorbent and odor control for up to 14 days.",
            "price": 19.99,
            "price_unit": "1000 cubic inches",
            "image_url": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "rabbit",
            "product_category": "accessories",
            "attributes": {
                "animal_type": ["rabbit", "guinea pig", "hamster"],
                "material": "paper",
                "features": ["99.9% dust-free", "odor control", "2x more absorbent"],
                "color": "white",
                "expands": "2.5x volume"
            }
        },
        {
            "name": "Living World Deluxe Habitat",
            "brand": "Living World",
            "description": "Large habitat for rabbits and guinea pigs. Deep base for bedding and includes accessories.",
            "price": 89.99,
            "price_unit": "X-Large",
            "image_url": "https://images.unsplash.com/photo-1548481899-acd79defbd72?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "rabbit",
            "product_category": "accessories",
            "attributes": {
                "animal_type": ["rabbit", "guinea pig"],
                "dimensions": "47 x 22.8 x 19.9 inches",
                "features": ["deep base", "hay guard", "top opening", "accessories included"],
                "includes": ["water bottle", "food dish", "hay guard"]
            }
        },
    ]
    
    # ============= HUMAN SUPPLEMENTS (15) =============
    supplement_products = [
        {
            "name": "Vitamin D3 5000 IU",
            "brand": "Nature Made",
            "description": "High potency vitamin D3 for bone and immune health. USP verified for purity and potency.",
            "price": 15.99,
            "price_unit": "220 softgels",
            "image_url": "https://images.unsplash.com/photo-1550572017-4454c04d7ae4?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "human",
            "product_category": "supplements",
            "attributes": {
                "type": "vitamin",
                "key_ingredients": ["vitamin D3 (cholecalciferol)"],
                "benefits": ["bone health", "immune support", "muscle function"],
                "dosage": "1 softgel daily",
                "certifications": ["USP verified", "gluten-free"],
                "form": "softgel"
            }
        },
        {
            "name": "Omega-3 Fish Oil 1000mg",
            "brand": "Nordic Naturals",
            "description": "Premium omega-3 fish oil for heart and brain health. Third-party tested for purity.",
            "price": 29.99,
            "price_unit": "120 softgels",
            "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "human",
            "product_category": "supplements",
            "attributes": {
                "type": "omega-3",
                "key_ingredients": ["EPA 325mg", "DHA 225mg"],
                "benefits": ["heart health", "brain function", "joint support"],
                "dosage": "2 softgels daily",
                "certifications": ["third-party tested", "non-GMO"],
                "form": "softgel"
            }
        },
        {
            "name": "Probiotic 40 Billion CFU",
            "brand": "Garden of Life",
            "description": "High-potency probiotic with 40 billion cultures. Supports digestive and immune health.",
            "price": 39.99,
            "price_unit": "30 capsules",
            "image_url": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "human",
            "product_category": "supplements",
            "attributes": {
                "type": "probiotic",
                "key_ingredients": ["40 billion CFU", "16 probiotic strains", "prebiotic fiber"],
                "benefits": ["digestive health", "immune support", "gut balance"],
                "dosage": "1 capsule daily",
                "certifications": ["organic", "gluten-free", "dairy-free"],
                "form": "vegetarian capsule"
            }
        },
        {
            "name": "Multivitamin for Men",
            "brand": "One A Day",
            "description": "Complete multivitamin formulated to support men's health concerns. Energy and immune support.",
            "price": 18.99,
            "price_unit": "200 tablets",
            "image_url": "https://images.unsplash.com/photo-1571689935783-99faa51a0e1f?w=500&h=500&fit=crop",
            "rating": 4.5,
            "pet_type": "human",
            "product_category": "supplements",
            "attributes": {
                "type": "multivitamin",
                "gender": "men",
                "key_ingredients": ["vitamins A, C, D, E, K", "B vitamins", "zinc", "magnesium"],
                "benefits": ["energy", "heart health", "immune support"],
                "dosage": "1 tablet daily",
                "form": "tablet"
            }
        },
        {
            "name": "Collagen Peptides Powder",
            "brand": "Vital Proteins",
            "description": "Grass-fed collagen peptides for hair, skin, nails, and joint health. Unflavored and easily digestible.",
            "price": 43.00,
            "price_unit": "20 oz",
            "image_url": "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "human",
            "product_category": "supplements",
            "attributes": {
                "type": "collagen",
                "key_ingredients": ["grass-fed bovine collagen", "20g protein per serving"],
                "benefits": ["hair growth", "skin elasticity", "joint support", "nail strength"],
                "dosage": "1-2 scoops daily",
                "certifications": ["grass-fed", "paleo friendly"],
                "form": "powder"
            }
        },
        {
            "name": "Magnesium Glycinate 400mg",
            "brand": "Doctor's Best",
            "description": "Highly absorbable magnesium for muscle relaxation, sleep, and heart health.",
            "price": 19.99,
            "price_unit": "240 tablets",
            "image_url": "https://images.unsplash.com/photo-1628771065518-0d82f1d61a4d?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "human",
            "product_category": "supplements",
            "attributes": {
                "type": "mineral",
                "key_ingredients": ["magnesium glycinate 400mg"],
                "benefits": ["muscle relaxation", "sleep quality", "heart health", "bone strength"],
                "dosage": "2 tablets daily",
                "form": "tablet",
                "absorption": "high bioavailability"
            }
        },
    ]
    
    # ============= HUMAN SHOES/APPAREL (12) =============
    apparel_products = [
        {
            "name": "Nike Air Max 270 Running Shoes",
            "brand": "Nike",
            "description": "Men's running shoes with Max Air cushioning. Lightweight and breathable for all-day comfort.",
            "price": 150.00,
            "price_unit": "Pair",
            "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "human",
            "product_category": "shoes",
            "attributes": {
                "type": "running shoes",
                "gender": "men",
                "features": ["Max Air cushioning", "breathable mesh", "durable outsole"],
                "activity": ["running", "casual wear"],
                "available_sizes": ["7-13"],
                "colors": ["black/white", "navy/orange"]
            }
        },
        {
            "name": "Adidas Ultraboost 22 Women's",
            "brand": "Adidas",
            "description": "Women's performance running shoes with responsive BOOST cushioning. Primeknit upper for comfort.",
            "price": 180.00,
            "price_unit": "Pair",
            "image_url": "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500&h=500&fit=crop",
            "rating": 4.8,
            "pet_type": "human",
            "product_category": "shoes",
            "attributes": {
                "type": "running shoes",
                "gender": "women",
                "features": ["BOOST cushioning", "Primeknit upper", "Continental rubber outsole"],
                "activity": ["running", "training"],
                "available_sizes": ["5-11"],
                "colors": ["white/pink", "black/purple"]
            }
        },
        {
            "name": "New Balance 990v5 Made in USA",
            "brand": "New Balance",
            "description": "Premium sneakers made in USA with ENCAP midsole technology. Classic style meets modern comfort.",
            "price": 185.00,
            "price_unit": "Pair",
            "image_url": "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&h=500&fit=crop",
            "rating": 4.9,
            "pet_type": "human",
            "product_category": "shoes",
            "attributes": {
                "type": "lifestyle sneakers",
                "gender": "unisex",
                "features": ["Made in USA", "ENCAP midsole", "pigskin/mesh upper"],
                "activity": ["casual wear", "walking"],
                "available_sizes": ["4-15"],
                "made_in": "USA"
            }
        },
        {
            "name": "Hoka Bondi 8 Maximum Cushion",
            "brand": "Hoka",
            "description": "Maximum cushioned running shoes for ultimate comfort. Ideal for long distances and recovery runs.",
            "price": 165.00,
            "price_unit": "Pair",
            "image_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "human",
            "product_category": "shoes",
            "attributes": {
                "type": "max cushion running shoes",
                "gender": "unisex",
                "features": ["maximum cushioning", "Meta-Rocker geometry", "breathable mesh"],
                "activity": ["long distance running", "recovery"],
                "available_sizes": ["5-14"],
                "cushion_level": "maximum"
            }
        },
        {
            "name": "Allbirds Tree Runners Eco-Friendly",
            "brand": "Allbirds",
            "description": "Sustainable running shoes made from eucalyptus tree fiber. Light, cool, and machine washable.",
            "price": 98.00,
            "price_unit": "Pair",
            "image_url": "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&h=500&fit=crop",
            "rating": 4.6,
            "pet_type": "human",
            "product_category": "shoes",
            "attributes": {
                "type": "eco-friendly runners",
                "gender": "unisex",
                "features": ["eucalyptus tree fiber", "machine washable", "carbon neutral"],
                "activity": ["running", "everyday wear"],
                "available_sizes": ["5-14"],
                "sustainability": "carbon neutral"
            }
        },
        {
            "name": "On Cloud 5 Lightweight Sneakers",
            "brand": "On",
            "description": "Swiss-engineered running shoes with CloudTec cushioning. Lightweight and responsive.",
            "price": 139.99,
            "price_unit": "Pair",
            "image_url": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
            "rating": 4.7,
            "pet_type": "human",
            "product_category": "shoes",
            "attributes": {
                "type": "running shoes",
                "gender": "unisex",
                "features": ["CloudTec cushioning", "speed lacing", "lightweight"],
                "activity": ["running", "training"],
                "available_sizes": ["5-13"],
                "weight": "8.5 oz"
            }
        },
    ]
    
    # Combine all products
    all_products = (
        dog_products + cat_products + bird_products + 
        fish_products + small_pet_products + 
        supplement_products + apparel_products
    )
    
    # Clear existing recommendations and products to avoid foreign key violations
    db.query(Recommendation).delete()
    db.query(Product).delete()
    db.commit()
    
    for product_data in all_products:
        product = Product(**product_data)
        db.add(product)
    
    db.commit()
    print(f"✅ Seeded {len(all_products)} products with categories")
    print(f"   - Dog products: {len(dog_products)}")
    print(f"   - Cat products: {len(cat_products)}")
    print(f"   - Bird products: {len(bird_products)}")
    print(f"   - Fish products: {len(fish_products)}")
    print(f"   - Small pet products: {len(small_pet_products)}")
    print(f"   - Supplements: {len(supplement_products)}")
    print(f"   - Shoes/Apparel: {len(apparel_products)}")
    db.close()


if __name__ == "__main__":
    seed_products()