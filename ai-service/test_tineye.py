import requests
import re
from bs4 import BeautifulSoup

session = requests.Session()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Origin': 'https://tineye.com',
    'Referer': 'https://tineye.com/',
}

# Sample image
img_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg'
img_bytes = requests.get(img_url, timeout=10).content

files = {'image': ('query.jpg', img_bytes, 'image/jpeg')}
try:
    r = session.post('https://tineye.com/search', files=files, headers=headers, allow_redirects=True, timeout=12)
    print("TinEye Status:", r.status_code)
    print("TinEye Final URL:", r.url)
    print("Response Length:", len(r.text))
    
    soup = BeautifulSoup(r.text, 'html.parser')
    # Find match domains or titles
    matches = soup.select('.match')
    print("TinEye matches found:", len(matches))
    for m in matches[:5]:
        title = m.select_one('h4')
        link = m.select_one('a')
        print("  - Title:", title.get_text(strip=True) if title else "None", "| Link:", link.get('href', '') if link else "None")
except Exception as e:
    print("TinEye error:", e)
