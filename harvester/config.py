from dotenv import load_dotenv
import os
import sentry_sdk

load_dotenv()

if os.getenv("stage") == "dev":
    load_dotenv(dotenv_path=".env.dev")
elif os.getenv("stage") == "prod":
    load_dotenv(dotenv_path=".env.prod")

    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        traces_sample_rate=0.1,
    )

MONGODB_URI = os.getenv("MONGODB_URI")
REDIS_URL = os.getenv("REDIS_URI")
