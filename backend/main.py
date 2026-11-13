from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="ClearCheck API", description="Educational ingredient-analysis prototype")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Demonstration-only records. Expand only with verified, cited evidence.

DEMO_DB = {
    "sodium nitrite": {
        "category": "Preservative",
        "note": "Used in some cured meat products. Nitrite can participate in the formation of N-nitroso compounds under certain conditions.",
        "evidence": "This demonstration does not assign a product-specific cancer risk or an IARC classification.",
        "caution": "Food matrix, processing, amount and dietary pattern affect exposure."
    },
    "titanium dioxide": {
        "category": "Colour additive",
        "note": "A white pigment used in some products. Its regulatory treatment differs by jurisdiction and use.",
        "evidence": "This demonstration does not verify current legal status or establish risk for a specific product.",
        "caution": "Check current regulator publications for the relevant product category and country."
    },
    "aspartame": {
        "category": "Sweetener",
        "note": "A low-calorie sweetener used in foods and beverages.",
        "evidence": "IARC classified aspartame as possibly carcinogenic to humans (Group 2B) in 2023. Hazard classification is not a product-specific risk estimate.",
        "caution": "JECFA maintained its acceptable daily intake. Consult the original IARC and JECFA publications."
    },
    "vitamin c": {
        "category": "Vitamin / Nutrient",
        "note": "Vitamin C, also known as ascorbic acid, is an essential nutrient and antioxidant.",
        "evidence": "This prototype does not identify a carcinogenic hazard classification for Vitamin C. This is not proof of safety at every dose or in every product.",
        "caution": "Consider the quantity, product formulation and individual dietary context."
    },
    "ascorbic acid": {
        "category": "Vitamin / Nutrient",
        "note": "Ascorbic acid is the chemical name for Vitamin C and is also used as a food antioxidant.",
        "evidence": "This prototype does not establish a product-specific health risk or verify regulatory permissions.",
        "caution": "Check the ingredient quantity and relevant product-specific regulations."
    }
}


class AnalyseRequest(BaseModel):
    ingredients: str
    product_category: str = "Not specified"
    country: str = "India"

@app.get("/")
def root():
    return {"message": "ClearCheck API is running"}

@app.post("/analyse")
def analyse(req: AnalyseRequest):
    names = [x.strip().lower() for x in req.ingredients.replace(";", ",").split(",") if x.strip()]
    results = []
    for name in names:
        record = DEMO_DB.get(name)
        if record:
            results.append({
                "ingredient": name.title(),
                "status": "Demo knowledge-base match",
                **record
            })
        else:
            results.append({
                "ingredient": name.title(),
                "status": "No entry in demo knowledge base",
                "category": "Unknown",
                "note": "No conclusion can be drawn from the absence of a record.",
                "evidence": "This prototype has not found a matching entry.",
                "caution": "Verify the ingredient name, synonyms, and authoritative sources."
            })
    return {
        "product_category": req.product_category,
        "country": req.country,
        "agents": [
            "Ingredient Identification",
            "Scientific Evidence Review",
            "Regulatory Context Check",
            "Risk Explanation",
            "Cautious Alternatives"
        ],
        "results": results,
        "disclaimer": "Educational prototype only. Hazard identification is not the same as product-specific risk. This is not medical, regulatory, or product-safety advice."
    }
