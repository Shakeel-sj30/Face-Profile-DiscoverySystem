import requests
import re
import json

session = requests.Session()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}

# Test Yandex visual search with image URL
img_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg'

try:
    r = session.get(f'https://yandex.com/images/search?rpt=imageview&url={img_url}', headers=headers, timeout=10)
    print('Yandex status:', r.status_code)
    # Check for tags or text
    tags = re.findall(r'<a class="Button2[^>]*>.*?<span class="Button2-Text">([^<]+)</span>', r.text)
    print('Yandex tags:', tags[:10])
    
    # Check for titles
    titles = re.findall(r'"title":"([^"]+)"', r.text)
    print('Yandex titles:', titles[:5])
    
    # Check for any social profile links in yandex results
    links = re.findall(r'href="(https?://[^"]*(?:instagram|twitter|x\.com|linkedin|github)[^"]*)"', r.text)
    print('Yandex social links:', links[:5])
except Exception as e:
    print('Yandex error:', e)
