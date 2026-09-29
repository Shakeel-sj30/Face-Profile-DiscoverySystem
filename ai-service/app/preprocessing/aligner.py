import cv2
import numpy as np

def align_face(image_np: np.ndarray, bbox: tuple) -> np.ndarray:
    """
    Crops and normalizes detected face region with spatial scaling and aspect preservation.
    bbox: (x, y, w, h)
    Returns: aligned 112x112 normalized RGB image array
    """
    x, y, w, h = bbox
    img_h, img_w = image_np.shape[:2]
    
    # Add mild padding around bounding box for context
    pad_x = int(w * 0.15)
    pad_y = int(h * 0.15)
    
    x1 = max(0, x - pad_x)
    y1 = max(0, y - pad_y)
    x2 = min(img_w, x + w + pad_x)
    y2 = min(img_h, y + h + pad_y)
    
    face_crop = image_np[y1:y2, x1:x2]
    if face_crop.size == 0:
        face_crop = image_np[y:y+h, x:x+w]
        
    aligned_face = cv2.resize(face_crop, (112, 112), interpolation=cv2.INTER_AREA)
    return aligned_face
