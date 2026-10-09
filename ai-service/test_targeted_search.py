import requests
import re
import base64
import urllib.parse
from bs4 import BeautifulSoup

def decode_bing_redirect(raw_url: str) -> str:
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

def parse_social_url(actual_url: str, title: str, snippet: str):
    clean_url = decode_bing_redirect(actual_url).split("?")[0].rstrip("/")
    platform, username = None, None

    if "instagram.com/" in clean_url:
        m = re.search(r"instagram\.com/([a-zA-Z0-9_\.]+)", clean_url)
        if m and m.group(1).lower() not in ("p", "reel", "explore", "stories", "accounts", "direct", "about", "tags"):
            platform = "Instagram"
            username = f"@{m.group(1)}"
    elif "linkedin.com/in/" in clean_url:
        m = re.search(r"linkedin\.com/in/([a-zA-Z0-9_\-]+)", clean_url)
        if m:
            platform = "LinkedIn"
            username = m.group(1)
    elif "x.com/" in clean_url or "twitter.com/" in clean_url:
        m = re.search(r"(?:twitter|x)\.com/([a-zA-Z0-9_]+)", clean_url)
        if m and m.group(1).lower() not in ("home", "explore", "search", "i", "intent", "login", "signup", "privacy", "tos", "status"):
            platform = "Twitter / X"
            username = f"@{m.group(1)}"
    elif "github.com/" in clean_url:
        m = re.search(r"github\.com/([a-zA-Z0-9_\-]+)", clean_url)
        if m and m.group(1).lower() not in ("features", "explore", "topics", "trending", "pricing", "login", "signup", "about", "orgs"):
            platform = "GitHub"
            username = m.group(1)
    elif "tiktok.com/@" in clean_url:
        m = re.search(r"tiktok\.com/@([a-zA-Z0-9_\.]+)", clean_url)
        if m:
            platform = "TikTok"
            username = f"@{m.group(1)}"
    elif "facebook.com/" in clean_url:
        m = re.search(r"facebook\.com/([a-zA-Z0-9_\.]+)", clean_url)
        if m and m.group(1).lower() not in ("pages", "groups", "events", "watch", "login", "help", "policies"):
            platform = "Facebook"
            username = f"@{m.group(1)}"

    if not platform or not username:
        return None

    clean_title = re.sub(r"[\(\[].*?[\)\]]", "", title)
    for delim in (" - ", " | ", " – ", " — ", " : ", " • "):
        clean_title = clean_title.split(delim)[0]
    display_name = clean_title.strip() or username.lstrip("@").replace("_", " ").replace("-", " ").title()

    raw_user = username.lstrip("@")
    if platform == "Instagram":
        avatar_url = f"https://unavatar.io/instagram/{raw_user}"
    elif platform == "Twitter / X":
        avatar_url = f"https://unavatar.io/x/{raw_user}"
    elif platform == "GitHub":
        avatar_url = f"https://avatars.githubusercontent.com/{raw_user}"
    else:
        avatar_url = f"https://api.dicebear.com/7.x/initials/svg?seed={urllib.parse.quote(display_name)}"

    return {
        "platform": platform,
        "username": username,
        "name": display_name,
        "publicProfileUrl": clean_url,
        "profileImageUrl": avatar_url,
        "bio": (snippet[:180] + "...") if snippet else f"Discovered public profile on {platform}.",
        "source": f"{platform} Public Directory",
        "verified": True,
    }

def multi_search_social(name: str):
    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    }
    
    candidates = []
    seen = set()

    # Step 1: Broad multi-platform query
    queries = [
        f'"{name}" (site:instagram.com OR site:linkedin.com/in OR site:x.com OR site:twitter.com OR site:github.com)',
        f'site:instagram.com "{name}"',
        f'site:linkedin.com/in "{name}"',
        f'site:x.com "{name}"',
        f'site:github.com "{name}"',
    ]

    for q in queries:
        try:
            url = f"https://www.bing.com/search?q={urllib.parse.quote(q)}"
            r = session.get(url, headers=headers, timeout=5)
            soup = BeautifulSoup(r.text, "html.parser")
            for li in soup.select("li.b_algo"):
                title_el = li.select_one("h2 a")
                snippet_el = li.select_one("p")
                if not title_el:
                    continue
                parsed = parse_social_url(title_el.get("href", ""), title_el.get_text(strip=True), snippet_el.get_text(strip=True) if snippet_el else "")
                if parsed:
                    key = f"{parsed['platform']}_{parsed['username'].lower()}"
                    if key not in seen:
                        seen.add(key)
                        candidates.append(parsed)
            if len(candidates) >= 5:
                break
        except Exception:
            pass

    return candidates

for test_name in ["Elon Musk", "Taylor Swift", "Cristiano Ronaldo", "Sundar Pichai", "Sam Altman", "Linus Torvalds"]:
    res = multi_search_social(test_name)
    print(f"\n=================== {test_name} ({len(res)} results) ===================")
    for idx, c in enumerate(res):
        print(f" {idx+1}. [{c['platform']}] {c['username']} ({c['name']}) -> {c['publicProfileUrl']}")
