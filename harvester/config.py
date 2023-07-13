from dotenv import load_dotenv
import os

load_dotenv()

if os.getenv("stage") == "dev":
    load_dotenv(dotenv_path=".env.dev")
elif os.getenv("stage") == "prod":
    load_dotenv(dotenv_path=".env.prod")

MONGODB_URI = os.getenv("MONGODB_URI")
REDIS_URL = os.getenv("REDIS_URI")
