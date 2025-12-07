from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from app.database import engine, Base
from app.routers import profiles, products, recommendations

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database tables on startup"""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="AI Persona Shopping API",
    description="Personalized product recommendations API - Pet Food MVP (extensible to multiple niches)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(profiles.router, prefix="/api/profiles", tags=["Profiles"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])


@app.get("/")
async def root():
    return {
        "message": "AI Persona Shopping API",
        "version": "1.0.0",
        "mvp": "Pet Food",
        "future_ready": "Multi-niche architecture"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("DEBUG", "True") == "True"
    )
