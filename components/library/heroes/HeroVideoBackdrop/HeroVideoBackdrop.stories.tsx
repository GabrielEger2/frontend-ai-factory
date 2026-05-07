import type { Meta, StoryObj } from "@storybook/react";
import HeroVideoBackdrop from "./index";

const meta: Meta<typeof HeroVideoBackdrop> = {
  title: "Hero/HeroVideoBackdrop",
  component: HeroVideoBackdrop,
  parameters: { layout: "fullscreen" },
  argTypes: {
    contentAlign: {
      control: "select",
      options: ["bottom-left", "bottom-center", "center"],
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
type Story = StoryObj<typeof HeroVideoBackdrop>;

/** Mountain lodge — bottom-left, glow CTA, low overlay, four meta items */
export const MountainLodge: Story = {
  args: {
    posterImage: "https://placehold.co/1600x900",
    posterAlt:
      "Snow-laden pine ridge above a wooden lodge at first light, soft mist between trunks",
    eyebrow: "Bariloche, ARG — open june through october",
    headline: "Quiet rooms above a frozen lake.",
    subheadline:
      "Eighteen rooms, a long communal table, and a wood-fired sauna built into the hillside. Open Tuesday to Sunday during the season; closed for two weeks at the start of August.",
    ctaText: "Check availability",
    ctaUrl: "/booking",
    ctaStyle: "glow",
    ctaColorScheme: "primary",
    secondaryCtaText: "Read the guide",
    secondaryCtaUrl: "/guide",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    contentAlign: "bottom-left",
    overlayStrength: 50,
    metaItems: ["18 rooms", "Lat -41.13", "Wood sauna", "From $342 / night"],
  },
};

/** Festival opener — bottom-center, accent CTA, higher overlay */
export const FestivalOpener: Story = {
  args: {
    posterImage: "https://placehold.co/1600x900",
    posterAlt: "Crowd lit by amber stage haze at an outdoor music festival",
    eyebrow: "11 — 14 september / parque ibirapuera",
    headline: "Four days, three stages, one long open block of city.",
    subheadline:
      "Forty-eight artists across electronic, jazz, and contemporary classical sets. Tickets in three tiers, with a sliding-scale option for residents of zip codes that border the park.",
    ctaText: "Get tickets",
    ctaUrl: "/tickets",
    ctaStyle: "slide",
    ctaColorScheme: "accent",
    secondaryCtaText: "Lineup",
    secondaryCtaUrl: "/lineup",
    secondaryCtaStyle: "drawOutline",
    contentAlign: "bottom-center",
    overlayStrength: 65,
    metaItems: ["48 artists", "3 stages", "Sliding scale", "BYO chair"],
  },
};

/** Architecture portfolio — center align, neutral, no secondary, restrained overlay */
export const ArchitecturePortfolio: Story = {
  args: {
    posterImage: "https://placehold.co/1600x900",
    posterAlt:
      "Wide shot of a low concrete house cut into a hillside at dusk, lit from inside",
    eyebrow: "Selected residential, 2019 — 2026",
    headline: "Slow rooms, honest materials, an argument with the sun.",
    subheadline:
      "A small studio of seven, working between Lisbon and Mexico City. Twenty-two completed houses, three civic projects, and one bookstore we still go back to read in.",
    ctaText: "View projects",
    ctaUrl: "/projects",
    ctaStyle: "default",
    ctaColorScheme: "neutral",
    contentAlign: "center",
    overlayStrength: 40,
    metaItems: ["Est. 2017", "22 houses", "Lisboa / CDMX"],
  },
};

/** Streetwear campaign — high overlay, dotExpand CTA, secondary outline */
export const StreetwearCampaign: Story = {
  args: {
    posterImage: "https://placehold.co/1600x900",
    posterAlt:
      "Three models walking down a wet alley wearing the new capsule, neon signage in the distance",
    eyebrow: "Capsule 04 — drops 23.05",
    headline: "Heavy cotton, no logo, fits worn for two seasons.",
    subheadline:
      "Cut and finished by hand in lots of forty in a converted print shop in Belem. Sizes XS through 3XL, with a sliding-scale resale program for pieces brought back inside two years.",
    ctaText: "Shop the capsule",
    ctaUrl: "/shop",
    ctaStyle: "dotExpand",
    ctaColorScheme: "secondary",
    secondaryCtaText: "Lookbook",
    secondaryCtaUrl: "/lookbook",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "secondary",
    contentAlign: "bottom-left",
    overlayStrength: 60,
    metaItems: ["12 pieces", "XS — 3XL", "Lot of 40", "Resale program"],
  },
};

/** Surf school — playful, arrow CTA, low overlay, ocean photography */
export const SurfSchool: Story = {
  args: {
    posterImage: "https://placehold.co/1600x900",
    posterAlt:
      "Long-lens shot of a small group paddling out at first light off a Portuguese beach",
    eyebrow: "Costa da caparica — daily, year-round",
    headline: "Learn to surf at the speed of the day you actually have.",
    subheadline:
      "Three coaches, no class bigger than six, and a coffee on the way in. Beginner sessions every morning at 7:40, intermediates from 11:15, and a quiet longboard hour from 17:30.",
    ctaText: "Book a session",
    ctaUrl: "/book",
    ctaStyle: "arrow",
    ctaColorScheme: "primary",
    secondaryCtaText: "How it works",
    secondaryCtaUrl: "/how",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    contentAlign: "bottom-left",
    overlayStrength: 35,
    metaItems: ["6 students max", "From €38", "Daily — 7:40am"],
  },
};
