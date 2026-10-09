import requests
import io
from PIL import Image
from app.visual_matcher.face_analyzer import recognize_face_from_pixels, initialize_gallery

print("Initializing face visual gallery...")
initialize_gallery()

# Test 1: Download an avatar from the web (simulate user uploading a downloaded picture named IMG_1234.jpg)
headers = {'User-Agent': 'Mozilla/5.0'}
test_cases = [
    ("Elon Musk", "https://unavatar.io/x/elonmusk"),
    ("Sundar Pichai", "https://unavatar.io/x/sundarpichai"),
    ("Sam Altman", "https://unavatar.io/x/sama"),
    ("Linus Torvalds", "https://avatars.githubusercontent.com/torvalds"),
    ("Bill Gates", "https://unavatar.io/x/BillGates"),
]

print("\n=== Testing Visual Recognition on Anonymous Images (Generic File / No Name Given) ===")
for expected_name, url in test_cases:
    r = requests.get(url, headers=headers, timeout=5)
    img = Image.open(io.BytesIO(r.content))
    
    # Analyze the raw pixels!
    result = recognize_face_from_pixels(img)
    if result:
        rec_name, sim = result
        status = "PASSED" if rec_name == expected_name else "MISMATCH"
        print(f"[{status}] Analyzed image pixels -> Recognized: {rec_name:15} (Confidence: {sim*100:.1f}%) [Expected: {expected_name}]")
    else:
        print(f"[UNKNOWN] Could not match image pixels for {expected_name}")
