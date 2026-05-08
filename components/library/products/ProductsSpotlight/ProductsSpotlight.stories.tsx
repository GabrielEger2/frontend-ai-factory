import type { Meta, StoryObj } from "@storybook/react";
import ProductsSpotlight from "./index";

// Pexels public-domain clip reused from CtaVideoBackdrop.stories.tsx.
// 16:9 backdrop cropped via object-cover into a 4:5 product tile.
const AUDIO_VIDEO =
  "https://videos.pexels.com/video-files/3015527/3015527-uhd_2560_1440_24fps.mp4";

const meta: Meta<typeof ProductsSpotlight> = {
  title: "Products/ProductsSpotlight",
  component: ProductsSpotlight,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: {
      control: "select",
      options: ["light", "dark"],
    },
    imageLeft: {
      control: "boolean",
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
    secondaryCtaStyle: {
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
    secondaryCtaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof ProductsSpotlight>;

/* ------------------------------------------------------------------ */
/*  Concept furniture — image right, full premium treatment            */
/*    • compare price + priceNote                                       */
/*    • 3 thumbnails                                                    */
/*    • secondary CTA                                                   */
/* ------------------------------------------------------------------ */

export const ConceptFurnitureFlagship: Story = {
  args: {
    eyebrow: "Edição numerada",
    productName: "Poltrona Carambola em jacarandá maciço",
    tagline:
      "Marcenaria à mão na serra da Mantiqueira, costura em linho cru de Limeira.",
    description:
      "Apenas 38 unidades por safra. A estrutura é torneada em jacarandá certificado, lixada em sete passes e finalizada com cera de carnaúba. O assento aceita encomenda em linho cru, suede vinho ou veludo grafite.",
    price: "R$ 8.420",
    priceCompare: "R$ 9.680",
    priceNote: "12x sem juros",
    image: "https://picsum.photos/seed/spotlight-chair-main/960/1200",
    imageAlt:
      "Poltrona de jacarandá com assento de linho cru fotografada de três quartos sobre piso de cimento queimado",
    thumbnails: [
      {
        image: "https://picsum.photos/seed/spotlight-chair-detail-1/600/600",
        imageAlt:
          "Detalhe do braço torneado da poltrona em luz natural lateral",
      },
      {
        image: "https://picsum.photos/seed/spotlight-chair-detail-2/600/600",
        imageAlt:
          "Costura do assento de linho cru com pregas alinhadas e botão de madeira",
      },
      {
        image: "https://picsum.photos/seed/spotlight-chair-detail-3/600/600",
        imageAlt:
          "Selo numerado de série gravado a fogo na base traseira da poltrona",
      },
    ],
    specs: [
      { label: "Madeira", value: "Jacarandá certificado FSC" },
      { label: "Estofado", value: "Linho cru 480 g/m²" },
      { label: "Dimensões", value: "82 × 76 × 84 cm" },
      { label: "Peso", value: "18,4 kg" },
      { label: "Acabamento", value: "Cera de carnaúba" },
      { label: "Garantia", value: "10 anos" },
    ],
    ctaText: "Reservar a peça",
    ctaUrl: "/products/poltrona-carambola",
    ctaStyle: "default",
    ctaColorScheme: "primary",
    secondaryCtaText: "Ver toda a linha",
    secondaryCtaUrl: "/products",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    imageLeft: false,
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Specialty coffee — image left, dark slab                           */
/*    • imageLeft: true                                                 */
/*    • tone: dark                                                      */
/*    • no compare price, but priceNote shows free shipping             */
/*    • 2 thumbnails                                                    */
/* ------------------------------------------------------------------ */

export const SpecialtyCoffeeMicrolot: Story = {
  args: {
    eyebrow: "Microlote da semana",
    productName: "Geisha amarelo — Sítio Boa Vista, Caparaó",
    tagline: "Torra clara, doçura de mel, fermentação anaeróbica de 96 horas.",
    description:
      "Colhido a 1.420 metros e fermentado nos próprios frutos por quatro dias antes da secagem em terreiro suspenso. Cada saca rende 18 frascos de 250 g, torrados na sexta e despachados na segunda.",
    price: "R$ 168",
    priceNote: "Frete grátis sudeste",
    image: "https://picsum.photos/seed/spotlight-geisha-main/960/1200",
    imageAlt:
      "Frasco de café Geisha sobre balança digital com xícara de porcelana branca ao fundo em luz lateral suave",
    thumbnails: [
      {
        image: "https://picsum.photos/seed/spotlight-geisha-detail-1/600/600",
        imageAlt:
          "Grãos torrados de Geisha sobre superfície de pedra escura iluminada de cima",
      },
      {
        image: "https://picsum.photos/seed/spotlight-geisha-detail-2/600/600",
        imageAlt:
          "Etiqueta artesanal escrita à mão grudada no frasco preto fosco",
      },
    ],
    specs: [
      { label: "Variedade", value: "Geisha amarelo" },
      { label: "Altitude", value: "1.420 m" },
      { label: "Processo", value: "Anaeróbico 96 h" },
      { label: "Torra", value: "Clara — 17 de outubro" },
      { label: "Peso", value: "250 g" },
    ],
    ctaText: "Comprar microlote",
    ctaUrl: "/products/geisha-boa-vista",
    ctaStyle: "slide",
    ctaColorScheme: "accent",
    secondaryCtaText: "Ver torra da semana",
    secondaryCtaUrl: "/products",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    imageLeft: true,
    tone: "dark",
  },
};

/* ------------------------------------------------------------------ */
/*  Skincare atelier — minimal, no thumbnails                          */
/*    • no thumbnails                                                   */
/*    • no secondary CTA                                                */
/*    • compare price + priceNote                                       */
/* ------------------------------------------------------------------ */

export const SkincareAtelierLaunch: Story = {
  args: {
    eyebrow: "Lançamento de outono",
    productName: "Sérum Nascente vitamina C 12% e ácido ferúlico",
    tagline:
      "Manipulação em pequenos lotes na Aclimação, fragrância natural de bergamota.",
    description:
      "Fórmula estabilizada em frasco âmbar conta-gotas com filtro UV. Sente leve no contato, absorve em 40 segundos e clareia manchas residuais sem deixar a pele oleosa.",
    price: "R$ 218",
    priceCompare: "R$ 248",
    priceNote: "Reposição assinatura -15%",
    image: "https://picsum.photos/seed/spotlight-serum-main/960/1200",
    imageAlt:
      "Frasco âmbar conta-gotas com sérum facial sobre toalha de linho cru ao lado de folhas de eucalipto",
    specs: [
      { label: "Volume", value: "30 ml" },
      { label: "Vitamina C", value: "12% L-ascórbico" },
      { label: "Validade", value: "8 meses após aberto" },
      { label: "pH", value: "3,4" },
      { label: "Fragrância", value: "Bergamota natural" },
    ],
    ctaText: "Comprar sérum",
    ctaUrl: "/products/serum-nascente",
    ctaStyle: "arrow",
    ctaColorScheme: "primary",
    imageLeft: false,
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Streetwear drop — image left, glow CTA, sale tone                  */
/*    • imageLeft: true                                                 */
/*    • compare price showing the drop discount                         */
/*    • priceNote with parcelamento                                     */
/*    • 3 thumbnails (color variants)                                   */
/*    • secondary CTA goes to size guide                                */
/* ------------------------------------------------------------------ */

export const StreetwearLimitedDrop: Story = {
  args: {
    eyebrow: "Drop 04 — costurado no Brás",
    productName: "Moletom Cordel oversized em algodão pesado",
    tagline:
      "Numerado de 001 a 184. Cartão escrito à mão e etiqueta de série na bainha.",
    description:
      "Algodão pesado de 480 g/m² costurado em São Paulo. Ribana dupla no punho, capuz forrado e bolso canguru com costura reforçada. Lavar avesso na água fria, secar à sombra.",
    price: "R$ 384",
    priceCompare: "R$ 440",
    priceNote: "Em até 6x sem juros",
    image: "https://picsum.photos/seed/spotlight-hoodie-main/960/1200",
    imageAlt:
      "Moletom oversized em tom areia fotografado de frente em manequim industrial em estúdio com luz lateral",
    thumbnails: [
      {
        image: "https://picsum.photos/seed/spotlight-hoodie-detail-1/600/600",
        imageAlt:
          "Bordado discreto no peito do moletom em fio cru sobre tecido areia",
      },
      {
        image: "https://picsum.photos/seed/spotlight-hoodie-detail-2/600/600",
        imageAlt:
          "Etiqueta numerada costurada na bainha interna com tipografia em serifa",
      },
      {
        image: "https://picsum.photos/seed/spotlight-hoodie-detail-3/600/600",
        imageAlt:
          "Capuz forrado em moletom felpado fotografado em luz natural lateral",
      },
    ],
    specs: [
      { label: "Gramatura", value: "480 g/m²" },
      { label: "Composição", value: "100% algodão" },
      { label: "Tamanhos", value: "P · M · G · GG · XGG" },
      { label: "Edição", value: "184 unidades" },
      { label: "Origem", value: "Costurado no Brás, SP" },
    ],
    ctaText: "Garantir o drop",
    ctaUrl: "/products/moletom-cordel",
    ctaStyle: "glow",
    ctaColorScheme: "primary",
    secondaryCtaText: "Guia de medidas",
    secondaryCtaUrl: "/products/moletom-cordel/medidas",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    imageLeft: true,
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Audio house — dark slab, no compare price                          */
/*    • tone: dark                                                      */
/*    • no priceCompare, no priceNote                                   */
/*    • 6 specs (max)                                                   */
/*    • secondary CTA                                                   */
/* ------------------------------------------------------------------ */

export const AudioHouseHeadphones: Story = {
  args: {
    eyebrow: "Concept piece",
    productName: "Tambor TM-08 fones over-ear de referência",
    tagline:
      "Construído em alumínio escovado e couro de cabra do interior de Minas.",
    description:
      "Drivers de 50 mm com diafragma em mylar reforçado, almofadas em couro respirável e cabo destacável OFC. Calibrado em estúdio para resposta plana até 18 kHz com graves controlados.",
    price: "R$ 5.940",
    image: "https://picsum.photos/seed/spotlight-headphones-main/960/1200",
    imageAlt:
      "Fone de ouvido over-ear preto com hastes de alumínio escovado fotografado contra fundo grafite com luz cinematográfica",
    videoSrc: AUDIO_VIDEO,
    thumbnails: [
      {
        image:
          "https://picsum.photos/seed/spotlight-headphones-detail-1/600/600",
        imageAlt:
          "Detalhe da almofada em couro de cabra com costura aparente em fio escuro",
      },
      {
        image:
          "https://picsum.photos/seed/spotlight-headphones-detail-2/600/600",
        imageAlt:
          "Conector OFC banhado a ouro encaixado na carcaça de alumínio do fone",
      },
    ],
    specs: [
      { label: "Drivers", value: "50 mm mylar" },
      { label: "Impedância", value: "32 Ω" },
      { label: "Sensibilidade", value: "104 dB SPL" },
      { label: "Resposta", value: "12 Hz – 28 kHz" },
      { label: "Cabo", value: "OFC 2,4 m destacável" },
      { label: "Peso", value: "342 g" },
    ],
    ctaText: "Reservar par",
    ctaUrl: "/products/tambor-tm-08",
    ctaStyle: "drawOutline",
    ctaColorScheme: "accent",
    secondaryCtaText: "Especificações técnicas",
    secondaryCtaUrl: "/products/tambor-tm-08/specs",
    secondaryCtaStyle: "default",
    secondaryCtaColorScheme: "neutral",
    imageLeft: false,
    tone: "dark",
  },
};
