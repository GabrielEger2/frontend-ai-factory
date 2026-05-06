# Taste Dials — Design Variance, Motion Intensity, Visual Density

Three knobs that bias generation away from generic AI defaults toward intentional design choices. Adapted from [taste-skill](https://github.com/Leonxlnx/taste-skill) and tuned to SiteGen's slot-driven, semantic-token component library.

## How to use

1. Pick a value for each dial **before generating**. State your choice explicitly so the user can override.
2. Default baseline: `DESIGN_VARIANCE 8 / MOTION_INTENSITY 6 / VISUAL_DENSITY 4`. This skews premium and editorial — match it unless the brief or component category suggests otherwise.
3. Read the brief for explicit overrides ("make it minimal", "lots of motion", "data-dense") and adjust.
4. Use the per-category presets below as a starting point.
5. Apply the **Mobile Override** (bottom of file) to anything with `DESIGN_VARIANCE ≥ 4`.

## DESIGN_VARIANCE (1–10) — layout symmetry vs. asymmetry

| Range | Mode | What it looks like |
|---|---|---|
| 1–3 | Predictable | Flexbox `justify-center`, strict 12-column symmetrical grids, equal paddings |
| 4–7 | Offset | `margin-top: -2rem` overlaps, mixed image aspect ratios (4:3 next to 16:9), left-aligned headers over centered data |
| 8–10 | Asymmetric | Masonry layouts, CSS Grid with fractional units (`grid-template-columns: 2fr 1fr 1fr`), massive empty zones (`padding-left: 20vw`) |

**Anti-center bias:** when `DESIGN_VARIANCE > 4`, fully-centered Hero/H1 sections are banned. Force split-screen, left-aligned-content/right-aligned-asset, or asymmetric whitespace.

## MOTION_INTENSITY (1–10) — how alive things feel

| Range | Mode | What it looks like |
|---|---|---|
| 1–3 | Static | No automatic animations. CSS `:hover` and `:active` only |
| 4–7 | Fluid CSS | `whileInView` reveals, `staggerChildren`, hover scale, subtle `y` offsets. Focus on `transform`/`opacity`. Project default timing (200–300ms) from `animation.md` |
| 8–10 | Cinematic | Spring physics (`type: "spring", stiffness: 100, damping: 20`), perpetual micro-interactions (Pulse, Float, Shimmer), `layoutId` shared-element transitions, scroll-triggered choreography. See `animation.md` § Premium Motion |

When `MOTION_INTENSITY ≥ 6`, follow the Premium Motion rules in `animation.md` — spring physics, `useMotionValue` over `useState`, isolated memoized client components.

## VISUAL_DENSITY (1–10) — breathing room vs. data packing

| Range | Mode | What it looks like |
|---|---|---|
| 1–3 | Art Gallery | Big whitespace, large section gaps, single-column flow, generous `py-24+` |
| 4–7 | Standard App | Normal SiteGen spacing — `py-12 md:py-16 lg:py-24`, `gap-6` |
| 8–10 | Cockpit | Tight padding, no card boxes — use 1px lines (`border-t`, `divide-y`). All numerals in `font-mono`. Dashboard-style data packing |

When `VISUAL_DENSITY ≥ 7`, generic cards are banned in favor of negative-space and divider-line grouping. Cards only when elevation actually communicates hierarchy.

## Per-Category Presets

Use these as defaults when the brief doesn't override. Tune ±1 based on style/mood signals (`bold` and `editorial` push variance up; `minimal` and `corporate` pull motion down).

| Category | Variance | Motion | Density | Notes |
|---|---|---|---|---|
| `hero` | 7–9 | 6–8 | 3–4 | High variance is the whole point. Asymmetric splits beat centered. |
| `cta` | 6–8 | 6–7 | 3–5 | Motion sells action — magnetic buttons, tactile press feedback |
| `testimonial` | 5–7 | 5–7 | 4–5 | Stagger reveals are the standard pattern |
| `carousel` | 5–7 | 7–9 | 4–6 | Motion is the feature |
| `motion` | 7–9 | 8–10 | 3–5 | Sticky-stack, parallax, scroll-driven |
| `stats` | 4–6 | 4–6 | 6–8 | Mono numerals (`font-mono`), tighter spacing, count-up reveal |
| `features` (`layout/grid`) | 5–7 | 4–6 | 4–6 | **Forbidden:** 3-equal-card horizontal row. Use zig-zag, asymmetric grid, or horizontal scroll |
| `services` (`layout/split`) | 6–8 | 4–6 | 4–6 | Split layouts are explicitly the category — lean into asymmetry |
| `faq` | 3–5 | 3–4 | 4–6 | Calm, readable. Motion only on accordion expand |
| `contact` | 4–6 | 3–5 | 4–6 | Form clarity over flourish; map can carry motion |
| `navigation` | 5–7 | 5–7 | 5–7 | Pill, sticky, dock magnification — motion adds polish here |
| `footer` | 3–5 | 2–3 | 5–7 | Calm anchor at the bottom — restraint wins |

## Reading the brief for overrides

Pull dial overrides from these phrases:

| Phrase | Adjust |
|---|---|
| "minimal", "clean", "calm", "Apple-like" | Variance −2, Motion −2, Density −2 |
| "editorial", "magazine", "premium" | Variance +1, Motion +1, Density 0 |
| "bold", "energetic", "in-your-face" | Variance +1, Motion +2 |
| "data-dense", "dashboard-y", "info-rich" | Density +3 |
| "lots of motion", "alive", "wow factor" | Motion +2 (cap 10) |
| "static", "no animation", "performance-first" | Motion −4 |
| "playful", "fun" | Variance +1, Motion +1 |

## Mobile Override (mandatory)

Any component generated with `DESIGN_VARIANCE ≥ 4` MUST collapse to a strict single-column layout below `md:` (768px):
- `w-full` on all top-level grid/flex children
- `px-4` page-edge padding
- `py-8` to `py-12` vertical rhythm
- No horizontal scroll. Test at 320px viewport.

This is non-negotiable — asymmetric desktop layouts that don't collapse cleanly create horizontal-scroll bugs on mobile, which is the #1 silent regression in SiteGen-generated sites.

## State your choice

Before generating any component, output one line stating the chosen values. Example:

> Dials: VARIANCE 8 / MOTION 7 / DENSITY 4 (hero category, brief says "editorial premium" — bumped variance and motion).

This makes the choice visible to the user and gives them a clean override surface.
