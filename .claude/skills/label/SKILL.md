---
name: label
description: Capture, label, and sweep rerank fixtures to tune DEFAULT_RERANK_WEIGHTS
user-invokable: true
---

You are the rerank eval orchestrator for SiteGen. You help Gabriel capture fixtures, label ground-truth picks, run weight grid sweeps, and read reports to improve the composer's `DEFAULT_RERANK_WEIGHTS`.

# MANDATORY BEHAVIOR

- Run capture BEFORE labeling. Never hand-write fixture lines.
- Fill `pickId` for every scoreable line before running the sweep. Lines with `pickId: null` are skipped with a warning.
- Lines where `captureSource === "fallback"` are automatically skipped. Re-capture affected briefs if Qdrant was unavailable.
- Never commit `DEFAULT_RERANK_WEIGHTS` changes without reading the sweep report and agreeing with the recommendation.
- The grid search makes zero API calls — sub-second on 56 picks. Run it as often as you want.
- `rerank.ts`, `handler.ts`, and `prompt.ts` are NOT modified by this skill. Only `DEFAULT_RERANK_WEIGHTS` values may change as Phase 5 output.

# Context

The Composer uses `rerankCandidates()` to re-order vector-retrieved component candidates using four signals: `pairsWith`, `styleOverlap`, `diversity`, `density`. Their weights (`DEFAULT_RERANK_WEIGHTS`, currently all 0.25) were initialized equal. The label skill empirically tunes those weights against human-labeled picks across 8 diverse Brazilian SMB briefs.

A fixture line = one slot pick = one data point. 8 briefs × 7 slots (navigation excluded) = 56 picks. The runner sweeps all 5⁴ = 625 coarse weight combinations and reports which combo maximizes rank-weighted agreement (1/r, K=5) with human labels, both globally and per slot category.

Hidden constants the grid cannot tune (documented for awareness):

| Constant | Value | Effect |
|---|---|---|
| `PAIRS_WITH_BOOST` | 0.3 | Per-prior-pick bonus to avgPairScore |
| `PAIRS_WITH_DEMOTE` | 0.3 | Per-prior-pick penalty |
| `IMAGE_WEIGHT_HEAVY_THRESHOLD` | 0.3 | imageWeight ≥ this → image-heavy |
| `DIVERSITY_REPEAT_THRESHOLD` | 3 | Tag must repeat ≥3 times to penalize |

These live at `agents/composer/rerank.ts:9-17` and require source edits to change. Treat as a second-layer tuning surface after the weight sweep.

Known limitation: `query:vectors` uses the hardcoded `DEFAULT_SKELETON`; production Composer uses an LLM-planned skeleton per brief. Slot order may differ. Acceptable for tuning since the four signals are skeleton-order-independent.

# Phase 1: Capture

For each brief in the fixture target list, run the capture script once. Queries Qdrant live and writes a 7-line JSONL stub to `agents/eval/fixtures/<slug>.jsonl`. All `pickId` fields start as `null`.

Command (from repo root, requires Qdrant + OpenAI SSM env vars):

```bash
npm run query:vectors --workspace=agents -- \
  "padaria de luxo em São Paulo" \
  --mood "elegant,warm,friendly" \
  --style "editorial,luxury,classic" \
  --density medium \
  --capture padaria-luxo-sp
```

Repeat for all 8 briefs:

| Brief | Slug |
|---|---|
| padaria de luxo em São Paulo | `padaria-luxo-sp` |
| advocacia tributária em Belo Horizonte | `advocacia-tributaria-bh` |
| academia de crossfit no Rio | `crossfit-rj` |
| agência de marketing digital B2B | `agencia-marketing-b2b` |
| restaurante japonês alta gastronomia | `restaurante-japones` |
| clínica odontológica família | `clinica-odontologica` |
| ateliê de moda autoral | `atelie-moda` |
| consultoria financeira pessoal | `consultoria-financeira` |

After capture: `agents/eval/fixtures/` contains 8 `.jsonl` files. Each has 7 lines (navigation excluded). All `pickId` fields are `null`. Stdout debug output continues normally — that is expected.

If `captureSource === "fallback"` appears: Qdrant was unavailable. Do not label fallback lines — runner skips them. Re-run `--capture` for that brief when Qdrant is reachable.

# Phase 2: Label

Open each `.jsonl` file in a text editor. For each line, read `candidates[]` and pick the component you would choose for that slot given the brief. Set `pickId` to that candidate's `id`.

```jsonc
// Before:
"pickId": null

// After:
"pickId": "hero-bakery-editorial-01"
```

Rules:
- `pickId` MUST be the `id` of one of the entries in `candidates[]` for that line. Picking outside the pool is not meaningful — rerank only re-orders what was retrieved.
- If you would not pick any candidate (all wrong for the brief), leave `pickId: null`. Line is skipped.
- Work through all 7 lines in each file before moving to the next brief.
- `previouslyPicked` reflects what the algorithm picked during capture. The runner uses YOUR labels from prior lines as `previouslyPicked` for downstream slots (frozen human-pick strategy).

Expected effort: 56 pick decisions, 30–60 minutes total.

# Phase 3: Run the Sweep

Once labeled (or at minimum a usefully-sized subset):

```bash
npm run eval:rerank --workspace=agents
```

The runner:
1. Loads all `.jsonl` files from `agents/eval/fixtures/`.
2. Skips `pickId: null` and `captureSource: "fallback"` lines.
3. Sweeps 625 weight combinations.
4. Writes `agents/eval/reports/latest.md` and `latest.json`.
5. Also writes a timestamped copy.

Expected runtime: under 5 seconds for 56 labeled lines.

# Phase 4: Read the Report

Open `agents/eval/reports/latest.md`. Sections:

1. **Baseline** — current `DEFAULT_RERANK_WEIGHTS` (all 0.25) global agreement and per-slot breakdown.
2. **Best global combo** — weight set maximizing total agreement.
3. **Best per-slot** — best weights for each of the 7 slot categories.
4. **Top-5 disagreements** — lines where the algorithm (baseline weights) most disagreed with your label. Shows your pick, algorithm's rank-1, your pick's rank, and `_rerankDebug` signal breakdown for both. Use this to understand *why* the disagreement happened.

Interpretation:
- Per-slot best very different from global best → global is a compromise; per-slot runtime overrides may help (separate PR).
- A weight of 0 in best combo → that signal is adding noise rather than value with current data.
- Score = 1.0 on a slot → your pick was always rank-1 with those weights.
- JSON sidecar (`latest.json`) has all 625 GridPoints for custom analysis.

# Phase 5: Apply (optional)

If best global combo improves over baseline meaningfully (e.g. +0.05 agreement):

1. Open `agents/composer/rerank.ts`.
2. Update `DEFAULT_RERANK_WEIGHTS` (lines 140-145) to recommended values.
3. Commit: `tune(composer): update DEFAULT_RERANK_WEIGHTS based on <date> sweep`.
4. Add a comment above the constant citing report date and fixture count.

Do NOT apply per-slot overrides at the handler level here — that's a future feature.

# Re-running After Algorithm Changes

If `rerankCandidates` changes (new signal, formula rewrite): re-run `--capture` for affected briefs before re-labeling. Existing fixtures may be missing fields the new algorithm reads.

If only `DEFAULT_RERANK_WEIGHTS` values change: existing fixtures stay valid — re-run Phase 3 only.
