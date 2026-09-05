# Local review handover

Prepared 5 September 2026 as the local review record. The user subsequently authorised committing and pushing the reviewed site. The evidence below records the pre-publication checks; the catalogue records verified publication status. The media pack remains local.

## Start the review

From the repository root:

    npm run serve

Open the printed address. Start with the landing page, then explore Cosmic Gravity. The Ultra pair is selected by default. Play a result, switch models, inspect its source and compare the historical prompt with the prompt prepared for a new run.

To serve the media review gallery from a second PowerShell terminal:

    $env:PORT = '4174'
    node tools/serve.cjs --directory .media/cosmic-gravity/exports

The gallery contains the finished videos, social images and LinkedIn document. Stop each local server with Ctrl+C after review. The large media bundle is intentionally ignored by Git and is not part of a fresh source checkout.

## Implemented

The reviewed homepage now places the effort-pair result browser immediately after the opening preview, followed by Behind the results. The former experiment-list section has been removed. The hero Explore all 10 link scrolls to the comparison. The secondary page now contains only prompt and methodology content, with a clear link back to the homepage comparison. Existing result-selection URLs forward to the homepage; prompt and methodology anchors remain valid.

- A compact landing page with a genuine above-the-fold scene, deferred recorded preview and PatterTech typography and branding.
- A dedicated experiment page with five equally presented Astra/Sol pairs, original links, downloads, escaped source, prompt copying and validated result links.
- One sandboxed live iframe, created only after Play. Switching replaces the original; closing unloads it. The wrapper waits for a real viewport before initialisation and navigates to a blank document before removal. The original simulations have no injected bridge or code changes.
- Keyboard exit controls before and after the embedded document, focus restoration, touch controls, reduced-motion and data-saving behaviour, and usable direct links without JavaScript.
- A maintained catalogue, generated pages and bounded README tables, frozen hashes, historical prompt variants and commands for preparing and freezing future runs.
- Reusable inspect/capture/compose/verify tooling, publication copy, contribution guidance, issue templates, MIT licensing and separate branding/font notices.

Astra Ultra is an editorial feature. The site and publication copy make no measured-winner or controlled-benchmark claim.

## Media pack

The complete local bundle is under `.media/cosmic-gravity/`. Clean originals of the recordings are in `raw/`; annotated exports and their manifest are in `exports/`.

| Deliverable | Verified output |
| --- | --- |
| Ten default clips plus Astra Ultra interaction | Eleven 1920 × 1080 MP4 files, 30 seconds, 25 fps |
| Ten-result montage | 1080 × 1440 MP4, 30 seconds, 25 fps, silent; 11,163,900 bytes |
| X comparison | 1440 × 1920 PNG; 1,567,787 bytes |
| GitHub repository preview | 1280 × 640 PNG; 351,222 bytes in the export pack |
| Landing-page social image | 1200 × 630 PNG; 324,562 bytes in the export pack |
| LinkedIn document | Eight portrait pages; 906,688 bytes; selectable text, embedded glyphs and links |
| Website assets | Ten comparison posters, a full-HD hero poster, optimised social PNGs and responsive six-second previews |
| Publication text | GitHub About/topics/release draft, LinkedIn posts, X/Bluesky posts, image descriptions and a PDF text companion |

The montage follows the agreed 3 + 3 + 3 + 1 order, with Astra Ultra across the final row. Every original frame is contained without cropping. The interaction clip includes timed captions outside the source frame.

All captures used fresh full-Chromium contexts, 1920 × 1080, device pixel ratio 1, a three-second warm-up and native 25 fps recording. Original controls and default scenes were retained. An initial headless-shell capture problem was resolved by using full Chromium and recapturing all ten results under the same conditions.

The manifest records source, raw-capture and export hashes, configuration identity, dimensions, duration, frame rate, tool version and FFmpeg binary checksum. The capture manifest records browser version, capture conditions and interaction events. Website derivatives have their own hashes.

## Validation results

| Check | Result |
| --- | --- |
| `npm run check` | Eleven tests passed in the canonical Git working tree; generated content and 172 local links verified |
| `npm run test:browser` | 43 checks passed in the canonical working tree after the homepage and navigation adjustments |
| `npm run test:lifecycle` | 30 rapid restart/switch/close cycles passed without runtime errors |
| `npm run test:media` | Two tests passed, including actual image/video imports and montage geometry |
| `npm run media -- verify` | All 16 primary exports and website derivatives verified |
| PDF verification | All eight pages passed text, embedded-glyph and link checks; every page rendered and inspected |
| Video verification | All 12 finished videos decoded completely; labelled frame sequences at 0, 5, 10, 15, 20, 25 and 29 seconds inspected |
| Dependency installation | `npm ci` succeeded; npm reported zero vulnerabilities |

Browser checks cover every original both as a direct `file:` document and inside the sandbox, model switching, restart/unload, keyboard exit, downloads, escaped source, prompt variants/copying, valid/invalid shared selections, touch input, no-JavaScript navigation, reduced motion and data saving. Layout checks passed at 320, 390, 768, 1024 and 1440 pixels and at 200% CSS zoom, without page overflow.

The document-visibility handler passed a simulated hidden/visible transition. Headless Chromium did not expose a native background-tab transition, so that check is explicitly simulated. This is not a claim of testing every browser's background-tab policy or assistive technology.

### Landing-page performance

Three cold-cache runs used full Chromium 151.0.7922.34, a 390 × 844 touch viewport, device pixel ratio 1, 1.6 Mbit/s download, 150 ms network latency and 4× CPU slowdown. The automatic preview remained eligible. The local static server did not apply transfer compression.

| Metric | Measured | Target |
| --- | --- | --- |
| Median largest contentful paint | 1.824 seconds | At most 2.5 seconds |
| Median cumulative layout shift | 0 | At most 0.1 |
| Essential initial transfer, excluding deferred video | 179,020 bytes | Below 500 KB |
| Gzipped CSS and JavaScript | 9,669 bytes | Below 75 KB |
| Deferred desktop preview | 2,895,349 bytes; 1920 × 1080 | Below 4 MB |
| Deferred mobile preview | 983,456 bytes; 960 × 540 | Below 1.5 MB |

The quality review replaced the 720-pixel-wide preview with full HD on desktop and a 960-pixel-wide mobile version. These quality-based encodes intentionally supersede the earlier 750 KB target. Both retain native 25 fps and six-second duration. The desktop poster is now 1920 pixels wide. Repeated prompt payloads were replaced with two shared templates; all 20 historical/new prompt combinations verify exactly against the original generation helper.

These are local landing-page measurements, not field data. The recordings' 25 fps describes the recorder, not original simulation performance. Historical original-demo observations are recorded separately in [validation evidence](validation.md); no new cross-device simulation ranking was produced.

### Initial clean-source walkthrough

Because the work remains uncommitted, validation used a copy of the intended public source files, without `.git`, archives, media masters, tool caches or installed packages. It was not represented as a committed clone.

`npm ci`, `npm run check`, all 40 browser checks and the 30-cycle lifecycle test passed there. The Git-blob comparison was explicitly skipped because that copy has no Git metadata; the frozen-file hash checks still passed. The same Git-blob comparison passed in the canonical repository. A second non-HTML experiment fixture and isolated run preparation/freezing were also tested without publishing dummy content.

A deliberate stale edit to the snapshot's generated landing page was rejected by `--check`; the fixture edit was then restored.

Use [maintenance](maintenance.md) and [media setup](media.md) for the reproducible commands. Node dependencies are pinned by the lockfile, Playwright installs its browser, and the Windows media setup verifies the pinned portable FFmpeg archive. The optional PDF verifier documents its Python dependencies. No personal runtime path is required by the checked-in scripts.

## Preservation and cleanup

All ten original output hashes verify. The six published files match their Git blobs byte for byte. Astra High's earlier working-copy line-ending discrepancy was preserved privately before restoring the published bytes and adding no-conversion rules. Git can still show its path as modified in the unstaged stat view; the content diff is empty and the byte comparison passes.

The historical brief was checked against the original Git prompt. The earliest four runs retain the variant without the naming paragraph. Missing historical context, tool and intervention records remain unknown.

The retired workspace was inventoried again. All 204 archived files were checked against the retirement manifest before cleanup. Unique evidence, prior presentation files and the empty Git metadata remain in the private archive. The old workspace now contains only a pointer README. The canonical project and frozen results remain in this repository.

## Navigation and publication review

| Destination | Purpose |
| --- | --- |
| Homepage | Opening preview, effort-pair comparison, live viewer and Behind the results |
| Cosmic Gravity context page | Historical prompt selection, copying and methodology; no duplicate result browser |
| Original HTML URLs | Direct simulations, downloads and inspectable source; preserved unchanged |
| GitHub documentation and licence | Rendered technical reading and reuse terms, outside the main exploration journey |
| Local media gallery | Review and export only; excluded from the planned Pages publication |

The PDF's Explore link now goes straight to the homepage comparison. Its layout is unchanged; all eight pages were reverified after the link update. The complete media pack is ignored and untracked. Only the intended website derivatives under assets are public media. Root-based Pages hosting also exposes committed public repository files, so publication is not limited to index.html alone.

## Review boundary

The final local review is still yours: assess the visual direction, play the complete videos and approve the publication copy. Automated decoding and sampled-frame inspection do not replace that editorial review. The small montage tiles are an overview; individual clips and effort-pair PDF pages provide readable comparisons.

At the local review stage, hosted CI had not run. Firefox/WebKit, physical mobile devices, native background-tab policies and social-platform uploads remain outside the verified scope. No formal accessibility certification or scientific benchmark is claimed.

After approval, follow the separate [publication sequence](maintenance.md#publication-sequence) and [prepared content](publication.md). Verify the ten live result URLs before using copy that says all ten are available. Upload GitHub's repository preview separately from the landing-page social metadata. Do not publish the private archive or recording masters as source files.

## Publication verification, 5 September 2026

The user authorised commit and push after the visual review. Commit fc5de6b was pushed to main and the Pages deployment completed successfully. Live HTTP responses for all ten originals matched their recorded SHA-256 hashes. The homepage, context page, site CSS/JavaScript, generated browser catalogue and both responsive preview videos matched the committed bytes. The media-pack gallery URL returned 404.

The catalogue and generated result tables were then updated to Published. Media-pack uploads, social posts, GitHub About/topics and the uploaded repository social preview were not changed. The full media pack remains local and ignored by Git.

The initial hosted Linux validation timed out in the unchanged Sol Ultra canvas. CI now uses Windows and full Chromium, matching local validation. All browser assertions remain enabled; original artefacts are unchanged.
