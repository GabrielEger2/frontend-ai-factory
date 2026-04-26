// Barrel exports for the SiteGen component library.
//
// Every component in components/library/<category>/<ComponentName>/ is
// re-exported by its directory name (PascalCase). The componentsById map
// keys each component by its metadata.json `id` field — used by the
// dashboard's live preview and by the Composer Agent's blueprint output.
//
// Keep componentsById in sync with metadata.json `id` fields. If you add
// or rename a component, update both the named export and the map.

import type { ComponentType } from "react";

// Carousel
export { default as CarouselCards } from "./carousel/CarouselCards";
export { default as CarouselHorizontalScroll } from "./carousel/CarouselHorizontalScroll";
export { default as CarouselSwipe } from "./carousel/CarouselSwipe";

// Contact
export { default as ContactForm } from "./contact/ContactForm";
export { default as ContactMapInfo } from "./contact/ContactMapInfo";

// CTA
export { default as CtaBanner } from "./cta/CtaBanner";
export { default as CtaFloating } from "./cta/CtaFloating";
export { default as CtaInline } from "./cta/CtaInline";

// FAQ
export { default as FaqAccordion } from "./faq/FaqAccordion";
export { default as FaqMinimal } from "./faq/FaqMinimal";
export { default as FaqSolutions } from "./faq/FaqSolutions";

// Footers
export { default as FooterReveal } from "./footers/FooterReveal";

// Heroes
export { default as HeroGeometric } from "./heroes/HeroGeometric";
export { default as HeroParallaxImages } from "./heroes/HeroParallaxImages";
export { default as HeroShuffleCards } from "./heroes/HeroShuffleCards";
export { default as HeroSplitImage } from "./heroes/HeroSplitImage";

// Layouts — grid
export { default as CardGrid } from "./layouts/grid/CardGrid";
export { default as SimpleGrid } from "./layouts/grid/SimpleGrid";
export { default as StaggerFan } from "./layouts/grid/StaggerFan";

// Layouts — scroll
export { default as InfiniteScroll } from "./layouts/scroll/InfiniteScroll";
export { default as ParallaxContent } from "./layouts/scroll/ParallaxContent";
export { default as StickyCards } from "./layouts/scroll/StickyCards";

// Layouts — split
export { default as AuthorSplit } from "./layouts/split/AuthorSplit";
export { default as IconListSplit } from "./layouts/split/IconListSplit";
export { default as ImageText } from "./layouts/split/ImageText";
export { default as ShowcaseSplit } from "./layouts/split/ShowcaseSplit";
export { default as StackedSplit } from "./layouts/split/StackedSplit";
export { default as StatementSplit } from "./layouts/split/StatementSplit";

// Navigation
export { default as NavbarSticky } from "./navigation/NavbarSticky";

// Stats
export { default as StatsCountUp } from "./stats/StatsCountUp";

// Re-import defaults into a local namespace for the id→component map.
// (Named exports above are what consumers import; this map is for
// dynamic lookup by blueprint IDs — used by BlueprintPreview.)
import CarouselCards from "./carousel/CarouselCards";
import CarouselHorizontalScroll from "./carousel/CarouselHorizontalScroll";
import CarouselSwipe from "./carousel/CarouselSwipe";
import ContactForm from "./contact/ContactForm";
import ContactMapInfo from "./contact/ContactMapInfo";
import CtaBanner from "./cta/CtaBanner";
import CtaFloating from "./cta/CtaFloating";
import CtaInline from "./cta/CtaInline";
import FaqAccordion from "./faq/FaqAccordion";
import FaqMinimal from "./faq/FaqMinimal";
import FaqSolutions from "./faq/FaqSolutions";
import FooterReveal from "./footers/FooterReveal";
import HeroGeometric from "./heroes/HeroGeometric";
import HeroParallaxImages from "./heroes/HeroParallaxImages";
import HeroShuffleCards from "./heroes/HeroShuffleCards";
import HeroSplitImage from "./heroes/HeroSplitImage";
import CardGrid from "./layouts/grid/CardGrid";
import SimpleGrid from "./layouts/grid/SimpleGrid";
import StaggerFan from "./layouts/grid/StaggerFan";
import InfiniteScroll from "./layouts/scroll/InfiniteScroll";
import ParallaxContent from "./layouts/scroll/ParallaxContent";
import StickyCards from "./layouts/scroll/StickyCards";
import AuthorSplit from "./layouts/split/AuthorSplit";
import IconListSplit from "./layouts/split/IconListSplit";
import ImageText from "./layouts/split/ImageText";
import ShowcaseSplit from "./layouts/split/ShowcaseSplit";
import StackedSplit from "./layouts/split/StackedSplit";
import StatementSplit from "./layouts/split/StatementSplit";
import NavbarSticky from "./navigation/NavbarSticky";
import StatsCountUp from "./stats/StatsCountUp";

/**
 * Lookup map: metadata.json `id` → React component.
 *
 * Used by BlueprintPreview to render the seller's working draft and by
 * ComponentPicker to resolve alternatives. Keys MUST match metadata.json
 * `id` fields exactly — the Composer Agent emits these IDs in the
 * blueprint and the assembler writes them into generated source.
 */
export const componentsById: Record<string, ComponentType<any>> = {
  "carousel-cards-01": CarouselCards,
  "carousel-horizontal-scroll-01": CarouselHorizontalScroll,
  "carousel-swipe-01": CarouselSwipe,
  "contact-form-01": ContactForm,
  "contact-map-info-01": ContactMapInfo,
  "cta-banner-01": CtaBanner,
  "cta-floating-01": CtaFloating,
  "cta-inline-01": CtaInline,
  "faq-accordion-01": FaqAccordion,
  "faq-minimal-01": FaqMinimal,
  "faq-solutions-01": FaqSolutions,
  "footer-reveal-01": FooterReveal,
  "hero-geometric-01": HeroGeometric,
  "hero-parallax-images-01": HeroParallaxImages,
  "hero-shuffle-cards-01": HeroShuffleCards,
  "hero-split-image-01": HeroSplitImage,
  "layout-cardgrid-01": CardGrid,
  "layout-simplegrid-01": SimpleGrid,
  "layout-staggerfan-01": StaggerFan,
  "layout-infinitescroll-01": InfiniteScroll,
  "layout-parallaxcontent-01": ParallaxContent,
  "layout-stickycards-01": StickyCards,
  "layout-authorsplit-01": AuthorSplit,
  "layout-iconlistsplit-01": IconListSplit,
  "layout-imagetext-01": ImageText,
  "layout-showcasesplit-01": ShowcaseSplit,
  "layout-stackedsplit-01": StackedSplit,
  "layout-statementsplit-01": StatementSplit,
  "navbar-sticky-01": NavbarSticky,
  "stats-count-up-01": StatsCountUp,
};
