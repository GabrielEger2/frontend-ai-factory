import type { Meta, StoryObj } from "@storybook/react";
import ProductsFeaturedStrip from "./index";

const meta: Meta<typeof ProductsFeaturedStrip> = {
  title: "Products/ProductsFeaturedStrip",
  component: ProductsFeaturedStrip,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: {
      control: "select",
      options: ["light", "dark"],
    },
    featureFirst: {
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
  },
};
export default meta;
type Story = StoryObj<typeof ProductsFeaturedStrip>;

/* ------------------------------------------------------------------ */
/*  Concept store — feature tile + sale badge + variant chips          */
/* ------------------------------------------------------------------ */

export const ConceptStoreSelection: Story = {
  args: {
    eyebrow: "Selecionados da semana",
    headline: "Cinco peças que saíram da prateleira em três dias",
    subheadline:
      "A curadoria gira toda quarta-feira. Reserve pelo site e retire na loja da Vila Madalena com café por conta da casa.",
    products: [
      {
        name: "Cadeira Carambola em jacarandá",
        price: "R$ 2.640",
        priceCompare: "R$ 3.180",
        badge: "oferta",
        badgeLabel: "-17%",
        image: "https://picsum.photos/seed/concept-chair-feature/960/1280",
        imageAlt:
          "Cadeira de madeira de jacarandá com assento estofado em linho cru fotografada em ambiente claro",
        variants: ["Jacarandá", "Imbuia", "Freijó"],
        ctaUrl: "/products/cadeira-carambola",
      },
      {
        name: "Luminária Boto de mesa",
        price: "R$ 890",
        badge: "mais-vendido",
        image: "https://picsum.photos/seed/concept-lamp/960/1280",
        imageAlt:
          "Luminária de mesa em cerâmica creme com cúpula de papel washi acesa sobre escrivaninha",
        variants: ["Creme", "Argila", "Carvão"],
        ctaUrl: "/products/luminaria-boto",
      },
      {
        name: "Vaso Pirarucu de cerâmica torneada",
        price: "R$ 384",
        badge: "novo",
        image: "https://picsum.photos/seed/concept-vase/960/1280",
        imageAlt:
          "Vaso de cerâmica artesanal alto com acabamento riscado em tom areia sobre mesa de madeira",
        variants: ["P", "M", "G"],
        ctaUrl: "/products/vaso-pirarucu",
      },
      {
        name: "Tapete Sertão em algodão tramado",
        price: "R$ 1.290",
        priceCompare: "R$ 1.480",
        image: "https://picsum.photos/seed/concept-rug/960/1280",
        imageAlt:
          "Tapete retangular tramado em fios de algodão cru e terracota dobrado sobre piso de cimento queimado",
        variants: ["1,40 × 2,00", "1,60 × 2,30"],
        ctaUrl: "/products/tapete-sertao",
      },
      {
        name: "Bandeja Itaipava em mármore travertino",
        price: "R$ 460",
        image: "https://picsum.photos/seed/concept-tray/960/1280",
        imageAlt:
          "Bandeja oval de mármore travertino bege com xícara de café e flor seca em primeiro plano",
        ctaUrl: "/products/bandeja-itaipava",
      },
    ],
    featureFirst: true,
    ctaText: "Ver todos os produtos",
    ctaUrl: "/products",
    ctaStyle: "arrow",
    ctaColorScheme: "primary",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Specialty coffee — uniform 4-up rail, no feature tile               */
/* ------------------------------------------------------------------ */

export const SpecialtyCoffeeShelf: Story = {
  args: {
    eyebrow: "Torra da semana",
    headline: "Quatro grãos que chegaram fresquinhos da fazenda",
    subheadline:
      "Cada lote é torrado na sexta-feira e enviado na segunda. Embalagem com válvula desgaseificadora — chega no seu endereço com o aroma intacto.",
    products: [
      {
        name: "Yellow Bourbon — Mantiqueira",
        price: "R$ 68",
        badge: "novo",
        image: "https://picsum.photos/seed/coffee-bourbon/960/1280",
        imageAlt:
          "Pacote de café especial Yellow Bourbon com etiqueta artesanal apoiado em saca de juta com grãos espalhados",
        variants: ["250g", "500g", "1kg"],
        ctaUrl: "/products/yellow-bourbon",
      },
      {
        name: "Catuaí Vermelho — Cerrado",
        price: "R$ 54",
        badge: "mais-vendido",
        image: "https://picsum.photos/seed/coffee-catuai/960/1280",
        imageAlt:
          "Saquinho de café Catuaí Vermelho ao lado de prensa francesa em mesa de madeira clara com luz da manhã",
        variants: ["250g", "500g"],
        ctaUrl: "/products/catuai-vermelho",
      },
      {
        name: "Geisha — Sítio Boa Vista",
        price: "R$ 142",
        priceCompare: "R$ 168",
        badge: "oferta",
        badgeLabel: "Edição limitada",
        image: "https://picsum.photos/seed/coffee-geisha/960/1280",
        imageAlt:
          "Embalagem preta de café Geisha sobre balança digital com xícara de porcelana branca ao fundo",
        variants: ["100g", "250g"],
        ctaUrl: "/products/geisha",
      },
      {
        name: "Mundo Novo — Sul de Minas",
        price: "R$ 46",
        image: "https://picsum.photos/seed/coffee-mundonovo/960/1280",
        imageAlt:
          "Pacote de café Mundo Novo apoiado em mesa de madeira com colher dosadora e grãos torrados ao redor",
        variants: ["250g", "500g", "1kg"],
        ctaUrl: "/products/mundo-novo",
      },
    ],
    featureFirst: false,
    ctaText: "Ver toda a torra",
    ctaUrl: "/products",
    ctaStyle: "dotExpand",
    ctaColorScheme: "neutral",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Skincare atelier — dark slab, slide CTA                             */
/* ------------------------------------------------------------------ */

export const SkincareAtelierDark: Story = {
  args: {
    eyebrow: "Linha rosto",
    headline: "Seis fórmulas que dormem na sua pele",
    subheadline:
      "Manipulação em pequenos lotes, fragrância natural, frasco de vidro. Produzido no atelier da Aclimação por uma farmacêutica e duas técnicas.",
    products: [
      {
        name: "Sérum Nascente vitamina C 12%",
        price: "R$ 218",
        priceCompare: "R$ 248",
        badge: "mais-vendido",
        image: "https://picsum.photos/seed/skincare-serum-feature/960/1280",
        imageAlt:
          "Frasco âmbar conta-gotas com sérum facial sobre toalha de linho cru ao lado de folhas verdes",
        variants: ["30ml", "50ml"],
        ctaUrl: "/products/serum-nascente",
      },
      {
        name: "Hidratante Maresia ácido hialurônico",
        price: "R$ 164",
        badge: "novo",
        image: "https://picsum.photos/seed/skincare-moisturizer/960/1280",
        imageAlt:
          "Pote de vidro com creme hidratante branco e tampa de bambu sobre fundo de pedra escura",
        variants: ["50ml"],
        ctaUrl: "/products/hidratante-maresia",
      },
      {
        name: "Tônico Aurora água termal e niacinamida",
        price: "R$ 128",
        image: "https://picsum.photos/seed/skincare-toner/960/1280",
        imageAlt:
          "Frasco transparente de tônico facial com etiqueta minimalista posicionado entre folhas de eucalipto",
        variants: ["100ml", "200ml"],
        ctaUrl: "/products/tonico-aurora",
      },
      {
        name: "Óleo Velame ácido ferúlico",
        price: "R$ 196",
        priceCompare: "R$ 232",
        badge: "oferta",
        badgeLabel: "-15%",
        image: "https://picsum.photos/seed/skincare-oil/960/1280",
        imageAlt:
          "Frasco quadrado de óleo facial âmbar pingando uma gota dourada sobre o conta-gotas em luz lateral",
        variants: ["30ml"],
        ctaUrl: "/products/oleo-velame",
      },
      {
        name: "Esfoliante Graviola enzimático",
        price: "R$ 142",
        image: "https://picsum.photos/seed/skincare-exfoliant/960/1280",
        imageAlt:
          "Pote de esfoliante facial em tom verde-claro aberto mostrando a textura granulada sobre fundo preto",
        variants: ["75g"],
        ctaUrl: "/products/esfoliante-graviola",
      },
      {
        name: "Máscara Caatinga argila branca",
        price: "R$ 98",
        image: "https://picsum.photos/seed/skincare-mask/960/1280",
        imageAlt:
          "Tubo de máscara facial de argila branca apoiado em pedra natural com pincel de bambu ao lado",
        variants: ["60ml"],
        ctaUrl: "/products/mascara-caatinga",
      },
    ],
    featureFirst: true,
    ctaText: "Ver toda a linha rosto",
    ctaUrl: "/products",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    tone: "dark",
  },
};

/* ------------------------------------------------------------------ */
/*  Plant studio — minimalist, no badges, no compare prices             */
/* ------------------------------------------------------------------ */

export const PlantStudioMinimal: Story = {
  args: {
    eyebrow: "Vivas e bem cuidadas",
    headline: "Quatro plantas que combinam com apartamento",
    subheadline:
      "Acompanham vaso de cerâmica torneada à mão e guia de rega impressa. Entrega em São Paulo capital com motoboy próprio.",
    products: [
      {
        name: "Costela-de-adão Marajó",
        price: "R$ 248",
        image: "https://picsum.photos/seed/plant-monstera-feature/960/1280",
        imageAlt:
          "Costela-de-adão grande em vaso de cerâmica creme posicionada em canto iluminado de sala minimalista",
        variants: ["Pequena", "Média", "Grande"],
        ctaUrl: "/products/costela-marajo",
      },
      {
        name: "Pacová Tijuca em vaso fosco",
        price: "R$ 184",
        image: "https://picsum.photos/seed/plant-pacova/960/1280",
        imageAlt:
          "Planta pacová com folhas verdes brilhantes em vaso fosco preto sobre mesa lateral de madeira clara",
        variants: ["Média"],
        ctaUrl: "/products/pacova-tijuca",
      },
      {
        name: "Espada-de-são-jorge Caxangá",
        price: "R$ 132",
        image: "https://picsum.photos/seed/plant-sansevieria/960/1280",
        imageAlt:
          "Trio de espadas-de-são-jorge altas em vaso de barro queimado posicionado próximo a parede de tijolo",
        variants: ["Pequena", "Média"],
        ctaUrl: "/products/espada-caxanga",
      },
      {
        name: "Zamioculca Boitatá",
        price: "R$ 168",
        image: "https://picsum.photos/seed/plant-zamioculca/960/1280",
        imageAlt:
          "Zamioculca com folhas verdes brilhantes em vaso esmaltado azul-petróleo sobre piso de tacão de madeira",
        variants: ["Média", "Grande"],
        ctaUrl: "/products/zamioculca-boitata",
      },
    ],
    featureFirst: true,
    ctaText: "Ver todas as plantas",
    ctaUrl: "/products",
    ctaStyle: "drawOutline",
    ctaColorScheme: "secondary",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Streetwear drop — uniform grid, badges + variants for sizes         */
/* ------------------------------------------------------------------ */

export const StreetwearDrop: Story = {
  args: {
    eyebrow: "Drop de outono",
    headline: "Oito peças soltas no estoque até esgotar",
    subheadline:
      "Numeradas, costuradas no Brás, fotografadas em luz natural. Cada peça sai do estoque com etiqueta de série e cartão escrito à mão.",
    products: [
      {
        name: "Moletom Cordel oversized",
        price: "R$ 384",
        priceCompare: "R$ 440",
        badge: "oferta",
        badgeLabel: "Últimas 6",
        image: "https://picsum.photos/seed/street-hoodie-feature/960/1280",
        imageAlt:
          "Moletom oversized em tom areia com bordado discreto no peito fotografado em manequim industrial",
        variants: ["P", "M", "G", "GG", "XGG"],
        ctaUrl: "/products/moletom-cordel",
      },
      {
        name: "Camiseta Boiadeira heavy",
        price: "R$ 168",
        badge: "mais-vendido",
        image: "https://picsum.photos/seed/street-tee/960/1280",
        imageAlt:
          "Camiseta heavy de algodão pesado dobrada sobre banco de madeira em estúdio com luz lateral suave",
        variants: ["P", "M", "G", "GG"],
        ctaUrl: "/products/camiseta-boiadeira",
      },
      {
        name: "Calça Capivara cargo",
        price: "R$ 412",
        badge: "novo",
        image: "https://picsum.photos/seed/street-cargo/960/1280",
        imageAlt:
          "Calça cargo verde-oliva com bolsos laterais reforçados pendurada em arara metálica industrial",
        variants: ["38", "40", "42", "44", "46"],
        ctaUrl: "/products/calca-capivara",
      },
      {
        name: "Bermuda Caiçara washed",
        price: "R$ 218",
        image: "https://picsum.photos/seed/street-shorts/960/1280",
        imageAlt:
          "Bermuda jeans washed dobrada e empilhada com etiqueta artesanal sobre fundo de papelão craft",
        variants: ["38", "40", "42", "44"],
        ctaUrl: "/products/bermuda-caicara",
      },
    ],
    featureFirst: true,
    ctaText: "Ver o drop completo",
    ctaUrl: "/products",
    ctaStyle: "glow",
    ctaColorScheme: "accent",
    tone: "light",
  },
};
