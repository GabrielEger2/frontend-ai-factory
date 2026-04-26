export type StyleKit = {
  card?: string;
  ctaVariant?: string;
  ctaColorScheme?: string;
  background?: string;
  textDecoration?: string;
};

type SlotPatternConfig = {
  ctaVariantSlot?: string;
  ctaColorSchemeSlot?: string;
  backgroundSlot?: string;
  textDecorationHandled?: boolean;
};

export const SLOT_PATTERN_MAP: Record<string, SlotPatternConfig> = {
  "hero-split-image-01": {
    ctaVariantSlot: "ctaStyle",
    ctaColorSchemeSlot: "ctaColorScheme",
    textDecorationHandled: true,
  },
  "hero-geometric-01": {
    ctaVariantSlot: "ctaStyle",
    ctaColorSchemeSlot: "ctaColorScheme",
    textDecorationHandled: true,
  },
  "hero-parallax-images-01": {
    ctaVariantSlot: "ctaStyle",
    ctaColorSchemeSlot: "ctaColorScheme",
    textDecorationHandled: true,
  },
  "hero-shuffle-cards-01": {
    ctaVariantSlot: "ctaStyle",
    ctaColorSchemeSlot: "ctaColorScheme",
    textDecorationHandled: true,
  },
  "hero-hero-bold-editorial-01": {
    ctaVariantSlot: "ctaStyle",
    ctaColorSchemeSlot: "ctaColorScheme",
    backgroundSlot: "backgroundVariant",
    textDecorationHandled: true,
  },
  "layout-editorial-framed-split-01": {
    ctaVariantSlot: "ctaVariant",
    ctaColorSchemeSlot: "ctaColorScheme",
    backgroundSlot: "backgroundVariant",
    textDecorationHandled: true,
  },
  "cta-cta-collage-duo-01": {
    ctaVariantSlot: "ctaStyle",
    ctaColorSchemeSlot: "ctaColorScheme",
    backgroundSlot: "backgroundVariant",
    textDecorationHandled: true,
  },
  "cta-cta-editorial-split-01": {
    ctaVariantSlot: "ctaStyle",
    ctaColorSchemeSlot: "ctaColorScheme",
    backgroundSlot: "backgroundVariant",
    textDecorationHandled: true,
  },
  "cta-image-backdrop-01": {
    ctaVariantSlot: "ctaStyle",
    ctaColorSchemeSlot: "ctaColorScheme",
    backgroundSlot: "backgroundVariant",
    textDecorationHandled: true,
  },
  "carousel-cards-01": {
    textDecorationHandled: true,
  },
  "contact-contact-locations-map-01": {
    backgroundSlot: "backgroundVariant",
    textDecorationHandled: true,
  },
  "contact-contact-shapes-form-01": {
    ctaVariantSlot: "ctaStyle",
    ctaColorSchemeSlot: "ctaColorScheme",
    backgroundSlot: "backgroundVariant",
    textDecorationHandled: true,
  },
};

export function injectStyleKitIntoSlots(
  componentId: string,
  slots: Record<string, unknown>,
  styleKit: StyleKit | undefined,
): Record<string, unknown> {
  const config = SLOT_PATTERN_MAP[componentId];
  if (!config || !styleKit) return slots;

  // Only set slots that aren't already populated (don't override seller content)
  if (
    config.ctaVariantSlot &&
    styleKit.ctaVariant &&
    slots[config.ctaVariantSlot] === undefined
  ) {
    slots[config.ctaVariantSlot] = styleKit.ctaVariant;
  }
  if (
    config.ctaColorSchemeSlot &&
    styleKit.ctaColorScheme &&
    slots[config.ctaColorSchemeSlot] === undefined
  ) {
    slots[config.ctaColorSchemeSlot] = styleKit.ctaColorScheme;
  }
  if (
    config.backgroundSlot &&
    styleKit.background &&
    slots[config.backgroundSlot] === undefined
  ) {
    slots[config.backgroundSlot] = styleKit.background;
  }
  if (config.textDecorationHandled && styleKit.textDecoration) {
    if (
      styleKit.textDecoration === "highlighter" &&
      typeof slots.headline === "string" &&
      slots.highlightWord === undefined
    ) {
      slots.highlightWord = (slots.headline as string).split(" ")[0];
    }
    if (
      (styleKit.textDecoration === "reveal" ||
        styleKit.textDecoration === "text-reveal") &&
      slots.revealHeadline === undefined
    ) {
      slots.revealHeadline = true;
    }
  }
  return slots;
}
