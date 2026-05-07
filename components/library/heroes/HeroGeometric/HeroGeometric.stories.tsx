import type { Meta, StoryObj } from "@storybook/react";
import HeroGeometric from "./index";

const meta: Meta<typeof HeroGeometric> = {
  title: "Hero/HeroGeometric",
  component: HeroGeometric,
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
    secondaryCtaStyle: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    secondaryCtaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    highlightWord: { control: "text" },
    revealHeadline: { control: "boolean" },
    accentColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof HeroGeometric>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS product — social proof badge, dual CTAs, typewriter headline */
export const SaasProductivity: Story = {
  args: {
    headline: "Intelligent AI tools built to help.",
    subheadline:
      "Unlock smarter workflows with AI tools designed to boost productivity, simplify tasks and help you do more with less effort.",
    ctaText: "Get started",
    ctaUrl: "/signup",
    ctaStyle: "default",
    ctaColorScheme: "primary",
    secondaryCtaText: "Watch demo",
    secondaryCtaUrl: "/demo",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "primary",
    image: "https://placehold.co/400x500",
    imageAlt: "Dashboard showing AI-powered workflow automation interface",
    socialProofAvatars: [
      {
        image: "https://placehold.co/50x50",
        imageAlt: "Customer avatar",
      },
      {
        image: "https://placehold.co/50x50",
        imageAlt: "Customer avatar",
      },
      {
        image: "https://placehold.co/50x50",
        imageAlt: "Customer avatar",
      },
    ],
    socialProofLabel: "Join community of 1m+ founders",
  },
};

/** Fintech platform — typewriter, glow CTA, social proof, no secondary CTA */
export const FintechPlatform: Story = {
  args: {
    headline: "Smarter banking for",
    headlineRotatingWords: [
      "freelancers",
      "startups",
      "small businesses",
      "creators",
    ],
    subheadline:
      "Open your account in minutes, manage invoices, track expenses, and receive payments from anywhere in the world with zero hidden fees.",
    ctaText: "Open free account",
    ctaUrl: "/register",
    ctaStyle: "glow",
    ctaColorScheme: "accent",
    image: "https://placehold.co/400x500",
    imageAlt:
      "Mobile banking app showing transaction history and account balance",
    socialProofAvatars: [
      {
        image: "https://placehold.co/50x50",
        imageAlt: "User photo",
      },
      {
        image: "https://placehold.co/50x50",
        imageAlt: "User photo",
      },
      {
        image: "https://placehold.co/50x50",
        imageAlt: "User photo",
      },
      {
        image: "https://placehold.co/50x50",
        imageAlt: "User photo",
      },
    ],
    socialProofLabel: "Trusted by 250k+ accounts worldwide",
  },
};

/** Marketing agency — minimal, no social proof, slide CTA, dual buttons */
export const MarketingAgency: Story = {
  args: {
    headline: "We turn attention into revenue.",
    subheadline:
      "Performance marketing, creative strategy, and data-driven campaigns for brands that want measurable growth, not vanity metrics.",
    ctaText: "Book a strategy call",
    ctaUrl: "/contact",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    secondaryCtaText: "See case studies",
    secondaryCtaUrl: "/cases",
    secondaryCtaStyle: "dotExpand",
    secondaryCtaColorScheme: "neutral",
    image: "https://placehold.co/400x500",
    imageAlt:
      "Marketing analytics dashboard showing campaign performance metrics",
  },
};

/** Education platform — typewriter, social proof, dotExpand CTA */
export const OnlineCourses: Story = {
  args: {
    headline: "Learn to master",
    headlineRotatingWords: [
      "data science",
      "product design",
      "machine learning",
      "cloud architecture",
    ],
    subheadline:
      "Project-based courses taught by industry practitioners. Earn certificates recognized by top tech companies and advance your career.",
    ctaText: "Explore courses",
    ctaUrl: "/courses",
    ctaStyle: "dotExpand",
    ctaColorScheme: "secondary",
    secondaryCtaText: "Free trial",
    secondaryCtaUrl: "/trial",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "secondary",
    image: "https://placehold.co/400x500",
    imageAlt: "Student completing an interactive coding exercise on a laptop",
    socialProofAvatars: [
      {
        image: "https://placehold.co/50x50",
        imageAlt: "Student avatar",
      },
      {
        image: "https://placehold.co/50x50",
        imageAlt: "Student avatar",
      },
      {
        image: "https://placehold.co/50x50",
        imageAlt: "Student avatar",
      },
    ],
    socialProofLabel: "45,000+ students enrolled this month",
  },
};

/** Consulting firm — clean, no typewriter, no social proof, default CTA */
export const ConsultingFirm: Story = {
  args: {
    headline: "Strategic consulting for complex challenges.",
    subheadline:
      "We partner with executive teams to navigate digital transformation, operational efficiency, and market expansion with clarity and precision.",
    ctaText: "Talk to an expert",
    ctaUrl: "/contact",
    ctaStyle: "default",
    ctaColorScheme: "primary",
    image: "https://placehold.co/400x500",
    imageAlt:
      "Modern office meeting room with a team discussing strategy around a glass table",
  },
};
