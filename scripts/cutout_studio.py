"""Cut studio bottle photos (bottle on a white backdrop) out to transparent PNGs.

Background = near-white, low-saturation pixels connected to the image border
(flood fill from the edges), so white areas inside the label stay. The edge is
pulled in by 1 px and softened; the result is cropped to the bottle.

Usage: python3 -I scripts/cutout_studio.py assets/studio public/cut/studio
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

WHITE_MIN = 200  # every channel at least this bright
SAT_MAX = 26  # max channel spread for a backdrop pixel


def cut(src: Path, dst: Path):
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    bright = a.min(axis=2) >= WHITE_MIN
    flat = (a.max(axis=2) - a.min(axis=2)) <= SAT_MAX
    cand = Image.fromarray(((bright & flat) * 255).astype(np.uint8), "L").copy()  # copy: arrays come in read-only
    # Mark the backdrop that touches the border as 128.
    w, h = cand.size
    for x in range(0, w, max(1, w // 40)):
        for y in (0, h - 1):
            if cand.getpixel((x, y)) == 255:
                ImageDraw.floodfill(cand, (x, y), 128)
    for y in range(0, h, max(1, h // 40)):
        for x in (0, w - 1):
            if cand.getpixel((x, y)) == 255:
                ImageDraw.floodfill(cand, (x, y), 128)
    bg = np.asarray(cand) == 128
    mask = Image.fromarray(((~bg) * 255).astype(np.uint8), "L")
    # Keep only the largest blob: drop specks and shadow islands.
    mask = mask.filter(ImageFilter.MedianFilter(5))
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    rgba = im.convert("RGBA")
    rgba.putalpha(mask)
    bbox = mask.point(lambda v: 255 if v > 40 else 0).getbbox()
    out = rgba.crop(bbox)
    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst)
    return out.size


if __name__ == "__main__":
    src_dir, dst_dir = Path(sys.argv[1]), Path(sys.argv[2])
    for f in sorted(src_dir.iterdir()):
        if f.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
            print(f.stem, cut(f, dst_dir / f"{f.stem}.png"))
