#!/usr/bin/env python3
"""Package one license-compatible scenic photograph into static GitHub Pages.

The photo is illustrative site artwork (not a labeled NJ location).
Source: Unsplash photo by Devin H (https://unsplash.com/photos/aT3VvFtsEQ8);
the Unsplash License permits free commercial use.
"""
from __future__ import annotations
from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen
from PIL import Image, ImageOps

SOURCE = ("https://images.unsplash.com/photo-1569302911021-297d2362e3d3"
          "?auto=format&fit=crop&w=2400&q=86")
TARGET = Path(__file__).resolve().parents[1] / "assets/brand/zoco-service-area-sunset.jpg"


def main() -> None:
    request = Request(SOURCE, headers={"User-Agent": "Mozilla/5.0 ZoCoSiteAsset/1.0"})
    with urlopen(request, timeout=40) as response:
        data = response.read(12_000_001)
    if not data or len(data) > 12_000_000:
        raise RuntimeError("Scenic photo download empty or oversized")
    with Image.open(BytesIO(data)) as original:
        photo = ImageOps.exif_transpose(original).convert("RGB")
        if min(photo.size) < 600:
            raise RuntimeError(f"Source image resolution too low: {photo.size}")
        photo.thumbnail((2400, 1650), Image.Resampling.LANCZOS)
        TARGET.parent.mkdir(parents=True, exist_ok=True)
        photo.save(TARGET, "JPEG", quality=84, optimize=True, progressive=True)
    print(f"Packaged {TARGET.relative_to(TARGET.parents[2])}: {photo.size}, {TARGET.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
