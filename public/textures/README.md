# Texture assets

## brush-bw-matcap.png

Source: `BrushBW_MatCap.tif` from a Cinema 4D matcap pack
(`MATCAP_TOON`), used as the hero blob's material in
`src/components/three/HeroScene.tsx`. It's grayscale, so the material
tints it with `color="#ff5fa8"` (the brand pink) rather than leaving
it white. See the TIFF conversion recipe below — this file needs the
linear→sRGB pass.

## Converting a plain sRGB PNG (no gamma dance needed)

Some matcap packs ship normal 8-bit sRGB PNGs directly — just resize:

```bash
sips -Z 256 -s format png /path/to/source.png \
  --out public/textures/some-name-matcap.png
```

## Converting linear/HDR TIFFs (e.g. a Cinema 4D matcap pack)

Some matcap packs (the `MATCAP_TOON` one in particular) ship **32-bit
float, linear color space** TIFFs (2160×2160, ~44MB each) instead of
normal sRGB images. `sips` doesn't know about the linear profile and
blows the image out to near-white if you convert with it directly —
the raw linear values need to be gamma-encoded to sRGB first.

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
img.save('public/textures/some-name-matcap.png', optimize=True)
"
```

256px is plenty either way — matcaps are sampled per-fragment by
view-space normal, not spatially detailed, so there's no benefit to
shipping a full-resolution source.
