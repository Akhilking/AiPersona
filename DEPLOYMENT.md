# 🚀 Deployment Guide - AI Persona Shopping

Complete guide to deploy your application for **FREE** using modern hosting platforms.

---

## 🏗️ Deployment Architecture

```
Frontend (Vercel) → Backend (Render) → Database (Supabase)
   Free Tier          Free Tier           Free Tier
```

**Estimated Monthly Cost:** $0 (with limitations)

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account
- ✅ Supabase account (already setup)
- ✅ Vercel account (free - sign up with GitHub)
- ✅ Render account (free - sign up with GitHub)
- ✅ All environment variables ready

---

## 🗄️ Step 1: Prepare Supabase Database

Your database is already setup, but verify production readiness:

### 1.1 Check Database Tables

```sql
-- Run in Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Should show: `users`, `profiles`, `products`, `wishlist`, `recommendation_cache`

### 1.2 Get Production Credentials

1. Go to Supabase Dashboard → Settings → API
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbG...` (starts with eyJ)

### 1.3 Enable Row Level Security (RLS) - IMPORTANT!

```sql
-- Enable RLS for production security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Add policies (example for profiles)
CREATE POLICY "Users can view their own profiles"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profiles"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

---

## 🐍 Step 2: Deploy Backend to Render

### 2.1 Push Code to GitHub

```bash
# From project root
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### 2.2 Create New Web Service on Render

1. Go to [render.com](https://render.com) → Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:

   | Field | Value |
   |-------|-------|
   | **Name** | `aipersona-backend` |
   | **Region** | Choose closest to you |
   | **Branch** | `main` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Python 3` |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
   | **Instance Type** | `Free` |

### 2.3 Add Environment Variables

In Render dashboard → Environment:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-anon-key
OPENAI_API_KEY=sk-your-key
ANTHROPIC_API_KEY=sk-ant-your-key
JWT_SECRET_KEY=your-random-secret-key-min-32-chars
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5173
ENVIRONMENT=production
PYTHON_VERSION=3.11.0
```

**Generate JWT Secret:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for first deployment
3. Get your backend URL: `https://aipersona-backend.onrender.com`

### 2.5 Test Backend

```bash
curl https://your-backend.onrender.com/health
# Should return: {"status":"healthy","database":"supabase"}
```

**Important:** Free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

---

## ⚛️ Step 3: Deploy Frontend to Vercel

### 3.1 Create New Project on Vercel

1. Go to [vercel.com](https://vercel.com) → Dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:

   | Field | Value |
   |-------|-------|
   | **Framework Preset** | `Vite` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

### 3.2 Add Environment Variable

In Vercel → Settings → Environment Variables:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### 3.3 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Get your frontend URL: `https://your-app.vercel.app`

### 3.4 Update Backend CORS

Go back to Render → Environment → Update `CORS_ORIGINS`:

```env
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

Click **"Save Changes"** (triggers redeploy)

---

## 🔄 Step 4: Setup Auto-Deployment (CI/CD)

Already configured via GitHub Actions! On every push to `main`:

1. ✅ Tests run automatically
2. ✅ Linting checks code quality
3. ✅ Render auto-deploys backend
4. ✅ Vercel auto-deploys frontend

**View Deployments:**
- Render: Dashboard → Your Service → Events
- Vercel: Dashboard → Your Project → Deployments

---

## 🐳 Step 5: Local Testing with Docker (Optional)

Test deployment setup locally:

```bash
# Build and run both services
docker-compose up --build

# Backend: http://localhost:8000
# Frontend: http://localhost:5173
```

**Stop containers:**
```bash
docker-compose down
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend health check passes: `https://your-backend.onrender.com/health`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Can create account and login
- [ ] Can create pet profile
- [ ] Can view product recommendations
- [ ] Can add items to wishlist
- [ ] CORS configured correctly (no console errors)

---

## 🔧 Troubleshooting

### Backend Issues

**Problem:** 502 Bad Gateway
- **Cause:** Backend is waking up from sleep (free tier)
- **Solution:** Wait 30 seconds, refresh

**Problem:** Database connection error
- **Cause:** Wrong Supabase credentials
- **Solution:** Check `SUPABASE_URL` and `SUPABASE_KEY` in Render env vars

**Problem:** CORS error in browser
- **Cause:** Frontend URL not in `CORS_ORIGINS`
- **Solution:** Update Render env var with correct Vercel URL

### Frontend Issues

**Problem:** "Network Error" when making API calls
- **Cause:** Wrong `VITE_API_BASE_URL`
- **Solution:** Update Vercel env var with correct Render URL

**Problem:** Blank page
- **Cause:** Build error
- **Solution:** Check Vercel build logs

### Logs & Debugging

**Render Logs:**
```
Dashboard → Your Service → Logs
```

**Vercel Logs:**
```
Dashboard → Your Project → Deployments → [Latest] → View Function Logs
```

---

## 💰 Free Tier Limitations

| Service | Limit | Impact |
|---------|-------|--------|
| **Render** | Sleeps after 15min idle | First request slow (~30s) |
| **Render** | 750 hours/month | Enough for MVP testing |
| **Vercel** | 100GB bandwidth | ~100k page views/month |
| **Supabase** | 500MB storage | ~50k products + users |
| **Supabase** | 2 projects | 1 prod + 1 dev |

**Upgrade when:**
- Getting consistent traffic (>100 users/day)
- Backend sleep time affects UX
- Need 99.9% uptime

---

## 🚀 Upgrade Paths

### When to Upgrade

**Render ($7/month):**
- Always-on (no sleep)
- 2GB RAM
- Good for 1000+ DAU

**Vercel Pro ($20/month):**
- Unlimited bandwidth
- Advanced analytics
- Team collaboration

**Supabase Pro ($25/month):**
- 8GB storage
- Daily backups
- Better performance

---

## 🔐 Production Security Checklist

Before going live with real users:

- [ ] Enable HTTPS only (already done by Render/Vercel)
- [ ] Enable Supabase RLS policies
- [ ] Rotate JWT secret key
- [ ] Add rate limiting
- [ ] Enable API key rotation
- [ ] Setup error tracking (Sentry)
- [ ] Add monitoring (UptimeRobot)
- [ ] Configure custom domain
- [ ] Add privacy policy & terms
- [ ] Test password reset flow

---

## 📊 Monitoring & Analytics

### Free Monitoring Tools

**Backend Uptime:**
- [UptimeRobot](https://uptimerobot.com) - Free 50 monitors
- Ping: `https://your-backend.onrender.com/health` every 5 minutes

**Error Tracking:**
- [Sentry](https://sentry.io) - Free 5k errors/month
- Add to both frontend and backend

**Analytics:**
- [Plausible](https://plausible.io) - Privacy-friendly
- [Google Analytics](https://analytics.google.com) - Free, comprehensive

---

## 🎉 Success!

Your application is now live:

- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.onrender.com
- **API Docs:** https://your-backend.onrender.com/docs

Share with users and start gathering feedback!

---

## 📞 Support Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **FastAPI Docs:** https://fastapi.tiangolo.com
- **React Docs:** https://react.dev

---

## 🔄 Making Updates

After deployment, updates are automatic:

```bash
# Make changes locally
git add .
git commit -m "Your change description"
git push origin main

# GitHub Actions runs tests
# Render deploys backend automatically
# Vercel deploys frontend automatically
```

Check deployment status:
- Render: ~5-10 minutes
- Vercel: ~2-3 minutes

---

**Next Steps:**
1. Setup custom domain
2. Add payment integration (Stripe)
3. Implement analytics
4. Add user feedback system
5. Scale as needed

Good luck! 🚀
