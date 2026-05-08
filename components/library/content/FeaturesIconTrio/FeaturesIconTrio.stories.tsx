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
/*  3-item layout (proves the standard 3-column row)                   */
/* ------------------------------------------------------------------ */

export const B2BSaas: Story = {
  args: {
    eyebrow: "Why teams ship faster on Spinel",
    headline: "Three habits that compound into a 4.2x release cadence",
    subheadline:
      "Spinel sits between your repo and your customers. Engineers stay in flow, support stops repeating itself, and product gets one place to ask the data what changed.",
    features: [
      {
        iconName: "zap",
        title: "Sub-second incremental builds",
        description:
          "Tests, types, and lint share a Bazel-style cache so the average PR ships in 47 seconds. We measured 38,000 builds in March and 92% finished before the engineer alt-tabbed away.",
      },
      {
        iconName: "shield-check",
        title: "Audit-ready by default",
        description:
          "Every deploy carries a signed manifest, an immutable diff, and the exact reviewers it passed through. SOC 2 evidence is one CSV export.",
      },
      {
        iconName: "trending-up",
        title: "Customer impact, on the same screen",
        description:
          "When a feature ships, the dashboard shows the funnel it touches and the support tickets that closed because of it. No second tool, no second login.",
      },
    ],
    ctaText: "Start a 14-day pilot",
    ctaUrl: "/pilot",
    ctaVariant: "default",
    ctaColorScheme: "primary",
  },
};

/* ------------------------------------------------------------------ */
/*  4-item layout (proves the anti-slop 2-column wrap, not 4-across)   */
/* ------------------------------------------------------------------ */

export const LegalConsultancy: Story = {
  args: {
    eyebrow: "How we work",
    headline: "A boutique practice, run like a research firm",
    subheadline:
      "We take on roughly thirty mandates a year. Each one gets a senior partner from the first call to the closing memo. No analyst handoff, no rotating pod.",
    features: [
      {
        iconName: "scale",
        title: "Fixed-fee scoping",
        description:
          "Every engagement starts with a 90-minute scoping call and a written fee letter. If the matter expands, we send a revised letter, never a surprise invoice.",
      },
      {
        iconName: "file-search",
        title: "Discovery handled in-house",
        description:
          "We do not farm out document review. Two of our partners spent a decade on the regulator's side, which is usually who we are reading the documents against.",
      },
      {
        iconName: "gavel",
        title: "Litigation as last resort",
        description:
          "Our settle-to-trial ratio runs about 8 to 1. We will go to court when a client has been wronged and the other side will not move, but we do not bill our way there.",
      },
      {
        iconName: "handshake",
        title: "Partner accessible by phone",
        description:
          "You get a direct line and a 24-hour reply rule. The partner who took the call is the partner who answers it. We do not paywall the senior bench behind associates.",
      },
    ],
    ctaText: "Book a 30-minute scoping call",
    ctaUrl: "/scope",
    ctaVariant: "drawOutline",
    ctaColorScheme: "neutral",
  },
};

/* ------------------------------------------------------------------ */
/*  6-item layout (proves the 2x3 wrap on lg+)                         */
/* ------------------------------------------------------------------ */

export const EcoBrand: Story = {
  args: {
    eyebrow: "Where the price tag goes",
    headline: "Six ways your order shows up in the field",
    subheadline:
      "Every Reverb piece carries a roughly 11% margin earmarked for the supply chain we built it on. This is what that 11% actually paid for last quarter.",
    features: [
      {
        iconName: "tree-pine",
        title: "1,374 native saplings planted",
        description:
          "Replanted across two reforestation cooperatives in the Atlantic Forest corridor, a region that has lost 88% of its original cover. Tracked by GPS and surveyed in February.",
      },
      {
        iconName: "recycle",
        title: "62% post-consumer fiber",
        description:
          "The cotton in your tee was someone's t-shirt last year. The polyester used to be a water bottle. We publish the exact mill ratios on every product page.",
      },
      {
        iconName: "sprout",
        title: "Regenerative-cotton pilot",
        description:
          "We pre-bought 18 tons of cotton at a 40% premium from a co-op transitioning to regenerative practice. They keep the price floor for three growing seasons regardless of yield.",
      },
      {
        iconName: "leaf",
        title: "Carbon insetting, not offsetting",
        description:
          "Instead of buying credits, we fund efficiency projects inside our own dye houses. Last year that meant solar boilers in two facilities and a heat-recovery loop in a third.",
      },
      {
        iconName: "shield-check",
        title: "Living-wage audited",
        description:
          "Our cut-and-sew partners pay 1.7x the local minimum on average, audited by Fair Wear Foundation. The audit reports go on the site three days after we receive them.",
      },
      {
        iconName: "feather",
        title: "Repaired, not replaced",
        description:
          "Send a worn piece back and we will mend it for free for three years. Last quarter we patched 941 garments. The repair queue is faster than most retailers' returns desk.",
      },
    ],
    ctaText: "Read the impact report",
    ctaUrl: "/impact",
    ctaVariant: "slide",
    ctaColorScheme: "secondary",
  },
};

/* ------------------------------------------------------------------ */
/*  3-item, no eyebrow, glow CTA — fintech tone                        */
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
      },
      {
        iconName: "lock",
        title: "Approval rules that match your org chart",
        description:
          "Set policy by amount, currency, vendor, and entity. Above $50K runs a two-controller rule and pings the CFO, but a $1,200 supplier ACH clears in 14 seconds.",
      },
      {
        iconName: "bar-chart",
        title: "Cash forecast that updates hourly",
        description:
          "Pulls invoice timing from your AR system and payroll cadence from your HRIS, not last quarter's plan. The 13-week forecast is right within 2.4% on average.",
      },
    ],
    ctaText: "See how Quill connects",
    ctaUrl: "/connect",
    ctaVariant: "glow",
    ctaColorScheme: "accent",
  },
};

/* ------------------------------------------------------------------ */
/*  5-item layout, no CTA — agency portfolio                           */
/* ------------------------------------------------------------------ */

export const AgencyPortfolio: Story = {
  args: {
    eyebrow: "How a project runs at Foundry & Field",
    headline: "Five disciplines, one room, every week",
    subheadline:
      "Our project rooms run 90 minutes on Tuesday morning. The same five disciplines join from kickoff to handoff so context stops dying between handovers.",
    features: [
      {
        iconName: "compass",
        title: "Strategy",
        description:
          "Defines the question we are answering and the bet we are making. Owns the first 10 days and the final pitch back to the client's board.",
      },
      {
        iconName: "palette",
        title: "Brand & art direction",
        description:
          "Sets the visual range and the rules. Stays in the room through engineering so the polish that survives the build is the polish we promised.",
      },
      {
        iconName: "pen-tool",
        title: "Product design",
        description:
          "Ships the flows in production-grade Figma. We write copy in the same file because the product and the words are the same product.",
      },
      {
        iconName: "code",
        title: "Engineering",
        description:
          "Builds in the client's stack, not ours. We have shipped on Next.js, Rails, Django, and Phoenix in the last 18 months. Bring your repo.",
      },
      {
        iconName: "gauge",
        title: "Measurement",
        description:
          "Owns the analytics plan from day one. The launch ships with a dashboard that the client's CEO can read without being walked through it.",
      },
    ],
  },
};
