import requests
import re
from bs4 import BeautifulSoup

# Let's test Google Lens image upload endpoint
session = requests.Session()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

# Download a sample celebrity test image (Elon Musk)
img_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg'
img_bytes = requests.get(img_url, timeout=10).content

# Test Google Lens multipart upload
upload_url = 'https://lens.google.com/v3/upload'
files = {
    'encoded_image': ('image.jpg', img_bytes, 'image/jpeg')
}

try:
    r = session.post(upload_url, files=files, headers=headers, allow_redirects=True, timeout=12)
    print("Google Lens Status:", r.status_code)
    print("Google Lens Final URL:", r.url)
    print("Response Length:", len(r.text))
    
    with open("lens_response.html", "w", encoding="utf-8") as f:
        f.write(r.text)
        
    soup = BeautifulSoup(r.text, 'html.parser')
    
    # Check for visual matches or entity labels in Google Lens response
    # Often in data attributes or json scripts
    text_corpus = soup.get_text()
    for name in ["Elon Musk", "Musk", "Tesla", "SpaceX", "Twitter", "Pichai", "Swift"]:
        if name.lower() in text_corpus.lower():
            print(f"-> Found keyword '{name}' in Google Lens response!")
            
    # Search for all hrefs to social media or news
    socials = []
    for a in soup.find_all('a', href=True):
        href = a['href']
        if any(dom in href for dom in ['instagram.com', 'twitter.com', 'x.com', 'linkedin.com', 'wikipedia.org', 'facebook.com', 'youtube.com']):
            socials.append(href)
    print("Discovered social/wiki links:", len(socials))
    for s in socials[:10]:
        print("  *", s)
except Exception as e:
    print("Google Lens Error:", e)
