import os
import urllib.parse
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

db_user = os.getenv("DB_USER")
db_pass = os.getenv("DB_PASSWORD", "")
db_host = os.getenv("DB_HOST", "127.0.0.1")
db_port = os.getenv("DB_PORT", "5432")
db_name = os.getenv("DB_NAME", "srm_db")

encoded_pass = urllib.parse.quote_plus(db_pass)
db_url = f"postgresql://{db_user}:{encoded_pass}@{db_host}:{db_port}/{db_name}"

print(f"Testing URL: {db_url}")

try:
    engine = create_engine(db_url)
    with engine.connect() as conn:
        print("✅ Connection successful!")
except Exception as e:
    print(f"❌ Connection failed: {e}")
