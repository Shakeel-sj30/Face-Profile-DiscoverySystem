import re

with open('bing_response.html', 'r', encoding='utf-8') as f:
    html = f.read()

hrefs = re.findall(r'href=["\'](https?://[^"\'><]+)["\']', html)
print('Total hrefs:', len(hrefs))
for h in hrefs[:20]:
    print(' ', h)

# Search for any json structures in script tags
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
print('Total scripts:', len(scripts))
for i, s in enumerate(scripts):
    if 'instagram' in s.lower() or 'musk' in s.lower() or 'image' in s.lower():
        print(f'Script {i} matches keywords! Length: {len(s)}')
        # Print a snippet
        print(s[:300])
