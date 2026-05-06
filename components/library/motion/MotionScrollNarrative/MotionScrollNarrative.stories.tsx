import type { Meta, StoryObj } from "@storybook/react";
import MotionScrollNarrative from "./index";

const meta: Meta<typeof MotionScrollNarrative> = {
  title: "Motion/MotionScrollNarrative",
  component: MotionScrollNarrative,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof MotionScrollNarrative>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Agency process — four numbered steps, editorial */
export const AgencyMethodology: Story = {
  args: {
    eyebrow: "How we work",
    headline: "Four moves, in this order, every engagement",
    subheadline:
      "We don't reinvent the process per client. Where we vary is in the depth — not the order.",
    steps: [
      {
        label: "01",
        title: "Start with the brief everyone agrees with",
        description:
          "Most engagements break in week three because the brief was approximate. We write it as a contract — outcomes, owners, and what we are explicitly not doing.",
        image: "https://picsum.photos/seed/scrollnarrative-brief/1280/1600",
        imageAlt: "Whiteboard with a written project brief",
      },
      {
        label: "02",
        title: "Prototype the riskiest assumption first",
        description:
          "Whatever the team is most unsure about — pricing, the funnel, an integration — that's what we ship to a real audience first. Three weeks, no exceptions.",
        image: "https://picsum.photos/seed/scrollnarrative-prototype/1280/1600",
        imageAlt: "Designer reviewing a prototype on a tablet",
      },
      {
        label: "03",
        title: "Instrument before you launch",
        description:
          "Analytics, error tracking, and the three or four metrics you'll actually argue about — wired and tested before the launch announcement, not after the first incident.",
        image:
          "https://picsum.photos/seed/scrollnarrative-instrument/1280/1600",
        imageAlt: "Dashboard with multiple analytics charts",
      },
      {
        label: "04",
        title: "Ship, measure, then ship again",
        description:
          "Weekly working sessions through the first thirty days. Decisions go in writing the same day; nothing waits for the Monday review.",
        image: "https://picsum.photos/seed/scrollnarrative-ship/1280/1600",
        imageAlt: "Team in a working session around a laptop",
      },
    ],
  },
};

/** Onboarding story — three steps, friendly product narrative */
export const ProductOnboardingStory: Story = {
  args: {
    eyebrow: "First two weeks",
    headline: "Three things that change between Monday and Friday-week-two",
    subheadline: "Not a feature tour — what your team actually does each day.",
    steps: [
      {
        label: "Day 01",
        title: "Connect the data sources you already have",
        description:
          "Postgres, Stripe, Segment, a shared Notion. Pick the ones that matter; ignore the rest. Most teams wire three by lunchtime.",
        image: "https://picsum.photos/seed/scrollnarrative-day01/1280/1600",
        imageAlt: "Engineer connecting data sources on a laptop",
      },
      {
        label: "Day 04",
        title: "First report in production",
        description:
          "By midweek you'll have one report your CEO actually opens — and the link won't break the next time the schema moves.",
        image: "https://picsum.photos/seed/scrollnarrative-day04/1280/1600",
        imageAlt: "Live dashboard with a production report",
      },
      {
        label: "Day 09",
        title: "Slack & email digest, automated",
        description:
          "Daily and weekly digests that summarize the metrics in plain English. Drift exits Slack notifications by week two.",
        image: "https://picsum.photos/seed/scrollnarrative-day09/1280/1600",
        imageAlt: "Slack thread showing an automated digest",
      },
    ],
  },
};

/** Sustainability narrative — five steps, environmental */
export const SustainabilityProtocol: Story = {
  args: {
    eyebrow: "2025 protocol",
    headline: "Five gates between a project being proposed and being verified",
    subheadline:
      "Each gate adds a different reviewer. Anything that doesn't clear gate four doesn't get funded.",
    steps: [
      {
        label: "Gate 01",
        title: "Local-partner endorsement",
        description:
          "We require a written endorsement from a local cooperative or NGO before evaluating biophysical claims. No partner, no proposal.",
        image: "https://picsum.photos/seed/scrollnarrative-gate01/1280/1600",
        imageAlt: "Community meeting in a coastal village",
      },
      {
        label: "Gate 02",
        title: "Biophysical baseline measured on site",
        description:
          "Soil, hydrology, and biomass measured on the ground in person — not estimated from satellite alone. The baseline is what every later number compares against.",
        image: "https://picsum.photos/seed/scrollnarrative-gate02/1280/1600",
        imageAlt: "Researcher measuring soil samples",
      },
      {
        label: "Gate 03",
        title: "Independent third-party audit",
        description:
          "Verra or Cerflor reviews methodology, sampling, and the project's leakage risk. Audit findings are public on /verification.",
        image: "https://picsum.photos/seed/scrollnarrative-gate03/1280/1600",
        imageAlt: "Auditor reviewing field documents",
      },
      {
        label: "Gate 04",
        title: "Funding committee approves",
        description:
          "A standing committee of seven reviews monthly. Each member has a single veto. Approval is rare on the first cycle.",
        image: "https://picsum.photos/seed/scrollnarrative-gate04/1280/1600",
        imageAlt: "Funding committee in a conference room",
      },
      {
        label: "Gate 05",
        title: "Quarterly verification thereafter",
        description:
          "Every funded project is re-measured at month three, twelve, and twenty-four. Underperformance triggers a public adjustment to the registry.",
        image: "https://picsum.photos/seed/scrollnarrative-gate05/1280/1600",
        imageAlt: "Field team revisiting a verified site",
      },
    ],
  },
};

/** Brazilian SMB story — pt-BR, three steps */
export const BrazilianSMBStory: Story = {
  args: {
    eyebrow: "Como rodamos hoje",
    headline: "Três passos, na ordem em que a gente roda toda semana",
    steps: [
      {
        label: "Segunda",
        title: "Reunião de 25 minutos com o operacional",
        description:
          "Sem slides. A pauta é: o que ficou da semana passada, o que precisa fechar nesta, e qual vai ser o pesadelo. Decisões saem por escrito antes de almoço.",
        image: "https://picsum.photos/seed/scrollnarrative-br-seg/1280/1600",
        imageAlt: "Equipe em pé no balcão, reunião curta",
      },
      {
        label: "Quarta",
        title: "Revisão financeira ao vivo",
        description:
          "DRE da semana, fluxo de caixa, e os três indicadores que importam para o mês. Trinta minutos no máximo — qualquer coisa mais longa volta para a sexta.",
        image: "https://picsum.photos/seed/scrollnarrative-br-qua/1280/1600",
        imageAlt: "Tela mostrando o DRE de uma semana",
      },
      {
        label: "Sexta",
        title: "Retrospectiva: o que mudou e o que sobrou",
        description:
          "Quarenta-e-cinco minutos para encerrar a semana. Nada vira segunda sem decisão. Nada de e-mail no fim de semana.",
        image: "https://picsum.photos/seed/scrollnarrative-br-sex/1280/1600",
        imageAlt: "Equipe encerrando a semana com café",
      },
    ],
  },
};
