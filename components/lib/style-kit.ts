import type { CtaVariant, ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Card style                                                         */
/* ------------------------------------------------------------------ */

export type CardStyle =
  | "base"
  | "flip"
  | "reveal"
  | "magic-gradient"
  | "magic-orb"
  | "product"
  | "outline";

/* ------------------------------------------------------------------ */
/*  Background variant                                                 */
/* ------------------------------------------------------------------ */

export type BackgroundVariant =
  | "animated-svg"
  | "retro-grid"
  | "dot-pattern"
  | "striped"
  | "gradient-bars"
  | "interactive-grid"
  | "none";

/* ------------------------------------------------------------------ */
/*  Text decoration variant                                            */
/* ------------------------------------------------------------------ */

export type TextDecorationVariant =
  | "typewriter"
  | "highlighter"
  | "line-shadow"
  | "reveal"
  | "text-reveal"
  | "none";

/* ------------------------------------------------------------------ */
/*  StyleKit — site-wide visual configuration threaded by the Assembler */
/* ------------------------------------------------------------------ */

export interface StyleKit {
  card?: CardStyle;
  ctaVariant?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  background?: BackgroundVariant;
  textDecoration?: TextDecorationVariant;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

export const DEFAULT_STYLE_KIT: StyleKit = {
  card: "base",
  ctaVariant: "default",
  ctaColorScheme: "primary",
  background: "none",
  textDecoration: "none",
};
