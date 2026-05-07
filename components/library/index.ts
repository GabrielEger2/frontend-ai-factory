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

// Contact
export { default as ContactBookingEmbed } from "./contact/ContactBookingEmbed";
export { default as ContactChatEmbed } from "./contact/ContactChatEmbed";
export { default as ContactLocationsMap } from "./contact/ContactLocationsMap";
export { default as ContactMultiStep } from "./contact/ContactMultiStep";
export { default as ContactShapesForm } from "./contact/ContactShapesForm";
export { default as ContactSplitForm } from "./contact/ContactSplitForm";
export { default as ContactSupportTabs } from "./contact/ContactSupportTabs";

// Content (includes migrated layout/split + redistributed carousel components)
export { default as CarouselBeforeAfter } from "./content/CarouselBeforeAfter";
export { default as ComparisonSplit } from "./content/ComparisonSplit";
export { default as EditorialFramedSplit } from "./content/EditorialFramedSplit";
export { default as GalleryCaseStudy } from "./content/GalleryCaseStudy";
export { default as GalleryImageTextEditorial } from "./content/GalleryImageTextEditorial";

// CTA
export { default as CtaDualOfferSplit } from "./cta/CtaDualOfferSplit";
export { default as CtaHoverRevealList } from "./cta/CtaHoverRevealList";
export { default as CtaImageBackdrop } from "./cta/CtaImageBackdrop";
export { default as CtaInlineCalculator } from "./cta/CtaInlineCalculator";
export { default as CtaStickyImageList } from "./cta/CtaStickyImageList";
export { default as CtaTestimonialPaired } from "./cta/CtaTestimonialPaired";
export { default as CtaVideoBackdrop } from "./cta/CtaVideoBackdrop";

// FAQ
export { default as FaqCategorized } from "./faq/FaqCategorized";
export { default as FaqSolutions } from "./faq/FaqSolutions";
export { default as FaqTabbed } from "./faq/FaqTabbed";

// Footers
export { default as FooterColumnsSocial } from "./footers/FooterColumnsSocial";
export { default as FooterMega } from "./footers/FooterMega";
export { default as FooterPulse } from "./footers/FooterPulse";
export { default as FooterReveal } from "./footers/FooterReveal";

// Gallery
export { default as CarouselThumbnailNav } from "./gallery/CarouselThumbnailNav";
export { default as GalleryLightboxGrid } from "./gallery/GalleryLightboxGrid";
export { default as GalleryMasonry } from "./gallery/GalleryMasonry";

// Heroes
export { default as CarouselFullBleedSlider } from "./heroes/CarouselFullBleedSlider";
export { default as HeroAsymmetricStack } from "./heroes/HeroAsymmetricStack";
export { default as HeroBakeryEditorial } from "./heroes/HeroBakeryEditorial";
export { default as HeroDeviceChrome } from "./heroes/HeroDeviceChrome";
export { default as HeroGridGallery } from "./heroes/HeroGridGallery";
export { default as HeroNewsroomTicker } from "./heroes/HeroNewsroomTicker";
export { default as HeroPolaroidCollage } from "./heroes/HeroPolaroidCollage";
export { default as HeroSplitForm } from "./heroes/HeroSplitForm";
export { default as HeroSplitImage } from "./heroes/HeroSplitImage";
export { default as HeroVideoBackdrop } from "./heroes/HeroVideoBackdrop";

// Navigation
export { default as NavbarDock } from "./navigation/NavbarDock";
export { default as NavbarMegaPanel } from "./navigation/NavbarMegaPanel";
export { default as NavbarPill } from "./navigation/NavbarPill";
export { default as NavbarSticky } from "./navigation/NavbarSticky";

// Pricing
export { default as PricingFreemiumLadder } from "./pricing/PricingFreemiumLadder";
export { default as PricingMonthlyAnnualToggle } from "./pricing/PricingMonthlyAnnualToggle";
export { default as PricingSinglePrice } from "./pricing/PricingSinglePrice";
export { default as PricingTierCards } from "./pricing/PricingTierCards";

// Products
export { default as ProductsBundleCards } from "./products/ProductsBundleCards";
export { default as ProductsFeaturedStrip } from "./products/ProductsFeaturedStrip";
export { default as ProductsSpotlight } from "./products/ProductsSpotlight";

// Stats
export { default as StatsChart } from "./stats/StatsChart";
export { default as StatsCountUp } from "./stats/StatsCountUp";
export { default as StatsKpiGrid } from "./stats/StatsKpiGrid";

// Team
export { default as TeamFounderSplit } from "./team/TeamFounderSplit";
export { default as TeamLeadershipGrid } from "./team/TeamLeadershipGrid";
export { default as TeamMemberSpotlight } from "./team/TeamMemberSpotlight";

// Testimonials
export { default as InfiniteScroll } from "./testimonials/InfiniteScroll";
export { default as TestimonialMasonryQuotes } from "./testimonials/TestimonialMasonryQuotes";
export { default as TestimonialMetricCard } from "./testimonials/TestimonialMetricCard";
export { default as TestimonialSpotlightQuote } from "./testimonials/TestimonialSpotlightQuote";
export { default as TestimonialVideoCard } from "./testimonials/TestimonialVideoCard";

import ContactBookingEmbed from "./contact/ContactBookingEmbed";
import ContactChatEmbed from "./contact/ContactChatEmbed";
import ContactLocationsMap from "./contact/ContactLocationsMap";
import ContactMultiStep from "./contact/ContactMultiStep";
import ContactShapesForm from "./contact/ContactShapesForm";
import ContactSplitForm from "./contact/ContactSplitForm";
import ContactSupportTabs from "./contact/ContactSupportTabs";
import CarouselBeforeAfter from "./content/CarouselBeforeAfter";
import ComparisonSplit from "./content/ComparisonSplit";
import EditorialFramedSplit from "./content/EditorialFramedSplit";
import GalleryCaseStudy from "./content/GalleryCaseStudy";
import GalleryImageTextEditorial from "./content/GalleryImageTextEditorial";
import CtaDualOfferSplit from "./cta/CtaDualOfferSplit";
import CtaHoverRevealList from "./cta/CtaHoverRevealList";
import CtaImageBackdrop from "./cta/CtaImageBackdrop";
import CtaInlineCalculator from "./cta/CtaInlineCalculator";
import CtaStickyImageList from "./cta/CtaStickyImageList";
import CtaTestimonialPaired from "./cta/CtaTestimonialPaired";
import CtaVideoBackdrop from "./cta/CtaVideoBackdrop";
import FaqCategorized from "./faq/FaqCategorized";
import FaqSolutions from "./faq/FaqSolutions";
import FaqTabbed from "./faq/FaqTabbed";
import FooterColumnsSocial from "./footers/FooterColumnsSocial";
import FooterMega from "./footers/FooterMega";
import FooterPulse from "./footers/FooterPulse";
import FooterReveal from "./footers/FooterReveal";
import CarouselThumbnailNav from "./gallery/CarouselThumbnailNav";
import GalleryLightboxGrid from "./gallery/GalleryLightboxGrid";
import GalleryMasonry from "./gallery/GalleryMasonry";
import CarouselFullBleedSlider from "./heroes/CarouselFullBleedSlider";
import HeroAsymmetricStack from "./heroes/HeroAsymmetricStack";
import HeroBakeryEditorial from "./heroes/HeroBakeryEditorial";
import HeroDeviceChrome from "./heroes/HeroDeviceChrome";
import HeroGridGallery from "./heroes/HeroGridGallery";
import HeroNewsroomTicker from "./heroes/HeroNewsroomTicker";
import HeroPolaroidCollage from "./heroes/HeroPolaroidCollage";
import HeroSplitForm from "./heroes/HeroSplitForm";
import HeroSplitImage from "./heroes/HeroSplitImage";
import HeroVideoBackdrop from "./heroes/HeroVideoBackdrop";
import NavbarDock from "./navigation/NavbarDock";
import NavbarMegaPanel from "./navigation/NavbarMegaPanel";
import NavbarPill from "./navigation/NavbarPill";
import NavbarSticky from "./navigation/NavbarSticky";
import PricingFreemiumLadder from "./pricing/PricingFreemiumLadder";
import PricingMonthlyAnnualToggle from "./pricing/PricingMonthlyAnnualToggle";
import PricingSinglePrice from "./pricing/PricingSinglePrice";
import PricingTierCards from "./pricing/PricingTierCards";
import ProductsBundleCards from "./products/ProductsBundleCards";
import ProductsFeaturedStrip from "./products/ProductsFeaturedStrip";
import ProductsSpotlight from "./products/ProductsSpotlight";
import StatsChart from "./stats/StatsChart";
import StatsCountUp from "./stats/StatsCountUp";
import StatsKpiGrid from "./stats/StatsKpiGrid";
import TeamFounderSplit from "./team/TeamFounderSplit";
import TeamLeadershipGrid from "./team/TeamLeadershipGrid";
import TeamMemberSpotlight from "./team/TeamMemberSpotlight";
import InfiniteScroll from "./testimonials/InfiniteScroll";
import TestimonialMasonryQuotes from "./testimonials/TestimonialMasonryQuotes";
import TestimonialMetricCard from "./testimonials/TestimonialMetricCard";
import TestimonialSpotlightQuote from "./testimonials/TestimonialSpotlightQuote";
import TestimonialVideoCard from "./testimonials/TestimonialVideoCard";

/**
 * Lookup map: metadata.json `id` → React component.
 *
 * Used by BlueprintPreview to render the seller's working draft and by
 * ComponentPicker to resolve alternatives. Keys MUST match metadata.json
 * `id` fields exactly — the Composer Agent emits these IDs in the
 * blueprint and the assembler writes them into generated source.
 */
export const componentsById: Record<string, ComponentType<any>> = {
  "contact-booking-embed-01": ContactBookingEmbed,
  "contact-chat-embed-01": ContactChatEmbed,
  "contact-locations-map-01": ContactLocationsMap,
  "contact-multi-step-01": ContactMultiStep,
  "contact-shapes-form-01": ContactShapesForm,
  "contact-split-form-01": ContactSplitForm,
  "contact-support-tabs-01": ContactSupportTabs,
  "carousel-before-after-01": CarouselBeforeAfter,
  "layout-comparisonsplit-01": ComparisonSplit,
  "layout-editorial-framed-split-01": EditorialFramedSplit,
  "gallery-case-study-01": GalleryCaseStudy,
  "gallery-image-text-editorial-01": GalleryImageTextEditorial,
  "cta-dual-offer-split-01": CtaDualOfferSplit,
  "cta-hover-reveal-list-01": CtaHoverRevealList,
  "cta-image-backdrop-01": CtaImageBackdrop,
  "cta-inline-calculator-01": CtaInlineCalculator,
  "cta-sticky-image-list-01": CtaStickyImageList,
  "cta-testimonial-paired-01": CtaTestimonialPaired,
  "cta-video-backdrop-01": CtaVideoBackdrop,
  "faq-categorized-01": FaqCategorized,
  "faq-solutions-01": FaqSolutions,
  "faq-tabbed-01": FaqTabbed,
  "footer-columns-social-01": FooterColumnsSocial,
  "footer-mega-01": FooterMega,
  "footer-pulse-01": FooterPulse,
  "footer-reveal-01": FooterReveal,
  "carousel-thumbnail-nav-01": CarouselThumbnailNav,
  "gallery-lightbox-grid-01": GalleryLightboxGrid,
  "gallery-masonry-01": GalleryMasonry,
  "carousel-full-bleed-slider-01": CarouselFullBleedSlider,
  "hero-asymmetric-stack-01": HeroAsymmetricStack,
  "hero-bakery-editorial-01": HeroBakeryEditorial,
  "hero-device-chrome-01": HeroDeviceChrome,
  "hero-grid-gallery-01": HeroGridGallery,
  "hero-newsroom-ticker-01": HeroNewsroomTicker,
  "hero-polaroid-collage-01": HeroPolaroidCollage,
  "hero-split-form-01": HeroSplitForm,
  "hero-split-image-01": HeroSplitImage,
  "hero-video-backdrop-01": HeroVideoBackdrop,
  "navbar-dock-01": NavbarDock,
  "navbar-mega-panel-01": NavbarMegaPanel,
  "navbar-pill-01": NavbarPill,
  "navbar-sticky-01": NavbarSticky,
  "pricing-freemium-ladder-01": PricingFreemiumLadder,
  "pricing-monthly-annual-toggle-01": PricingMonthlyAnnualToggle,
  "pricing-single-price-01": PricingSinglePrice,
  "pricing-tier-cards-01": PricingTierCards,
  "products-bundle-cards-01": ProductsBundleCards,
  "products-featured-strip-01": ProductsFeaturedStrip,
  "products-spotlight-01": ProductsSpotlight,
  "stats-chart-01": StatsChart,
  "stats-count-up-01": StatsCountUp,
  "stats-kpi-grid-01": StatsKpiGrid,
  "team-founder-split-01": TeamFounderSplit,
  "team-leadership-grid-01": TeamLeadershipGrid,
  "team-member-spotlight-01": TeamMemberSpotlight,
  "testimonial-infinitescroll-01": InfiniteScroll,
  "testimonial-masonry-quotes-01": TestimonialMasonryQuotes,
  "testimonial-metric-card-01": TestimonialMetricCard,
  "testimonial-spotlight-quote-01": TestimonialSpotlightQuote,
  "testimonial-video-card-01": TestimonialVideoCard,
};
