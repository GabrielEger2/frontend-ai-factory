import type { Meta, StoryObj } from "@storybook/react";
import PricingTierCards from "./index";

const meta: Meta<typeof PricingTierCards> = {
  title: "Pricing/PricingTierCards",
  component: PricingTierCards,
  parameters: { layout: "fullscreen" },
  argTypes: {
    styleKit: { control: "object" },
  },
};
export default meta;
type Story = StoryObj<typeof PricingTierCards>;

/** Project-management SaaS — three tiers, monthly billing, drawOutline CTA. */
export const ThreeTierSaas: Story = {
  args: {
    label: "Pricing",
    headline: "Plans that scale with the team you actually have",
    description:
      "Start solo, add seats when collaboration starts costing more than the tool. Below Scale, no per-feature gating.",
    styleKit: { ctaVariant: "drawOutline", ctaColorScheme: "primary" },
    tiers: [
      {
        name: "Solo",
        description: "For one founder validating an idea.",
        price: "$22",
        cadence: "/month",
        ctaText: "Try it free",
        ctaUrl: "/signup?plan=solo",
        features: [
          "1 active project",
          "8 GB asset storage",
          "Email support · 48h reply",
          "-Custom domains",
          "-Workspaces",
        ],
      },
      {
        name: "Studio",
        description: "Small teams shipping every week.",
        price: "$74",
        cadence: "/month",
        badge: "Most chosen",
        featured: true,
        ctaText: "Try Studio free",
        ctaUrl: "/signup?plan=studio",
        features: [
          "Unlimited projects",
          "120 GB asset storage",
          "Custom domains and redirects",
          "Shared Slack support channel",
          "-SSO and audit logs",
        ],
      },
      {
        name: "Scale",
        description: "Growing companies with security needs.",
        price: "$236",
        cadence: "/month",
        ctaText: "Talk to sales",
        ctaUrl: "/contact?plan=scale",
        features: [
          "Everything in Studio",
          "1 TB asset storage",
          "SSO, SAML, audit logs",
          "Dedicated success engineer",
          "99.95% uptime guarantee",
        ],
      },
    ],
    footnote:
      "All plans include a 14-day trial. Cancel from the same page you signed up on.",
  },
};

/** Brazilian agency — productised services, BRL pricing, slide CTA. */
export const AgencyServicesBR: Story = {
  args: {
    label: "Pacotes",
    headline: "Escopo claro, prazo curto, preço fechado",
    description:
      "Pacotes prontos para times que precisam de identidade ou site sem três rodadas de discovery antes de saber o orçamento.",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "accent" },
    tiers: [
      {
        name: "Identidade",
        description: "Marca completa em duas semanas.",
        price: "R$ 9.840",
        cadence: "projeto fechado",
        ctaText: "Agendar diagnóstico",
        ctaUrl: "/diagnostico?escopo=identidade",
        features: [
          "Logotipo principal e versões",
          "Paleta e tipografia",
          "Manual em PDF",
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
        ctaUrl: "/diagnostico?escopo=site",
        features: [
          "Tudo do pacote Identidade",
          "Landing page de 1 página",
          "Copy estratégica para a home",
          "SEO técnico e Open Graph",
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

/** Newsletter membership — two tiers, dotExpand CTA. */
export const NewsletterTwoTier: Story = {
  args: {
    label: "Membership",
    headline: "Two tiers. No upsells, no surprise charges.",
    description:
      "Pick the level that fits how you read the newsletter today. Switch any time, cancel from the same page.",
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
          "Private Discord with 312 members",
          "Quarterly 1:1 office hours",
          "Early access to live workshops",
        ],
      },
    ],
    footnote:
      "Receipts available for tax filing. Discord access expires 24h after cancellation.",
  },
};

/** Cloud platform — four editions, glow CTA, technical bullets. */
export const CloudFourEdition: Story = {
  args: {
    label: "Editions",
    headline: "From sandbox to regulated production",
    description:
      "Pick the edition that matches your compliance footprint. Move between editions without rebuilding workloads.",
    styleKit: { ctaVariant: "glow", ctaColorScheme: "neutral" },
    tiers: [
      {
        name: "Developer",
        description: "Single-user sandboxed regions.",
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
        cadence: "/seat / mo",
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
        description: "Regulated workloads up to 250 seats.",
        price: "$312",
        cadence: "/seat / mo",
        badge: "Most deployed",
        featured: true,
        ctaText: "Talk to sales",
        ctaUrl: "/contact?edition=business",
        features: [
          "Everything in Team",
          "SOC 2 Type II, ISO 27001",
          "SSO, SCIM, audit logs",
          "Dedicated TAM",
          "99.95% uptime guarantee",
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
