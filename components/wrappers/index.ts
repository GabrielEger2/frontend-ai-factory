/**
 * Hand-authored page-template wrappers — NOT Composer-pickable.
 *
 * Components in this directory accept React.ReactNode for their nested
 * content slots, which violates the Composer primitive-receiving rule
 * (slot props must round-trip through JSON). They live outside
 * components/library/ so the metadata validator, manifest builder, and
 * Composer Agent never see them. Use them only when hand-composing a
 * Next.js page.
 */

export { default as ParallaxContent } from "./ParallaxContent";
export { default as StickyCards } from "./StickyCards";

export type { ParallaxContentProps, ParallaxSection } from "./ParallaxContent";
export type { StickyCardsProps, StickyCard } from "./StickyCards";
