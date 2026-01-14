"""
AI Service - Multi-Provider Support (OpenAI, Anthropic, Ollama)
"""

import os
from typing import Dict, List, Optional
from openai import OpenAI
from anthropic import Anthropic
try:
    from groq import Groq
except ImportError:
    Groq = None
try:
    import ollama
except ImportError:
    ollama = None
    

class AIService:
    def __init__(self):
        self.provider = os.getenv("AI_PROVIDER", "groq").lower()
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
        elif self.provider == "groq":
            if Groq is None:
                raise ImportError("groq package not installed. Run: pip install groq")
            self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
            self.model = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
            print(f"✅ Using Groq (FREE): {self.model}")
        else:
            raise ValueError(f"Unsupported AI provider: {self.provider}")
    
    def _get_expert_role(self, profile_category: str) -> str:
        """Get expert role description based on profile category"""
        category_experts = {
            "dog": "pet nutrition expert specializing in canine health and dog food",
            "cat": "pet nutrition expert specializing in feline health and cat food",
            "baby": "pediatric nutrition expert specializing in infant and toddler nutrition",
            "human": "certified nutritionist specializing in human health and wellness products",
            "bird": "avian nutrition expert specializing in bird care and nutrition",
            "fish": "aquatic specialist focusing on fish health and aquarium care",
            "rabbit": "small animal veterinary nutritionist specializing in rabbit care"
        }
        return category_experts.get(profile_category, "product recommendation expert")
    
    def _get_product_type_label(self, profile_category: str) -> str:
        """Get product type label based on profile category"""
        labels = {
            "dog": "dog food",
            "cat": "cat food",
            "baby": "baby product",
            "human": "product",
            "bird": "bird food/product",
            "fish": "aquarium product",
            "rabbit": "rabbit food/product"
        }
        return labels.get(profile_category, "product")
    
    def _get_profile_type_label(self, profile_category: str) -> str:
        """Get profile type label for prompts"""
        labels = {
            "dog": "dog",
            "cat": "cat",
            "baby": "baby",
            "human": "person",
            "bird": "bird",
            "fish": "fish",
            "rabbit": "rabbit"
        }
        return labels.get(profile_category, "profile")
    
    async def generate_product_recommendation(
        self,
        profile: Dict,
        product: Dict
    ) -> Dict[str, any]:
        """Generate personalized recommendation for a specific product"""
        profile_category = profile.get('profile_category') or profile.get('pet_type', 'dog')
        expert_role = self._get_expert_role(profile_category)
        prompt = self._build_recommendation_prompt(profile, product)
        
        try:
            if self.provider == "openai":
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": f"You are a {expert_role} providing personalized recommendations."},
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
                            "content": f"You are a {expert_role} providing personalized recommendations."
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
            elif self.provider == "groq":
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": f"You are a {expert_role} providing personalized recommendations."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=500
                )
                content = response.choices[0].message.content
            
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
        profile_category = profile.get('profile_category') or profile.get('pet_type', 'dog')
        expert_role = self._get_expert_role(profile_category)
        prompt = self._build_comparison_prompt(profile, products, recommendations)
        
        try:
            if self.provider == "openai":
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": f"You are a {expert_role} comparing products."},
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
                            "content": f"You are a {expert_role} comparing products."
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
            elif self.provider == "groq":
                # Groq - FREE & FAST!
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": f"You are a {expert_role} comparing products."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=400
                )
                content = response.choices[0].message.content
            
            return self._parse_comparison_response(content, products)
        
        except Exception as e:
            print(f"AI Error ({self.provider}): {str(e)}")
            return {
                "summary": "All products meet basic safety requirements. Choose based on your budget and preferences.",
                "best_choice_id": str(products[0]["id"]) if products else None
            }
    
    def _build_recommendation_prompt(self, profile: Dict, product: Dict) -> str:
        """Build prompt for single product recommendation"""
        profile_category = profile.get('profile_category') or profile.get('pet_type', 'dog')
        product_type_label = self._get_product_type_label(profile_category)
        profile_type_label = self._get_profile_type_label(profile_category)
        
        allergies_str = ", ".join(profile.get("allergies", [])) or "none"
        health_conditions_str = ", ".join(profile.get("health_conditions", [])) or "none"
        
        attributes = product.get("attributes", {})
        ingredients = attributes.get("ingredients", {})
        nutrition = attributes.get("nutrition", {})
        
        # Build profile-specific details
        profile_details = f"""- Name: {profile['name']}
- Category: {profile_category}, Age: {profile['age_years']} years"""
        
        if profile.get('weight_lbs'):
            profile_details += f"\n- Weight: {profile['weight_lbs']} lbs"
        
        if profile.get('size_category'):
            profile_details += f", Size: {profile.get('size_category')}"
        
        profile_details += f"""
- Allergies: {allergies_str}
- Health Conditions: {health_conditions_str}"""
        
        # Build product details
        product_details = f"""- Name: {product['name']}
- Brand: {product['brand']}"""
        
        if attributes.get('primary_protein'):
            product_details += f"\n- Primary Protein: {attributes.get('primary_protein')}"
        
        if ingredients.get('full_list'):
            product_details += f"\n- Ingredients: {', '.join(ingredients.get('full_list', [])[:10])}"
        
        if ingredients.get('allergens'):
            product_details += f"\n- Allergens: {', '.join(ingredients.get('allergens', []))}"
        
        if nutrition:
            if nutrition.get('protein_pct'):
                product_details += f"\n- Protein: {nutrition.get('protein_pct')}%"
            if nutrition.get('fat_pct'):
                product_details += f", Fat: {nutrition.get('fat_pct')}%"
        
        if attributes.get('life_stage'):
            product_details += f"\n- Life Stage: {', '.join(attributes.get('life_stage', []))}"
        
        if attributes.get('size_suitability'):
            product_details += f"\n- Size Suitability: {', '.join(attributes.get('size_suitability', []))}"
        
        return f"""Analyze this {product_type_label} for a specific {profile_type_label} profile and provide a recommendation.

PROFILE:
{profile_details}

PRODUCT:
{product_details}

Provide your analysis in this EXACT format:

EXPLANATION: [2-3 sentences explaining why this product is or isn't suitable for this specific {profile_type_label}]

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
        profile_category = profile.get('profile_category') or profile.get('pet_type', 'dog')
        product_type_label = self._get_product_type_label(profile_category)
        profile_type_label = self._get_profile_type_label(profile_category)
        
        allergies_str = ", ".join(profile.get("allergies", [])) or "none"
        
        # Build profile description
        profile_desc = f"{profile['age_years']}-year-old"
        if profile.get('size_category'):
            profile_desc += f" {profile.get('size_category')}"
        profile_desc += f" {profile_type_label} named {profile['name']}"
        
        products_summary = "\n\n".join([
            f"PRODUCT {i+1}: {p['name']} by {p['brand']}\n"
            f"- Price: ${p['price']}\n"
            f"- Match Score: {r['match_score']}/100\n"
            f"- Key Pros: {', '.join(r['pros'][:2]) if r['pros'] else 'N/A'}\n"
            f"- Key Cons: {', '.join(r['cons'][:2]) if r['cons'] else 'N/A'}"
            for i, (p, r) in enumerate(zip(products, recommendations))
        ])
        
        return f"""Compare these {product_type_label}s for a {profile_desc} with allergies to {allergies_str}.

{products_summary}

Provide a 3-4 sentence comparison summary explaining which product is the best choice for THIS specific {profile_type_label} and why. Consider safety, nutritional fit, and value. End with: "BEST_CHOICE: [Product Name]" """
    
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
            result["explanation"] = "This product has been analyzed based on your profile."
        if not result["pros"]:
            result["pros"] = ["Meets basic nutritional requirements"]
        if not result["cons"]:
            result["cons"] = ["Individual results may vary"]
        
        return result
    
    def _parse_comparison_response(self, content: str, products: List[Dict]) -> Dict:
        """Parse comparison response to extract summary and best choice"""
        lines = content.strip().split("\n")
        summary = ""
        best_choice_id = None
        
        for line in lines:
            if line.strip().startswith("BEST_CHOICE:"):
                best_choice_name = line.split("BEST_CHOICE:")[1].strip()
                # Find matching product
                for product in products:
                    if product["name"].lower() in best_choice_name.lower():
                        best_choice_id = product["id"]
                        break
            else:
                summary += line + " "
        
        summary = summary.strip()
        if not summary:
            summary = "All products are suitable options. Choose based on your preferences and budget."
        
        return {
            "summary": summary,
            "best_choice_id": best_choice_id or (str(products[0]["id"]) if products else None)
        }
    
    async def generate_product_key_features(self, product: Dict) -> List[str]:
        """Generate 2 concise key features for a product"""
        profile_category = product.get('pet_type', 'general')
        product_type_label = self._get_product_type_label(profile_category)
        
        attributes = product.get("attributes", {})
        ingredients = attributes.get("ingredients", {})
        
        prompt = f"""Based on this {product_type_label}, write 2 short selling features:

Product: {product['name']} by {product['brand']}
Description: {product.get('description', 'N/A')}
Primary Protein: {attributes.get('primary_protein', 'N/A')}
Key Ingredients: {', '.join(ingredients.get('full_list', [])[:5])}

Output format (NO additional text, just the features):
Feature 1 text here
Feature 2 text here"""
        
        try:
            if self.provider == "openai":
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are a product copywriter."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=100
                )
                content = response.choices[0].message.content
            
            elif self.provider == "anthropic":
                response = self.client.messages.create(
                    model=self.model,
                    max_tokens=100,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7
                )
                content = response.content[0].text
            
            elif self.provider == "ollama":
                response = ollama.chat(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are a product copywriter."},
                        {"role": "user", "content": prompt}
                    ],
                    options={"temperature": 0.7, "num_predict": 100}
                )
                content = response['message']['content']
            
            # Parse features
            features = [
            line.strip().lstrip('-•123456789. ') 
            for line in content.strip().split('\n') 
            if line.strip() and not any(skip in line.lower() for skip in ['here are', 'feature', 'selling point', 'key point'])
            ]
            return features[:2] if features else [
                f"{product.get('brand', 'Premium')} quality",
                f"Suitable for {profile_category}s"
            ]
        
        except Exception as e:
            print(f"AI Error generating features: {str(e)}")
            return [
                f"{product.get('brand', 'Premium')} quality",
                f"Suitable for {profile_category}s"
            ]
    
    def _generate_fallback_recommendation(self, profile: Dict, product: Dict) -> Dict:
        """Generate basic recommendation when AI fails"""
        return {
            "explanation": f"This product is designed for {profile.get('pet_type', 'pets')} and meets basic safety requirements based on the profile criteria.",
            "pros": [
                "Meets basic nutritional requirements",
                f"Appropriate for {profile.get('pet_type', 'pet')} consumption",
                "Quality brand reputation"
            ],
            "cons": [
                "Consult with a professional for specific dietary needs",
                "Individual results may vary"
            ],
            "match_score": 75
        }