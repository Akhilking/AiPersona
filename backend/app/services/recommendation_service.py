"""
Recommendation Service
Handles product filtering, scoring, and AI-powered recommendations
"""

from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Dict
from datetime import datetime, timedelta

from app.models import Profile, Product, Recommendation
from app.services.profile_service import ProfileService
from app.services.product_service import ProductService
from app.services.ai_service import AIService
from app.schemas import RecommendationResponse, RecommendationItem, ComparisonResponse


class RecommendationService:
    def __init__(self, db: Session):
        self.db = db
        self.profile_service = ProfileService(db)
        self.product_service = ProductService(db)
        self.ai_service = AIService()
    
    async def generate_recommendations(
        self,
        profile_id: UUID,
        limit: int = 10,
        force_refresh: bool = False
    ) -> RecommendationResponse:
        """
        Generate personalized product recommendations with caching
        
        Uses cached recommended_product_ids to avoid AI calls on every page load.
        Only generates new recommendations if:
        1. force_refresh=True
        2. No cached product IDs exist
        3. Cache is older than 7 days
        """
        # Get profile
        profile = self.profile_service.get_profile(profile_id)
        if not profile:
            raise ValueError("Profile not found")
        
        # Check if we can use cached product IDs
        cache_age_days = 7
        can_use_cache = (
            not force_refresh
            and profile.recommended_product_ids
            and profile.recommendations_generated_at
            and (datetime.utcnow() - profile.recommendations_generated_at).days < cache_age_days
        )
        
        if can_use_cache:
            # Use cached product IDs - NO AI CALLS!
            print(f"✅ Using cached recommendations for {profile.name} (generated {profile.recommendations_generated_at})")
            
            # Get products by cached IDs
            product_ids = [UUID(pid) for pid in profile.recommended_product_ids[:limit]]
            recommended_products = self.product_service.get_products_by_ids(product_ids)
            
            # Get cached recommendation details (from Recommendation table)
            recommendation_items = []
            
            for product in recommended_products:
                # Get from cache (already exists)
                rec_item = await self._get_or_create_recommendation(
                    profile, 
                    product,
                    force_refresh=False  # Use cache
                )
                recommendation_items.append(rec_item)
            
            # Sort by match score
            recommendation_items.sort(key=lambda x: x.match_score, reverse=True)
            
            return RecommendationResponse(
                profile=profile,
                recommendations=recommendation_items,
                total_safe_products=len(recommended_products),
                total_filtered_out=0,  # Unknown when using cache
                generated_at=profile.recommendations_generated_at
            )
        
        # Need to regenerate recommendations
        print(f"🤖 Generating NEW recommendations for {profile.name} (AI calls required)")
        
        # Get all products for category
        all_products = self.product_service.list_products(
            pet_type=profile.profile_category,
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
            recommended_ids.append(str(product.id))
        
        # Sort by match score
        recommendation_items.sort(key=lambda x: x.match_score, reverse=True)
        
        # Update sorted IDs based on match score
        recommended_ids = [str(rec.product.id) for rec in recommendation_items]
        
        # 💾 Save recommended product IDs to profile cache
        profile.recommended_product_ids = recommended_ids
        profile.recommendations_generated_at = datetime.utcnow()
        self.db.commit()
        
        print(f"💾 Cached {len(recommended_ids)} product IDs for {profile.name}")
        
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
        """
        Compare 2-4 products with AI analysis
        """
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
        products_dict = [self._product_to_dict(p) for p in products]
        recs_dict = [self._rec_item_to_dict(r) for r in recommendation_items]
        
        comparison_result = await self.ai_service.generate_comparison_summary(
            profile=self._profile_to_dict(profile),
            products=products_dict,
            recommendations=recs_dict
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
        profile: Profile,
        product: Product,
        force_refresh: bool = False
    ) -> RecommendationItem:
        """
        Get cached recommendation or generate new one
        """
        # Check cache
        if not force_refresh:
            cached = self.db.query(Recommendation).filter(
                Recommendation.profile_id == profile.id,
                Recommendation.product_id == product.id
            ).first()
            
            if cached and (not cached.expires_at or cached.expires_at > datetime.utcnow()):
                return RecommendationItem(
                    product=product,
                    is_safe=cached.is_safe,
                    match_score=cached.match_score,
                    explanation=cached.explanation,
                    pros=cached.pros,
                    cons=cached.cons,
                    generated_at=cached.generated_at
                )
        
        # Generate new recommendation
        ai_result = await self.ai_service.generate_product_recommendation(
            profile=self._profile_to_dict(profile),
            product=self._product_to_dict(product)
        )
        
        # Save to cache
        recommendation = Recommendation(
            profile_id=profile.id,
            product_id=product.id,
            is_safe=True,  # Already filtered
            match_score=ai_result["match_score"],
            explanation=ai_result["explanation"],
            pros=ai_result["pros"],
            cons=ai_result["cons"],
            expires_at=datetime.utcnow() + timedelta(days=30),
            ai_provider=self.ai_service.provider
        )
        
        # Update or insert
        existing = self.db.query(Recommendation).filter(
            Recommendation.profile_id == profile.id,
            Recommendation.product_id == product.id
        ).first()
        
        if existing:
            for key, value in recommendation.__dict__.items():
                if key != "_sa_instance_state":
                    setattr(existing, key, value)
            recommendation = existing
        else:
            self.db.add(recommendation)
        
        self.db.commit()
        self.db.refresh(recommendation)
        
        return RecommendationItem(
            product=product,
            is_safe=recommendation.is_safe,
            match_score=recommendation.match_score,
            explanation=recommendation.explanation,
            pros=recommendation.pros,
            cons=recommendation.cons,
            generated_at=recommendation.generated_at
        )
    
    def _check_product_safety(self, profile: Profile, product: Product) -> tuple[bool, List[str]]:
        """
        Check if product is safe for profile
        Returns (is_safe, reasons)
        """
        reasons = []
        attributes = product.attributes or {}
        ingredients = attributes.get("ingredients", {})
        
        # Check allergens
        profile_allergies = [a.lower() for a in (profile.allergies or [])]
        product_allergens = [a.lower() for a in ingredients.get("allergens", [])]
        
        # Check hidden allergens
        hidden_allergens = [a.lower() for a in ingredients.get("contains", [])]
        all_product_allergens = set(product_allergens + hidden_allergens)
        
        for allergen in profile_allergies:
            if any(allergen in pa for pa in all_product_allergens):
                reasons.append(f"Contains {allergen} allergen")
                return False, reasons
        
        # Check age appropriateness
        life_stages = attributes.get("life_stage", [])
        if life_stages:
            age = profile.age_years
            if age < 1 and "puppy" not in [s.lower() for s in life_stages]:
                reasons.append("Not formulated for puppies")
                return False, reasons
            elif age >= 7 and "senior" in [s.lower() for s in life_stages]:
                pass  # Senior food is fine
            elif age >= 1 and age < 7 and "adult" not in [s.lower() for s in life_stages] and "all_life_stages" not in [s.lower() for s in life_stages]:
                reasons.append("Not formulated for adult dogs")
                return False, reasons
        
        # Check size appropriateness
        if profile.size_category:
            size_suitability = [s.lower() for s in attributes.get("size_suitability", [])]
            if size_suitability and profile.size_category.lower() not in size_suitability and "all_sizes" not in size_suitability:
                reasons.append(f"Not optimized for {profile.size_category} dogs")
                # Not critical, just note it
        
        return True, reasons
    
    @staticmethod
    def _profile_to_dict(profile: Profile) -> Dict:
        """Convert profile to dict for AI service"""
        return {
            "id": str(profile.id),
            "name": profile.name,
            "profile_category": profile.profile_category,  # 🆕 Add this
            "pet_type": profile.pet_type or profile.profile_category,  # 🆕 Fallback
            "age_years": profile.age_years,
            "weight_lbs": profile.weight_lbs,
            "size_category": profile.size_category,
            "allergies": profile.allergies or [],
            "health_conditions": profile.health_conditions or [],
            "preferences": profile.preferences or {}
        }
    
    @staticmethod
    def _product_to_dict(product: Product) -> Dict:
        """Convert product to dict for AI service"""
        return {
            "id": str(product.id),
            "name": product.name,
            "brand": product.brand,
            "description": product.description,
            "price": product.price,
            "price_unit": product.price_unit,
            "pet_type": product.pet_type,
            "attributes": product.attributes or {}
        }
    
    @staticmethod
    def _rec_item_to_dict(item: RecommendationItem) -> Dict:
        """Convert recommendation item to dict"""
        return {
            "match_score": item.match_score,
            "pros": item.pros,
            "cons": item.cons
        }
