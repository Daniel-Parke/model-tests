# Validation evidence

## Current publication review

Current checks and reproducible commands are recorded in the [review handover](review-handover.md). No hosted deployment or social-platform upload is part of this preparation. Original model files are checked by SHA-256 before and after capture.

## Historical checks, retained 5 September 2026

The table below preserves prior reports. Its publication wording describes that earlier record; the catalogue holds current status. Mocked DOM/Canvas checks are not real browser performance measurements. Differences in test conditions prevent rankings.

| Model | Effort | File | Prompt | Publication | Validation evidence |
| --- | --- | --- | --- | --- | --- |
| Astra | Light | [HTML](../HTML%20-%20Space/cosmic-gravity-astra-light.html) | Original brief¹ | Published | JavaScript syntax; live HTTP and source match checked during initial publication |
| Astra | Medium | [HTML](../HTML%20-%20Space/cosmic-gravity-astra-medium.html) | Original brief¹ | Published | JavaScript syntax; physics/control checks; live HTTP and source match checked during initial publication |
| Sol | Light | [HTML](../HTML%20-%20Space/cosmic-gravity-playground-sol-light.html) | Original brief¹ | Published | JavaScript syntax; live HTTP and source match checked during initial publication |
| Sol | Medium | [HTML](../HTML%20-%20Space/cosmic-gravity-playground-sol-medium.html) | Original brief¹ | Published | JavaScript syntax; live HTTP and source match checked during initial publication |
| Astra | High | [HTML](../HTML%20-%20Space/cosmic-gravity-astra-high.html) | [Canonical](../HTML%20-%20Space/prompt.md) | Included in this release | JavaScript syntax and self-containment; 15 Node checks with mocked DOM/Canvas covering physics, controls and stability; initial browser validation blocked by local-file URL policy; subsequent desktop rendering check passed via local preview (frame rate not benchmarked) |
| Sol | High | [HTML](../HTML%20-%20Space/cosmic-gravity-sol-high.html) | [Canonical](../HTML%20-%20Space/prompt.md) | Included in this release | JavaScript syntax and self-containment checks; subsequent desktop rendering check passed via local preview |
| Sol | Extra High | [HTML](../HTML%20-%20Space/cosmic-gravity-sol-extra-high.html) | [Canonical](../HTML%20-%20Space/prompt.md), with the label set to Sol-Extra High | Local result, not published | JavaScript syntax and self-containment; mocked DOM/Canvas checks for the structured initial scene, 240 stable physics steps, density range, object creation and pause/resume; headless physics timing was 5.87 ms per step at default density and 11.23 ms at maximum density; browser frame rate and visual rendering not benchmarked |
| Astra | Extra High | [HTML](../HTML%20-%20Space/cosmic-gravity-astra-extra-high.html) | [Canonical](../HTML%20-%20Space/prompt.md), with the label set to Astra-Extra High | Local result, not published | JavaScript syntax and self-containment; 22 Node checks with mocked DOM/Canvas, including 90 simulated seconds at defaults and 30 seconds at maximum density/gravity with a black hole; local browser rendering and controls checked at 1280 × 720 and 390 × 844; about 60 FPS observed at defaults, lower at maximum density/speed; direct-file browser automation blocked by URL policy; no cross-device performance benchmark |
| Astra | Ultra | [HTML](../HTML%20-%20Space/cosmic-gravity-astra-ultra.html) | [Canonical](../HTML%20-%20Space/prompt.md), with the label set to Astra-Ultra | Local result, not published | JavaScript syntax and self-containment; 25 mocked DOM/Canvas physics and control checks, including 90 simulated seconds at defaults and 30 seconds at 2,600 dust and 2.5× gravity with a black hole; 18 direct-file Chromium 151 checks at 1440 × 900 and 390 × 844; about 60 FPS at defaults and 30 FPS at maximum settings in local Chromium (180-frame samples); no runtime errors or external requests; overload slows simulated time; no cross-device benchmark |
| Sol | Ultra | [HTML](../HTML%20-%20Space/cosmic-gravity-sol-ultra.html) | [Canonical](../HTML%20-%20Space/prompt.md), with the label set to Sol-Ultra | Local result, not published | JavaScript syntax and self-containment; 15 Node checks with mocked DOM/Canvas covering the structured scene, softened gravity, expansion, controls, pointer interactions and resize scaling; finite through 60 simulated seconds at defaults and 20 seconds at maximum density/gravity with a black hole; headless physics timing was 1.30 ms per step at default density and 3.12 ms at maximum density; browser rendering and frame rate not tested |

### Astra Ultra final-byte qualification

¹ The original brief predates the naming paragraph. The experiment page preserves that historical variant for each of the earliest four runs.

The 25 mocked DOM/Canvas checks and 18 browser checks preceded a final CSS focus change. Two final focus checks then covered the delivered HTML. The physics report records the same JavaScript hash across that CSS-only change. Do not claim that the whole earlier suite was rerun against the final HTML bytes.

Final HTML SHA-256: f5375bcd428543adaf91daca156c417f5904e392736d0f308f097ef67edbb9a7.

JavaScript SHA-256: 2b085afd53388df349923e955f7435776aacf51841d5b4f0f935ce79e3130573.

Detailed historical reports and screenshots are retained in the private archive. Some were exploratory variants, not delivered results. None establishes cross-device performance or scientific validation.
