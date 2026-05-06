import type { Meta, StoryObj } from "@storybook/react";
import CtaDualOfferSplit from "./index";

const meta: Meta<typeof CtaDualOfferSplit> = {
  title: "CTA/CtaDualOfferSplit",
  component: CtaDualOfferSplit,
  parameters: { layout: "fullscreen" },
  argTypes: {
    emphasis: { control: "select", options: ["balanced", "primary-led"] },
    styleKit: { control: "object" },
  },
};
export default meta;
type Story = StoryObj<typeof CtaDualOfferSplit>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS — self-serve vs. assisted, primary-led emphasis */
export const SaasSelfServeVsAssisted: Story = {
  args: {
    eyebrow: "Two ways in",
    headline: "Run it yourself, or bring our team in to do it with you",
    description:
      "Same product, two engagement shapes. Most teams of 4-12 self-serve from day one; teams above 30 usually want pair-programming through cutover.",
    emphasis: "primary-led",
    styleKit: { ctaVariant: "default", ctaColorScheme: "primary" },
    primary: {
      eyebrow: "Self-serve",
      title: "Start a free workspace today",
      description:
        "Sign up, connect a repository, and ship a preview deploy in under twenty minutes. Pay only for the environments you actually keep alive.",
      ctaText: "Open the dashboard",
      ctaUrl: "/signup",
      bullets: [
        "14-day trial, no credit card",
        "Unlimited preview environments",
        "Community support in Slack",
      ],
      footnote: "Most teams of 4-12 stay on this plan.",
    },
    secondary: {
      eyebrow: "Assisted onboarding",
      title: "Pair with our solutions team",
      description:
        "Two senior engineers in a shared Slack channel, a written sixty-day plan, and pair-programming through your first production cutover.",
      ctaText: "Book a 30-minute call",
      ctaUrl: "/contact",
      bullets: [
        "Pair-programming through cutover",
        "SOC 2 evidence pack included",
        "EU-only data residency available",
      ],
      footnote: "Average engagement runs 6-9 weeks.",
    },
  },
};

/** Agency — hire us full vs. project sprint, balanced */
export const AgencyHireOrSprint: Story = {
  args: {
    eyebrow: "Engagement shapes",
    headline: "A long partnership or a tight three-week sprint",
    description:
      "We do both — and we'll tell you straight which one fits before you sign anything. Most clients start with a sprint, then continue if it earns the trust.",
    emphasis: "balanced",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "neutral" },
    primary: {
      eyebrow: "Long partnership",
      title: "Hire us as your design + dev team",
      description:
        "Embedded weekly with your product org. Quarterly roadmap, monthly executive review, weekly working sessions. Six-month minimum.",
      ctaText: "Talk about a partnership",
      ctaUrl: "/partnership",
      bullets: [
        "Two senior designers, two senior engineers",
        "Quarterly written roadmap",
        "Slack and Linear access from day one",
      ],
      footnote: "Six clients on this engagement, all multi-year.",
    },
    secondary: {
      eyebrow: "Three-week sprint",
      title: "Ship one focused thing, fast",
      description:
        "Pick one outcome — a redesigned onboarding, a new pricing page, an internal admin — and we'll ship it in three weeks. Fixed scope, fixed price.",
      ctaText: "See sprint scope",
      ctaUrl: "/sprint",
      bullets: [
        "Daily standups, weekly demo",
        "Production-ready code, not Figma",
        "Optional handoff session for your team",
      ],
      footnote: "Twelve sprints shipped this year.",
    },
  },
};

/** Marketplace — buyer vs. seller routing, balanced, dotExpand CTA */
export const MarketplaceTwoSided: Story = {
  args: {
    headline: "Where to start, depending on which side you're on",
    description:
      "The faster path forward depends on what you're trying to do. Pick the side that matches and we'll show only the relevant onboarding.",
    emphasis: "balanced",
    styleKit: { ctaVariant: "dotExpand", ctaColorScheme: "primary" },
    primary: {
      eyebrow: "Sellers",
      title: "List your first product in under ten minutes",
      description:
        "Upload your photos, set a price, and we handle payments, taxes, and the buyer-side disputes. Standard payouts arrive in three business days.",
      ctaText: "Open a seller account",
      ctaUrl: "/sellers",
      bullets: [
        "8.5% platform fee, no monthly minimum",
        "Free Stripe Express payouts",
        "Buyer disputes resolved by our team",
      ],
    },
    secondary: {
      eyebrow: "Buyers",
      title: "Browse the catalog, ship in two days",
      description:
        "Verified sellers, refunds for late shipments, and a 48-hour damaged-on-arrival policy that actually works. Skim the catalog without signing up.",
      ctaText: "Browse without signing up",
      ctaUrl: "/buyers/browse",
      bullets: [
        "Free returns within 14 days",
        "Two-day expedited shipping option",
        "Verified-seller badges on every listing",
      ],
    },
  },
};

/** Real estate — listing vs. valuation, primary-led */
export const RealEstateBR: Story = {
  args: {
    headline: "Vender, ou só descobrir quanto vale antes de decidir",
    description:
      "Não cobramos pela avaliação — só pela venda. A maior parte dos proprietários começa pela avaliação e só anuncia depois de comparar três bairros.",
    emphasis: "primary-led",
    styleKit: { ctaVariant: "drawOutline", ctaColorScheme: "primary" },
    primary: {
      eyebrow: "Vender agora",
      title: "Anunciar o imóvel com nossa equipe",
      description:
        "Fotos profissionais, tour 3D, anúncio nos cinco maiores portais e visita semanal de revisão. Comissão de 4,8% só na venda concluída.",
      ctaText: "Falar com um corretor",
      ctaUrl: "/anunciar",
      bullets: [
        "Fotos e tour 3D inclusos",
        "Reunião semanal de status",
        "Cobramos só na venda concluída",
      ],
      footnote: "Tempo médio de venda: 47 dias.",
    },
    secondary: {
      eyebrow: "Avaliação grátis",
      title: "Saber quanto vale antes de decidir",
      description:
        "Visita de 40 minutos, comparativo com seis vendas recentes do bairro e relatório em PDF na sua caixa de entrada em até 72 horas.",
      ctaText: "Agendar avaliação",
      ctaUrl: "/avaliar",
      bullets: [
        "Sem compromisso de venda",
        "Relatório em PDF em 72 horas",
        "Comparativo com seis vendas recentes",
      ],
    },
  },
};
