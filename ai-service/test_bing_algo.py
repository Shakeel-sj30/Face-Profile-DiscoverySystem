import requests
from bs4 import BeautifulSoup

session = requests.Session()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}

r = session.get('https://www.bing.com/search?q=site:instagram.com+taylor+swift', headers=headers, timeout=10)
soup = BeautifulSoup(r.text, 'html.parser')
results = []
for li in soup.select('li.b_algo'):
    title_el = li.select_one('h2 a')
    snippet_el = li.select_one('p')
    if title_el:
        url = title_el.get('href', '')
        title = title_el.get_text(strip=True)
        snippet = snippet_el.get_text(strip=True) if snippet_el else ''
        results.append({'url': url, 'title': title, 'snippet': snippet})

print('Found', len(results), 'Bing results:')
for res in results[:5]:
    print('-', res['title'], '|', res['url'])
