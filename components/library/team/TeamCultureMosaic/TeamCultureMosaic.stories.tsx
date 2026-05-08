import type { Meta, StoryObj } from "@storybook/react";
import TeamCultureMosaic from "./index";

const meta: Meta<typeof TeamCultureMosaic> = {
  title: "Team/TeamCultureMosaic",
  component: TeamCultureMosaic,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof TeamCultureMosaic>;

/* ------------------------------------------------------------------ */
/*  Estúdio — design studio, lifestyle in São Paulo, 8 tiles + 3 vals  */
/* ------------------------------------------------------------------ */

export const DesignStudioPinheiros: Story = {
  args: {
    eyebrow: "Como trabalhamos",
    headline:
      "Doze pessoas, uma cozinha compartilhada e duas brigadeirias por semana",
    intro:
      "O estúdio fica num casarão dos anos 40 em Pinheiros. Almoçamos juntos quase todo dia, fechamos as sextas mais cedo e revezamos quem traz o pão. Não é benefício — é só como a gente trabalha.",
    images: [
      {
        src: "https://picsum.photos/seed/culture-studio-table/900/675",
        alt: "Equipe do estúdio em volta da mesa de almoço com pratos de comida brasileira e luz natural entrando pela janela",
        aspect: "landscape",
        caption: "Almoço · 12h30",
      },
      {
        src: "https://picsum.photos/seed/culture-studio-portrait/700/933",
        alt: "Designer rindo enquanto desenha em caderno A4 sobre mesa de madeira coberta de sketches",
        aspect: "portrait",
      },
      {
        src: "https://picsum.photos/seed/culture-studio-walk/700/700",
        alt: "Dois colegas caminhando pelo corredor do casarão com xícaras de café na mão",
        aspect: "square",
        caption: "Pausa · café da manhã",
      },
      {
        src: "https://picsum.photos/seed/culture-studio-window/700/1166",
        alt: "Designer concentrada perto da janela com plantas e luz lateral filtrada",
        aspect: "tall",
      },
      {
        src: "https://picsum.photos/seed/culture-studio-press/900/675",
        alt: "Mãos manipulando provas de impressão sobre mesa de luz com lupas e canetas técnicas",
        aspect: "landscape",
        caption: "Prova de cor",
      },
      {
        src: "https://picsum.photos/seed/culture-studio-laugh/700/700",
        alt: "Dois colegas rindo durante reunião de revisão com post-its colados na parede atrás",
        aspect: "square",
      },
      {
        src: "https://picsum.photos/seed/culture-studio-bread/700/933",
        alt: "Pão caseiro recém-saído do forno em forma de barro sobre a mesa coletiva",
        aspect: "portrait",
        caption: "Sexta · pão da Aline",
      },
      {
        src: "https://picsum.photos/seed/culture-studio-team/900/675",
        alt: "Foto coletiva descontraída da equipe na escada interna do casarão ao fim do expediente",
        aspect: "landscape",
      },
    ],
    values: [
      {
        title: "Almoçamos juntos, todo dia",
        description:
          "A cozinha é o coração do escritório. Ninguém come no computador. A pausa de uma hora não é negociável, nem mesmo em semana de entrega.",
      },
      {
        title: "Trabalho aberto, crítica gentil",
        description:
          "Tudo que sai do estúdio passa por uma revisão coletiva antes de ir pro cliente. Críticas são honestas, dadas em voz e nunca por escrito.",
      },
      {
        title: "Sextas curtas, segundas devagar",
        description:
          "Sextas terminam às 14h. Segundas começam às 11h com café e leitura — não com Slack. Cinco anos sem hora extra na quinta-feira à noite.",
      },
    ],
    ctaText: "Ver vagas abertas",
    ctaUrl: "/carreiras",
  },
};

/* ------------------------------------------------------------------ */
/*  Restaurant — Lisbon kitchen team, no value cards, dense imagery    */
/* ------------------------------------------------------------------ */

export const RestaurantKitchen: Story = {
  args: {
    eyebrow: "A cozinha por dentro",
    headline:
      "Sete cozinheiros, um forno a lenha e a Inês que grita quando tem que gritar",
    intro:
      "Servimos vinte e oito jantares por noite, terça a sábado. Tudo o que sai daqui foi tocado por pelo menos quatro mãos e provado três vezes. A foto coletiva da família está pendurada na parede da câmara fria.",
    images: [
      {
        src: "https://picsum.photos/seed/kitchen-pass/900/675",
        alt: "Inês inclinada sobre o passe revisando empratamento com toalha branca dobrada no ombro",
        aspect: "landscape",
        caption: "Passe · 19h45",
      },
      {
        src: "https://picsum.photos/seed/kitchen-fire/700/1166",
        alt: "Cozinheiro mexendo brasa do forno a lenha com pá de ferro comprida sob luz quente",
        aspect: "tall",
      },
      {
        src: "https://picsum.photos/seed/kitchen-prep/700/700",
        alt: "Mãos cortando salsa fresca em tábua de madeira molhada com facão desfocado em movimento",
        aspect: "square",
      },
      {
        src: "https://picsum.photos/seed/kitchen-portrait/700/933",
        alt: "Pasteleira sorrindo com mãos cobertas de farinha apoiada em bancada de mármore",
        aspect: "portrait",
        caption: "Adriana · pastelaria",
      },
      {
        src: "https://picsum.photos/seed/kitchen-staff/900/675",
        alt: "Equipa da cozinha em pausa partilhando staff meal antes do serviço da noite",
        aspect: "landscape",
        caption: "Staff meal · 17h",
      },
      {
        src: "https://picsum.photos/seed/kitchen-board/700/700",
        alt: "Quadro branco com a ementa do dia escrita à mão e cartões de pedidos pendurados",
        aspect: "square",
      },
      {
        src: "https://picsum.photos/seed/kitchen-pour/700/933",
        alt: "Sommelier servindo vinho tinto numa taça sob luz de mesa com cliente desfocado ao fundo",
        aspect: "portrait",
      },
    ],
    ctaText: "Trabalhar connosco",
    ctaUrl: "/carreiras",
  },
};

/* ------------------------------------------------------------------ */
/*  Agency — bilingual creative agency, 4 values, no CTA               */
/* ------------------------------------------------------------------ */

export const BilingualCreativeAgency: Story = {
  args: {
    eyebrow: "How we work",
    headline:
      "Two cities, six time zones away, and Friday office hours we actually take",
    intro:
      "Half the agency lives in Mexico City, the other half in Berlin. We meet in person twice a year, pair on briefs across time zones the rest of the year, and treat the four-hour overlap window as sacred — no recurring meetings ever inside it.",
    images: [
      {
        src: "https://picsum.photos/seed/agency-cdmx/900/675",
        alt: "Agency members reviewing print proofs taped along studio wall in Mexico City office",
        aspect: "landscape",
        caption: "CDMX · review wall",
      },
      {
        src: "https://picsum.photos/seed/agency-berlin/700/933",
        alt: "Designer in Berlin studio at standing desk with second monitor showing layout grid",
        aspect: "portrait",
      },
      {
        src: "https://picsum.photos/seed/agency-call/700/700",
        alt: "Cross-border video call with team waving at camera from both office locations",
        aspect: "square",
        caption: "Overlap · 9am / 4pm",
      },
      {
        src: "https://picsum.photos/seed/agency-dog/700/700",
        alt: "Studio dog asleep under designer's chair with cables and sketchbook nearby",
        aspect: "square",
      },
      {
        src: "https://picsum.photos/seed/agency-walk/900/675",
        alt: "Two colleagues walking through Roma Norte neighborhood with coffees during a break",
        aspect: "landscape",
        caption: "Walk-and-talk · Roma Norte",
      },
      {
        src: "https://picsum.photos/seed/agency-pin/700/1166",
        alt: "Pinboard covered with research clippings, color swatches, and handwritten brief notes",
        aspect: "tall",
      },
      {
        src: "https://picsum.photos/seed/agency-friday/700/933",
        alt: "Empty Berlin studio at 4pm Friday with chairs pushed back and laptops closed",
        aspect: "portrait",
        caption: "Friday · 16h CET",
      },
    ],
    values: [
      {
        title: "Async by default",
        description:
          "Every brief lives in a written doc before it lives in a meeting. We assume the other studio will respond next morning, not next minute.",
      },
      {
        title: "Friday office hours, taken",
        description:
          "Fridays end at 14h CET / 7am CDMX. We do not schedule client calls into them. In four years we have moved that line exactly twice.",
      },
      {
        title: "Two annual onsites, no exceptions",
        description:
          "Once a year in Mexico City, once a year in Berlin. The whole agency, four full days, no client work. The flights and hotel are not a perk — they are the company.",
      },
      {
        title: "Pair across the overlap",
        description:
          "Senior + junior, CDMX + Berlin — every brief has a pair. The overlap window from 9am Berlin to 11am CDMX is the only slot we protect for live work.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Minimal — tiny boutique, 6 images, 2 values, eyebrow only          */
/* ------------------------------------------------------------------ */

export const BoutiqueMinimal: Story = {
  args: {
    eyebrow: "Bastidores",
    headline: "Quatro pessoas e uma loja na rua Aspicuelta",
    images: [
      {
        src: "https://picsum.photos/seed/boutique-shop/900/675",
        alt: "Vitrine da loja com peças penduradas em cabides de latão e luz natural quente",
        aspect: "landscape",
        caption: "Vila Madalena · loja",
      },
      {
        src: "https://picsum.photos/seed/boutique-portrait/700/933",
        alt: "Atendente arrumando peça em manequim no centro da loja com sorriso discreto",
        aspect: "portrait",
      },
      {
        src: "https://picsum.photos/seed/boutique-tag/700/700",
        alt: "Mãos amarrando etiqueta de papel kraft num cabide com fita de algodão crua",
        aspect: "square",
      },
      {
        src: "https://picsum.photos/seed/boutique-rack/700/1166",
        alt: "Arara de roupas em fundo branco fotografada de baixo com luz suave da manhã",
        aspect: "tall",
        caption: "Coleção · março",
      },
      {
        src: "https://picsum.photos/seed/boutique-coffee/700/700",
        alt: "Xícara de café apoiada sobre caderno de pedidos manuscritos no balcão de madeira",
        aspect: "square",
      },
      {
        src: "https://picsum.photos/seed/boutique-team/900/675",
        alt: "Equipe da loja conversando perto do provador com cortinas de linho cru",
        aspect: "landscape",
      },
    ],
    values: [
      {
        title: "Atendimento sem pressa",
        description:
          "Reservamos quarenta minutos por cliente que entra com hora marcada. Provador com quatro peças, café e tempo pra repensar.",
      },
      {
        title: "Etiqueta escrita à mão",
        description:
          "Cada peça sai da loja com etiqueta amarrada e o nome de quem atendeu escrito em caneta nanquim. Nunca usamos plástico.",
      },
    ],
    ctaText: "Marcar atendimento",
    ctaUrl: "/atendimento",
  },
};
