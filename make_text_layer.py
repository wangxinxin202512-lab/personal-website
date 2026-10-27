"""Keep only the approved red brush lettering for the welcome transition."""

from pathlib import Path

import numpy as np
from PIL import Image


assets = Path(__file__).resolve().parent / "assets"
source = Image.open(assets / "welcome-final.png").convert("RGB")
rgb = np.asarray(source).astype(np.int16)
red_score = rgb[:, :, 0] - np.maximum(rgb[:, :, 1], rgb[:, :, 2])
alpha = np.clip((red_score - 8) * 255 / 72, 0, 255).astype(np.uint8)

# The approved artwork has orange-red only in its main lettering. Keep its
# exact brush edges and color while the original backdrop blurs underneath.
rgba = np.dstack((rgb.astype(np.uint8), alpha))
Image.fromarray(rgba, "RGBA").save(assets / "welcome-lettering.png", optimize=True)
print(f"Extracted lettering: {int((alpha > 0).sum())} pixels")
