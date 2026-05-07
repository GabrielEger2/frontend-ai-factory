import type { Meta, StoryObj } from "@storybook/react";
import PricingTiers from "./index";

const meta: Meta<typeof PricingTiers> = {
  title: "Layout/Grid/PricingTiers",
  component: PricingTiers,
  parameters: { layout: "fullscreen" },
  argTypes: {
    styleKit: { control: "object" },
  },
};
export default meta;
type Story = StoryObj<typeof PricingTiers>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS — three tiers, monthly billing, featured Studio plan. Drawer CTA. */
export const SaasThreeTier: Story = {
  args: {
    label: "Pricing",
    headline: "Plans that scale with the team you actually have",
    description:
      "Start solo, add seats when collaboration starts costing more than the tool. No per-feature gating below Scale.",
    billingToggle: { monthly: "Monthly", yearly: "Yearly · save 18%" },
    styleKit: { ctaVariant: "drawOutline", ctaColorScheme: "primary" },
    tiers: [
      {
        name: "Starter",
        description: "For solo builders validating an idea.",
        price: "$24",
        cadence: "/month",
        ctaText: "Start free trial",
        ctaUrl: "/signup?plan=starter",
        features: [
          "Up to 3 active projects",
          "5 GB asset storage",
          "Email support within 48h",
          "-Custom domains",
          "-SSO and SAML",
        ],
      },
      {
        name: "Studio",
        description: "For small teams shipping every week.",
        price: "$79",
        cadence: "/month",
        badge: "Most chosen",
        featured: true,
        ctaText: "Start free trial",
        ctaUrl: "/signup?plan=studio",
        features: [
          "Unlimited active projects",
          "100 GB asset storage",
          "Custom domains and redirects",
          "Shared Slack support channel",
          "-SSO and SAML",
        ],
      },
      {
        name: "Scale",
        description: "For growing companies with security needs.",
        price: "$249",
        cadence: "/month",
        ctaText: "Talk to sales",
        ctaUrl: "/contact?intent=scale",
        features: [
          "Everything in Studio",
          "1 TB asset storage",
          "SSO, SAML, audit logs",
          "Dedicated success engineer",
          "99.95% uptime SLA",
        ],
      },
    ],
    footnote:
      "All plans include a 14-day trial. No credit card required to start.",
  },
};

/** Brazilian agency — productised services, BRL pricing, slide CTA. */
export const AgencyServicesBR: Story = {
  args: {
    label: "Pacotes",
    headline: "Escopo claro, prazo curto, preço fechado",
    description:
      "Pacotes prontos para quem precisa de identidade, site ou rebrand sem três rodadas de discovery antes de saber o orçamento.",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "accent" },
    tiers: [
      {
        name: "Identidade Express",
        description: "Marca completa em duas semanas.",
        price: "R$ 9.840",
        cadence: "projeto fechado",
        ctaText: "Agendar diagnóstico",
        ctaUrl: "/diagnostico",
        features: [
          "Logotipo principal e versões",
          "Paleta de cores e tipografia",
          "Manual de marca em PDF",
          "2 rodadas de revisão",
          "-Site institucional",
        ],
      },
      {
        name: "Site Studio",
        description: "Identidade + landing page convertendo.",
        price: "R$ 18.470",
        cadence: "projeto fechado",
        badge: "Mais pedido",
        featured: true,
        ctaText: "Agendar diagnóstico",
        ctaUrl: "/diagnostico",
        features: [
          "Tudo do Identidade Express",
          "Landing page de 1 página",
          "Copy estratégica para a home",
          "SEO técnico e tags Open Graph",
          "Hospedagem no primeiro ano",
        ],
      },
      {
        name: "Plataforma",
        description: "Site institucional completo + CMS.",
        price: "Sob consulta",
        ctaText: "Conversar com o time",
        ctaUrl: "/contato",
        features: [
          "Tudo do Site Studio",
          "Até 12 páginas",
          "CMS para o time editar sozinho",
          "Integração com CRM e analytics",
          "3 meses de suporte pós-entrega",
        ],
      },
    ],
    footnote:
      "Trabalhamos com no máximo 4 projetos simultâneos para preservar a qualidade.",
  },
};

/** Creator economy — two tiers, dot expand CTA, focused on transparency. */
export const CreatorTwoTier: Story = {
  args: {
    label: "Membership",
    headline: "Two tiers. No upsells. No surprise charges.",
    description:
      "Pick the level that fits how you read this newsletter today. Switch any time, cancel from the same page.",
    styleKit: { ctaVariant: "dotExpand", ctaColorScheme: "primary" },
    tiers: [
      {
        name: "Reader",
        description: "Weekly essay, comments, and the archive.",
        price: "$6",
        cadence: "/month",
        ctaText: "Become a Reader",
        ctaUrl: "/subscribe?tier=reader",
        features: [
          "Weekly essay every Sunday",
          "Full archive since 2021",
          "Comment threads on every post",
          "-Monthly group video call",
          "-Private Discord room",
        ],
      },
      {
        name: "Insider",
        description: "Add the live calls and the private room.",
        price: "$22",
        cadence: "/month",
        badge: "Pays the rent",
        featured: true,
        ctaText: "Become an Insider",
        ctaUrl: "/subscribe?tier=insider",
        features: [
          "Everything in Reader",
          "Monthly group video call",
          "Private Discord room with 312 members",
          "Quarterly 1:1 office hours",
          "Early access to live workshops",
        ],
      },
    ],
    footnote:
      "Receipts available for tax filing. Discord access expires 24h after cancellation.",
  },
};

/** Enterprise IT — four tiers, technical bullets, default CTA, yearly toggle. */
export const EnterpriseFourTier: Story = {
  args: {
    label: "Editions",
    headline: "From sandbox to regulated production",
    description:
      "Pick the edition that matches your compliance footprint. Move between editions without rebuilding workloads.",
    billingToggle: {
      monthly: "Monthly",
      yearly: "Yearly · 22% off",
      activeIsYearly: true,
    },
    styleKit: { ctaVariant: "default", ctaColorScheme: "neutral" },
    tiers: [
      {
        name: "Developer",
        description: "Single-user, sandboxed regions.",
        price: "$0",
        cadence: "free forever",
        ctaText: "Open the console",
        ctaUrl: "/console",
        features: [
          "1 sandbox project",
          "5 GB egress per month",
          "Community Discord",
          "-Production regions",
          "-Audit logs",
        ],
      },
      {
        name: "Team",
        description: "Up to 12 collaborators.",
        price: "$148",
        cadence: "/seat / month",
        ctaText: "Start trial",
        ctaUrl: "/signup?edition=team",
        features: [
          "Unlimited sandbox projects",
          "Production region (US, EU)",
          "100 GB egress per month",
          "Email support · 12h SLA",
          "-Audit logs and SCIM",
        ],
      },
      {
        name: "Business",
        description: "For regulated workloads up to 250 seats.",
        price: "$312",
        cadence: "/seat / month",
        badge: "Most deployed",
        featured: true,
        ctaText: "Talk to sales",
        ctaUrl: "/contact?edition=business",
        features: [
          "Everything in Team",
          "SOC 2 Type II, ISO 27001",
          "SSO, SCIM, audit logs",
          "Dedicated TAM",
          "99.95% uptime SLA",
        ],
      },
      {
        name: "Sovereign",
        description: "Air-gapped or regional residency.",
        price: "Custom",
        ctaText: "Request a briefing",
        ctaUrl: "/contact?edition=sovereign",
        features: [
          "Everything in Business",
          "FedRAMP-aligned region",
          "Customer-managed keys (HSM)",
          "On-prem and air-gapped options",
          "24/7 support · 30-min SLA",
        ],
      },
    ],
    footnote:
      "All editions ship with the same APIs, so promotion between editions never requires a rewrite.",
  },
};
