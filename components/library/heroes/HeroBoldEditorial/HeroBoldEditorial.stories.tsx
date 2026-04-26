import type { Meta, StoryObj } from "@storybook/react";
import HeroBoldEditorial from "./index";

const meta: Meta<typeof HeroBoldEditorial> = {
  title: "Heroes/HeroBoldEditorial",
  component: HeroBoldEditorial,
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
    secondaryCtaStyle: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    accentColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    revealHeadline: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof HeroBoldEditorial>;

export const FashionMagazine: Story = {
  args: {
    eyebrow:
      "The Spring Issue. Fifty-two pages of designers, makers, and the rooms they build the world inside of.",
    headline: "Great Concept",
    highlightWord: "Concept",
    revealHeadline: true,
    primaryImage: "https://placehold.co/600x800",
    primaryImageAlt:
      "Black-and-white close-up of garden roses in soft afternoon light",
    primaryImageOverlayText: "good ideas",
    accentImage: "https://placehold.co/600x600",
    accentImageAlt: "Portrait of a model wearing oversized hoop earrings",
    ctaText: "Read the Issue",
    ctaUrl: "#",
    ctaStyle: "default",
    ctaColorScheme: "neutral",
    secondaryCtaText: "Subscribe",
    secondaryCtaUrl: "#",
    secondaryCtaStyle: "drawOutline",
    accentColorScheme: "primary",
  },
};

export const ArchitectStudio: Story = {
  args: {
    eyebrow:
      "A practice working between Lisbon and Mexico City on residences, civic buildings, and rooms designed to be quiet.",
    headline: "Honest Materials",
    highlightWord: "Honest",
    revealHeadline: true,
    primaryImage: "https://placehold.co/600x800",
    primaryImageAlt: "Concrete stairwell rising through a sunlit atrium",
    primaryImageOverlayText: "slow rooms",
    accentImage: "https://placehold.co/600x600",
    accentImageAlt: "Detail of a wooden joint on a hand-built dining table",
    ctaText: "View Projects",
    ctaUrl: "#projects",
    ctaStyle: "slide",
    ctaColorScheme: "neutral",
    secondaryCtaText: "Studio",
    secondaryCtaUrl: "#about",
    secondaryCtaStyle: "drawOutline",
    accentColorScheme: "accent",
  },
};

export const PerfumeBrand: Story = {
  args: {
    eyebrow:
      "Six fragrances, blended in small batches, each one keyed to a single hour of the day you would actually want to live inside.",
    headline: "Hours, Bottled",
    highlightWord: "Bottled",
    revealHeadline: true,
    primaryImage: "https://placehold.co/600x800",
    primaryImageAlt:
      "Amber glass perfume bottle on a marble shelf at golden hour",
    primaryImageOverlayText: "4:17 pm",
    accentImage: "https://placehold.co/600x600",
    accentImageAlt:
      "Ingredient flatlay with iris root, vetiver, and dried citrus peel",
    ctaText: "Shop the Edition",
    ctaUrl: "#shop",
    ctaStyle: "glow",
    ctaColorScheme: "neutral",
    accentColorScheme: "secondary",
  },
};

export const LiteraryJournal: Story = {
  args: {
    eyebrow:
      "A quarterly journal of essays, photographs, and short fiction. Print-only, mailed in March, June, September, and December.",
    headline: "Letters Home",
    revealHeadline: false,
    primaryImage: "https://placehold.co/600x800",
    primaryImageAlt: "Open hardcover book with handwritten margin notes",
    primaryImageOverlayText: "vol. iv",
    ctaText: "Subscribe",
    ctaUrl: "#subscribe",
    ctaStyle: "default",
    ctaColorScheme: "neutral",
    secondaryCtaText: "Read a Sample",
    secondaryCtaUrl: "#sample",
    secondaryCtaStyle: "drawOutline",
    accentColorScheme: "neutral",
  },
};

export const ContemporaryGallery: Story = {
  args: {
    eyebrow:
      "Now showing on the second floor through August: forty-one paintings, three rooms, one continuous argument about light.",
    headline: "Rooms of Light",
    highlightWord: "Light",
    revealHeadline: true,
    primaryImage: "https://placehold.co/600x800",
    primaryImageAlt:
      "Visitor looking at a large oil painting in a white-walled gallery",
    primaryImageOverlayText: "on view",
    accentImage: "https://placehold.co/600x600",
    accentImageAlt:
      "Detail of an oil painting showing thick brushwork in cobalt and bone white",
    ctaText: "Plan Your Visit",
    ctaUrl: "#visit",
    ctaStyle: "dotExpand",
    ctaColorScheme: "neutral",
    secondaryCtaText: "Become a Member",
    secondaryCtaUrl: "#members",
    secondaryCtaStyle: "drawOutline",
    accentColorScheme: "primary",
  },
};
