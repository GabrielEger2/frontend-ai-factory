import type { Meta, StoryObj } from "@storybook/react";
import { FiCalendar, FiShield, FiZap, FiTrendingUp } from "react-icons/fi";
import StickyCards from "./index";

const meta: Meta<typeof StickyCards> = {
  title: "Layouts/Scroll/StickyCards",
  component: StickyCards,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    styleKit: {
      control: "object",
    },
  },
};
export default meta;
type Story = StoryObj<typeof StickyCards>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS platform — icon-driven cards with section header, slide CTA */
export const SaasPlatformFeatures: Story = {
  args: {
    headline: "Everything you need to scale",
    subheadline:
      "From scheduling to analytics, our tools are built to grow with your team and simplify your day-to-day operations.",
    styleKit: {
      ctaVariant: "slide",
      ctaColorScheme: "primary",
    },
    cards: [
      {
        icon: <FiCalendar className="text-4xl" />,
        title: "Smart Scheduling",
        description:
          "AI-powered calendar that learns your preferences, avoids conflicts, and finds the perfect meeting time for every participant across time zones.",
        ctaText: "Try scheduling",
        ctaUrl: "/features/scheduling",
      },
      {
        icon: <FiShield className="text-4xl" />,
        title: "Enterprise Security",
        description:
          "SOC 2 Type II certified with end-to-end encryption, role-based access controls, and real-time audit logs that keep your data protected at every layer.",
        ctaText: "See compliance",
        ctaUrl: "/security",
      },
      {
        icon: <FiZap className="text-4xl" />,
        title: "Instant Integrations",
        description:
          "Connect to 200+ tools in seconds. Slack, Salesforce, HubSpot, Notion — our pre-built connectors eliminate manual data entry and keep everything in sync.",
        ctaText: "Browse integrations",
        ctaUrl: "/integrations",
      },
      {
        icon: <FiTrendingUp className="text-4xl" />,
        title: "Actionable Analytics",
        description:
          "Custom dashboards and automated reports that surface the metrics that matter. Track team performance, pipeline health, and revenue trends at a glance.",
        ctaText: "Explore analytics",
        ctaUrl: "/features/analytics",
      },
    ],
  },
};

/** Consulting firm — image-driven cards showcasing the engagement process, drawOutline CTA */
export const ConsultingProcess: Story = {
  args: {
    headline: "How we deliver results",
    subheadline:
      "A proven four-phase engagement model that turns strategy into measurable impact within 90 days.",
    styleKit: {
      ctaVariant: "drawOutline",
      ctaColorScheme: "accent",
    },
    cards: [
      {
        image: "https://placehold.co/500x350",
        imageAlt:
          "Consultant and client reviewing market research data on a whiteboard",
        title: "Discovery & Diagnosis",
        description:
          "We spend the first two weeks embedded with your team — interviewing stakeholders, auditing processes, and mapping the competitive landscape to identify the levers that matter most.",
        ctaText: "Learn about discovery",
        ctaUrl: "/process/discovery",
      },
      {
        image: "https://placehold.co/500x350",
        imageAlt: "Strategy workshop with executives around a conference table",
        title: "Strategy Design",
        description:
          "Armed with data, we co-create a prioritized roadmap with your leadership team. Every initiative is scored by impact, feasibility, and speed to value so resources go where they count.",
        ctaText: "See our frameworks",
        ctaUrl: "/process/strategy",
      },
      {
        image: "https://placehold.co/500x350",
        imageAlt:
          "Team implementing changes with project management dashboards on screen",
        title: "Execution Support",
        description:
          "Our consultants stay on the ground through implementation — running sprints, unblocking teams, and adjusting tactics in real time as market conditions shift.",
        ctaText: "View case studies",
        ctaUrl: "/process/execution",
      },
      {
        image: "https://placehold.co/500x350",
        imageAlt:
          "Analytics dashboard showing performance metrics and ROI tracking",
        title: "Measurement & Handoff",
        description:
          "Before we leave, we install dashboards, train your team on the new processes, and document everything. You keep the capability long after the engagement ends.",
        ctaText: "Read client outcomes",
        ctaUrl: "/process/results",
      },
    ],
  },
};

/** Product showcase — mixed icons and images, glow CTA, no header */
export const ProductShowcase: Story = {
  args: {
    styleKit: {
      ctaVariant: "glow",
      ctaColorScheme: "secondary",
    },
    cardHeight: 650,
    cards: [
      {
        icon: "🎨",
        title: "Design Studio",
        description:
          "A browser-based design environment with vector editing, prototyping, and developer handoff built into one tool. No plugins, no exports — just seamless collaboration from sketch to ship.",
        ctaText: "Try the studio",
        ctaUrl: "/products/studio",
      },
      {
        image: "https://placehold.co/480x320",
        imageAlt:
          "Component library panel showing reusable design tokens and UI elements",
        title: "Component Library",
        description:
          "Ship consistent interfaces faster with 500+ production-ready components. Every element follows your brand tokens and updates automatically when you change the design system.",
        ctaText: "Browse components",
        ctaUrl: "/products/library",
      },
      {
        icon: "⚡",
        title: "Lightning Deploy",
        description:
          "Push designs to staging with one click. Our build pipeline converts prototypes into optimized React code, runs accessibility checks, and deploys to a preview URL in under 60 seconds.",
        ctaText: "See it in action",
        ctaUrl: "/products/deploy",
      },
    ],
  },
};
