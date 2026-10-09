import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
import io
import requests

# Set up vision model
device = torch.device("cpu")
model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
model.classifier = torch.nn.Identity()
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def get_face_embedding(pil_img: Image.Image) -> np.ndarray:
    t = transform(pil_img.convert("RGB")).unsqueeze(0).to(device)
    with torch.no_grad():
        feat = model(t)
        norm = torch.nn.functional.normalize(feat, p=2, dim=1)
        return norm.squeeze(0).cpu().numpy()

# Let's test downloading a celebrity image with a generic/random name (e.g. unknown_123.jpg)
elon_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg'
sundar_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Sundar_pichai.png/220px-Sundar_pichai.png'

print("Downloading test face images without name clues...")
elon_img = Image.open(io.BytesIO(requests.get(elon_url, timeout=10).content))
sundar_img = Image.open(io.BytesIO(requests.get(sundar_url, timeout=10).content))

elon_emb = get_face_embedding(elon_img)
sundar_emb = get_face_embedding(sundar_img)

print("Elon embedding norm:", np.linalg.norm(elon_emb))
print("Sundar embedding norm:", np.linalg.norm(sundar_emb))
print("Cross similarity (Elon vs Sundar):", np.dot(elon_emb, sundar_emb))
