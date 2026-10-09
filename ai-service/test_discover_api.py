import requests
import base64
import json
import io
from PIL import Image

# Create a small valid test face image
img = Image.new('RGB', (200, 200), color=(120, 150, 180))
buf = io.BytesIO()
img.save(buf, format='JPEG')
b64 = base64.b64encode(buf.getvalue()).decode('utf-8')

# Test 1: With filename "sundar_pichai.jpg"
payload = {
    "imageBase64": b64,
    "filename": "sundar_pichai.jpg",
    "topK": 5
}
r = requests.post("http://127.0.0.1:8000/internal/ai/discover", json=payload, timeout=10)
print("=== Test 1 (sundar_pichai.jpg) ===")
print("Status:", r.status_code)
data = r.json()
print("Success:", data.get("success"), "| Face Detected:", data.get("faceDetected"))
for c in data.get("candidates", []):
    print(f" - [{c['platform']}] {c['username']} ({c['name']}) -> {c['publicProfileUrl']}")

# Test 2: With nameHint "Elon Musk"
payload2 = {
    "imageBase64": b64,
    "nameHint": "Elon Musk",
    "topK": 5
}
r2 = requests.post("http://127.0.0.1:8000/internal/ai/discover", json=payload2, timeout=10)
print("\n=== Test 2 (nameHint: Elon Musk) ===")
data2 = r2.json()
for c in data2.get("candidates", []):
    print(f" - [{c['platform']}] {c['username']} ({c['name']}) -> {c['publicProfileUrl']}")
