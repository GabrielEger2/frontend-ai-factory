import type { Meta, StoryObj } from "@storybook/react";
import ProductsCategoryGrid from "./index";

const meta: Meta<typeof ProductsCategoryGrid> = {
  title: "Products/ProductsCategoryGrid",
  component: ProductsCategoryGrid,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: {
      control: "select",
      options: ["light", "dark"],
    },
    ctaStyle: {
      control: "select",
      options: [
        "default",
        "slide",
        "dotExpand",
        "drawOutline",
        "glow",
        "arrow",
      ],
    },
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof ProductsCategoryGrid>;

/* ------------------------------------------------------------------ */
/*  Artisan bakery — pt-BR copy, breads as the feature                 */
/* ------------------------------------------------------------------ */

export const ArtisanBakery: Story = {
  args: {
    eyebrow: "O que sai do forno",
    headline: "Quatro bancadas, um forno a lenha",
    subheadline:
      "Tudo é feito do zero, todo dia, antes do sol nascer. Reserve por categoria — a gente embala para você buscar quentinho às seis da tarde.",
    categories: [
      {
        name: "Pães",
        itemCount: "14 fornadas",
        priceFrom: "a partir de R$ 18",
        image: "https://picsum.photos/seed/bakery-breads-feature/960/1200",
        imageAlt:
          "Pães rústicos de fermentação natural sobre bancada de mármore polvilhada de farinha",
        ctaUrl: "#paes",
      },
      {
        name: "Bolos",
        itemCount: "9 sabores",
        priceFrom: "a partir de R$ 64",
        image: "https://picsum.photos/seed/bakery-cakes/960/1200",
        imageAlt:
          "Bolo de chocolate alto coberto com ganache brilhante em prato de cerâmica branca",
        ctaUrl: "#bolos",
      },
      {
        name: "Tortas",
        itemCount: "7 receitas",
        priceFrom: "a partir de R$ 52",
        image: "https://picsum.photos/seed/bakery-pies/960/1200",
        imageAlt:
          "Torta de frutas vermelhas com massa dourada e bordas crocantes recém-saída do forno",
        ctaUrl: "#tortas",
      },
      {
        name: "Salgados",
        itemCount: "12 opções",
        priceFrom: "a partir de R$ 6",
        image: "https://picsum.photos/seed/bakery-savory/960/1200",
        imageAlt:
          "Bandeja de mini quiches e empadinhas douradas dispostas em papel manteiga",
        ctaUrl: "#salgados",
      },
    ],
    ctaText: "Encomende pelo WhatsApp",
    ctaUrl: "#whatsapp",
    ctaStyle: "arrow",
    ctaColorScheme: "primary",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Menswear atelier — dark slab, slide CTA                            */
/* ------------------------------------------------------------------ */

export const MenswearAtelier: Story = {
  args: {
    eyebrow: "Coleção outono",
    headline: "Quatro categorias, cortes feitos sob medida",
    subheadline:
      "Tecidos italianos costurados por nove artesãos no atelier do bairro. Marque uma prova, ajuste o caimento, leve para casa em duas semanas.",
    categories: [
      {
        name: "Casacos",
        itemCount: "11 modelos",
        priceFrom: "a partir de R$ 1.890",
        image: "https://picsum.photos/seed/menswear-coats-feature/960/1200",
        imageAlt:
          "Casaco de lã cinza grafite pendurado em manequim de madeira com lapela trespassada",
        ctaUrl: "#casacos",
      },
      {
        name: "Malhas",
        itemCount: "8 padrões",
        priceFrom: "a partir de R$ 740",
        image: "https://picsum.photos/seed/menswear-knits/960/1200",
        imageAlt:
          "Pilha dobrada de tricôs em tons de creme e camelo sobre estante de madeira escura",
        ctaUrl: "#malhas",
      },
      {
        name: "Calças",
        itemCount: "13 cortes",
        priceFrom: "a partir de R$ 590",
        image: "https://picsum.photos/seed/menswear-trousers/960/1200",
        imageAlt:
          "Calças sociais cinza-chumbo passadas e penduradas em fila em araras de aço",
        ctaUrl: "#calcas",
      },
      {
        name: "Sapatos",
        itemCount: "6 hormas",
        priceFrom: "a partir de R$ 1.240",
        image: "https://picsum.photos/seed/menswear-shoes/960/1200",
        imageAlt:
          "Par de oxfords marrons polidos em couro encerado fotografados sobre fundo escuro",
        ctaUrl: "#sapatos",
      },
    ],
    ctaText: "Marcar prova no atelier",
    ctaUrl: "#prova",
    ctaStyle: "slide",
    ctaColorScheme: "neutral",
    tone: "dark",
  },
};

/* ------------------------------------------------------------------ */
/*  Restaurant menu — four courses across the day                      */
/* ------------------------------------------------------------------ */

export const RestaurantMenu: Story = {
  args: {
    eyebrow: "Cardápio de outono",
    headline: "O que sai da cozinha esta semana",
    subheadline:
      "Cardápio rotativo — abre quarta-feira, fecha domingo à noite. Reservas para o jantar pela tarde, almoço é por ordem de chegada.",
    categories: [
      {
        name: "Entradas",
        itemCount: "6 pratos",
        priceFrom: "a partir de R$ 38",
        image:
          "https://picsum.photos/seed/restaurant-starters-feature/960/1200",
        imageAlt:
          "Carpaccio de pera com queijo de cabra e nozes torradas em prato de pedra escura",
        ctaUrl: "#entradas",
      },
      {
        name: "Principais",
        itemCount: "8 receitas",
        priceFrom: "a partir de R$ 84",
        image: "https://picsum.photos/seed/restaurant-mains/960/1200",
        imageAlt:
          "Costela braseada por doze horas com puré de mandioquinha em prato fundo branco",
        ctaUrl: "#principais",
      },
      {
        name: "Sobremesas",
        itemCount: "5 doces",
        priceFrom: "a partir de R$ 32",
        image: "https://picsum.photos/seed/restaurant-desserts/960/1200",
        imageAlt:
          "Quenelle de sorvete de baunilha sobre crumble de avelã e calda escura de café",
        ctaUrl: "#sobremesas",
      },
      {
        name: "Bebidas",
        itemCount: "carta de 42",
        priceFrom: "taça desde R$ 28",
        image: "https://picsum.photos/seed/restaurant-drinks/960/1200",
        imageAlt:
          "Taça de vinho tinto sobre madeira escura ao lado de garrafa decantada à luz de vela",
        ctaUrl: "#bebidas",
      },
    ],
    ctaText: "Reservar mesa",
    ctaUrl: "#reservar",
    ctaStyle: "default",
    ctaColorScheme: "accent",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Perfumery boutique — by olfactory family                            */
/* ------------------------------------------------------------------ */

export const PerfumeryBoutique: Story = {
  args: {
    eyebrow: "Por família olfativa",
    headline: "Quatro famílias, um perfume que é seu",
    subheadline:
      "Comece pela família que combina com sua pele e o atendimento te guia até as três notas finais. Amostras de 2ml para levar ao perfumista da casa.",
    categories: [
      {
        name: "Florais",
        itemCount: "18 perfumes",
        priceFrom: "frasco de 50ml por R$ 480",
        image: "https://picsum.photos/seed/perfumery-floral-feature/960/1200",
        imageAlt:
          "Frascos âmbar de perfume floral com pétalas de rosa e jasmim ao redor sobre seda clara",
        ctaUrl: "#florais",
      },
      {
        name: "Amadeirados",
        itemCount: "14 perfumes",
        priceFrom: "frasco de 50ml por R$ 540",
        image: "https://picsum.photos/seed/perfumery-woody/960/1200",
        imageAlt:
          "Frasco quadrado de perfume amadeirado sobre lascas de cedro e sândalo em bandeja escura",
        ctaUrl: "#amadeirados",
      },
      {
        name: "Cítricos",
        itemCount: "11 perfumes",
        priceFrom: "frasco de 50ml por R$ 420",
        image: "https://picsum.photos/seed/perfumery-citrus/960/1200",
        imageAlt:
          "Frasco transparente de perfume cítrico com cascas de bergamota e limão siciliano em volta",
        ctaUrl: "#citricos",
      },
      {
        name: "Orientais",
        itemCount: "9 perfumes",
        priceFrom: "frasco de 50ml por R$ 620",
        image: "https://picsum.photos/seed/perfumery-oriental/960/1200",
        imageAlt:
          "Frasco dourado de perfume oriental sobre tecido bordô com âmbar e baunilha em primeiro plano",
        ctaUrl: "#orientais",
      },
    ],
    ctaText: "Agendar consulta olfativa",
    ctaUrl: "#consulta",
    ctaStyle: "drawOutline",
    ctaColorScheme: "secondary",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Flower shop — by occasion                                          */
/* ------------------------------------------------------------------ */

export const FlowerShop: Story = {
  args: {
    eyebrow: "Por ocasião",
    headline: "Para cada momento, um arranjo certo",
    subheadline:
      "Buscamos flores na CEAGESP de madrugada três vezes por semana. Encomende até as 14h para entrega no mesmo dia em São Paulo capital.",
    categories: [
      {
        name: "Casamentos",
        itemCount: "pacotes a partir de 30 convidados",
        priceFrom: "a partir de R$ 4.800",
        image: "https://picsum.photos/seed/flowers-weddings-feature/960/1200",
        imageAlt:
          "Buquê de noiva com peônias brancas e folhagem solta sobre vestido de seda marfim",
        ctaUrl: "#casamentos",
      },
      {
        name: "Aniversários",
        itemCount: "12 arranjos",
        priceFrom: "a partir de R$ 220",
        image: "https://picsum.photos/seed/flowers-birthdays/960/1200",
        imageAlt:
          "Arranjo colorido de gérberas e dálias em vaso de cerâmica turquesa sobre mesa de festa",
        ctaUrl: "#aniversarios",
      },
      {
        name: "Condolências",
        itemCount: "8 composições",
        priceFrom: "a partir de R$ 380",
        image: "https://picsum.photos/seed/flowers-condolences/960/1200",
        imageAlt:
          "Coroa de lírios brancos e folhagem verde escura sobre suporte simples em ambiente sóbrio",
        ctaUrl: "#condolencias",
      },
      {
        name: "Presentes",
        itemCount: "16 buquês",
        priceFrom: "a partir de R$ 160",
        image: "https://picsum.photos/seed/flowers-gifts/960/1200",
        imageAlt:
          "Buquê pequeno de rosas cor-de-rosa embrulhado em papel kraft com fita de cetim bege",
        ctaUrl: "#presentes",
      },
    ],
    ctaText: "Encomendar para hoje",
    ctaUrl: "#encomendar",
    ctaStyle: "glow",
    ctaColorScheme: "primary",
    tone: "light",
  },
};
