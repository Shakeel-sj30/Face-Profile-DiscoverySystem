import re
from bs4 import BeautifulSoup

with open("lens_response.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

# Find all visible text chunks
texts = [t.strip() for t in soup.stripped_strings if len(t.strip()) > 2]
print("=== Total text fragments:", len(texts), "===")
for t in texts[:30]:
    print(" -", t)

# Search for any visual match titles, entities, or labels in script tags
scripts = soup.find_all("script")
print("\n=== Total scripts:", len(scripts), "===")
for i, s in enumerate(scripts):
    txt = s.get_text()
    if any(k in txt.lower() for k in ["elon", "musk", "tesla", "visual", "match", "entity", "title", "http"]):
        print(f"Script {i} length {len(txt)}")
        # Look for strings inside JSON arrays like ["Elon Musk", ...]
        matches = re.findall(r'\"([A-Z][a-zA-Z0-9\s\-_]{2,40})\"', txt)
        # Filter interesting entity names
        entities = [m for m in matches if any(c.isupper() for c in m) and len(m.split()) <= 4]
        print(f"  Sample entity candidates in script {i}:", entities[:10])
