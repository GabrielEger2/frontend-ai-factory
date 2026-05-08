import type { Meta, StoryObj } from "@storybook/react";
import FeaturesIconTrio from "./index";

const meta: Meta<typeof FeaturesIconTrio> = {
  title: "Content/FeaturesIconTrio",
  component: FeaturesIconTrio,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaVariant: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof FeaturesIconTrio>;

/* ------------------------------------------------------------------ */
/*  3-item layout — editorial scaffolding (meta + stat + bullets +     */
/*  pullQuote + metrics + footnote)                                    */
/* ------------------------------------------------------------------ */

export const B2BSaas: Story = {
  args: {
    eyebrow: "Why teams ship faster on Spinel",
    headline: "Three habits that compound into a 4.2x release cadence",
    subheadline:
      "Spinel sits between your repo and your customers. Engineers stay in flow, support stops repeating itself, and product gets one place to ask the data what changed.",
    meta: [
      { label: "Window", value: "Q1 2026, 14 customers" },
      { label: "Sample", value: "38,412 builds" },
      { label: "Verified by", value: "Sentry, Datadog" },
      { label: "Last reviewed", value: "Apr 9, 2026" },
    ],
    features: [
      {
        iconName: "zap",
        stat: "47s",
        statLabel: "Median PR build",
        title: "Sub-second incremental builds",
        description:
          "Tests, types, and lint share a Bazel-style cache so the average PR ships in well under a minute. We measured 38,000 builds in March and most finished before the engineer alt-tabbed away.",
        bullets: [
          "Cache hit rate held at 91.4% across the quarter, even on monorepos > 2.1m LOC",
          "Type-check and lint run on the same warm worker, not a fresh container",
          "Failing builds surface the exact diff that broke the cache — no spelunking",
        ],
      },
      {
        iconName: "shield-check",
        stat: "SOC 2",
        statLabel: "Type II since 2024",
        title: "Audit-ready by default",
        description:
          "Every deploy carries a signed manifest, an immutable diff, and the exact reviewers it passed through. Evidence packs are one CSV export.",
        bullets: [
          "Signed provenance attached to every container image and Lambda zip",
          "Reviewer roster auto-generated per file path — no manual CODEOWNERS drift",
          "90-day retention on signed deploys is included; longer windows on Scale tier",
        ],
      },
      {
        iconName: "trending-up",
        stat: "1 screen",
        statLabel: "From ship to outcome",
        title: "Customer impact, on the same screen",
        description:
          "When a feature ships, the dashboard shows the funnel it touches and the support tickets that closed because of it. No second tool, no second login.",
        bullets: [
          "Funnel deltas attributed to a deploy with a 24-hour holdout cohort",
          "Support tags pulled from Zendesk and Front, joined by deploy SHA",
          "Read-only viewer seats are free for finance, support, and design",
        ],
      },
    ],
    pullQuote: {
      quote:
        "We replaced four dashboards and a weekly Slack ritual. The cadence number stopped being a guess.",
      attribution: "Renata Veiga",
      attributionMeta: "VP Engineering · Atlas Logistics",
    },
    metrics: [
      { value: "4.2x", label: "Release cadence vs. Q4 2025" },
      { value: "63%", label: "Drop in deploy-related tickets" },
      { value: "47s", label: "Median PR build, p50" },
      { value: "$0", label: "Read-only seats, all orgs" },
    ],
    footnote:
      "Methodology — figures aggregated across 14 design-partner orgs from Jan 6 to Mar 31, 2026. Cadence measured as merged-PR-to-prod throughput per active engineer per week. Source data exported from each org's GitHub and Datadog tenants and reviewed by Spinel's data team plus a third-party SOC 2 auditor.",
    ctaText: "Start a 14-day pilot",
    ctaUrl: "/pilot",
    ctaVariant: "default",
    ctaColorScheme: "primary",
  },
};

/* ------------------------------------------------------------------ */
/*  4-item layout — anti-slop 2-column wrap, editorial scaffolding,    */
/*  legal/consultancy tone                                             */
/* ------------------------------------------------------------------ */

export const LegalConsultancy: Story = {
  args: {
    eyebrow: "How we work",
    headline: "A boutique practice, run like a research firm",
    subheadline:
      "We take on roughly thirty mandates a year. Each one gets a senior partner from the first call to the closing memo. No analyst handoff, no rotating pod.",
    meta: [
      { label: "Founded", value: "2011, São Paulo" },
      { label: "Partners", value: "6 senior · 0 junior" },
      { label: "Mandates / year", value: "28 average" },
      { label: "Bar admissions", value: "BR · NY · UK" },
    ],
    features: [
      {
        iconName: "scale",
        stat: "0",
        statLabel: "Surprise invoices, ever",
        title: "Fixed-fee scoping",
        description:
          "Every engagement starts with a 90-minute scoping call and a written fee letter. If the matter expands, we send a revised letter, never a surprise invoice.",
        bullets: [
          "Fee letter delivered within 48 hours of the scoping call",
          "Revisions tracked against the original scope — you see what moved and why",
          "Hourly billing only when the client explicitly asks for it",
        ],
      },
      {
        iconName: "file-search",
        stat: "100%",
        statLabel: "In-house review",
        title: "Discovery handled in-house",
        description:
          "We do not farm out document review. Two of our partners spent a decade on the regulator's side, which is usually who we are reading the documents against.",
        bullets: [
          "Privileged material never leaves our managed e-discovery environment",
          "Reviewer-trail logs are exportable for any later malpractice or audit query",
          "Native-format review — no PDF flattening, no metadata loss",
        ],
      },
      {
        iconName: "gavel",
        stat: "8 : 1",
        statLabel: "Settle-to-trial ratio",
        title: "Litigation as last resort",
        description:
          "We will go to court when a client has been wronged and the other side will not move, but we do not bill our way there. Most matters resolve in mediation or pre-suit.",
        bullets: [
          "Pre-suit demand letters drafted as if they will be exhibits at trial",
          "Mediation strategy built with a litigation budget the client signs off on",
          "Trial team kept thin — partners argue, no associate-pyramid pricing",
        ],
      },
      {
        iconName: "handshake",
        stat: "24h",
        statLabel: "Reply rule",
        title: "Partner accessible by phone",
        description:
          "You get a direct line and a 24-hour reply rule. The partner who took the call is the partner who answers it. We do not paywall the senior bench behind associates.",
        bullets: [
          "Mobile number issued at engagement, not a generic switchboard",
          "Out-of-office cover is another partner, never an unfamiliar associate",
          "Quarterly check-in calls are part of the fee, not a separate retainer line",
        ],
      },
    ],
    pullQuote: {
      quote:
        "We brought them a 7-figure dispute and got a written game plan in five days. Most firms would still be onboarding our matter team.",
      attribution: "Henrique Sá",
      attributionMeta: "General Counsel · Pampa Energia BR",
    },
    footnote:
      "Settle-to-trial ratio measured across 184 matters opened between 2019 and 2025; tallied at the time of final resolution rather than original filing. Reply-rule compliance audited internally each quarter.",
    ctaText: "Book a 30-minute scoping call",
    ctaUrl: "/scope",
    ctaVariant: "drawOutline",
    ctaColorScheme: "neutral",
  },
};

/* ------------------------------------------------------------------ */
/*  6-item layout — 2x3 wrap on lg+, eco/impact tone, with metrics     */
/*  band but no pull-quote (proves the layout works with partial       */
/*  scaffolding)                                                       */
/* ------------------------------------------------------------------ */

export const EcoBrand: Story = {
  args: {
    eyebrow: "Where the price tag goes",
    headline: "Six ways your order shows up in the field",
    subheadline:
      "Every Reverb piece carries a roughly 11% margin earmarked for the supply chain we built it on. This is what that 11% actually paid for last quarter.",
    meta: [
      { label: "Window", value: "Q1 2026" },
      { label: "Verified by", value: "Fair Wear Foundation" },
      { label: "Pieces shipped", value: "21,440" },
      { label: "Report cycle", value: "Quarterly, public" },
    ],
    features: [
      {
        iconName: "tree-pine",
        stat: "1,374",
        statLabel: "Saplings planted",
        title: "Atlantic Forest replanting",
        description:
          "Replanted across two reforestation cooperatives in the Atlantic Forest corridor, a region that has lost 88% of its original cover. Tracked by GPS and surveyed in February.",
      },
      {
        iconName: "recycle",
        stat: "62%",
        statLabel: "Post-consumer fiber",
        title: "Closed-loop fabric",
        description:
          "The cotton in your tee was someone's t-shirt last year. The polyester used to be a water bottle. We publish the exact mill ratios on every product page.",
      },
      {
        iconName: "sprout",
        stat: "18 t",
        statLabel: "Pre-bought at +40%",
        title: "Regenerative-cotton pilot",
        description:
          "We pre-bought 18 tons of cotton at a 40% premium from a co-op transitioning to regenerative practice. They keep the price floor for three growing seasons regardless of yield.",
      },
      {
        iconName: "leaf",
        stat: "3",
        statLabel: "Dye-house projects",
        title: "Carbon insetting, not offsetting",
        description:
          "Instead of buying credits, we fund efficiency projects inside our own dye houses. Last year that meant solar boilers in two facilities and a heat-recovery loop in a third.",
      },
      {
        iconName: "shield-check",
        stat: "1.7×",
        statLabel: "Local minimum",
        title: "Living-wage audited",
        description:
          "Our cut-and-sew partners pay 1.7x the local minimum on average, audited by Fair Wear Foundation. The audit reports go on the site three days after we receive them.",
      },
      {
        iconName: "feather",
        stat: "941",
        statLabel: "Garments mended",
        title: "Repaired, not replaced",
        description:
          "Send a worn piece back and we will mend it for free for three years. Last quarter we patched 941 garments. The repair queue is faster than most retailers' returns desk.",
      },
    ],
    metrics: [
      { value: "11%", label: "Of every order ringed for the chain" },
      { value: "1,374", label: "Native saplings planted Q1" },
      { value: "1.7×", label: "Living-wage multiplier, audited" },
      { value: "3 yrs", label: "Free repair window per garment" },
    ],
    footnote:
      "All figures verified by Fair Wear Foundation's Q1 2026 audit cycle. Sapling counts cross-checked against GPS plot data from the SOS Mata Atlântica nursery network.",
    ctaText: "Read the impact report",
    ctaUrl: "/impact",
    ctaVariant: "slide",
    ctaColorScheme: "secondary",
  },
};

/* ------------------------------------------------------------------ */
/*  3-item, no eyebrow, glow CTA — fintech tone, lighter scaffolding   */
/*  (description-led, no stat, no metrics) to prove the slim mode      */
/* ------------------------------------------------------------------ */

export const FintechApp: Story = {
  args: {
    headline: "Move money the way your operations team actually works",
    subheadline:
      "Quill is a treasury layer for finance teams that have outgrown a spreadsheet but cannot justify a full ERP rollout. Built on top of your existing banks.",
    features: [
      {
        iconName: "wallet",
        title: "Multi-bank, single ledger",
        description:
          "Connect every operating account, line of credit, and payment processor in one ledger. Reconcile 28 institutions in the time it used to take to log in to two.",
        bullets: [
          "Pre-built connectors for the 14 largest US and BR banks",
          "OFX / MT940 / CSV fallback for any bank not on the list",
          "Reconciliation runs continuously, not as a nightly batch",
        ],
      },
      {
        iconName: "lock",
        title: "Approval rules that match your org chart",
        description:
          "Set policy by amount, currency, vendor, and entity. Above $50K runs a two-controller rule and pings the CFO, but a $1,200 supplier ACH clears in 14 seconds.",
        bullets: [
          "Policy-as-code editor with live preview against the last 90 days of payments",
          "Out-of-band approvals via SMS or push, with WebAuthn confirmation",
          "Full audit trail per payment, exportable as a signed PDF",
        ],
      },
      {
        iconName: "bar-chart",
        title: "Cash forecast that updates hourly",
        description:
          "Pulls invoice timing from your AR system and payroll cadence from your HRIS, not last quarter's plan. The 13-week forecast is right within 2.4% on average.",
        bullets: [
          "Native NetSuite, Xero, and Conta Azul ingestion — no middleware",
          "Scenario branching for hiring plans, financing rounds, churn shocks",
          "Slack and email digests sent only when forecast moves > 1.5%",
        ],
      },
    ],
    footnote:
      "Forecast accuracy measured against actuals at the close of each weekly window across 41 customer tenants between Sep 2025 and Mar 2026; weighted by run-rate revenue. Median absolute error 2.4%, 90th percentile 4.7%.",
    ctaText: "See how Quill connects",
    ctaUrl: "/connect",
    ctaVariant: "glow",
    ctaColorScheme: "accent",
  },
};

/* ------------------------------------------------------------------ */
/*  5-item layout, no CTA — agency portfolio, with pullQuote close     */
/* ------------------------------------------------------------------ */

export const AgencyPortfolio: Story = {
  args: {
    eyebrow: "How a project runs at Foundry & Field",
    headline: "Five disciplines, one room, every week",
    subheadline:
      "Our project rooms run 90 minutes on Tuesday morning. The same five disciplines join from kickoff to handoff so context stops dying between handovers.",
    meta: [
      { label: "Cadence", value: "Tuesdays, 90 min" },
      { label: "Studio", value: "São Paulo · NYC" },
      { label: "Engagements / yr", value: "11 to 14" },
      { label: "Min team size", value: "5 disciplines" },
    ],
    features: [
      {
        iconName: "compass",
        stat: "Day 0–10",
        statLabel: "Owns the bet",
        title: "Strategy",
        description:
          "Defines the question we are answering and the bet we are making. Owns the first 10 days and the final pitch back to the client's board.",
      },
      {
        iconName: "palette",
        stat: "K → L",
        statLabel: "Kickoff to launch",
        title: "Brand & art direction",
        description:
          "Sets the visual range and the rules. Stays in the room through engineering so the polish that survives the build is the polish we promised.",
      },
      {
        iconName: "pen-tool",
        stat: "1 file",
        statLabel: "Copy + flow",
        title: "Product design",
        description:
          "Ships the flows in production-grade Figma. We write copy in the same file because the product and the words are the same product.",
      },
      {
        iconName: "code",
        stat: "Your stack",
        statLabel: "Not ours",
        title: "Engineering",
        description:
          "Builds in the client's stack, not ours. We have shipped on Next.js, Rails, Django, and Phoenix in the last 18 months. Bring your repo.",
      },
      {
        iconName: "gauge",
        stat: "Day 1",
        statLabel: "Analytics live",
        title: "Measurement",
        description:
          "Owns the analytics plan from day one. The launch ships with a dashboard that the client's CEO can read without being walked through it.",
      },
    ],
    pullQuote: {
      quote:
        "The same five faces showed up every Tuesday for fourteen weeks. Nothing fell off the table because there was no one new to brief.",
      attribution: "Lúcia Bessa",
      attributionMeta: "Chief of Staff · Banco Norte",
    },
  },
};
