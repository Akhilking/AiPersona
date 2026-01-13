"""
Database connection using Supabase REST API (HTTPS)
"""

import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

# Supabase client for REST API operations
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env file")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# For backward compatibility with existing code
def get_db():
    """Dependency for FastAPI routes - returns supabase client"""
    return supabase