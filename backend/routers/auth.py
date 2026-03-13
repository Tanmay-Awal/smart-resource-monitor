from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
import datetime
from config import JWT_SECRET, JWT_EXPIRATION_HOURS

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"])

# Mock user storage (will be replaced with database)
fake_users_db = {}

class RegisterRequest(BaseModel):
    email: str
    name: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/register", response_model=dict)
def register(req: RegisterRequest):
    """Register a new user"""
    if req.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = pwd_context.hash(req.password)
    user = {
        "id": len(fake_users_db) + 1,
        "email": req.email,
        "name": req.name,
        "password_hash": hashed_password
    }
    fake_users_db[req.email] = user

    return {"message": "User registered successfully", "email": req.email}

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    """Login and get JWT token"""
    user = fake_users_db.get(req.email)
    if not user or not pwd_context.verify(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create JWT token
    payload = {
        "sub": str(user["id"]),
        "email": user["email"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"]
        }
    }

@router.get("/me")
def get_current_user(token: str = None):
    """Get current user info from token"""
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email = payload.get("email")
        user = fake_users_db.get(email)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {"id": user["id"], "email": user["email"], "name": user["name"]}
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/logout")
def logout():
    """Logout (token invalidation handled on client)"""
    return {"message": "Logged out successfully"}
