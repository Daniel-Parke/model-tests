# Maintenance and publication

The repository root is the publication source. GitHub Pages serves the root of main; pushing there can publish changes. No publication is authorised by local validation alone.

## Tools

Use Node.js 22 or later. The public site has no build dependency. For browser and media work:

    npm ci
    npx playwright install chromium
    npm run check
    npm run test:browser
    npm run test:lifecycle

Preview with npm run serve. Stop the terminal process when finished.

Run `npm run test:performance` for the documented three-sample mobile lab profile. Browser checks include direct-file originals and the sandboxed viewer. Hosted CI uses Windows and full Chromium, matching the local validation environment. The initial Linux runner timed out while rendering the unchanged Sol Ultra original; no demo code or browser assertions were removed to accommodate it.

Save all text as UTF-8. When using Python, pass encoding="utf-8" explicitly for text reads and writes.

## Sources of truth

- catalogue.json contains experiment/run identifiers, paths, hashes, prompt variants, provenance and publication state.
- tools/generate.cjs produces the landing comparison, the experiment prompt/methodology page, browser catalogue and bounded README result tables.
- assets/site.css and assets/site.js maintain the shared interface.
- Original output directories contain immutable artefacts and one canonical prompt per experiment.
- tools, tests and docs contain curator tooling, checks and guidance.

After a catalogue or template change, run npm run generate, then npm run check. Do not hand-edit generated HTML or the browser catalogue. New experiments must have a real overview page before their catalogue entry is exposed. Non-HTML outputs use direct download links rather than the live HTML viewer.

Frozen artefacts have no Git line-ending conversion. Do not run blanket formatting, normalisation or bulk staging across original files. Inspect the diff and compare hashes first.

## Publication sequence

The planned Pages publication contains the site pages, original demos and supporting website assets. The short preview video, posters and social metadata image under assets are intentional public files. The complete media pack under .media is ignored and has no tracked files. Its recordings, montage, PDF and review gallery stay local unless separately uploaded. Root-based Pages hosting also exposes other committed public repository files; it does not publish only index.html.

1. Review the local site, original-file checks, media manifest and publication copy.
2. Obtain publication authorisation. This preparation does not authorise a commit, push, release upload or settings change.
3. Stage only the intended files. Keep .local-archive, .local, .media, .tool-cache and node_modules private.
4. Commit and publish the reviewed changes. Verify Pages URLs, downloads, prompt variants and social metadata.
5. Change catalogue publication state only after the affected live files have been checked. Regenerate the bounded documentation.
6. Upload the GitHub repository social image separately from the Pages social image. Apply the prepared About, homepage and topics. Upload large recordings as release assets when authorised.

## Recovery material

Ignored archives preserve the previous site, documentation, working-byte discrepancy and unique evidence from the retired workspace. Each retirement entry has a verified hash. A pointer README remains in the old location; start future tasks in this repository.

Do not publish archive contents. Historical evidence may contain local paths and obsolete exploratory variants. It is not a second source of model outputs.
