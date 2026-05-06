import type { Meta, StoryObj } from "@storybook/react";
import PricingSinglePrice from "./index";

const meta: Meta<typeof PricingSinglePrice> = {
  title: "Pricing/PricingSinglePrice",
  component: PricingSinglePrice,
  parameters: { layout: "fullscreen" },
  argTypes: {
    styleKit: { control: "object" },
  },
};
export default meta;
type Story = StoryObj<typeof PricingSinglePrice>;

/** Boutique brand-design studio — productised package, drawOutline CTA. */
export const BrandStudioPackage: Story = {
  args: {
    label: "The package",
    headline: "One brand sprint, six weeks, fixed price",
    description:
      "We do not work on retainer. We do not run discovery for three months. One scoped sprint with a senior team, a calendar invite for every working session, and a brand kit your team can actually use on day 43.",
    highlights: [
      "Senior strategist + senior designer on the file",
      "Three working sessions per week, recorded",
      "Naming, identity, type stack, voice guidelines",
      "Brand kit shipped as a Notion + Figma library",
      "60-day post-delivery support window",
      "No subcontractors, ever",
    ],
    proof: "Used by 14 founders to ship a brand on the way to Series A.",
    packageName: "Sprint Brand · 6 weeks",
    packageNote: "One offer. No upsells.",
    price: "$24,800",
    cadence: "fixed scope",
    inclusions: [
      "Strategic positioning + naming",
      "Logo system + responsive marks",
      "Color, type, and motion tokens",
      "Voice and tone guidelines",
      "Figma + Notion brand library",
      "60-day Slack support window",
    ],
    ctaText: "Hold a sprint slot",
    ctaUrl: "/holds/brand-sprint",
    secondaryCtaText: "See the working calendar →",
    secondaryCtaUrl: "/calendar",
    styleKit: { ctaVariant: "drawOutline", ctaColorScheme: "primary" },
    footnote:
      "We run two sprints per quarter. The next opening is the week of June 17, 2026.",
  },
};

/** Brazilian agency — annual maintenance plan, slide CTA, BRL pricing. */
export const AnnualMaintenanceBR: Story = {
  args: {
    label: "Plano anual",
    headline: "Manutenção do site, fechado o ano todo",
    description:
      "Para empresas que já têm o site pronto e querem alguém respondendo quando algo quebra, sem ter que abrir RFP toda vez. Um time, um plano, um orçamento previsível para o financeiro.",
    highlights: [
      "Tempo de resposta máximo de 4h em horário comercial",
      "Backups diários e monitoramento 24/7",
      "Atualizações de plugins e dependências",
      "Até 8h de pequenas evoluções por mês",
      "Reunião mensal de revisão e roadmap",
      "Relatório fiscal compatível com LC 116",
    ],
    proof: "Operando 31 sites institucionais em produção desde 2019.",
    packageName: "Manutenção Anual · Pro",
    packageNote: "Pacote único · 12 meses",
    price: "R$ 18.480",
    cadence: "/ano",
    originalPrice: "R$ 23.760",
    discountBadge: "Tarifa de fundadores · 22% off",
    inclusions: [
      "SLA de resposta em 4h úteis",
      "Backups diários e logs de 90 dias",
      "Atualizações + monitoramento 24/7",
      "8h mensais de evoluções",
      "Reunião mensal de revisão",
      "Relatório fiscal LC 116",
    ],
    ctaText: "Contratar manutenção",
    ctaUrl: "/contratar/manutencao",
    secondaryCtaText: "Falar com o time antes →",
    secondaryCtaUrl: "/contato",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "accent" },
    footnote:
      "A tarifa de fundadores é mantida no preço da renovação enquanto a empresa estiver no plano.",
  },
};

/** Indie SaaS — lifetime deal, glow CTA. */
export const LifetimeDeal: Story = {
  args: {
    label: "Limited release",
    headline: "Pay once, keep it forever",
    description:
      "We are funding the next year of development with a one-time deal. 600 seats. After that, we go back to a monthly subscription and the lifetime door closes for good.",
    highlights: [
      "Every paid feature, today and tomorrow",
      "5 GB cloud sync per workspace",
      "Local-first, runs offline",
      "Priority support · 12h SLA",
      "Founder-led roadmap session every quarter",
      "Money-back for 60 days, no questions",
    ],
    proof: "428 of 600 seats taken. Last lifetime release ran out in 19 days.",
    packageName: "Lifetime · single seat",
    price: "$348",
    cadence: "one time",
    originalPrice: "$1,236 over 6 years",
    discountBadge: "Lifetime · 600 seats",
    inclusions: [
      "Every paid feature, forever",
      "5 GB cloud sync",
      "Offline-first, fully local",
      "Priority support · 12h SLA",
      "Quarterly founder roadmap call",
      "60-day money-back",
    ],
    ctaText: "Claim a lifetime seat",
    ctaUrl: "/checkout/lifetime",
    secondaryCtaText: "Read the FAQ first →",
    secondaryCtaUrl: "#faq",
    styleKit: { ctaVariant: "glow", ctaColorScheme: "primary" },
    footnote:
      "Seats are tied to the email used at checkout. Transferable once with a 24h cooldown.",
  },
};

/** Course / book bundle — dotExpand CTA, single educator deal. */
export const CourseBundle: Story = {
  args: {
    label: "The bundle",
    headline: "The full course, the workbook, the office hours",
    description:
      "Twelve weeks of recorded lessons, a 218-page workbook designed to be written in, and four 1:1 office-hour sessions you book directly on my calendar. No drip, no waiting list — start the day you buy.",
    highlights: [
      "47 video lessons, 18h of content",
      "Annotated 218-page workbook (PDF + print-ready)",
      "Four 1:1 sessions, 45 min each",
      "Private Discord with the cohort",
      "Lifetime access to updates",
      "Captioned in EN, PT-BR, ES",
    ],
    proof:
      "1,847 students enrolled. Median NPS across the last three cohorts: 71.",
    packageName: "Cohort 9 · The full bundle",
    packageNote: "One-time purchase",
    price: "$487",
    cadence: "one time",
    inclusions: [
      "All 47 lessons (lifetime access)",
      "Workbook in PDF and print-ready PDF",
      "4 × 45-min 1:1 office hours",
      "Private cohort Discord",
      "Lifetime updates",
      "Captions in EN / PT-BR / ES",
    ],
    ctaText: "Enroll in cohort 9",
    ctaUrl: "/enroll/cohort-9",
    secondaryCtaText: "See the syllabus →",
    secondaryCtaUrl: "/syllabus",
    styleKit: { ctaVariant: "dotExpand", ctaColorScheme: "neutral" },
    footnote:
      "Cohort 9 closes when the 1:1 office hours fill. After that, only the recorded course remains for sale.",
  },
};
