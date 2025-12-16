"""
Profile Templates for Quick Setup
"""

PROFILE_TEMPLATES = {
    "dog": {
        "name": "Dog Profiles",
        "icon": "🐕",
        "presets": [
            {
                "id": "small-puppy",
                "name": "Small Breed Puppy",
                "description": "For puppies under 20 lbs, 0-1 year",
                "defaults": {
                    "profile_category": "dog",
                    "age_years": 0.5,
                    "weight_lbs": 10,
                    "size_category": "small",
                    "allergies": [],
                    "health_conditions": [],
                    "preferences": {
                        "life_stage": "puppy",
                        "grain_free": False,
                        "price_range": "mid"
                    },
                    "profile_data": {
                        "activity_level": "high",
                        "breed_size": "small"
                    }
                }
            },
            {
                "id": "adult-dog-allergies",
                "name": "Adult Dog with Allergies",
                "description": "For adult dogs with common food sensitivities",
                "defaults": {
                    "profile_category": "dog",
                    "age_years": 4,
                    "weight_lbs": 50,
                    "size_category": "medium",
                    "allergies": ["chicken", "beef"],
                    "health_conditions": ["sensitive_stomach"],
                    "preferences": {
                        "grain_free": True,
                        "price_range": "mid"
                    },
                    "profile_data": {
                        "activity_level": "moderate"
                    }
                }
            },
            {
                "id": "senior-large-dog",
                "name": "Senior Large Breed",
                "description": "For large dogs 7+ years, joint support needed",
                "defaults": {
                    "profile_category": "dog",
                    "age_years": 8,
                    "weight_lbs": 80,
                    "size_category": "large",
                    "allergies": [],
                    "health_conditions": ["joint_issues"],
                    "preferences": {
                        "grain_free": False,
                        "price_range": "high"
                    },
                    "profile_data": {
                        "activity_level": "low",
                        "special_needs": ["joint_support", "lower_calories"]
                    }
                }
            }
        ]
    },
    "cat": {
        "name": "Cat Profiles",
        "icon": "🐈",
        "presets": [
            {
                "id": "kitten",
                "name": "Kitten",
                "description": "For kittens under 1 year old",
                "defaults": {
                    "profile_category": "cat",
                    "age_years": 0.5,
                    "weight_lbs": 5,
                    "size_category": "small",
                    "allergies": [],
                    "health_conditions": [],
                    "preferences": {
                        "wet_food": True,
                        "price_range": "mid"
                    },
                    "profile_data": {
                        "indoor": True,
                        "activity_level": "high"
                    }
                }
            },
            {
                "id": "indoor-adult-cat",
                "name": "Indoor Adult Cat",
                "description": "For indoor adult cats 1-7 years",
                "defaults": {
                    "profile_category": "cat",
                    "age_years": 3,
                    "weight_lbs": 10,
                    "size_category": "medium",
                    "allergies": [],
                    "health_conditions": [],
                    "preferences": {
                        "hairball_control": True,
                        "price_range": "mid"
                    },
                    "profile_data": {
                        "indoor": True,
                        "activity_level": "moderate"
                    }
                }
            },
            {
                "id": "senior-cat",
                "name": "Senior Cat",
                "description": "For cats 7+ years, kidney health focus",
                "defaults": {
                    "profile_category": "cat",
                    "age_years": 10,
                    "weight_lbs": 9,
                    "size_category": "medium",
                    "allergies": [],
                    "health_conditions": ["kidney_health"],
                    "preferences": {
                        "wet_food": True,
                        "price_range": "high"
                    },
                    "profile_data": {
                        "indoor": True,
                        "activity_level": "low",
                        "special_needs": ["kidney_support", "lower_protein"]
                    }
                }
            }
        ]
    },
    "baby": {
        "name": "Baby Profiles",
        "icon": "👶",
        "presets": [
            {
                "id": "newborn",
                "name": "Newborn (0-3 months)",
                "description": "For newborns, formula/bottle focus",
                "defaults": {
                    "profile_category": "baby",
                    "age_years": 0.1,
                    "weight_lbs": 10,
                    "allergies": [],
                    "health_conditions": [],
                    "preferences": {
                        "organic": True,
                        "price_range": "mid"
                    },
                    "profile_data": {
                        "feeding_type": "formula",
                        "concerns": [],
                        "age_months": 2
                    }
                }
            },
            {
                "id": "baby-allergies",
                "name": "Baby with Allergies",
                "description": "For babies with dairy/soy sensitivities",
                "defaults": {
                    "profile_category": "baby",
                    "age_years": 0.5,
                    "weight_lbs": 15,
                    "allergies": ["dairy", "soy"],
                    "health_conditions": ["eczema"],
                    "preferences": {
                        "hypoallergenic": True,
                        "price_range": "high"
                    },
                    "profile_data": {
                        "feeding_type": "specialized_formula",
                        "concerns": ["reflux", "eczema"],
                        "age_months": 6
                    }
                }
            },
            {
                "id": "toddler",
                "name": "Toddler (1-3 years)",
                "description": "For toddlers transitioning to solid foods",
                "defaults": {
                    "profile_category": "baby",
                    "age_years": 2,
                    "weight_lbs": 25,
                    "allergies": [],
                    "health_conditions": [],
                    "preferences": {
                        "organic": True,
                        "price_range": "mid"
                    },
                    "profile_data": {
                        "feeding_type": "mixed",
                        "concerns": [],
                        "age_months": 24,
                        "dietary_needs": ["calcium", "iron"]
                    }
                }
            }
        ]
    },
    "human": {
        "name": "Adult Profiles",
        "icon": "👤",
        "presets": [
            {
                "id": "fitness-enthusiast",
                "name": "Fitness Enthusiast",
                "description": "For active adults focused on fitness",
                "defaults": {
                    "profile_category": "human",
                    "age_years": 30,
                    "weight_lbs": 160,
                    "allergies": [],
                    "health_conditions": [],
                    "preferences": {
                        "dietary_preference": "high_protein",
                        "price_range": "mid"
                    },
                    "profile_data": {
                        "fitness_goal": "muscle_gain",
                        "activity_level": "very_high",
                        "dietary_restrictions": []
                    }
                }
            },
            {
                "id": "vegan-lifestyle",
                "name": "Vegan Lifestyle",
                "description": "For plant-based diet followers",
                "defaults": {
                    "profile_category": "human",
                    "age_years": 28,
                    "weight_lbs": 140,
                    "allergies": [],
                    "health_conditions": [],
                    "preferences": {
                        "dietary_preference": "vegan",
                        "organic": True,
                        "price_range": "high"
                    },
                    "profile_data": {
                        "fitness_goal": "maintain",
                        "activity_level": "moderate",
                        "dietary_restrictions": ["meat", "dairy", "eggs"]
                    }
                }
            },
            {
                "id": "health-conscious-senior",
                "name": "Health-Conscious Senior",
                "description": "For seniors focused on heart health",
                "defaults": {
                    "profile_category": "human",
                    "age_years": 65,
                    "weight_lbs": 170,
                    "allergies": [],
                    "health_conditions": ["heart_health", "diabetes"],
                    "preferences": {
                        "dietary_preference": "low_sodium",
                        "organic": True,
                        "price_range": "high"
                    },
                    "profile_data": {
                        "fitness_goal": "health_maintenance",
                        "activity_level": "light",
                        "special_needs": ["low_sugar", "heart_healthy"]
                    }
                }
            }
        ]
    }
}


def get_all_templates():
    """Get all profile templates"""
    return PROFILE_TEMPLATES


def get_templates_by_category(category: str):
    """Get templates for a specific category"""
    return PROFILE_TEMPLATES.get(category, {})


def get_preset_by_id(category: str, preset_id: str):
    """Get a specific preset template"""
    category_data = PROFILE_TEMPLATES.get(category, {})
    presets = category_data.get("presets", [])
    return next((p for p in presets if p["id"] == preset_id), None)