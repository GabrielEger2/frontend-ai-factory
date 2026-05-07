import type { Meta, StoryObj } from "@storybook/react";
import HeroKineticType from "./index";

const meta: Meta<typeof HeroKineticType> = {
  title: "Hero/HeroKineticType",
  component: HeroKineticType,
  parameters: { layout: "fullscreen" },
  argTypes: {
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
    accentColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    backgroundVariant: {
      control: "select",
      options: ["dot-grid", "horizon-rule", "none"],
    },
    rotateIntervalMs: { control: "number" },
  },
};
export default meta;
type Story = StoryObj<typeof HeroKineticType>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS product launch — beta announcement with dual CTA, dot-grid backdrop */
export const SaasProductLaunch: Story = {
  args: {
    eyebrow: "Now in private beta",
    headlinePrefix: "Ship websites that",
    rotatingWords: ["convert", "rank", "impress", "perform"],
    subheadline:
      "Lumen turns a fifteen-minute discovery call into a production-ready Next.js site. Private beta opens to one hundred founders this quarter.",
    ctaText: "Request beta access",
    ctaUrl: "/beta",
    ctaStyle: "dotExpand",
    ctaColorScheme: "primary",
    secondaryCtaText: "Watch a 90-second demo",
    secondaryCtaUrl: "/demo",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "primary",
    accentColorScheme: "primary",
    backgroundVariant: "dot-grid",
    rotateIntervalMs: 2400,
  },
};

/** Boutique São Paulo law firm — restrained editorial pacing, single CTA */
export const LegalConsultingFirm: Story = {
  args: {
    eyebrow: "Boutique corporate law · São Paulo",
    headlinePrefix: "Legal strategy for companies that",
    rotatingWords: ["scale", "merge", "expand", "innovate", "endure"],
    subheadline:
      "Andrade & Vasconcellos advises forty-two mid-market clients across Brazil on M&A, regulatory compliance, and disputes that quietly shape industries.",
    ctaText: "Request a consultation",
    ctaUrl: "/consulta",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    accentColorScheme: "secondary",
    backgroundVariant: "horizon-rule",
    rotateIntervalMs: 3000,
  },
};

/** Health-tech accelerator — energetic accent color, dual CTA */
export const HealthTechStartup: Story = {
  args: {
    eyebrow: "Cohort 2 — opens June",
    headlinePrefix: "Healthcare that's",
    rotatingWords: ["faster", "smarter", "closer", "clearer"],
    subheadline:
      "Pulso connects under-served clinics in northeast Brazil with specialists in São Paulo and Recife — appointments confirmed in under four minutes.",
    ctaText: "Apply to cohort 2",
    ctaUrl: "/cohort",
    ctaStyle: "glow",
    ctaColorScheme: "accent",
    secondaryCtaText: "Read founder letter",
    secondaryCtaUrl: "/founder-letter",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "accent",
    accentColorScheme: "accent",
    backgroundVariant: "dot-grid",
    rotateIntervalMs: 2200,
  },
};

/** Freelance design studio — minimal neutral hero, no backdrop, single CTA */
export const FreelanceDesignStudio: Story = {
  args: {
    eyebrow: "Available from August",
    headlinePrefix: "Interfaces that make people",
    rotatingWords: ["stay", "return", "refer", "trust"],
    subheadline:
      "Studio Talvez is a one-person practice in Florianópolis. I take three brand and product engagements per quarter and ship every deliverable myself.",
    ctaText: "See the case studies",
    ctaUrl: "/work",
    ctaStyle: "drawOutline",
    ctaColorScheme: "primary",
    accentColorScheme: "neutral",
    backgroundVariant: "none",
    rotateIntervalMs: 2600,
  },
};

/** Artisan single-origin coffee roaster — warm, slow rotation, dual CTA */
export const ArtisanCoffeeRoaster: Story = {
  args: {
    eyebrow: "Single origin · direct trade",
    headlinePrefix: "Coffee roasted for people who",
    rotatingWords: ["taste deeply", "slow down", "notice things"],
    subheadline:
      "Torrefação Manhã sources eighty-kilo lots from four farms in the Mantiqueira range and ships them within ten days of roasting.",
    ctaText: "Order this week's lot",
    ctaUrl: "/lot",
    ctaStyle: "default",
    ctaColorScheme: "neutral",
    secondaryCtaText: "Visit the roastery",
    secondaryCtaUrl: "/visita",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    accentColorScheme: "secondary",
    backgroundVariant: "dot-grid",
    rotateIntervalMs: 2800,
  },
};
