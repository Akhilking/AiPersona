from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from app.routers import profiles, products, recommendations, auth, templates, wishlist

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting up - Supabase REST API mode...")
    print("✅ Using HTTPS database connection")
    yield
    # Shutdown
    print("👋 Shutting down...")


app = FastAPI(
    title="AI Persona Shopping API",
    description="Personalized product recommendations API - Pet Food MVP (extensible to multiple niches)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
# CORS Configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
cors_origins = [origin.strip() for origin in cors_origins] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(templates.router, prefix="/api/templates", tags=["Templates"])
app.include_router(profiles.router, prefix="/api/profiles", tags=["Profiles"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(wishlist.router, prefix="/api/wishlist", tags=["Wishlist"])


@app.get("/")
async def root():
    return {
        "message": "AI Persona Shopping API",
        "version": "1.0.0",
        "mvp": "Pet Food",
        "future_ready": "Multi-niche architecture",
        "database": "Supabase REST API (HTTPS)"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "supabase"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("DEBUG", "True") == "True"
    )