import uvicorn
from dotenv import load_dotenv
load_dotenv()  # Load .env file (SERPAPI_KEY, etc.) before anything else

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.config.settings import settings


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Internal Python service for InsightFace + ArcFace face detection, alignment, embedding generation, and candidate discovery.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-service", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
