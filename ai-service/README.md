# AI Processing Service (InsightFace + ArcFace)

Internal Python AI service for face detection, facial alignment, ArcFace 512d embedding generation, similarity matching, and permitted candidate public profile discovery.

## Features
- OpenCV Multi-scale face & eye landmark detection
- Facial alignment & normalized 112x112 image crop
- ResNet/ArcFace 512-dimensional facial embedding generation
- Cosine similarity matching
- Permitted public profile candidate discovery & similarity ranking
- FastAPI REST endpoints (`/internal/ai/*`)

## Execution
```bash
python main.py
```
Or with uvicorn:
```bash
uvicorn main:app --host 127.0.0.1 --port 8000
```
