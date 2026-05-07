import type { Meta, StoryObj } from "@storybook/react";
import ComparisonSplit from "./index";

const meta: Meta<typeof ComparisonSplit> = {
  title: "Content/ComparisonSplit",
  component: ComparisonSplit,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaStyle: {
      control: "select",
      options: [
        "default",
        "slide",
        "dotExpand",
        "drawOutline",
        "glow",
        "arrow",
      ],
    },
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    colorScheme: {
      control: "select",
      options: ["light", "dark"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof ComparisonSplit>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Web agency before/after redesign — concrete metric deltas, slide CTA */
export const BeforeAfterAgency: Story = {
  args: {
    eyebrow: "Atelier Norte · Case study #14",
    headline: "What changes when a six-year-old site is rebuilt from scratch",
    description:
      "Numbers from the first ninety days after relaunching the e-commerce front of a regional outdoor-gear retailer. Same products, same catalog, same paid media spend.",
    optionALabel: "Before redesign",
    optionASubtext: "Live for 6 years · Magento 2.3",
    optionBLabel: "After redesign",
    optionBSubtext: "Live since Jan · Next.js 15",
    features: [
      { label: "Bounce rate", optionA: "62%", optionB: "21%" },
      { label: "Mobile load time (LCP)", optionA: "4.8s", optionB: "1.1s" },
      { label: "Checkout completion rate", optionA: "1.4%", optionB: "3.9%" },
      { label: "Lighthouse performance", optionA: "31", optionB: "97" },
      { label: "WCAG 2.2 AA compliance", optionA: false, optionB: true },
      { label: "Server-rendered SEO pages", optionA: false, optionB: true },
    ],
    ctaText: "See the full case study",
    ctaUrl: "/case-studies/atelier-norte",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    colorScheme: "light",
    purpose: "comparison",
  },
};

/** SaaS DIY vs done-for-you — onboarding pain → managed service, dotExpand CTA */
export const DiyVsService: Story = {
  args: {
    eyebrow: "Two ways to launch with Praiola",
    headline: "Hands-on or hands-off — both ship the same product",
    description:
      "Most teams pick the managed launch when they're under deadline pressure or short on a senior front-end. The DIY path stays free forever.",
    optionALabel: "DIY",
    optionASubtext: "You drive · Free plan",
    optionBLabel: "Done for you",
    optionBSubtext: "We drive · One-time fee",
    features: [
      { label: "Setup time", optionA: "8+ hours", optionB: "30 minutes" },
      { label: "Templates included", optionA: false, optionB: true },
      { label: "Domain configured for you", optionA: false, optionB: true },
      { label: "Brand kit imported", optionA: false, optionB: true },
      { label: "First-month analytics review", optionA: false, optionB: true },
      {
        label: "Email migration",
        optionA: "Self-service docs",
        optionB: "Handled in onboarding",
      },
    ],
    ctaText: "Book a managed launch",
    ctaUrl: "/managed-launch",
    ctaStyle: "dotExpand",
    ctaColorScheme: "primary",
    colorScheme: "light",
    purpose: "comparison",
  },
};

/** Free vs Pro pricing comparison — minimal style, glow CTA */
export const FreemiumVsPro: Story = {
  args: {
    eyebrow: "Plan comparison",
    headline: "Start free. Upgrade when your audience does.",
    description:
      "Both tiers ship every feature on the public roadmap. Pro removes the volume caps and unlocks team controls.",
    optionALabel: "Free",
    optionASubtext: "Forever · No card",
    optionBLabel: "Pro",
    optionBSubtext: "$29 / editor / month",
    features: [
      { label: "AI generations / month", optionA: "10", optionB: "Unlimited" },
      { label: "Custom branding", optionA: false, optionB: true },
      { label: "Team workspaces", optionA: "1 seat", optionB: "Up to 25" },
      { label: "Priority support", optionA: false, optionB: true },
      { label: "SSO and SCIM", optionA: false, optionB: true },
      { label: "Audit log retention", optionA: "7 days", optionB: "12 months" },
    ],
    ctaText: "Compare every Pro feature",
    ctaUrl: "/pricing/pro",
    ctaStyle: "glow",
    ctaColorScheme: "accent",
    colorScheme: "light",
    purpose: "comparison",
  },
};

/** Brand vs competitor — head-to-head positioning, drawOutline CTA, dark mode */
export const CompetitorBattle: Story = {
  args: {
    eyebrow: "Switching from another tool?",
    headline: "How Praiola stacks up against the legacy seat-license vendors",
    description:
      "Pulled from a public comparison maintained by the team — last updated this week. Spot something off? Send a correction and we'll fix it the same day.",
    optionALabel: "Other tools",
    optionASubtext: "Average of top 3 competitors",
    optionBLabel: "Praiola",
    optionBSubtext: "Independent · Brazil-based",
    features: [
      { label: "Predictable pricing", optionA: false, optionB: true },
      { label: "Open API access", optionA: false, optionB: true },
      {
        label: "Implementation timeline",
        optionA: "6–12 weeks",
        optionB: "Under 2 weeks",
      },
      {
        label: "Annual contract required",
        optionA: "Yes",
        optionB: "Month-to-month",
      },
      { label: "Self-hosted option", optionA: false, optionB: true },
      {
        label: "Migration assistance",
        optionA: "Paid add-on",
        optionB: "Included",
      },
    ],
    ctaText: "Schedule a side-by-side demo",
    ctaUrl: "/demo/side-by-side",
    ctaStyle: "drawOutline",
    ctaColorScheme: "primary",
    colorScheme: "dark",
    purpose: "comparison",
  },
};
