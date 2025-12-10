cd C:\Users\z0041psj\Documents\test\AIPersona\backend
.\venv\Scripts\Activate.ps1

# Drop and recreate the database
# psql -U postgres -c "DROP DATABASE IF EXISTS aipersona;"
# psql -U postgres -c "CREATE DATABASE aipersona;"

# Create tables with new schema (includes users table and user_id column)
python -m app.scripts.init_db

# Seed products
python -m app.scripts.seed_data

# Start server
python main.py