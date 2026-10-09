import requests
import re
import base64
import urllib.parse
from bs4 import BeautifulSoup

def decode_bing_redirect(raw_url: str) -> str:
    """Decodes Bing redirect URLs (u=a1...) into actual destination URLs."""
    if "bing.com/ck/a" in raw_url and "u=a1" in raw_url:
        m = re.search(r"u=a1([a-zA-Z0-9_\-]+)", raw_url)
        if m:
            b64_str = m.group(1)
            b64_str += "=" * ((4 - len(b64_str) % 4) % 4)
            try:
                decoded = base64.urlsafe_b64decode(b64_str).decode("utf-8", errors="ignore")
                if decoded.startswith("http"):
                    return decoded
            except Exception:
                pass
    return raw_url

def search_person_across_platforms(name: str):
    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    }

    platforms = [
        ("Instagram", f'site:instagram.com "{name}"', r"instagram\.com/([a-zA-Z0-9_\.]+)"),
        ("LinkedIn", f'site:linkedin.com/in "{name}"', r"linkedin\.com/in/([a-zA-Z0-9_\-]+)"),
        ("Twitter / X", f'(site:x.com OR site:twitter.com) "{name}"', r"(?:twitter|x)\.com/([a-zA-Z0-9_]+)"),
        ("GitHub", f'site:github.com "{name}"', r"github\.com/([a-zA-Z0-9_\-]+)"),
    ]

    all_results = []
    
    # Also do a unified query
    unified_q = f'"{name}" (site:instagram.com OR site:linkedin.com/in OR site:x.com OR site:twitter.com OR site:github.com)'
    try:
        url = f"https://www.bing.com/search?q={urllib.parse.quote(unified_q)}"
        r = session.get(url, headers=headers, timeout=8)
        soup = BeautifulSoup(r.text, "html.parser")
        
        for li in soup.select("li.b_algo"):
            title_el = li.select_one("h2 a")
            snippet_el = li.select_one("p")
            if not title_el:
                continue
            raw_url = title_el.get("href", "")
            actual_url = decode_bing_redirect(raw_url).split("?")[0].rstrip("/")
            title = title_el.get_text(strip=True)
            snippet = snippet_el.get_text(strip=True) if snippet_el else ""

            # Check matches
            matched_plat = None
            matched_user = None
            if "instagram.com/" in actual_url:
                m = re.search(r"instagram\.com/([a-zA-Z0-9_\.]+)", actual_url)
                if m and m.group(1).lower() not in ("p", "reel", "explore", "stories", "accounts", "direct", "about"):
                    matched_plat = "Instagram"
                    matched_user = f"@{m.group(1)}"
            elif "linkedin.com/in/" in actual_url:
                m = re.search(r"linkedin\.com/in/([a-zA-Z0-9_\-]+)", actual_url)
                if m:
                    matched_plat = "LinkedIn"
                    matched_user = m.group(1)
            elif "x.com/" in actual_url or "twitter.com/" in actual_url:
                m = re.search(r"(?:twitter|x)\.com/([a-zA-Z0-9_]+)", actual_url)
                if m and m.group(1).lower() not in ("home", "explore", "search", "i", "intent", "login", "signup", "privacy", "tos"):
                    matched_plat = "Twitter / X"
                    matched_user = f"@{m.group(1)}"
            elif "github.com/" in actual_url:
                m = re.search(r"github\.com/([a-zA-Z0-9_\-]+)", actual_url)
                if m and m.group(1).lower() not in ("features", "explore", "topics", "trending", "pricing", "login", "signup", "about"):
                    matched_plat = "GitHub"
                    matched_user = m.group(1)

            if matched_plat and matched_user:
                all_results.append({
                    "platform": matched_plat,
                    "username": matched_user,
                    "title": title,
                    "snippet": snippet,
                    "url": actual_url
                })
    except Exception as e:
        print("Unified search error:", e)

    return all_results

for test_name in ["Sundar Pichai", "Elon Musk", "Taylor Swift", "Zendaya", "Bill Gates", "Linus Torvalds"]:
    res = search_person_across_platforms(test_name)
    print(f"\n=================== {test_name} ({len(res)} results) ===================")
    for r in res:
        print(f"[{r['platform']}] {r['username']} -> {r['url']}")
        print(f"   Snippet: {r['snippet'][:100]}...")
