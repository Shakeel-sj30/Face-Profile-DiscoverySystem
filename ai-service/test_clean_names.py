import re
import os
from typing import Optional

def clean_filename_to_query(filename: Optional[str]) -> Optional[str]:
    if not filename:
        return None

    base = os.path.splitext(filename)[0]
    
    # Check if raw filename is generic (IMG_..., screenshot..., etc)
    lower_base = base.lower().strip()
    generic_patterns = [
        r"^(?:img|dsc|dcm|screenshot|whatsapp|unnamed|download|image|photo|face|pic|frame|capture)[\s_\-\d\(\)]*$",
        r"^[\d\s_\-\(\)\.]+$",
        r"^temp[\s_\-\d]*$"
    ]
    if any(re.match(p, lower_base) for p in generic_patterns):
        return None

    # Split CamelCase: SundarPichai -> Sundar Pichai
    base = re.sub(r"([a-z])([A-Z])", r"\1 \2", base)
    # Replace separators with spaces
    base = re.sub(r"[_\-+.]+", " ", base)

    noise_patterns = [
        r"\b(?:photo|picture|pic|image|screenshot|wallpaper|hd|4k|1080p|1080x1080|crop|thumb|avatar|headshot|official|real|profile|concert)\b",
        r"\b\d{3,4}x\d{3,4}\b",
        r"\b\d{4}\b",
        r"\b(?:img|dsc|dcm|scan)\b",
        r"[\(\)\[\]\{\}]",
    ]
    cleaned = base
    for pat in noise_patterns:
        cleaned = re.sub(pat, " ", cleaned, flags=re.IGNORECASE)

    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    letters_only = re.sub(r"[^a-zA-Z]", "", cleaned)
    if len(letters_only) < 3:
        return None

    return cleaned.title()

test_files = [
    "sundar_pichai_1080x1080.jpg",
    "ElonMusk.png",
    "taylor-swift-2024-concert.webp",
    "IMG_20261009_12345.jpg",
    "Screenshot_2026-10-09.png",
    "cristiano_ronaldo_profile_photo.jpeg",
    "sam_altman.jpg",
    "image(1).png",
    "WhatsApp Image 2026-10-09 at 12.00.00.jpeg",
    "bill_gates_young.png"
]

for f in test_files:
    print(f"{f:45} -> {clean_filename_to_query(f)}")
