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
  /** Slot name for reveal decoration. Defaults to "revealHeadline". */
  revealSlotName?: string;
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
  "cta-collage-duo-01": {
    ctaVariantSlot: "ctaStyle",
    ctaColorSchemeSlot: "ctaColorScheme",
    backgroundSlot: "backgroundVariant",
    textDecorationHandled: true,
  },
  "cta-editorial-split-01": {
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
    revealSlotName: "revealDisplayWord",
  },
  "contact-locations-map-01": {
    backgroundSlot: "backgroundVariant",
    textDecorationHandled: true,
  },
  "contact-shapes-form-01": {
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
    const revealSlot = config.revealSlotName ?? "revealHeadline";

    // highlightWord is emitted by the Content Agent — no fallback.
    // Absent slot → undefined prop → no Highlighter (clean skip).

    if (
      styleKit.textDecoration === "reveal" &&
      slots[revealSlot] === undefined
    ) {
      slots[revealSlot] = true;
    }

    // CtaImageBackdrop's revealDisplayWord defaults to true in the component.
    // Explicitly disable when textDecoration is "none".
    if (
      styleKit.textDecoration === "none" &&
      revealSlot === "revealDisplayWord"
    ) {
      slots[revealSlot] = false;
    }
  }
  return slots;
}
