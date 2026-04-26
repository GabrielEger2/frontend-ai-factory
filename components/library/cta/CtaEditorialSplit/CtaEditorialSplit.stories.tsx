import type { Meta, StoryObj } from "@storybook/react";
import CtaEditorialSplit from "./index";

const meta: Meta<typeof CtaEditorialSplit> = {
  title: "CTA/CtaEditorialSplit",
  component: CtaEditorialSplit,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaStyle: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    revealHeadline: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof CtaEditorialSplit>;

export const AdventureTravel: Story = {
  args: {
    eyebrowCallout: "The Mountains Are Calling",
    headline: "Stop staring at the mountains",
    body: "Pack the boots, ditch the spreadsheet, and trade your screen for a switchback. Our small-group expeditions in Patagonia book out in 48 hours — secure your slot before the next thaw.",
    ctaText: "Reserve a spot",
    ctaUrl: "#book",
    ctaStyle: "default",
    ctaColorScheme: "primary",
    secondaryCtaText: "View itinerary",
    secondaryCtaUrl: "#itinerary",
    primaryImage: "https://placehold.co/720x960/1f2a1c/e8efe2?text=Pine+Forest",
    primaryImageAlt: "Tall pine forest viewed from below with morning light filtering through the canopy",
    secondaryImage: "https://placehold.co/640x800/3a3f3a/ced3cd?text=Foggy+Road",
    secondaryImageAlt: "Empty mountain road disappearing into thick morning fog",
    revealHeadline: true,
  },
};

export const ArtisanCoffeeRoaster: Story = {
  args: {
    eyebrowCallout: "Brewed Slow",
    headline: "Coffee that remembers where it came from",
    body: "Single-origin lots from family farms in Yirgacheffe and Huila, roasted in Brooklyn the same week they ship. Subscribe and your beans are never more than nine days from the cupping table.",
    ctaText: "Start your subscription",
    ctaUrl: "#subscribe",
    ctaStyle: "slide",
    ctaColorScheme: "neutral",
    secondaryCtaText: "Meet the farms",
    secondaryCtaUrl: "#origins",
    primaryImage: "https://placehold.co/720x960/3a2618/efe2d6?text=Roasted+Beans",
    primaryImageAlt: "Close-up of dark roasted coffee beans cooling on a tray",
    secondaryImage: "https://placehold.co/640x800/2a1c14/e0d6c8?text=Coffee+Farm",
    secondaryImageAlt: "Misty coffee farm hillside at sunrise with rows of arabica plants",
    highlightWord: "remembers",
  },
};

export const ArchitectureStudio: Story = {
  args: {
    eyebrowCallout: "Build Quietly",
    headline: "Spaces that hold their breath",
    body: "We design residences and small civic buildings in the Pacific Northwest. Twelve projects a year, every one drawn by the principal who signs the contract. No marketing department, no portfolio inflation.",
    ctaText: "Inquire about a project",
    ctaUrl: "#inquire",
    ctaStyle: "drawOutline",
    ctaColorScheme: "neutral",
    primaryImage: "https://placehold.co/720x960/d4d4d0/2a2a26?text=Concrete+House",
    primaryImageAlt: "Minimal concrete and timber house at dusk with warm interior lighting",
    secondaryImage: "https://placehold.co/640x800/c8c8c0/333333?text=Atrium",
    secondaryImageAlt: "Double-height atrium with a central skylight and a single timber stair",
  },
};

export const NaturalWineBar: Story = {
  args: {
    eyebrowCallout: "Pour Something Honest",
    headline: "Wines made by people, not algorithms",
    body: "Forty-two by-the-glass pours, all from low-intervention growers we have visited at least once. Walk-ins until 10pm Wednesday through Sunday — no reservations, no corkage, no gatekeeping.",
    ctaText: "See tonight's list",
    ctaUrl: "#list",
    ctaStyle: "glow",
    ctaColorScheme: "accent",
    secondaryCtaText: "Find the bar",
    secondaryCtaUrl: "#location",
    primaryImage: "https://placehold.co/720x960/3a1f2a/efd6e0?text=Pouring+Wine",
    primaryImageAlt: "Hand pouring orange wine into a stemless glass on a marble counter",
    secondaryImage: "https://placehold.co/640x800/2a141c/e0c8d0?text=Bar+Room",
    secondaryImageAlt: "Warmly lit narrow wine bar with a single row of stools and shelves of bottles",
    highlightWord: "people",
  },
};

export const ConservationNonprofit: Story = {
  args: {
    eyebrowCallout: "The Last 4%",
    headline: "Old-growth forest still has a future",
    body: "Only four percent of the world's old-growth temperate rainforest remains. Our land trust has placed 18,000 acres of British Columbia coast under permanent protection since 2019 — your gift funds the next thousand.",
    ctaText: "Donate today",
    ctaUrl: "#donate",
    ctaStyle: "dotExpand",
    ctaColorScheme: "primary",
    secondaryCtaText: "Read the 2025 report",
    secondaryCtaUrl: "#report",
    primaryImage: "https://placehold.co/720x960/1c2a1c/d6efd6?text=Old+Growth",
    primaryImageAlt: "Massive old-growth Douglas fir trunks rising into a misty canopy",
    secondaryImage: "https://placehold.co/640x800/14201c/c8e0d0?text=Coastal+Forest",
    secondaryImageAlt: "Aerial view of coastal temperate rainforest meeting a calm Pacific inlet",
    revealHeadline: true,
  },
};
