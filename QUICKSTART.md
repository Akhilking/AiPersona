# 🚀 Quick Start Guide - AI Persona Shopping (Pet Food MVP)

## Prerequisites Checklist
- [ ] Python 3.10 or higher installed
- [ ] Node.js 18 or higher installed
- [ ] PostgreSQL 14+ installed and running
- [ ] OpenAI or Anthropic API key

---

## Step 1: Database Setup (5 minutes)

### Create PostgreSQL Database
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE aipersona;

# Exit psql
\q
```

---

## Step 2: Backend Setup (5 minutes)

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env file with your settings:
# - DATABASE_URL (PostgreSQL connection)
# - OPENAI_API_KEY or ANTHROPIC_API_KEY
# - AI_PROVIDER (openai or anthropic)
```

### Edit `.env` file:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/aipersona
OPENAI_API_KEY=sk-your-actual-key-here
AI_PROVIDER=openai
```

### Initialize Database & Seed Data
```powershell
# Create tables
python -m app.scripts.init_db

# Seed sample products (15 dog foods)
python -m app.scripts.seed_data
```

### Start Backend Server
```powershell
python main.py
# Server running at http://localhost:8000
# API docs at http://localhost:8000/docs
```

---

## Step 3: Frontend Setup (3 minutes)

**Open a NEW terminal window:**

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Default settings should work (API at localhost:8000)

# Start development server
npm run dev
# App running at http://localhost:5173
```

---

## Step 4: Test the Application

1. **Open browser:** http://localhost:5173
2. **Click "Get Started"**
3. **Create a pet profile:**
   - Name: Buddy
   - Age: 2 years
   - Weight: 25 lbs
   - Allergies: Select "chicken"
   - Click "Get Recommendations"
4. **View filtered results** (should exclude chicken-based products)
5. **Select 2-3 products** and click "Compare"
6. **See AI-powered comparison** with personalized insights

---

## Troubleshooting

### Backend won't start
```powershell
# Check if PostgreSQL is running
Get-Service postgresql*

# Test database connection (use -U uppercase, not -u)
psql -U postgres -d aipersona -c "SELECT 1;"

# Verify Python version
python --version  # Should be 3.10+
```

### Can't connect to PostgreSQL
```powershell
# Check if PostgreSQL service is running
Get-Service postgresql*

# If not running, start it
Start-Service postgresql-x64-16  # Adjust version number if different

# Find your PostgreSQL bin directory and add to PATH if needed
# Usually: C:\Program Files\PostgreSQL\16\bin
```

### Frontend won't start
```powershell
# Verify Node version
node --version  # Should be 18+

# Clear cache and reinstall
rm -r node_modules
npm install
```

### AI API errors
- Verify API key in `backend/.env`
- Check API key has credits
- Try switching provider (openai ↔ anthropic)

---

## What's Working in Phase 1

✅ Pet profile creation with allergies & health conditions  
✅ 15 realistic dog food products with detailed data  
✅ Smart filtering (removes unsafe products)  
✅ AI-generated personalized explanations  
✅ Pros/cons analysis per product  
✅ Side-by-side comparison (2-3 products)  
✅ Match scoring (0-100)  
✅ Caching to minimize AI API costs

---

## Phase 2 Preview (Future)

The codebase is designed for easy expansion:
- Dynamic niche system (baby products, skincare, etc.)
- Schema-driven profile builder
- Rule engine for complex filtering
- Admin panel for non-technical niche configuration

**All JSONB fields in the database are ready for Phase 2+**

---

## API Documentation

Once backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **Health check:** http://localhost:8000/health

---

## Need Help?

Check the main [README.md](../README.md) for detailed architecture documentation.

**Enjoy your AI-powered pet food recommendations! 🐕🍖**
