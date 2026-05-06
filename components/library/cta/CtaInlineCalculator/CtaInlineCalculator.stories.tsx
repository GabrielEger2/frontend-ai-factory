import type { Meta, StoryObj } from "@storybook/react";
import CtaInlineCalculator from "./index";

const meta: Meta<typeof CtaInlineCalculator> = {
  title: "CTA/CtaInlineCalculator",
  component: CtaInlineCalculator,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: { control: "select", options: ["neutral", "muted"] },
  },
};
export default meta;
type Story = StoryObj<typeof CtaInlineCalculator>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Mortgage estimator — currency, multi-output, USD */
export const MortgageEstimator: Story = {
  args: {
    eyebrow: "Estimate · 30-second answer",
    headline: "What would your monthly payment actually look like?",
    description:
      "Drag the sliders to your numbers. We pull current rates from the morning of, and the figures below update against them — no email needed.",
    inputs: [
      {
        key: "amount",
        label: "Loan amount",
        min: 80_000,
        max: 1_250_000,
        step: 5_000,
        defaultValue: 425_000,
        format: "currency",
        currency: "USD",
      },
      {
        key: "rate",
        label: "Annual rate",
        min: 3.25,
        max: 9.5,
        step: 0.05,
        defaultValue: 6.85,
        format: "percent",
        hint: "Today's average for a 30-year fixed conforming loan: 6.84%.",
      },
      {
        key: "years",
        label: "Term length",
        min: 10,
        max: 30,
        step: 5,
        defaultValue: 30,
        unit: " years",
        format: "integer",
      },
    ],
    outputs: [
      {
        label: "Estimated monthly payment",
        compute: ({ amount, rate, years }) => {
          const monthlyRate = rate / 100 / 12;
          const n = years * 12;
          if (monthlyRate === 0) return amount / n;
          return (
            (amount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
            (Math.pow(1 + monthlyRate, n) - 1)
          );
        },
        format: "currency",
        currency: "USD",
        primary: true,
        caption: "Principal + interest only. Excludes taxes, HOA, insurance.",
      },
      {
        label: "Total interest",
        compute: ({ amount, rate, years }) => {
          const monthlyRate = rate / 100 / 12;
          const n = years * 12;
          if (monthlyRate === 0) return 0;
          const monthly =
            (amount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
            (Math.pow(1 + monthlyRate, n) - 1);
          return monthly * n - amount;
        },
        format: "currency",
        currency: "USD",
      },
      {
        label: "Total paid",
        compute: ({ amount, rate, years }) => {
          const monthlyRate = rate / 100 / 12;
          const n = years * 12;
          if (monthlyRate === 0) return amount;
          const monthly =
            (amount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
            (Math.pow(1 + monthlyRate, n) - 1);
          return monthly * n;
        },
        format: "currency",
        currency: "USD",
      },
    ],
    ctaText: "Lock in this estimate",
    ctaUrl: "/apply",
    secondaryText: "Talk to a human first",
    secondaryUrl: "/contact",
    footnote:
      "Estimate assumes a single conforming loan with no points. Real offers will vary based on credit profile and property location.",
    tone: "neutral",
  },
};

/** SaaS plan calculator — seats, integer steps, muted tone */
export const SaasPlanCalculator: Story = {
  args: {
    eyebrow: "Pricing calculator",
    headline: "What does this cost for a team of your size?",
    description:
      "Move the sliders to match your team. The total below updates immediately — no demo call required to see the number.",
    inputs: [
      {
        key: "seats",
        label: "Active editors",
        min: 5,
        max: 250,
        step: 1,
        defaultValue: 28,
        format: "integer",
        hint: "Editors are users who push changes. Read-only viewers are unlimited.",
      },
      {
        key: "envs",
        label: "Preview environments per month",
        min: 50,
        max: 5000,
        step: 50,
        defaultValue: 800,
        format: "integer",
      },
      {
        key: "support",
        label: "Support response SLA",
        min: 4,
        max: 48,
        step: 4,
        defaultValue: 12,
        unit: " hr",
        format: "integer",
      },
    ],
    outputs: [
      {
        label: "Estimated monthly total",
        compute: ({ seats, envs, support }) => {
          const seatCost = seats * 24;
          const envCost = Math.max(0, envs - 100) * 0.18;
          const slaPremium = support <= 8 ? 480 : support <= 16 ? 240 : 0;
          return seatCost + envCost + slaPremium;
        },
        format: "currency",
        currency: "USD",
        primary: true,
        caption:
          "Annual contract — pay monthly available with a 12% surcharge.",
      },
      {
        label: "Per-seat blended",
        compute: ({ seats, envs, support }) => {
          const seatCost = seats * 24;
          const envCost = Math.max(0, envs - 100) * 0.18;
          const slaPremium = support <= 8 ? 480 : support <= 16 ? 240 : 0;
          return (seatCost + envCost + slaPremium) / Math.max(1, seats);
        },
        format: "currency",
        currency: "USD",
      },
      {
        label: "Annual total",
        compute: ({ seats, envs, support }) => {
          const seatCost = seats * 24;
          const envCost = Math.max(0, envs - 100) * 0.18;
          const slaPremium = support <= 8 ? 480 : support <= 16 ? 240 : 0;
          return (seatCost + envCost + slaPremium) * 12;
        },
        format: "currency",
        currency: "USD",
      },
    ],
    ctaText: "Start a 14-day workspace",
    ctaUrl: "/signup",
    secondaryText: "Talk to a sales engineer",
    secondaryUrl: "/contact-sales",
    footnote:
      "First 100 preview environments included on every plan. Volume discounts apply automatically over 80 seats.",
    tone: "muted",
    styleKit: { ctaVariant: "default", ctaColorScheme: "primary" },
  },
};

/** Savings projection — compound interest, BRL */
export const SavingsProjectionBR: Story = {
  args: {
    eyebrow: "Projeção · Conta Plataforma",
    headline: "Quanto rende se você aplicar todo mês",
    description:
      "Mexa os controles abaixo para simular o aporte mensal e o tempo de aplicação. O rendimento é estimado com a taxa do dia (CDI 102%).",
    inputs: [
      {
        key: "monthly",
        label: "Aporte mensal",
        min: 100,
        max: 8000,
        step: 50,
        defaultValue: 850,
        format: "currency",
        currency: "BRL",
      },
      {
        key: "months",
        label: "Tempo de aplicação",
        min: 6,
        max: 60,
        step: 1,
        defaultValue: 24,
        unit: " meses",
        format: "integer",
      },
      {
        key: "rate",
        label: "Rentabilidade anual",
        min: 6,
        max: 16,
        step: 0.1,
        defaultValue: 11.4,
        format: "percent",
        hint: "Taxa CDI bruta no encerramento de ontem: 11.42%.",
      },
    ],
    outputs: [
      {
        label: "Saldo final estimado",
        compute: ({ monthly, months, rate }) => {
          const monthlyRate = rate / 100 / 12;
          if (monthlyRate === 0) return monthly * months;
          return (
            monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
          );
        },
        format: "currency",
        currency: "BRL",
        primary: true,
        caption:
          "Estimativa bruta antes do imposto de renda. Tabela regressiva conforme o tempo de aplicação.",
      },
      {
        label: "Total aportado",
        compute: ({ monthly, months }) => monthly * months,
        format: "currency",
        currency: "BRL",
      },
      {
        label: "Rendimento bruto",
        compute: ({ monthly, months, rate }) => {
          const monthlyRate = rate / 100 / 12;
          const total = monthly * months;
          if (monthlyRate === 0) return 0;
          const final =
            monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
          return final - total;
        },
        format: "currency",
        currency: "BRL",
      },
    ],
    ctaText: "Abrir uma conta",
    ctaUrl: "/abrir-conta",
    secondaryText: "Ver as regras do imposto",
    secondaryUrl: "/ir",
    footnote:
      "Simulação meramente informativa. Rentabilidade passada não representa garantia de resultado futuro.",
    tone: "neutral",
  },
};

/** Freight estimate — distance + weight, integer outputs */
export const FreightQuote: Story = {
  args: {
    eyebrow: "Quick freight quote",
    headline: "How much would the next pallet cost to move?",
    description:
      "Drag the sliders to the shipment you have in front of you. The estimate updates immediately and forwards your numbers if you decide to book.",
    inputs: [
      {
        key: "distance",
        label: "Distance",
        min: 50,
        max: 2800,
        step: 25,
        defaultValue: 612,
        unit: " mi",
        format: "integer",
      },
      {
        key: "weight",
        label: "Pallet weight",
        min: 200,
        max: 4400,
        step: 50,
        defaultValue: 1450,
        unit: " lb",
        format: "integer",
      },
      {
        key: "speed",
        label: "Delivery speed (transit days)",
        min: 1,
        max: 7,
        step: 1,
        defaultValue: 3,
        unit: " days",
        format: "integer",
      },
    ],
    outputs: [
      {
        label: "Estimated rate",
        compute: ({ distance, weight, speed }) => {
          const base = distance * 0.62;
          const weightFee = weight * 0.18;
          const speedMultiplier = speed === 1 ? 1.85 : speed === 2 ? 1.4 : 1;
          return (base + weightFee) * speedMultiplier;
        },
        format: "currency",
        currency: "USD",
        primary: true,
        caption:
          "All-in rate including fuel surcharge. Liftgate or residential delivery added at booking.",
      },
      {
        label: "Pickup window",
        compute: ({ speed }) => Math.max(1, speed - 1),
        format: "integer",
        unit: " biz days",
      },
      {
        label: "Estimated CO₂",
        compute: ({ distance, weight }) =>
          Math.round((distance * weight) / 12_500),
        format: "integer",
        unit: " kg",
      },
    ],
    ctaText: "Book this lane",
    ctaUrl: "/book",
    secondaryText: "Talk to dispatch",
    secondaryUrl: "/dispatch",
    footnote:
      "Rates valid for the next 24 hours. Lane availability confirmed at booking — high-density corridors typically dispatch same-day.",
    tone: "muted",
  },
};

/** Solar payback — minimal 2-input version */
export const SolarPayback: Story = {
  args: {
    eyebrow: "Rooftop calculator",
    headline: "How long until the panels pay for themselves",
    description:
      "Drag the sliders to your roof. We use the average solar irradiance for your latitude (4.7 hr/day) — local install partners refine it.",
    inputs: [
      {
        key: "size",
        label: "System size",
        min: 3,
        max: 14,
        step: 0.5,
        defaultValue: 7.5,
        unit: " kW",
        format: "decimal",
      },
      {
        key: "bill",
        label: "Current monthly bill",
        min: 60,
        max: 480,
        step: 5,
        defaultValue: 184,
        format: "currency",
        currency: "USD",
      },
    ],
    outputs: [
      {
        label: "Estimated payback period",
        compute: ({ size, bill }) => {
          const annualSavings = bill * 12 * 0.78;
          const installCost = size * 2_750;
          if (annualSavings === 0) return 0;
          return installCost / annualSavings;
        },
        format: "decimal",
        unit: " yr",
        primary: true,
        caption:
          "Assumes 78% offset on the average residential roof. Federal tax credit not included.",
      },
      {
        label: "Annual savings",
        compute: ({ bill }) => bill * 12 * 0.78,
        format: "currency",
        currency: "USD",
      },
      {
        label: "Install cost (after credit)",
        compute: ({ size }) => size * 2_750 * 0.7,
        format: "currency",
        currency: "USD",
      },
    ],
    ctaText: "Get a written quote",
    ctaUrl: "/quote",
    footnote:
      "Estimate uses regional install averages. Final number depends on shading, orientation, and which utility you sit under.",
    tone: "neutral",
  },
};
