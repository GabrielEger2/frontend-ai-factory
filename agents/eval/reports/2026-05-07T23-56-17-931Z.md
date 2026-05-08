# Rerank Weight Grid Search Report

- Generated: 2026-05-07T23:56:17.930Z
- Total fixture lines: 53
- Scoreable lines: 8
- Skipped (fallback captureSource): 0
- Skipped (pickId null): 45
- Grid combinations evaluated: 625

## Baseline (DEFAULT_RERANK_WEIGHTS)

Weights: pairsWith=0.25, styleOverlap=0.25, diversity=0.25, density=0.25

**Global score:** 0.567

| Slot | Score |
|---|---|
| hero | 0.750 |
| products | 0.500 |
| content | 0.200 |
| testimonial | 1.000 |
| cta | 1.000 |
| contact | 0.000 |
| footer | 0.333 |

## Best Global Combo

| pairsWith | styleOverlap | diversity | density | Global Score | vs Baseline |
|---|---|---|---|---|---|
| 0.00 | 0.75 | 0.00 | 0.25 | 0.775 | +0.208 |

**Per-slot scores under best-global weights:**

| Slot | Score |
|---|---|
| hero | 0.500 |
| products | 1.000 |
| content | 0.200 |
| testimonial | 1.000 |
| cta | 1.000 |
| contact | 1.000 |
| footer | 1.000 |

## Best Per-Slot Weights

| Slot | pairsWith | styleOverlap | diversity | density | Score | vs Baseline |
|---|---|---|---|---|---|---|
| hero | 0.25 | 0.25 | 0.00 | 0.00 | 0.750 | +0.000 |
| products | 0.00 | 0.00 | 0.00 | 0.00 | 1.000 | +0.500 |
| content | 0.00 | 0.00 | 0.00 | 0.00 | 0.500 | +0.300 |
| testimonial | 0.00 | 0.25 | 0.00 | 0.25 | 1.000 | +0.000 |
| cta | 0.00 | 0.00 | 0.00 | 0.00 | 1.000 | +0.000 |
| contact | 0.00 | 0.00 | 0.00 | 0.00 | 1.000 | +1.000 |
| footer | 0.00 | 0.00 | 0.00 | 0.00 | 1.000 | +0.667 |

## Top-5 Disagreements (baseline weights)

### 1. padaria-luxo-sp__contact (contact)

- Your pick: `contact-locations-map-01`
- Algorithm rank-1: `contact-booking-embed-01`
- Your pick's rank: >5 (out of top-K)
- Score: 0.000

| Candidate | pairsWith | styleOverlap | diversityPenalty | densityPenalty | rerankScore |
|---|---|---|---|---|---|
| your pick (contact-locations-map-01) | 0.297 | 0.333 | 0.667 | 0.000 | -0.009 |
| algo rank-1 (contact-booking-embed-01) | 0.264 | 0.167 | 0.167 | 0.000 | 0.066 |

### 2. padaria-luxo-sp__content (content)

- Your pick: `layout-comparisonsplit-01`
- Algorithm rank-1: `gallery-image-text-editorial-01`
- Your pick's rank: 5
- Score: 0.200

| Candidate | pairsWith | styleOverlap | diversityPenalty | densityPenalty | rerankScore |
|---|---|---|---|---|---|
| your pick (layout-comparisonsplit-01) | 0.333 | 0.000 | 0.000 | 0.500 | -0.042 |
| algo rank-1 (gallery-image-text-editorial-01) | 0.405 | 0.500 | 0.000 | 0.000 | 0.226 |

### 3. padaria-luxo-sp__footer (footer)

- Your pick: `footer-reveal-01`
- Algorithm rank-1: `footer-mega-01`
- Your pick's rank: 3
- Score: 0.333

| Candidate | pairsWith | styleOverlap | diversityPenalty | densityPenalty | rerankScore |
|---|---|---|---|---|---|
| your pick (footer-reveal-01) | 0.487 | 0.333 | 0.667 | 0.500 | -0.086 |
| algo rank-1 (footer-mega-01) | 0.726 | 0.167 | 0.667 | 0.000 | 0.056 |

### 4. padaria-luxo-sp__hero (hero)

- Your pick: `hero-bakery-editorial-01`
- Algorithm rank-1: `hero-polaroid-collage-01`
- Your pick's rank: 2
- Score: 0.500

| Candidate | pairsWith | styleOverlap | diversityPenalty | densityPenalty | rerankScore |
|---|---|---|---|---|---|
| your pick (hero-bakery-editorial-01) | 0.382 | 0.500 | 0.000 | 0.000 | 0.221 |
| algo rank-1 (hero-polaroid-collage-01) | 0.374 | 0.667 | 0.000 | 0.000 | 0.260 |

### 5. padaria-luxo-sp__products (products)

- Your pick: `products-spotlight-01`
- Algorithm rank-1: `products-featured-strip-01`
- Your pick's rank: 2
- Score: 0.500

| Candidate | pairsWith | styleOverlap | diversityPenalty | densityPenalty | rerankScore |
|---|---|---|---|---|---|
| your pick (products-spotlight-01) | 0.442 | 0.000 | 0.000 | 0.500 | -0.014 |
| algo rank-1 (products-featured-strip-01) | 0.505 | 0.000 | 0.000 | 0.500 | 0.001 |

## Applying the Best Combo

To apply the best global combo, update `DEFAULT_RERANK_WEIGHTS` in `agents/composer/rerank.ts:140-145`.
