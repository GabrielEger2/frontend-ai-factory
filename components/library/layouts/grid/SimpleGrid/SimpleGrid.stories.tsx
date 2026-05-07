import type { Meta, StoryObj } from "@storybook/react";
import SimpleGrid from "./index";

const meta: Meta<typeof SimpleGrid> = {
  title: "Layout/Grid/SimpleGrid",
  component: SimpleGrid,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    styleKit: {
      control: "object",
      description:
        "Site-wide visual configuration — CTA variant and color scheme.",
    },
    columns: {
      control: "select",
      options: [2, 3, 4],
    },
  },
};
export default meta;
type Story = StoryObj<typeof SimpleGrid>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS platform — four capabilities with glow CTA */
export const SaasCapabilities: Story = {
  args: {
    label: "Platform",
    headline: "Everything Your Engineering Team Needs",
    description:
      "One platform that replaces your patchwork of CI tools, monitoring dashboards, and deployment scripts.",
    columns: 4,
    ctaText: "Start Free Trial",
    ctaUrl: "/signup",
    styleKit: { ctaVariant: "glow", ctaColorScheme: "accent" },
    features: [
      {
        title: "Preview Environments",
        description:
          "Every pull request gets its own isolated preview URL with production-like data, so reviewers test real behavior before merging.",
        ctaText: "Learn more",
        ctaUrl: "/features/previews",
      },
      {
        title: "Edge Functions",
        description:
          "Run server logic at the network edge with sub-10ms cold starts. No provisioning, no containers, no configuration files to maintain.",
      },
      {
        title: "Integrated Observability",
        description:
          "Traces, logs, and metrics flow into a single dashboard. Correlate a slow API call to the exact database query in two clicks.",
        ctaText: "See demo",
        ctaUrl: "/features/observability",
      },
      {
        title: "Fine-Grained RBAC",
        description:
          "Workspace, project, and environment-level permissions with SSO and SCIM provisioning ready out of the box.",
      },
    ],
  },
};

/** Creative agency — three service pillars with slide CTA */
export const AgencyServices: Story = {
  args: {
    label: "Services",
    headline: "Strategy, Design, and Code Under One Roof",
    description:
      "We partner with ambitious brands to craft digital experiences that look remarkable and perform even better.",
    columns: 3,
    ctaText: "View Our Work",
    ctaUrl: "/portfolio",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "primary" },
    features: [
      {
        title: "Brand Identity",
        description:
          "From naming and logo design to full visual systems, we build identities that differentiate you in crowded markets and scale across every touchpoint.",
        ctaText: "Our process",
        ctaUrl: "/services/branding",
      },
      {
        title: "Product Design",
        description:
          "User research, wireframing, prototyping, and usability testing — we design interfaces that feel intuitive from the first interaction.",
        ctaText: "Case studies",
        ctaUrl: "/services/product-design",
      },
      {
        title: "Full-Stack Development",
        description:
          "Performant web applications built with modern frameworks, serverless infrastructure, and CI/CD pipelines that ship with confidence.",
        ctaText: "Tech stack",
        ctaUrl: "/services/development",
      },
    ],
  },
};

/** Early-stage startup — two-column benefit list with drawOutline CTA */
export const StartupBenefits: Story = {
  args: {
    headline: "Why Founders Choose Us",
    description:
      "We have helped 120+ startups go from idea to launched product in under twelve weeks.",
    columns: 2,
    ctaText: "Apply to the Program",
    ctaUrl: "/apply",
    styleKit: { ctaVariant: "drawOutline", ctaColorScheme: "accent" },
    features: [
      {
        title: "Speed to Market",
        description:
          "Our sprint-based process compresses months of discovery and development into focused weekly cycles with clear deliverables.",
      },
      {
        title: "Investor-Ready Output",
        description:
          "Every engagement produces a functional prototype, a metrics dashboard, and a pitch-ready demo that speaks the language VCs expect.",
      },
      {
        title: "Embedded Technical Leadership",
        description:
          "A senior engineer joins your team part-time to mentor junior developers, review architecture decisions, and prevent costly rewrites.",
      },
      {
        title: "Post-Launch Support",
        description:
          "Three months of included maintenance, performance monitoring, and on-call support so you can focus on growth instead of firefighting.",
      },
    ],
  },
};

/** Medical clinic — four specialty offerings with dotExpand CTA */
export const ClinicOfferings: Story = {
  args: {
    label: "Specialties",
    headline: "Comprehensive Care for the Whole Family",
    description:
      "Board-certified physicians and state-of-the-art facilities across four locations in the metro area.",
    columns: 4,
    ctaText: "Book an Appointment",
    ctaUrl: "/appointments",
    styleKit: { ctaVariant: "dotExpand", ctaColorScheme: "secondary" },
    features: [
      {
        title: "Family Medicine",
        description:
          "Preventive care, annual physicals, and chronic disease management for patients of all ages from a single trusted provider.",
        ctaText: "Meet our doctors",
        ctaUrl: "/specialties/family-medicine",
      },
      {
        title: "Pediatrics",
        description:
          "Well-child visits, vaccinations, and developmental screenings in a warm, kid-friendly environment designed to put young patients at ease.",
        ctaText: "Learn more",
        ctaUrl: "/specialties/pediatrics",
      },
      {
        title: "Orthopedics",
        description:
          "Sports injuries, joint replacements, and rehabilitation programs guided by advanced imaging and minimally invasive surgical techniques.",
        ctaText: "Treatment options",
        ctaUrl: "/specialties/orthopedics",
      },
      {
        title: "Dermatology",
        description:
          "Medical and cosmetic dermatology including skin cancer screening, acne treatment, and laser therapy with same-week availability.",
        ctaText: "Schedule a visit",
        ctaUrl: "/specialties/dermatology",
      },
    ],
  },
};
