# AI Persona Shopping Experience

**MVP: Pet Food Recommendations** | Future: Multi-Niche Platform

AI-powered personalized product recommendations that filter products based on profiles (allergies, preferences, etc.) and provide intelligent explanations, pros/cons, and comparisons.

## 🎯 Current Phase: Phase 1 (Pet Food MVP)

**End Goal:** Dynamic multi-niche platform where new categories can be added without code changes.

---

## 🏗️ Architecture

```
Frontend (React + Vite + TailwindCSS) [Vercel]
    ↕ REST API (HTTPS)
Backend (Python FastAPI) [Render]
    ↕ Supabase Client
Database (PostgreSQL via Supabase) [Free Tier]
    +
AI Service (OpenAI/Anthropic)
```

**Deployment:** 100% Free hosting with auto-deployment via GitHub Actions

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- OpenAI or Anthropic API key

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and API keys

# Run database migrations
python -m app.scripts.init_db

# Seed sample data
python -m app.scripts.seed_data

# Start server
python main.py
# API available at http://localhost:8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
# App available at http://localhost:5173
```

---

## 📊 Database Schema (Extensible for Phase 2+)

**Current Tables:**
- `profiles` - Pet profiles with JSONB data field (future: polymorphic for all niches)
- `products` - Dog food products with JSONB attributes (future: niche_id)
- `recommendations` - Cached AI responses

**Future Tables (Phase 2):**
- `niches` - Master registry of verticals
- `profile_schemas` - Dynamic form definitions
- `filtering_rules` - Rule engine configurations

---

## 🔑 Key Features

### Phase 1 (MVP)
✅ Pet profile creation (name, age, size, allergies, health conditions)  
✅ Smart filtering (removes unsafe products based on allergies)  
✅ AI-generated personalized explanations  
✅ Pros/cons analysis per product  
✅ Side-by-side comparison (2-3 products)  
✅ Sample dataset (10-15 dog foods)

### Future Phases
🔮 Dynamic niche management (add baby products, skincare, etc.)  
🔮 Schema-driven profile builder  
🔮 Rule engine for complex filtering logic  
🔮 Admin panel for non-technical niche configuration  
🔮 Multi-profile support per user

---

## 🧪 Sample Data

Dataset includes 15 dog food products with:
- Complete ingredient lists
- Allergen information
- Nutritional profiles
- Price comparisons
- Variety of brands (Blue Buffalo, Purina, Royal Canin, Wellness, etc.)

---

## 🛠️ Tech Stack

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- Pydantic (validation)
- OpenAI/Anthropic (AI recommendations)
- PostgreSQL (database)

**Frontend:**
- React 18
- Vite (build tool)
- TailwindCSS (styling)
- React Query (API state)
- Zustand (client state)
- Lucide React (icons)

---

## 📁 Project Structure

```
AIPersona/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── scripts/         # DB init/seed
│   │   └── database.py      # DB connection
│   ├── main.py              # FastAPI app
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── features/        # Feature modules
│   │   ├── services/        # API calls
│   │   ├── store/           # Zustand state
│   │   └── App.jsx
│   └── package.json
│
└── database/
    └── migrations/          # Alembic migrations (future)
```

---

## 🔄 API Endpoints

### Profiles
- `POST /api/profiles` - Create pet profile
- `GET /api/profiles/{id}` - Get profile
- `PUT /api/profiles/{id}` - Update profile

### Products
- `GET /api/products` - List all dog foods
- `GET /api/products/{id}` - Get product details

### Recommendations
- `POST /api/recommendations` - Get filtered + AI recommendations for profile
- `POST /api/recommendations/compare` - Compare 2-3 products with AI analysis

---

## 🧠 AI Integration

The system uses LLMs to generate:
1. **Personalized explanations** - Why a product is suitable for the specific pet
2. **Pros analysis** - 3-4 key benefits
3. **Cons analysis** - 2-3 considerations or drawbacks
4. **Comparison summaries** - Which product is best and why

Responses are cached per profile-product combination to minimize API costs.

---

## 🌱 Future Extensibility

This codebase is designed for easy expansion:

**Adding a new niche (future):**
1. Insert niche configuration in database
2. Define profile schema (JSONB)
3. Add filtering rules
4. Upload products
5. Update AI prompt template

**No frontend changes needed** - the UI adapts dynamically to new schemas.

---

## 📝 Environment Variables

See `.env.example` files in `backend/` and `frontend/` directories.

---

## 🚀 Deployment

**Free Production Hosting:** See [DEPLOYMENT.md](DEPLOYMENT.md) for complete guide.

**Quick Deploy:**
- Frontend: Vercel (auto-deploy from GitHub)
- Backend: Render (auto-deploy from GitHub)
- Database: Supabase (already configured)

**CI/CD:** GitHub Actions automatically tests and deploys on push to `main`

---

## 🐳 Docker

**Local Development:**
```bash
docker-compose up --build
```

**Access:**
- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/docs

---

## 🤝 Contributing

This is Phase 1. Focus areas for contributors:
- Additional dog food products
- UI/UX improvements
- Caching optimizations
- Unit tests

---

## 📄 License

MIT

---

**Built with extensibility in mind. Phase 1 delivers value. Phase 2+ unlocks scale.**
