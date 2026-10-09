import requests
from bs4 import BeautifulSoup
import re

session = requests.Session()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}

upload_url = 'https://www.bing.com/images/search?view=detailv2&iss=sbiupload'
# Load an image or dummy
files = {'imageBin': ('face.jpg', b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' \",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xbf\x00\xff\xd9', 'image/jpeg')}
r = session.post(upload_url, files=files, headers=headers, timeout=10)

soup = BeautifulSoup(r.text, 'html.parser')
print('Links count:', len(soup.find_all('a')))
# Check for any murl (image urls) or turl or page urls
matches = re.findall(r'murl&quot;:&quot;(http[^&]+)&quot;', r.text)
print('murl matches:', len(matches), matches[:3])
purl_matches = re.findall(r'purl&quot;:&quot;(http[^&]+)&quot;', r.text)
print('purl matches:', len(purl_matches), purl_matches[:3])
title_matches = re.findall(r't&quot;:&quot;([^&]+)&quot;', r.text)
print('title matches:', len(title_matches), title_matches[:3])
