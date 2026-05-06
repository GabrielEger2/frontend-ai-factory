import type { Meta, StoryObj } from "@storybook/react";
import PricingFreemiumLadder from "./index";

const meta: Meta<typeof PricingFreemiumLadder> = {
  title: "Pricing/PricingFreemiumLadder",
  component: PricingFreemiumLadder,
  parameters: { layout: "fullscreen" },
  argTypes: {
    styleKit: { control: "object" },
  },
};
export default meta;
type Story = StoryObj<typeof PricingFreemiumLadder>;

/** Developer tool — four steps, drawOutline CTA, classic freemium funnel. */
export const DevToolFourStep: Story = {
  args: {
    label: "Pricing",
    headline: "Free, then up the ladder when it pays off",
    description:
      "Most teams stay on Studio for nine months before they move. The climb only happens when collaboration starts costing more than the tool.",
    styleKit: { ctaVariant: "drawOutline", ctaColorScheme: "primary" },
    steps: [
      {
        name: "Free",
        price: "Free",
        audience: "Hobby projects and weekend builds",
        unlocks: [
          "1 active project",
          "5 GB asset storage",
          "Community Discord support",
        ],
        ctaText: "Start free",
        ctaUrl: "/signup?plan=free",
      },
      {
        name: "Studio",
        price: "$22",
        cadence: "/mo",
        audience: "First paid plan for solo founders",
        unlocks: [
          "Unlimited projects",
          "Custom domains and redirects",
          "Email support · 12h reply",
        ],
        ctaText: "Try Studio",
        ctaUrl: "/signup?plan=studio",
        recommended: true,
      },
      {
        name: "Team",
        price: "$74",
        cadence: "/mo",
        audience: "Small teams shipping every week",
        unlocks: [
          "Up to 5 collaborators",
          "Shared Slack support channel",
          "Branch preview URLs",
        ],
        ctaText: "Try Team",
        ctaUrl: "/signup?plan=team",
      },
      {
        name: "Scale",
        price: "$236",
        cadence: "/mo",
        audience: "Growing companies with security needs",
        unlocks: [
          "SSO, SAML, audit logs",
          "Dedicated success engineer",
          "99.95% uptime guarantee",
        ],
        ctaText: "Talk to sales",
        ctaUrl: "/contact?plan=scale",
      },
    ],
    footnote:
      "Promote up or back down at any time. Annual billing carries an 18% discount on Studio and Team.",
  },
};

/** Creator-economy course platform — three steps, slide CTA, BRL pricing. */
export const CreatorPlatformBR: Story = {
  args: {
    label: "Caminho",
    headline: "Suba o degrau quando fizer sentido — e não antes",
    description:
      "Comece grátis publicando uma aula de teste. O salto para o plano pago só vale quando o curso começa a ter alunos pagantes.",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "accent" },
    steps: [
      {
        name: "Início",
        price: "Grátis",
        audience: "Quem ainda está testando o formato",
        unlocks: [
          "1 curso publicado",
          "Até 12 alunos por turma",
          "Branding de plataforma",
        ],
        ctaText: "Começar grátis",
        ctaUrl: "/cadastro?plano=inicio",
      },
      {
        name: "Criador",
        price: "R$ 89",
        cadence: "/mês",
        audience: "Quem já tem audiência e quer cobrar",
        unlocks: [
          "Cursos ilimitados",
          "Domínio próprio (.com.br ou .com)",
          "Branding personalizado",
        ],
        ctaText: "Testar Criador",
        ctaUrl: "/cadastro?plano=criador",
        recommended: true,
      },
      {
        name: "Estúdio",
        price: "R$ 349",
        cadence: "/mês",
        audience: "Equipes que produzem conteúdo em série",
        unlocks: [
          "Até 5 instrutores",
          "Aulas ao vivo + gravação",
          "Pagamentos via Pix sem taxa extra",
        ],
        ctaText: "Falar com vendas",
        ctaUrl: "/contato?plano=estudio",
      },
    ],
    footnote:
      "Em todos os planos, você fica com 95% da receita líquida. Os 5% pagam infraestrutura e gateway.",
  },
};

/** AI infrastructure — five steps, dotExpand CTA, technical climb. */
export const AiInfraFiveStep: Story = {
  args: {
    label: "Editions",
    headline: "From local notebooks to a fleet of inference workers",
    description:
      "Five rungs from the laptop to a globally-distributed deploy. Each step adds capacity and removes a constraint that started costing engineering time.",
    styleKit: { ctaVariant: "dotExpand", ctaColorScheme: "neutral" },
    steps: [
      {
        name: "Local",
        price: "Free",
        audience: "One developer, one machine",
        unlocks: [
          "CLI + local runtime",
          "1,000 inference calls / day",
          "Community forum",
        ],
        ctaText: "Install CLI",
        ctaUrl: "/install",
      },
      {
        name: "Hobby",
        price: "$18",
        cadence: "/mo",
        audience: "Hosted runtime for side projects",
        unlocks: [
          "1 hosted region",
          "75k inference calls / month",
          "Shared GPU pool · best-effort",
        ],
        ctaText: "Try Hobby",
        ctaUrl: "/signup?edition=hobby",
      },
      {
        name: "Production",
        price: "$148",
        cadence: "/mo",
        audience: "First real deploy with real traffic",
        unlocks: [
          "3 regions (US, EU, AP-SE)",
          "1.2M inference calls / month",
          "Reserved GPU concurrency",
        ],
        ctaText: "Try Production",
        ctaUrl: "/signup?edition=production",
        recommended: true,
      },
      {
        name: "Fleet",
        price: "$612",
        cadence: "/mo",
        audience: "Multi-team with on-call",
        unlocks: [
          "12 regions, autoscaling fleets",
          "Burst to 1k concurrent workers",
          "Audit logs, SSO, SCIM",
        ],
        ctaText: "Talk to sales",
        ctaUrl: "/contact?edition=fleet",
      },
      {
        name: "Sovereign",
        price: "Custom",
        audience: "Regulated or air-gapped deploy",
        unlocks: [
          "Customer-managed keys (HSM)",
          "FedRAMP-aligned region",
          "30-min support SLA · 24/7",
        ],
        ctaText: "Request briefing",
        ctaUrl: "/contact?edition=sovereign",
      },
    ],
    footnote:
      "Inference call counts are post-cache. Hobby and above include 90 days of trace history.",
  },
};

/** Newsletter membership — three steps, glow CTA, leaner ladder. */
export const NewsletterThreeStep: Story = {
  args: {
    label: "Membership",
    headline: "Three rungs — pick the one you actually want",
    description:
      "No free trial gimmick. Reader is meant to stay free forever. Insider funds the operation; Patron underwrites the next book.",
    styleKit: { ctaVariant: "glow", ctaColorScheme: "primary" },
    steps: [
      {
        name: "Reader",
        price: "Free",
        audience: "Anyone who wants the Sunday essay",
        unlocks: [
          "Weekly Sunday essay",
          "Comment threads on every post",
          "Full archive since 2021",
        ],
        ctaText: "Subscribe free",
        ctaUrl: "/subscribe?tier=reader",
      },
      {
        name: "Insider",
        price: "$8",
        cadence: "/mo",
        audience: "Readers who want the room behind the curtain",
        unlocks: [
          "Monthly group video call",
          "Private Discord (312 members)",
          "Audio narrations",
        ],
        ctaText: "Become an Insider",
        ctaUrl: "/subscribe?tier=insider",
        recommended: true,
      },
      {
        name: "Patron",
        price: "$28",
        cadence: "/mo",
        audience: "Underwrites the long-form work",
        unlocks: [
          "Quarterly 1:1 office hours",
          "Manuscript reviews on the next book",
          "Name in the printed acknowledgments",
        ],
        ctaText: "Become a Patron",
        ctaUrl: "/subscribe?tier=patron",
      },
    ],
    footnote:
      "Patron seats are capped at 40. Receipts available for tax filing in the US, UK, and BR.",
  },
};
