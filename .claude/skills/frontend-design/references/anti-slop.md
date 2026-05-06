# Anti-Slop — AI Tells to Avoid

LLMs have statistical biases that produce instantly recognizable "AI design." This file lists the tells and how to dodge them. Adapted from [taste-skill](https://github.com/Leonxlnx/taste-skill).

> **Forward-looking only.** These rules apply to **new** components, **new** Storybook stories, and **new** AI-pipeline outputs. The 33 Phase-1 components shipped before this rule existed are NOT in scope — do not refactor or rename them based on this file.

> **For project-specific styling/animation conventions** (semantic OKLCH tokens, Framer Motion timing, slot rules), `style-guide.md` and `anti-patterns.md` still take precedence. Anti-slop is layered on top.

---

## Visual & CSS

- **No neon glows.** Don't use `box-shadow` glow rings or "auto-glow" effects. Use inner borders (`border-white/10` or `border-base-300`) and subtle tinted shadows (`shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]`).
- **No pure black.** Never `#000000`. Use Off-Black, Zinc-950, or SiteGen's `bg-neutral` token (which resolves to OKLCH off-black).
- **No oversaturated accents.** Cap accent saturation < 80%. The semantic `bg-primary` token already respects this — don't override with raw Tailwind.
- **No gradient text on big headers.** `bg-clip-text` rainbow gradients on H1s are a slop signature. Use weight, color, and tracking for hierarchy instead.
- **No custom mouse cursors.** They wreck performance and accessibility.
- **No "Liquid Glass" without inner refraction.** When using `backdrop-blur`, add a 1px inner border (`border-white/10`) and inner shadow (`shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`) to simulate edge refraction.

## Typography

- **No Inter for "premium" or "creative" briefs.** Inter is the default LLM font and screams "AI generated." Prefer `Geist`, `Outfit`, `Cabinet Grotesk`, or `Satoshi`. SiteGen drives display fonts via per-site CSS variables — when the brief calls for premium, the Style Agent should pick one of these.
- **No Serif on dashboards or technical UIs.** Serifs are for editorial/luxury heroes only. Dashboard/data UIs use high-end Sans pairings (`Geist` + `Geist Mono`, or `Satoshi` + `JetBrains Mono`).
- **No oversized H1s screaming for attention.** Default to `text-4xl md:text-6xl tracking-tighter leading-none`. Hierarchy comes from weight + color, not just scale.
- **Body text:** `text-base text-base-content/60 leading-relaxed max-w-[65ch]` is the default. Don't go wider than 65ch on long-form copy.
- **One palette, one font stack per output.** Don't fluctuate between warm and cool grays in the same component, or pair two display fonts.

## Layout & Spacing

- **No 3-equal-card horizontal rows.** The generic "3 features in a row, all the same size" is a slop signature. Use a 2-column zig-zag, asymmetric grid (`grid-cols-[2fr_1fr_1fr]`), horizontal scroll, or Bento-style tile grouping.
- **No always-centered hero.** When `DESIGN_VARIANCE > 4` (see `taste-dials.md`), force split-screen, left-aligned-content/right-aligned-asset, or asymmetric whitespace.
- **No flexbox percentage math.** Don't write `w-[calc(33%-1rem)]`. Use CSS Grid (`grid grid-cols-1 md:grid-cols-3 gap-6`) for reliable structures.
- **No card-overuse.** When `VISUAL_DENSITY ≥ 7`, generic card containers are banned. Use `border-t`, `divide-y`, or pure negative-space grouping. Cards only when elevation communicates hierarchy.
- **Mathematically perfect spacing.** Stick to Tailwind's spacing scale. Don't ship `p-[17px]` arbitrary values. Round to the nearest scale stop.

## Content (Storybook stories AND AI-pipeline outputs)

The Content Agent and Storybook story authors share this rule: realistic, contextual, non-generic content.

- **No "Jane Doe / John Doe / Sarah Chan" placeholder names.** Use realistic, varied names that fit the segment (e.g., for a Brazilian SMB site: `Mariana Cardoso`, `Rafael Tavares`, `Bianca Okazaki`). Pull from actual demographics for the target market.
- **No SVG "egg" avatars or generic Lucide user icons.** Use creative, believable photo placeholders (`picsum.photos/seed/<random>/200/200`) or stylized initials.
- **No round metrics.** `99.99%`, `100K+ users`, `50% faster`, `1234567`. These are LLM defaults. Use organic, messy numbers: `47.2% lift`, `3,847 deliveries`, `+1 (312) 847-1928`.
- **No startup-slop brand names.** "Acme", "Nexus", "SmartFlow", "Velocity", "Helix". Invent contextual, premium names that match the segment in the brief.
- **No filler verbs.** Banned: "Elevate", "Seamless", "Unleash", "Next-Gen", "Empower", "Revolutionize", "Transform your X". Use concrete verbs that describe what the product actually does.
- **No "Lorem ipsum" or "Your headline here" in stories.** If you don't have realistic copy, write some.

## External Resources

- **No Unsplash hotlinks.** They break, get rate-limited, and look cheap. Use:
  - `https://placehold.co/<W>x<H>` — solid-color placeholders
  - `https://picsum.photos/seed/<deterministic-string>/<W>/<H>` — deterministic photo placeholders
  - SVG UI Avatars for people: `https://ui-avatars.com/api/?name=...`
- **shadcn/ui in default state is banned.** If using shadcn primitives, customize radii, colors, and shadows to match the SiteGen token system before shipping.

## Pre-output checklist

Before declaring a component done, scan the output for:

- [ ] No `#000` literal black, no neon glows, no rainbow-gradient H1s
- [ ] No Inter for premium briefs (Storybook stories OK to use system default; AI-pipeline outputs must pick from the approved stack)
- [ ] No 3-equal-card horizontal row
- [ ] No "John Doe" or "Acme" or "Elevate"
- [ ] No `99.99%` or `1234567`
- [ ] No raw `unsplash.com/...` URLs
- [ ] All padding/margins land on the Tailwind spacing scale

If the brief explicitly asks for one of these (e.g., "I want a centered hero" or "use the name Acme — it's the actual client"), the user override wins. Note the override in your output so the user sees it.
