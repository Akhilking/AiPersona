"""
Authentication Service - Supabase REST API version
"""

from datetime import datetime, timedelta
from typing import Optional, Dict
from jose import JWTError, jwt
from passlib.context import CryptContext
from uuid import UUID
import os
import uuid as uuid_lib

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, db):
        self.db = db  # supabase client
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        password_bytes = password.encode('utf-8')[:72]
        return pwd_context.hash(password_bytes.decode('utf-8'))
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    def register_user(self, user_data) -> Dict:
        # Check if user exists
        existing = self.db.table('users').select('*').eq('email', user_data.email).execute()
        if existing.data:
            raise ValueError("Email already registered")
        
        # Create user
        user = {
            "id": str(uuid_lib.uuid4()),
            "email": user_data.email,
            "full_name": user_data.full_name,
            "hashed_password": self.get_password_hash(user_data.password),
            "is_active": True,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = self.db.table('users').insert(user).execute()
        return response.data[0] if response.data else None
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict]:
        response = self.db.table('users').select('*').eq('email', email).execute()
        if not response.data:
            return None
        
        user = response.data[0]
        if not self.verify_password(password, user['hashed_password']):
            return None
        return user
    
    def get_user_by_id(self, user_id: UUID) -> Optional[Dict]:
        response = self.db.table('users').select('*').eq('id', str(user_id)).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def decode_token(token: str) -> Optional[dict]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            return None