import type { Meta, StoryObj } from "@storybook/react";
import NewsletterCapture from "./index";

const meta: Meta<typeof NewsletterCapture> = {
  title: "CTA/NewsletterCapture",
  component: NewsletterCapture,
  parameters: { layout: "fullscreen" },
  argTypes: {
    layoutVariant: { control: "select", options: ["split", "stacked"] },
    tone: { control: "select", options: ["neutral", "inverse"] },
  },
};
export default meta;
type Story = StoryObj<typeof NewsletterCapture>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Indie newsletter — split, neutral tone, three perks */
export const IndieNewsletter: Story = {
  args: {
    label: "The Sunday letter",
    headline: "Notes on building software you actually want to maintain",
    description:
      "One essay every Sunday morning, written for engineers who are tired of architectural posts that ignore the people writing the code.",
    emailPlaceholder: "you@yourcompany.com",
    ctaText: "Subscribe",
    layoutVariant: "split",
    tone: "neutral",
    perks: [
      "One essay every Sunday morning",
      "Subscriber-only deep-dives once a month",
      "3,847 readers and not a single sponsored post",
    ],
    disclaimer:
      "Two-click unsubscribe at the bottom of every email. Archive stays open whether you stay or not.",
  },
};

/** Product waitlist — stacked, inverse tone, urgency-leaning copy */
export const ProductWaitlist: Story = {
  args: {
    label: "Limited beta",
    headline: "Join 1,284 designers waiting for the v0.4 release",
    description:
      "We're rolling out access in batches of 40. Join the list and we'll send your invite when your batch opens — no surveys, no upsell.",
    ctaText: "Join the waitlist",
    layoutVariant: "stacked",
    tone: "inverse",
    perks: [
      "Early access in batches of 40 — typically 3 weeks apart",
      "Founder Q&A on Wednesdays for the first six months",
      "Locked-in launch pricing for the first 500 paid seats",
    ],
    disclaimer:
      "We email when your batch opens — usually once. No drip campaign, no marketing automation tooling on this list.",
  },
};

/** Editorial site — pt-BR copy, split, neutral */
export const EditorialBR: Story = {
  args: {
    label: "Boletim semanal",
    headline: "A newsletter de design que vale o domingo de manhã",
    description:
      "Toda segunda às 7h, uma análise curta de uma marca, produto ou interface — sem listicles, sem 'top 10', sem 'inspiração' genérica.",
    emailPlaceholder: "seu@email.com.br",
    ctaText: "Assinar grátis",
    layoutVariant: "split",
    tone: "neutral",
    perks: [
      "Uma análise por semana, sem promessa de mais",
      "Estúdios brasileiros aparecem em metade das edições",
      "Cancele em 2 cliques, sem formulário de retenção",
    ],
    disclaimer:
      "Seu email fica conosco e não é compartilhado com ninguém. Promessa cumprida desde 2021, em 187 edições.",
    successMessage:
      "Pronto. Confira sua caixa de entrada para confirmar a assinatura.",
  },
};

/** Community membership — stacked, neutral, perk-heavy */
export const CommunityInvite: Story = {
  args: {
    label: "Frontend Practitioners",
    headline: "A small group of engineers teaching each other in public",
    description:
      "We meet twice a month on Zoom, share work-in-progress in a private Discord, and review each other's pull requests when something feels off.",
    ctaText: "Request an invite",
    layoutVariant: "stacked",
    tone: "neutral",
    perks: [
      "Two members-only video calls per month",
      "Private Discord with 312 active engineers",
      "Pair-programming pool open during Pacific business hours",
    ],
    disclaimer:
      "Invitations are reviewed by a human. Median response time has been 38 hours over the last quarter.",
    successMessage:
      "Got it. Expect a personal note within 48 hours from one of the moderators.",
  },
};

/** SaaS product update list — inverse split, ships-soon framing */
export const SaasProductUpdates: Story = {
  args: {
    label: "Changelog",
    headline: "Get product updates the morning we ship them",
    description:
      "Short, no-marketing notes about what changed and why. Skips the press-release voice — written by the engineers who built the feature.",
    emailPlaceholder: "work@yourdomain.com",
    ctaText: "Get updates",
    layoutVariant: "split",
    tone: "inverse",
    perks: [
      "Updates the day they ship — typically Tuesdays",
      "Quarterly retrospective from the engineering lead",
      "No release-cadence padding, no fake deadlines",
    ],
    disclaimer:
      "Separate list from marketing — opting into one does not opt you into the other.",
  },
};
