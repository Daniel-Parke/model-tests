# Reusable media tools

Create a consistent publication pack from real browser captures. The project configuration supplies branding, source identifiers, source hashes, labels, capture conditions and montage order. Large files remain in an ignored local bundle.

## Setup

    npm ci
    npx playwright install chromium
    npm run setup:media

The Windows setup downloads a pinned portable FFmpeg essentials archive, verifies its SHA-256 checksum and extracts it into .tool-cache. It does not change PATH. The binary comes from [Gyan's FFmpeg builds](https://www.gyan.dev/ffmpeg/builds/), linked by the [FFmpeg project](https://ffmpeg.org/download.html).

On other platforms, install FFmpeg and ffprobe locally. Set FFMPEG and FFPROBE to their executable paths if they are not on PATH. The export manifest records the actual FFmpeg version.

## Commands

    npm run media -- inspect
    npm run media -- capture
    npm run media -- compose
    npm run media -- verify

Set MEDIA_CONFIG to another project configuration to reuse the tool. Use capture --only <source-id> to retry one failed capture. Capture writes a record only after that result completes without runtime errors or external requests. Composition rejects missing or mismatched captures. Rerunning composition replaces generated exports, never original sources.

For another project, supply its source files, hashes, labels, featured identifier and montage order. The ten-source profile uses the featured final row; other source counts use a regular grid. Supply deckHtml with a self-contained print document for a different experiment. Its text and layout are project content, not generation-run context. Alternate configurations write website assets inside their own output directory unless websiteAssets is set explicitly.

Use compose --stills-only to regenerate images and the PDF without encoding videos. Use compose --only <source-id> to recompose one individual recording. Run verify afterwards. Use compose --preview-only to regenerate the responsive website videos and hero poster. The built-in PDF content is specific to Cosmic Gravity.

Sources may be HTML, images or video. Browser sources need a readiness selector. Imported media remains identifiable as imported, rather than being described as a controlled browser recording. The current montage profile arranges ten sources in three rows of three and one featured row.

## Current recording conditions

Chromium; 1920 × 1080; device pixel ratio 1; normal motion preference; three-second warm-up; 30 recorded seconds; native Playwright recording at 25 fps. Capture each demo serially in a fresh browser context. No seeded randomness, clock changes, hidden interface or modified simulation code.

Ten clips show default scenes. The separate Astra Ultra feature records pointer movement at six and eight seconds, a click at ten seconds, a drag at fourteen seconds and Shift-click at twenty seconds.

The viewer and recorder frame rate are different measurements. These 25 fps videos are not a simulation frame-rate benchmark.

## Exports

- Eleven labelled 1920 × 1080 MP4 clips, including the separate interaction clip.
- One 1080 × 1440 ten-result MP4 montage, 30 seconds, 25 fps, silent.
- A 1440 × 1920 comparison PNG for X, below 5 MB.
- GitHub 1280 × 640 and Pages 1200 × 630 social images, each below 1 MB.
- An eight-page LinkedIn PDF, below 10 MB, with selectable text and links.
- Editable HTML layouts and a manifest of output hashes and capture conditions.
- Website posters and responsive six-second previews, stored separately under assets. Desktop uses 1920 × 1080; viewports at or below 800 pixels use 960 × 540. Both retain native 25 fps and use quality-based encoding. The reviewed quality profile replaces the earlier 750 KB target with limits of 4 MB on desktop and 1.5 MB on mobile. Previews remain deferred, with reduced-motion and data-saving poster fallbacks.

Full original frames are retained. Small montage tiles provide an overview; the PDF and individual clips provide a closer view. Labels and watermark belong to the outer presentation frame.

## Review and upload

Inspect the manifest, watch each finished video and render every PDF page. Confirm labels, chronology, full-frame containment and links. Technical checks do not establish visual acceptance or successful platform upload.

Run `node tools/review-media.cjs` to decode every video frame, create frame sequences and build a local review index. Optional PDF review requires Python with pypdf, pypdfium2 and Pillow:

    python -m pip install pypdf pypdfium2 Pillow
    python tools/verify-pdf.py .media/cosmic-gravity/exports/linkedin-cosmic-gravity.pdf .local/pdf

The PDF verifier checks all eight pages, embedded glyph definitions, selectable text and links. Inspect every resulting page image for layout faults.

The finished pack is in .media/cosmic-gravity/exports. Clean captures remain under raw. Use the [publication copy](publication.md) and PDF [text companion](linkedin-companion.md). Upload only after review; do not commit recording masters.
