"""Trace the bottle silhouette from a studio cutout into src/fx/bottleShape.ts.

Left/right alpha extent per row (the bottle is convex across each row), normalised to 0..1.
Usage: python3 -I scripts/trace_bottle.py public/cut/studio/sun.png
"""
import sys

import numpy as np
from PIL import Image

src = sys.argv[1]
alpha = np.array(Image.open(src))[..., 3] > 128
h, w = alpha.shape
left, right = [], []
for y in np.linspace(0, h - 1, 48).astype(int):
    xs = np.where(alpha[y])[0]
    if len(xs):
        left.append((xs[0] / w, y / h))
        right.append((xs[-1] / w, y / h))
with open("src/fx/bottleShape.ts", "w") as f:
    f.write(f"// Silhouette of the Maslarada bottle traced from {src} by scripts/trace_bottle.py.\n")
    f.write("// Points are (x, y) in 0..1 of the cutout box; BODY_Y is the middle of the label.\n")
    f.write(f"export const BOTTLE_ASPECT = {w / h:.4f};\n")
    f.write("export const BOTTLE_BODY_Y = 0.66;\n")
    f.write("export const BOTTLE_OUTLINE: [number, number][] = [\n")
    for x, y in left + right[::-1]:
        f.write(f"  [{x:.4f}, {y:.4f}],\n")
    f.write("];\n")
print(len(left) * 2, "points")
