import type { Meta, StoryObj } from "@storybook/react";
import HeroSplitImage from "./index";

const meta: Meta<typeof HeroSplitImage> = {
  title: "Hero/HeroSplitImage",
  component: HeroSplitImage,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    ctaStyle: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    secondaryCtaStyle: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    secondaryCtaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    gridBackground: {
      control: "boolean",
    },
  },
};
export default meta;
type Story = StoryObj<typeof HeroSplitImage>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Frozen food distributor — featured products, rotating badge, WhatsApp, headline accent */
export const FrozenFoodDistributor: Story = {
  args: {
    headline: "Frozen food distributor in",
    headlineAccent: "Florianopolis",
    subheadline:
      "Over 300 options for businesses and consumers. Quality and convenience delivered straight to you.",
    ctaText: "Browse catalog",
    ctaUrl: "/catalog",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    whatsappUrl:
      "https://wa.me/5548999203565?text=Hi%2C%20I'm%20interested%20in%20your%20products!",
    whatsappLabel: "Chat on WhatsApp",
    image: "https://placehold.co/800x800",
    imageAlt:
      "Artisanal frozen snacks and foods arranged on a rustic wooden table",
    rotatingBadgeText: "Fast Delivery \u2022 Florianopolis & Region \u2022 ",
    featuredItems: [
      {
        image: "https://placehold.co/128x96",
        imageAlt: "Frozen cheese bread",
        title: "Cheese Bread",
        price: "$5.00",
        discountPrice: "$3.99",
      },
      {
        image: "https://placehold.co/128x96",
        imageAlt: "Sausage roll",
        title: "Sausage Roll",
        price: "$3.00",
        discountPrice: "$2.40",
      },
      {
        image: "https://placehold.co/128x96",
        imageAlt: "Frozen mini pizza",
        title: "Mini Pizza",
        price: "$6.40",
        discountPrice: "$5.60",
      },
      {
        image: "https://placehold.co/128x96",
        imageAlt: "Assorted frozen pastries",
        title: "Pastries",
        price: "$4.40",
        discountPrice: "$3.60",
      },
    ],
    featuredItemsLabel: "Featured Products",
    featuredItemsLinkText: "View All",
    featuredItemsLinkUrl: "/products",
    gridBackground: true,
  },
};

/** Architecture studio — minimal, no typewriter, glow CTA, floating badge */
export const ArchitectureStudio: Story = {
  args: {
    headline: "Designs that transform spaces into experiences",
    subheadline:
      "Residential and commercial architecture firm with 15 years of national recognition. From concept to delivery, every detail matters.",
    ctaText: "Our portfolio",
    ctaUrl: "/portfolio",
    ctaStyle: "glow",
    ctaColorScheme: "accent",
    secondaryCtaText: "Schedule a visit",
    secondaryCtaUrl: "/schedule",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "accent",
    image: "https://placehold.co/800x800",
    imageAlt:
      "Minimalist interior with exposed concrete, natural wood, and expansive zenithal lighting",
    badgeHeadline: "IAB Award 2024",
    badgeDescription: "High-End Residential category.",
  },
};

/** Fitness coaching — typewriter, dotExpand CTA, WhatsApp, no badge */
export const FitnessCoaching: Story = {
  args: {
    headline: "Train to become more",
    headlineRotatingWords: ["strong", "resilient", "confident", "healthy"],
    subheadline:
      "Personalized functional training and strength coaching with nutritional guidance. Real results in 12 weeks.",
    ctaText: "Get started",
    ctaUrl: "/plans",
    ctaStyle: "dotExpand",
    ctaColorScheme: "secondary",
    whatsappUrl:
      "https://wa.me/5511999887766?text=I'd%20like%20to%20learn%20more%20about%20the%20plans",
    whatsappLabel: "Ask us anything",
    image: "https://placehold.co/800x800",
    imageAlt:
      "Athlete performing a functional kettlebell exercise in a well-lit gym",
  },
};

/** Law firm — professional, no typewriter, default CTA, badge */
export const LawFirm: Story = {
  args: {
    headline: "Corporate law with strategic vision",
    subheadline:
      "Over 200 companies trust our legal advisory to navigate complex regulatory landscapes with confidence and agility.",
    ctaText: "Talk to a specialist",
    ctaUrl: "/contact",
    ctaStyle: "default",
    ctaColorScheme: "primary",
    image: "https://placehold.co/800x800",
    imageAlt:
      "Law office with legal bookshelves and a dark wood conference table",
    badgeHeadline: "Top 50 Legal Review",
    badgeDescription: "Corporate Law & M&A — 2024 ranking.",
  },
};

/** Bakery with featured products — headline accent, products grid, rotating badge, no typewriter */
export const ArtisanBakery: Story = {
  args: {
    headline: "Artisan bakery in the heart of",
    headlineAccent: "Curitiba",
    subheadline:
      "Naturally leavened breads, handcrafted pastries, and specialty coffees. Tradition and flavor since 1998.",
    ctaText: "Place an order",
    ctaUrl: "/menu",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    secondaryCtaText: "Our story",
    secondaryCtaUrl: "/about",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    image: "https://placehold.co/800x800",
    imageAlt: "Artisan breads fresh from the oven on a rustic wooden shelf",
    rotatingBadgeText: "Handmade \u2022 Natural Fermentation \u2022 ",
    featuredItems: [
      {
        image: "https://placehold.co/128x96",
        imageAlt: "Naturally leavened sourdough bread",
        title: "Sourdough Bread",
        discountPrice: "$3.60",
      },
      {
        image: "https://placehold.co/128x96",
        imageAlt: "Flaky butter croissant",
        title: "Croissant",
        discountPrice: "$2.40",
      },
      {
        image: "https://placehold.co/128x96",
        imageAlt: "Artisan chocolate cake",
        title: "Chocolate Cake",
        price: "$9.00",
        discountPrice: "$7.60",
      },
      {
        image: "https://placehold.co/128x96",
        imageAlt: "Freshly brewed specialty coffee",
        title: "Specialty Coffee",
        discountPrice: "$2.80",
      },
    ],
    featuredItemsLabel: "Today's Highlights",
    featuredItemsLinkText: "Full menu",
    featuredItemsLinkUrl: "/menu",
    badgeHeadline: "Since 1998",
    badgeDescription: "Over 25 years of artisan tradition.",
  },
};
