import type { Meta, StoryObj } from "@storybook/react";
import FeaturesParallaxContent from "./index";

const meta: Meta<typeof FeaturesParallaxContent> = {
  title: "Layouts/FeaturesParallaxContent",
  component: FeaturesParallaxContent,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    ctaStyle: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    imagePadding: {
      control: { type: "range", min: 0, max: 32, step: 4 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof FeaturesParallaxContent>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Creative agency — large cinematic images with editorial content, slide CTA */
export const CreativeAgency: Story = {
  args: {
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    sections: [
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Team brainstorming around a whiteboard covered in sticky notes and wireframes",
        label: "Collaborate",
        heading: "Built for all of us.",
        content: {
          contentHeadline:
            "Strategy sessions that turn ambiguity into clear direction",
          contentDescription:
            "We bring designers, developers, and stakeholders into the same room from day one. Our collaborative workshops surface the real problems worth solving, align everyone on priorities, and produce actionable roadmaps — not 80-page decks that collect dust.",
          ctaText: "See our process",
          ctaUrl: "/process",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Designer reviewing color palettes and typography samples on a wide monitor",
        label: "Quality",
        heading: "Never compromise.",
        content: {
          contentHeadline:
            "Pixel-perfect craft from concept through production",
          contentDescription:
            "Every font pairing, color decision, and micro-interaction is deliberate. We obsess over the details that most people feel but cannot name — the spacing that makes a layout breathe, the easing curve that makes a transition feel natural, the contrast ratio that keeps text readable in sunlight.",
          ctaText: "View our work",
          ctaUrl: "/portfolio",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Modern open-plan office with exposed brick walls and large monitors showing design software",
        label: "Modern",
        heading: "Dress for the best.",
        content: {
          contentHeadline: "Technology choices that age gracefully",
          contentDescription:
            "We build on proven foundations — React, TypeScript, serverless infrastructure — and avoid chasing hype. The result is software that runs fast today and remains maintainable three years from now when your team has tripled in size.",
          ctaText: "Explore our stack",
          ctaUrl: "/technology",
        },
      },
    ],
  },
};

/** Architecture firm — dramatic building photography, drawOutline CTA */
export const ArchitectureFirm: Story = {
  args: {
    ctaStyle: "drawOutline",
    ctaColorScheme: "accent",
    imagePadding: 0,
    sections: [
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Aerial view of a contemporary glass skyscraper reflecting clouds at sunset",
        label: "Vision",
        heading: "Shaping skylines.",
        content: {
          contentHeadline: "Designs that redefine the way cities breathe",
          contentDescription:
            "Our towers are not just tall — they channel natural ventilation, harvest rainwater, and generate solar energy. Each project begins with a deep study of wind patterns, sun angles, and pedestrian flow to create buildings that give back more than they take.",
          ctaText: "See our towers",
          ctaUrl: "/projects/commercial",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Interior of a minimalist residential space with floor-to-ceiling windows overlooking a forest",
        label: "Craft",
        heading: "Where light lives.",
        content: {
          contentHeadline: "Residential spaces designed around natural light",
          contentDescription:
            "Every home we design starts with a solar study. Window placement, ceiling height, and material reflectivity are calibrated so that living rooms glow at golden hour and bedrooms stay cool through summer afternoons. The result is architecture you feel before you understand it.",
          ctaText: "Explore residences",
          ctaUrl: "/projects/residential",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Landscape architecture with winding pathways through native gardens and sculptural water features",
        label: "Nature",
        heading: "Ground we share.",
        content: {
          contentHeadline:
            "Public spaces that reconnect communities with the land",
          contentDescription:
            "Parks, plazas, and waterfronts that honor the ecology beneath them. We work with landscape ecologists and local communities to design spaces where native plants thrive, stormwater is managed naturally, and neighbors have a reason to linger.",
          ctaText: "View public works",
          ctaUrl: "/projects/public",
        },
      },
    ],
  },
};

/** SaaS product — feature-focused content with glow CTA, four sections */
export const SaasProduct: Story = {
  args: {
    ctaStyle: "glow",
    ctaColorScheme: "primary",
    sections: [
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Dashboard interface showing real-time analytics graphs and team performance metrics",
        label: "Analytics",
        heading: "Data that drives decisions.",
        content: {
          contentHeadline:
            "Custom dashboards built for the metrics you care about",
          contentDescription:
            "Stop drowning in vanity metrics. Our analytics engine surfaces the numbers that actually move revenue — conversion rates by channel, cohort retention curves, and predictive lifetime value scores. Set up alerts for anomalies and get Slack notifications before small dips become big problems.",
          ctaText: "Try analytics free",
          ctaUrl: "/features/analytics",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Team members collaborating in a video call with shared document editing visible on screen",
        label: "Collaboration",
        heading: "Work together, anywhere.",
        content: {
          contentHeadline:
            "Real-time editing with presence awareness across time zones",
          contentDescription:
            "See who is typing, where their cursor is, and what they changed — all without saving. Our conflict resolution engine handles simultaneous edits gracefully so distributed teams can work on the same document without stepping on each other. Works offline too.",
          ctaText: "See collaboration in action",
          ctaUrl: "/features/collaboration",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Security operations center with monitors displaying network activity and threat detection alerts",
        label: "Security",
        heading: "Trust is earned.",
        content: {
          contentHeadline:
            "Enterprise-grade security without enterprise-grade complexity",
          contentDescription:
            "SOC 2 Type II certified, end-to-end encrypted, and independently pen-tested every quarter. Role-based access controls, audit logs, and SSO with SAML 2.0 come standard on every plan. Your data never leaves your chosen region.",
          ctaText: "Read our security whitepaper",
          ctaUrl: "/security",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Developer terminal showing API documentation alongside a code editor with integration examples",
        label: "Integrations",
        heading: "Connects to everything.",
        content: {
          contentHeadline:
            "200+ pre-built connectors and a developer-first API",
          contentDescription:
            "Salesforce, HubSpot, Slack, Jira, Notion — connect in two clicks. For custom workflows, our REST and GraphQL APIs are documented with runnable examples, SDKs in six languages, and webhook support for real-time event streaming.",
          ctaText: "Browse integrations",
          ctaUrl: "/integrations",
        },
      },
    ],
  },
};

/** Travel brand — immersive destination photography, dotExpand CTA, edge-to-edge images */
export const TravelDestinations: Story = {
  args: {
    ctaStyle: "dotExpand",
    ctaColorScheme: "secondary",
    imagePadding: 0,
    sections: [
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Turquoise ocean water viewed from a cliff edge with tropical vegetation in the foreground",
        label: "Discover",
        heading: "Oceans that heal.",
        content: {
          contentHeadline: "Coastal retreats curated for restoration",
          contentDescription:
            "Salt air, warm sand, and absolutely nothing on the agenda. Our oceanfront properties are chosen for seclusion, water quality, and proximity to marine preserves. Wake up to the sound of waves and end the day watching bioluminescent plankton light up the shore.",
          ctaText: "Explore coastal retreats",
          ctaUrl: "/destinations/coastal",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Snow-capped mountain range at sunrise with golden light hitting the peaks and a valley below",
        label: "Elevate",
        heading: "Peaks worth reaching.",
        content: {
          contentHeadline: "Mountain lodges where altitude meets attitude",
          contentDescription:
            "Hand-picked chalets and lodges above 2,000 meters with access to guided treks, alpine climbing, and thermal springs. Every property sits within a 30-minute drive of trails rated from beginner to expert, and our concierge team handles gear, permits, and emergency planning.",
          ctaText: "Browse mountain lodges",
          ctaUrl: "/destinations/mountains",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Narrow European cobblestone street with cafe terraces, hanging flowers, and warm evening light",
        label: "Wander",
        heading: "Streets that tell stories.",
        content: {
          contentHeadline:
            "City experiences designed by locals, not guidebooks",
          contentDescription:
            "Skip the tourist traps. Our city guides are written by residents who know which bakery opens at 5 AM, which bookshop hosts poetry readings on Thursdays, and which rooftop has the best view of the old town at sunset. Every itinerary is walkable and customizable.",
          ctaText: "Discover city guides",
          ctaUrl: "/destinations/cities",
        },
      },
    ],
  },
};

/** Fitness brand — high energy content, two sections only, default CTA */
export const FitnessStudio: Story = {
  args: {
    ctaStyle: "default",
    ctaColorScheme: "accent",
    sections: [
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Athletes training in a modern gym with dramatic overhead lighting and mirrored walls",
        label: "Train",
        heading: "Push past limits.",
        content: {
          contentHeadline: "Programs designed for results, not routines",
          contentDescription:
            "Our coaches build progressive training plans that adapt to your recovery, schedule, and equipment. Whether you train at 5 AM or midnight, at home or in a commercial gym, the program meets you where you are and pushes you further than you thought possible.",
          ctaText: "Start your plan",
          ctaUrl: "/programs",
        },
      },
      {
        image: "https://placehold.co/1920x1080",
        imageAlt:
          "Person meditating in a sunlit yoga studio with plants and natural wood flooring",
        label: "Recover",
        heading: "Rest is training.",
        content: {
          contentHeadline: "Recovery protocols backed by sports science",
          contentDescription:
            "Sleep tracking, HRV monitoring, guided mobility sessions, and nutrition timing — all integrated into one app. Our recovery engine tells you when to push hard and when to take it easy, so you make progress every week without burning out.",
          ctaText: "Explore recovery tools",
          ctaUrl: "/recovery",
        },
      },
    ],
  },
};
