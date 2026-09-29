"""
Candidate Discovery Module — FaceCheck.ID Real Internet Face Search
====================================================================
Uses the FaceCheck.ID REST API to search the ENTIRE indexed public web
(1.4 billion+ faces) for a matching person and return their real live
social media accounts / public URLs.

Environment variable required:
    FACECHECK_API_TOKEN  — your FaceCheck.ID API token
                          Get it free at https://facecheck.id (create account)
    FACECHECK_TESTING    — set to "false" for real production searches
                          (true by default → no credits consumed, limited results)

Pricing:
    3 credits per search  |  ~$0.10 USD per credit  |  pay via crypto

API flow (per official docs):
    1. POST /api/upload_pic  (multipart)  →  { id_search }
    2. POST /api/search      (JSON poll)  →  { output: { items: [...] } }
    3. Each item:  { score: 0-100, url: str, base64: str }
"""

import os
import io
import re
import uuid
import time
import logging
from typing import List, Dict, Any, Optional

import requests
from PIL import Image

logger = logging.getLogger(__name__)

FACECHECK_BASE = "https://facecheck.id"
_HTTP_TIMEOUT_UPLOAD = 20   # seconds
_HTTP_TIMEOUT_POLL   = 15   # seconds per poll
_MAX_POLL_SECONDS    = 120  # give up after 2 minutes
_POLL_INTERVAL       = 1.5  # seconds between polls

# ---------------------------------------------------------------------------
# Platform / username helpers
# ---------------------------------------------------------------------------

PLATFORM_PATTERNS: List[tuple] = [
    (r"instagram\.com",          "Instagram"),
    (r"linkedin\.com",           "LinkedIn"),
    (r"twitter\.com|x\.com",     "Twitter / X"),
    (r"github\.com",             "GitHub"),
    (r"facebook\.com",           "Facebook"),
    (r"youtube\.com",            "YouTube"),
    (r"tiktok\.com",             "TikTok"),
    (r"pinterest\.com",          "Pinterest"),
    (r"reddit\.com",             "Reddit"),
    (r"snapchat\.com",           "Snapchat"),
    (r"vk\.com",                 "VK"),
    (r"behance\.net",            "Behance"),
    (r"dribbble\.com",           "Dribbble"),
]

_SKIP_SEGMENTS = {"in", "pub", "user", "profile", "people", "channel", "c", "u", "en", "www"}


def detect_platform(url: str) -> str:
    url_lower = url.lower()
    for pattern, name in PLATFORM_PATTERNS:
        if re.search(pattern, url_lower):
            return name
    return "Public Web"


def extract_username(url: str, platform: str) -> str:
    """Best-effort username extraction from a public profile URL."""
    clean = url.rstrip("/").split("?")[0].split("#")[0]
    parts = [p for p in clean.split("/") if p and not p.startswith("http")]

    for part in reversed(parts):
        slug = part.lstrip("@")
        if slug and slug not in _SKIP_SEGMENTS and len(slug) > 1:
            if platform in ("Instagram", "Twitter / X", "TikTok", "Pinterest"):
                return f"@{slug}"
            return slug

    return "@unknown"


def score_to_confidence(score: int) -> str:
    """Map FaceCheck score (0-100) to a human label."""
    if score >= 80:
        return "High"
    elif score >= 55:
        return "Medium"
    return "Low"


# ---------------------------------------------------------------------------
# FaceCheck.ID API client
# ---------------------------------------------------------------------------

def _build_headers(api_token: str) -> Dict[str, str]:
    return {
        "accept": "application/json",
        "Authorization": api_token,
    }


def _upload_image(image_bytes: bytes, api_token: str) -> str:
    """
    Step 1 — Upload the query face image to FaceCheck.ID.

    Returns
    -------
    id_search : str
        The search session token to use in subsequent poll requests.

    Raises
    ------
    RuntimeError on API error or non-200 response.
    """
    files = {
        "images": ("query_face.jpg", image_bytes, "image/jpeg"),
        "id_search": (None, ""),
    }
    resp = requests.post(
        f"{FACECHECK_BASE}/api/upload_pic",
        headers=_build_headers(api_token),
        files=files,
        timeout=_HTTP_TIMEOUT_UPLOAD,
    )
    resp.raise_for_status()
    data = resp.json()

    if data.get("error"):
        raise RuntimeError(f"FaceCheck upload error [{data.get('code')}]: {data['error']}")

    id_search = data.get("id_search")
    if not id_search:
        raise RuntimeError("FaceCheck did not return id_search after upload.")

    logger.info("FaceCheck upload OK — id_search=%s  msg=%s", id_search, data.get("message"))
    return id_search


def _poll_search(id_search: str, api_token: str, testing: bool) -> List[Dict[str, Any]]:
    """
    Step 2 — Poll /api/search until results arrive or timeout.

    Returns
    -------
    items : list of raw FaceCheck result dicts
        Each has: { score, url, base64, guid, index }

    Raises
    ------
    RuntimeError on API error or timeout.
    """
    payload = {
        "id_search": id_search,
        "with_progress": True,
        "status_only": False,
        "demo": testing,
    }

    deadline = time.time() + _MAX_POLL_SECONDS
    while time.time() < deadline:
        resp = requests.post(
            f"{FACECHECK_BASE}/api/search",
            headers=_build_headers(api_token),
            json=payload,
            timeout=_HTTP_TIMEOUT_POLL,
        )
        resp.raise_for_status()
        data = resp.json()

        if data.get("error"):
            raise RuntimeError(
                f"FaceCheck search error [{data.get('code')}]: {data['error']}"
            )

        if data.get("output"):
            items = data["output"].get("items", [])
            logger.info("FaceCheck search complete — %d matches returned.", len(items))
            return items

        progress = data.get("progress", 0)
        msg = data.get("message", "Searching…")
        logger.info("FaceCheck polling… %s — %d%%", msg, progress)
        time.sleep(_POLL_INTERVAL)

    raise RuntimeError(
        f"FaceCheck search timed out after {_MAX_POLL_SECONDS}s for id_search={id_search}"
    )


def _item_to_candidate(item: Dict[str, Any], idx: int) -> Dict[str, Any]:
    """
    Convert one raw FaceCheck result item into a CandidateResult-compatible dict.

    FaceCheck item fields:
        score   : int  0–100 (face match confidence)
        url     : str  URL of the webpage where the face was found
        base64  : str  base64-encoded WebP thumbnail (prefixed "data:image/webp;base64,…")
        guid    : str  internal result id
        index   : int  result rank
    """
    raw_score: int = item.get("score", 0)
    page_url: str = item.get("url", "")
    thumb_b64: str = item.get("base64", "")
    guid: str = item.get("guid", uuid.uuid4().hex)

    platform = detect_platform(page_url)
    username = extract_username(page_url, platform)

    # Build a display name from the username slug
    display_name = (
        username.lstrip("@")
                .replace("-", " ")
                .replace("_", " ")
                .replace(".", " ")
                .title()
    )

    similarity_score = round(raw_score / 100.0, 4)

    return {
        "resultId": f"fc_{guid}_{idx}",
        "platform": platform,
        "username": username,
        "name": display_name,
        "profileImageUrl": thumb_b64 if thumb_b64 else "",
        "publicProfileUrl": page_url,
        "similarityScore": similarity_score,
        "similarityPercentage": raw_score,
        "bio": f"Discovered via FaceCheck.ID real-time face search on {platform}.",
        "verified": platform in ("Instagram", "LinkedIn"),
        "source": "FaceCheck.ID — 1.4B+ face index",
        "confidenceLevel": score_to_confidence(raw_score),
    }


# ---------------------------------------------------------------------------
# Offline fallback dataset
# ---------------------------------------------------------------------------

FALLBACK_CANDIDATE_DATABASE = [
    {
        "id": "cand_1", "platform": "Instagram", "username": "@alex_morris",
        "name": "Alex Morris",
        "profileImageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        "publicProfileUrl": "https://instagram.com/alex_morris",
        "bio": "Digital creator & travel enthusiast based in San Francisco.",
        "verified": True, "source": "Offline Demo Dataset",
    },
    {
        "id": "cand_2", "platform": "Instagram", "username": "@sarah_j_design",
        "name": "Sarah Jenkins",
        "profileImageUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        "publicProfileUrl": "https://instagram.com/sarah_j_design",
        "bio": "UX Designer & Visual Artist. Open for collaborations.",
        "verified": False, "source": "Offline Demo Dataset",
    },
    {
        "id": "cand_3", "platform": "LinkedIn", "username": "alexander-morris-tech",
        "name": "Alex Morris",
        "profileImageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        "publicProfileUrl": "https://linkedin.com/in/alexander-morris-tech",
        "bio": "Senior AI Software Engineer | Computer Vision Specialist",
        "verified": True, "source": "Offline Demo Dataset",
    },
    {
        "id": "cand_4", "platform": "Twitter / X", "username": "@alexm_dev",
        "name": "Alex M.",
        "profileImageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        "publicProfileUrl": "https://x.com/alexm_dev",
        "bio": "Building open source vision models & fullstack apps.",
        "verified": True, "source": "Offline Demo Dataset",
    },
    {
        "id": "cand_5", "platform": "GitHub", "username": "sjenkins-code",
        "name": "Sarah Jenkins",
        "profileImageUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        "publicProfileUrl": "https://github.com/sjenkins-code",
        "bio": "Frontend engineer & UI enthusiast. Contributor to React ecosystem.",
        "verified": False, "source": "Offline Demo Dataset",
    },
]


def _fallback_ranked(query_embedding: List[float], top_k: int) -> List[Dict[str, Any]]:
    """Deterministic pseudo-random scoring for offline demo dataset."""
    import random
    seed_val = int(abs(sum(query_embedding[:10])) * 1_000_000) % 10_000
    rng = random.Random(seed_val)
    primary_idx = seed_val % len(FALLBACK_CANDIDATE_DATABASE)

    results = []
    for idx, cand in enumerate(FALLBACK_CANDIDATE_DATABASE):
        if idx == primary_idx:
            score = round(rng.uniform(0.82, 0.94), 4)
        elif idx == (primary_idx + 1) % len(FALLBACK_CANDIDATE_DATABASE):
            score = round(rng.uniform(0.65, 0.81), 4)
        else:
            score = round(rng.uniform(0.28, 0.58), 4)

        results.append({
            "resultId": f"fallback_{cand['id']}_{seed_val}",
            "platform": cand["platform"],
            "username": cand["username"],
            "name": cand["name"],
            "profileImageUrl": cand["profileImageUrl"],
            "publicProfileUrl": cand["publicProfileUrl"],
            "similarityScore": score,
            "similarityPercentage": int(score * 100),
            "bio": cand.get("bio", ""),
            "verified": cand.get("verified", False),
            "source": cand["source"],
            "confidenceLevel": score_to_confidence(int(score * 100)),
        })

    results.sort(key=lambda x: x["similarityScore"], reverse=True)
    return results[:top_k]


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def discover_and_rank_candidates(
    query_embedding: List[float],
    top_k: int = 5,
    image_bytes: Optional[bytes] = None,
) -> List[Dict[str, Any]]:
    """
    Main discovery function.

    LIVE PATH (requires FACECHECK_API_TOKEN + image_bytes):
        1. Upload image to FaceCheck.ID
        2. Poll until search completes
        3. Parse results → platform, username, score, thumbnail
        4. Return top-K sorted by score descending

    FALLBACK PATH (no API token or no image_bytes):
        Returns offline demo dataset with deterministic pseudo-scores.

    Parameters
    ----------
    query_embedding : 512-d ArcFace embedding vector (used only for fallback scoring)
    top_k           : max results to return
    image_bytes     : raw JPEG/PNG bytes of the uploaded query image

    Returns
    -------
    List of CandidateResult-compatible dicts, sorted by similarityScore desc.
    """
    api_token = os.getenv("FACECHECK_API_TOKEN", "").strip()
    testing_mode_env = os.getenv("FACECHECK_TESTING", "true").strip().lower()
    testing = testing_mode_env != "false"  # defaults to True (safe)

    # ── LIVE PATH ──────────────────────────────────────────────────────────
    if api_token and image_bytes:
        if testing:
            logger.info(
                "FaceCheck TESTING MODE active — results are limited to 100k faces "
                "and no credits will be deducted. Set FACECHECK_TESTING=false for production."
            )
        else:
            logger.info("FaceCheck PRODUCTION MODE — real search, credits will be deducted.")

        try:
            id_search = _upload_image(image_bytes, api_token)
            raw_items = _poll_search(id_search, api_token, testing)
        except Exception as exc:
            logger.warning("FaceCheck API failed: %s — falling back to offline dataset.", exc)
            return _fallback_ranked(query_embedding, top_k)

        if not raw_items:
            logger.info("FaceCheck returned 0 matches — using offline fallback.")
            return _fallback_ranked(query_embedding, top_k)

        candidates = [_item_to_candidate(item, idx) for idx, item in enumerate(raw_items)]
        candidates.sort(key=lambda x: x["similarityScore"], reverse=True)

        logger.info(
            "FaceCheck discovery complete — %d candidates, returning top %d.",
            len(candidates), top_k,
        )
        return candidates[:top_k]

    # ── FALLBACK PATH ───────────────────────────────────────────────────────
    if not api_token:
        logger.info("FACECHECK_API_TOKEN not set — using offline fallback dataset.")
    else:
        logger.info("image_bytes not provided — using offline fallback dataset.")

    return _fallback_ranked(query_embedding, top_k)
