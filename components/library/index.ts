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
export { default as ContactLocationsMap } from "./contact/ContactLocationsMap";
export { default as ContactShapesForm } from "./contact/ContactShapesForm";

// CTA
export { default as CtaCollageDuo } from "./cta/CtaCollageDuo";
export { default as CtaEditorialSplit } from "./cta/CtaEditorialSplit";
export { default as CtaImageBackdrop } from "./cta/CtaImageBackdrop";
export { default as CtaMinimalStrip } from "./cta/CtaMinimalStrip";
export { default as NewsletterCapture } from "./cta/NewsletterCapture";

// FAQ
export { default as FaqAccordion } from "./faq/FaqAccordion";
export { default as FaqMinimal } from "./faq/FaqMinimal";
export { default as FaqSolutions } from "./faq/FaqSolutions";

// Footers
export { default as FooterPulse } from "./footers/FooterPulse";
export { default as FooterReveal } from "./footers/FooterReveal";

// Heroes
export { default as HeroBoldEditorial } from "./heroes/HeroBoldEditorial";
export { default as HeroGeometric } from "./heroes/HeroGeometric";
export { default as HeroParallaxImages } from "./heroes/HeroParallaxImages";
export { default as HeroShuffleCards } from "./heroes/HeroShuffleCards";
export { default as HeroSplitImage } from "./heroes/HeroSplitImage";

// Layouts — grid
export { default as CardGrid } from "./layouts/grid/CardGrid";
export { default as IconFeatureGrid } from "./layouts/grid/IconFeatureGrid";
export { default as LogoCloud } from "./layouts/grid/LogoCloud";
export { default as PricingTiers } from "./layouts/grid/PricingTiers";
export { default as ProcessTimeline } from "./layouts/grid/ProcessTimeline";
export { default as SimpleGrid } from "./layouts/grid/SimpleGrid";

// Layouts — split
export { default as AuthorSplit } from "./layouts/split/AuthorSplit";
export { default as EditorialFramedSplit } from "./layouts/split/EditorialFramedSplit";
export { default as IconListSplit } from "./layouts/split/IconListSplit";
export { default as ImageText } from "./layouts/split/ImageText";
export { default as StatementSplit } from "./layouts/split/StatementSplit";

// Motion
export { default as ParallaxContent } from "./motion/ParallaxContent";
export { default as StickyCards } from "./motion/StickyCards";

// Testimonials
export { default as InfiniteScroll } from "./testimonials/InfiniteScroll";
export { default as StackedSplit } from "./testimonials/StackedSplit";
export { default as StaggerFan } from "./testimonials/StaggerFan";

// Navigation
export { default as NavbarDock } from "./navigation/NavbarDock";
export { default as NavbarMegaPanel } from "./navigation/NavbarMegaPanel";
export { default as NavbarSticky } from "./navigation/NavbarSticky";

// Stats
export { default as StatsCountUp } from "./stats/StatsCountUp";
export { default as StatsKpiGrid } from "./stats/StatsKpiGrid";
export { default as StatsMilestoneBar } from "./stats/StatsMilestoneBar";

// Re-import defaults into a local namespace for the id→component map.
// (Named exports above are what consumers import; this map is for
// dynamic lookup by blueprint IDs — used by BlueprintPreview.)
import CarouselCards from "./carousel/CarouselCards";
import CarouselHorizontalScroll from "./carousel/CarouselHorizontalScroll";
import CarouselSwipe from "./carousel/CarouselSwipe";
import ContactLocationsMap from "./contact/ContactLocationsMap";
import ContactShapesForm from "./contact/ContactShapesForm";
import CtaCollageDuo from "./cta/CtaCollageDuo";
import CtaEditorialSplit from "./cta/CtaEditorialSplit";
import CtaImageBackdrop from "./cta/CtaImageBackdrop";
import CtaMinimalStrip from "./cta/CtaMinimalStrip";
import NewsletterCapture from "./cta/NewsletterCapture";
import FaqAccordion from "./faq/FaqAccordion";
import FaqMinimal from "./faq/FaqMinimal";
import FaqSolutions from "./faq/FaqSolutions";
import FooterPulse from "./footers/FooterPulse";
import FooterReveal from "./footers/FooterReveal";
import HeroBoldEditorial from "./heroes/HeroBoldEditorial";
import HeroGeometric from "./heroes/HeroGeometric";
import HeroParallaxImages from "./heroes/HeroParallaxImages";
import HeroShuffleCards from "./heroes/HeroShuffleCards";
import HeroSplitImage from "./heroes/HeroSplitImage";
import CardGrid from "./layouts/grid/CardGrid";
import IconFeatureGrid from "./layouts/grid/IconFeatureGrid";
import LogoCloud from "./layouts/grid/LogoCloud";
import PricingTiers from "./layouts/grid/PricingTiers";
import ProcessTimeline from "./layouts/grid/ProcessTimeline";
import SimpleGrid from "./layouts/grid/SimpleGrid";
import AuthorSplit from "./layouts/split/AuthorSplit";
import EditorialFramedSplit from "./layouts/split/EditorialFramedSplit";
import IconListSplit from "./layouts/split/IconListSplit";
import ImageText from "./layouts/split/ImageText";
import StatementSplit from "./layouts/split/StatementSplit";
import ParallaxContent from "./motion/ParallaxContent";
import StickyCards from "./motion/StickyCards";
import InfiniteScroll from "./testimonials/InfiniteScroll";
import StackedSplit from "./testimonials/StackedSplit";
import StaggerFan from "./testimonials/StaggerFan";
import NavbarDock from "./navigation/NavbarDock";
import NavbarMegaPanel from "./navigation/NavbarMegaPanel";
import NavbarSticky from "./navigation/NavbarSticky";
import StatsCountUp from "./stats/StatsCountUp";
import StatsKpiGrid from "./stats/StatsKpiGrid";
import StatsMilestoneBar from "./stats/StatsMilestoneBar";

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
  "contact-contact-locations-map-01": ContactLocationsMap,
  "contact-contact-shapes-form-01": ContactShapesForm,
  "cta-cta-collage-duo-01": CtaCollageDuo,
  "cta-cta-editorial-split-01": CtaEditorialSplit,
  "cta-image-backdrop-01": CtaImageBackdrop,
  "cta-minimal-strip-01": CtaMinimalStrip,
  "cta-newsletter-capture-01": NewsletterCapture,
  "faq-accordion-01": FaqAccordion,
  "faq-minimal-01": FaqMinimal,
  "faq-solutions-01": FaqSolutions,
  "footer-pulse-01": FooterPulse,
  "footer-reveal-01": FooterReveal,
  "hero-hero-bold-editorial-01": HeroBoldEditorial,
  "hero-geometric-01": HeroGeometric,
  "hero-parallax-images-01": HeroParallaxImages,
  "hero-shuffle-cards-01": HeroShuffleCards,
  "hero-split-image-01": HeroSplitImage,
  "layout-cardgrid-01": CardGrid,
  "layout-icon-feature-grid-01": IconFeatureGrid,
  "layout-logo-cloud-01": LogoCloud,
  "layout-pricing-tiers-01": PricingTiers,
  "layout-process-timeline-01": ProcessTimeline,
  "layout-simplegrid-01": SimpleGrid,
  "layout-staggerfan-01": StaggerFan,
  "layout-infinitescroll-01": InfiniteScroll,
  "layout-parallaxcontent-01": ParallaxContent,
  "layout-stickycards-01": StickyCards,
  "layout-authorsplit-01": AuthorSplit,
  "layout-editorial-framed-split-01": EditorialFramedSplit,
  "layout-iconlistsplit-01": IconListSplit,
  "layout-imagetext-01": ImageText,
  "layout-stackedsplit-01": StackedSplit,
  "layout-statementsplit-01": StatementSplit,
  "navbar-dock-01": NavbarDock,
  "navbar-mega-panel-01": NavbarMegaPanel,
  "navbar-sticky-01": NavbarSticky,
  "stats-count-up-01": StatsCountUp,
  "stats-kpi-grid-01": StatsKpiGrid,
  "stats-milestone-bar-01": StatsMilestoneBar,
};
