import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
import io

class ArcFaceEmbedder:
    def __init__(self):
        # Build ResNet-based ArcFace feature extractor producing 512d normalized vectors
        self.device = torch.device("cpu")
        base_model = models.resnet18(weights=None)
        # Replace FC layer to output 512-dim embedding space
        num_ftrs = base_model.fc.in_features
        base_model.fc = nn.Linear(num_ftrs, 512)
        
        self.model = base_model.to(self.device)
        self.model.eval()
        
        self.transform = transforms.Compose([
            transforms.Resize((112, 112)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    def get_embedding(self, face_np: np.ndarray) -> list[float]:
        pil_img = Image.fromarray(face_np).convert("RGB")
        tensor_img = self.transform(pil_img).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            features = self.model(tensor_img)
            # Apply L2 normalization
            norm_features = torch.nn.functional.normalize(features, p=2, dim=1)
            embedding = norm_features.squeeze(0).cpu().numpy().tolist()
            
        return embedding

embedder = ArcFaceEmbedder()
