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
export { default as CarouselBeforeAfter } from "./carousel/CarouselBeforeAfter";
export { default as CarouselCards } from "./carousel/CarouselCards";
export { default as CarouselHorizontalScroll } from "./carousel/CarouselHorizontalScroll";
export { default as CarouselSwipe } from "./carousel/CarouselSwipe";
export { default as CarouselTestimonialAvatarPeek } from "./carousel/CarouselTestimonialAvatarPeek";

// Contact
export { default as ContactBookingEmbed } from "./contact/ContactBookingEmbed";
export { default as ContactLocationsMap } from "./contact/ContactLocationsMap";
export { default as ContactShapesForm } from "./contact/ContactShapesForm";
export { default as ContactSplitForm } from "./contact/ContactSplitForm";
export { default as ContactSupportTabs } from "./contact/ContactSupportTabs";

// CTA
export { default as CtaCollageDuo } from "./cta/CtaCollageDuo";
export { default as CtaCountdown } from "./cta/CtaCountdown";
export { default as CtaDualOfferSplit } from "./cta/CtaDualOfferSplit";
export { default as CtaEditorialSplit } from "./cta/CtaEditorialSplit";
export { default as CtaImageBackdrop } from "./cta/CtaImageBackdrop";
export { default as CtaMinimalStrip } from "./cta/CtaMinimalStrip";
export { default as CtaStickyBanner } from "./cta/CtaStickyBanner";
export { default as NewsletterCapture } from "./cta/NewsletterCapture";

// FAQ
export { default as FaqAccordion } from "./faq/FaqAccordion";
export { default as FaqMinimal } from "./faq/FaqMinimal";
export { default as FaqSolutions } from "./faq/FaqSolutions";
export { default as FaqTabbed } from "./faq/FaqTabbed";

// Footers
export { default as FooterMega } from "./footers/FooterMega";
export { default as FooterPulse } from "./footers/FooterPulse";
export { default as FooterReveal } from "./footers/FooterReveal";

// Heroes
export { default as HeroAsymmetricStack } from "./heroes/HeroAsymmetricStack";
export { default as HeroBoldEditorial } from "./heroes/HeroBoldEditorial";
export { default as HeroGeometric } from "./heroes/HeroGeometric";
export { default as HeroGridGallery } from "./heroes/HeroGridGallery";
export { default as HeroMarqueeStrip } from "./heroes/HeroMarqueeStrip";
export { default as HeroNewsroomTicker } from "./heroes/HeroNewsroomTicker";
export { default as HeroParallaxImages } from "./heroes/HeroParallaxImages";
export { default as HeroPolaroidCollage } from "./heroes/HeroPolaroidCollage";
export { default as HeroShuffleCards } from "./heroes/HeroShuffleCards";
export { default as HeroSpotlightCenter } from "./heroes/HeroSpotlightCenter";
export { default as HeroSplitForm } from "./heroes/HeroSplitForm";
export { default as HeroSplitImage } from "./heroes/HeroSplitImage";
export { default as HeroTerminalConsole } from "./heroes/HeroTerminalConsole";
export { default as HeroVideoBackdrop } from "./heroes/HeroVideoBackdrop";

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

// Pricing
export { default as PricingComparisonTable } from "./pricing/PricingComparisonTable";
export { default as PricingFreemiumLadder } from "./pricing/PricingFreemiumLadder";
export { default as PricingMonthlyAnnualToggle } from "./pricing/PricingMonthlyAnnualToggle";
export { default as PricingSinglePrice } from "./pricing/PricingSinglePrice";
export { default as PricingTierCards } from "./pricing/PricingTierCards";

// Gallery
export { default as GalleryCaseStudy } from "./gallery/GalleryCaseStudy";
export { default as GalleryImageTextEditorial } from "./gallery/GalleryImageTextEditorial";
export { default as GalleryLightboxGrid } from "./gallery/GalleryLightboxGrid";
export { default as GalleryMasonry } from "./gallery/GalleryMasonry";
export { default as GalleryPortfolioStrip } from "./gallery/GalleryPortfolioStrip";

// Motion
export { default as MotionMarquee } from "./motion/MotionMarquee";
export { default as MotionScrollNarrative } from "./motion/MotionScrollNarrative";
export { default as ParallaxContent } from "./motion/ParallaxContent";
export { default as StickyCards } from "./motion/StickyCards";

// Testimonials
export { default as InfiniteScroll } from "./testimonials/InfiniteScroll";
export { default as StackedSplit } from "./testimonials/StackedSplit";
export { default as StaggerFan } from "./testimonials/StaggerFan";
export { default as TestimonialLogoQuoteRibbon } from "./testimonials/TestimonialLogoQuoteRibbon";
export { default as TestimonialSpotlightQuote } from "./testimonials/TestimonialSpotlightQuote";
export { default as TestimonialVideoCard } from "./testimonials/TestimonialVideoCard";

// Navigation
export { default as NavbarDock } from "./navigation/NavbarDock";
export { default as NavbarMegaPanel } from "./navigation/NavbarMegaPanel";
export { default as NavbarSticky } from "./navigation/NavbarSticky";

// Stats
export { default as StatsChart } from "./stats/StatsChart";
export { default as StatsCountUp } from "./stats/StatsCountUp";
export { default as StatsKpiGrid } from "./stats/StatsKpiGrid";
export { default as StatsMilestoneBar } from "./stats/StatsMilestoneBar";

// Re-import defaults into a local namespace for the id→component map.
// (Named exports above are what consumers import; this map is for
// dynamic lookup by blueprint IDs — used by BlueprintPreview.)
import CarouselBeforeAfter from "./carousel/CarouselBeforeAfter";
import CarouselCards from "./carousel/CarouselCards";
import CarouselHorizontalScroll from "./carousel/CarouselHorizontalScroll";
import CarouselSwipe from "./carousel/CarouselSwipe";
import CarouselTestimonialAvatarPeek from "./carousel/CarouselTestimonialAvatarPeek";
import ContactBookingEmbed from "./contact/ContactBookingEmbed";
import ContactLocationsMap from "./contact/ContactLocationsMap";
import ContactShapesForm from "./contact/ContactShapesForm";
import ContactSplitForm from "./contact/ContactSplitForm";
import ContactSupportTabs from "./contact/ContactSupportTabs";
import CtaCollageDuo from "./cta/CtaCollageDuo";
import CtaCountdown from "./cta/CtaCountdown";
import CtaDualOfferSplit from "./cta/CtaDualOfferSplit";
import CtaEditorialSplit from "./cta/CtaEditorialSplit";
import CtaImageBackdrop from "./cta/CtaImageBackdrop";
import CtaMinimalStrip from "./cta/CtaMinimalStrip";
import CtaStickyBanner from "./cta/CtaStickyBanner";
import NewsletterCapture from "./cta/NewsletterCapture";
import FaqAccordion from "./faq/FaqAccordion";
import FaqMinimal from "./faq/FaqMinimal";
import FaqSolutions from "./faq/FaqSolutions";
import FaqTabbed from "./faq/FaqTabbed";
import FooterMega from "./footers/FooterMega";
import FooterPulse from "./footers/FooterPulse";
import FooterReveal from "./footers/FooterReveal";
import HeroAsymmetricStack from "./heroes/HeroAsymmetricStack";
import HeroBoldEditorial from "./heroes/HeroBoldEditorial";
import HeroGeometric from "./heroes/HeroGeometric";
import HeroGridGallery from "./heroes/HeroGridGallery";
import HeroMarqueeStrip from "./heroes/HeroMarqueeStrip";
import HeroNewsroomTicker from "./heroes/HeroNewsroomTicker";
import HeroParallaxImages from "./heroes/HeroParallaxImages";
import HeroPolaroidCollage from "./heroes/HeroPolaroidCollage";
import HeroShuffleCards from "./heroes/HeroShuffleCards";
import HeroSpotlightCenter from "./heroes/HeroSpotlightCenter";
import HeroSplitForm from "./heroes/HeroSplitForm";
import HeroSplitImage from "./heroes/HeroSplitImage";
import HeroTerminalConsole from "./heroes/HeroTerminalConsole";
import HeroVideoBackdrop from "./heroes/HeroVideoBackdrop";
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
import PricingComparisonTable from "./pricing/PricingComparisonTable";
import PricingFreemiumLadder from "./pricing/PricingFreemiumLadder";
import PricingMonthlyAnnualToggle from "./pricing/PricingMonthlyAnnualToggle";
import PricingSinglePrice from "./pricing/PricingSinglePrice";
import PricingTierCards from "./pricing/PricingTierCards";
import GalleryCaseStudy from "./gallery/GalleryCaseStudy";
import GalleryImageTextEditorial from "./gallery/GalleryImageTextEditorial";
import GalleryLightboxGrid from "./gallery/GalleryLightboxGrid";
import GalleryMasonry from "./gallery/GalleryMasonry";
import GalleryPortfolioStrip from "./gallery/GalleryPortfolioStrip";
import MotionMarquee from "./motion/MotionMarquee";
import MotionScrollNarrative from "./motion/MotionScrollNarrative";
import ParallaxContent from "./motion/ParallaxContent";
import StickyCards from "./motion/StickyCards";
import InfiniteScroll from "./testimonials/InfiniteScroll";
import StackedSplit from "./testimonials/StackedSplit";
import StaggerFan from "./testimonials/StaggerFan";
import TestimonialLogoQuoteRibbon from "./testimonials/TestimonialLogoQuoteRibbon";
import TestimonialSpotlightQuote from "./testimonials/TestimonialSpotlightQuote";
import TestimonialVideoCard from "./testimonials/TestimonialVideoCard";
import NavbarDock from "./navigation/NavbarDock";
import NavbarMegaPanel from "./navigation/NavbarMegaPanel";
import NavbarSticky from "./navigation/NavbarSticky";
import StatsChart from "./stats/StatsChart";
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
  "carousel-before-after-01": CarouselBeforeAfter,
  "carousel-cards-01": CarouselCards,
  "carousel-horizontal-scroll-01": CarouselHorizontalScroll,
  "carousel-swipe-01": CarouselSwipe,
  "carousel-testimonial-avatar-peek-01": CarouselTestimonialAvatarPeek,
  "contact-booking-embed-01": ContactBookingEmbed,
  "contact-contact-locations-map-01": ContactLocationsMap,
  "contact-contact-shapes-form-01": ContactShapesForm,
  "contact-split-form-01": ContactSplitForm,
  "contact-support-tabs-01": ContactSupportTabs,
  "cta-countdown-01": CtaCountdown,
  "cta-cta-collage-duo-01": CtaCollageDuo,
  "cta-cta-editorial-split-01": CtaEditorialSplit,
  "cta-dual-offer-split-01": CtaDualOfferSplit,
  "cta-image-backdrop-01": CtaImageBackdrop,
  "cta-minimal-strip-01": CtaMinimalStrip,
  "cta-newsletter-capture-01": NewsletterCapture,
  "cta-sticky-banner-01": CtaStickyBanner,
  "faq-accordion-01": FaqAccordion,
  "faq-minimal-01": FaqMinimal,
  "faq-solutions-01": FaqSolutions,
  "faq-tabbed-01": FaqTabbed,
  "footer-mega-01": FooterMega,
  "footer-pulse-01": FooterPulse,
  "footer-reveal-01": FooterReveal,
  "hero-hero-bold-editorial-01": HeroBoldEditorial,
  "hero-geometric-01": HeroGeometric,
  "hero-parallax-images-01": HeroParallaxImages,
  "hero-shuffle-cards-01": HeroShuffleCards,
  "hero-split-image-01": HeroSplitImage,
  "hero-asymmetric-stack-01": HeroAsymmetricStack,
  "hero-grid-gallery-01": HeroGridGallery,
  "hero-marquee-strip-01": HeroMarqueeStrip,
  "hero-newsroom-ticker-01": HeroNewsroomTicker,
  "hero-polaroid-collage-01": HeroPolaroidCollage,
  "hero-spotlight-center-01": HeroSpotlightCenter,
  "hero-split-form-01": HeroSplitForm,
  "hero-terminal-console-01": HeroTerminalConsole,
  "hero-video-backdrop-01": HeroVideoBackdrop,
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
  "motion-marquee-01": MotionMarquee,
  "pricing-comparison-table-01": PricingComparisonTable,
  "pricing-freemium-ladder-01": PricingFreemiumLadder,
  "pricing-monthly-annual-toggle-01": PricingMonthlyAnnualToggle,
  "pricing-single-price-01": PricingSinglePrice,
  "pricing-tier-cards-01": PricingTierCards,
  "gallery-case-study-01": GalleryCaseStudy,
  "gallery-image-text-editorial-01": GalleryImageTextEditorial,
  "gallery-lightbox-grid-01": GalleryLightboxGrid,
  "gallery-masonry-01": GalleryMasonry,
  "gallery-portfolio-strip-01": GalleryPortfolioStrip,
  "motion-scroll-narrative-01": MotionScrollNarrative,
  "navbar-dock-01": NavbarDock,
  "navbar-mega-panel-01": NavbarMegaPanel,
  "navbar-sticky-01": NavbarSticky,
  "stats-chart-01": StatsChart,
  "stats-count-up-01": StatsCountUp,
  "stats-kpi-grid-01": StatsKpiGrid,
  "stats-milestone-bar-01": StatsMilestoneBar,
  "testimonial-logo-quote-ribbon-01": TestimonialLogoQuoteRibbon,
  "testimonial-spotlight-quote-01": TestimonialSpotlightQuote,
  "testimonial-video-card-01": TestimonialVideoCard,
};
