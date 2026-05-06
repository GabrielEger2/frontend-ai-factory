import type { Meta, StoryObj } from "@storybook/react";
import CtaCountdown from "./index";

/* Pick a deadline ~2-9 days from "now" — Storybook doesn't ship with a
   fixed clock, so the ticker animates in dev exactly as it would live. */
function isoDaysAhead(days: number, hour = 15, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const meta: Meta<typeof CtaCountdown> = {
  title: "CTA/CtaCountdown",
  component: CtaCountdown,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: { control: "select", options: ["neutral", "muted", "inverse"] },
    styleKit: { control: "object" },
  },
};
export default meta;
type Story = StoryObj<typeof CtaCountdown>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Product launch — bold inverse slab, glow CTA */
export const ProductLaunch: Story = {
  args: {
    eyebrow: "Public release",
    headline: "v3 ships when this hits zero",
    description:
      "Three years of rebuilding the editor from the typesystem up. Early-access seats are capped at six hundred for the first week.",
    endsAt: isoDaysAhead(7, 14),
    ctaText: "Reserve early access",
    ctaUrl: "/v3-early-access",
    secondaryText: "Read the technical brief",
    secondaryUrl: "/v3-brief",
    tone: "inverse",
    styleKit: { ctaVariant: "glow", ctaColorScheme: "accent" },
  },
};

/** Conference registration cutoff — neutral, slide CTA */
export const ConferenceCutoff: Story = {
  args: {
    eyebrow: "Frontend Summit 2026",
    headline: "Early-bird registration closes Friday",
    description:
      "Two days, three tracks, six-hundred-and-forty-eight engineers already registered. Tickets jump $180 the moment this clock hits zero.",
    endsAt: isoDaysAhead(3, 23, 59),
    ctaText: "Reserve your seat",
    ctaUrl: "/register",
    secondaryText: "View the schedule",
    secondaryUrl: "/schedule",
    tone: "neutral",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "primary" },
  },
};

/** Limited-edition drop — muted surface, dotExpand CTA */
export const LimitedDrop: Story = {
  args: {
    eyebrow: "Estúdio Reserva — drop 04",
    headline: "Forty-eight pieces, hand-finished, then never again",
    description:
      "Each linen jacket numbered and signed. Once the timer expires, the order page closes — we don't restock the run.",
    endsAt: isoDaysAhead(5, 18),
    ctaText: "Browse the drop",
    ctaUrl: "/drops/04",
    secondaryText: "Read the maker's note",
    secondaryUrl: "/drops/04/notes",
    tone: "muted",
    styleKit: { ctaVariant: "dotExpand", ctaColorScheme: "neutral" },
  },
};

/** Funding round close — neutral, drawOutline CTA, Brazilian audience */
export const FundingRoundBR: Story = {
  args: {
    eyebrow: "Rodada seed",
    headline: "Faltam três dias para fechar a rodada",
    description:
      "Já reservamos R$ 4,8M com sete fundos e seis anjos. O lote final abre vagas para até três tickets de R$ 250 mil.",
    endsAt: isoDaysAhead(3, 18),
    ctaText: "Falar com o time de captação",
    ctaUrl: "/captacao",
    secondaryText: "Baixar o deck (PDF)",
    secondaryUrl: "/deck.pdf",
    tone: "neutral",
    styleKit: { ctaVariant: "drawOutline", ctaColorScheme: "primary" },
  },
};

/** Already-expired window — shows the calm fallback state */
export const AlreadyClosed: Story = {
  args: {
    eyebrow: "Pre-orders",
    headline: "The pre-order window has closed",
    endsAt: "2024-01-01T12:00:00Z",
    endedText:
      "Manufacturing starts Monday. Drop your email and we'll loop you in for the next allocation in May.",
    ctaText: "Join the waitlist",
    ctaUrl: "/waitlist",
    secondaryText: "Read the launch retro",
    secondaryUrl: "/retro",
    tone: "muted",
  },
};
