import type { Meta, StoryObj } from "@storybook/react";
import CtaTestimonialPaired from "./index";

const meta: Meta<typeof CtaTestimonialPaired> = {
  title: "CTA/CtaTestimonialPaired",
  component: CtaTestimonialPaired,
  parameters: { layout: "fullscreen" },
  argTypes: {
    layoutVariant: { control: "select", options: ["split", "stacked"] },
    tone: { control: "select", options: ["neutral", "muted", "inverse"] },
  },
};
export default meta;
type Story = StoryObj<typeof CtaTestimonialPaired>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** B2B SaaS — split, neutral, KPI-led trust frame */
export const SaasOnboarding: Story = {
  args: {
    eyebrow: "Trusted by 1,284 ops teams",
    headline: "Replace your tab-graveyard with a single shared workspace",
    description:
      "Pipe Slack threads, Linear tickets, and Notion docs into one timeline so the next person hired doesn't onboard by reading 14 months of DMs.",
    ctaText: "Start a 14-day workspace",
    ctaUrl: "/signup",
    secondaryText: "See a 6-minute walkthrough",
    secondaryUrl: "/demo",
    perks: [
      "No credit card for the first 14 days",
      "SOC 2 Type II report on the dashboard",
      "Slack-based community staffed by engineers",
    ],
    quote:
      "We retired four internal tools the week we deployed this. The integrations work the way the docs say they do, which honestly was the surprise.",
    authorName: "Mariana Cardoso",
    authorRole: "Head of Operations, Cardume Studio",
    authorImage:
      "https://picsum.photos/seed/cta-testimonial-mariana-cardoso/200/200",
    authorImageAlt: "Mariana Cardoso, Head of Operations at Cardume Studio",
    attribution: "Verified customer · 2025",
    metricValue: "47.2%",
    metricLabel: "fewer hand-off meetings",
    layoutVariant: "split",
    tone: "neutral",
  },
};

/** Agency / boutique service — inverse tone, premium-leaning */
export const AgencyRetainer: Story = {
  args: {
    eyebrow: "What partners say",
    headline: "Your next quarter, staffed by senior engineers in your timezone",
    description:
      "We embed two senior engineers per engagement, run a written sixty-day plan, and ship on Tuesdays. No retainer cliff, no surprise scope creep.",
    ctaText: "Book a 30-minute discovery call",
    ctaUrl: "/contact",
    secondaryText: "Read the case studies",
    secondaryUrl: "/work",
    quote:
      "They wrote the plan in week one and shipped against it for nine straight weeks. The CFO stopped asking me when the platform migration would finish around week four.",
    authorName: "Rafael Tavares",
    authorRole: "VP Engineering, Tatame Logistics",
    authorImage:
      "https://picsum.photos/seed/cta-testimonial-rafael-tavares/200/200",
    authorImageAlt: "Rafael Tavares, VP Engineering at Tatame Logistics",
    attribution: "Engagement · Q3 2025",
    metricValue: "9 weeks",
    metricLabel: "platform cutover",
    layoutVariant: "split",
    tone: "inverse",
  },
};

/** pt-BR — content product, stacked layout, quieter tone */
export const NewsletterUpgradeBR: Story = {
  args: {
    eyebrow: "Da edição premium",
    headline: "A leitura paga que entrega menos coisas, com mais cuidado",
    description:
      "Uma edição por semana, escrita por uma única pessoa, com o nome dela embaixo. Sem seções patrocinadas, sem 'top 10', sem newsletter de IA escondida no meio.",
    ctaText: "Assinar por R$ 19/mês",
    ctaUrl: "/assinar",
    secondaryText: "Ler uma edição inteira primeiro",
    secondaryUrl: "/amostra",
    perks: [
      "Cancele em 2 cliques, sem ligação",
      "Acervo aberto desde a primeira edição",
      "Edição em PDF para impressão aos sábados",
    ],
    quote:
      "É a única assinatura que eu não cancelei no aperto do ano passado. As três edições de junho sobre design industrial brasileiro mudaram a forma como pensamos o catálogo de outono.",
    authorName: "Bianca Okazaki",
    authorRole: "Diretora criativa, Estúdio Sotaque",
    authorImage:
      "https://picsum.photos/seed/cta-testimonial-bianca-okazaki/200/200",
    authorImageAlt: "Bianca Okazaki, Diretora criativa do Estúdio Sotaque",
    attribution: "Assinante desde 2023",
    layoutVariant: "stacked",
    tone: "muted",
  },
};

/** Professional services — split, muted, dual-path framing */
export const FinancialAdvisor: Story = {
  args: {
    eyebrow: "Now booking Q3 reviews",
    headline:
      "A second opinion on your portfolio, written down, in plain words",
    description:
      "We charge a flat fee, take no commission, and email a written six-page review you can forward to your accountant. No phone-call upsell.",
    ctaText: "Schedule a written review",
    ctaUrl: "/book",
    secondaryText: "See a sample review",
    secondaryUrl: "/sample",
    perks: [
      "Flat fee — no AUM percentage, ever",
      "Six-page written report, plain English",
      "Free 20-minute follow-up after delivery",
    ],
    quote:
      "Their review caught a 0.84% expense ratio buried inside our retirement plan that nobody had flagged in eleven years. The fee paid for itself in the first month.",
    authorName: "Helena Wojciechowski",
    authorRole: "Operations partner, Mill & Lattice",
    authorImage: "https://picsum.photos/seed/cta-testimonial-helena-w/200/200",
    authorImageAlt:
      "Helena Wojciechowski, Operations partner at Mill & Lattice",
    attribution: "Client since 2019",
    metricValue: "0.84%",
    metricLabel: "hidden fee uncovered",
    layoutVariant: "split",
    tone: "muted",
  },
};

/** Founder-led launch — minimal copy, single perk, inverse tone */
export const FounderLaunch: Story = {
  args: {
    eyebrow: "Public beta",
    headline: "The pull-request review tool we wish we'd had at our last job",
    description:
      "Built by two engineers who shipped at GitHub and Linear. We use it ourselves on this codebase. The first 500 seats stay at launch pricing for life.",
    ctaText: "Claim a launch seat",
    ctaUrl: "/launch",
    perks: [
      "Locked-in pricing for the first 500 seats",
      "Founder Q&A on Wednesdays for six months",
    ],
    quote:
      "I was the third paying customer. The diff-summary feature alone has saved me roughly four hours a week, and that's before the new flake-detector landed in March.",
    authorName: "Jonas Bergström",
    authorRole: "Staff engineer, Tessera Logistics",
    authorImage: "https://picsum.photos/seed/cta-testimonial-jonas-b/200/200",
    authorImageAlt: "Jonas Bergström, Staff engineer at Tessera Logistics",
    attribution: "Customer #3",
    metricValue: "3,847",
    metricLabel: "PRs reviewed in beta",
    layoutVariant: "split",
    tone: "inverse",
  },
};
