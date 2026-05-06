import type { Meta, StoryObj } from "@storybook/react";
import StatsMilestoneBar from "./index";

const meta: Meta<typeof StatsMilestoneBar> = {
  title: "Stats/StatsMilestoneBar",
  component: StatsMilestoneBar,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof StatsMilestoneBar>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Latin-American SaaS company history — five milestones */
export const StartupHistoryLatam: Story = {
  args: {
    label: "Our story",
    headline: "Seven years from a single pilot to four-country coverage",
    description:
      "We share the full timeline so prospective customers and hires can decide if our trajectory matches what they're looking for.",
    footnote:
      "Updated annually each March. Funding figures sourced from Crunchbase and verified internally.",
    milestones: [
      {
        marker: "2019",
        title: "Founded in São Paulo",
        metric: "2 people",
        description:
          "Two co-founders, one shared office, and a single client willing to pilot the first prototype.",
      },
      {
        marker: "2021",
        title: "Series A and the first 100 customers",
        metric: "$8.4M raised",
        description:
          "Closed a regional Series A and hired the founding engineering and design teams in the same quarter.",
      },
      {
        marker: "2023",
        title: "Expanded to Mexico and Colombia",
        metric: "47 employees",
        description:
          "Opened a Mexico City office, then added a Bogotá team within nine months.",
      },
      {
        marker: "2025",
        title: "SOC 2 Type II and enterprise tier",
        metric: "184 customers",
        description:
          "Cleared a year-long audit and shipped the enterprise plan three months ahead of schedule.",
      },
      {
        marker: "2026",
        title: "Public roadmap and a 3,847-member community",
        metric: "3,847 members",
        description:
          "Moved the roadmap to a public Linear view and seeded a Discord community that self-organises monthly meetups.",
      },
    ],
  },
};

/** Conference history — six editions */
export const ConferenceHistory: Story = {
  args: {
    label: "Six editions in",
    headline: "Frontend Summit through the years",
    milestones: [
      {
        marker: "2020",
        title: "First edition, virtual-only",
        metric: "184 attendees",
      },
      {
        marker: "2021",
        title: "Hybrid format introduced",
        metric: "412 attendees",
      },
      {
        marker: "2022",
        title: "Returned in-person to Lisbon",
        metric: "847 attendees",
      },
      {
        marker: "2023",
        title: "Added a workshop track",
        metric: "1,128 attendees",
      },
      {
        marker: "2024",
        title: "Live-translated to four languages",
        metric: "1,684 attendees",
      },
      {
        marker: "2025",
        title: "Sold out three months ahead",
        metric: "2,047 attendees",
      },
    ],
  },
};

/** Brazilian agency timeline — pt-BR copy, four milestones */
export const AgencyTimelineBR: Story = {
  args: {
    label: "Linha do tempo",
    headline: "De um freela em casa para um estúdio com 14 pessoas",
    description:
      "A trajetória honesta — sem números redondos e sem reescrever o passado para parecer mais inevitável do que foi.",
    milestones: [
      {
        marker: "2017",
        title: "Primeiro projeto pago, em casa, no apartamento de 28m²",
        metric: "1 cliente",
        description:
          "Site institucional para uma confeitaria do bairro. Cobramos R$ 1.840 e levamos seis semanas para entregar.",
      },
      {
        marker: "2019",
        title: "Sala compartilhada com mais dois designers",
        metric: "12 clientes",
        description:
          "Saímos de casa, ainda sem CNPJ. Recebíamos como PJ via terceiros porque ninguém queria abrir uma empresa.",
      },
      {
        marker: "2022",
        title: "Estúdio próprio na Vila Madalena",
        metric: "8 pessoas",
        description:
          "Abrimos a empresa, alugamos uma sala de 64m² e contratamos o primeiro engenheiro. Foi quando deixamos de fazer logos avulsos.",
      },
      {
        marker: "2025",
        title: "Catorze pessoas, oito clientes recorrentes",
        metric: "14 pessoas",
        description:
          "Fechamos contratos anuais com clientes que nos contratam para ser o time de design e produto deles, não para projetos pontuais.",
      },
    ],
  },
};

/** Open-source project — four release milestones */
export const OpenSourceReleases: Story = {
  args: {
    label: "Release history",
    headline: "Four major versions, one breaking change",
    description:
      "We follow semver strictly — the only breaking change is annotated below with its migration path.",
    milestones: [
      {
        marker: "v0.1",
        title: "First public release",
        metric: "Apr 2023",
        description:
          "Single-package CLI shipped to npm with 38 GitHub stars within a week.",
      },
      {
        marker: "v1.0",
        title: "Stable API and TypeScript types",
        metric: "Nov 2023",
        description:
          "Locked the public API surface, generated types from the schema, and dropped support for Node 16.",
      },
      {
        marker: "v2.0",
        title: "Plugin architecture",
        metric: "Jul 2024 · breaking",
        description:
          "Refactored core into plugin contracts. Migration guide moves config from JSON to a typed module export.",
      },
      {
        marker: "v3.0",
        title: "Edge runtime support",
        metric: "Mar 2026",
        description:
          "Bundle splits between Node and edge entrypoints; tree-shakes the database adapters in edge builds.",
      },
    ],
  },
};

/** Healthcare clinic — three milestones, no headline */
export const ClinicMilestones: Story = {
  args: {
    milestones: [
      {
        marker: "1998",
        title: "Founded by Dr. Mariana Cardoso in a single-room clinic",
        metric: "2 staff",
      },
      {
        marker: "2012",
        title: "Expanded to four metro locations",
        metric: "32 providers",
      },
      {
        marker: "2024",
        title: "Joined the regional pediatric trauma network",
        metric: "184 staff",
      },
    ],
  },
};
