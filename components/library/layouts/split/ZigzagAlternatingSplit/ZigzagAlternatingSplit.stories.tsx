import type { Meta, StoryObj } from "@storybook/react";
import ZigzagAlternatingSplit from "./index";

const meta: Meta<typeof ZigzagAlternatingSplit> = {
  title: "Layouts/Split/ZigzagAlternatingSplit",
  component: ZigzagAlternatingSplit,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    firstSide: {
      control: "select",
      options: ["left", "right"],
    },
    colorScheme: {
      control: "select",
      options: ["light", "dark"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof ZigzagAlternatingSplit>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Specialty coffee roastery — three-step sourcing and roasting process */
export const SpecialtyCoffeeRoastery: Story = {
  args: {
    eyebrow: "Cafe Pereirao — Origin to cup",
    headline:
      "Three months of work for the eight minutes you spend drinking it",
    intro:
      "Every lot we roast starts with a relationship that predates the harvest. Here is how a bag of Cafe Pereirao gets to your bench grinder.",
    firstSide: "left",
    colorScheme: "light",
    sections: [
      {
        eyebrow: "01 — At the farm",
        heading: "We taste the parchment before it leaves Sul de Minas",
        description:
          "Twice a year our green buyer Beatriz Salles flies to the four cooperatives we source from. She cups every microlot on site and pays an average premium of 47.2% above the Cecafe reference price for the lots that score above 86.",
        bullets: [
          "4 cooperative partners across Sul de Minas",
          "Average 47.2% premium above Cecafe reference",
          "On-site cupping before shipment",
        ],
        image: "https://picsum.photos/seed/coffee-farm/720/540",
        imageAlt:
          "Coffee farmer rinsing freshly washed parchment in a Sul de Minas patio",
      },
      {
        eyebrow: "02 — In the roastery",
        heading: "A 12-kilo Loring that hates being in a hurry",
        description:
          "Our head roaster Davi Albuquerque profiles every new lot across nine test roasts before committing to a production curve. Each batch is logged in Cropster, and we publish the roast graph for every bag we sell.",
        bullets: [
          "Loring S15 12kg roaster",
          "9 test roasts per new microlot",
          "Public Cropster profiles for every release",
        ],
        image: "https://picsum.photos/seed/coffee-roastery/720/540",
        imageAlt:
          "Roaster monitoring bean temperature on a Loring drum roaster screen",
      },
      {
        eyebrow: "03 — At your door",
        heading: "Roasted Tuesday, on your bench by Friday",
        description:
          "We ship within 48 hours of roast, valve-bagged and nitrogen-flushed. The roast date is printed on the seam of every bag — never a 'best by' fiction.",
        bullets: [
          "48-hour ship window post-roast",
          "Roast date on the seam, no euphemisms",
          "Free shipping over R$ 180 — 3,847 deliveries last month",
        ],
        ctaText: "Subscribe to the rotation",
        ctaUrl: "#subscribe",
        image: "https://picsum.photos/seed/coffee-shipping/720/540",
        imageAlt:
          "Branded coffee bags being sealed at a small-batch packing station",
      },
    ],
    purpose: "process",
  },
};

/** Brazilian fintech — feature tour, dark mode, image starts on right */
export const FintechFeatureTour: Story = {
  args: {
    eyebrow: "Conta Tavares — How it works",
    headline: "A current account that finally stops waiting on the bank",
    intro:
      "Three things our 184,000 active users do every week that the legacy banks still gate behind a phone call.",
    firstSide: "right",
    colorScheme: "dark",
    sections: [
      {
        eyebrow: "Instant Pix limits",
        heading: "Raise your daily limit in the time it takes to read this",
        description:
          "Selfie, document, and a 30-second video. Most limit increases are approved in under 90 seconds — including overnight, weekends, and the 24th of December.",
        image: "https://picsum.photos/seed/fintech-pix/720/540",
        imageAlt:
          "User raising their Pix limit in a mobile app with a confirmation screen visible",
      },
      {
        eyebrow: "Programmable savings",
        heading: "Round-ups, schedules, and goals that actually pay CDI+1%",
        description:
          "Set a savings rule once and forget it. Every Pix you send gets rounded up, every paycheck triggers a transfer, every bonus auto-splits across your goals. Your money earns 101% of CDI from day one — no minimum, no lockup.",
        image: "https://picsum.photos/seed/fintech-savings/720/540",
        imageAlt:
          "Mobile app screen showing automated savings goals with progress bars",
      },
      {
        eyebrow: "Family accounts",
        heading: "Up to 4 cards on one account, with limits you control",
        description:
          "Share a single account with your partner, your teenager, or your parents. Issue a virtual card with a daily limit, freeze it from the home screen, and see every transaction in a unified feed.",
        ctaText: "Open a Conta Tavares",
        ctaUrl: "#signup",
        image: "https://picsum.photos/seed/fintech-family/720/540",
        imageAlt:
          "Family reviewing shared account transactions on a tablet at the kitchen table",
      },
    ],
    purpose: "features",
  },
};

/** Architecture firm — narrative chapters, image left first, light scheme */
export const ArchitectureNarrative: Story = {
  args: {
    headline: "Three projects that taught us how to refuse a brief",
    intro:
      "Atelie Okazaki has turned down 31 commissions in the last six years. These three projects explain why.",
    firstSide: "left",
    colorScheme: "light",
    sections: [
      {
        eyebrow: "Casa Itamambuca — 2019",
        heading: "The house that decided where its own walls went",
        description:
          "A 312-square-meter residence on a sloped lot near Ubatuba where the brief was 'a beach house with as little climate control as possible.' We oriented the great room to a cross-breeze the client had never noticed and ended up specifying zero air conditioning units.",
        image: "https://picsum.photos/seed/arch-casa-itamambuca/720/540",
        imageAlt:
          "Open-plan beach house interior with cross-ventilation through wooden screens",
      },
      {
        eyebrow: "Galpao Tabatinga — 2021",
        heading: "Reusing a 1948 warehouse that wasn't supposed to survive",
        description:
          "A photography studio commissioned a teardown. We talked them into a structural retrofit instead. The original sawtooth roof now lights the entire 740-square-meter studio without a single artificial fixture during daylight hours.",
        bullets: [
          "Original 1948 sawtooth roof preserved",
          "740 sqm of usable studio floor",
          "Zero daytime artificial lighting",
        ],
        image: "https://picsum.photos/seed/arch-galpao/720/540",
        imageAlt:
          "Restored mid-century warehouse with sawtooth skylights and exposed brick",
      },
      {
        eyebrow: "Escola Vila Sonia — 2024",
        heading:
          "A municipal school built around how 7-year-olds actually move",
        description:
          "We spent two weeks watching recess at three existing schools before drawing a single line. The result is a circular plan with no dead-end corridors, a feature the city's pedagogy team had never asked for and now writes into every new RFP.",
        ctaText: "Read the project journal",
        ctaUrl: "#projects",
        image: "https://picsum.photos/seed/arch-escola/720/540",
        imageAlt:
          "Children running through the circular courtyard of a contemporary public school",
      },
    ],
    purpose: "story",
  },
};

/** SaaS onboarding — service offerings, dark scheme */
export const SaasOnboardingServices: Story = {
  args: {
    eyebrow: "Cardoso Cloud — Implementation tracks",
    headline: "Pick the path that matches the team you actually have",
    firstSide: "right",
    colorScheme: "dark",
    sections: [
      {
        eyebrow: "Self-serve",
        heading: "Live in a Tuesday afternoon",
        description:
          "Connect your Stripe and your Postgres, accept three default policies, and you are billing customers by 5 p.m. We have onboarded 1,284 self-serve teams this year — median time to first invoice is 4 hours and 12 minutes.",
        bullets: [
          "1,284 self-serve onboardings this year",
          "Median 4h 12min to first invoice",
          "No credit card for the first 30 days",
        ],
        image: "https://picsum.photos/seed/saas-selfserve/720/540",
        imageAlt:
          "Developer reviewing the self-serve setup checklist in a dashboard",
      },
      {
        eyebrow: "Guided",
        heading: "A solutions engineer on Slack for two weeks",
        description:
          "Bianca, Rafael, or Mariana — one of three solutions engineers shows up in your Slack the day you sign, helps you import customers, and stays until your first month-end close. Then they leave.",
        image: "https://picsum.photos/seed/saas-guided/720/540",
        imageAlt:
          "Solutions engineer pair-programming with a customer engineer in Slack huddle",
      },
      {
        eyebrow: "Migration",
        heading: "We rewrite your billing logic so you do not have to",
        description:
          "If you are coming from Recurly, Chargebee, or a homegrown system, our migration team handles the schema mapping, the proration math, and the legacy webhook compatibility shim. Twelve migrations completed this year, average duration 23 days.",
        ctaText: "Talk to the migration team",
        ctaUrl: "#migration",
        image: "https://picsum.photos/seed/saas-migration/720/540",
        imageAlt:
          "Migration engineers reviewing a billing schema mapping on a wall-mounted monitor",
      },
    ],
    purpose: "services",
  },
};
