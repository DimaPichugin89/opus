"""Bottle cutouts from the lifestyle photos.

Backgrounds are busy, so each bottle is traced by a measured profile:
rows of (y, x_left, x_right) in the source pixel grid, smoothed with
Chaikin corner cutting and rasterised at 4x for clean edges.

Usage: python3 -I scripts/cutout.py [--preview DIR]
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "assets" / "raw"
OUT = ROOT / "public" / "cut"
SS = 4  # supersampling for the mask

# Profiles measured on a 2x grid, so values are halved below.
PROFILES = {
    "sun_life": ("podsol_1.webp", [
        (155, 462, 671), (163, 457, 676), (310, 455, 676), (322, 464, 666),
        (520, 470, 668), (560, 445, 690), (600, 400, 733), (660, 370, 755),
        (720, 361, 765), (1700, 362, 764), (1740, 378, 750), (1756, 400, 730),
    ]),
    "pump_life": ("pupm_site_img.webp", [
        (155, 460, 676), (163, 455, 681), (316, 452, 686), (326, 470, 668),
        (520, 463, 672), (565, 440, 700), (620, 398, 740), (690, 370, 768),
        (760, 363, 775), (1700, 367, 775), (1760, 385, 762), (1782, 410, 740),
    ]),
    "hemp_life": ("kana_site_img.webp", [
        (165, 448, 668), (173, 443, 673), (328, 440, 676), (338, 462, 657),
        (540, 458, 660), (585, 420, 690), (640, 382, 733), (700, 357, 758),
        (760, 351, 762), (1720, 355, 762), (1768, 372, 746), (1790, 400, 720),
    ]),
}


def chaikin(points, iterations=3):
    """Closed Chaikin corner cutting: smooths without overshooting the profile."""
    for _ in range(iterations):
        nxt = []
        for i, (x0, y0) in enumerate(points):
            x1, y1 = points[(i + 1) % len(points)]
            nxt += [(0.75 * x0 + 0.25 * x1, 0.75 * y0 + 0.25 * y1),
                    (0.25 * x0 + 0.75 * x1, 0.25 * y0 + 0.75 * y1)]
        points = nxt
    return points


def outline(rows):
    """Profile rows (2x grid) -> closed polygon in source pixels."""
    left = [(xl / 2, y / 2) for y, xl, _ in rows]
    right = [(xr / 2, y / 2) for y, _, xr in reversed(rows)]
    return left + right


def cut(name, src, rows, preview=None):
    im = Image.open(RAW / src).convert("RGBA")
    poly = chaikin(outline(rows))
    big = Image.new("L", (im.width * SS, im.height * SS), 0)
    ImageDraw.Draw(big).polygon([(x * SS, y * SS) for x, y in poly], fill=255)
    # Pull the edge 1px inward so no background fringe survives.
    big = big.filter(ImageFilter.MinFilter(2 * SS + 1))
    mask = big.resize(im.size, Image.LANCZOS)
    im.putalpha(mask)
    bbox = mask.getbbox()
    OUT.mkdir(parents=True, exist_ok=True)
    im.crop(bbox).save(OUT / f"{name}.png")
    if preview:
        ov = Image.open(RAW / src).convert("RGB")
        ov = ov.resize((ov.width * 2, ov.height * 2))
        ImageDraw.Draw(ov).line([(x * 2, y * 2) for x, y in poly + poly[:1]],
                                fill=(0, 255, 0), width=2)
        ov.save(Path(preview) / f"outline_{name}.png")
    return bbox


if __name__ == "__main__":
    preview = sys.argv[sys.argv.index("--preview") + 1] if "--preview" in sys.argv else None
    for name, (src, rows) in PROFILES.items():
        print(name, cut(name, src, rows, preview))
