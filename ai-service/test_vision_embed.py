import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np

# Load lightweight pretrained MobileNetV3 or ResNet
print("Loading pretrained vision model...")
model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
model.classifier = torch.nn.Identity() # Extract 576-dim feature vector
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def extract_features(pil_img):
    tensor = transform(pil_img).unsqueeze(0)
    with torch.no_grad():
        feat = model(tensor)
        norm = torch.nn.functional.normalize(feat, p=2, dim=1)
        return norm.squeeze(0).numpy()

img1 = Image.new('RGB', (100, 100), color=(200, 100, 50))
feat1 = extract_features(img1)
print("Extracted feature shape:", feat1.shape, "L2 norm:", np.linalg.norm(feat1))
