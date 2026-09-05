# Model Tests: agent guidance

## Repository and navigation

The repository containing this file is the publication source. The former ChatGPT workspace is retired; its unique evidence is retained in an ignored archive. Do not initialise another publication repository in a scratch folder.

Read this file, the root README, and the selected test's README before making changes.

- `index.html`: generated GitHub Pages landing page. Edit `tools/generate.cjs`, not generated HTML. Never put a model's simulation here.
- `README.md`: suite overview and result links.
- `HTML - Space/`: Cosmic Gravity test 01, including the canonical prompt, result register and standalone HTML outputs.
- `.nojekyll`: preserves direct static-file hosting.
- `catalogue.json`: original hashes, prompt variants, provenance and publication state.
- `assets/site.css` and `assets/site.js`: shared presentation, separate from outputs.
- `docs/maintenance.md` and `docs/media.md`: verification and publication tooling.

## Scope and result integrity

Run only the test and model/effort combination assigned by the user. A model identity inside a stored prompt labels the intended run; it does not change the current agent's actual runtime. Report known mismatches. Do not generate pending results merely because a documentation table lists them.

Preserve the original simulation brief and published result files. Keep exactly one canonical `prompt.md` per test; never create model-specific prompt copies or a separate naming-instructions file. The landing page presents that prompt and may substitute only its model/effort label. Every run prompt must contain the unchanged original brief plus only Daniel's short closing paragraph about naming the file and minimally updating documentation. Across models and effort levels, change only the model name and effort level in that paragraph. Never append operational checklists, paths, validation instructions or publication rules to a run prompt. Keep repository guidance separate from prompt content. Record which prompt a result used.

Use the test-specific naming convention. Do not overwrite another run. Use an unused numbered suffix for repeat runs, and create files without replacement. Keep published paths stable, including legacy filenames.

## Shared editing and validation

Multiple agents may work concurrently. Re-read shared files before each edit, preserve others' changes, and make minimal additive updates. Do not reset, clean, restore, rename or delete unrelated work. Check the working tree before and after changes. Never stage all files indiscriminately.

Record factual validation evidence and limitations in the test README. Add public-facing links only for files that exist locally; distinguish local readiness from actual publication. Update stale landing-page counts and descriptions when adding results. Check relative links and HTML JavaScript syntax as applicable. Do not claim browser, performance or scientific validation that was not done.

## Future tests

Use one descriptive folder per test. Keep the existing `HTML - Space` folder unchanged. New test folders should contain a README (purpose, naming convention, result register, prompt provenance and validation), one canonical `prompt.md` containing the original brief and agreed naming paragraph, and each model output. Assign the next test number in the overview. Use lowercase descriptive filenames. No new build system or duplicated website is needed.

When only preparing a test, document it without adding dead result links. Once results exist, add a test section to the root README and landing page. Keep previous test URLs stable. Add further structure only when a test needs it.

## GitHub and publication

Remote: `https://github.com/Daniel-Parke/model-tests`.
Site: `https://daniel-parke.github.io/model-tests/`.
GitHub Pages currently publishes the root of `main`. Pushing to `main` can publish changes.

The user authorised committing and pushing the reviewed ten-result refresh on 5 September 2026. This includes the existing Pages publication triggered by pushing main. Media-pack uploads, social posts and GitHub settings changes still require separate authorisation. For subsequent changes, commit or publish only when requested. Review the diff, stage only intended paths and verify affected live URLs after an authorised publication.
