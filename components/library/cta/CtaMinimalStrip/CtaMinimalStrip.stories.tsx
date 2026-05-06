import type { Meta, StoryObj } from "@storybook/react";
import CtaMinimalStrip from "./index";

const meta: Meta<typeof CtaMinimalStrip> = {
  title: "CTA/CtaMinimalStrip",
  component: CtaMinimalStrip,
  parameters: { layout: "fullscreen" },
  argTypes: {
    layoutVariant: {
      control: "select",
      options: ["centered", "inline", "bordered"],
    },
    tone: { control: "select", options: ["neutral", "muted", "inverse"] },
    styleKit: { control: "object" },
  },
};
export default meta;
type Story = StoryObj<typeof CtaMinimalStrip>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS bottom CTA — centered, neutral tone, dotExpand CTA */
export const SaasCloseTrial: Story = {
  args: {
    label: "Ready when you are",
    headline: "Start a free 14-day trial — no card, no sales call",
    description:
      "Open the console, connect a repository, and ship your first preview deploy before lunch. We'll meet you in Slack if anything snags.",
    ctaText: "Open the console",
    ctaUrl: "/console",
    secondaryText: "Read the docs",
    secondaryUrl: "/docs",
    layoutVariant: "centered",
    tone: "neutral",
    styleKit: { ctaVariant: "dotExpand", ctaColorScheme: "primary" },
  },
};

/** Editorial site — inline strip above the footer, muted tone */
export const EditorialInlineStrip: Story = {
  args: {
    headline:
      "Subscribe for new essays, or read everything in the open archive",
    ctaText: "Subscribe free",
    ctaUrl: "/subscribe",
    secondaryText: "Browse the archive",
    secondaryUrl: "/archive",
    layoutVariant: "inline",
    tone: "muted",
    styleKit: { ctaVariant: "default", ctaColorScheme: "neutral" },
  },
};

/** Conference final CTA — bordered hairlines, slide CTA, neutral */
export const ConferenceRegister: Story = {
  args: {
    label: "Frontend Summit 2026",
    headline: "Five-hundred forty-eight engineers already registered",
    description:
      "Two days, three tracks, one hallway track that historically gets more references than the keynotes.",
    ctaText: "Reserve your seat",
    ctaUrl: "/register",
    secondaryText: "View the schedule",
    secondaryUrl: "/schedule",
    layoutVariant: "bordered",
    tone: "neutral",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "accent" },
  },
};

/** Brazilian agency — inline strip, inverse tone, drawOutline CTA */
export const AgencyContactBR: Story = {
  args: {
    headline: "Conta para a gente o que você está construindo",
    ctaText: "Agendar conversa de 30 min",
    ctaUrl: "/agendar",
    secondaryText: "Ver casos recentes",
    secondaryUrl: "/portfolio",
    layoutVariant: "inline",
    tone: "inverse",
    styleKit: { ctaVariant: "drawOutline", ctaColorScheme: "primary" },
  },
};

/** Real-estate listing detail — centered, inverse tone, glow CTA */
export const RealEstateBookViewing: Story = {
  args: {
    label: "Open this Saturday",
    headline: "See 1248 Beacon Hill before it lists publicly next week",
    description:
      "Private viewings between 11am and 4pm — bring your agent or borrow ours for a 20-minute walk-through with the architect's plan handy.",
    ctaText: "Book a viewing window",
    ctaUrl: "/viewings/1248-beacon-hill",
    secondaryText: "Download the floor plan",
    secondaryUrl: "/listings/1248-beacon-hill/plan.pdf",
    layoutVariant: "centered",
    tone: "inverse",
    styleKit: { ctaVariant: "glow", ctaColorScheme: "accent" },
  },
};
