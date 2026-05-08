import type { Meta, StoryObj } from "@storybook/react";
import ComparisonSplit from "./index";

const meta: Meta<typeof ComparisonSplit> = {
  title: "Content/ComparisonSplit",
  component: ComparisonSplit,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaStyle: {
      control: { type: "select" },
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
      control: { type: "select" },
      options: ["primary", "secondary", "accent", "neutral"],
    },
    colorScheme: {
      control: { type: "select" },
      options: ["light", "dark"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof ComparisonSplit>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Web agency before/after rebuild — full case-study framing: project
 * meta strip, grouped rows (Performance / Conversion / Compliance),
 * methodology footnote, pull-quote from the client, outcome metrics band
 * and a slide CTA. Demonstrates the component as a relaunch write-up. */
export const BeforeAfterAgency: Story = {
  args: {
    eyebrow: "Atelier Norte · Case study #14",
    headline: "What changes when a six-year-old site is rebuilt from scratch",
    description:
      "Numbers from the first ninety days after relaunching the e-commerce front of a regional outdoor-gear retailer. Same products, same catalogue, same paid media spend — only the layer between the customer and the database changed.",
    meta: [
      { label: "Client", value: "Atelier Norte" },
      { label: "Scope", value: "Storefront · checkout · CMS" },
      { label: "Window", value: "Oct 2024 – Jan 2025" },
      { label: "Lead", value: "Mariana Cardoso" },
    ],
    optionALabel: "Before redesign",
    optionASubtext: "Live for 6 years · Magento 2.3",
    optionBLabel: "After redesign",
    optionBSubtext: "Live since Jan · Next.js 15",
    features: [
      {
        group: "Performance",
        label: "Mobile load time (LCP)",
        note: "Median across 1,200 sessions on 4G",
        optionA: "4.8 s",
        optionB: "1.1 s",
      },
      {
        group: "Performance",
        label: "Lighthouse performance",
        note: "Same URL, same throttling profile",
        optionA: "31",
        optionB: "97",
      },
      {
        group: "Performance",
        label: "Server-rendered SEO pages",
        optionA: false,
        optionB: true,
      },
      {
        group: "Conversion",
        label: "Bounce rate",
        note: "Sessions ending without a second pageview",
        optionA: "62%",
        optionB: "21%",
      },
      {
        group: "Conversion",
        label: "Checkout completion rate",
        optionA: "1.4%",
        optionB: "3.9%",
      },
      {
        group: "Conversion",
        label: "Cart abandonment recovery email",
        optionA: false,
        optionB: true,
      },
      {
        group: "Compliance",
        label: "WCAG 2.2 AA compliance",
        note: "Audited externally, contrast and focus included",
        optionA: false,
        optionB: true,
      },
      {
        group: "Compliance",
        label: "LGPD-compliant cookie banner",
        optionA: "Generic third-party",
        optionB: "Self-hosted, audit-logged",
      },
    ],
    footnote:
      "Methodology: rolling 90-day window in GA4, identical attribution model on both stacks, paid media spend held within ±3% month-over-month. Source dashboard refreshed weekly; latest revision Apr 2025.",
    pullQuote: {
      quote:
        "The first thing the warehouse team noticed was the volume — orders started landing before they finished their morning coffee, not after lunch.",
      attribution: "Henrique Salles",
      attributionMeta: "Operations Director · Atelier Norte",
    },
    metrics: [
      { value: "+178%", label: "Revenue per visitor, first 90 days" },
      { value: "1.1 s", label: "Median LCP across mobile sessions" },
      { value: "47.2%", label: "Lift in checkout completion" },
      { value: "0", label: "Page templates carried over from the old stack" },
    ],
    ctaText: "Read the full case study",
    ctaUrl: "/case-studies/atelier-norte",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    colorScheme: "light",
    purpose: "comparison",
  },
};

/** SaaS DIY vs done-for-you — pricing-page positioning with grouped
 * onboarding rows, no metrics band, dotExpand CTA. The pull-quote here
 * stands in for a customer testimonial about the managed launch path. */
export const DiyVsService: Story = {
  args: {
    eyebrow: "Two ways to launch with Praiola",
    headline: "Hands-on or hands-off — both ship the same product",
    description:
      "Most teams pick the managed launch when they're under deadline pressure or short on a senior front-end. The DIY path stays free forever, with the same component library and the same docs.",
    meta: [
      { label: "Tiers compared", value: "DIY · Managed" },
      { label: "Last updated", value: "Apr 2026" },
      { label: "Time to live", value: "Same day · 30-min average" },
      { label: "Verified by", value: "Praiola customer success" },
    ],
    optionALabel: "DIY",
    optionASubtext: "You drive · Free plan",
    optionBLabel: "Done for you",
    optionBSubtext: "We drive · One-time fee",
    features: [
      {
        group: "Onboarding",
        label: "Setup time",
        note: "From signup to first live page",
        optionA: "8+ hours",
        optionB: "30 minutes",
      },
      {
        group: "Onboarding",
        label: "Templates included",
        optionA: false,
        optionB: true,
      },
      {
        group: "Onboarding",
        label: "Domain configured for you",
        note: "DNS, SSL, redirects, www-canonical",
        optionA: false,
        optionB: true,
      },
      {
        group: "Onboarding",
        label: "Brand kit imported",
        optionA: false,
        optionB: true,
      },
      {
        group: "Migration",
        label: "Email migration",
        optionA: "Self-service docs",
        optionB: "Handled in onboarding",
      },
      {
        group: "Migration",
        label: "Existing-site content port",
        note: "Up to 40 pages, copy + assets, alt text rebuilt",
        optionA: "DIY copy/paste",
        optionB: "Done by our team",
      },
      {
        group: "Aftercare",
        label: "First-month analytics review",
        optionA: false,
        optionB: true,
      },
      {
        group: "Aftercare",
        label: "Slack channel with the launch team",
        optionA: false,
        optionB: true,
      },
    ],
    footnote:
      "Both tiers ship the same component library, the same theming engine, and the same uptime SLA. The managed path adds people, not features — keep it in mind when picking.",
    pullQuote: {
      quote:
        "We bought the managed launch on a Wednesday and showed the new site at the Monday board meeting. Nobody asked which tier we picked.",
      attribution: "Bianca Okazaki",
      attributionMeta: "VP Marketing · Cargo Atlas",
    },
    ctaText: "Book a managed launch",
    ctaUrl: "/managed-launch",
    ctaStyle: "dotExpand",
    ctaColorScheme: "primary",
    colorScheme: "light",
    purpose: "comparison",
  },
};

/** Free vs Pro pricing comparison — flat row list (no groups), tighter
 * footprint without pull-quote or metrics, glow CTA. Demonstrates the
 * component scaled down to a focused plan-comparison block. */
export const FreemiumVsPro: Story = {
  args: {
    eyebrow: "Plan comparison",
    headline: "Start free. Upgrade when your audience does.",
    description:
      "Both tiers ship every feature on the public roadmap. Pro removes the volume caps, unlocks team controls and adds the security primitives that finance and IT ask for at sign-off.",
    meta: [
      { label: "Last updated", value: "Apr 2026" },
      { label: "Free seats", value: "1 editor" },
      { label: "Pro seats", value: "Up to 25 editors" },
      { label: "Annual discount", value: "2 months free" },
    ],
    optionALabel: "Free",
    optionASubtext: "Forever · No card",
    optionBLabel: "Pro",
    optionBSubtext: "$29 / editor / month",
    features: [
      {
        label: "AI generations / month",
        note: "Soft cap, throttled rather than blocked",
        optionA: "10",
        optionB: "Unlimited",
      },
      { label: "Custom branding", optionA: false, optionB: true },
      {
        label: "Team workspaces",
        note: "Per-seat editor + viewer roles",
        optionA: "1 seat",
        optionB: "Up to 25",
      },
      { label: "Priority support", optionA: false, optionB: true },
      {
        label: "SSO and SCIM",
        note: "Okta, Google Workspace, Azure AD",
        optionA: false,
        optionB: true,
      },
      {
        label: "Audit log retention",
        note: "Exportable as CSV or via API",
        optionA: "7 days",
        optionB: "12 months",
      },
      {
        label: "Domain alias support",
        optionA: "1 subdomain",
        optionB: "Up to 8 custom domains",
      },
    ],
    footnote:
      "Annual plans are billed up front and include a 14-day refund window. Pro pricing applies per active editor; viewers and external reviewers stay free on either tier.",
    ctaText: "Compare every Pro feature",
    ctaUrl: "/pricing/pro",
    ctaStyle: "glow",
    ctaColorScheme: "accent",
    colorScheme: "light",
    purpose: "comparison",
  },
};

/** Brand vs competitor — head-to-head positioning in dark mode with
 * grouped rows, methodology footnote citing a public source, customer
 * pull-quote and an outcome metrics band. drawOutline CTA. */
export const CompetitorBattle: Story = {
  args: {
    eyebrow: "Switching from another tool?",
    headline: "How Praiola stacks up against the legacy seat-license vendors",
    description:
      "Pulled from a public comparison the team maintains in the open — last refreshed this week. Spot something off? Send a correction and we'll fix it the same day, with a note in the changelog.",
    meta: [
      { label: "Source", value: "Public comparison repo" },
      { label: "Last refreshed", value: "Apr 2026, weekly" },
      { label: "Vendors sampled", value: "3 incumbents · top of G2" },
      { label: "Verified by", value: "Customer-facing engineering" },
    ],
    optionALabel: "Other tools",
    optionASubtext: "Average of top 3 competitors",
    optionBLabel: "Praiola",
    optionBSubtext: "Independent · Brazil-based",
    features: [
      {
        group: "Commercials",
        label: "Predictable pricing",
        note: "Posted publicly, no quote-only tiers",
        optionA: false,
        optionB: true,
      },
      {
        group: "Commercials",
        label: "Annual contract required",
        optionA: "Yes",
        optionB: "Month-to-month",
      },
      {
        group: "Commercials",
        label: "Implementation timeline",
        note: "First production page live",
        optionA: "6–12 weeks",
        optionB: "Under 2 weeks",
      },
      {
        group: "Architecture",
        label: "Open API access",
        optionA: false,
        optionB: true,
      },
      {
        group: "Architecture",
        label: "Self-hosted option",
        note: "Same binary, customer-managed Postgres",
        optionA: false,
        optionB: true,
      },
      {
        group: "Architecture",
        label: "Component library on GitHub",
        optionA: "Closed-source",
        optionB: "MIT, 47.2k stars",
      },
      {
        group: "Onboarding",
        label: "Migration assistance",
        optionA: "Paid add-on",
        optionB: "Included",
      },
      {
        group: "Onboarding",
        label: "Average go-live with engineering team",
        note: "Customer-reported, last 24 deployments",
        optionA: "11 weeks",
        optionB: "9 days",
      },
    ],
    footnote:
      "Sources: public pricing pages, G2 reviews from the trailing 90 days, and customer-reported go-live timestamps. The full dataset and a diff log are mirrored at github.com/praiola/competitor-compare.",
    pullQuote: {
      quote:
        "We renewed our seat-license contract once. The second time, finance asked us to find someone who would publish the prices on a website.",
      attribution: "Rafael Tavares",
      attributionMeta: "Head of Platform · Northwave Logistics",
    },
    metrics: [
      { value: "9 days", label: "Median go-live with an engineering team" },
      { value: "47.2k", label: "GitHub stars on the component library" },
      { value: "0", label: "Quote-only pricing tiers" },
      { value: "1,247", label: "Customers migrated from legacy vendors" },
    ],
    ctaText: "Schedule a side-by-side demo",
    ctaUrl: "/demo/side-by-side",
    ctaStyle: "drawOutline",
    ctaColorScheme: "primary",
    colorScheme: "dark",
    purpose: "comparison",
  },
};

/** Solo restoration architect — small, intimate engagement framed as a
 * single-project deep-dive: project meta strip, two grouped row sets,
 * pull-quote from the homeowner, no metrics band, arrow CTA. */
export const RestorationStudio: Story = {
  args: {
    eyebrow: "Cardoso & Tavares · Brownstone restoration",
    headline:
      "What we kept, what we replaced, what the historic district approved",
    description:
      "A line-by-line read of the 1890 Beacon Hill brownstone we handed back in November. Every row below was either signed off by the historic district at first submission or rebuilt in matching original material from a Quincy salvage yard.",
    meta: [
      { label: "Project", value: "Beacon Hill brownstone, 1890" },
      { label: "Window", value: "Mar – Nov 2024" },
      { label: "Crew", value: "4 masons · 2 metalworkers" },
      { label: "Approval", value: "Historic district, first pass" },
    ],
    optionALabel: "As inherited",
    optionASubtext: "Condition at intake, March 2024",
    optionBLabel: "As delivered",
    optionBSubtext: "Final walkthrough, Nov 2024",
    features: [
      {
        group: "Façade",
        label: "Lime mortar",
        note: "Original 1890 mix, hand-mixed on site",
        optionA: "Failing, 60% open joints",
        optionB: "Repointed, matched profile",
      },
      {
        group: "Façade",
        label: "Copper cornice",
        optionA: "Lost to corrosion",
        optionB: "Pressed copper, salvage match",
      },
      {
        group: "Façade",
        label: "Entry stair",
        optionA: "Concrete patch over original",
        optionB: "Brownstone, quarried within 40 mi",
      },
      {
        group: "Interior",
        label: "Quaresmeira flooring",
        note: "Original boards retained where possible",
        optionA: "Painted over, mid-century",
        optionB: "Sanded, re-oiled in place",
      },
      {
        group: "Interior",
        label: "Plaster ceilings",
        optionA: "Patched with drywall",
        optionB: "Rebuilt in three-coat plaster",
      },
      {
        group: "Systems",
        label: "Electrical",
        note: "Run in original chase walls, no new soffits",
        optionA: "Knob & tube, partial",
        optionB: "Full rewire, panel relocated",
      },
      {
        group: "Systems",
        label: "Heating",
        optionA: "Single-zone forced air",
        optionB: "Hydronic, four zones",
      },
    ],
    footnote:
      "Every replaced material was photographed at intake and at handover. The historic-district file (47 photos, three site visits) is mirrored to the homeowner's archive on request.",
    pullQuote: {
      quote:
        "They handed us back a building we already loved, with the parts we never noticed quietly fixed.",
      attribution: "Inês Bahia",
      attributionMeta: "Owner · Beacon Hill brownstone",
    },
    ctaText: "See the Beacon Hill archive",
    ctaUrl: "/projects/beacon-hill",
    ctaStyle: "arrow",
    ctaColorScheme: "neutral",
    colorScheme: "light",
    purpose: "comparison",
  },
};
