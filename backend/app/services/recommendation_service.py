from uuid import UUID
from typing import List, Dict
from datetime import datetime, timedelta
import uuid as uuid_lib

from app.services.profile_service import ProfileService
from app.services.product_service import ProductService
from app.services.ai_service import AIService
from app.schemas import RecommendationResponse, RecommendationItem, ComparisonResponse


class RecommendationService:
    def __init__(self, db):
        self.db = db  # supabase client
        self.profile_service = ProfileService(db)
        self.product_service = ProductService(db)
        self.ai_service = AIService()
    
    async def generate_recommendations(
        self,
        profile_id: UUID,
        limit: int = 10,
        force_refresh: bool = False
    ) -> RecommendationResponse:
        """Generate personalized product recommendations with caching"""
        # Get profile
        profile = self.profile_service.get_profile(profile_id)
        if not profile:
            raise ValueError("Profile not found")
        
        # Check if we can use cached product IDs
        cache_age_days = 7
        recommendations_generated_at = profile.get('recommendations_generated_at')
        can_use_cache = (
            not force_refresh
            and profile.get('recommended_product_ids')
            and recommendations_generated_at
            and (datetime.utcnow() - datetime.fromisoformat(recommendations_generated_at)).days < cache_age_days
        )
        
        if can_use_cache:
            print(f"✅ Using cached recommendations for {profile['name']}")
            
            # Get products by cached IDs
            product_ids = [UUID(pid) for pid in profile['recommended_product_ids'][:limit]]
            recommended_products = self.product_service.get_products_by_ids(product_ids)
            
            # Get cached recommendation details
            recommendation_items = []
            
            for product in recommended_products:
                rec_item = await self._get_or_create_recommendation(
                    profile, 
                    product,
                    force_refresh=False
                )
                recommendation_items.append(rec_item)
            
            recommendation_items.sort(key=lambda x: x.match_score, reverse=True)
            
            return RecommendationResponse(
                profile=profile,
                recommendations=recommendation_items,
                total_safe_products=len(recommended_products),
                total_filtered_out=0,
                generated_at=datetime.fromisoformat(recommendations_generated_at)
            )
        
        # Need to regenerate recommendations
        print(f"🤖 Generating NEW recommendations for {profile['name']}")
        
        # Get all products for category
        all_products = self.product_service.list_products(
            pet_type=profile['profile_category'],
            limit=100
        )
        
        # Filter and score products
        safe_products = []
        filtered_out_count = 0
        
        for product in all_products:
            is_safe, reasons = self._check_product_safety(profile, product)
            if is_safe:
                safe_products.append(product)
            else:
                filtered_out_count += 1
        
        # Generate AI recommendations for top products
        recommendation_items = []
        recommended_ids = []
        
        for product in safe_products[:limit]:
            rec_item = await self._get_or_create_recommendation(
                profile, 
                product,
                force_refresh=force_refresh
            )
            recommendation_items.append(rec_item)
            recommended_ids.append(product['id'])
        
        # Sort by match score
        recommendation_items.sort(key=lambda x: x.match_score, reverse=True)
        
        # Update sorted IDs based on match score
        recommended_ids = [str(rec.product.id) for rec in recommendation_items]
        
        # Save recommended product IDs to profile cache
        update_data = {
            'recommended_product_ids': recommended_ids,
            'recommendations_generated_at': datetime.utcnow().isoformat()
        }
        self.db.table('profiles').update(update_data).eq('id', str(profile_id)).execute()
        
        print(f"💾 Cached {len(recommended_ids)} product IDs for {profile['name']}")
        
        return RecommendationResponse(
            profile=profile,
            recommendations=recommendation_items,
            total_safe_products=len(safe_products),
            total_filtered_out=filtered_out_count,
            generated_at=datetime.utcnow()
        )
    
    async def compare_products(
        self,
        profile_id: UUID,
        product_ids: List[UUID]
    ) -> ComparisonResponse:
        """Compare 2-4 products with AI analysis"""
        if len(product_ids) < 2 or len(product_ids) > 4:
            raise ValueError("Can only compare 2-4 products")
        
        # Get profile
        profile = self.profile_service.get_profile(profile_id)
        if not profile:
            raise ValueError("Profile not found")
        
        # Get products
        products = self.product_service.get_products_by_ids(product_ids)
        if len(products) != len(product_ids):
            raise ValueError("One or more products not found")
        
        # Get individual recommendations
        recommendation_items = []
        for product in products:
            rec_item = await self._get_or_create_recommendation(profile, product)
            recommendation_items.append(rec_item)
        
        # Generate comparison summary
        comparison_result = await self.ai_service.generate_comparison_summary(
            profile=profile,
            products=products,
            recommendations=[{
                'match_score': r.match_score,
                'explanation': r.explanation,
                'pros': r.pros,
                'cons': r.cons
            } for r in recommendation_items]
        )
        
        return ComparisonResponse(
            profile=profile,
            products=products,
            recommendations=recommendation_items,
            comparison_summary=comparison_result["summary"],
            best_choice=UUID(comparison_result["best_choice_id"]) if comparison_result["best_choice_id"] else None,
            generated_at=datetime.utcnow()
        )
        
    async def _get_or_create_recommendation(
        self,
        profile: Dict,
        product: Dict,
        force_refresh: bool = False
    ) -> RecommendationItem:
        """Get cached recommendation or generate new one"""
        # Check cache
        if not force_refresh:
            response = self.db.table('recommendations').select('*').eq(
                'profile_id', profile['id']
            ).eq('product_id', product['id']).execute()
            
            if response.data:
                cached = response.data[0]
                return RecommendationItem(
                    product=product,
                    is_safe=cached['is_safe'],
                    match_score=cached['match_score'],
                    explanation=cached['explanation'],
                    pros=cached['pros'],
                    cons=cached['cons'],
                    generated_at=datetime.fromisoformat(cached['created_at'])
                )
        
        # Generate new recommendation
        try:
            print(f"🔍 Calling AI service for {product['name']}...")
            ai_result = await self.ai_service.generate_product_recommendation(
                profile=profile,
                product=product
            )
            print(f"✅ AI result received: {ai_result}")
        except Exception as e:
            print(f"❌ AI service error: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            raise

        # Save to cache
        recommendation = {
            "id": str(uuid_lib.uuid4()),
            "profile_id": str(profile['id']),  # Ensure string
            "product_id": str(product['id']),  # Ensure string
            "is_safe": True,
            "match_score": int(ai_result["match_score"]),  # Ensure int
            "explanation": str(ai_result["explanation"]),  # Ensure string
            "pros": ai_result["pros"],  # Keep as list
            "cons": ai_result["cons"],  # Keep as list
            "created_at": datetime.utcnow().isoformat()
        }

        print(f"💾 Saving recommendation to database...")
        print(f"   Profile ID: {recommendation['profile_id']}")
        print(f"   Product ID: {recommendation['product_id']}")
        print(f"   Match Score: {recommendation['match_score']}")
        print(f"   Pros: {recommendation['pros']}")
        print(f"   Cons: {recommendation['cons']}")

        try:
            # Check if exists
            existing = self.db.table('recommendations').select('*').eq(
                'profile_id', str(profile['id'])
            ).eq('product_id', str(product['id'])).execute()
            
            if existing.data:
                # Update
                print(f"   Updating existing recommendation {existing.data[0]['id']}...")
                update_result = self.db.table('recommendations').update({
                    k: v for k, v in recommendation.items() if k != 'id'
                }).eq('id', existing.data[0]['id']).execute()
                print(f"✅ Update successful: {update_result}")
            else:
                # Insert
                print(f"   Inserting new recommendation...")
                insert_result = self.db.table('recommendations').insert(recommendation).execute()
                print(f"✅ Insert successful: {insert_result}")
        except Exception as e:
            print(f"❌ Database error: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            raise
        
        return RecommendationItem(
            product=product,
            is_safe=recommendation['is_safe'],
            match_score=recommendation['match_score'],
            explanation=recommendation['explanation'],
            pros=recommendation['pros'],
            cons=recommendation['cons'],
            generated_at=datetime.utcnow()
        )
    def _check_product_safety(self, profile: Dict, product: Dict) -> tuple[bool, List[str]]:
        """Check if product is safe for profile"""
        reasons = []
        attributes = product.get('attributes') or {}
        ingredients = attributes.get("ingredients", {})
        
        # Check allergens
        profile_allergies = [a.lower() for a in (profile.get('allergies') or [])]
        product_allergens = [a.lower() for a in ingredients.get("allergens", [])]
        
        hidden_allergens = [a.lower() for a in ingredients.get("contains", [])]
        all_product_allergens = set(product_allergens + hidden_allergens)
        
        for allergen in profile_allergies:
            if any(allergen in pa for pa in all_product_allergens):
                reasons.append(f"Contains {allergen} allergen")
                return False, reasons
        
        # Check age appropriateness
        life_stages = attributes.get("life_stage", [])
        if life_stages:
            age = profile['age_years']
            if age < 1 and "puppy" not in [s.lower() for s in life_stages]:
                reasons.append("Not formulated for puppies")
                return False, reasons
            elif age >= 7 and "senior" in [s.lower() for s in life_stages]:
                pass
            elif age >= 1 and age < 7 and "adult" not in [s.lower() for s in life_stages] and "all_life_stages" not in [s.lower() for s in life_stages]:
                reasons.append("Not formulated for adult dogs")
                return False, reasons
        
        # Check size appropriateness
        if profile.get('size_category'):
            size_suitability = [s.lower() for s in attributes.get("size_suitability", [])]
            if size_suitability and profile['size_category'].lower() not in size_suitability and "all_sizes" not in size_suitability:
                reasons.append(f"Not optimized for {profile['size_category']} dogs")
        
        return True, reasons