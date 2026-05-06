import type { Meta, StoryObj } from "@storybook/react";
import PricingComparisonTable from "./index";

const meta: Meta<typeof PricingComparisonTable> = {
  title: "Pricing/PricingComparisonTable",
  component: PricingComparisonTable,
  parameters: { layout: "fullscreen" },
  argTypes: {
    styleKit: { control: "object" },
  },
};
export default meta;
type Story = StoryObj<typeof PricingComparisonTable>;

/** Project-management SaaS — three plans, drawOutline CTA, full feature matrix. */
export const SaasThreePlan: Story = {
  args: {
    label: "Compare plans",
    headline: "Every limit, every plan, on one page",
    description:
      "Useful when procurement asks for the full footprint and a brochure card no longer cuts it.",
    styleKit: { ctaVariant: "drawOutline", ctaColorScheme: "primary" },
    columns: [
      {
        name: "Solo",
        price: "$22",
        cadence: "/mo",
        ctaText: "Try free",
        ctaUrl: "/signup?plan=solo",
      },
      {
        name: "Studio",
        price: "$74",
        cadence: "/mo",
        badge: "Most chosen",
        featured: true,
        ctaText: "Try Studio free",
        ctaUrl: "/signup?plan=studio",
      },
      {
        name: "Scale",
        price: "$236",
        cadence: "/mo",
        ctaText: "Talk to sales",
        ctaUrl: "/contact?plan=scale",
      },
    ],
    groups: [
      {
        title: "Limits",
        rows: [
          { label: "Active projects", values: ["1", "Unlimited", "Unlimited"] },
          { label: "Asset storage", values: ["8 GB", "120 GB", "1 TB"] },
          { label: "Seats included", values: ["1", "5", "25"] },
          {
            label: "Branch previews / month",
            values: ["10", "240", "Unlimited"],
          },
        ],
      },
      {
        title: "Collaboration",
        rows: [
          { label: "Custom domains", values: [false, true, true] },
          { label: "Workspaces", values: [false, true, true] },
          { label: "Shared Slack channel", values: [false, true, true] },
          { label: "Public roadmap voting", values: [false, true, true] },
        ],
      },
      {
        title: "Security & support",
        rows: [
          { label: "Email support", values: ["48h", "12h", "12h"] },
          { label: "SSO and audit logs", values: [false, false, true] },
          {
            label: "Uptime guarantee",
            hint: "Service-credit refund when missed.",
            values: ["99.5%", "99.9%", "99.95%"],
          },
          { label: "Dedicated success engineer", values: [false, false, true] },
        ],
      },
    ],
    footnote:
      "Numbers reflect a single workspace. Workspace add-ons available on Studio and above.",
  },
};

/** Brazilian fintech — three plans, BRL pricing, slide CTA. */
export const FintechBR: Story = {
  args: {
    label: "Comparar planos",
    headline: "Quanto custa cada plano e o que cada um entrega",
    description:
      "Tabela completa para times que precisam aprovar com financeiro e jurídico antes de assinar.",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "accent" },
    columns: [
      {
        name: "Empreendedor",
        price: "R$ 39",
        cadence: "/mês",
        ctaText: "Começar grátis",
        ctaUrl: "/cadastro?plano=empreendedor",
      },
      {
        name: "Negócio",
        price: "R$ 189",
        cadence: "/mês",
        badge: "Mais escolhido",
        featured: true,
        ctaText: "Testar Negócio",
        ctaUrl: "/cadastro?plano=negocio",
      },
      {
        name: "Empresa",
        price: "R$ 749",
        cadence: "/mês",
        ctaText: "Falar com vendas",
        ctaUrl: "/contato?plano=empresa",
      },
    ],
    groups: [
      {
        title: "Operação",
        rows: [
          { label: "Contas correntes", values: ["1", "5", "25"] },
          { label: "Cartões emitidos", values: ["3", "30", "Ilimitado"] },
          {
            label: "Aprovadores por transação",
            values: ["1", "3", "Ilimitado"],
          },
        ],
      },
      {
        title: "Integrações",
        rows: [
          { label: "API REST", values: [true, true, true] },
          { label: "Webhooks customizáveis", values: [false, true, true] },
          { label: "ERP (Omie, Sankhya, Bling)", values: [false, true, true] },
          { label: "SAP B1 / Oracle EBS", values: [false, false, true] },
        ],
      },
      {
        title: "Suporte e segurança",
        rows: [
          {
            label: "Atendimento humano",
            values: ["Horário comercial", "12h / 7 dias", "24/7"],
          },
          { label: "Gerente de conta", values: [false, false, true] },
          { label: "ISO 27001 + SOC 2 Tipo II", values: [true, true, true] },
        ],
      },
    ],
    footnote:
      "Todos os planos incluem PIX ilimitado e relatório fiscal mensal exportável em XML.",
  },
};

/** Newsletter membership — two columns, dotExpand CTA. */
export const NewsletterTwoPlan: Story = {
  args: {
    label: "Compare tiers",
    headline: "Reader vs Insider",
    description:
      "What you get and what you skip, line by line. Switch any time, cancel from the same page.",
    styleKit: { ctaVariant: "dotExpand", ctaColorScheme: "primary" },
    columns: [
      {
        name: "Reader",
        price: "$6",
        cadence: "/mo",
        ctaText: "Become a Reader",
        ctaUrl: "/subscribe?tier=reader",
      },
      {
        name: "Insider",
        price: "$22",
        cadence: "/mo",
        badge: "Pays the rent",
        featured: true,
        ctaText: "Become an Insider",
        ctaUrl: "/subscribe?tier=insider",
      },
    ],
    groups: [
      {
        title: "Reading",
        rows: [
          { label: "Weekly Sunday essay", values: [true, true] },
          { label: "Full archive since 2021", values: [true, true] },
          { label: "Audio narrations", values: [false, true] },
        ],
      },
      {
        title: "Community",
        rows: [
          { label: "Comment threads", values: [true, true] },
          { label: "Monthly group video call", values: [false, true] },
          { label: "Private Discord (312 members)", values: [false, true] },
        ],
      },
      {
        title: "Direct access",
        rows: [
          { label: "Quarterly 1:1 office hours", values: [false, true] },
          { label: "Early workshop access", values: [false, true] },
          { label: "Manuscript reviews", values: [false, false] },
        ],
      },
    ],
    footnote:
      "Discord access expires 24h after cancellation. Receipts available for tax filing.",
  },
};

/** Cloud platform — four editions, glow CTA, technical bullets. */
export const CloudFourEdition: Story = {
  args: {
    label: "Editions",
    headline: "Sandbox to regulated production, on one platform",
    description:
      "Pick the edition that matches your compliance footprint. The same APIs run in every edition.",
    styleKit: { ctaVariant: "glow", ctaColorScheme: "neutral" },
    columns: [
      {
        name: "Developer",
        price: "$0",
        cadence: "free",
        ctaText: "Open console",
        ctaUrl: "/console",
      },
      {
        name: "Team",
        price: "$148",
        cadence: "/seat",
        ctaText: "Start trial",
        ctaUrl: "/signup?edition=team",
      },
      {
        name: "Business",
        price: "$312",
        cadence: "/seat",
        badge: "Most deployed",
        featured: true,
        ctaText: "Talk to sales",
        ctaUrl: "/contact?edition=business",
      },
      {
        name: "Sovereign",
        price: "Custom",
        ctaText: "Briefing",
        ctaUrl: "/contact?edition=sovereign",
      },
    ],
    groups: [
      {
        title: "Compute",
        rows: [
          {
            label: "Production regions",
            values: [false, "US, EU", "12 regions", "Customer-chosen"],
          },
          {
            label: "Egress / month",
            values: ["5 GB", "100 GB", "1 TB", "Unmetered"],
          },
          {
            label: "Burst concurrency",
            values: ["10", "120", "1,200", "Custom"],
          },
        ],
      },
      {
        title: "Security",
        rows: [
          { label: "SSO + SCIM", values: [false, false, true, true] },
          { label: "Audit logs", values: [false, false, true, true] },
          {
            label: "Customer-managed keys (HSM)",
            values: [false, false, false, true],
          },
          { label: "Air-gapped deploy", values: [false, false, false, true] },
        ],
      },
      {
        title: "Compliance & support",
        rows: [
          {
            label: "Certifications",
            values: ["—", "ISO 27001", "ISO 27001, SOC 2", "FedRAMP-aligned"],
          },
          {
            label: "Support SLA",
            values: ["Community", "12h", "30-min · 24/7", "30-min · 24/7"],
          },
          { label: "Dedicated TAM", values: [false, false, true, true] },
        ],
      },
    ],
    footnote:
      "Promotion between editions never requires a rewrite — APIs are stable across the entire matrix.",
  },
};
