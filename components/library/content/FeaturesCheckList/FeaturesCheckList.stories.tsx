import type { Meta, StoryObj } from "@storybook/react";
import FeaturesCheckList from "./index";

const meta: Meta<typeof FeaturesCheckList> = {
  title: "Content/FeaturesCheckList",
  component: FeaturesCheckList,
  parameters: { layout: "fullscreen" },
  argTypes: {
    checkStyle: {
      control: "select",
      options: ["filled", "outline", "minimal"],
    },
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
type Story = StoryObj<typeof FeaturesCheckList>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS Growth tier — full long-form treatment: project meta strip, flat
 * list with per-item notes, methodology footnote, pull-quote and a dark
 * outcome metrics band. Demonstrates the component as a plan-detail page. */
export const SaasGrowthPlan: Story = {
  args: {
    eyebrow: "What's in the Growth plan",
    headline: "Everything to take your store from $5k to $50k a month",
    subheadline:
      "A practical toolkit for shops that have outgrown the starter tier but aren't ready to staff a full marketing team yet. Every line below is included on Growth — no add-ons, no surcharges.",
    meta: [
      { label: "Plan", value: "Growth · $79 / month" },
      { label: "Includes", value: "1 store · up to 3 editors" },
      { label: "Window", value: "14-day free trial" },
      { label: "Verified by", value: "Customer Success" },
    ],
    items: [
      {
        text: "Abandoned cart recovery flows in 4 languages",
        highlight: "4 languages",
        note: "Portuguese, Spanish, English, French — auto-detected per session",
      },
      {
        text: "Up to 25,000 monthly email sends, no surcharge",
        highlight: "25,000",
        note: "Overage rolls into the next cycle, never charged out-of-band",
      },
      {
        text: "Built-in product review collection with photo uploads",
        highlight: "photo uploads",
      },
      {
        text: "A/B testing on subject lines and hero images",
        highlight: "A/B testing",
        note: "Bayesian, calls a winner once it crosses 95% confidence",
      },
      {
        text: "Klaviyo, Shopify, and Stripe sync — refreshed every 6 minutes",
        highlight: "every 6 minutes",
      },
      {
        text: "Live chat support, 7am to 9pm São Paulo time",
        highlight: "7am to 9pm",
        note: "Average first response 1m 47s over the last 90 days",
      },
      {
        text: "Quarterly strategy review with a senior account manager",
        highlight: "Quarterly",
      },
      {
        text: "Migration help from Mailchimp, ActiveCampaign, or RD Station",
        highlight: "Migration help",
        note: "Lists, segments, automations and sender domain — done in onboarding",
      },
    ],
    checkStyle: "filled",
    footnote:
      "Email send volume measured per calendar month, with a 7-day grace window before any throttling kicks in. Numbers above are medians from active Growth accounts in the trailing 90 days; full methodology mirrored at growthlog.praiola.com.",
    pullQuote: {
      quote:
        "We moved off Klaviyo on a Friday and the recovery flows were sending again before our standup on Monday — same revenue, half the per-email cost.",
      attribution: "Mariana Cardoso",
      attributionMeta: "Head of Lifecycle · Atelier Norte",
    },
    metrics: [
      { value: "1m 47s", label: "Median first-response time on live chat" },
      {
        value: "+47.2%",
        label: "Lift in cart-recovery revenue, first 90 days",
      },
      { value: "3,847", label: "Stores active on Growth this quarter" },
      { value: "0", label: "Surcharges or quote-only add-ons" },
    ],
    ctaText: "Start the 14-day trial",
    ctaUrl: "/start/growth",
    ctaVariant: "default",
    ctaColorScheme: "primary",
  },
};

/** Wine club membership — grouped manifest with three named clusters, each
 * with a one-line group description, an editorial pull-quote from a member
 * and a drawOutline CTA. No metrics band, deliberately quieter close. */
export const MembershipBenefits: Story = {
  args: {
    eyebrow: "Member benefits",
    headline: "Why members renew, year after year",
    subheadline:
      "Founded in 2014 by three sommeliers in Pinheiros, the club is built around small allocations and direct producer access — never volume markdowns.",
    meta: [
      { label: "Founded", value: "Pinheiros, 2014" },
      { label: "Cellar capacity", value: "12,400 bottles" },
      { label: "Annual fee", value: "R$ 1,890" },
      { label: "Member count", value: "1,247 active" },
    ],
    groups: [
      {
        title: "Each shipment",
        description:
          "Six bottles, hand-picked the week before they leave the cellar.",
        items: [
          {
            text: "Six bottles curated around a single growing region",
            highlight: "single growing region",
          },
          {
            text: "A printed tasting card written by Mariana Cardoso",
            highlight: "Mariana Cardoso",
            note: "Head sommelier, ex-D.O.M., writes every card by hand",
          },
          {
            text: "Optional swap window: change two bottles before it ships",
            highlight: "swap window",
          },
          {
            text: "Cold-chain delivery within 48 hours of harvest country dispatch",
            highlight: "Cold-chain",
            note: "Temperature-logged end to end, with the log printed on the box",
          },
        ],
      },
      {
        title: "Every quarter",
        description:
          "The reasons most members say they joined in the first place.",
        items: [
          {
            text: "Member-only allocation on 12 cult producers, no waiting list",
            highlight: "no waiting list",
          },
          {
            text: "Live virtual tasting hosted by the buying team",
            highlight: "Live virtual tasting",
            note: "Recorded, transcribed, and added to the member library",
          },
          {
            text: "First refusal on imports from estates under 8,000 cases",
            highlight: "First refusal",
          },
        ],
      },
      {
        title: "Always",
        description: "Quiet perks the long-tenured members rely on most.",
        items: [
          {
            text: "Free corkage at 23 partner restaurants in São Paulo and Rio",
            highlight: "23 partner restaurants",
          },
          {
            text: "Storage credit for up to 18 bottles in the climate-controlled cellar",
            highlight: "18 bottles",
            note: "Renewable annually, no per-bottle handling fee",
          },
          {
            text: "Founder hotline for off-list bottle hunting",
            highlight: "Founder hotline",
          },
        ],
      },
    ],
    checkStyle: "outline",
    footnote:
      "Renewals process on the anniversary of joining, with a 30-day grace window. Member fees and partner restaurant list are reviewed each February; current edition mirrored at clubeenoteca.com.br/manifest.",
    pullQuote: {
      quote:
        "I joined for the shipments and stayed for the cellar credit. Eight years in, I've never paid corkage and I've drunk things I couldn't have bought retail at any price.",
      attribution: "Henrique Salles",
      attributionMeta: "Member since 2017 · Vila Madalena",
    },
    ctaText: "Join the club",
    ctaUrl: "/membership",
    ctaVariant: "drawOutline",
    ctaColorScheme: "neutral",
  },
};

/** Consulting deliverables — flat manifest with a project meta strip,
 * methodology footnote, no pull-quote, slide CTA. The 'minimal' check
 * style fits a quiet consulting tone better than the filled circles. */
export const ConsultingPackage: Story = {
  args: {
    eyebrow: "Engagement scope",
    headline: "What's included in the 12-week brand strategy sprint",
    subheadline:
      "A fixed-fee engagement we run twice a year. Three founders, three teams, one outcome: a brand platform you can hand to any agency without a translator.",
    meta: [
      { label: "Engagement", value: "Brand strategy sprint" },
      { label: "Window", value: "12 weeks · twice a year" },
      { label: "Fee", value: "Fixed · proposal on request" },
      { label: "Lead", value: "Bianca Okazaki" },
    ],
    items: [
      {
        text: "Stakeholder interviews with up to 9 internal leaders",
        highlight: "9 internal leaders",
        note: "Recorded, transcribed, and themed in a shared workspace",
      },
      {
        text: "Customer research conversations with 14 named accounts",
        highlight: "14 named accounts",
        note: "Mix of recent wins, early churns and near-misses, briefed by you",
      },
      {
        text: "Competitive landscape map across 23 direct and adjacent players",
        highlight: "23 direct and adjacent",
      },
      {
        text: "Positioning workshop, run live for 2 days at your office",
        highlight: "2 days at your office",
        note: "Travel and per-diem included for engagements inside Brazil",
      },
      {
        text: "Messaging architecture: vision, mission, value pillars, proof",
        highlight: "Messaging architecture",
      },
      {
        text: "Brand voice guide with 18 do/don't pairs and tone modulation rules",
        highlight: "18 do/don't pairs",
        note: "Pulled from your real copy, not a generic Voice & Tone template",
      },
      {
        text: "Naming exploration if a sub-brand or product line is in scope",
        highlight: "Naming exploration",
      },
      {
        text: "Final platform document plus a recorded handoff to your team",
        highlight: "recorded handoff",
        note: "90-minute walkthrough, edited, captioned, archived in your Drive",
      },
      {
        text: "Two 60-minute follow-ups in the 90 days after delivery",
        highlight: "90 days after delivery",
      },
    ],
    checkStyle: "minimal",
    footnote:
      "Out of scope: visual identity, asset production, web build, paid media. We refer those out to two agencies we work with often and brief them off the platform document at no extra cost.",
    ctaText: "Request the brief",
    ctaUrl: "/sprint/brief",
    ctaVariant: "slide",
    ctaColorScheme: "primary",
  },
};

/** Enterprise tier — grouped manifest with security/data/service clusters,
 * a project meta strip, methodology footnote, customer pull-quote, dark
 * metrics band and a glow CTA. The richest variant in the set. */
export const EnterpriseFeatures: Story = {
  args: {
    eyebrow: "Enterprise tier",
    headline: "Built for procurement, security, and finance teams",
    subheadline:
      "The same platform 47 of our customers use to power public-sector deployments, with the controls a CISO needs and the paperwork your auditor expects.",
    meta: [
      { label: "Tier", value: "Enterprise · annual" },
      { label: "Customers", value: "47 active accounts" },
      { label: "Largest deployment", value: "12,400 seats" },
      { label: "Compliance pack", value: "SOC 2 + ISO 27001" },
    ],
    groups: [
      {
        title: "Security & compliance",
        description:
          "Everything finance, IT and audit ask for in the procurement questionnaire.",
        items: [
          {
            text: "SOC 2 Type II report, refreshed annually",
            highlight: "SOC 2 Type II",
            note: "Latest report dated Mar 2026, available under NDA in 48 hours",
          },
          {
            text: "SAML 2.0 SSO with Okta, Azure AD, and Google Workspace",
            highlight: "SAML 2.0 SSO",
          },
          {
            text: "SCIM provisioning for joiner / mover / leaver flows",
            highlight: "SCIM provisioning",
            note: "Tested against Okta and Azure AD release channels every quarter",
          },
          {
            text: "Field-level audit log retained for 7 years",
            highlight: "7 years",
          },
        ],
      },
      {
        title: "Data & deployment",
        description:
          "Where the data lives, who holds the keys, and how the network looks from your VPC.",
        items: [
          {
            text: "Choice of São Paulo, Frankfurt, or N. Virginia data residency",
            highlight: "data residency",
          },
          {
            text: "Customer-managed encryption keys via AWS KMS",
            highlight: "customer-managed encryption",
            note: "Bring your own CMK; rotation honoured within 24 hours",
          },
          {
            text: "VPC peering and private endpoints, no public ingress",
            highlight: "VPC peering",
          },
          {
            text: "Sandbox environment that mirrors production weekly",
            highlight: "Sandbox environment",
          },
        ],
      },
      {
        title: "Service & contract",
        description:
          "What changes once you cross from the self-serve plans into a signed master agreement.",
        items: [
          {
            text: "99.95% uptime SLA with service credits, not waivers",
            highlight: "99.95% uptime SLA",
            note: "Credits applied automatically; you don't have to file for them",
          },
          {
            text: "Named technical account manager and a 4-hour P1 response",
            highlight: "4-hour P1 response",
          },
          {
            text: "Annual procurement review on your paper, not ours",
            highlight: "your paper",
          },
        ],
      },
    ],
    checkStyle: "filled",
    footnote:
      "Sources: latest SOC 2 Type II report, current trust portal at trust.praiola.com, and uptime data exported from the public status page. All figures verifiable under NDA in the same week the request lands with sales.",
    pullQuote: {
      quote:
        "Procurement reviewed the trust portal on a Tuesday and signed the order form on Friday. The legal team flagged exactly zero changes to the master agreement.",
      attribution: "Rafael Tavares",
      attributionMeta: "CISO · Northwave Logistics",
    },
    metrics: [
      { value: "99.97%", label: "Uptime, trailing 12 months" },
      { value: "4 hr", label: "Median P1 acknowledgement, 2025" },
      { value: "47", label: "Enterprise accounts in production" },
      { value: "0", label: "Security incidents disclosed in 2025" },
    ],
    ctaText: "Talk to enterprise sales",
    ctaUrl: "/enterprise/contact",
    ctaVariant: "glow",
    ctaColorScheme: "accent",
  },
};

/** Ecommerce perks — short, intimate manifest with no header meta and no
 * pull-quote, just the list, a friendly footnote and an outline check style.
 * Demonstrates the component scaled down to a focused 'free with order' block. */
export const EcommercePerks: Story = {
  args: {
    eyebrow: "Free with every order over R$ 280",
    headline: "Small extras that make us worth the second order",
    items: [
      {
        text: "Hand-wrapped in unbleached kraft with a wax seal",
        highlight: "wax seal",
        note: "Six colours of wax, picked by the maker who sealed the box",
      },
      {
        text: "Personal note from the maker who cut the leather",
        highlight: "Personal note",
      },
      {
        text: "Care kit: conditioning balm, suede brush, dust bag",
        highlight: "Care kit",
        note: "Refills available at cost, no minimum order",
      },
      {
        text: "Free repairs for the first 18 months, no questions",
        highlight: "Free repairs",
      },
      {
        text: "Monogram in 4 thread colors, added in the workshop",
        highlight: "Monogram",
        note: "Up to 3 characters, lead time stays the same",
      },
      {
        text: "Tracked shipping with Loggi, average 2.3 days to São Paulo",
        highlight: "2.3 days",
      },
    ],
    checkStyle: "outline",
    footnote:
      "Repairs cover stitching, edge dye, hardware and lining; structural damage from impact or water is quoted separately. Monogram and care kit are added at packing — let us know in the order notes.",
  },
};
