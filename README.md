# Model Tests

Small practical comparisons of AI-generated outputs. These are examples to explore, not formal benchmarks.

## Navigation

- [Agent instructions](AGENTS.md): repository boundaries, shared editing and publication rules.
- [Cosmic Gravity test guide](HTML%20-%20Space/README.md): prompts, filenames, result status and validation.
- [Canonical prompt](HTML%20-%20Space/prompt.md): one prompt for every model and effort level; change only the naming label.

The canonical local repository is `C:\Users\Daniel\Documents\Coding\Github\Model Tests`. Save Cosmic Gravity outputs in its `HTML - Space` folder. The older ChatGPT working folder is not the publication source.

## Cosmic Gravity

[Read the canonical prompt](HTML%20-%20Space/prompt.md).

The first four published results used the original brief with Astra and Sol, each at Light and Medium effort, to create an interactive cosmology-themed gravity simulation in one self-contained HTML file.

[Open the comparison page](https://daniel-parke.github.io/model-tests/).

| Model | Effort | Simulation |
| --- | --- | --- |
| Astra | Light | [Open](https://daniel-parke.github.io/model-tests/HTML%20-%20Space/cosmic-gravity-astra-light.html) |
| Astra | Medium | [Open](https://daniel-parke.github.io/model-tests/HTML%20-%20Space/cosmic-gravity-astra-medium.html) |
| Sol | Light | [Open](https://daniel-parke.github.io/model-tests/HTML%20-%20Space/cosmic-gravity-playground-sol-light.html) |
| Sol | Medium | [Open](https://daniel-parke.github.io/model-tests/HTML%20-%20Space/cosmic-gravity-playground-sol-medium.html) |
| Astra | High | [Open](https://daniel-parke.github.io/model-tests/HTML%20-%20Space/cosmic-gravity-astra-high.html) |
| Sol | High | [Open](https://daniel-parke.github.io/model-tests/HTML%20-%20Space/cosmic-gravity-sol-high.html) |

This release includes all six results. There is one canonical prompt: the original brief plus Daniel’s short naming paragraph. Only the model and effort label changes. The first four runs predate that naming paragraph; their original prompt remains in Git history.

All six simulation files are preserved as supplied. Each can also be downloaded and opened directly in a browser. The landing page is separate from the model outputs.

These are animated visual toys, not validated scientific models. This comparison does not establish general model quality, performance or cost rankings.

Published with GitHub Pages. No installation or build step is required.

## Future tests

Add each test in its own descriptive folder, with one canonical `prompt.md`, a README containing its result register and naming convention, and clearly labelled outputs. Register the next test number here and on the landing page once results exist. Keep published simulation paths stable.

## Landing page and branding

The landing page groups six results by model and effort, with accessible result links and a prompt selector/copy control. Selecting a model or effort changes only the naming label in the closing paragraph. No simulation or prompt requirements are changed.

Colours and the orbital brand mark follow `PatterTech_Website/docs/DESIGN_SYSTEM.md` and its brand components. The favicon is copied from that repository. See [assets/README.md](assets/README.md) for provenance.

## Workspace housekeeping

All current project outputs belong here. The old ChatGPT task folder is not a second source of truth. Historical scratch files are retained in the ignored `.local-archive/` folder after hash verification. They are recovery material, not site content. Do not stage or publish that folder. The old files have not been deleted: automatic approval review required explicit permission for their removal. The current task also remains attached to the old directory. Start future tasks in the canonical GitHub project.

## Validation

All six local simulation links and prompt/asset links pass HTTP checks. Both High pages render. The landing page was checked on desktop and mobile, including prompt selection and copying. All simulation hashes remain unchanged. Detailed evidence is in the [test guide](HTML%20-%20Space/README.md#landing-page-refresh-validation-4-september-2026).

## Publication

GitHub Pages serves the root of `main`. This release contains the branded landing page, all six results and one canonical prompt. Commit and push later changes only when Daniel authorises publication, then verify the affected live links.
