import type { Meta, StoryObj } from "@storybook/react";
import HeroAsymmetricStack from "./index";

const meta: Meta<typeof HeroAsymmetricStack> = {
  title: "Hero/HeroAsymmetricStack",
  component: HeroAsymmetricStack,
  parameters: { layout: "fullscreen" },
  argTypes: {
    accentColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
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
type Story = StoryObj<typeof HeroAsymmetricStack>;

/** Independent fashion house — full peek images, accent italic, slide CTA */
export const IndependentFashionHouse: Story = {
  args: {
    eyebrow: "Resort 26 — drops 18.06",
    headlineLines: ["A summer of", "soft tailoring", "and quiet hems."],
    accentWord: "very",
    accentColorScheme: "primary",
    subheadline:
      "Forty-eight pieces in unbleached linen, raw silk, and a structured cotton woven for us in Vila Nova de Gaia. Cut and finished by hand in lots of forty in a converted print shop above the river.",
    ctaText: "Browse the lookbook",
    ctaUrl: "/lookbook",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    secondaryCtaText: "Visit the atelier",
    secondaryCtaUrl: "/atelier",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    peekImages: [
      {
        image: "https://placehold.co/480x600",
        imageAlt:
          "Detail of a tailored linen jacket photographed in afternoon studio light",
      },
      {
        image: "https://placehold.co/480x600",
        imageAlt:
          "Hand stitching the hem of a long raw-silk dress on a pattern table",
      },
    ],
  },
};

/** Cultural institution — restrained, neutral palette, single peek, default CTA */
export const ContemporaryArtMuseum: Story = {
  args: {
    eyebrow: "On view — sept 12 to feb 14",
    headlineLines: [
      "Forty-one rooms,",
      "one continuous",
      "argument with light.",
    ],
    accentColorScheme: "neutral",
    subheadline:
      "A retrospective of the photographer Adriana Sosa, drawn from the archive at the Museo de Arte Contemporaneo de Quito and four private collections in Brazil and Mexico. Free for residents of the metropolitan region on Wednesdays.",
    ctaText: "Plan your visit",
    ctaUrl: "/visit",
    ctaStyle: "default",
    ctaColorScheme: "neutral",
    secondaryCtaText: "Read the curator essay",
    secondaryCtaUrl: "/essay",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    peekImages: [
      {
        image: "https://placehold.co/480x600",
        imageAlt: "Silver gelatin print of a window at the artist's studio",
      },
    ],
  },
};

/** Music label compilation — playful, accent palette, dotExpand CTA */
export const MusicLabelCompilation: Story = {
  args: {
    eyebrow: "Vol. 14 — pressed in lots of 1,184",
    headlineLines: ["A record made", "for the long", "drive home."],
    accentWord: "almost",
    accentColorScheme: "accent",
    subheadline:
      "Twelve tracks recorded across three rooms in three nights in Sao Paulo. Pressed to limited 180g vinyl with extended digital mixes for subscribers and a forty-eight-page printed insert telling the story of every session.",
    ctaText: "Pre-order vinyl",
    ctaUrl: "/store/vol-14",
    ctaStyle: "dotExpand",
    ctaColorScheme: "accent",
    secondaryCtaText: "Stream the single",
    secondaryCtaUrl: "/listen",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "accent",
    peekImages: [
      {
        image: "https://placehold.co/480x600",
        imageAlt:
          "180g black vinyl half-pulled from a kraft sleeve under warm light",
      },
      {
        image: "https://placehold.co/480x600",
        imageAlt: "Studio mixing desk caught mid-session with monitors lit",
      },
    ],
  },
};

/** Architecture monograph — luxury restraint, secondary accent, glow CTA, no peek */
export const ArchitectureMonograph: Story = {
  args: {
    eyebrow: "Volume one — 184 plates, 22 essays",
    headlineLines: ["Slow rooms,", "honest materials,", "patient houses."],
    accentWord: "more",
    accentColorScheme: "secondary",
    subheadline:
      "The first published collection of work from the Lisbon studio, gathering twenty-two completed houses, three civic projects, and the bookstore at Rua das Flores. Foreword by the editor of Wallpaper, plates printed at duotone in Verona.",
    ctaText: "Reserve the monograph",
    ctaUrl: "/reserve",
    ctaStyle: "glow",
    ctaColorScheme: "secondary",
    secondaryCtaText: "Read the foreword",
    secondaryCtaUrl: "/foreword",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "secondary",
  },
};

/** Tech publication — bold, arrow CTA, two peeks, primary accent */
export const TechPublication: Story = {
  args: {
    eyebrow: "Issue eleven — May",
    headlineLines: ["The internet", "is bigger than", "any single timeline."],
    accentWord: "still",
    accentColorScheme: "primary",
    subheadline:
      "Forty-eight contributors writing about software, the rooms it gets built in, and the people who keep it running long after the launch posts get archived. Available in print and as a slow daily letter.",
    ctaText: "Subscribe — $74 / year",
    ctaUrl: "/subscribe",
    ctaStyle: "arrow",
    ctaColorScheme: "primary",
    secondaryCtaText: "Read issue ten",
    secondaryCtaUrl: "/issues/10",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    peekImages: [
      {
        image: "https://placehold.co/480x600",
        imageAlt:
          "Issue eleven cover photographed against the corner of a sunlit desk",
      },
      {
        image: "https://placehold.co/480x600",
        imageAlt:
          "Open spread showing a typeset essay with marginal printer's notes",
      },
    ],
  },
};
