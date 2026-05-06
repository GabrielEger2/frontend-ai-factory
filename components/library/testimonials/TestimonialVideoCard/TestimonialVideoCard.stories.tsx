import type { Meta, StoryObj } from "@storybook/react";
import TestimonialVideoCard from "./index";

const meta: Meta<typeof TestimonialVideoCard> = {
  title: "Testimonial/TestimonialVideoCard",
  component: TestimonialVideoCard,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof TestimonialVideoCard>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Three videos — priority + two secondary, B2B SaaS */
export const SaasCaseStudyReel: Story = {
  args: {
    eyebrow: "Customer voices",
    headline: "Three teams, three minutes — what changed after week six",
    subheadline:
      "Each video is a customer telling their own story. We didn't script anything; we asked what surprised them.",
    items: [
      {
        poster: "https://picsum.photos/seed/videocard-mariana-cardoso/960/1200",
        posterAlt: "Mariana Cardoso speaking at her office desk",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
        duration: "2:18",
        quote:
          "Fourteen-day onboarding turned into a four-day onboarding. We didn't rewrite a single integration.",
        authorName: "Mariana Cardoso",
        authorTitle: "VP Platform Engineering, Northbeam",
        caption: "Recorded at her office in Curitiba, October 2025.",
      },
      {
        poster: "https://picsum.photos/seed/videocard-rafael-tavares/640/360",
        posterAlt: "Rafael Tavares mid-conversation in studio",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
        duration: "1:42",
        quote: "Best partner decision we've made. Period.",
        authorName: "Rafael Tavares",
        authorTitle: "Co-founder, Drift Studio",
      },
      {
        poster: "https://picsum.photos/seed/videocard-amina-hassan/640/360",
        posterAlt: "Amina Hassan presenting in front of a brand wall",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
        duration: "0:56",
        quote: "Felt like extending our own team rather than hiring a vendor.",
        authorName: "Amina Hassan",
        authorTitle: "Head of Design, Northwave",
      },
    ],
  },
};

/** Two equal videos — agency portfolio */
export const AgencyTwoUp: Story = {
  args: {
    eyebrow: "Recent engagements",
    headline: "Two clients, twelve weeks each",
    items: [
      {
        poster: "https://picsum.photos/seed/videocard-bianca-okazaki/960/540",
        posterAlt: "Bianca Okazaki standing in her studio",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
        duration: "3:04",
        quote:
          "We doubled our pipeline in the first quarter. Sharp, responsive, and a delight to work with.",
        authorName: "Bianca Okazaki",
        authorTitle: "Founder, Foxtrot Studio",
        caption: "Filmed during the Q1 review, January 2026.",
      },
      {
        poster: "https://picsum.photos/seed/videocard-felix-brandt/960/540",
        posterAlt: "Felix Brandt at a whiteboard mid-explanation",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
        duration: "2:21",
        quote:
          "Replaced four different ops tools with one cleaner workflow. The team adopted it on day one.",
        authorName: "Felix Brandt",
        authorTitle: "COO, Northbeam Logistics",
      },
    ],
  },
};

/** Single hero video — premium luxury brand */
export const SingleHeroVideo: Story = {
  args: {
    eyebrow: "Founder voice",
    headline: "Three minutes with our founder, on what we got wrong first",
    items: [
      {
        poster: "https://picsum.photos/seed/videocard-david-okafor/1280/720",
        posterAlt: "David Okafor seated in a quiet studio",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
        duration: "3:12",
        quote:
          "We picked the wrong launch sequence and admitted it publicly six months in. The honesty is what kept the early cohort.",
        authorName: "David Okafor",
        authorTitle: "Founder & CTO, Caldera Labs",
        caption:
          "Quarterly founder note, recorded for the November 2025 customer letter.",
      },
    ],
  },
};

/** Brazilian SMB platform — pt-BR copy, two videos */
export const BrazilianSMBCustomers: Story = {
  args: {
    eyebrow: "Quem está rodando hoje",
    headline: "Duas histórias, sem narração nem roteiro",
    subheadline:
      "Conversamos por trinta minutos com cada um. Cortamos só o melhor minuto e meio.",
    items: [
      {
        poster: "https://picsum.photos/seed/videocard-camila-reyes/960/540",
        posterAlt: "Camila Reyes Rodrigues no balcão da loja",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
        duration: "1:38",
        quote: "A operação ficou previsível pela primeira vez em sete anos.",
        authorName: "Camila Reyes Rodrigues",
        authorTitle: "Sócia-Operadora, Casa Reyes",
        caption: "Gravado em Curitiba, novembro de 2025.",
      },
      {
        poster: "https://picsum.photos/seed/videocard-felipe-brandao/960/540",
        posterAlt: "Felipe Brandão atrás do balcão da padaria",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
        duration: "2:04",
        quote:
          "Conseguimos fechar o DRE sozinhos na sexta. Antes a gente terceirizava tudo.",
        authorName: "Felipe Brandão",
        authorTitle: "Sócio, Padaria Arari",
      },
    ],
  },
};
