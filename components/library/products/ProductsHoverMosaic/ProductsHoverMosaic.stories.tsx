import type { Meta, StoryObj } from "@storybook/react";
import ProductsHoverMosaic from "./index";

// Pexels public-domain clip — reused from CtaVideoBackdrop.stories.tsx.
// 16:9 backdrop letterboxed via object-cover in a 4:5 tile —
// acceptable for Storybook demo; production should use aspect-appropriate clips.
const ATELIER_VIDEO =
  "https://videos.pexels.com/video-files/4488747/4488747-uhd_2732_1440_25fps.mp4";

const meta: Meta<typeof ProductsHoverMosaic> = {
  title: "Products/ProductsHoverMosaic",
  component: ProductsHoverMosaic,
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
type Story = StoryObj<typeof ProductsHoverMosaic>;

/* ------------------------------------------------------------------ */
/*  Atelier — fashion atelier, hero + 4 flank tiles, light tone        */
/* ------------------------------------------------------------------ */

export const AtelierFashion: Story = {
  args: {
    eyebrow: "Coleção alta-costura",
    headline: "Cinco peças costuradas à mão no ateliê de Pinheiros",
    subheadline:
      "Cada modelo sai do ateliê com etiqueta numerada, ficha de tecido e o nome de quem costurou. Disponível para experimentação na loja com hora marcada.",
    hero: {
      productName: "Vestido Tarsila em seda de amoreira",
      price: "R$ 4.280",
      image: "https://picsum.photos/seed/atelier-hero-tarsila/1200/1500",
      imageAlt:
        "Vestido longo de seda em tom marfim drapeado em manequim de costura sob luz lateral suave",
      productUrl: "/products/vestido-tarsila",
      videoSrc: ATELIER_VIDEO,
    },
    tiles: [
      {
        productName: "Blazer Pirenópolis em linho cru",
        price: "R$ 1.840",
        image: "https://picsum.photos/seed/atelier-blazer/900/900",
        imageAlt:
          "Blazer estruturado de linho cru pendurado em arara de madeira clara dentro do ateliê",
        productUrl: "/products/blazer-pirenopolis",
      },
      {
        productName: "Saia Caraíva plissada",
        price: "R$ 1.260",
        image: "https://picsum.photos/seed/atelier-skirt/900/900",
        imageAlt:
          "Saia longa plissada em tom areia fotografada em movimento sobre fundo claro",
        productUrl: "/products/saia-caraiva",
      },
      {
        productName: "Camisa Itacaré com nervuras",
        price: "R$ 980",
        image: "https://picsum.photos/seed/atelier-shirt/900/900",
        imageAlt:
          "Camisa branca com nervuras finas dobrada sobre mesa de corte com tesoura de alfaiate",
        productUrl: "/products/camisa-itacare",
      },
      {
        productName: "Calça Trindade alfaiataria",
        price: "R$ 1.420",
        image: "https://picsum.photos/seed/atelier-pants/900/900",
        imageAlt:
          "Calça de alfaiataria preta de cintura alta apoiada em manequim com luz natural",
        productUrl: "/products/calca-trindade",
      },
    ],
    ctaText: "Ver toda a coleção",
    ctaUrl: "/products",
    ctaStyle: "arrow",
    ctaColorScheme: "primary",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Marcenaria — furniture studio, dark slab, 5 flank tiles            */
/* ------------------------------------------------------------------ */

export const MarcenariaDarkSlab: Story = {
  args: {
    eyebrow: "Móveis sob medida",
    headline: "Seis peças que saem do galpão de Vinhedo este mês",
    subheadline:
      "Madeira de demolição, encaixes em cavilha, acabamento em óleo de linhaça. Cada item leva entre 8 e 14 semanas para ficar pronto — agende uma visita ao galpão antes de encomendar.",
    hero: {
      productName: "Mesa de jantar Pororoca em peroba do campo",
      price: "R$ 12.480",
      image: "https://picsum.photos/seed/marcenaria-table/1200/1500",
      imageAlt:
        "Mesa de jantar comprida em madeira de peroba do campo com tampo bruto e cavaletes pretos sob spot industrial",
      productUrl: "/products/mesa-pororoca",
    },
    tiles: [
      {
        productName: "Cadeira Carcará em jacarandá",
        price: "R$ 2.640",
        image: "https://picsum.photos/seed/marcenaria-chair/900/900",
        imageAlt:
          "Cadeira de jacarandá com encosto curvo e assento em couro caramelo sobre piso de cimento queimado",
        productUrl: "/products/cadeira-carcara",
      },
      {
        productName: "Aparador Itacolomi em imbuia",
        price: "R$ 6.890",
        image: "https://picsum.photos/seed/marcenaria-sideboard/900/900",
        imageAlt:
          "Aparador baixo em imbuia com portas de palhinha natural posicionado contra parede de tijolo escuro",
        productUrl: "/products/aparador-itacolomi",
      },
      {
        productName: "Banco Capivara em freijó",
        price: "R$ 1.980",
        image: "https://picsum.photos/seed/marcenaria-bench/900/900",
        imageAlt:
          "Banco baixo de freijó com pés tornados em forma de capivara estilizada apoiado sobre tapete de sisal",
        productUrl: "/products/banco-capivara",
      },
      {
        productName: "Estante Tucunaré modular",
        price: "R$ 8.420",
        image: "https://picsum.photos/seed/marcenaria-shelf/900/900",
        imageAlt:
          "Estante modular alta em madeira escura com livros e cerâmicas distribuídos em cinco prateleiras",
        productUrl: "/products/estante-tucunare",
      },
      {
        productName: "Poltrona Boto-cor-de-rosa",
        price: "R$ 4.760",
        image: "https://picsum.photos/seed/marcenaria-armchair/900/900",
        imageAlt:
          "Poltrona estofada em linho rosa-queimado com estrutura curva de madeira escura sobre fundo de concreto",
        productUrl: "/products/poltrona-boto",
      },
    ],
    ctaText: "Ver todas as peças",
    ctaUrl: "/products",
    ctaStyle: "slide",
    ctaColorScheme: "accent",
    tone: "dark",
  },
};

/* ------------------------------------------------------------------ */
/*  Florista — flower studio, draw-outline CTA, hero + 4 tiles         */
/* ------------------------------------------------------------------ */

export const FloristaStudio: Story = {
  args: {
    eyebrow: "Buquês da semana",
    headline: "Quatro arranjos que entram na rota de entrega na sexta",
    subheadline:
      "Flores de produtor de Holambra, embalagem reciclada, cartão escrito à mão. Pedidos confirmados até quinta-feira chegam no mesmo dia em São Paulo capital.",
    hero: {
      productName: "Buquê Curitibanos em peônias e eucalipto",
      price: "R$ 384",
      image: "https://picsum.photos/seed/florista-hero/1200/1500",
      imageAlt:
        "Buquê grande de peônias rosa pálido com ramos de eucalipto prateado embrulhado em papel kraft natural",
      productUrl: "/products/buque-curitibanos",
    },
    tiles: [
      {
        productName: "Mini ramo Caju em hibiscos",
        price: "R$ 142",
        image: "https://picsum.photos/seed/florista-mini/900/900",
        imageAlt:
          "Pequeno ramo de hibiscos vermelhos amarrado com fita de algodão sobre mesa de mármore claro",
        productUrl: "/products/mini-caju",
      },
      {
        productName: "Arranjo Sertão em flores secas",
        price: "R$ 268",
        image: "https://picsum.photos/seed/florista-dried/900/900",
        imageAlt:
          "Arranjo de flores secas em tons terrosos dentro de vaso de cerâmica torneada à mão",
        productUrl: "/products/arranjo-sertao",
      },
      {
        productName: "Buquê Ipanema em rosas champagne",
        price: "R$ 296",
        image: "https://picsum.photos/seed/florista-roses/900/900",
        imageAlt:
          "Buquê redondo de rosas champagne com folhagem prateada apoiado em banco de pedra",
        productUrl: "/products/buque-ipanema",
      },
      {
        productName: "Coroa Maracanã em folhagem",
        price: "R$ 218",
        image: "https://picsum.photos/seed/florista-wreath/900/900",
        imageAlt:
          "Coroa decorativa de folhagem verde com pequenas flores brancas pendurada em porta de madeira escura",
        productUrl: "/products/coroa-maracana",
      },
    ],
    ctaText: "Ver todos os arranjos",
    ctaUrl: "/products",
    ctaStyle: "drawOutline",
    ctaColorScheme: "secondary",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Cerâmica — pottery studio, no prices, headline-led mosaic          */
/* ------------------------------------------------------------------ */

export const CeramicaSemPreco: Story = {
  args: {
    eyebrow: "Forno de novembro",
    headline: "Cinco peças que saíram do forno na última fornada",
    subheadline:
      "Cada peça é torneada e queimada por uma ceramista no ateliê de Itu. Como cada fornada tem rendimento variável, os preços ficam disponíveis no detalhe da peça.",
    hero: {
      productName: "Vaso Pirarucu de cerâmica torneada",
      image: "https://picsum.photos/seed/ceramica-vase/1200/1500",
      imageAlt:
        "Vaso alto de cerâmica com acabamento riscado em tom areia fotografado em luz natural sobre mesa de madeira clara",
      productUrl: "/products/vaso-pirarucu",
    },
    tiles: [
      {
        productName: "Tigela Acará para servir",
        image: "https://picsum.photos/seed/ceramica-bowl/900/900",
        imageAlt:
          "Tigela funda de cerâmica em tom argila apoiada em pano de algodão cru com colher de madeira ao lado",
        productUrl: "/products/tigela-acara",
      },
      {
        productName: "Caneca Tucano com alça torneada",
        image: "https://picsum.photos/seed/ceramica-mug/900/900",
        imageAlt:
          "Caneca de cerâmica com alça torneada em tom verde musgo segurada por mão sobre mesa rústica",
        productUrl: "/products/caneca-tucano",
      },
      {
        productName: "Bule Boto em barro queimado",
        image: "https://picsum.photos/seed/ceramica-teapot/900/900",
        imageAlt:
          "Bule de barro queimado com bico curvo posicionado próximo a duas xícaras pequenas em tom argila",
        productUrl: "/products/bule-boto",
      },
      {
        productName: "Travessa Surubim oval",
        image: "https://picsum.photos/seed/ceramica-platter/900/900",
        imageAlt:
          "Travessa oval de cerâmica em tom cinza-pedra com bordas irregulares apoiada em fundo de linho cru",
        productUrl: "/products/travessa-surubim",
      },
    ],
    ctaText: "Ver toda a fornada",
    ctaUrl: "/products",
    ctaStyle: "dotExpand",
    ctaColorScheme: "neutral",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Sem hero — flank-only layout, 5 tiles, glow CTA                    */
/* ------------------------------------------------------------------ */

export const SemHeroAtletica: Story = {
  args: {
    eyebrow: "Linha esportiva",
    headline: "Cinco peças que voltaram ao estoque essa semana",
    subheadline:
      "Reabastecimento parcial — algumas numerações já saíram. Reserve pelo site para retirar na loja física da Pompeia ou pedir entrega no mesmo dia.",
    tiles: [
      {
        productName: "Tênis Tamoio cano alto",
        price: "R$ 684",
        image: "https://picsum.photos/seed/sport-shoe/900/900",
        imageAlt:
          "Tênis branco de cano alto com detalhes em couro bege apoiado em banco de madeira clara",
        productUrl: "/products/tenis-tamoio",
      },
      {
        productName: "Mochila Aimoré reforçada",
        price: "R$ 542",
        image: "https://picsum.photos/seed/sport-backpack/900/900",
        imageAlt:
          "Mochila preta com alças reforçadas e fivelas metálicas pendurada em arara industrial",
        productUrl: "/products/mochila-aimore",
      },
      {
        productName: "Garrafa Tibiriçá inox",
        price: "R$ 168",
        image: "https://picsum.photos/seed/sport-bottle/900/900",
        imageAlt:
          "Garrafa térmica de aço inoxidável escovado fotografada com fundo desfocado de academia",
        productUrl: "/products/garrafa-tibirica",
      },
      {
        productName: "Camiseta Itanhaém dry-fit",
        price: "R$ 184",
        image: "https://picsum.photos/seed/sport-tee/900/900",
        imageAlt:
          "Camiseta esportiva azul-marinho dobrada sobre banco com kit de treino ao fundo",
        productUrl: "/products/camiseta-itanhaem",
      },
      {
        productName: "Shorts Iguape de corrida",
        price: "R$ 218",
        image: "https://picsum.photos/seed/sport-shorts/900/900",
        imageAlt:
          "Shorts de corrida cinza-grafite com listra lateral discreta posicionado sobre pista de tartan",
        productUrl: "/products/shorts-iguape",
      },
    ],
    ctaText: "Ver toda a linha esportiva",
    ctaUrl: "/products",
    ctaStyle: "glow",
    ctaColorScheme: "primary",
    tone: "dark",
  },
};
