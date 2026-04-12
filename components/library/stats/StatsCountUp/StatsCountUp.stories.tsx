import type { Meta, StoryObj } from "@storybook/react";
import StatsCountUp from "./index";

const meta: Meta<typeof StatsCountUp> = {
  title: "Stats/StatsCountUp",
  component: StatsCountUp,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    duration: {
      control: { type: "range", min: 0.5, max: 5, step: 0.5 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof StatsCountUp>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS product — growth metrics with headline highlight and suffix notation */
export const SaasGrowth: Story = {
  args: {
    headline: "BUILD TRUST WITH YOUR USERS WITH A BEAUTIFUL LANDING PAGE",
    headlineHighlight: "BEAUTIFUL LANDING PAGE",
    stats: [
      {
        value: 45,
        suffix: "%",
        label: "Increase in conversion rate after launch",
      },
      {
        value: 15.5,
        decimals: 1,
        suffix: "K+",
        label: "Active users across 40 countries",
      },
      {
        value: 20,
        suffix: "B+",
        label: "API requests processed every month",
      },
    ],
  },
};

/** Fintech dashboard — currency prefixes, large numbers, no headline */
export const FintechMetrics: Story = {
  args: {
    stats: [
      {
        value: 4.2,
        decimals: 1,
        prefix: "$",
        suffix: "B",
        label: "Total assets under management",
      },
      {
        value: 99.9,
        decimals: 1,
        suffix: "%",
        label: "Platform uptime since launch",
      },
      {
        value: 350,
        suffix: "K+",
        label: "Transactions processed daily",
      },
    ],
  },
};

/** Healthcare platform — patient outcomes, trust-building metrics */
export const HealthcareOutcomes: Story = {
  args: {
    headline: "TRUSTED BY HOSPITALS AND CLINICS ACROSS THE COUNTRY",
    headlineHighlight: "TRUSTED",
    duration: 3,
    stats: [
      {
        value: 120,
        suffix: "+",
        label: "Partner hospitals and clinics nationwide",
      },
      {
        value: 2.5,
        decimals: 1,
        suffix: "M",
        label: "Patient records managed securely",
      },
      {
        value: 98,
        suffix: "%",
        label: "Provider satisfaction rating",
      },
      {
        value: 40,
        suffix: "%",
        label: "Reduction in administrative overhead",
      },
    ],
  },
};

/** E-commerce — Brazilian real, fast animation, compact stats */
export const EcommerceBrazil: Story = {
  args: {
    headline: "RESULTADOS QUE FALAM POR SI",
    headlineHighlight: "FALAM POR SI",
    duration: 2,
    stats: [
      {
        value: 8.7,
        decimals: 1,
        prefix: "R$",
        suffix: "M",
        label: "Em vendas geradas para nossos clientes",
      },
      {
        value: 62,
        suffix: "%",
        label: "Aumento médio na taxa de conversão",
      },
      {
        value: 500,
        suffix: "+",
        label: "Lojas online lançadas com sucesso",
      },
    ],
  },
};

/** Freelancer portfolio — personal milestones, two stats only */
export const FreelancerPortfolio: Story = {
  args: {
    headline: "YEARS OF EXPERIENCE, PROJECTS THAT SPEAK",
    headlineHighlight: "PROJECTS THAT SPEAK",
    duration: 2,
    stats: [
      {
        value: 12,
        suffix: "+",
        label: "Years of design and development experience",
      },
      {
        value: 230,
        suffix: "+",
        label: "Projects delivered to clients worldwide",
      },
    ],
  },
};
