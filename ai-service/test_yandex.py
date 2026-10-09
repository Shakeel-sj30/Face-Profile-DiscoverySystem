import requests
import re
import json
import urllib.parse
from PIL import Image
import io

session = requests.Session()
img = Image.new('RGB', (100, 100), color=(100, 150, 200))
buf = io.BytesIO()
img.save(buf, format='JPEG')
image_bytes = buf.getvalue()

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}

init_resp = session.get('https://yandex.com/images/', headers=headers, timeout=10)
sk_match = re.search(r'"sk":"([^"]+)"', init_resp.text)
sk = sk_match.group(1) if sk_match else ''
print('Yandex sk:', bool(sk))

upload_url = 'https://yandex.com/images/upload'
files = {'upfile': ('query.jpg', image_bytes, 'image/jpeg')}
params = {'prg': '1', 'rpt': 'imageview', 'sk': sk}

h = dict(headers)
h.update({
    'Referer': 'https://yandex.com/images/',
    'Origin': 'https://yandex.com',
    'X-Requested-With': 'XMLHttpRequest'
})

resp = session.post(upload_url, files=files, params=params, headers=h, timeout=10)
print('Yandex upload status:', resp.status_code)
print('Yandex upload response:', resp.text[:500])
