from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import logging
import json
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Smart Recipe Analyzer API", version="1.0.0")

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Pydantic models - Updated to match LLM response structure
class Ingredient(BaseModel):
    name: str
    quantity: Optional[str] = None

class RecipeRequest(BaseModel):
    ingredients: List[Ingredient]
    dietary_restrictions: Optional[List[str]] = []
    cuisine_preference: Optional[str] = None

class NutritionInfo(BaseModel):
    calories: int
    protein: str
    carbs: str
    fat: Optional[str] = None
    fiber: Optional[str] = None

class Recipe(BaseModel):
    name: str
    ingredients: List[str]
    instructions: List[str]
    cookingTime: str
    difficulty: str
    servings: Optional[int] = 4
    nutrition: NutritionInfo

class RecipeResponse(BaseModel):
    recipes: List[Recipe]
    message: str

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

def create_recipe_prompt(ingredients: List[str], dietary_restrictions: List[str] = None, cuisine_preference: str = None) -> str:
    """Create a structured prompt for the LLM to generate recipes."""

    base_prompt = f"""
You are a professional chef and nutritionist. Generate 2-3 delicious recipe suggestions using the following ingredients: {', '.join(ingredients)}.

Requirements:
- Use as many of the provided ingredients as possible
- Each recipe should be practical and achievable
- Include estimated cooking time and difficulty level (Easy/Medium/Hard)
- Provide realistic nutritional information per serving
- Instructions should be clear and step-by-step
"""

    if dietary_restrictions:
        base_prompt += f"\n- Consider these dietary restrictions: {', '.join(dietary_restrictions)}"

    if cuisine_preference:
        base_prompt += f"\n- Prefer {cuisine_preference} cuisine style"

    base_prompt += """

IMPORTANT: Respond with ONLY a valid JSON object in this exact format:

{
  "recipes": [
    {
      "name": "Recipe Name",
      "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
      "instructions": ["Step 1: Do this...", "Step 2: Do that...", "Step 3: Finish with..."],
      "cookingTime": "X minutes",
      "difficulty": "Easy/Medium/Hard",
      "servings": 4,
      "nutrition": {
        "calories": 450,
        "protein": "12g",
        "carbs": "60g",
        "fat": "15g",
        "fiber": "3g"
      }
    }
  ]
}

Do not include any text before or after the JSON. Make sure the JSON is valid and properly formatted.
"""

    return base_prompt

async def generate_recipes_with_llm(ingredients: List[str], dietary_restrictions: List[str] = None, cuisine_preference: str = None) -> dict:
    """Generate recipes using OpenAI GPT."""

    try:
        prompt = create_recipe_prompt(ingredients, dietary_restrictions, cuisine_preference)
        logger.info(f"Sending prompt to OpenAI with {len(ingredients)} ingredients")

        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional chef and nutritionist who responds only with valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=1500,
            temperature=0.7
        )

        # Extract and parse the JSON response
        content = response.choices[0].message.content.strip()
        logger.info(f"Raw OpenAI response: {content[:200]}...")

        # Try to parse the JSON
        try:
            recipe_data = json.loads(content)
            return recipe_data
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Raw content: {content}")
            raise HTTPException(status_code=500, detail="Invalid JSON response from AI")

    except Exception as e:
        logger.error(f"OpenAI API error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

def create_fallback_recipe(ingredients: List[str]) -> dict:
    """Create a fallback recipe if AI fails."""
    return {
        "recipes": [
            {
                "name": f"Simple {' & '.join(ingredients[:2])} Dish",
                "ingredients": ingredients,
                "instructions": [
                    "Prepare and clean all ingredients",
                    "Heat oil in a large pan over medium heat",
                    "Add ingredients in order of cooking time needed",
                    "Season with salt, pepper, and your favorite spices",
                    "Cook until tender and flavors are well combined",
                    "Serve hot and enjoy!"
                ],
                "cookingTime": "25 minutes",
                "difficulty": "Easy",
                "servings": 4,
                "nutrition": {
                    "calories": 320,
                    "protein": "12g",
                    "carbs": "35g",
                    "fat": "8g",
                    "fiber": "5g"
                }
            }
        ]
    }

@app.get("/")
async def root():
    return {"message": "Smart Recipe Analyzer API with AI is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Smart Recipe Analyzer API", "ai_enabled": bool(os.getenv("OPENAI_API_KEY"))}

@app.post("/analyze-recipes", response_model=RecipeResponse)
async def analyze_recipes(request: RecipeRequest):
    try:
        logger.info(f"Received POST request with {len(request.ingredients)} ingredients")
        ingredient_names = [ing.name for ing in request.ingredients]
        logger.info(f"Ingredients: {ingredient_names}")

        # Validate that we have ingredients
        if not request.ingredients:
            raise HTTPException(status_code=400, detail="No ingredients provided")

        # Check if OpenAI API key is available
        if not os.getenv("OPENAI_API_KEY"):
            logger.warning("No OpenAI API key found, using fallback recipe")
            recipe_data = create_fallback_recipe(ingredient_names)
        else:
            try:
                # Generate recipes using AI
                recipe_data = await generate_recipes_with_llm(
                    ingredient_names,
                    request.dietary_restrictions,
                    request.cuisine_preference
                )
            except Exception as e:
                logger.error(f"AI generation failed: {str(e)}, using fallback")
                recipe_data = create_fallback_recipe(ingredient_names)

        # Convert to our response format
        recipes = []
        for recipe_dict in recipe_data.get("recipes", []):
            try:
                recipe = Recipe(**recipe_dict)
                recipes.append(recipe)
            except Exception as e:
                logger.error(f"Failed to parse recipe: {e}")
                continue

        if not recipes:
            # If no recipes were successfully parsed, create a fallback
            fallback_data = create_fallback_recipe(ingredient_names)
            recipes = [Recipe(**fallback_data["recipes"][0])]

        response = RecipeResponse(
            recipes=recipes,
            message=f"Generated {len(recipes)} recipe{'s' if len(recipes) != 1 else ''} using your ingredients: {', '.join(ingredient_names)}!"
        )

        logger.info(f"Successfully generated {len(recipes)} recipes")
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )