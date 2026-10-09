import os
import io
import re
import numpy as np
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image, ImageDraw
import urllib.parse
import requests

# Load pretrained ResNet18
device = torch.device("cpu")
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
model.fc = torch.nn.Identity()
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def extract_visual_vector(img: Image.Image) -> np.ndarray:
    t = transform(img.convert("RGB")).unsqueeze(0).to(device)
    with torch.no_grad():
        feat = model(t)
        norm = torch.nn.functional.normalize(feat, p=2, dim=1)
        return norm.squeeze(0).numpy()

# Create visual gallery with reference face descriptions & sample images
GALLERY = [
    {
        "name": "Elon Musk",
        "title": "CEO of Tesla, SpaceX, xAI, Owner of X",
        "sample_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg"
    },
    {
        "name": "Sundar Pichai",
        "title": "CEO of Google and Alphabet",
        "sample_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Sundar_pichai.png/220px-Sundar_pichai.png"
    },
    {
        "name": "Sam Altman",
        "title": "CEO of OpenAI",
        "sample_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sam_Altman_TechCrunch_Disrupt_2019_%28cropped%29.jpg/220px-Sam_Altman_TechCrunch_Disrupt_2019_%28cropped%29.jpg"
    },
    {
        "name": "Cristiano Ronaldo",
        "title": "Professional Footballer",
        "sample_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg/220px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg"
    },
    {
        "name": "Taylor Swift",
        "title": "Singer-Songwriter & Global Artist",
        "sample_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png/220px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png"
    },
    {
        "name": "Mark Zuckerberg",
        "title": "Founder & CEO of Meta",
        "sample_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/220px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg"
    },
    {
        "name": "Bill Gates",
        "title": "Co-founder of Microsoft & Philanthropist",
        "sample_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/220px-Bill_Gates_2017_%28cropped%29.jpg"
    },
    {
        "name": "Satya Nadella",
        "title": "Chairman & CEO of Microsoft",
        "sample_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/MS-CEO-Satya-Nadella_%28cropped%29.jpg/220px-MS-CEO-Satya-Nadella_%28cropped%29.jpg"
    },
    {
        "name": "Linus Torvalds",
        "title": "Creator of Linux & Git",
        "sample_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinuxCon_Europe_Linus_Torvalds_03_%28cropped%29.jpg/220px-LinuxCon_Europe_Linus_Torvalds_03_%28cropped%29.jpg"
    },
    {
        "name": "Zendaya",
        "title": "Award-winning Actress & Producer",
        "sample_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Zendaya_-_2019_by_Glenn_Francis.jpg/220px-Zendaya_-_2019_by_Glenn_Francis.jpg"
    }
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print("Computing reference visual vectors for gallery...")
gallery_vectors = []
for item in GALLERY:
    try:
        r = requests.get(item["sample_url"], headers=headers, timeout=6)
        if r.status_code == 200:
            img = Image.open(io.BytesIO(r.content))
            vec = extract_visual_vector(img)
            gallery_vectors.append({
                "name": item["name"],
                "title": item["title"],
                "vector": vec
            })
            print(f" [OK] Indexed: {item['name']}")
    except Exception as e:
        print(f" [ERR] {item['name']}: {e}")

print(f"\nSuccessfully indexed {len(gallery_vectors)} reference visual profiles.")
