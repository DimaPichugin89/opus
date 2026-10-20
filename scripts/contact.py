"""Contact sheet of stills with timecode labels: contact.py OUT.png img1 img2 ..."""
import re
import sys

from PIL import Image, ImageDraw, ImageFont

out, files = sys.argv[1], sys.argv[2:]
scale = 0.3
font = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf', 26)
thumbs = [Image.open(f).convert('RGB') for f in files]
tw, th = int(1080 * scale), int(1920 * scale)
cols = min(5, len(thumbs))
rows = (len(thumbs) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (tw + 16) + 16, rows * (th + 56) + 16), (30, 30, 30))
d = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(files, thumbs)):
    x, y = 16 + (i % cols) * (tw + 16), 16 + (i // cols) * (th + 56)
    sheet.paste(im.resize((tw, th), Image.LANCZOS), (x, y))
    m = re.search(r'f(\d+)', f.rsplit('/', 1)[-1])
    fr = int(m.group(1)) if m else 0
    d.text((x, y + th + 10), f'{fr / 30:.2f} s  · frame {fr}', fill=(240, 240, 240), font=font)
sheet.save(out)
