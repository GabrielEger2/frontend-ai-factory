import type { Meta, StoryObj } from "@storybook/react";
import CarouselTestimonialAvatarPeek from "./index";

const meta: Meta<typeof CarouselTestimonialAvatarPeek> = {
  title: "Carousel/CarouselTestimonialAvatarPeek",
  component: CarouselTestimonialAvatarPeek,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof CarouselTestimonialAvatarPeek>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** B2B SaaS — five testimonials, default cadence */
export const SaasMarqueeRoster: Story = {
  args: {
    eyebrow: "Customer voices",
    headline: "Five operators who run the platform every day",
    subheadline:
      "Tap an avatar to read their quote, or let the carousel cycle.",
    items: [
      {
        image: "https://picsum.photos/seed/avatarpeek-mariana/200/200",
        imageAlt: "Mariana Cardoso",
        name: "Mariana Cardoso",
        title: "VP Platform Engineering, Northbeam",
        quote:
          "Fourteen-day onboarding turned into a four-day onboarding, and we didn't rewrite a single integration. Numbers held three quarters in.",
        caption: "Quarter-on-quarter pipeline review, October 2025.",
      },
      {
        image: "https://picsum.photos/seed/avatarpeek-rafael/200/200",
        imageAlt: "Rafael Tavares",
        name: "Rafael Tavares",
        title: "Co-founder, Drift Studio",
        quote:
          "They asked the uncomfortable questions early — pricing, positioning, the team. The answers reshaped the launch in ways we wouldn't have reached alone.",
        caption: "Eight-week sprint, six-figure pipeline impact in Q1.",
      },
      {
        image: "https://picsum.photos/seed/avatarpeek-amina/200/200",
        imageAlt: "Amina Hassan",
        name: "Amina Hassan",
        title: "Head of Design, Northwave",
        quote:
          "Felt like extending our own team rather than hiring a vendor. Three of their engineers were in our Slack within a week.",
      },
      {
        image: "https://picsum.photos/seed/avatarpeek-david/200/200",
        imageAlt: "David Okafor",
        name: "Dr. David Okafor",
        title: "CMO, Aurora Health Network",
        quote:
          "We went from forty-seven days between referral and treatment to eleven. None of that happens without the written protocol they delivered in week four.",
        caption: "Audited Q2-Q4 2025 across 14 clinics.",
      },
      {
        image: "https://picsum.photos/seed/avatarpeek-bianca/200/200",
        imageAlt: "Bianca Okazaki",
        name: "Bianca Okazaki",
        title: "Founder, Foxtrot Studio",
        quote:
          "Thirteen agencies in a decade. None shipped this fast without dropping quality, and none gave us a system we still iterate on a year later.",
      },
    ],
  },
};

/** Conference recap — three speaker quotes, slower cadence */
export const ConferenceSpeakers: Story = {
  args: {
    eyebrow: "Frontend Summit 2026 · speaker reflections",
    headline: "Three speakers, three different beats from the same weekend",
    autoAdvanceMs: 9000,
    items: [
      {
        image: "https://picsum.photos/seed/avatarpeek-priya/200/200",
        imageAlt: "Priya Natarajan",
        name: "Priya Natarajan",
        title: "VP Engineering, Atlas Cloud",
        quote:
          "I've spoken at twelve frontend conferences. The hallway track here was the only one where I left with a roadmap idea I could ship the next week.",
      },
      {
        image: "https://picsum.photos/seed/avatarpeek-marcus/200/200",
        imageAlt: "Marcus Rivera",
        name: "Marcus Rivera",
        title: "Partner, BloomSeed Capital",
        quote:
          "We underwrote the hallway track because that's where deals happen. We were right.",
      },
      {
        image: "https://picsum.photos/seed/avatarpeek-felix/200/200",
        imageAlt: "Felix Brandt",
        name: "Felix Brandt",
        title: "COO, Northbeam Logistics",
        quote:
          "Best technical conference I've sponsored. The audience asked questions you can't ask a sales team — only the technical buyers can.",
      },
    ],
  },
};

/** Brazilian SMB platform — pt-BR copy, four testimonials */
export const BrazilianSMBVoices: Story = {
  args: {
    eyebrow: "Quem usa hoje",
    headline: "Quatro operadores, quatro cenários diferentes",
    subheadline:
      "Cada um com seu jeito de rodar a operação. Toque na foto para ler a história.",
    items: [
      {
        image: "https://picsum.photos/seed/avatarpeek-camila-br/200/200",
        imageAlt: "Camila Reyes Rodrigues",
        name: "Camila Reyes Rodrigues",
        title: "Sócia-Operadora, Casa Reyes",
        quote:
          "A operação ficou previsível pela primeira vez em sete anos. O DRE fecha sozinho na sexta — antes a gente terceirizava tudo isso.",
        caption: "14 unidades pela região metropolitana de Curitiba.",
      },
      {
        image: "https://picsum.photos/seed/avatarpeek-felipe-br/200/200",
        imageAlt: "Felipe Brandão",
        name: "Felipe Brandão",
        title: "Sócio, Padaria Arari",
        quote:
          "Trocamos quatro planilhas e dois grupos de WhatsApp por um único painel. A equipe inteira entende em três dias de uso.",
      },
      {
        image: "https://picsum.photos/seed/avatarpeek-bianca-br/200/200",
        imageAlt: "Bianca Okazaki",
        name: "Bianca Okazaki",
        title: "Diretora Criativa, Estúdio Reserva",
        quote:
          "Fechamos a coleção de outono em um terço do tempo do ano passado. Nada precisou de retrabalho até a virada do estoque.",
      },
      {
        image: "https://picsum.photos/seed/avatarpeek-mateus-br/200/200",
        imageAlt: "Mateus Albuquerque",
        name: "Mateus Albuquerque",
        title: "Gerente de Produção, Gráfica Pinho",
        quote:
          "A produção entende o pedido na primeira leitura. Reduziu em quase dois terços o retrabalho de máquina.",
        caption: "Auditado nos meses de agosto e setembro de 2025.",
      },
    ],
  },
};

/** Founder voices — auto-advance off, manual rotation only */
export const ManualRotation: Story = {
  args: {
    headline: "Founder voices",
    subheadline:
      "Auto-rotation is off here — pick the founder you'd rather hear from.",
    autoAdvanceMs: 0,
    defaultIndex: 1,
    items: [
      {
        image: "https://picsum.photos/seed/avatarpeek-tom/200/200",
        imageAlt: "Tom Whitaker",
        name: "Tom Whitaker",
        title: "Co-founder, Drift Studio",
        quote:
          "The clarity of communication alone was worth the price. Every Friday we knew exactly where things stood, and the budget never moved.",
      },
      {
        image: "https://picsum.photos/seed/avatarpeek-yuki/200/200",
        imageAlt: "Yuki Tanaka",
        name: "Yuki Tanaka",
        title: "VP Marketing, Glasscube",
        quote:
          "We finally have a brand story that everyone in the company tells the same way. Sales, support, and the founders — same words, same beats.",
      },
      {
        image: "https://picsum.photos/seed/avatarpeek-naomi/200/200",
        imageAlt: "Naomi Wright",
        name: "Naomi Wright",
        title: "CEO, Rivermark",
        quote: "Best money we've spent on a partner this year. Period.",
      },
    ],
  },
};
