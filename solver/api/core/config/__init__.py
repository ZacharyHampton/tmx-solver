from dotenv import load_dotenv
import os

load_dotenv()

if os.getenv("STAGE") == "dev":
    load_dotenv(dotenv_path=".env.dev")
elif os.getenv("STAGE") == "prod":
    load_dotenv(dotenv_path=".env.prod")

MONGODB_URI = os.getenv("MONGODB_URI")
GRPC_HOSTNAME = "localhost" if os.getenv("stage") == "dev" else "deobfuscator"
