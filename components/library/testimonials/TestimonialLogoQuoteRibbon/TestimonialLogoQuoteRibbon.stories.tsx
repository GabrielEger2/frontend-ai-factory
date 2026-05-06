import type { Meta, StoryObj } from "@storybook/react";
import TestimonialLogoQuoteRibbon from "./index";

const meta: Meta<typeof TestimonialLogoQuoteRibbon> = {
  title: "Testimonial/TestimonialLogoQuoteRibbon",
  component: TestimonialLogoQuoteRibbon,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: { control: "select", options: ["neutral", "muted"] },
  },
};
export default meta;
type Story = StoryObj<typeof TestimonialLogoQuoteRibbon>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** B2B SaaS — six logos, neutral tone */
export const SaasMarqueeLogos: Story = {
  args: {
    eyebrow: "Customers",
    headline: "Six teams running the platform in production",
    subheadline:
      "Tap a logo to see what they actually said about working with us.",
    tone: "neutral",
    items: [
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=NORTHBEAM",
        logoAlt: "Northbeam",
        quote:
          "Replaced four observability tools with one cleaner workflow. The team adopted it with no training session.",
        authorName: "Mariana Cardoso",
        authorTitle: "VP Platform, Northbeam",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=KINETIC",
        logoAlt: "Kinetic Labs",
        quote:
          "Three weeks from kickoff to a redesigned site that actually felt like us.",
        authorName: "Rafael Tavares",
        authorTitle: "Head of Product, Kinetic",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=HELIX",
        logoAlt: "Helix Systems",
        quote:
          "Two weeks in and we already had a launch-ready prototype the team could test against.",
        authorName: "Jordan Patel",
        authorTitle: "Director of Engineering, Helix",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=MORROW",
        logoAlt: "Morrow & Co",
        quote:
          "They asked the uncomfortable questions early. That alone changed the project.",
        authorName: "Hannah Schmitt",
        authorTitle: "Founder, Morrow & Co",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=GLASSCUBE",
        logoAlt: "Glasscube",
        quote:
          "We finally have a brand story everyone in the company tells the same way.",
        authorName: "Yuki Tanaka",
        authorTitle: "VP Marketing, Glasscube",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=RIVERMARK",
        logoAlt: "Rivermark",
        quote: "Best money we've spent on a partner this year. Period.",
        authorName: "Naomi Wright",
        authorTitle: "CEO, Rivermark",
      },
    ],
  },
};

/** Agency portfolio — muted tone, four logos */
export const AgencyClientWall: Story = {
  args: {
    eyebrow: "Recent work",
    headline: "Four engagements that defined the last 18 months",
    tone: "muted",
    defaultActiveIndex: 1,
    items: [
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=DRIFT",
        logoAlt: "Drift Studio",
        quote:
          "Eight-week sprint, six-figure pipeline impact in the first quarter.",
        authorName: "Felix Brandt",
        authorTitle: "COO, Drift Studio",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=FOXTROT",
        logoAlt: "Foxtrot Studio",
        quote:
          "We doubled our pipeline in the first quarter. The team was responsive, sharp, and a delight to work with.",
        authorName: "Bianca Okazaki",
        authorTitle: "Head of Growth, Foxtrot Studio",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=NORTHWAVE",
        logoAlt: "Northwave",
        quote:
          "Felt like extending our own team rather than handing things off to a vendor.",
        authorName: "Amina Hassan",
        authorTitle: "Head of Design, Northwave",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=QUANTA",
        logoAlt: "Quanta",
        quote:
          "Smoothest engagement we've run. Clear deliverables, no scope surprises.",
        authorName: "Lin Wei",
        authorTitle: "VP Operations, Quanta",
      },
    ],
  },
};

/** Conference sponsor wall — six logos, headline-only */
export const ConferenceSponsors: Story = {
  args: {
    headline: "Six teams sponsoring Frontend Summit 2026",
    tone: "neutral",
    items: [
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=ATLAS",
        logoAlt: "Atlas Cloud",
        quote: "We're sending eighteen engineers and a recruiting booth.",
        authorName: "Priya Natarajan",
        authorTitle: "VP Eng, Atlas Cloud",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=BLOOMSEED",
        logoAlt: "BloomSeed Capital",
        quote:
          "First time sponsoring — we underwrote the hallway track because that's where deals happen.",
        authorName: "Marcus Rivera",
        authorTitle: "Partner, BloomSeed",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=CALDERA",
        logoAlt: "Caldera Labs",
        quote:
          "Four of our staff engineers are speaking. We picked the talk slot for our late-night demo.",
        authorName: "David Okafor",
        authorTitle: "CTO, Caldera Labs",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=DELTA",
        logoAlt: "Delta Print",
        quote: "Printing every conference badge for the third year running.",
        authorName: "Elena Martinez",
        authorTitle: "Founder, Delta Print",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=ESCAPE",
        logoAlt: "Escape Studios",
        quote: "We run the after-party. Tickets sell out in nine minutes.",
        authorName: "Tom Whitaker",
        authorTitle: "Co-founder, Escape Studios",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=FROSTBYTE",
        logoAlt: "Frostbyte",
        quote: "Our open-source maintainers' lounge runs all weekend.",
        authorName: "Yuki Tanaka",
        authorTitle: "OSS Lead, Frostbyte",
      },
    ],
  },
};

/** Brazilian SMB platform — pt-BR copy, four logos */
export const BrazilianSMBPlatform: Story = {
  args: {
    eyebrow: "Quem usa hoje",
    headline: "Quatro times que rodam a plataforma no dia a dia",
    tone: "muted",
    items: [
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=CASA+REYES",
        logoAlt: "Casa Reyes",
        quote:
          "Trocamos quatro planilhas e dois grupos de WhatsApp por um único painel que a equipe inteira entende.",
        authorName: "Camila Reyes Rodrigues",
        authorTitle: "Diretora de Operações, Casa Reyes",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=PADARIA+ARARI",
        logoAlt: "Padaria Arari",
        quote:
          "A operação ficou previsível pela primeira vez em sete anos. Nosso DRE fecha sozinho na sexta.",
        authorName: "Felipe Brandão",
        authorTitle: "Sócio, Padaria Arari",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=ESTUDIO+RESERVA",
        logoAlt: "Estúdio Reserva",
        quote:
          "Fechamos a coleção de outono em um terço do tempo do ano passado. Nada precisou de retrabalho.",
        authorName: "Bianca Okazaki",
        authorTitle: "Diretora Criativa, Estúdio Reserva",
      },
      {
        logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=GRAFICA+PINHO",
        logoAlt: "Gráfica Pinho",
        quote:
          "A produção entende o pedido na primeira leitura. Reduziu refazer em quase dois terços.",
        authorName: "Mateus Albuquerque",
        authorTitle: "Gerente de Produção, Gráfica Pinho",
      },
    ],
  },
};
