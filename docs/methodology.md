# Methodology

These experiments show what models produce for practical tasks. They are examples to inspect, not controlled benchmarks or general rankings.

## Current Cosmic Gravity collection

Astra and Sol each have Light, Medium, High, Extra High and Ultra outputs. These are requested model and effort labels. Actual runtime identity was not consistently captured and remains unknown where evidence is missing.

The original brief is shared. The first four runs used it without a naming paragraph. Later runs added the same paragraph, changing only the model and effort label. The catalogue records that distinction. The public prompt selector can show either the historical variant or a new-run prompt.

Historical working context, tool access and human interventions were not fully recorded. We do not describe these runs as isolated or one-shot. Local frame-rate observations from earlier validation are not comparable performance measurements.

## Preserving an output

The delivered HTML is the result. Its controls, rendering, performance and limitations remain intact. SHA-256 hashes identify exact bytes. Presentation code never edits, injects controls into or synchronises the physics of an original.

Screenshots and recordings are observations of a run, not deterministic fixtures. Every launch can differ. The montage records default scenes under common browser and capture conditions. Astra Ultra's interaction recording is a separate demonstration.

## Protocol for future runs

1. Agree the practical task and freeze one canonical prompt before viewing new results. Assign a prompt version and SHA-256 hash.
2. Prepare a fresh generation directory using the run preparation tool. Supply only the prompt and neutral run metadata. Start a fresh agent conversation rooted there, with no sibling results, presentation code or review history in its context.
3. Record the requested model and effort, actual runtime if known, tools available, supplied context and human interventions. Unknown values must remain explicit.
4. Let the model implement and test its own work. Do not append curator checks to the prompt or feed comparative feedback into the same run.
5. Freeze the final delivered file using the run freezing tool. Record the final prompt and artefact hashes, timestamp and metadata. Inspect the frozen bundle before importing it into the publication repository.
6. Import the original under a new, unused result path. Register it in the catalogue, then create presentation assets and curator checks separately.
7. Treat later corrections as new revisions. Link them to the earlier result and explain the intervention.

A fresh folder reduces accidental context exposure; it is not a security sandbox. Record the agent's actual access boundary. Do not claim stronger isolation than the environment provides.

Example commands, run from the publication repository:

    node tools/run.cjs prepare --experiment cosmic-gravity --model Astra --effort Ultra --out ../isolated-cosmic-gravity-run-02
    node tools/run.cjs freeze --workspace ../isolated-cosmic-gravity-run-02 --output cosmic-gravity-astra-ultra.html

The preparation command refuses an existing destination or a directory inside the publication repository. The freeze command refuses a changed prompt or an existing frozen bundle. Update the neutral run metadata with actual runtime, context and interventions before freezing.

The Cosmic Gravity prompt also asks for a minimal documentation update. A future isolated run may produce local documentation. Curator publication still happens after the delivered output is frozen.

## Future experiments

Use a lowercase descriptive directory with a README, one canonical prompt and immutable outputs. Keep the existing Cosmic Gravity directory and URLs. The catalogue supports non-HTML artefacts; browser capture settings are optional and belong to media configuration.

Publish limitations alongside results. Do not infer quality, speed, cost or scientific validity from screenshots or effort labels.
