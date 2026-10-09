import requests
import re
import base64
import urllib.parse
from bs4 import BeautifulSoup

def clean_social_url(raw_url: str) -> str:
    """Decodes Bing redirect URLs to actual social media profile URLs."""
    if 'bing.com/ck/a' in raw_url and 'u=a1' in raw_url:
        m = re.search(r'u=a1([a-zA-Z0-9_\-]+)', raw_url)
        if m:
            b64_str = m.group(1)
            # Add padding if needed
            b64_str += '=' * ((4 - len(b64_str) % 4) % 4)
            try:
                decoded = base64.urlsafe_b64decode(b64_str).decode('utf-8', errors='ignore')
                if decoded.startswith('http'):
                    return decoded
            except Exception:
                pass
    return raw_url

def search_social_profiles(query: str):
    session = requests.Session()
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
    }

    # Search across Instagram, LinkedIn, Twitter/X, GitHub
    search_q = f"{query} (site:instagram.com OR site:linkedin.com/in OR site:twitter.com OR site:x.com OR site:github.com)"
    url = f"https://www.bing.com/search?q={urllib.parse.quote(search_q)}"
    
    r = session.get(url, headers=headers, timeout=6)
    soup = BeautifulSoup(r.text, 'html.parser')
    
    candidates = []
    for li in soup.select('li.b_algo'):
        title_el = li.select_one('h2 a')
        snippet_el = li.select_one('p')
        if not title_el:
            continue
            
        raw_url = title_el.get('href', '')
        actual_url = clean_social_url(raw_url)
        title = title_el.get_text(strip=True)
        snippet = snippet_el.get_text(strip=True) if snippet_el else ''
        
        # Determine platform
        platform = None
        username = None
        if 'instagram.com' in actual_url and '/p/' not in actual_url and '/reel/' not in actual_url:
            platform = 'Instagram'
            m = re.search(r'instagram\.com/([a-zA-Z0-9_\.]+)', actual_url)
            if m and m.group(1) not in ('p', 'reel', 'explore', 'stories'):
                username = f"@{m.group(1)}"
        elif 'linkedin.com/in/' in actual_url:
            platform = 'LinkedIn'
            m = re.search(r'linkedin\.com/in/([a-zA-Z0-9_\-]+)', actual_url)
            if m:
                username = m.group(1)
        elif ('twitter.com' in actual_url or 'x.com' in actual_url) and '/status/' not in actual_url:
            platform = 'Twitter / X'
            m = re.search(r'(?:twitter|x)\.com/([a-zA-Z0-9_]+)', actual_url)
            if m and m.group(1) not in ('home', 'explore', 'search', 'i'):
                username = f"@{m.group(1)}"
        elif 'github.com' in actual_url:
            platform = 'GitHub'
            m = re.search(r'github\.com/([a-zA-Z0-9_\-]+)', actual_url)
            if m and m.group(1) not in ('features', 'explore', 'topics', 'trending', 'pricing'):
                username = m.group(1)

        if platform and username:
            candidates.append({
                'platform': platform,
                'username': username,
                'name': title.split('(')[0].split('–')[0].split('-')[0].strip(),
                'publicProfileUrl': actual_url,
                'bio': snippet,
            })

    return candidates

# Test with a real query
res = search_social_profiles("Sundar Pichai")
print(f"Found {len(res)} social profiles for Sundar Pichai:")
for c in res:
    print(f" - {c['platform']}: {c['username']} ({c['publicProfileUrl']})")
