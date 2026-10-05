#!/usr/bin/env python3
"""Render brand assets (PNG/ICO) from SVG sources using headless Chrome."""
import os, struct, subprocess, shutil, re

ROOT = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(ROOT, "assets")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP = os.path.join(ROOT, ".render_tmp")
os.makedirs(TMP, exist_ok=True)

def shot(svg, out, size, transparent=False):
    w, h = size
    args = [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
            f"--window-size={w},{h}", f"--screenshot={out}"]
    if transparent:
        args.append("--default-background-color=00000000")
    args.append("file://" + svg)
    subprocess.run(args, check=True, capture_output=True, timeout=60)

fav = open(os.path.join(A, "favicon.svg"), "r", encoding="utf-8").read()
# full-bleed variant (apple-touch-icon must be opaque square; OS rounds it)
bleed = fav.replace('rx="14"', 'rx="0"')
bleed_path = os.path.join(TMP, "bleed.svg")
open(bleed_path, "w", encoding="utf-8").write(bleed)

def fit_svg(src, n):
    # make svg fill an n x n window exactly
    s = open(src, "r", encoding="utf-8").read()
    s = re.sub(r'width="64" height="64"', f'width="{n}" height="{n}"', s, count=1)
    p = os.path.join(TMP, f"i{n}_{os.path.basename(src)}")
    open(p, "w", encoding="utf-8").write(s)
    return p

for n in (16, 32, 48, 192, 512):
    shot(fit_svg(os.path.join(A, "favicon.svg"), n), os.path.join(A, f"favicon-{n}.png"), (n, n), True)
shot(fit_svg(bleed_path, 180), os.path.join(A, "apple-touch-icon.png"), (180, 180))

# ICO container with embedded PNGs (16/32/48)
imgs = [open(os.path.join(A, f"favicon-{n}.png"), "rb").read() for n in (16, 32, 48)]
hdr = struct.pack("<HHH", 0, 1, len(imgs)); off = 6 + 16 * len(imgs); ents = b""
for n, d in zip((16, 32, 48), imgs):
    ents += struct.pack("<BBBBHHII", n, n, 0, 0, 1, 32, len(d), off); off += len(d)
open(os.path.join(ROOT, "favicon.ico"), "wb").write(hdr + ents + b"".join(imgs))

# Open Graph image 1200x630
shot(os.path.join(A, "og-image.svg"), os.path.join(A, "og-image.png"), (1200, 630))
shutil.rmtree(TMP)
print("done")
