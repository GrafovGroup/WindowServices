# Brand implementation — November 11, 2026

The owner confirmed option #1, Architectural / Commercial, and reconfirmed “lets use option 1” during this build.

The original [WindowServices.ca concept sheet](https://chatgpt.com/library?file_id=libfile_6954415f66a0819193680f97badb4008&account_id=personal) was recovered through the owner's signed-in Chrome Library session. Its unmodified bytes are retained at `assets/originals/brand/windowservices-concepts-original.png` (1536 × 1024; SHA-256 `70c965885650c54d505c3d5be173acb946999a2bc6ae852aeced1b926b2c83ac`). The entire sheet is a source reference, not a public logo or proof of the operating claims printed on it.

## Reconstruction status

The navy/blue architectural panels and curved base were traced into editable SVG geometry after visual inspection. Wordmark lettering is standardized in Manrope ExtraBold; it is not represented as an exact font match to the raster reference. Solid colours normalize the slightly varying source pixels to navy `#00244C` and blue `#0094E4`. The spelling is WindowServices.ca.

This is a **vector reconstruction awaiting the owner's visual check**, not an untouched production original. See `docs/preview/brand-proof.png`. It is applied to the review site; `launch.approvedLogo` remains false until that check is recorded.

## Delivered assets

`public/brand/` contains horizontal, stacked EN/FR and compact emblem SVGs, each in full colour, white and navy monochrome, plus transparent PNG exports. The white variants contain no background rectangle. SVGs contain real paths, not embedded bitmap images. All lettering is outlined, so a visitor does not need the source font installed.

The favicon package uses the reconstructed emblem: a real 16/32/48 ICO, SVG, 16/32/48/96 PNGs, 180 Apple touch icon and 192/512 manifest icons. Raster icons use a light tile for legibility. Two 1200 × 630 brand social cards support English and French sharing metadata.

The shared renderer is `src/components/brand.mjs`, configured in `src/config/brand.mjs`. Header and mobile navigation use the horizontal mark; the footer uses the reversed mark. The build validates local asset paths, dimensions and file existence, and requires both variants for production. The temporary wordmark exports were removed.

## Sources and regeneration

Manrope is retained with its SIL Open Font License in `assets/fonts/manrope/`. Source: [Google Fonts Manrope](https://github.com/google/fonts/tree/main/ofl/manrope), retrieved November 11, 2026. Font files are not loaded by customer pages. Optional asset generation uses FontTools 4.60.2 (`scripts/prepare-brand.py`) and Sharp 0.35.5 (`scripts/prepare-brand.cjs`). The ordinary Node website build needs neither dependency.

UI navy follows the reconstructed mark. Action/link blue remains `#176CB3` for contrast; bright brand blue is decorative. Body text uses Avenir Next / Avenir / Segoe UI / Arial system fonts. Uppercase navigation/buttons use CSS; paragraphs use natural case. Reduced motion is respected. Stock service photos remain topic illustrations, not proof of staff or projects.
