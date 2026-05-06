import type { Meta, StoryObj } from "@storybook/react";
import TestimonialMetricCard from "./index";

const meta: Meta<typeof TestimonialMetricCard> = {
  title: "Testimonial/TestimonialMetricCard",
  component: TestimonialMetricCard,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: { control: "select", options: ["neutral", "muted", "inverse"] },
    countUpDuration: { control: { type: "number", min: 0.5, step: 0.25 } },
  },
};
export default meta;
type Story = StoryObj<typeof TestimonialMetricCard>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Enterprise SaaS — three cards, mixed metric formats, neutral surface */
export const SaasOutcomes: Story = {
  args: {
    eyebrow: "Outcomes, audited",
    headline: "What changed for the teams who switched.",
    subheadline:
      "Numbers reconciled by their finance teams in the quarter following rollout. Sources available on request.",
    tone: "neutral",
    items: [
      {
        metricValue: 47.2,
        metricDecimals: 1,
        metricSuffix: "%",
        metricLabel: "Pipeline lift in Q1",
        metricCaption: "vs. prior-year baseline",
        quote:
          "Three weeks in, the platform team migrated 84 services without filing a single ticket. The redesign paid for itself before the next billing cycle.",
        authorName: "Mariana Cardoso",
        authorTitle: "VP Platform, Northbeam",
        authorImage: "https://picsum.photos/seed/saasout-mariana/120/120",
        authorImageAlt: "Mariana Cardoso",
      },
      {
        metricValue: 4,
        metricSuffix: " days",
        metricLabel: "New-engineer onboarding",
        metricCaption: "down from 14 days",
        quote:
          "We replaced four observability tools with one cleaner workflow. The team adopted it without a single training session.",
        authorName: "Rafael Tavares",
        authorTitle: "Co-founder, Drift Studio",
        authorImage: "https://picsum.photos/seed/saasout-rafael/120/120",
        authorImageAlt: "Rafael Tavares",
      },
      {
        metricValue: 3847,
        metricLabel: "Deliveries on launch day",
        metricCaption: "zero downtime, zero rollbacks",
        quote:
          "First order at 8:14am, last one at midnight. Infrastructure never blinked.",
        authorName: "Bianca Okazaki",
        authorTitle: "Founder, Foxtrot Studio",
        authorImage: "https://picsum.photos/seed/saasout-bianca/120/120",
        authorImageAlt: "Bianca Okazaki",
      },
    ],
  },
};

/** Healthcare — two cards, inverse tone, editorial slab */
export const HealthcareEditorialDark: Story = {
  args: {
    eyebrow: "Audited, Q4 2025",
    headline: "What happens when the protocol is written for the floor.",
    subheadline:
      "Excerpts from the Aurora and Sequoia six-month reviews. Numbers reconciled by NQF in January 2026.",
    tone: "inverse",
    items: [
      {
        metricValue: 11,
        metricSuffix: " days",
        metricLabel: "Referral to first care",
        metricCaption: "down from 47 days, n = 14 clinics",
        quote:
          "Nothing about that would have happened without the protocol document the team handed us in the fourth week — written for our staff, not their template library.",
        authorName: "Dr. David Okafor",
        authorTitle: "CMO, Aurora Health Network",
        authorImage: "https://picsum.photos/seed/health-david/120/120",
        authorImageAlt: "Dr. David Okafor",
      },
      {
        metricValue: 32.6,
        metricDecimals: 1,
        metricSuffix: "%",
        metricLabel: "Intake-form completion",
        metricCaption: "from 14-min form to 3-min form",
        quote:
          "Patients complete it in three minutes instead of fourteen, and they don't drop out at the insurance step anymore.",
        authorName: "Dr. Naveen Iyengar",
        authorTitle: "Founder, Sequoia Family Medicine",
        authorImage: "https://picsum.photos/seed/health-naveen/120/120",
        authorImageAlt: "Dr. Naveen Iyengar",
      },
    ],
  },
};

/** Brazilian e-commerce — pt-BR, R$ prefix, muted tone */
export const BrazilianEcomROI: Story = {
  args: {
    eyebrow: "Resultados auditados",
    headline: "Os números que vieram depois da migração.",
    subheadline:
      "Dados consolidados pelo time financeiro de cada cliente nos 90 dias após o go-live.",
    tone: "muted",
    items: [
      {
        metricPrefix: "R$ ",
        metricValue: 1248,
        metricSuffix: "K",
        metricLabel: "Receita adicional em 90 dias",
        metricCaption: "Maré Calçados, sazonal de Natal",
        quote:
          "A operação inteira cabia em quatro planilhas. Em três semanas trocamos por um único painel que a equipe abre antes da reunião de segunda.",
        authorName: "Henrique Vasconcellos",
        authorTitle: "CFO, Maré Calçados",
        authorImage: "https://picsum.photos/seed/br-henrique/120/120",
        authorImageAlt: "Henrique Vasconcellos",
      },
      {
        metricValue: 23.4,
        metricDecimals: 1,
        metricSuffix: "%",
        metricLabel: "Conversão na ficha de produto",
        metricCaption: "sem mudar uma linha do checkout",
        quote:
          "A ficha redesenhada fez o trabalho que a gente vinha tentando há dois anos com promoção.",
        authorName: "Larissa Mendonça",
        authorTitle: "Head de Produto, Cravo & Canela",
        authorImage: "https://picsum.photos/seed/br-larissa/120/120",
        authorImageAlt: "Larissa Mendonça",
      },
      {
        metricValue: 90,
        metricSuffix: "s",
        metricLabel: "Tempo de resposta no atendimento",
        metricCaption: "antes era no dia seguinte",
        quote:
          "O time inteiro responde em 90 segundos no horário de pico. Sem contratar ninguém novo.",
        authorName: "Beatriz Okazaki",
        authorTitle: "Atendimento, Selva Brasil",
        authorImage: "https://picsum.photos/seed/br-beatriz/120/120",
        authorImageAlt: "Beatriz Okazaki",
      },
    ],
  },
};

/** Solo case study — one card, hero-sized */
export const SingleCaseStudy: Story = {
  args: {
    eyebrow: "Northwind Labs · Q3 case study",
    headline: "From quarterly invoicing to weekly close.",
    subheadline:
      "Northwind ran on a 14-day finance close before the engagement. Six weeks later, they were closing every Friday.",
    tone: "neutral",
    items: [
      {
        metricValue: 6.2,
        metricDecimals: 1,
        metricSuffix: "x",
        metricLabel: "Faster month-end close",
        metricCaption: "from 14 days to 2.25 days, audited Sep 2025",
        quote:
          "We didn't just speed up the close — we changed how the finance team reads the business. They now spend the back half of every month on planning instead of reconciling.",
        authorName: "Adaeze Mensah",
        authorTitle: "VP Finance, Northwind Labs",
        authorImage: "https://picsum.photos/seed/single-adaeze/120/120",
        authorImageAlt: "Adaeze Mensah",
        companyLogo:
          "https://placehold.co/120x32/0f172a/eeeeee/svg?text=NORTHWIND",
        companyLogoAlt: "Northwind Labs logo",
      },
    ],
  },
};

/** Two-up agency case studies — mixed denominations */
export const AgencyTwoUp: Story = {
  args: {
    eyebrow: "Selected work · 2025",
    headline: "Two stories, two numbers we keep retelling.",
    tone: "neutral",
    countUpDuration: 2.5,
    items: [
      {
        metricPrefix: "+",
        metricValue: 218,
        metricSuffix: "%",
        metricLabel: "Direct booking revenue",
        metricCaption: "Pampa Hospitality, year-over-year",
        quote:
          "We hired six agencies before this one. Only this team treated our property catalog like a brand artifact instead of a content task.",
        authorName: "Inés Borrego",
        authorTitle: "CEO, Pampa Hospitality",
        authorImage: "https://picsum.photos/seed/agency-ines/120/120",
        authorImageAlt: "Inés Borrego",
      },
      {
        metricValue: 17,
        metricSuffix: " days",
        metricLabel: "From kickoff to launch",
        metricCaption: "Salt & Stone retail rebrand",
        quote:
          "Three weeks in, the website read like the company we're trying to become — not the company we used to be.",
        authorName: "Kenji Aldama",
        authorTitle: "VP Retail, Salt & Stone",
        authorImage: "https://picsum.photos/seed/agency-kenji/120/120",
        authorImageAlt: "Kenji Aldama",
      },
    ],
  },
};
