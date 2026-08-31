# Texture assets

## brush-bw-matcap.png

Source: `BrushBW_MatCap.tif` from a Cinema 4D matcap pack
(`MATCAP_TOON`), used as the hero blob's material in
`src/components/three/HeroScene.tsx`.

The original TIFFs in that pack are **32-bit float, linear color
space** renders (2160×2160, ~44MB each) — not standard 8-bit sRGB
images. Converting them with `sips` (or anything that doesn't know
about the linear profile) blows the image out to near-white, because
the raw linear values look far too bright once written straight into
an sRGB PNG without gamma-encoding them first.

To reproduce/update this file from another matcap in the same pack:

```bash
python3 -m pip install --user tifffile imagecodecs Pillow numpy

python3 -c "
import tifffile, numpy as np
from PIL import Image

arr = tifffile.imread('/path/to/SomeName_MatCap.tif').astype(np.float32)
arr = np.clip(arr, 0.0, 1.0)

# linear -> sRGB OETF
srgb = np.where(arr <= 0.0031308, arr * 12.92, 1.055 * np.power(arr, 1/2.4) - 0.055)
srgb8 = (np.clip(srgb, 0, 1) * 255 + 0.5).astype(np.uint8)

img = Image.fromarray(srgb8, mode='RGB').resize((256, 256), Image.LANCZOS)
img.save('public/textures/brush-bw-matcap.png', optimize=True)
"
```

256px is plenty — matcaps are sampled per-fragment by view-space
normal, not spatially detailed, so there's no benefit to shipping the
full 2160px render. Result: 44MB → ~34KB.
