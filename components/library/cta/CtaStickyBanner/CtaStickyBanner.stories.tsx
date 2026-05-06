import type { Meta, StoryObj } from "@storybook/react";
import CtaStickyBanner from "./index";

/* The banner only mounts after the page scrolls past `appearAfterPx`.
   To see it in Storybook, drop the threshold to 0 or pass a tall
   placeholder. We render a tall placeholder via decorators so the
   stories feel real. */
const SCROLLABLE_PADDING_REM = 200;

const meta: Meta<typeof CtaStickyBanner> = {
  title: "CTA/CtaStickyBanner",
  component: CtaStickyBanner,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div
        className="bg-base-100"
        style={{ minHeight: `${SCROLLABLE_PADDING_REM}vh` }}
      >
        <div className="mx-auto max-w-3xl px-6 py-24 text-base-content/70">
          <p className="text-sm uppercase tracking-[0.2em] text-primary">
            Storybook scroll buffer
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-base-content md:text-4xl">
            Scroll the preview to reveal the sticky banner
          </h1>
          <p className="mt-4 max-w-prose text-base">
            The banner reveals once the viewport passes the configured
            appearAfterPx threshold (default 480px). This filler text exists so
            you can scroll a real distance and observe the slide-in behaviour.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "muted", "inverse", "primary"],
    },
    styleKit: { control: "object" },
  },
};
export default meta;
type Story = StoryObj<typeof CtaStickyBanner>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Newsletter signup — neutral tone, soft */
export const NewsletterSoftNudge: Story = {
  args: {
    badge: "Weekly",
    headline: "New essay every Thursday — 18,400 readers already in",
    description: "Twelve minutes of writing, no growth hacks, no recap emails.",
    ctaText: "Subscribe free",
    ctaUrl: "/subscribe",
    secondaryText: "Read the archive",
    secondaryUrl: "/archive",
    appearAfterPx: 80,
    tone: "neutral",
  },
};

/** Free trial nudge — primary tone, slide CTA */
export const SaasFreeTrial: Story = {
  args: {
    badge: "Free for 14 days",
    headline: "Spin up a workspace and ship a preview deploy in twenty minutes",
    ctaText: "Start free trial",
    ctaUrl: "/signup",
    appearAfterPx: 80,
    tone: "primary",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "primary" },
  },
};

/** Cookie-style consent or compliance — inverse, dismiss off */
export const ComplianceNotice: Story = {
  args: {
    badge: "EU residents",
    headline: "Pick a region for your data — we don't change it later",
    description: "Frankfurt or Stockholm. Both clear SOC 2 and DORA evidence.",
    ctaText: "Pick a region",
    ctaUrl: "/region",
    appearAfterPx: 80,
    tone: "inverse",
    dismissible: false,
  },
};

/** Limited drop reminder — muted, dotExpand CTA */
export const LimitedDropReminder: Story = {
  args: {
    badge: "Drop 04",
    headline: "Estúdio Reserva — forty-eight pieces, hand-finished",
    description: "Closes Sunday at 18:00 GMT-3.",
    ctaText: "Browse the drop",
    ctaUrl: "/drops/04",
    secondaryText: "Read the maker's note",
    secondaryUrl: "/drops/04/notes",
    appearAfterPx: 80,
    tone: "muted",
    styleKit: { ctaVariant: "dotExpand", ctaColorScheme: "neutral" },
  },
};

/** Brazilian agency — neutral, drawOutline CTA, pt-BR copy */
export const AgencyContactBR: Story = {
  args: {
    badge: "Estúdio",
    headline: "Conta para a gente o que você está construindo",
    description: "Conversa de trinta minutos, sem proposta nem follow-up.",
    ctaText: "Agendar conversa",
    ctaUrl: "/agendar",
    appearAfterPx: 80,
    tone: "neutral",
    styleKit: { ctaVariant: "drawOutline", ctaColorScheme: "primary" },
  },
};
