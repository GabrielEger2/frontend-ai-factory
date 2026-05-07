import type { Meta, StoryObj } from "@storybook/react";
import CardGrid from "./index";

const meta: Meta<typeof CardGrid> = {
  title: "Layout/Grid/CardGrid",
  component: CardGrid,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    styleKit: {
      control: "object",
      description:
        "Site-wide visual configuration — card style, CTA variant, etc.",
    },
    columns: {
      control: "select",
      options: [2, 3, 4],
    },
    flipDirection: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof CardGrid>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS platform — base cards showcasing core product features */
export const SaasFeatures: Story = {
  args: {
    headline: "Ship Better Software, Faster",
    subheadline:
      "A developer platform built from the ground up for teams that value speed without sacrificing reliability.",
    styleKit: {
      card: "base",
      ctaVariant: "default",
      ctaColorScheme: "primary",
    },
    columns: 3,
    cards: [
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Real-time collaboration interface with multiple cursors editing code",
        title: "Live Pair Programming",
        description:
          "Invite teammates into your editor session with one click. Shared cursors, voice chat, and conflict-free merging built in.",
        ctaText: "Try it free",
        ctaUrl: "/features/pair-programming",
        badge: "New",
      },
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Automated test runner dashboard showing green build statuses",
        title: "Instant CI Pipelines",
        description:
          "Zero-config continuous integration that detects your framework, runs tests in parallel, and reports results in under sixty seconds.",
        ctaText: "See benchmarks",
        ctaUrl: "/features/ci",
      },
      {
        image: "https://placehold.co/600x400",
        imageAlt: "Monitoring dashboard with latency charts and uptime metrics",
        title: "Built-In Observability",
        description:
          "Traces, logs, and error tracking unified in a single view. Correlate a slow endpoint to its root query in two clicks.",
        ctaText: "Explore dashboard",
        ctaUrl: "/features/observability",
      },
    ],
  },
};

/** E-commerce storefront — product cards with pricing, ratings, and cart actions */
export const EcommerceProducts: Story = {
  args: {
    headline: "Staff Picks This Season",
    subheadline:
      "Hand-selected by our editorial team for quality, design, and everyday utility.",
    styleKit: { card: "product" },
    columns: 4,
    cards: [
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Handcrafted ceramic pour-over coffee dripper in matte grey",
        title: "Ceramic Pour-Over",
        price: 48,
        originalPrice: 65,
        rating: 4.8,
        badge: "Sale",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Merino wool beanie in charcoal with folded brim",
        title: "Merino Beanie",
        price: 34,
        rating: 4.6,
        badge: "Best Seller",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Stainless steel insulated water bottle in forest green",
        title: "Trail Bottle 750ml",
        price: 29,
        originalPrice: 39,
        rating: 4.7,
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Linen tote bag in natural off-white with leather handles",
        title: "Market Tote",
        price: 42,
        rating: 4.9,
      },
    ],
  },
};

/** Creative agency — outline cards linking to portfolio projects */
export const AgencyPortfolio: Story = {
  args: {
    headline: "Selected Work",
    subheadline:
      "Brand identities, digital products, and campaigns for companies that refuse to blend in.",
    styleKit: { card: "outline" },
    columns: 3,
    cards: [
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Bold typographic brand identity for a Berlin-based music label",
        title: "Klangwerk Records",
        url: "/work/klangwerk",
      },
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Mobile banking app interface showing account overview in dark mode",
        title: "NeoBank Mobile App",
        url: "/work/neobank",
      },
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Packaging design for an organic skincare line with earthy tones",
        title: "Terra Botanica Packaging",
        url: "/work/terra-botanica",
      },
    ],
  },
};

/** Management consulting — flip cards revealing methodology details on hover */
export const ConsultingFlip: Story = {
  args: {
    headline: "How We Drive Transformation",
    subheadline:
      "Hover over each discipline to learn how we translate insight into measurable outcomes.",
    styleKit: { card: "flip", ctaVariant: "slide", ctaColorScheme: "accent" },
    columns: 3,
    flipDirection: "horizontal",
    cards: [
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Whiteboard covered in market-sizing calculations and competitive maps",
        title: "Growth Strategy",
        description:
          "Identify the highest-leverage opportunities hidden in your market data and competitive landscape.",
        backTitle: "Data-Led Playbooks",
        backDescription:
          "We synthesize 300+ data points per engagement into a prioritized 90-day action plan with clear ownership and KPIs.",
        backCtaText: "Request a briefing",
        backCtaUrl: "/contact",
        badge: "Core",
      },
      {
        image: "https://placehold.co/600x400",
        imageAlt: "Factory floor with automated quality inspection stations",
        title: "Operational Excellence",
        description:
          "Eliminate bottlenecks and reduce unit costs without compromising output quality or team morale.",
        backTitle: "Lean Six Sigma at Scale",
        backDescription:
          "Our operational audits have delivered an average 27% cost reduction within the first year across 40+ engagements.",
        backCtaText: "See case studies",
        backCtaUrl: "/case-studies/operations",
      },
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Workshop participants mapping a digital transformation roadmap on glass walls",
        title: "Digital Modernization",
        description:
          "Migrate from legacy monoliths to composable cloud-native systems your teams can iterate on independently.",
        backTitle: "End-to-End Migration",
        backDescription:
          "We handle architecture design, team upskilling, and post-migration support until the new platform is self-sustaining.",
        backCtaText: "Start assessment",
        backCtaUrl: "/contact",
      },
    ],
  },
};
