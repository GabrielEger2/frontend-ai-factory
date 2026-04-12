import type { Meta, StoryObj } from "@storybook/react";
import ContentStatementSplit from "./index";

const meta: Meta<typeof ContentStatementSplit> = {
  title: "Layouts/ContentStatementSplit",
  component: ContentStatementSplit,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    colorScheme: {
      control: "select",
      options: ["dark", "light"],
    },
    headlinePosition: {
      control: "select",
      options: ["left", "right"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof ContentStatementSplit>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Real estate developer — dark background, accent image, emphasis line */
export const RealEstateDeveloper: Story = {
  args: {
    headline: "We were born to build a new standard of living well.",
    description:
      "We are part of a real estate group with five decades of commitment to quality, respect, and trust. Here, every project is built with purpose. And every home is a reflection of who chose it.",
    descriptionEmphasis: "D.Lohn — Where living well is the standard.",
    image: "https://placehold.co/833x470",
    imageAlt: "Person relaxing in a modern living room with natural light",
    accentImage: "https://placehold.co/224x224",
    accentImageAlt: "Happy homeowner in their new apartment",
    colorScheme: "dark",
    headlinePosition: "left",
  },
};

/** Architecture studio — light scheme, reversed layout, no accent image */
export const ArchitectureStudio: Story = {
  args: {
    headline: "Every space tells a story. We make sure it is worth telling.",
    description:
      "For over twenty years, our studio has shaped skylines and reimagined interiors. We approach each commission as a dialogue between light, material, and the people who inhabit the result. Awards are a byproduct — the real measure is the life that unfolds inside.",
    image: "https://placehold.co/833x470",
    imageAlt:
      "Minimalist concrete interior with floor-to-ceiling windows overlooking a garden",
    colorScheme: "light",
    headlinePosition: "right",
  },
};

/** Luxury winery — dark scheme, accent image, emphasis */
export const LuxuryWinery: Story = {
  args: {
    headline: "Crafted from the soil, perfected by time.",
    description:
      "Nestled in the highlands of Serra Gaucha, our vineyard has cultivated exceptional grapes since 1962. Each bottle represents three generations of winemaking wisdom, blending old-world techniques with modern precision to deliver wines that speak of origin.",
    descriptionEmphasis: "Vinicola Serrana — Tradition in every sip.",
    image: "https://placehold.co/833x470",
    imageAlt:
      "Rows of grapevines at golden hour in the hills of southern Brazil",
    accentImage: "https://placehold.co/224x224",
    accentImageAlt:
      "Sommelier examining a glass of red wine in the barrel cellar",
    colorScheme: "dark",
    headlinePosition: "left",
  },
};

/** Sustainable fashion brand — light, reversed, minimal */
export const SustainableFashion: Story = {
  args: {
    headline: "Wear what you believe in.",
    description:
      "We design clothing that respects the planet and the people who make it. Every fiber is traceable, every dye plant-based, every stitch intentional. Slow fashion is not a trend for us — it is a founding principle that shapes everything from concept to delivery.",
    descriptionEmphasis: "Terra Collective — Fashion with a conscience.",
    image: "https://placehold.co/833x470",
    imageAlt:
      "Model wearing an organic linen outfit against a raw concrete backdrop",
    colorScheme: "light",
    headlinePosition: "right",
  },
};

/** Boutique hotel — dark, accent image, headline left */
export const BoutiqueHotel: Story = {
  args: {
    headline: "Where the coastline meets quiet luxury.",
    description:
      "Twelve suites, each with an uninterrupted ocean view. No crowds, no rush — just the rhythm of the tide and attentive service that anticipates without intruding. Our guests return not for the amenities, but for the feeling of being truly at ease.",
    descriptionEmphasis: "Maré Hotel — Understated. Unforgettable.",
    image: "https://placehold.co/833x470",
    imageAlt: "Infinity pool overlooking the Atlantic at sunset",
    accentImage: "https://placehold.co/224x224",
    accentImageAlt:
      "Elegant hotel suite interior with ocean view through open balcony",
    colorScheme: "dark",
    headlinePosition: "left",
  },
};
