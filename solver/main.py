from fastapi import FastAPI
from api.routes import router as api_router

app = FastAPI()
app.include_router(api_router)


@app.get("/")
def health_check() -> dict:
    return {"status": "ok"}
