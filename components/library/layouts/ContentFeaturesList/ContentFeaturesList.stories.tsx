import type { Meta, StoryObj } from "@storybook/react";
import ContentFeaturesList from "./index";

const meta: Meta<typeof ContentFeaturesList> = {
  title: "Layouts/ContentFeaturesList",
  component: ContentFeaturesList,
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
    columns: {
      control: "select",
      options: [2, 3, 4],
    },
  },
};
export default meta;
type Story = StoryObj<typeof ContentFeaturesList>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Marketing agency — four services with individual CTAs */
export const MarketingAgency: Story = {
  args: {
    label: "What We Offer",
    headline: "Strategies That Drive Measurable Growth",
    description:
      "We combine data-driven insights with creative execution to help brands reach the right audience at the right moment.",
    columns: 4,
    ctaText: "See All Services",
    ctaUrl: "/services",
    ctaStyle: "default",
    features: [
      {
        title: "Content Marketing",
        description:
          "Long-form articles, video scripts, and social campaigns designed to build authority and earn organic traffic that compounds over time.",
        ctaText: "Learn More",
        ctaUrl: "/services/content",
      },
      {
        title: "Paid Acquisition",
        description:
          "Google Ads, Meta, and LinkedIn campaigns managed by certified specialists with transparent reporting and weekly optimization cycles.",
        ctaText: "Learn More",
        ctaUrl: "/services/paid",
      },
      {
        title: "SEO & Technical Audit",
        description:
          "Core Web Vitals, structured data, and crawl-budget optimization that move you from page two to the featured snippet.",
        ctaText: "Learn More",
        ctaUrl: "/services/seo",
      },
      {
        title: "Conversion Rate Optimization",
        description:
          "A/B testing, heatmap analysis, and checkout-flow redesigns that turn your existing traffic into 15-30% more revenue.",
        ctaText: "Learn More",
        ctaUrl: "/services/cro",
      },
    ],
  },
};

/** Law firm — three practice areas in a more restrained layout */
export const LawFirmPractice: Story = {
  args: {
    label: "Practice Areas",
    headline: "Trusted Legal Counsel for Complex Matters",
    description:
      "For over forty years our partners have represented individuals and institutions in high-stakes litigation and regulatory proceedings.",
    columns: 3,
    ctaText: "Schedule a Consultation",
    ctaUrl: "/contact",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    features: [
      {
        title: "Corporate Litigation",
        description:
          "Shareholder disputes, breach of contract, and fiduciary duty claims handled with precision and discretion from filing through trial.",
        ctaText: "Details",
        ctaUrl: "/practice/corporate-litigation",
      },
      {
        title: "Intellectual Property",
        description:
          "Patent prosecution, trade secret enforcement, and licensing agreements for technology companies and research institutions.",
        ctaText: "Details",
        ctaUrl: "/practice/ip",
      },
      {
        title: "Regulatory Compliance",
        description:
          "SEC investigations, antitrust reviews, and cross-border compliance programs tailored to financial services and healthcare.",
        ctaText: "Details",
        ctaUrl: "/practice/compliance",
      },
    ],
  },
};

/** SaaS platform — two-column feature comparison without per-item CTAs */
export const SaasFeatures: Story = {
  args: {
    headline: "Everything Your Team Needs to Ship Faster",
    description:
      "Built for engineering teams who value developer experience as much as end-user experience.",
    columns: 2,
    ctaText: "Start Free Trial",
    ctaUrl: "/signup",
    ctaStyle: "glow",
    ctaColorScheme: "accent",
    features: [
      {
        title: "Instant Preview Environments",
        description:
          "Every pull request gets its own isolated preview URL with production-like data, so reviewers test real behavior before merging.",
      },
      {
        title: "Edge Functions",
        description:
          "Run server logic at the network edge with sub-10ms cold starts. No provisioning, no containers, no configuration.",
      },
      {
        title: "Integrated Observability",
        description:
          "Traces, logs, and metrics flow into a single dashboard. Correlate a slow API call to the exact database query in two clicks.",
      },
      {
        title: "Role-Based Access Control",
        description:
          "Fine-grained permissions at the workspace, project, and environment level with SSO and SCIM provisioning out of the box.",
      },
    ],
  },
};

/** Fitness studio — four class types with energetic CTAs */
export const FitnessStudio: Story = {
  args: {
    label: "Our Classes",
    headline: "Find the Workout That Fits Your Goals",
    columns: 4,
    ctaText: "View Full Schedule",
    ctaUrl: "/schedule",
    ctaStyle: "drawOutline",
    ctaColorScheme: "accent",
    features: [
      {
        title: "HIIT Circuit",
        description:
          "Thirty minutes of high-intensity intervals that torch calories and build functional strength with minimal equipment.",
        ctaText: "Book a Class",
        ctaUrl: "/classes/hiit",
      },
      {
        title: "Power Yoga",
        description:
          "Vinyasa-based flows focused on core stability, flexibility, and breath control. Suitable for all levels.",
        ctaText: "Book a Class",
        ctaUrl: "/classes/yoga",
      },
      {
        title: "Spin Endurance",
        description:
          "Forty-five minutes on the bike with structured intervals and real-time performance tracking on the leaderboard.",
        ctaText: "Book a Class",
        ctaUrl: "/classes/spin",
      },
      {
        title: "Recovery & Stretch",
        description:
          "Guided foam rolling, mobility drills, and deep stretching designed to reduce soreness and prevent injury.",
        ctaText: "Book a Class",
        ctaUrl: "/classes/recovery",
      },
    ],
  },
};
