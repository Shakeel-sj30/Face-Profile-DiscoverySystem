import requests
import re
import json
import io
from PIL import Image
from bs4 import BeautifulSoup

session = requests.Session()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Referer': 'https://www.bing.com/images/search?view=detailv2&iss=sbi'
}

# Download a sample celebrity image
img_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg'
print("Downloading sample test image...")
img_bytes = requests.get(img_url, timeout=10).content

files = {'imageBin': ('query.jpg', img_bytes, 'image/jpeg')}
print("Uploading to Bing Visual Search...")
r = session.post('https://www.bing.com/images/search?view=detailv2&iss=sbiupload', files=files, headers=headers, allow_redirects=True, timeout=12)

print("Status:", r.status_code)
print("Final URL:", r.url)

with open("bing_response.html", "w", encoding="utf-8") as f:
    f.write(r.text)

print("Saved response HTML (size:", len(r.text), ")")

soup = BeautifulSoup(r.text, 'html.parser')

# Search for any social media links
social_links = []
for a in soup.find_all('a', href=True):
    href = a['href']
    text = a.get_text(strip=True)
    if any(p in href for p in ['instagram.com', 'linkedin.com/in', 'twitter.com', 'x.com', 'github.com', 'facebook.com', 'wikipedia.org']):
        social_links.append((text, href))

print("Found social links:", len(social_links))
for text, href in social_links[:10]:
    print(" -", text, "->", href[:90])

# Search for visual matches, page titles, or entity text
titles = []
for el in soup.find_all(['h2', 'h3', 'a', 'span', 'div']):
    txt = el.get_text(strip=True)
    if len(txt) > 3 and len(txt) < 80:
        if any(w in txt.lower() for w in ['musk', 'elon', 'profile', 'biography', 'twitter', 'instagram']):
            titles.append(txt)

print("Found title clues:", len(titles))
for t in list(dict.fromkeys(titles))[:10]:
    print(" *", t)
