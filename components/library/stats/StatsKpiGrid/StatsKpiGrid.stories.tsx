import type { Meta, StoryObj } from "@storybook/react";
import StatsKpiGrid from "./index";

const meta: Meta<typeof StatsKpiGrid> = {
  title: "Stats/StatsKpiGrid",
  component: StatsKpiGrid,
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: { control: "select", options: ["divided", "boxed"] },
    duration: { control: { type: "range", min: 0.5, max: 4, step: 0.5 } },
  },
};
export default meta;
type Story = StoryObj<typeof StatsKpiGrid>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS product page — four metrics, divided variant */
export const SaasProductMetrics: Story = {
  args: {
    label: "Last 28 days",
    headline: "Operating numbers, refreshed every Monday morning",
    description:
      "We publish the same five metrics our investors review. No vanity rounding.",
    variant: "divided",
    footnote: "Updated 2026-04-29 at 09:14 UTC. Source: ops dashboard, public.",
    metrics: [
      {
        value: 47.2,
        decimals: 1,
        suffix: "%",
        label: "Conversion lift",
        caption: "Vs. control, 28-day rolling window",
        delta: "+8.4 pts",
        trend: "up",
      },
      {
        value: 3847,
        label: "Production deploys",
        caption: "Across 312 customer projects",
        delta: "+12.1%",
        trend: "up",
      },
      {
        value: 1.42,
        decimals: 2,
        suffix: "s",
        label: "Median LCP",
        caption: "P75 across mobile sessions",
        delta: "-0.18s",
        trend: "up",
      },
      {
        value: 99.94,
        decimals: 2,
        suffix: "%",
        label: "Region uptime",
        caption: "Trailing 90 days, region-weighted",
        delta: "0.00",
        trend: "flat",
      },
    ],
  },
};

/** Fintech treasury dashboard — three metrics, boxed variant, currency prefixes */
export const FintechTreasury: Story = {
  args: {
    label: "Treasury overview",
    headline: "Where our customers' float lives, in real time",
    variant: "boxed",
    footnote: "Internal pricing curve — not customer-visible.",
    metrics: [
      {
        value: 4.27,
        decimals: 2,
        prefix: "$",
        suffix: "B",
        label: "AUM under partner banks",
        caption: "Across 11 chartered partners in the U.S.",
        delta: "+$0.34B",
        trend: "up",
      },
      {
        value: 5.18,
        decimals: 2,
        suffix: "%",
        label: "Blended APY",
        caption: "Weighted across all partner banks",
        delta: "-12 bps",
        trend: "down",
      },
      {
        value: 287,
        label: "Sweep cycles per day",
        caption: "Across all customer accounts",
        delta: "+9 cycles",
        trend: "up",
      },
    ],
  },
};

/** Agency case study — six metrics, divided, mixed currencies */
export const AgencyCaseStudy: Story = {
  args: {
    label: "Roofing client · 12 months",
    headline: "What changed after the rebuild",
    description:
      "A regional roofing contractor hired us in March 2025. Six numbers we agreed on at kickoff.",
    variant: "divided",
    metrics: [
      {
        value: 218,
        suffix: "%",
        label: "Organic traffic",
        delta: "+118 pts",
        trend: "up",
      },
      {
        value: 6.4,
        decimals: 1,
        suffix: "x",
        label: "Lead volume",
        delta: "+440%",
        trend: "up",
      },
      {
        value: 84.2,
        decimals: 1,
        prefix: "$",
        suffix: "K",
        label: "Cost-per-lead",
        delta: "-32%",
        trend: "up",
      },
      {
        value: 1.18,
        decimals: 2,
        suffix: "s",
        label: "Median LCP",
        delta: "-2.4s",
        trend: "up",
      },
      {
        value: 92,
        suffix: "/100",
        label: "Lighthouse perf",
        delta: "+47 pts",
        trend: "up",
      },
      {
        value: 4.8,
        decimals: 1,
        suffix: "/5",
        label: "Client NPS",
        delta: "n/a",
        trend: "flat",
      },
    ],
  },
};

/** Brazilian e-commerce — four metrics in BRL with pt-BR copy */
export const EcommerceBR: Story = {
  args: {
    label: "Black Friday · 2025",
    headline: "Resultados consolidados das 72 horas de campanha",
    description:
      "Comparativo direto contra a Black Friday 2024. Métricas extraídas do datawarehouse.",
    variant: "divided",
    footnote:
      "Fonte: Snowflake / dashboards internos. Atualizado em 02/12/2025 às 14h32 (BRT).",
    metrics: [
      {
        value: 8.74,
        decimals: 2,
        prefix: "R$",
        suffix: "M",
        label: "Receita bruta",
        caption: "Pedidos pagos em até 24h",
        delta: "+62%",
        trend: "up",
      },
      {
        value: 24187,
        label: "Pedidos processados",
        caption: "Sem fila, sem timeout em produção",
        delta: "+47%",
        trend: "up",
      },
      {
        value: 3.4,
        decimals: 1,
        suffix: "%",
        label: "Taxa de conversão",
        caption: "Sessão → pedido pago",
        delta: "+0.9 p.p.",
        trend: "up",
      },
      {
        value: 1.84,
        decimals: 2,
        prefix: "R$",
        label: "CPC médio",
        caption: "Mídia paga combinada",
        delta: "-R$0,42",
        trend: "up",
      },
    ],
  },
};

/** Climate non-profit — three metrics, divided, no headline */
export const ClimateNonprofit: Story = {
  args: {
    variant: "divided",
    metrics: [
      {
        value: 1.84,
        decimals: 2,
        suffix: "M",
        label: "Trees planted",
        caption: "Across 47 partner reserves since 2019",
      },
      {
        value: 312840,
        label: "Verified contributors",
        caption: "Donors and volunteers, distinct",
      },
      {
        value: 87,
        suffix: "%",
        label: "Funds reaching the field",
        caption: "Audited annually by Charity Navigator",
      },
    ],
    footnote:
      "Independent audits available at /transparency. Numbers refresh every quarter.",
  },
};
