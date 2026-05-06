import type { Meta, StoryObj } from "@storybook/react";
import IconFeatureGrid from "./index";

const meta: Meta<typeof IconFeatureGrid> = {
  title: "Layouts/Grid/IconFeatureGrid",
  component: IconFeatureGrid,
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: { control: "select", options: ["bento", "zigzag"] },
    styleKit: { control: "object" },
  },
};
export default meta;
type Story = StoryObj<typeof IconFeatureGrid>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Developer platform — bento, lead build-speed claim emphasized */
export const DeveloperPlatform: Story = {
  args: {
    label: "Platform",
    headline: "Everything an engineering team needs, on one bill",
    description:
      "Replace the patchwork of CI runners, observability dashboards, and access-control tools with a single platform your finance team can spell.",
    variant: "bento",
    ctaText: "Read the architecture brief",
    ctaUrl: "/architecture",
    styleKit: { ctaVariant: "default", ctaColorScheme: "primary" },
    features: [
      {
        icon: "zap",
        title: "Builds finish in 47 seconds across the monorepo",
        description:
          "Incremental compilation means saving a single file rebuilds only the affected workspace — not the 312 packages downstream.",
        emphasize: true,
      },
      {
        icon: "shield",
        title: "SOC 2 Type II from day one",
        description:
          "Security posture inherited from a parent platform audited annually — no compliance retrofit when you grow up.",
      },
      {
        icon: "branch",
        title: "Preview URLs per pull request",
        description:
          "Every branch gets a deploy with production-like data, shareable with non-engineering stakeholders before merge.",
      },
      {
        icon: "chart",
        title: "Built-in observability",
        description:
          "Traces, logs, and request-rate metrics in one timeline. Correlate a slow API to the offending DB call in two clicks.",
      },
      {
        icon: "users",
        title: "Designed for teams of 4 to 40",
        description:
          "Granular RBAC, environment scoping, and audit logs that scale from founding team to a 40-person engineering org.",
      },
    ],
  },
};

/** Brazilian agency services — zigzag, slide CTA */
export const AgencyServicesBR: Story = {
  args: {
    label: "Como ajudamos",
    headline: "Capacidades cruzadas entre estratégia, design e código",
    description:
      "Trabalhamos por sprints fechados — cada quadrante abaixo tem um lead próprio e um entregável definido na primeira reunião.",
    variant: "zigzag",
    ctaText: "Ver portfólio recente",
    ctaUrl: "/portfolio",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "accent" },
    features: [
      {
        icon: "compass",
        title: "Estratégia de produto",
        description:
          "Workshops de descoberta, mapas de jornada e priorização de roadmap junto com o C-level — saída em 2 semanas.",
      },
      {
        icon: "layers",
        title: "Identidade e sistema de design",
        description:
          "Marca, paleta, tipografia e tokens em Figma e código. Inclui handoff técnico para o time interno do cliente.",
      },
      {
        icon: "cpu",
        title: "Desenvolvimento web",
        description:
          "Sites institucionais e produtos em Next.js + headless CMS, hospedados em Vercel ou AWS conforme a stack do cliente.",
      },
      {
        icon: "trending",
        title: "Otimização contínua",
        description:
          "Após o lançamento, três meses de monitoramento, ajustes de performance e iterações guiadas por dados de uso real.",
      },
    ],
  },
};

/** Healthcare benefits — bento, four benefits, dotExpand CTA */
export const HealthcareBenefits: Story = {
  args: {
    label: "Why patients choose us",
    headline: "Care that respects your time and your insurance card",
    description:
      "Four commitments we put on the front page so you can hold us to them when you walk through the door.",
    variant: "bento",
    ctaText: "Schedule a visit",
    ctaUrl: "/appointments",
    styleKit: { ctaVariant: "dotExpand", ctaColorScheme: "secondary" },
    features: [
      {
        icon: "clock",
        title: "Same-week appointments for 86% of new patients",
        description:
          "We hold morning slots open for new-patient bookings and publish wait-time metrics on the appointments page every Monday.",
        emphasize: true,
      },
      {
        icon: "heart",
        title: "Board-certified providers across 6 specialties",
        description:
          "Family medicine, pediatrics, dermatology, orthopedics, cardiology, and women's health — all under one roof.",
      },
      {
        icon: "shield",
        title: "Most major insurance plans accepted",
        description:
          "We file directly with 38 insurers and verify coverage before your visit — no surprise bills, no patient-side haggling.",
      },
      {
        icon: "users",
        title: "Bilingual staff at every front desk",
        description:
          "English, Spanish, and Portuguese supported across all four metro locations — including evening urgent-care hours.",
      },
    ],
  },
};

/** SaaS analytics — zigzag, six benefits, drawOutline CTA */
export const SaasAnalytics: Story = {
  args: {
    label: "What you get",
    headline: "Six things that change after you instrument your stack",
    variant: "zigzag",
    ctaText: "See it on your data",
    ctaUrl: "/demo",
    styleKit: { ctaVariant: "drawOutline", ctaColorScheme: "primary" },
    features: [
      {
        icon: "target",
        title: "Funnel anomalies caught the same morning",
        description:
          "Custom alerts fire when conversion deviates more than 12% from a 28-day rolling baseline — Slack first, email second.",
      },
      {
        icon: "chart",
        title: "Cohort retention without a SQL ticket",
        description:
          "Drag-drop cohort builder for product, marketing, and CS teams. Engineering reviews definitions; non-engineers ship reports.",
      },
      {
        icon: "globe",
        title: "Self-serve data residency",
        description:
          "Pin a workspace to EU, US-East, or Brazil regions from settings. Replication is opt-in and auditable, not a hidden default.",
      },
      {
        icon: "lock",
        title: "PII redaction by default",
        description:
          "Email, phone, and ID-shaped fields are auto-redacted at ingest. Auditable allowlist for fields that need to remain plaintext.",
      },
      {
        icon: "branch",
        title: "Native dbt integration",
        description:
          "Models tracked alongside instrumentation. Lineage visualises which dashboards depend on which models so refactors don't break reporting.",
      },
      {
        icon: "award",
        title: "ISO 27001 and HIPAA-ready",
        description:
          "Pass-through compliance posture for regulated industries. BAA available on the Business plan and above.",
      },
    ],
  },
};
