import requests
from bs4 import BeautifulSoup

# Test Bing Search
session = requests.Session()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}

try:
    r = session.get('https://www.bing.com/search?q=site:instagram.com+taylor+swift', headers=headers, timeout=10)
    print('Bing status:', r.status_code)
    soup = BeautifulSoup(r.text, 'html.parser')
    for a in soup.find_all('a', href=True):
        if 'instagram.com' in a['href']:
            print('Bing Instagram link:', a['href'])
            break
except Exception as e:
    print('Bing error:', e)

# Test Yahoo Search
try:
    r = session.get('https://search.yahoo.com/search?p=site:instagram.com+taylor+swift', headers=headers, timeout=10)
    print('Yahoo status:', r.status_code)
    soup = BeautifulSoup(r.text, 'html.parser')
    for a in soup.find_all('a', href=True):
        if 'instagram.com' in a['href']:
            print('Yahoo Instagram link:', a['href'])
            break
except Exception as e:
    print('Yahoo error:', e)
