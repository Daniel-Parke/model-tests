# Cosmic Gravity: experiment 01

[Explore the results](../#results) · [Read the canonical prompt](prompt.md) · [Methodology](../docs/methodology.md)

Create a visually compelling interactive gravity simulation in one self-contained HTML file. These are the original delivered outputs, with presentation and capture work kept outside this folder.

## Results

<!-- RESULTS:START -->

| Model | Effort | Original HTML | Publication |
| --- | --- | --- | --- |
| Astra | Light | [Open](cosmic-gravity-astra-light.html) | Published |
| Sol | Light | [Open](cosmic-gravity-playground-sol-light.html) | Published |
| Astra | Medium | [Open](cosmic-gravity-astra-medium.html) | Published |
| Sol | Medium | [Open](cosmic-gravity-playground-sol-medium.html) | Published |
| Astra | High | [Open](cosmic-gravity-astra-high.html) | Published |
| Sol | High | [Open](cosmic-gravity-sol-high.html) | Published |
| Astra | Extra High | [Open](cosmic-gravity-astra-extra-high.html) | Prepared locally |
| Sol | Extra High | [Open](cosmic-gravity-sol-extra-high.html) | Prepared locally |
| Astra | Ultra | [Open](cosmic-gravity-astra-ultra.html) | Prepared locally |
| Sol | Ultra | [Open](cosmic-gravity-sol-ultra.html) | Prepared locally |

<!-- RESULTS:END -->

## Prompt provenance

The first four runs, Astra and Sol at Light and Medium, used the original brief without the naming paragraph. That brief remains in Git commit 68581b9. Later runs use the canonical prompt with only the model and effort label changed in its closing paragraph.

The result browser distinguishes the historical prompt from the prompt for a new run. There is one canonical prompt.md; model-specific prompt files are not maintained here. The catalogue records each variant and every original file's SHA-256 hash.

## File integrity

Keep all existing filenames and public paths, including the older Sol names containing playground. New filenames use cosmic-gravity-{model}-{effort}.html. Repeated runs use an unused -run-02, -run-03 or later suffix. Never overwrite an earlier output.

The six published Git blobs are the preservation baseline. Four additional local outputs are frozen before presentation work. A historical Astra High working-copy line-ending difference was archived and reconciled to its published blob. No simulation logic was changed.

## Evidence

The homepage now includes the effort-pair comparison directly below its featured preview. The presentation update passed 43 browser checks and 172 local-link checks; all original hashes still match. See the review handover for the current landing-page performance profile.

See [validation](../docs/validation.md) for the distinction between historical checks and the current publication review. Test evidence does not establish scientific accuracy or a cross-device performance ranking.
