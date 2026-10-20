"""Cut studio bottle photos (bottle on a white backdrop) out to transparent PNGs.

1. Backdrop = near-white, low-saturation pixels connected to the border (flood fill).
2. A hard core (backdrop mask shrunk) and a hard outside (backdrop mask grown) leave a thin
   edge band; inside it alpha comes from how far a pixel is from the backdrop colour, so
   glass edges keep their natural anti-aliasing instead of a stair-step.
3. Colours in the band are un-mixed from the white backdrop (no light halo on dark scenes).
4. Light colourless pixels at the edge and at the base (floor shadow, reflection) are dropped.

Usage: python3 -I scripts/cutout_studio.py assets/studio public/cut/studio
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

WHITE_MIN = 200  # every channel at least this bright
SAT_MAX = 26  # max channel spread for a backdrop pixel
BAND = 3  # px on each side of the flood-fill edge treated as soft


def backdrop(im: Image.Image) -> np.ndarray:
    a = np.asarray(im).astype(np.int16)
    cand = (a.min(axis=2) >= WHITE_MIN) & ((a.max(axis=2) - a.min(axis=2)) <= SAT_MAX)
    m = Image.fromarray((cand * 255).astype(np.uint8), "L").copy()  # copy: arrays come in read-only
    w, h = m.size
    seeds = [(x, y) for x in range(0, w, max(1, w // 40)) for y in (0, h - 1)]
    seeds += [(x, y) for y in range(0, h, max(1, h // 40)) for x in (0, w - 1)]
    for s in seeds:
        if m.getpixel(s) == 255:
            ImageDraw.floodfill(m, s, 128)
    bg = np.asarray(m) == 128
    bg[:4, :] = True  # photo borders sometimes carry a thin dark line
    bg[-4:, :] = True
    bg[:, :4] = True
    bg[:, -4:] = True
    return bg


def cut(src: Path, dst: Path):
    im = Image.open(src).convert("RGB")
    rgb = np.asarray(im).astype(np.float32)
    bg = Image.fromarray((backdrop(im) * 255).astype(np.uint8), "L")
    # Remove specks and hairlines, then define the certain inside / outside.
    bg = bg.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    outside = np.asarray(bg.filter(ImageFilter.MinFilter(2 * BAND + 1))) > 128
    inside = np.asarray(bg.filter(ImageFilter.MaxFilter(2 * BAND + 1))) < 128
    # Backdrop colour estimated just inside the frame border.
    border = np.concatenate([rgb[6:12].reshape(-1, 3), rgb[-12:-6].reshape(-1, 3)])
    paper = np.median(border, axis=0)
    dist = np.abs(rgb - paper).max(axis=2)
    soft = np.clip((dist - 6) / 70, 0, 1)
    alpha = np.where(inside, 1.0, np.where(outside, 0.0, soft))
    # Floor shadow and reflection under the base are light and colourless; the bottle never is
    # (amber glass, black cap, coloured label), so drop neutral light pixels near the edge.
    spread = rgb.max(axis=2) - rgb.min(axis=2)
    neutral_light = (rgb.min(axis=2) > 120) & (spread < 22)
    near_edge = np.asarray(bg.filter(ImageFilter.MaxFilter(25))) > 128
    alpha = np.where(neutral_light & near_edge & ~inside, 0.0, alpha)
    rows = np.where((alpha > 0.5).any(axis=1))[0]
    if len(rows):
        base = rows[-1] - int((rows[-1] - rows[0]) * 0.035)
        alpha[base:] = np.where(neutral_light[base:], 0.0, alpha[base:])
    alpha_img = Image.fromarray((alpha * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.7))
    alpha = np.asarray(alpha_img).astype(np.float32) / 255
    # Un-mix the backdrop from edge colours: I = a*C + (1-a)*paper.
    a3 = np.maximum(alpha, 0.05)[..., None]
    color = np.clip((rgb - (1 - a3) * paper) / a3, 0, 255)
    color = np.where(alpha[..., None] > 0.98, rgb, color)
    img = Image.fromarray(np.dstack([color, alpha * 255]).astype(np.uint8), "RGBA")
    img = img.crop(Image.fromarray(((alpha > 0.15) * 255).astype(np.uint8)).getbbox())
    dst.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst)
    return img.size


if __name__ == "__main__":
    src_dir, dst_dir = Path(sys.argv[1]), Path(sys.argv[2])
    for f in sorted(src_dir.iterdir()):
        if f.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
            print(f.stem, cut(f, dst_dir / f"{f.stem}.png"))
