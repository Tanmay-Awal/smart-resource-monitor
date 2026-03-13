# Mock mode - no database persistence for now
# All data is stored in-memory (auth uses fake_users_db in routers/auth.py)

def get_db():
    """Mock database session - returns None"""
    return None

def test_connection():
    """Test if database is reachable"""
    print("📌 Running in mock mode (no database persistence)")
    print("✅ All data is stored in-memory for this session")
    return True
