"""
Profile Templates API Router
"""

from fastapi import APIRouter
from app.profile_templates import get_all_templates, get_templates_by_category, get_preset_by_id

router = APIRouter()


@router.get("/")
async def list_all_templates():
    """Get all profile templates grouped by category"""
    return get_all_templates()


@router.get("/{category}")
async def get_category_templates(category: str):
    """Get templates for a specific category"""
    templates = get_templates_by_category(category)
    if not templates:
        return {"error": "Category not found", "available": ["dog", "cat", "baby", "human"]}
    return templates


@router.get("/{category}/{preset_id}")
async def get_preset_template(category: str, preset_id: str):
    """Get a specific preset template"""
    preset = get_preset_by_id(category, preset_id)
    if not preset:
        return {"error": "Preset not found"}
    return preset