import type { Meta, StoryObj } from "@storybook/react";
import CtaCollageDuo from "./index";

const meta: Meta<typeof CtaCollageDuo> = {
  title: "CTA/CtaCollageDuo",
  component: CtaCollageDuo,
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
  },
};
export default meta;
type Story = StoryObj<typeof CtaCollageDuo>;

export const RunningClub: Story = {
  args: {
    headline: "Running Club",
    body: "Join a community of weekend runners who train together at sunrise, share routes along the coast, and celebrate every personal best with breakfast on the boardwalk.",
    ctaText: "Join the Club",
    ctaUrl: "#join",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    primaryImage: "https://placehold.co/600x800?text=Sunrise+Run",
    primaryImageAlt: "Runner heading down a coastal boardwalk at sunrise",
    secondaryImage: "https://placehold.co/800x600?text=Cooldown",
    secondaryImageAlt: "Runner checking her smartwatch during cooldown by the water",
    attributionText: "Photography by",
    attributionLinkText: "Lena Hart",
    attributionUrl: "https://example.com/lena-hart",
  },
};

export const PotteryStudio: Story = {
  args: {
    headline: "Wheel & Kiln Studio",
    body: "A small Lisbon studio for hand-thrown ceramics. Six-week courses, open studio nights every Thursday, and a glaze library you can dip into whenever the muse arrives.",
    ctaText: "Reserve a wheel",
    ctaUrl: "#reserve",
    ctaStyle: "drawOutline",
    ctaColorScheme: "accent",
    primaryImage: "https://placehold.co/600x800?text=Hands+at+Wheel",
    primaryImageAlt: "Potter's hands shaping wet clay on a spinning wheel",
    secondaryImage: "https://placehold.co/800x600?text=Glazed+Bowls",
    secondaryImageAlt: "Row of glazed stoneware bowls cooling outside the kiln",
    highlightWord: "Kiln",
  },
};

export const FarmToTable: Story = {
  args: {
    headline: "Field Notes Supper Club",
    body: "Monthly long-table dinners on a working farm in the Hudson Valley. Five courses, natural wine pairings, and the chance to meet the people who grew everything on your plate.",
    ctaText: "Book a Seat",
    ctaUrl: "#book",
    ctaStyle: "glow",
    ctaColorScheme: "primary",
    primaryImage: "https://placehold.co/600x800?text=Long+Table",
    primaryImageAlt: "Long wooden farm table set under string lights at dusk",
    secondaryImage: "https://placehold.co/800x600?text=Heirloom+Tomatoes",
    secondaryImageAlt: "Heirloom tomatoes still on the vine in a wooden crate",
    attributionText: "Recipes adapted from",
    attributionLinkText: "the farm journal",
    attributionUrl: "https://example.com/journal",
    revealHeadline: true,
  },
};

export const SurfSchool: Story = {
  args: {
    headline: "Coastline Surf School",
    body: "Beginner-friendly group lessons every morning between May and October. Boards, wetsuits, and a cup of post-session coffee from the van included with every booking.",
    ctaText: "Check tide times",
    ctaUrl: "#tides",
    ctaStyle: "dotExpand",
    ctaColorScheme: "secondary",
    primaryImage: "https://placehold.co/600x800?text=Paddle+Out",
    primaryImageAlt: "Surfer paddling out toward a head-high wave",
    secondaryImage: "https://placehold.co/800x600?text=Beach+Lineup",
    secondaryImageAlt: "Row of surfboards lined up against a weathered fence on the beach",
  },
};

export const ArchitectureFirm: Story = {
  args: {
    headline: "Casa Norte Studio",
    body: "An independent architecture practice working on coastal homes, adaptive-reuse warehouses, and the occasional treehouse. Drawings start with conversations, not floor plans.",
    ctaText: "Start a project",
    ctaUrl: "#contact",
    ctaStyle: "default",
    ctaColorScheme: "neutral",
    primaryImage: "https://placehold.co/600x800?text=Concrete+Stair",
    primaryImageAlt: "Concrete stair winding past a tall window in a renovated home",
    secondaryImage: "https://placehold.co/800x600?text=Workspace",
    secondaryImageAlt: "Architect's workspace with hand-drawn elevations and a wooden model",
    attributionText: "Featured in",
    attributionLinkText: "Dwell",
    attributionUrl: "https://example.com/dwell",
    highlightWord: "Studio",
  },
};
