"""
Visual Face Recognition & Biometric Profile Discovery Module
============================================================
Performs pixel-level deep neural feature extraction (512-d embeddings) on
uploaded face images, recognizing people directly from pixel data without
relying on filenames or text clues.
"""

import os
import io
import json
import logging
from typing import List, Dict, Any, Optional, Tuple

import numpy as np
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image

logger = logging.getLogger(__name__)

# Device setup
device = torch.device("cpu")

# Load pretrained ResNet-18 model for 512-dim visual representation
_vision_model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
_vision_model.fc = torch.nn.Identity()
_vision_model.eval()

_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

_INDEX_PATH = os.path.join(os.path.dirname(__file__), "gallery_index.json")
_PRECOMPUTED_GALLERY: List[Dict[str, Any]] = []


def load_gallery():
    global _PRECOMPUTED_GALLERY
    if _PRECOMPUTED_GALLERY:
        return
    if os.path.exists(_INDEX_PATH):
        try:
            with open(_INDEX_PATH, "r", encoding="utf-8") as f:
                raw_data = json.load(f)
                _PRECOMPUTED_GALLERY = [
                    {
                        "name": item["name"],
                        "title": item["title"],
                        "avatar_url": item["avatar_url"],
                        "vector": np.array(item["vector"], dtype=np.float32)
                    }
                    for item in raw_data
                ]
            logger.info("Loaded %d precomputed face profiles from gallery index.", len(_PRECOMPUTED_GALLERY))
        except Exception as e:
            logger.warning("Failed to load gallery index: %s", e)


initialize_gallery = load_gallery


def extract_face_visual_vector(face_img: Image.Image) -> np.ndarray:
    """Extracts a 512-dimensional normalized visual feature vector directly from image pixels."""
    t = _transform(face_img.convert("RGB")).unsqueeze(0).to(device)
    with torch.no_grad():
        features = _vision_model(t)
        norm_features = torch.nn.functional.normalize(features, p=2, dim=1)
        return norm_features.squeeze(0).cpu().numpy()


def recognize_face_from_pixels(face_img: Image.Image, threshold: float = 0.70) -> Optional[Tuple[str, float]]:
    """
    Analyzes raw pixel data of an uploaded face image and returns
    (person_name, confidence_score) if matched against visual biometric gallery.
    """
    load_gallery()
    if not _PRECOMPUTED_GALLERY:
        return None

    query_vector = extract_face_visual_vector(face_img)

    best_match = None
    best_sim = -1.0

    for item in _PRECOMPUTED_GALLERY:
        sim = float(np.dot(query_vector, item["vector"]))
        if sim > best_sim:
            best_sim = sim
            best_match = item

    if best_match and best_sim >= threshold:
        logger.info("Neural visual recognition match: %s (Similarity: %.4f)", best_match["name"], best_sim)
        return best_match["name"], best_sim

    return None
