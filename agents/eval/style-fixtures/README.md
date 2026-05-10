# Style Agent Eval Fixtures

Manual regression fixtures for the **Style Agent** palette character output.
Unlike `agents/eval/fixtures/` (which is auto-loaded by `agents/eval/runner.ts`
to score Composer rerank candidates), this directory is **manually invoked**
and intentionally isolated from the Composer runner.

## Why a separate directory?

`agents/eval/runner.ts::loadFixtures` (lines 118-128) globs `*.jsonl` files
out of `agents/eval/fixtures/` and feeds them through the Composer rerank
sweep. Dropping Style-Agent briefs in there as `.jsonl` would crash that
runner (wrong shape). This directory uses:

1. **A different path** — `agents/eval/style-fixtures/` instead of `fixtures/`
2. **A different extension** — `.json` instead of `.jsonl`

Both guards must hold. Do not rename these files to `.jsonl` and do not move
them into `agents/eval/fixtures/`.

## File naming

| File                              | Purpose                                                  |
| --------------------------------- | -------------------------------------------------------- |
| `<slug>.json`                     | Style Agent input brief — `StyleAgentInput`-shaped       |
| `<slug>.gold.json`                | Expected character constraints (gold standard)           |

The `<slug>` matches across the two files (e.g. `yoga-studio.json` and
`yoga-studio.gold.json`).

## How to run

There is **no automated harness** for these fixtures — manual invocation only
(per `.claude/work/context.md` decision F2). To run:

1. Deploy the dev stack with the Color Quality v2 prompt changes:

   ```sh
   npm run deploy
   ```

2. Invoke the deployed Style Agent Lambda directly with one of the brief
   files as the event payload (e.g. via the AWS console "Test" tab or
   `aws lambda invoke`):

   ```sh
   aws lambda invoke \
     --function-name <StyleAgentLambdaName> \
     --payload file://agents/eval/style-fixtures/yoga-studio.json \
     out.json
   ```

3. Open the returned palette. Compare each hex against the matching
   `.gold.json`:

   - **`saturationBucket`** — does the overall palette character match?
   - **`forbidden`** — does any palette field fall inside any forbidden
     category (perceptual match, not exact hex)?
   - **`exampleBadOutputs`** — is the palette near-perceptually similar to
     any of these specific hexes?
   - **`expectedColorFamilies`** — does the palette draw from the listed
     families?
   - **`primaryMustEqual`** (if present, `legal-luxe-boutique` only) —
     does `palette.primary` equal that exact hex? If not, **Rule 8 is
     broken** and must be debugged before any further work.

4. Repeat **at least 5 runs per fixture** (the Style Agent is
   non-deterministic — same input produces different palettes).

## Acceptance

A fixture **passes** when, across **≥5 runs**:

- **0 / 5** outputs violate the `forbidden` list (no perceptual matches)
- **0 / 5** outputs produce a hex visually similar to any
  `exampleBadOutputs` entry
- **5 / 5** outputs draw from `expectedColorFamilies` (at least one field
  per family is OK — full coverage is not required)
- **5 / 5** outputs satisfy `primaryMustEqual` when set

If any run violates these conditions, the fixture fails and we escalate.

## Escalation

If any fixture fails, the prompt-only steering is insufficient and we
escalate to programmatic enforcement (per `.claude/work/context.md`):

1. Add `getChromaEstimate(hex)` heuristic in `agents/shared/color.ts`.
2. Add per-vertical chroma ceilings to the Style Agent's post-parse
   validation step.
3. Wire a retry loop on chroma violation, mirroring the existing WCAG
   retry pattern.

These are deliberately deferred until the prompt revamp is shown to be
insufficient by these fixtures.

## Fixtures

| Slug                       | Vertical            | What it tests                                   |
| -------------------------- | ------------------- | ----------------------------------------------- |
| `yoga-studio`              | `wellness`          | Forbidden-zone enforcement + `colorsToAvoid`    |
| `luxe-clinic`              | `healthcare-luxe`   | High-risk luxury forbidden zone                 |
| `legal-luxe-boutique`      | `legal-luxe`        | Rule 8 brand anchor + colorsToAvoid + zone      |
