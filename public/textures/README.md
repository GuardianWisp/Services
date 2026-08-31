# Texture assets

## silver-matcap.png

Source: `C7C7D7_4C4E5A_818393_6C6C74.png` (a standard 8-bit sRGB PNG,
1024px, from `~/Downloads/Matcaps`), used as the hero blob's material
in `src/components/three/HeroScene.tsx`. Already fully shaded (a
chrome/studio-reflection look), so the material leaves
`MeshMatcapMaterial`'s `color` at its default white rather than
tinting it.

Resized straight down with `sips` (no gamma dance needed — this one's
already normal sRGB, not linear):

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
