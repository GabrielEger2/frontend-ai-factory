# Component Library Architecture Reorganization

## Task Boundary
Reorganize the component library from self-contained opinionated components into a **style kit + parameterized layout** architecture. Every component should respect a site-wide style kit for visual consistency. Full migration — not incremental.

## Implementation Decisions (LOCKED)

### 1. Style Kit as First-Class Concept
- The Style Agent outputs a style kit: background, card, textDecoration, buttonVariant, buttonColorScheme, theme tokens
- Every section on the page respects the style kit
- One card style per site, one background pattern, 1-2 text decorations max

### 2. Heroes Stay Opinionated
- Heroes remain as distinct components (not parameterized layouts)
- Each hero declares which style kit slots it uses (background, textDecoration, button)
- Some heroes don't use background (SplitImage, ParallaxImages — their images ARE the visual)
- Style kit fills in the blanks heroes expose, doesn't override their structure

### 3. Layouts Organized by Spatial Structure
- Directory structure: `layouts/grid/`, `layouts/split/`, `layouts/scroll/`
- NOT organized by semantic purpose (features vs content)
- Purpose is a metadata tag, not a directory

### 4. Cards Are Content-Aware with Modes (NOT pure containers)
- Cards have predefined content modes: feature, testimonial, product, team, etc.
- Each mode defines which props are expected and how they're laid out inside the card
- The style kit picks which card (Magic, Base, Flip, etc.)
- The layout's purpose determines which content mode
- This keeps AI output constrained — no freeform children

### 5. Testimonials Standardized into Layout System
- No separate testimonial category
- Testimonials are grid/split/scroll layouts with `purpose: "testimonials"`
- TestimonialShowcase → split layout with purpose testimonial
- TestimonialsScrolling → InfiniteScroll layout
- TestimonialsStacked → SimpleGrid with purpose testimonial
- TestimonialsStagger → CardGrid with stagger animation

### 6. Layout Components Accept Style Kit Props
- Layouts receive which card/background/textDecoration to use as props
- The Assembler passes style kit choices to each layout
- Layouts declare what they accept via `acceptsStyleKit` in metadata

### 7. Metadata Schema Updates
- Add `purpose` array (features, testimonials, team, products, services, etc.)
- Add `acceptsStyleKit` object (card: bool, background: bool, textDecoration: bool)
- Category becomes structural: "layout/grid", "layout/split", "layout/scroll", "hero", "cta", etc.

## Claude's Discretion
- Exact content mode names for cards
- Internal prop interface design
- How to handle AuthorSplit (merge into ImageText or keep separate)
- Animation patterns for each layout
- Storybook story organization after migration

## Existing Code Insights
- 29 components across 10 categories in components/library/
- 20+ UI primitives in components/ui/ (backgrounds/6, cards/7, text-decorations/6, button/5 variants)
- Token-based theme system with CSS custom properties (oklch)
- Only 1 theme implemented (default light + dark)
- FeaturesCards imports 6 card primitives — most coupled component
- 4 components missing metadata.json: ContentImageText, TestimonialsScrolling, TestimonialsStacked, TestimonialsStagger
- Dual motion library: motion/react vs framer-motion coexist
- Stories files exist inside ui/ subdirs (anomaly)
- itemSchema format inconsistency in metadata (fields array vs flat object)

## Specific Ideas
- CardGrid purpose examples: features, testimonials, team, products, services
- IconGrid purpose examples: features, services, process
- SimpleGrid purpose examples: features, benefits, stats
- Background rhythm: hero always, CTA sometimes, not every section — Composer decides
- Card content modes: feature (icon+title+desc+CTA), testimonial (avatar+quote+name+role), product (image+price+rating+CTA), team (photo+name+title+bio)

## Deferred Ideas
- Style kit schema TypeScript interface (needs research on what exactly the Style Agent outputs)
- Multiple theme support (only default theme exists now)
- Neo4j graph model updates for layout vs style compatibility (Phase 3)
