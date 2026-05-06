import type { Meta, StoryObj } from "@storybook/react";
import PricingMonthlyAnnualToggle from "./index";

const meta: Meta<typeof PricingMonthlyAnnualToggle> = {
  title: "Pricing/PricingMonthlyAnnualToggle",
  component: PricingMonthlyAnnualToggle,
  parameters: { layout: "fullscreen" },
  argTypes: {
    styleKit: { control: "object" },
    defaultCycle: {
      control: "select",
      options: ["monthly", "annual"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof PricingMonthlyAnnualToggle>;

/** Project-management SaaS — three plans, default monthly, drawOutline CTA. */
export const SaasThreePlan: Story = {
  args: {
    label: "Pricing",
    headline: "Pick the plan, pick the cycle, get to work",
    description:
      "Annual saves about 18% across plans, but monthly is honest about the start. Switch any time without rebilling.",
    annualDiscountBadge: "Save 18%",
    defaultCycle: "monthly",
    styleKit: { ctaVariant: "drawOutline", ctaColorScheme: "primary" },
    plans: [
      {
        name: "Solo",
        description: "For one founder validating an idea.",
        monthlyPrice: "$22",
        annualPrice: "$18",
        annualTotal: "$216 billed yearly",
        ctaText: "Try free",
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
        monthlyPrice: "$74",
        annualPrice: "$59",
        annualTotal: "$708 billed yearly",
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
        monthlyPrice: "$236",
        annualPrice: "$199",
        annualTotal: "$2,388 billed yearly",
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
      "All plans include a 14-day trial. Annual rate locks for the duration of the term.",
  },
};

/** Brazilian fintech — three plans, default annual, slide CTA, BRL pricing. */
export const FintechAnnualBR: Story = {
  args: {
    label: "Planos",
    headline: "Mensal ou anual — escolha como prefere pagar",
    description:
      "O anual sai 22% mais barato e fixa a tarifa pelos 12 meses. O mensal mantém a flexibilidade de cancelar a qualquer momento.",
    monthlyLabel: "Mensal",
    annualLabel: "Anual",
    annualDiscountBadge: "Economize 22%",
    defaultCycle: "annual",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "accent" },
    plans: [
      {
        name: "Empreendedor",
        description: "MEI ou autônomo começando agora.",
        monthlyPrice: "R$ 39",
        annualPrice: "R$ 30",
        annualTotal: "R$ 360 cobrado por ano",
        ctaText: "Começar grátis",
        ctaUrl: "/cadastro?plano=empreendedor",
        features: [
          "1 conta corrente PJ",
          "3 cartões emitidos",
          "PIX ilimitado",
          "Atendimento em horário comercial",
          "-Aprovação multi-usuário",
        ],
      },
      {
        name: "Negócio",
        description: "Pequenas empresas com equipe financeira.",
        monthlyPrice: "R$ 189",
        annualPrice: "R$ 147",
        annualTotal: "R$ 1.764 cobrado por ano",
        badge: "Mais escolhido",
        featured: true,
        ctaText: "Testar Negócio",
        ctaUrl: "/cadastro?plano=negocio",
        features: [
          "5 contas e 30 cartões",
          "Aprovação em 3 níveis",
          "Webhooks customizáveis",
          "Atendimento 12h / 7 dias",
          "Integração com Omie e Bling",
        ],
      },
      {
        name: "Empresa",
        description: "Operações reguladas com governança.",
        monthlyPrice: "R$ 749",
        annualPrice: "R$ 584",
        annualTotal: "R$ 7.008 cobrado por ano",
        ctaText: "Falar com vendas",
        ctaUrl: "/contato?plano=empresa",
        features: [
          "Contas e cartões ilimitados",
          "Aprovações ilimitadas",
          "Integração SAP B1 / Oracle EBS",
          "Atendimento 24/7 com gerente",
          "ISO 27001 + SOC 2 Tipo II",
        ],
      },
    ],
    footnote:
      "Migração entre planos é livre e não exige nova contratação. Tarifas em reais incluem impostos.",
  },
};

/** Newsletter membership — two plans, dotExpand CTA, leaner cycle. */
export const NewsletterTwoPlan: Story = {
  args: {
    label: "Membership",
    headline: "Two tiers, two cycles, no surprise charges",
    description:
      "Monthly is for testing the room. Annual saves you about a month and a half a year.",
    annualDiscountBadge: "Save ~14%",
    defaultCycle: "monthly",
    styleKit: { ctaVariant: "dotExpand", ctaColorScheme: "primary" },
    plans: [
      {
        name: "Reader",
        description: "Weekly essay, comments, and the archive.",
        monthlyPrice: "$6",
        annualPrice: "$5",
        annualTotal: "$60 billed yearly",
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
        monthlyPrice: "$22",
        annualPrice: "$19",
        annualTotal: "$228 billed yearly",
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
      "Switching cycle is free and prorates to the day. Cancel from the same page you signed up on.",
  },
};

/** Cloud platform — four editions, glow CTA, default annual. */
export const CloudFourEdition: Story = {
  args: {
    label: "Editions",
    headline: "Pay annually, save a quarter, lock the rate",
    description:
      "Annual editions discount 24% across the catalog and freeze the per-seat price for the term. Monthly stays available for short engagements.",
    annualDiscountBadge: "24% off",
    defaultCycle: "annual",
    styleKit: { ctaVariant: "glow", ctaColorScheme: "neutral" },
    plans: [
      {
        name: "Developer",
        description: "Single-user sandboxed regions.",
        monthlyPrice: "$0",
        annualPrice: "$0",
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
        monthlyPrice: "$148",
        annualPrice: "$112",
        annualTotal: "$1,344 / seat / year",
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
        monthlyPrice: "$312",
        annualPrice: "$237",
        annualTotal: "$2,844 / seat / year",
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
        monthlyPrice: "Custom",
        annualPrice: "Custom",
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
      "Sovereign is always quoted bespoke; the toggle is informational for that edition.",
  },
};
