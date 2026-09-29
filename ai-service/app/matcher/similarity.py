import numpy as np

def cosine_similarity(embedding1: list[float], embedding2: list[float]) -> float:
    """
    Computes cosine similarity between two 512d vectors.
    Returns float score between -1.0 and 1.0 (clamped to 0.0 - 1.0 range).
    """
    v1 = np.array(embedding1, dtype=np.float32)
    v2 = np.array(embedding2, dtype=np.float32)
    
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
        
    dot_product = np.dot(v1, v2)
    sim = dot_product / (norm1 * norm2)
    
    # Bound to [0.0, 1.0] for similarity percentage display
    return float(np.clip(sim, 0.0, 1.0))
