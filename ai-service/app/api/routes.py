import base64
import time
import io
import cv2
import numpy as np
from PIL import Image
from fastapi import APIRouter, HTTPException, status
from app.api.models import (
    DetectFaceRequest, DetectFaceResponse, BoundingBox,
    EmbeddingRequest, EmbeddingResponse,
    CompareRequest, CompareResponse,
    DiscoverRequest, DiscoverResponse, CandidateResult
)
from app.face_detector.detector import detector
from app.preprocessing.aligner import align_face
from app.embedding.arcface_embedder import embedder
from app.matcher.similarity import cosine_similarity
from app.discovery.candidate_discovery import discover_and_rank_candidates

router = APIRouter(prefix="/internal/ai", tags=["Internal AI Services"])

def decode_image_base64(b64_str: str) -> np.ndarray:
    """Decodes base64 string to RGB OpenCV numpy array."""
    try:
        if "," in b64_str:
            b64_str = b64_str.split(",")[1]
        img_bytes = base64.b64decode(b64_str)
        pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        return np.array(pil_img)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "message": "Invalid image payload or corrupted encoding", "code": "INVALID_IMAGE"}
        )

@router.post("/detect-face", response_model=DetectFaceResponse)
def detect_face_endpoint(req: DetectFaceRequest):
    img_np = decode_image_base64(req.imageBase64)
    detection = detector.detect(img_np)
    
    if not detection:
        return DetectFaceResponse(
            success=False,
            message="No detectable face found",
            code="FACE_NOT_FOUND"
        )
        
    bbox = BoundingBox(**detection["bbox"])
    return DetectFaceResponse(
        success=True,
        message="Face detected successfully",
        bbox=bbox,
        confidence=detection["confidence"],
        landmarks=detection["landmarks"]
    )

@router.post("/embedding", response_model=EmbeddingResponse)
def generate_embedding_endpoint(req: EmbeddingRequest):
    img_np = decode_image_base64(req.imageBase64)
    detection = detector.detect(img_np)
    
    if not detection:
        return EmbeddingResponse(
            success=False,
            embedding=None,
            message="No detectable face found in uploaded image",
            code="FACE_NOT_FOUND"
        )
        
    x, y, w, h = detection["bbox"]["x"], detection["bbox"]["y"], detection["bbox"]["width"], detection["bbox"]["height"]
    aligned_face = align_face(img_np, (x, y, w, h))
    vector = embedder.get_embedding(aligned_face)
    
    return EmbeddingResponse(
        success=True,
        embedding=vector,
        dimension=len(vector),
        message="ArcFace embedding generated successfully"
    )

@router.post("/compare", response_model=CompareResponse)
def compare_embeddings_endpoint(req: CompareRequest):
    score = cosine_similarity(req.embedding1, req.embedding2)
    return CompareResponse(
        success=True,
        similarityScore=score,
        similarityPercentage=int(score * 100)
    )

@router.post("/discover", response_model=DiscoverResponse)
def discover_candidates_endpoint(req: DiscoverRequest):
    start_t = time.time()

    # Decode the base64 string to both raw bytes (for SerpAPI upload) and
    # an RGB numpy array (for local face detection + embedding).
    b64_str = req.imageBase64
    if "," in b64_str:
        b64_str = b64_str.split(",")[1]
    raw_image_bytes = base64.b64decode(b64_str)

    img_np = decode_image_base64(req.imageBase64)
    detection = detector.detect(img_np)

    if not detection:
        return DiscoverResponse(
            success=False,
            faceDetected=False,
            candidates=[],
            processingTimeMs=int((time.time() - start_t) * 1000),
            message="No detectable face found",
            code="FACE_NOT_FOUND"
        )

    x, y, w, h = (
        detection["bbox"]["x"],
        detection["bbox"]["y"],
        detection["bbox"]["width"],
        detection["bbox"]["height"],
    )
    aligned_face = align_face(img_np, (x, y, w, h))
    query_vector = embedder.get_embedding(aligned_face)

    # Pass raw image bytes so the live SerpAPI reverse-image-search path can
    # use the original image as its query rather than a re-encoded crop.
    candidates_raw = discover_and_rank_candidates(
        query_vector,
        top_k=req.topK or 5,
        image_bytes=raw_image_bytes,
    )
    candidates = [CandidateResult(**c) for c in candidates_raw]

    proc_time = int((time.time() - start_t) * 1000)
    return DiscoverResponse(
        success=True,
        faceDetected=True,
        candidates=candidates,
        processingTimeMs=proc_time,
        message="Candidate discovery and ranking completed"
    )
