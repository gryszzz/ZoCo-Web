#!/usr/bin/env python3
"""Build ZoCo favicons, mobile app icons and link previews from the wide logo.

Source of truth: assets/brand/zoco-header-horizontal.png (the actual new,
non-circular two-dog / chrome-ZoCo horizontal brand mark).
Called by the GitHub Pages workflow BEFORE the upload-pages-artifact step.
A new deploy must never silently restore the legacy circular favicon.
"""
from __future__ import annotations

import base64
import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/brand/zoco-header-horizontal.png"
SRC = Image.open(SOURCE).convert("RGBA")
if SRC.size != (2172, 724):
    raise SystemExit(f"Expected 2172x724 ZoCo horizontal logo; found {SRC.size}")

RESAMPLE = Image.Resampling.LANCZOS


def illuminated_square(size: int = 512) -> Image.Image:
    """Quiet dark slate background to preserve chrome/orange logo contrast."""
    out = Image.new("RGBA", (size, size), "#070d14")
    pix = out.load()
    for y in range(size):
        for x in range(size):
            warm = max(0, 1 - math.hypot(x - .08 * size, y - .2 * size) / (.91 * size)) ** 2
            cool = max(0, 1 - math.hypot(x - .97 * size, y - .8 * size) / (.9 * size)) ** 2
            pix[x, y] = (
                int(7 + 27 * warm + 2 * cool),
                int(13 + 6 * warm + 8 * cool),
                int(20 + 13 * cool),
                255,
            )
    return out


def layer(dest: Image.Image, region: tuple[int, int, int, int],
          position: tuple[int, int, int, int]) -> None:
    """Crop original, resize proportionately within each planned lockup slot."""
    x, y, width, height = position
    mark = SRC.crop(region).resize((width, height), RESAMPLE)
    dest.alpha_composite(mark, (x, y))


def build() -> None:
    square = illuminated_square()
    # Artwork from the SAME new logo, arranged compactly for square app icons.
    layer(square, (170, 0, 1120, 345), (34, 85, 444, 161))
    layer(square, (0, 345, 1370, 557), (16, 246, 480, 105))
    layer(square, (295, 557, 1965, 704), (17, 354, 478, 44))

    square.save(ROOT / "icon-512.png", optimize=True)
    for size, filename in [
        (192, "icon-192.png"),
        (180, "apple-touch-icon.png"),
        (96, "favicon.png"),
    ]:
        square.resize((size, size), RESAMPLE).save(ROOT / filename, optimize=True)

    # A full three-to-one wordmark cannot be read at 16px. Make the tiny
    # favicon from the chrome/orange Z of that SAME logo, never the old circle.
    tiny = illuminated_square(256)
    z = SRC.crop((0, 337, 420, 606))
    z.thumbnail((241, 215), RESAMPLE)
    tiny.alpha_composite(z, ((256 - z.width) // 2, (256 - z.height) // 2))
    for size, filename in [
        (16, "favicon-16x16.png"),
        (32, "favicon-32x32.png"),
        (48, "favicon-48x48.png"),
    ]:
        tiny.resize((size, size), RESAMPLE).save(ROOT / filename, optimize=True)
    tiny.save(ROOT / "favicon.ico", format="ICO", sizes=[
        (16, 16), (32, 32), (48, 48), (64, 64)
    ])

    # Keep a self-contained SVG favicon; external SVG image references can be
    # blocked by favicon security restrictions in browsers.
    png = (ROOT / "favicon-48x48.png").read_bytes()
    embedded = base64.b64encode(png).decode("ascii")
    (ROOT / "favicon.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" '
        'viewBox="0 0 512 512"><image width="512" height="512" '
        f'href="data:image/png;base64,{embedded}"/></svg>',
        encoding="utf-8",
    )

    # Full longways logo for 1200x630 social/Apple Messages previews.
    # No legacy circular mark and no fabricated reviews, vehicles or services.
    canvas = Image.new("RGBA", (1200, 630), "#060b12")
    pixels = canvas.load()
    for y in range(630):
        for x in range(1200):
            warm = math.exp(-((x - 170) ** 2 / (420 ** 2) +
                               (y - 300) ** 2 / (290 ** 2)))
            cool = math.exp(-((x - 1110) ** 2 / (330 ** 2) +
                               (y - 360) ** 2 / (330 ** 2)))
            pixels[x, y] = (
                int(6 + 17 * warm),
                int(11 + 3 * warm + 9 * cool),
                int(18 + 15 * cool),
                255,
            )
    art = SRC.copy()
    art.thumbnail((1144, 535), RESAMPLE)
    canvas.alpha_composite(
        art, ((1200 - art.width) // 2, (630 - art.height) // 2)
    )
    canvas.convert("RGB").save(ROOT / "zoco-share-logo-v5.png", optimize=True)

    print("ZoCo new horizontal-logo branding generated:")
    for name in (
        "favicon.ico", "favicon.png", "favicon-16x16.png",
        "favicon-32x32.png", "favicon-48x48.png", "favicon.svg",
        "apple-touch-icon.png", "icon-192.png", "icon-512.png",
        "zoco-share-logo-v5.png",
    ):
        print(f"  {name}: {(ROOT / name).stat().st_size:,} bytes")


if __name__ == "__main__":
    build()
