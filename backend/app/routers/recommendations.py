"""
Recommendations API Router - Supabase REST API version
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from uuid import UUID

from app.database import get_db
from app.schemas import (
    RecommendationRequest, 
    RecommendationResponse,
    ComparisonRequest,
    ComparisonResponse
)
from app.services.recommendation_service import RecommendationService

router = APIRouter()


@router.post("/", response_model=RecommendationResponse)
async def get_recommendations(
    request: RecommendationRequest,
    background_tasks: BackgroundTasks,
    db = Depends(get_db)
):
    """
    Get personalized product recommendations for a profile
    
    - Filters unsafe products (allergies, etc.)
    - Scores products based on fit
    - Generates AI explanations, pros/cons
    - Caches results to minimize AI API costs
    """
    service = RecommendationService(db)
    
    try:
        return await service.generate_recommendations(
            profile_id=request.profile_id,
            limit=request.limit,
            force_refresh=request.force_refresh
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")


@router.post("/compare", response_model=ComparisonResponse)
async def compare_products(
    request: ComparisonRequest,
    db = Depends(get_db)
):
    """
    Compare 2-4 products side-by-side with AI analysis
    
    - Shows feature comparison
    - Generates AI summary of which is best for the profile
    - Highlights key differences
    """
    service = RecommendationService(db)
    
    try:
        return await service.compare_products(
            profile_id=request.profile_id,
            product_ids=request.product_ids
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compare products: {str(e)}")