/* ------------------------------------------------------------------ */
/*  Segment Presets — hardcoded component layouts per business segment */
/*  Phase 1: no AI composition (Composer Agent is Phase 2)            */
/* ------------------------------------------------------------------ */

/**
 * Each preset is an ordered list of component IDs from the library.
 * The Content Agent receives this list and generates copy for each
 * component's slots. Every preset includes navbar-sticky-01 at the top.
 */
export const SEGMENT_PRESETS: Record<string, string[]> = {
  "pet-shop": [
    "navbar-sticky-01",
    "hero-parallax-images-01",
    "layout-cardgrid-01",
    "stats-count-up-01",
    "cta-banner-01",
    "footer-reveal-01",
  ],
  "law-firm": [
    "navbar-sticky-01",
    "hero-split-image-01",
    "layout-iconlistsplit-01",
    "faq-accordion-01",
    "contact-form-01",
    "footer-reveal-01",
  ],
  restaurant: [
    "navbar-sticky-01",
    "hero-geometric-01",
    "layout-imagetext-01",
    "layout-simplegrid-01",
    "contact-form-01",
    "footer-reveal-01",
  ],
  saas: [
    "navbar-sticky-01",
    "hero-split-image-01",
    "layout-stickycards-01",
    "layout-cardgrid-01",
    "faq-solutions-01",
    "cta-banner-01",
    "footer-reveal-01",
  ],
  ecommerce: [
    "navbar-sticky-01",
    "hero-parallax-images-01",
    "layout-cardgrid-01",
    "layout-infinitescroll-01",
    "cta-inline-01",
    "footer-reveal-01",
  ],
  /* ---- Generic preset — temporary until Composer Agent replaces presets ---- */
  bakery: [
    "navbar-sticky-01",
    "hero-split-image-01",
    "layout-cardgrid-01",
    "stats-count-up-01",
    "contact-form-01",
    "footer-reveal-01",
  ],
  "dental-clinic": [
    "navbar-sticky-01",
    "hero-split-image-01",
    "layout-cardgrid-01",
    "stats-count-up-01",
    "contact-form-01",
    "footer-reveal-01",
  ],
  gym: [
    "navbar-sticky-01",
    "hero-split-image-01",
    "layout-cardgrid-01",
    "stats-count-up-01",
    "cta-banner-01",
    "footer-reveal-01",
  ],
  "beauty-salon": [
    "navbar-sticky-01",
    "hero-split-image-01",
    "layout-cardgrid-01",
    "stats-count-up-01",
    "contact-form-01",
    "footer-reveal-01",
  ],
  "real-estate": [
    "navbar-sticky-01",
    "hero-split-image-01",
    "layout-cardgrid-01",
    "stats-count-up-01",
    "cta-banner-01",
    "footer-reveal-01",
  ],
  accounting: [
    "navbar-sticky-01",
    "hero-split-image-01",
    "layout-iconlistsplit-01",
    "faq-accordion-01",
    "contact-form-01",
    "footer-reveal-01",
  ],
  "auto-repair": [
    "navbar-sticky-01",
    "hero-split-image-01",
    "layout-cardgrid-01",
    "stats-count-up-01",
    "contact-form-01",
    "footer-reveal-01",
  ],
  construction: [
    "navbar-sticky-01",
    "hero-split-image-01",
    "layout-cardgrid-01",
    "stats-count-up-01",
    "cta-banner-01",
    "footer-reveal-01",
  ],
  photography: [
    "navbar-sticky-01",
    "hero-parallax-images-01",
    "layout-cardgrid-01",
    "stats-count-up-01",
    "contact-form-01",
    "footer-reveal-01",
  ],
  consulting: [
    "navbar-sticky-01",
    "hero-split-image-01",
    "layout-iconlistsplit-01",
    "faq-accordion-01",
    "contact-form-01",
    "footer-reveal-01",
  ],
  education: [
    "navbar-sticky-01",
    "hero-split-image-01",
    "layout-cardgrid-01",
    "faq-accordion-01",
    "contact-form-01",
    "footer-reveal-01",
  ],
  "clothing-store": [
    "navbar-sticky-01",
    "hero-parallax-images-01",
    "layout-cardgrid-01",
    "cta-banner-01",
    "cta-inline-01",
    "footer-reveal-01",
  ],
  "health-clinic": [
    "navbar-sticky-01",
    "hero-split-image-01",
    "layout-cardgrid-01",
    "stats-count-up-01",
    "contact-form-01",
    "footer-reveal-01",
  ],
};

export const SUPPORTED_SEGMENTS = Object.keys(SEGMENT_PRESETS);

/**
 * Returns the component ID list for a given segment.
 * Throws if the segment is not supported.
 */
export function getPreset(segment: string): string[] {
  const preset = SEGMENT_PRESETS[segment];
  if (!preset) {
    throw new Error(
      `Unsupported segment "${segment}". Supported: ${SUPPORTED_SEGMENTS.join(", ")}`,
    );
  }
  return preset;
}
