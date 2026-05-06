import type { Meta, StoryObj } from "@storybook/react";
import VerticalTimelineSplit from "./index";

const meta: Meta<typeof VerticalTimelineSplit> = {
  title: "Layouts/Split/VerticalTimelineSplit",
  component: VerticalTimelineSplit,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    colorScheme: {
      control: "select",
      options: ["light", "dark"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof VerticalTimelineSplit>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Brazilian SaaS company history — light scheme */
export const SaasCompanyHistory: Story = {
  args: {
    eyebrow: "Cardoso Cloud — Track record",
    headline: "Eight years of shipping, five of them profitable",
    description:
      "We have been building billing infrastructure for Latin American SaaS since 2017. The milestones below are the ones our investors ask about — and the two we wish we had handled differently.",
    ctaText: "Read the full investor deck",
    ctaUrl: "#investor-deck",
    colorScheme: "light",
    events: [
      {
        marker: "2017",
        title: "Two engineers and a borrowed living room in Pinheiros",
        description:
          "Beatriz Salles and Davi Albuquerque ship the first prototype out of a one-bedroom apartment. The MVP is a CSV importer and a single Stripe webhook listener that runs on a Heroku free dyno.",
        metric: "MRR R$ 0",
      },
      {
        marker: "2019",
        title: "First enterprise contract — and the rewrite that paid for it",
        description:
          "A logistics company in Curitiba signs a three-year deal that requires SOC 2 Type II evidence we did not yet have. We spend nine months replacing the proof-of-concept stack with the platform we still run today.",
        metric: "ARR R$ 1.4M",
      },
      {
        marker: "2022",
        title: "Series A and the 50 hires we did not actually need",
        description:
          "We raise R$ 84M from Astella and Maya Capital. We hire too fast, ship too slowly for two quarters, and learn the lesson everyone warned us about. By Q4 we are back to a weekly release cadence.",
        metric: "47 employees",
      },
      {
        marker: "2024",
        title: "First profitable quarter without freezing the roadmap",
        description:
          "Q3 2024 closes with positive operating cash flow for the first time. We do it without freezing hiring or shelving the European expansion plan we announced in January.",
        metric: "ARR R$ 31.7M",
      },
    ],
    purpose: "story",
  },
};

/** Architecture studio portfolio milestones — dark scheme */
export const ArchitectureStudioMilestones: Story = {
  args: {
    eyebrow: "Atelie Okazaki — Selected work",
    headline: "Eleven years, fourteen completed projects, thirty-one declined",
    description:
      "We have published every project we shipped and every brief we turned down. The four below explain how the studio's posture has shifted since 2014.",
    colorScheme: "dark",
    events: [
      {
        marker: "2014 — Q3",
        title: "Casa Tabatinga — the project that almost closed the studio",
        description:
          "A 184-square-meter home in Sao Sebastiao that ran 11 months over schedule because we accepted a brief we were not ready for. The client forgave us; the bookkeeping did not.",
      },
      {
        marker: "2017 — Q2",
        title: "Galpao Itamambuca — the first warehouse retrofit",
        description:
          "Restoring a 1948 industrial building taught us we preferred adapting to building. Sixty percent of our work since 2017 has been retrofit, by deliberate choice.",
        metric: "740 sqm",
      },
      {
        marker: "2021 — Q4",
        title: "Casa Pereirao — published in revista AU and Dezeen",
        description:
          "Our first international press, and the first time a brief found us instead of the other way around. The studio's intake process has been reservation-only since.",
      },
      {
        marker: "2024 — Q1",
        title: "Escola Vila Sonia — the first municipal commission",
        description:
          "A primary school for the city of Sao Paulo, awarded after a public competition. The circular plan with no dead-end corridors is now part of the city's pedagogy RFP template.",
        metric: "47 classrooms",
      },
    ],
    purpose: "about",
  },
};

/** Logistics platform roadmap — light scheme */
export const LogisticsRoadmapReveal: Story = {
  args: {
    eyebrow: "Frete Tavares — 2026 roadmap",
    headline: "What we are shipping, and what we are deferring on purpose",
    description:
      "We publish our roadmap quarterly and revise it with every board meeting. The four cards below are committed for 2026; everything else lives in the public discussion forum.",
    ctaText: "See the public roadmap",
    ctaUrl: "#roadmap",
    colorScheme: "light",
    events: [
      {
        marker: "Q1 2026",
        title: "Driver app rewrite — Capacitor to native",
        description:
          "The current driver app is a Capacitor wrapper that started crashing on Android 14. We are rebuilding native iOS and Android in parallel, with a private beta opening to our top 100 fleets in February.",
        metric: "3,847 drivers",
      },
      {
        marker: "Q2 2026",
        title: "Real-time ETA model trained on our own delivery data",
        description:
          "We are replacing the third-party ETA API with a model trained on 1.7 million completed deliveries. The first benchmark cut average ETA error by 38% in Sao Paulo and 23% in Belo Horizonte.",
        metric: "1.7M deliveries",
      },
      {
        marker: "Q3 2026",
        title: "Fleet billing — flat-rate to per-stop with floors",
        description:
          "After two years of customer requests, we are moving from flat-rate fleet plans to a per-stop billing model with predictable monthly floors. Existing customers get 12 months at their current price.",
      },
      {
        marker: "Q4 2026",
        title: "First international pilot — Mexico City",
        description:
          "We are running a closed pilot with three logistics partners in CDMX. If the unit economics hold, the public launch slides into Q1 2027.",
      },
    ],
    purpose: "process",
  },
};

/** Pharma compliance retrospective — dark scheme, no CTA */
export const ComplianceRetrospective: Story = {
  args: {
    eyebrow: "Alvares Bio — Regulatory timeline",
    headline: "Twelve years of audits, and the four that taught us most",
    description:
      "Every entry below corresponds to a regulatory inspection by ANVISA or the FDA. We treat each one as a public test — the findings, the response, and what we changed.",
    colorScheme: "dark",
    events: [
      {
        marker: "2013 — ANVISA",
        title: "First post-licensing inspection at the Hortolandia site",
        description:
          "Eight observations, two of them critical. We corrected both critical findings within 23 days and instituted the monthly self-audit program we still run today.",
      },
      {
        marker: "2017 — FDA",
        title: "Pre-approval inspection for our first US-bound product",
        description:
          "Zero 483 observations on the manufacturing floor. The agency cited the cleanroom monitoring program — built in response to the 2013 ANVISA findings — as a model for the site.",
      },
      {
        marker: "2020 — ANVISA",
        title: "Surprise inspection during the early pandemic months",
        description:
          "Conducted entirely remote, a first for both us and the inspector. We passed without observations and donated the inspection software we built for it back to the agency as open source.",
        metric: "0 observations",
      },
      {
        marker: "2024 — FDA",
        title: "Joint inspection of the new Recife sterile fill site",
        description:
          "Three observations, all administrative. The CAPA closed in 41 days. The inspection report is published in full on our investor relations page; the agency's official summary linked beneath it.",
        metric: "3 observations",
      },
    ],
    purpose: "stats",
  },
};
