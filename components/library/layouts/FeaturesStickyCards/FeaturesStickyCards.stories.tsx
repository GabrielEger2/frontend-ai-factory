import type { Meta, StoryObj } from "@storybook/react";
import {
  FiCalendar,
  FiShield,
  FiZap,
  FiLayers,
  FiGlobe,
  FiTrendingUp,
} from "react-icons/fi";
import FeaturesStickyCards from "./index";

const meta: Meta<typeof FeaturesStickyCards> = {
  title: "Layouts/FeaturesStickyCards",
  component: FeaturesStickyCards,
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
    ctaStyle: {
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
type Story = StoryObj<typeof FeaturesStickyCards>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS platform — icon-driven cards with section header, slide CTA */
export const SaasPlatform: Story = {
  args: {
    headline: "Everything you need to scale",
    subheadline:
      "From scheduling to analytics, our tools are built to grow with your team and simplify your day-to-day operations.",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
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

/** Design agency — image-driven cards showcasing services, drawOutline CTA */
export const DesignAgencyServices: Story = {
  args: {
    headline: "Crafted with intention",
    subheadline:
      "Every project starts with deep research and ends with pixel-perfect execution. Here is how we work.",
    ctaStyle: "drawOutline",
    ctaColorScheme: "primary",
    cards: [
      {
        image: "https://placehold.co/500x350",
        imageAlt:
          "Brand identity design process with mood boards and color swatches",
        title: "Brand Identity",
        description:
          "We distill your company's essence into a visual language — logo, typography, color system, and guidelines that resonate with your audience and stand the test of time.",
        ctaText: "See our branding work",
        ctaUrl: "/work/branding",
      },
      {
        image: "https://placehold.co/500x350",
        imageAlt:
          "Web design wireframes and high-fidelity mockups on a monitor",
        title: "Web Design & Development",
        description:
          "Responsive websites that load fast, convert visitors, and look stunning on every device. From marketing pages to full web applications, designed and built in-house.",
        ctaText: "View web projects",
        ctaUrl: "/work/web",
      },
      {
        image: "https://placehold.co/500x350",
        imageAlt:
          "Motion graphics storyboard frames for a product launch video",
        title: "Motion & Video",
        description:
          "Product demos, social content, and brand films that capture attention in the first frame. We handle concept, storyboard, animation, and post-production.",
        ctaText: "Watch our reel",
        ctaUrl: "/work/motion",
      },
    ],
  },
};

/** E-commerce platform — mixed icons and images, glow CTA, no header */
export const EcommercePlatform: Story = {
  args: {
    ctaStyle: "glow",
    ctaColorScheme: "accent",
    cards: [
      {
        icon: <FiGlobe className="text-4xl" />,
        title: "Sell Anywhere, Globally",
        description:
          "Multi-currency checkout, automatic tax calculation, and localized storefronts in 35 languages. Your products reach customers wherever they are.",
        ctaText: "Start selling globally",
        ctaUrl: "/features/global",
      },
      {
        image: "https://placehold.co/480x320",
        imageAlt: "Mobile shopping app showing a personalized product feed",
        title: "AI-Powered Recommendations",
        description:
          "Machine learning models analyze browsing behavior to surface the right products at the right moment. Merchants see an average 23% increase in basket size.",
        ctaText: "See how it works",
        ctaUrl: "/features/ai",
      },
      {
        icon: <FiLayers className="text-4xl" />,
        title: "Headless Architecture",
        description:
          "Decouple your frontend from your commerce engine. Use our APIs to build custom storefronts with React, Vue, or any framework while we handle inventory, orders, and payments.",
        ctaText: "Read the docs",
        ctaUrl: "/developers",
      },
      {
        image: "https://placehold.co/480x320",
        imageAlt:
          "Warehouse management dashboard with real-time inventory levels",
        title: "Real-Time Inventory Sync",
        description:
          "Unified stock levels across online, retail, and marketplace channels. Automatic reorder alerts and supplier integrations prevent stockouts before they happen.",
        ctaText: "Explore inventory tools",
        ctaUrl: "/features/inventory",
      },
      {
        icon: <FiShield className="text-4xl" />,
        title: "Fraud Protection Built In",
        description:
          "Every transaction is screened by our ML fraud engine. Chargebacks drop by 60% on average, and legitimate orders are never blocked.",
        ctaText: "Learn about security",
        ctaUrl: "/security",
      },
    ],
  },
};

/** Fitness app — short punchy content, dotExpand CTA, section header */
export const FitnessApp: Story = {
  args: {
    headline: "Train smarter, recover faster",
    ctaStyle: "dotExpand",
    ctaColorScheme: "secondary",
    cards: [
      {
        icon: "🏋️",
        title: "Adaptive Workouts",
        description:
          "Programs that adjust to your progress, energy levels, and available equipment. No two weeks are the same because your body never stops evolving.",
        ctaText: "See workout plans",
        ctaUrl: "/workouts",
      },
      {
        icon: "🥗",
        title: "Nutrition Tracking",
        description:
          "Scan barcodes, log meals with photos, and get macro breakdowns in real time. Our food database covers 800,000+ items and syncs with grocery delivery apps.",
        ctaText: "Try meal logging",
        ctaUrl: "/nutrition",
      },
      {
        icon: "😴",
        title: "Sleep & Recovery",
        description:
          "Wearable integration tracks your sleep stages and HRV overnight. Wake up to a recovery score that tells you whether to push hard or take it easy today.",
        ctaText: "Track recovery",
        ctaUrl: "/recovery",
      },
    ],
  },
};

/** Real estate — image-heavy, minimal text, default CTA */
export const RealEstateShowcase: Story = {
  args: {
    headline: "Find your next home",
    subheadline:
      "Explore premium listings with virtual tours, neighborhood insights, and financing options tailored to you.",
    ctaStyle: "default",
    ctaColorScheme: "primary",
    cardHeight: 700,
    cards: [
      {
        image: "https://placehold.co/560x380",
        imageAlt:
          "Modern apartment living room with floor-to-ceiling windows and city view",
        title: "Urban Apartments",
        description:
          "Curated downtown listings in walkable neighborhoods. Filter by commute time, pet policy, and amenities to find a space that fits your lifestyle.",
        ctaText: "Browse apartments",
        ctaUrl: "/listings/apartments",
      },
      {
        image: "https://placehold.co/560x380",
        imageAlt:
          "Suburban family home with landscaped front yard and two-car garage",
        title: "Family Homes",
        description:
          "Spacious properties near top-rated schools with private yards and garage space. Every listing includes a school quality report and neighborhood safety score.",
        ctaText: "Search family homes",
        ctaUrl: "/listings/homes",
      },
      {
        image: "https://placehold.co/560x380",
        imageAlt:
          "Beachfront vacation property with infinity pool overlooking the ocean",
        title: "Vacation Properties",
        description:
          "Investment-ready vacation homes with projected rental income analysis. From beachfront villas to mountain cabins, find properties that pay for themselves.",
        ctaText: "View vacation homes",
        ctaUrl: "/listings/vacation",
      },
    ],
  },
};
