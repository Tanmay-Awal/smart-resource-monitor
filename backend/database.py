from sqlalchemy import create_engine, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency for getting a DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_connection():
    """Test if database is reachable"""
    try:
        # Try to connect to the engine
        with engine.connect() as connection:
            print("✅ Database connection successful!")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def ensure_schema():
    """Ensure required schema exists (lightweight migration)."""
    from models import models  # noqa: F401
    inspector = inspect(engine)
    with engine.begin() as connection:
        tables = inspector.get_table_names()
        if "chat_messages" not in tables:
            Base.metadata.create_all(bind=engine)
            return

        columns = {col["name"] for col in inspector.get_columns("chat_messages")}
        if "sender" not in columns:
            connection.execute(text("ALTER TABLE chat_messages ADD COLUMN sender VARCHAR(50)"))
        if "message" not in columns:
            connection.execute(text("ALTER TABLE chat_messages ADD COLUMN message TEXT"))
        if "timestamp" not in columns:
            connection.execute(text("ALTER TABLE chat_messages ADD COLUMN timestamp TIMESTAMPTZ DEFAULT now()"))
