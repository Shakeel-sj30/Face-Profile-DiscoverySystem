from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class DetectFaceRequest(BaseModel):
    imageBase64: str

class BoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int

class DetectFaceResponse(BaseModel):
    success: bool
    message: str
    code: Optional[str] = None
    bbox: Optional[BoundingBox] = None
    confidence: Optional[float] = None
    landmarks: Optional[List[Dict[str, Any]]] = None

class EmbeddingRequest(BaseModel):
    imageBase64: str

class EmbeddingResponse(BaseModel):
    success: bool
    embedding: Optional[List[float]] = None
    dimension: int = 512
    message: str
    code: Optional[str] = None

class CompareRequest(BaseModel):
    embedding1: List[float]
    embedding2: List[float]

class CompareResponse(BaseModel):
    success: bool
    similarityScore: float
    similarityPercentage: int

class DiscoverRequest(BaseModel):
    imageBase64: str
    topK: Optional[int] = 5
    filename: Optional[str] = None
    nameHint: Optional[str] = None

class CandidateResult(BaseModel):
    resultId: str
    platform: str
    username: str
    name: str
    profileImageUrl: str
    publicProfileUrl: str
    similarityScore: float
    similarityPercentage: int
    bio: Optional[str] = None
    verified: bool = False
    source: str
    confidenceLevel: str

class DiscoverResponse(BaseModel):
    success: bool
    faceDetected: bool
    candidates: List[CandidateResult]
    processingTimeMs: int
    message: str
    code: Optional[str] = None
