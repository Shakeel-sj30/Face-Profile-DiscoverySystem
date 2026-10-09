import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
import io
import requests

# Pretrained model setup
device = torch.device("cpu")
model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
model.classifier = torch.nn.Identity()
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def extract_embedding(pil_img: Image.Image) -> np.ndarray:
    t = transform(pil_img.convert("RGB")).unsqueeze(0)
    with torch.no_grad():
        feat = model(t)
        norm = torch.nn.functional.normalize(feat, p=2, dim=1)
        return norm.squeeze(0).numpy()

def cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:
    return float(np.dot(v1, v2))

# Test with two different images
img1 = Image.new('RGB', (200, 200), color=(100, 150, 200))
img2 = Image.new('RGB', (200, 200), color=(105, 148, 198))
img3 = Image.new('RGB', (200, 200), color=(250, 20, 20))

e1 = extract_embedding(img1)
e2 = extract_embedding(img2)
e3 = extract_embedding(img3)

print("Similarity (similar images):", cosine_similarity(e1, e2))
print("Similarity (different images):", cosine_similarity(e1, e3))
