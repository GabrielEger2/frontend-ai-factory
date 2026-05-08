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

export const SaasGrowthPlan: Story = {
  args: {
    eyebrow: "What's in the Growth plan",
    headline: "Everything to take your store from $5k to $50k a month",
    subheadline:
      "A practical toolkit for shops that have outgrown the starter tier but aren't ready to staff a full marketing team yet.",
    items: [
      {
        text: "Abandoned cart recovery flows in 4 languages",
        highlight: "4 languages",
      },
      {
        text: "Up to 25,000 monthly email sends, no surcharge",
        highlight: "25,000",
      },
      {
        text: "Built-in product review collection with photo uploads",
        highlight: "photo uploads",
      },
      {
        text: "A/B testing on subject lines and hero images",
        highlight: "A/B testing",
      },
      {
        text: "Klaviyo, Shopify, and Stripe sync — refreshed every 6 minutes",
        highlight: "every 6 minutes",
      },
      {
        text: "Live chat support, 7am to 9pm São Paulo time",
        highlight: "7am to 9pm",
      },
      {
        text: "Quarterly strategy review with a senior account manager",
        highlight: "Quarterly",
      },
      {
        text: "Migration help from Mailchimp, ActiveCampaign, or RD Station",
        highlight: "Migration help",
      },
    ],
    checkStyle: "filled",
    ctaText: "Start the 14-day trial",
    ctaUrl: "/start/growth",
    ctaVariant: "default",
    ctaColorScheme: "primary",
  },
};

export const MembershipBenefits: Story = {
  args: {
    eyebrow: "Member benefits",
    headline: "Why members renew, year after year",
    subheadline:
      "Founded in 2014 by three sommeliers in Pinheiros, the club is built around small allocations and direct producer access — never volume markdowns.",
    groups: [
      {
        title: "Each shipment",
        items: [
          {
            text: "Six bottles curated around a single growing region",
            highlight: "single growing region",
          },
          {
            text: "A printed tasting card written by Mariana Cardoso",
            highlight: "Mariana Cardoso",
          },
          {
            text: "Optional swap window: change two bottles before it ships",
            highlight: "swap window",
          },
          {
            text: "Cold-chain delivery within 48 hours of harvest country dispatch",
            highlight: "Cold-chain",
          },
        ],
      },
      {
        title: "Every quarter",
        items: [
          {
            text: "Member-only allocation on 12 cult producers, no waiting list",
            highlight: "no waiting list",
          },
          {
            text: "Live virtual tasting hosted by the buying team",
            highlight: "Live virtual tasting",
          },
          {
            text: "First refusal on imports from estates under 8,000 cases",
            highlight: "First refusal",
          },
        ],
      },
      {
        title: "Always",
        items: [
          {
            text: "Free corkage at 23 partner restaurants in São Paulo and Rio",
            highlight: "23 partner restaurants",
          },
          {
            text: "Storage credit for up to 18 bottles in the climate-controlled cellar",
            highlight: "18 bottles",
          },
          {
            text: "Founder hotline for off-list bottle hunting",
            highlight: "Founder hotline",
          },
        ],
      },
    ],
    checkStyle: "outline",
    ctaText: "Join the club",
    ctaUrl: "/membership",
    ctaVariant: "drawOutline",
    ctaColorScheme: "neutral",
  },
};

export const ConsultingPackage: Story = {
  args: {
    eyebrow: "Engagement scope",
    headline: "What's included in the 12-week brand strategy sprint",
    subheadline:
      "A fixed-fee engagement we run twice a year. Three founders, three teams, one outcome: a brand platform you can hand to any agency without a translator.",
    items: [
      {
        text: "Stakeholder interviews with up to 9 internal leaders",
        highlight: "9 internal leaders",
      },
      {
        text: "Customer research conversations with 14 named accounts",
        highlight: "14 named accounts",
      },
      {
        text: "Competitive landscape map across 23 direct and adjacent players",
        highlight: "23 direct and adjacent",
      },
      {
        text: "Positioning workshop, run live for 2 days at your office",
        highlight: "2 days at your office",
      },
      {
        text: "Messaging architecture: vision, mission, value pillars, proof",
        highlight: "Messaging architecture",
      },
      {
        text: "Brand voice guide with 18 do/don't pairs and tone modulation rules",
        highlight: "18 do/don't pairs",
      },
      {
        text: "Naming exploration if a sub-brand or product line is in scope",
        highlight: "Naming exploration",
      },
      {
        text: "Final platform document plus a recorded handoff to your team",
        highlight: "recorded handoff",
      },
      {
        text: "Two 60-minute follow-ups in the 90 days after delivery",
        highlight: "90 days after delivery",
      },
    ],
    checkStyle: "minimal",
    ctaText: "Request the brief",
    ctaUrl: "/sprint/brief",
    ctaVariant: "slide",
    ctaColorScheme: "primary",
  },
};

export const EnterpriseFeatures: Story = {
  args: {
    eyebrow: "Enterprise tier",
    headline: "Built for procurement, security, and finance teams",
    subheadline:
      "The same platform 47 of our customers use to power public-sector deployments, with the controls a CISO needs and the paperwork your auditor expects.",
    groups: [
      {
        title: "Security & compliance",
        items: [
          {
            text: "SOC 2 Type II report, refreshed annually",
            highlight: "SOC 2 Type II",
          },
          {
            text: "SAML 2.0 SSO with Okta, Azure AD, and Google Workspace",
            highlight: "SAML 2.0 SSO",
          },
          {
            text: "SCIM provisioning for joiner / mover / leaver flows",
            highlight: "SCIM provisioning",
          },
          {
            text: "Field-level audit log retained for 7 years",
            highlight: "7 years",
          },
        ],
      },
      {
        title: "Data & deployment",
        items: [
          {
            text: "Choice of São Paulo, Frankfurt, or N. Virginia data residency",
            highlight: "data residency",
          },
          {
            text: "Customer-managed encryption keys via AWS KMS",
            highlight: "customer-managed encryption",
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
        items: [
          {
            text: "99.95% uptime SLA with service credits, not waivers",
            highlight: "99.95% uptime SLA",
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
    ctaText: "Talk to enterprise sales",
    ctaUrl: "/enterprise/contact",
    ctaVariant: "glow",
    ctaColorScheme: "accent",
  },
};

export const EcommercePerks: Story = {
  args: {
    eyebrow: "Free with every order over R$ 280",
    headline: "Small extras that make us worth the second order",
    items: [
      {
        text: "Hand-wrapped in unbleached kraft with a wax seal",
        highlight: "wax seal",
      },
      {
        text: "Personal note from the maker who cut the leather",
        highlight: "Personal note",
      },
      {
        text: "Care kit: conditioning balm, suede brush, dust bag",
        highlight: "Care kit",
      },
      {
        text: "Free repairs for the first 18 months, no questions",
        highlight: "Free repairs",
      },
      {
        text: "Monogram in 4 thread colors, added in the workshop",
        highlight: "Monogram",
      },
      {
        text: "Tracked shipping with Loggi, average 2.3 days to São Paulo",
        highlight: "2.3 days",
      },
    ],
    checkStyle: "outline",
  },
};
