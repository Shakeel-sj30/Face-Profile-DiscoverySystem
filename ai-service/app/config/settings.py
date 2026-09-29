import os
from pydantic import BaseModel
from typing import List, Optional

class Settings:
    PROJECT_NAME: str = "Face Search AI Processing Service"
    API_V1_STR: str = "/internal/ai"
    FACE_MATCH_THRESHOLD: float = 0.65
    EMBEDDING_DIM: int = 512

settings = Settings()
