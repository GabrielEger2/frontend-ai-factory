import type { Meta, StoryObj } from "@storybook/react";
import ParallaxContent from "./index";

const meta: Meta<typeof ParallaxContent> = {
  title: "Layouts/Scroll/ParallaxContent",
  component: ParallaxContent,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "200vh" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    styleKit: {
      control: "object",
    },
    imagePadding: {
      control: { type: "range", min: 0, max: 32, step: 4 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ParallaxContent>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Luxury hotel — cinematic room photography with editorial content, glow CTA */
export const LuxuryHotelRooms: Story = {
  args: {
    styleKit: {
      ctaVariant: "glow",
      ctaColorScheme: "accent",
    },
    imagePadding: 0,
    purpose: "features",
    sections: [
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Spacious ocean-view suite with floor-to-ceiling windows and warm evening light",
        label: "Suites",
        heading: "Where the horizon begins.",
        content: {
          contentHeadline: "Ocean suites designed for slow mornings",
          contentDescription:
            "Wake to uninterrupted views of the Atlantic from a king bed wrapped in Egyptian cotton. Each suite features a private terrace, a deep soaking tub positioned to face the sea, and blackout curtains operated by a bedside console. Turndown service includes hand-selected local chocolates and a curated playlist for the Sonos system.",
          ctaText: "Reserve a suite",
          ctaUrl: "/rooms/ocean-suite",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Rooftop infinity pool overlooking a coastal town at golden hour",
        label: "Wellness",
        heading: "Stillness is a luxury.",
        content: {
          contentHeadline: "A rooftop sanctuary above the coastline",
          contentDescription:
            "The infinity pool stretches 25 meters along the rooftop edge, heated year-round and attended by poolside sommeliers. Below it, a full-service spa offers hot-stone treatments, aromatherapy sessions, and a hammam ritual passed down through four generations of local therapists. Reservations are never required — every guest has guaranteed access.",
          ctaText: "Explore wellness",
          ctaUrl: "/wellness",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Candlelit fine dining restaurant with white tablecloths and a wine cellar visible through glass",
        label: "Dining",
        heading: "Taste the terroir.",
        content: {
          contentHeadline: "Three restaurants, one philosophy: local first",
          contentDescription:
            "Chef Ana Morales sources every ingredient within 80 kilometers of the property. The tasting menu at Mareta changes nightly based on what the fishing boats and farms deliver. For casual meals, the beachfront grill serves whole fish over charcoal, and the rooftop bar pairs craft cocktails with small plates inspired by the Algarve pantry.",
          ctaText: "View menus",
          ctaUrl: "/dining",
        },
      },
    ],
  },
};

/** SaaS product deep dive — feature sections with technical content, slide CTA */
export const SaasProductDeepDive: Story = {
  args: {
    styleKit: {
      ctaVariant: "slide",
      ctaColorScheme: "primary",
    },
    purpose: "features",
    sections: [
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Real-time data pipeline visualization with nodes and directed edges on a dark interface",
        label: "Ingestion",
        heading: "Every event, captured.",
        content: {
          contentHeadline:
            "A data pipeline that scales to 10 million events per second",
          contentDescription:
            "Our ingestion layer accepts events from SDKs, webhooks, server-side libraries, and direct API calls. Data is validated against your schema in real time, enriched with geo and device metadata, and written to a columnar store within 200 milliseconds. Backfills and replays are first-class operations — reprocess any window without downtime.",
          ctaText: "Read the architecture docs",
          ctaUrl: "/docs/ingestion",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Query editor showing SQL syntax with autocomplete suggestions and a result chart below",
        label: "Analysis",
        heading: "Ask anything, instantly.",
        content: {
          contentHeadline: "Sub-second queries across billions of rows",
          contentDescription:
            "Write SQL or use the visual query builder to explore your data warehouse. Our execution engine parallelizes queries across a distributed cluster, caches intermediate results, and returns answers in under one second for 95th-percentile workloads. Saved queries can be scheduled, shared with teammates, or embedded in dashboards.",
          ctaText: "Try the query playground",
          ctaUrl: "/playground",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Alert configuration panel with threshold sliders and notification channel selectors",
        label: "Monitoring",
        heading: "Know before your users do.",
        content: {
          contentHeadline: "Anomaly detection that learns your baseline",
          contentDescription:
            "Set static thresholds or let the ML engine learn normal patterns and alert when behavior deviates. Alerts route to Slack, PagerDuty, email, or custom webhooks with full context attached — the metric name, current value, historical chart, and a deep link to the relevant dashboard. Mute windows, escalation policies, and on-call schedules are built in.",
          ctaText: "Configure alerts",
          ctaUrl: "/features/monitoring",
        },
      },
    ],
  },
};

/** Digital agency portfolio — project showcases with creative copy, drawOutline CTA */
export const DigitalAgencyWork: Story = {
  args: {
    styleKit: {
      ctaVariant: "drawOutline",
      ctaColorScheme: "secondary",
    },
    imagePadding: 16,
    purpose: "services",
    sections: [
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "E-commerce platform interface showing product grid with lifestyle photography and filters",
        label: "Commerce",
        heading: "Selling made sensory.",
        content: {
          contentHeadline:
            "An e-commerce rebuild that tripled conversion rates",
          contentDescription:
            "When Maison Fleur outgrew their template store, we designed a headless commerce experience from scratch. Product pages feature 360-degree photography, AI-powered size recommendations, and a checkout flow reduced to three steps. The migration preserved SEO equity across 12,000 URLs while cutting page load time by 60 percent.",
          ctaText: "Read the case study",
          ctaUrl: "/work/maison-fleur",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Mobile banking app screens showing account overview, transfers, and investment portfolio",
        label: "Fintech",
        heading: "Trust at every tap.",
        content: {
          contentHeadline: "A mobile bank built for first-generation investors",
          contentDescription:
            "Nuvem Bank needed an app that made investing approachable for users who had never owned a stock. We designed progressive disclosure flows that introduce concepts gradually, a jargon-free language system vetted by financial literacy educators, and biometric security that feels invisible. The app reached 500,000 downloads in its first quarter.",
          ctaText: "See the app design",
          ctaUrl: "/work/nuvem-bank",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Non-profit website with storytelling layout showing impact photos and donation progress bars",
        label: "Impact",
        heading: "Stories that move numbers.",
        content: {
          contentHeadline:
            "A storytelling platform that doubled donor retention",
          contentDescription:
            "Fundacao Raizes needed their website to do more than accept donations — it needed to make donors feel the impact. We built a narrative engine that pairs each contribution with a specific story: a student graduating, a well being built, a clinic opening its doors. Personalized impact dashboards and quarterly video updates keep donors engaged long after the first gift.",
          ctaText: "Explore the project",
          ctaUrl: "/work/fundacao-raizes",
        },
      },
    ],
  },
};
