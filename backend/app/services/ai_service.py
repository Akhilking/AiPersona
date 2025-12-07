"""
AI Service - Multi-Provider Support (OpenAI, Anthropic, Ollama)
"""

import os
from typing import Dict, List, Optional
from openai import OpenAI
from anthropic import Anthropic
import ollama


class AIService:
    def __init__(self):
        self.provider = os.getenv("AI_PROVIDER", "ollama").lower()
        if self.provider == "openai":
            self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            self.model = "gpt-4o-mini"
        elif self.provider == "anthropic":
            self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
            self.model = "claude-3-5-sonnet-20241022"
        elif self.provider == "ollama":
            self.client = None
            self.model = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
            self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
            print(f"✅ Using LOCAL Ollama model: {self.model}")
        else:
            raise ValueError(f"Unsupported AI provider: {self.provider}")
    
    async def generate_product_recommendation(
        self,
        profile: Dict,
        product: Dict
    ) -> Dict[str, any]:
        """Generate personalized recommendation for a specific product"""
        prompt = self._build_recommendation_prompt(profile, product)
        
        try:
            if self.provider == "openai":
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are a pet nutrition expert providing personalized dog food recommendations."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=500
                )
                content = response.choices[0].message.content
            
            elif self.provider == "anthropic":
                response = self.client.messages.create(
                    model=self.model,
                    max_tokens=500,
                    messages=[
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7
                )
                content = response.content[0].text
            
            elif self.provider == "ollama":
                # LOCAL LLM - FREE!
                response = ollama.chat(
                    model=self.model,
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a pet nutrition expert providing personalized dog food recommendations."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    options={
                        "temperature": 0.7,
                        "num_predict": 500
                    }
                )
                content = response['message']['content']
            
            return self._parse_recommendation_response(content)
        
        except Exception as e:
            print(f"AI Error ({self.provider}): {str(e)}")
            return self._generate_fallback_recommendation(profile, product)
    
    async def generate_comparison_summary(
        self,
        profile: Dict,
        products: List[Dict],
        recommendations: List[Dict]
    ) -> Dict[str, any]:
        """Generate AI comparison summary for multiple products"""
        prompt = self._build_comparison_prompt(profile, products, recommendations)
        
        try:
            if self.provider == "openai":
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are a pet nutrition expert comparing dog food products."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=400
                )
                content = response.choices[0].message.content
            
            elif self.provider == "anthropic":
                response = self.client.messages.create(
                    model=self.model,
                    max_tokens=400,
                    messages=[
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7
                )
                content = response.content[0].text
            
            elif self.provider == "ollama":
                # LOCAL LLM
                response = ollama.chat(
                    model=self.model,
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a pet nutrition expert comparing dog food products."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    options={
                        "temperature": 0.7,
                        "num_predict": 400
                    }
                )
                content = response['message']['content']
            
            return self._parse_comparison_response(content, products)
        
        except Exception as e:
            print(f"AI Error ({self.provider}): {str(e)}")
            return {
                "summary": "All products meet basic safety requirements. Choose based on your budget and preferences.",
                "best_choice_id": str(products[0]["id"]) if products else None
            }
    
    def _build_recommendation_prompt(self, profile: Dict, product: Dict) -> str:
        """Build prompt for single product recommendation"""
        allergies_str = ", ".join(profile.get("allergies", [])) or "none"
        health_conditions_str = ", ".join(profile.get("health_conditions", [])) or "none"
        
        attributes = product.get("attributes", {})
        ingredients = attributes.get("ingredients", {})
        nutrition = attributes.get("nutrition", {})
        
        return f"""Analyze this dog food for a specific dog profile and provide a recommendation.

DOG PROFILE:
- Name: {profile['name']}
- Type: {profile['pet_type']}, Age: {profile['age_years']} years
- Size: {profile.get('size_category', 'unknown')}, Weight: {profile.get('weight_lbs', 'unknown')} lbs
- Allergies: {allergies_str}
- Health Conditions: {health_conditions_str}

PRODUCT:
- Name: {product['name']}
- Brand: {product['brand']}
- Primary Protein: {attributes.get('primary_protein', 'unknown')}
- Ingredients: {', '.join(ingredients.get('full_list', [])[:10])}
- Allergens: {', '.join(ingredients.get('allergens', []))}
- Protein: {nutrition.get('protein_pct', 'unknown')}%, Fat: {nutrition.get('fat_pct', 'unknown')}%
- Life Stage: {', '.join(attributes.get('life_stage', []))}
- Size Suitability: {', '.join(attributes.get('size_suitability', []))}

Provide your analysis in this EXACT format:

EXPLANATION: [2-3 sentences explaining why this product is or isn't suitable for this specific dog]

PROS:
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

CONS:
- [Consideration 1]
- [Consideration 2]

MATCH_SCORE: [0-100]"""
    
    def _build_comparison_prompt(self, profile: Dict, products: List[Dict], recommendations: List[Dict]) -> str:
        """Build prompt for product comparison"""
        allergies_str = ", ".join(profile.get("allergies", [])) or "none"
        
        products_summary = "\n\n".join([
            f"PRODUCT {i+1}: {p['name']} by {p['brand']}\n"
            f"- Price: ${p['price']}\n"
            f"- Match Score: {r['match_score']}/100\n"
            f"- Key Pros: {', '.join(r['pros'][:2])}\n"
            f"- Key Cons: {', '.join(r['cons'][:2])}"
            for i, (p, r) in enumerate(zip(products, recommendations))
        ])
        
        return f"""Compare these dog food products for a {profile['age_years']}-year-old {profile.get('size_category', '')} {profile['pet_type']} named {profile['name']} with allergies to {allergies_str}.

{products_summary}

Provide a 3-4 sentence comparison summary explaining which product is the best choice for THIS specific dog and why. Consider safety, nutritional fit, and value. End with: "BEST_CHOICE: [Product Name]" """
    
    def _parse_recommendation_response(self, content: str) -> Dict:
        """Parse AI response into structured format"""
        lines = content.strip().split("\n")
        result = {
            "explanation": "",
            "pros": [],
            "cons": [],
            "match_score": 75
        }
        
        section = None
        for line in lines:
            line = line.strip()
            if line.startswith("EXPLANATION:"):
                result["explanation"] = line.replace("EXPLANATION:", "").strip()
                section = "explanation"
            elif line == "PROS:":
                section = "pros"
            elif line == "CONS:":
                section = "cons"
            elif line.startswith("MATCH_SCORE:"):
                try:
                    result["match_score"] = int(line.split(":")[1].strip())
                except:
                    pass
            elif line.startswith("-") and section in ["pros", "cons"]:
                result[section].append(line[1:].strip())
            elif section == "explanation" and line and not line.startswith(("PROS", "CONS", "MATCH")):
                result["explanation"] += " " + line
        
        if not result["explanation"]:
            result["explanation"] = "This product has been analyzed based on your pet's profile."
        if not result["pros"]:
            result["pros"] = ["Meets basic nutritional requirements"]
        if not result["cons"]:
            result["cons"] = ["Individual results may vary"]
        
        return result
    
    def _parse_comparison_response(self, content: str, products: List[Dict]) -> Dict:
        """Parse comparison response"""
        best_choice_id = None
        if "BEST_CHOICE:" in content:
            best_choice_name = content.split("BEST_CHOICE:")[-1].strip()
            for product in products:
                if product["name"].lower() in best_choice_name.lower():
                    best_choice_id = str(product["id"])
                    break
        
        summary = content.split("BEST_CHOICE:")[0].strip()
        
        return {
            "summary": summary,
            "best_choice_id": best_choice_id or str(products[0]["id"])
        }
    
    def _generate_fallback_recommendation(self, profile: Dict, product: Dict) -> Dict:
        """Simple rule-based fallback when AI fails"""
        attributes = product.get("attributes", {})
        ingredients = attributes.get("ingredients", {})
        allergens = ingredients.get("allergens", [])
        profile_allergies = profile.get("allergies", [])
        
        has_allergen = any(a in allergens for a in profile_allergies)
        
        return {
            "explanation": f"This {'may not be suitable' if has_allergen else 'appears suitable'} for {profile['name']} based on ingredient analysis.",
            "pros": [
                f"Protein source: {attributes.get('primary_protein', 'standard')}",
                "Complete and balanced formula",
                "Trusted brand"
            ],
            "cons": [
                "Allergen concern detected" if has_allergen else "Always introduce new foods gradually",
                "Consult your veterinarian for specific dietary needs"
            ],
            "match_score": 40 if has_allergen else 70
        }