# Cosmic Gravity: test 01

## Start here

This folder contains the original brief, complete run prompts, and the simulation outputs. The canonical repository is `C:\Users\Daniel\Documents\Coding\Github\Model Tests`. Read [../AGENTS.md](../AGENTS.md) before editing shared files.

- [prompt.md](prompt.md): the single canonical prompt. It contains the original brief verbatim followed by Daniel's short naming paragraph. The stored example uses Sol-High; the landing-page selector changes only the model and effort label.

Do not create separate prompt files per model or effort level, or append workflow instructions. Keep repository guidance separate. The first four runs used the original brief without the naming paragraph; the original version remains in Git history. Both High runs used the same closing paragraph with their respective labels.

## Results

| Model | Effort | File | Prompt | Publication | Validation evidence |
| --- | --- | --- | --- | --- | --- |
| Astra | Light | [HTML](cosmic-gravity-astra-light.html) | Original brief¹ | Published | JavaScript syntax; live HTTP and source match checked during initial publication |
| Astra | Medium | [HTML](cosmic-gravity-astra-medium.html) | Original brief¹ | Published | JavaScript syntax; physics/control checks; live HTTP and source match checked during initial publication |
| Sol | Light | [HTML](cosmic-gravity-playground-sol-light.html) | Original brief¹ | Published | JavaScript syntax; live HTTP and source match checked during initial publication |
| Sol | Medium | [HTML](cosmic-gravity-playground-sol-medium.html) | Original brief¹ | Published | JavaScript syntax; live HTTP and source match checked during initial publication |
| Astra | High | [HTML](cosmic-gravity-astra-high.html) | [Canonical](prompt.md) | Included in this release | JavaScript syntax and self-containment; 15 Node checks with mocked DOM/Canvas covering physics, controls and stability; initial browser validation blocked by local-file URL policy; subsequent desktop rendering check passed via local preview (frame rate not benchmarked) |
| Sol | High | [HTML](cosmic-gravity-sol-high.html) | [Canonical](prompt.md) | Included in this release | JavaScript syntax and self-containment checks; subsequent desktop rendering check passed via local preview |

¹ The first four runs used the brief before the naming paragraph was appended. The original is retained in commit `68581b9`.

Publication checks above describe the initial upload, not continuous monitoring or a visual acceptance test. Record only evidence actually observed for each new output.

## Naming and locations

New results use `cosmic-gravity-{model}-{effort}.html`. All names are lowercase. Preserve the existing Sol Light and Medium filenames containing `playground`: those URLs are already public. Do not rename them for consistency.

If a result already exists, use the next unused `-run-02`, `-run-03`, etc. suffix before `.html`. Keep every result and record repeat runs as separate table rows. Never create empty HTML files for planned runs.

Keep these outputs and prompts here, not in the repository root or the older ChatGPT folder. Root `index.html` is the shared landing page. Root `README.md` is the suite overview. Temporary screenshots or validation files should stay outside the tracked test folder unless deliberately retained as evidence.

## Completing a run

Use the complete run prompt without adding further instructions. The following is repository maintenance guidance, not prompt content. Replace a pending row only after its output exists; add a new row for a repeat run. Record checks and whether the output is local or published. Add only the corresponding link/card to the shared overview and landing page, and revise any now-stale counts. Re-read shared files before saving.

Daniel authorised this release. For later work, publish only when requested, and verify the live links after deployment.

## Landing-page refresh validation, 4 September 2026

All six simulation files retain their pre-refresh SHA-256 hashes. The six result links and all prompt/asset links return HTTP 200 in the local preview. PatterTech and GitHub external links also return HTTP 200. The redesigned page was inspected at desktop size and a 390 px mobile viewport; no horizontal document overflow was observed on mobile. Prompt selection and copying were exercised in the browser. All six model/effort combinations were checked against the unchanged base prompt plus the agreed naming paragraph. Key text contrast pairs exceed 4.5:1. Both High simulations rendered through their landing-page links. These are local checks, not evidence that the new pages have been published.
