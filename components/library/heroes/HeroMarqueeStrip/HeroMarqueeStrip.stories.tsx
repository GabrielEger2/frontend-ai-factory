import type { Meta, StoryObj } from "@storybook/react";
import HeroMarqueeStrip from "./index";

const meta: Meta<typeof HeroMarqueeStrip> = {
  title: "Heroes/HeroMarqueeStrip",
  component: HeroMarqueeStrip,
  parameters: { layout: "fullscreen" },
  argTypes: {
    direction: { control: "select", options: ["left", "right"] },
    ctaStyle: {
      control: "select",
      options: [
        "default",
        "slide",
        "dotExpand",
        "drawOutline",
        "glow",
        "arrow",
      ],
    },
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    secondaryCtaStyle: {
      control: "select",
      options: [
        "default",
        "slide",
        "dotExpand",
        "drawOutline",
        "glow",
        "arrow",
      ],
    },
    secondaryCtaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof HeroMarqueeStrip>;

/** Independent record label drop — energetic, italic counter-row, slide CTA */
export const RecordLabelDrop: Story = {
  args: {
    eyebrow: "Vol. 14 — out 17.05",
    marqueeWords: ["Carrossel", "Aurora", "Beira-Rio", "Quase", "Vidro Liso"],
    headline:
      "A new compilation of sao paulo nightlife, recorded live across three rooms in three nights.",
    subheadline:
      "Twelve tracks pressed to limited 180g vinyl, with extended digital mixes for subscribers. Ships from May 23.",
    ctaText: "Pre-order vinyl",
    ctaUrl: "/store/vol-14",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    secondaryCtaText: "Stream the single",
    secondaryCtaUrl: "/listen",
    secondaryCtaStyle: "drawOutline",
    direction: "left",
    speed: 28,
    separator: "//",
  },
};

/** Architecture biennial — restrained, slower, neutral palette */
export const ArchitectureBiennial: Story = {
  args: {
    eyebrow: "Lisbon — Sept 12 to Nov 30",
    marqueeWords: [
      "Material Honesty",
      "Quiet Rooms",
      "Slow Light",
      "Common Ground",
    ],
    headline:
      "Forty-one practices, three pavilions, one continuous argument about how a city should age.",
    subheadline:
      "Tickets release in two waves on July 8 and August 19. Members and Lisbon residents have priority access during the first 72 hours.",
    ctaText: "Reserve a slot",
    ctaUrl: "/tickets",
    ctaStyle: "default",
    ctaColorScheme: "neutral",
    secondaryCtaText: "Read the curator essay",
    secondaryCtaUrl: "/curator",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    direction: "right",
    speed: 50,
    separator: "—",
  },
};

/** Streetwear capsule release — fast, accent color, arrow CTA */
export const StreetwearCapsule: Story = {
  args: {
    eyebrow: "Capsule 03",
    marqueeWords: [
      "Heavy Cotton",
      "Boxy Cut",
      "Reactive Dye",
      "Studio Grade",
      "Dropped Shoulder",
    ],
    headline:
      "Twelve pieces designed in a converted print shop on Rua Augusta, finished by hand in lots of forty.",
    subheadline:
      "Sizes XS through XL ship in cotton-fiber mailers. Returns are accepted within 21 days, no questions, prepaid label included.",
    ctaText: "Shop the drop",
    ctaUrl: "/shop",
    ctaStyle: "arrow",
    ctaColorScheme: "accent",
    direction: "left",
    speed: 22,
    separator: "*",
  },
};

/** Branding agency homepage — playful, secondary scheme, double CTA */
export const BrandingAgency: Story = {
  args: {
    eyebrow: "Independent studio — est. 2017",
    marqueeWords: [
      "Identity",
      "Packaging",
      "Wayfinding",
      "Naming",
      "Tone of Voice",
    ],
    headline:
      "We name, draw, and stage the things that make a small business feel like a place you would actually want to walk into.",
    subheadline:
      "Currently booking projects starting in October. We work with around fourteen clients a year, mostly food, hospitality, and slow consumer goods.",
    ctaText: "See our work",
    ctaUrl: "/work",
    ctaStyle: "dotExpand",
    ctaColorScheme: "secondary",
    secondaryCtaText: "Email us",
    secondaryCtaUrl: "mailto:hello@studio.example",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "secondary",
    direction: "right",
    speed: 35,
    separator: "+",
  },
};

/** Coffee roaster origin release — friendly, italic counter, draw outline */
export const CoffeeRoasterOrigin: Story = {
  args: {
    eyebrow: "Single origin — Cerrado Mineiro",
    marqueeWords: [
      "Honey Process",
      "Yellow Bourbon",
      "Lot 217",
      "1184m",
      "Roasted 03 May",
    ],
    headline:
      "A bright, structured cup with apricot up front and a finish that stays sweet for an embarrassingly long time.",
    subheadline:
      "Available as 250g whole bean or pre-ground for AeroPress, Hario V60, and Italian moka. Subscriptions ship every fourteen days.",
    ctaText: "Order a bag",
    ctaUrl: "/shop/cerrado-217",
    ctaStyle: "glow",
    ctaColorScheme: "primary",
    secondaryCtaText: "Brew guide",
    secondaryCtaUrl: "/brew",
    secondaryCtaStyle: "drawOutline",
    direction: "left",
    speed: 32,
    separator: "·",
  },
};
