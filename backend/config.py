import os
from dotenv import load_dotenv

load_dotenv()

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/resource_monitor")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# JWT
JWT_SECRET = os.getenv("JWT_SECRET", "smartresourcemonitor2024")
JWT_EXPIRATION_HOURS = 7 * 24  # 7 days

# OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# API
API_HOST = "0.0.0.0"
API_PORT = 8000
