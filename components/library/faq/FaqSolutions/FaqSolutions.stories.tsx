import type { Meta, StoryObj } from "@storybook/react";
import FaqSolutions from "./index";

const meta: Meta<typeof FaqSolutions> = {
  title: "FAQ/FaqSolutions",
  component: FaqSolutions,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    defaultOpenIndex: { control: "number" },
  },
};
export default meta;
type Story = StoryObj<typeof FaqSolutions>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Software company — solutions by audience segment */
export const SoftwareSegments: Story = {
  args: {
    headline: "Solutions",
    subheadline:
      "Purpose-built tools for every stage of your organization, from solo founder to global enterprise.",
    items: [
      {
        title: "For Individuals",
        description:
          "A personal workspace to organize projects, track goals, and build a portfolio. Free tier includes unlimited notes and 5 GB of storage with no credit card required.",
        ctaText: "Start for free",
        ctaUrl: "/pricing/individual",
        image: "https://placehold.co/700x500",
        imageAlt:
          "Person working on a laptop in a bright home office with plants",
      },
      {
        title: "For Startups",
        description:
          "Collaborate with up to 20 team members. Shared dashboards, real-time editing, and integrations with GitHub, Slack, and Figma help your team ship faster without switching tools.",
        ctaText: "See startup plan",
        ctaUrl: "/pricing/startup",
        image: "https://placehold.co/700x500",
        imageAlt:
          "Small team gathered around a whiteboard with sticky notes and diagrams",
      },
      {
        title: "For Enterprise",
        description:
          "SSO, SCIM provisioning, audit logs, and a 99.99% uptime SLA. Dedicated account managers ensure smooth onboarding for teams of any size, with custom training workshops included.",
        ctaText: "Contact sales",
        ctaUrl: "/contact",
        image: "https://placehold.co/700x500",
        imageAlt:
          "Corporate meeting room with a large monitor showing analytics dashboards",
      },
    ],
  },
};

/** Marketing agency — service offerings accordion */
export const MarketingServices: Story = {
  args: {
    headline: "How We Help You Grow",
    items: [
      {
        title: "Brand Strategy",
        description:
          "We define your positioning, messaging framework, and visual identity so every customer touchpoint tells a consistent story. Engagements start with a two-week discovery sprint.",
        ctaText: "Learn more",
        ctaUrl: "/services/brand",
        image: "https://placehold.co/700x500",
        imageAlt:
          "Mood board with typography samples, color swatches, and logo concepts",
      },
      {
        title: "Performance Marketing",
        description:
          "Paid search, social advertising, and programmatic campaigns managed by certified specialists. We optimize for ROAS weekly and report on every dollar spent.",
        ctaText: "See results",
        ctaUrl: "/services/performance",
        image: "https://placehold.co/700x500",
        imageAlt:
          "Dashboard showing ad spend, conversions, and return on ad spend metrics",
      },
      {
        title: "Content Production",
        description:
          "Blog articles, video scripts, email sequences, and social posts produced by writers who understand SEO and your industry. Content calendars delivered monthly.",
        ctaText: "View samples",
        ctaUrl: "/services/content",
        image: "https://placehold.co/700x500",
        imageAlt:
          "Content creator filming with a professional camera in a studio setup",
      },
      {
        title: "Web Design and Development",
        description:
          "Conversion-optimized websites built on modern frameworks with CMS integration. From landing pages to full e-commerce builds, designed mobile-first and launched in weeks.",
        ctaText: "Start a project",
        ctaUrl: "/services/web",
        image: "https://placehold.co/700x500",
        imageAlt:
          "Designer reviewing website mockups on a large desktop monitor",
      },
    ],
  },
};

/** Coworking space — membership tiers explained */
export const CoworkingMemberships: Story = {
  args: {
    headline: "Find Your Space",
    subheadline:
      "Flexible memberships designed around the way you work, whether you need a quiet desk or a full private office.",
    defaultOpenIndex: 1,
    items: [
      {
        title: "Hot Desk",
        description:
          "Drop in any time during business hours and grab any available desk. Includes high-speed WiFi, coffee, and access to communal meeting rooms. No commitment required.",
        ctaText: "Book a day pass",
        ctaUrl: "/memberships/hot-desk",
        image: "https://placehold.co/700x500",
        imageAlt:
          "Open coworking floor with natural light and people working at shared tables",
      },
      {
        title: "Dedicated Desk",
        description:
          "Your own reserved desk with lockable storage, 24/7 building access, and mail handling. Ideal for freelancers and remote workers who want a consistent setup without the overhead of a lease.",
        ctaText: "Reserve your desk",
        ctaUrl: "/memberships/dedicated",
        image: "https://placehold.co/700x500",
        imageAlt:
          "Individual desk setup with monitor, keyboard, and personal items in a quiet zone",
      },
      {
        title: "Private Office",
        description:
          "Fully enclosed offices for teams of 2 to 20. Furnished, soundproofed, and brandable. Includes all amenities plus a dedicated phone line, guest reception, and priority booking for event spaces.",
        ctaText: "Schedule a tour",
        ctaUrl: "/memberships/office",
        image: "https://placehold.co/700x500",
        imageAlt:
          "Glass-walled private office with a team collaborating inside a modern building",
      },
    ],
  },
};
