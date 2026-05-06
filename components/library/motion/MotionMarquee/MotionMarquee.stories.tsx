import type { Meta, StoryObj } from "@storybook/react";
import MotionMarquee from "./index";

const meta: Meta<typeof MotionMarquee> = {
  title: "Motion/MotionMarquee",
  component: MotionMarquee,
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: { control: "select", options: ["words", "logos", "badges"] },
    tone: { control: "select", options: ["neutral", "muted", "inverse"] },
    spacing: { control: "select", options: ["default", "compact"] },
  },
};
export default meta;
type Story = StoryObj<typeof MotionMarquee>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Editorial words ticker — agency capabilities, inverse */
export const AgencyCapabilities: Story = {
  args: {
    eyebrow: "What we do",
    headline: "Six practices, one studio",
    variant: "words",
    tone: "inverse",
    rows: [
      {
        items: [
          "Editorial design",
          "Brand systems",
          "Production engineering",
          "Motion + interaction",
          "Pricing strategy",
          "Founder advisory",
          "Content + voice",
        ],
        direction: "left",
        durationSec: 38,
      },
    ],
  },
};

/** Customer logo strip — single row, neutral tone */
export const CustomerLogoStrip: Story = {
  args: {
    eyebrow: "Trusted by",
    headline: "Eight teams running production today",
    variant: "logos",
    tone: "neutral",
    spacing: "compact",
    rows: [
      {
        items: [
          {
            src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=NORTHBEAM",
            alt: "Northbeam",
          },
          {
            src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=KINETIC",
            alt: "Kinetic",
          },
          {
            src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=HELIX",
            alt: "Helix",
          },
          {
            src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=GLASSCUBE",
            alt: "Glasscube",
          },
          {
            src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=DRIFT",
            alt: "Drift Studio",
          },
          {
            src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=RIVERMARK",
            alt: "Rivermark",
          },
          {
            src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=MORROW",
            alt: "Morrow & Co",
          },
          {
            src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=NORTHWAVE",
            alt: "Northwave",
          },
        ],
        direction: "left",
        durationSec: 42,
      },
    ],
  },
};

/** Tech stack badges — two rows scrolling opposite directions */
export const TechStackBadges: Story = {
  args: {
    eyebrow: "Production stack",
    headline: "What we run on, end-to-end",
    variant: "badges",
    tone: "muted",
    rows: [
      {
        items: [
          { text: "Next.js" },
          { text: "TypeScript" },
          { text: "Tailwind" },
          { text: "React 19" },
          { text: "Framer Motion" },
          { text: "Postgres" },
          { text: "Vercel Edge" },
          { text: "Cloudflare R2" },
          { text: "Stripe" },
          { text: "Resend" },
        ],
        direction: "left",
        durationSec: 30,
      },
      {
        items: [
          { text: "OpenTelemetry" },
          { text: "OAuth2.1" },
          { text: "GraphQL" },
          { text: "AWS Lambda" },
          { text: "ARM64" },
          { text: "OKLCH tokens" },
          { text: "Vitest" },
          { text: "Playwright" },
        ],
        direction: "right",
        durationSec: 36,
      },
    ],
  },
};

/** Conference tag track — links live, neutral */
export const ConferenceTopicTags: Story = {
  args: {
    eyebrow: "Frontend Summit 2026",
    headline: "Twelve tracks, one weekend",
    variant: "badges",
    tone: "neutral",
    rows: [
      {
        items: [
          { text: "Edge runtimes", href: "/tracks/edge" },
          { text: "WebGPU shaders", href: "/tracks/webgpu" },
          { text: "Motion design systems", href: "/tracks/motion" },
          { text: "AI agents in browsers", href: "/tracks/agents" },
          { text: "Accessibility at scale", href: "/tracks/a11y" },
          { text: "Server components", href: "/tracks/rsc" },
          { text: "Type-safe APIs", href: "/tracks/typesafe" },
          { text: "Live coding", href: "/tracks/live" },
        ],
        direction: "left",
        durationSec: 28,
      },
    ],
  },
};

/** Pure brand statement — three editorial words, slow tempo, inverse */
export const BrandStatementSlow: Story = {
  args: {
    variant: "words",
    tone: "inverse",
    spacing: "compact",
    rows: [
      {
        items: ["Make it useful", "Make it honest", "Make it last"],
        direction: "left",
        durationSec: 60,
      },
    ],
  },
};
