"""
Database initialization script for Supabase
Prints SQL to run in Supabase SQL Editor
"""

from app.database import supabase

def test_connection():
    """Test Supabase REST API connection"""
    print("Testing Supabase connection...")
    try:
        # Try to query any table, or just test the connection
        result = supabase.rpc('version', {}).execute()
        print(f"✅ Connected to Supabase via HTTPS")
        print(f"   URL: {supabase.supabase_url}")
        return True
    except:
        # If RPC doesn't work, try a simple table query
        try:
            # This will fail if no tables exist, but connection is good
            result = supabase.table('products').select('id').limit(1).execute()
            print(f"✅ Connected to Supabase via HTTPS")
            print(f"   URL: {supabase.supabase_url}")
            return True
        except Exception as e:
            # Even if table doesn't exist, if we get PGRST (PostgREST) error, connection works
            if 'PGRST' in str(e) or 'table' in str(e).lower():
                print(f"✅ Connected to Supabase via HTTPS")
                print(f"   URL: {supabase.supabase_url}")
                print(f"   Note: Tables not created yet (expected)")
                return True
            else:
                print(f"❌ Connection failed: {e}")
                print("\nTroubleshooting:")
                print("1. Check SUPABASE_URL in .env file")
                print("2. Check SUPABASE_KEY (must be service_role key, not anon key)")
                print("3. Get keys from: Supabase Dashboard → Settings → API")
                return False

def get_schema_sql():
    """Return SQL schema to run in Supabase SQL Editor"""
    return """
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    profile_category VARCHAR(50) NOT NULL,
    age_years FLOAT NOT NULL,
    weight_lbs FLOAT,
    size_category VARCHAR(50),
    allergies JSONB DEFAULT '[]'::jsonb,
    health_conditions JSONB DEFAULT '[]'::jsonb,
    preferences JSONB DEFAULT '{}'::jsonb,
    profile_data JSONB DEFAULT '{}'::jsonb,
    recommended_product_ids JSONB DEFAULT '[]'::jsonb,
    recommendations_generated_at TIMESTAMP,
    recommendations_cache_version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    description TEXT,
    price FLOAT NOT NULL,
    price_unit VARCHAR(50),
    image_url TEXT,
    rating FLOAT DEFAULT 0,
    pet_type VARCHAR(50),
    product_category VARCHAR(50),
    attributes JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    match_score INTEGER,
    explanation TEXT,
    pros TEXT[],
    cons TEXT[],
    is_safe BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    added_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(pet_type, product_category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_recommendations_profile ON recommendations(profile_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_product ON recommendations(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product ON wishlists(product_id);
"""

def init_db():
    """Initialize Supabase database"""
    test_connection()
    
    print("\n" + "="*60)
    print("SUPABASE DATABASE SETUP")
    print("="*60)
    print("\n📋 Copy the SQL below and run it in Supabase SQL Editor:")
    print("   1. Go to: https://supabase.com/dashboard")
    print("   2. Select your project: eqxsfikagwajciintetg")
    print("   3. Click 'SQL Editor' in the left sidebar")
    print("   4. Click 'New Query'")
    print("   5. Paste the SQL below and click 'Run'\n")
    print("="*60)
    print(get_schema_sql())
    print("="*60)
    print("\n✅ After running the SQL above, run: python -m app.scripts.seed_data")

if __name__ == "__main__":
    init_db()