import type { Meta, StoryObj } from "@storybook/react";
import StatementSplit from "./index";

const meta: Meta<typeof StatementSplit> = {
  title: "Layout/Split/StatementSplit",
  component: StatementSplit,
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
type Story = StoryObj<typeof StatementSplit>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Luxury fashion brand — dark scheme, accent image, emphasis line */
export const LuxuryBrand: Story = {
  args: {
    headline:
      "Elegance is not about being noticed. It is about being remembered.",
    description:
      "For three generations, Maison Alvares has dressed women who lead. Our ateliers in Sao Paulo and Milan work exclusively with natural fibers sourced from certified cooperatives. Every piece is cut by hand, fitted in person, and delivered with a lifetime alteration guarantee.",
    descriptionEmphasis: "Maison Alvares — Couture with conscience.",
    image: "https://placehold.co/833x470",
    imageAlt:
      "Model in tailored silk suit walking through a marble-floored atelier",
    accentImage: "https://placehold.co/224x224",
    accentImageAlt: "Close-up of hand-stitched seam detail on linen fabric",
    colorScheme: "dark",
    headlinePosition: "left",
    purpose: "luxury-brand",
  },
};

/** Architecture firm — light scheme, reversed layout, no accent image */
export const ArchitectureFirm: Story = {
  args: {
    headline: "Buildings should age like wine, not like milk.",
    description:
      "Our studio approaches each project as a conversation between site, climate, and the people who will inhabit the result. We have delivered over forty residential and commercial projects across southern Brazil, each designed to perform for decades with minimal maintenance. Passive ventilation, local materials, and biophilic principles guide every decision from sketch to handover.",
    image: "https://placehold.co/833x470",
    imageAlt:
      "Concrete and glass office building surrounded by native landscaping",
    colorScheme: "light",
    headlinePosition: "right",
    purpose: "architecture-firm",
  },
};

/** Editorial magazine — dark scheme, accent image, headline left */
export const EditorialMagazine: Story = {
  args: {
    headline: "Stories that outlast the news cycle.",
    description:
      "Pagina Longa publishes long-form journalism on urbanism, culture, and technology in Latin America. Our reporters spend months embedded in the communities they cover. We accept no advertising and rely entirely on reader subscriptions, because the story should serve the reader, not the sponsor.",
    descriptionEmphasis: "Pagina Longa — Journalism without shortcuts.",
    image: "https://placehold.co/833x470",
    imageAlt:
      "Journalist reviewing printed proofs at a wooden desk under warm lamp light",
    accentImage: "https://placehold.co/224x224",
    accentImageAlt: "Stack of magazine issues fanned out on a coffee table",
    colorScheme: "dark",
    headlinePosition: "left",
    purpose: "editorial-magazine",
  },
};

/** Financial advisory — light scheme, reversed, emphasis line */
export const FinancialAdvisory: Story = {
  args: {
    headline: "Wealth is what remains after the market corrects.",
    description:
      "Monteiro Capital manages portfolios for families and founders who think in decades, not quarters. Our allocation models are stress-tested against sixty years of emerging-market data, and every client relationship begins with a fiduciary commitment: your interests first, always. We charge flat fees, never commissions, because alignment matters more than transactions.",
    descriptionEmphasis: "Monteiro Capital — Discipline over speculation.",
    image: "https://placehold.co/833x470",
    imageAlt:
      "Advisor presenting a portfolio review to clients in a glass-walled conference room",
    colorScheme: "light",
    headlinePosition: "right",
    purpose: "financial-advisory",
  },
};
