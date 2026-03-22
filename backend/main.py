from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from routers import auth, metrics, predict, ai
from database import test_connection

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Smart Resource Monitor API Starting...")
    test_connection()
    yield
    # Shutdown
    print("🛑 Smart Resource Monitor API Shutting Down...")

app = FastAPI(
    title="Smart Resource Monitor API",
    description="AI-powered system monitoring and optimization",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check
@app.get("/health")
def health():
    """Health check endpoint"""
    return {"status": "ok", "message": "Smart Resource Monitor API is running"}

# Include Routers
app.include_router(auth.router)
app.include_router(metrics.router)
app.include_router(predict.router)
app.include_router(ai.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
