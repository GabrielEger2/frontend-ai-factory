import type { Meta, StoryObj } from "@storybook/react";
import ProductsBundleCards from "./index";

const meta: Meta<typeof ProductsBundleCards> = {
  title: "Products/ProductsBundleCards",
  component: ProductsBundleCards,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: {
      control: "select",
      options: ["light", "dark"],
    },
    cardCtaStyle: {
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
    cardCtaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    footerCtaStyle: {
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
    footerCtaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof ProductsBundleCards>;

/* ------------------------------------------------------------------ */
/*  Artisan bakery — three bundles, lead card "popular"                */
/* ------------------------------------------------------------------ */

export const ArtisanBakery: Story = {
  args: {
    eyebrow: "Kits para a semana",
    headline: "Três combos que saem do forno juntos",
    subheadline:
      "A gente embala antes do balcão abrir, você retira a partir das sete da manhã. Bom para café da manhã, almoço de domingo e tarde com visita.",
    bundles: [
      {
        name: "Kit Café da Manhã",
        description:
          "O básico de quem acorda cedo: um pão, uma broa, uma manteiga e um doce.",
        image: "https://picsum.photos/seed/bundle-bakery-breakfast/960/720",
        imageAlt:
          "Cesta de vime com pão de fermentação natural, broa de fubá, manteiga em pote e geleia de figo",
        items: [
          "1 pão de fermentação natural (500g)",
          "1 broa de fubá com erva-doce",
          "Manteiga da serra em pote 180g",
          "Geleia artesanal de figo 220g",
          "Café moído da casa 250g",
        ],
        price: "R$ 124",
        priceCompare: "R$ 168",
        savingsHint: "Economize R$ 44",
        ctaText: "Reservar para sábado",
        ctaUrl: "#kit-cafe",
      },
      {
        name: "Mesa de Domingo",
        description:
          "O combo da família — sai uma vez por semana, dá para cinco pessoas.",
        image: "https://picsum.photos/seed/bundle-bakery-sunday/960/720",
        imageAlt:
          "Mesa com pão grande de campanha, torta salgada de palmito, bolo de fubá e potes de pasta de cebola caramelizada",
        items: [
          "1 pão de campanha grande (1,2kg)",
          "1 torta salgada de palmito (8 fatias)",
          "1 bolo de fubá com goiabada (10 fatias)",
          "Pasta de cebola caramelizada 220g",
          "Pasta de berinjela defumada 220g",
          "Pão de queijo congelado caixa de 24",
        ],
        price: "R$ 248",
        priceCompare: "R$ 326",
        savingsHint: "Economize R$ 78",
        badge: "popular",
        ctaText: "Encomendar para domingo",
        ctaUrl: "#kit-domingo",
      },
      {
        name: "Tarde com Visita",
        description:
          "Pequenos doces e salgados para servir com café quando chega gente.",
        image: "https://picsum.photos/seed/bundle-bakery-afternoon/960/720",
        imageAlt:
          "Bandeja com mini quiches, palmiers, biscoitos amanteigados e madeleines servidos em prato de cerâmica branca",
        items: [
          "12 mini quiches sortidas",
          "10 palmiers de açúcar mascavo",
          "8 madeleines de limão siciliano",
          "Lata de biscoitos amanteigados (350g)",
        ],
        price: "R$ 162",
        ctaText: "Levar para hoje",
        ctaUrl: "#kit-tarde",
      },
    ],
    footerCtaText: "Ver todos os produtos",
    footerCtaUrl: "/products",
    footerCtaStyle: "arrow",
    footerCtaColorScheme: "primary",
    cardCtaStyle: "default",
    cardCtaColorScheme: "primary",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Skincare boutique — dark slab, two bundles, "best-value" lead      */
/* ------------------------------------------------------------------ */

export const SkincareBoutique: Story = {
  args: {
    eyebrow: "Rotina assinada",
    headline: "Dois rituais montados pelas nossas farmacêuticas",
    subheadline:
      "Cada combo é pensado para um perfil de pele e nasce de uma consulta de 20 minutos. Se a primeira escolha não funcionar, a gente troca em 30 dias.",
    bundles: [
      {
        name: "Ritual Pele Madura",
        description:
          "Para pele acima dos 45 que perdeu firmeza nas maçãs e no contorno.",
        image: "https://picsum.photos/seed/bundle-skin-mature/960/720",
        imageAlt:
          "Três frascos âmbar de sérum, hidratante e óleo facial alinhados sobre toalha de linho cinza claro",
        items: [
          "Sérum de retinol encapsulado 30ml",
          "Hidratante peptídico noturno 50ml",
          "Óleo facial de argan e bakuchiol 30ml",
          "Esfoliante enzimático suave 50g",
          "Máscara de bioestimulação semanal x4",
        ],
        price: "R$ 612",
        priceCompare: "R$ 824",
        savingsHint: "Economize R$ 212",
        badge: "best-value",
        ctaText: "Agendar consulta de pele",
        ctaUrl: "#ritual-madura",
      },
      {
        name: "Ritual Pele Oleosa",
        description:
          "Para pele acneica entre 18 e 30 anos que precisa controle, não ressecamento.",
        image: "https://picsum.photos/seed/bundle-skin-oily/960/720",
        imageAlt:
          "Frascos brancos de sabonete, tônico e gel hidratante apoiados em pedra escura ao lado de toalha branca",
        items: [
          "Sabonete de niacinamida 150ml",
          "Tônico de ácido salicílico 200ml",
          "Hidratante em gel oil-free 50g",
          "Sérum de azelaico 10% 30ml",
        ],
        price: "R$ 384",
        priceCompare: "R$ 472",
        savingsHint: "Economize R$ 88",
        ctaText: "Começar pelo diagnóstico",
        ctaUrl: "#ritual-oleosa",
      },
    ],
    footerCtaText: "Ver linha completa",
    footerCtaUrl: "/products",
    footerCtaStyle: "drawOutline",
    footerCtaColorScheme: "secondary",
    cardCtaStyle: "slide",
    cardCtaColorScheme: "primary",
    tone: "dark",
  },
};

/* ------------------------------------------------------------------ */
/*  Coffee roastery — three bundles, "editor-pick" badge               */
/* ------------------------------------------------------------------ */

export const CoffeeRoastery: Story = {
  args: {
    eyebrow: "Caixas do mês",
    headline: "Três caixas para começar bem o dia",
    subheadline:
      "Torrefação de quarta-feira, despacho na quinta. Grãos de produtores que a gente visita pessoalmente — Mantiqueira, Cerrado e Chapada.",
    bundles: [
      {
        name: "Descoberta Brasil",
        description:
          "Três regiões em uma caixa — bom para quem está começando.",
        image: "https://picsum.photos/seed/bundle-coffee-discovery/960/720",
        imageAlt:
          "Três pacotes de café especial em papel kraft sobre balança antiga de cozinha em mesa de madeira escura",
        items: [
          "Mantiqueira amarelo bourbon 250g",
          "Cerrado catuaí vermelho 250g",
          "Chapada Diamantina mundo novo 250g",
          "Cartão com perfil sensorial de cada lote",
        ],
        price: "R$ 158",
        priceCompare: "R$ 192",
        savingsHint: "Economize R$ 34",
        ctaText: "Levar pra casa",
        ctaUrl: "#caixa-descoberta",
      },
      {
        name: "Assinatura Mensal",
        description:
          "Uma caixa por mês com o lote que está no auge da temporada.",
        image: "https://picsum.photos/seed/bundle-coffee-monthly/960/720",
        imageAlt:
          "Caixa de papelão branco aberta revelando dois pacotes de café 250g e duas barras de chocolate amargo embaladas em papel ofício",
        items: [
          "2 microlotes de 250g escolhidos pela equipe",
          "1 barra de chocolate 70% para harmonização",
          "Acesso ao grupo de WhatsApp da torrefação",
          "10% off em moedores e filtros na loja",
        ],
        price: "R$ 124",
        priceCompare: "R$ 154",
        savingsHint: "Economize 19% no mês",
        badge: "editor-pick",
        ctaText: "Assinar e receber em casa",
        ctaUrl: "#caixa-assinatura",
      },
      {
        name: "Kit Cafeteria",
        description:
          "Para quem montou um cantinho em casa e quer extrair como barista.",
        image: "https://picsum.photos/seed/bundle-coffee-pro/960/720",
        imageAlt:
          "Bule hario v60 ao lado de balança de precisão, moedor manual e pacote de café especial sobre bancada de mármore",
        items: [
          "Hario V60 02 cerâmica branca",
          "Balança de precisão 0,1g com timer",
          "Moedor manual de cerâmica",
          "Pacote de filtros tabbed x100",
          "Microlote do mês 250g",
        ],
        price: "R$ 486",
        priceCompare: "R$ 612",
        savingsHint: "Economize R$ 126",
        ctaText: "Montar minha cafeteria",
        ctaUrl: "#kit-cafeteria",
      },
    ],
    footerCtaText: "Ver todos os cafés",
    footerCtaUrl: "/products",
    footerCtaStyle: "dotExpand",
    footerCtaColorScheme: "neutral",
    cardCtaStyle: "default",
    cardCtaColorScheme: "primary",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Floral atelier — image-less, copy-led, two bundles                 */
/* ------------------------------------------------------------------ */

export const FloralAtelier: Story = {
  args: {
    eyebrow: "Pacotes de evento",
    headline: "Dois pacotes para casamento de até 80 convidados",
    subheadline:
      "Buscamos a flor na CEAGESP de madrugada, montamos no atelier e entregamos no local quatro horas antes da cerimônia. Ajustes inclusos até a véspera.",
    bundles: [
      {
        name: "Pacote Cerimônia Civil",
        description:
          "Cerimônias menores em casa, cartório, restaurante ou jardim privado.",
        items: [
          "1 buquê de noiva com peônias e folhagem solta",
          "1 buquê pequeno para a madrinha de honra",
          "2 arranjos baixos para mesa de cerimônia",
          "12 mini-arranjos para mesas de convidados (até 50 lugares)",
          "Boutonnière do noivo com flor da estação",
        ],
        price: "R$ 4.280",
        priceCompare: "R$ 5.140",
        savingsHint: "Economize R$ 860",
        ctaText: "Falar com a equipe",
        ctaUrl: "#pacote-civil",
      },
      {
        name: "Pacote Casa de Festas",
        description:
          "Cerimônias com até 80 convidados, com pista, lounge e bar separado.",
        items: [
          "1 buquê de noiva editorial com cinco tipos de flor",
          "2 buquês menores para madrinhas",
          "1 arco floral para cerimônia (3,2m de boca)",
          "10 arranjos altos para mesas redondas",
          "8 mini-arranjos para lounge e bar",
          "Decoração de bolo e mesa de doces",
        ],
        price: "R$ 8.640",
        priceCompare: "R$ 10.420",
        savingsHint: "Economize R$ 1.780",
        badge: "popular",
        ctaText: "Reservar data no atelier",
        ctaUrl: "#pacote-festas",
      },
    ],
    footerCtaText: "Ver todos os arranjos",
    footerCtaUrl: "/products",
    footerCtaStyle: "arrow",
    footerCtaColorScheme: "primary",
    cardCtaStyle: "drawOutline",
    cardCtaColorScheme: "secondary",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Gift box studio — three bundles, no compare price (clean tier)     */
/* ------------------------------------------------------------------ */

export const GiftBoxStudio: Story = {
  args: {
    eyebrow: "Caixas para presentear",
    headline: "Três caixas prontas para entregar essa semana",
    subheadline:
      "Cada caixa é montada e fechada no atelier, com cartão escrito à mão pela nossa equipe. Você só escolhe a mensagem — a gente entrega em São Paulo capital até as 18h do mesmo dia.",
    bundles: [
      {
        name: "Caixa Boas-Vindas",
        description:
          "Para vizinho novo, casa nova, primeiro emprego ou recém-formado.",
        image: "https://picsum.photos/seed/bundle-gift-welcome/960/720",
        imageAlt:
          "Caixa de papelão kraft aberta com bombons, vela aromática, livro de capa dura e cartão escrito à mão",
        items: [
          "Vela aromática de capim-limão 220g",
          "Caixa de bombons artesanais x12",
          "Livro pequeno da estação (capa dura)",
          "Cartão escrito à mão",
        ],
        price: "R$ 218",
        ctaText: "Enviar essa caixa",
        ctaUrl: "#caixa-boas-vindas",
      },
      {
        name: "Caixa Mãe e Bebê",
        description:
          "Para chá de bebê, primeiro mês ou alta hospitalar — testado por enfermeiras.",
        image: "https://picsum.photos/seed/bundle-gift-baby/960/720",
        imageAlt:
          "Caixa de papelão branca com manta de algodão, livrinho de pano, sabonete líquido infantil e biscoitos amanteigados embalados em fita verde-água",
        items: [
          "Manta de algodão orgânico 80×80cm",
          "Livrinho de pano com texturas",
          "Sabonete líquido infantil 250ml",
          "Biscoitos amanteigados para a mãe (lata 200g)",
          "Chá de erva-doce e camomila 60g",
        ],
        price: "R$ 312",
        badge: "popular",
        ctaText: "Enviar para a maternidade",
        ctaUrl: "#caixa-bebe",
      },
      {
        name: "Caixa Aniversário Premium",
        description:
          "Para aniversário de chefe, sócio ou cliente que pediu cabeça.",
        image: "https://picsum.photos/seed/bundle-gift-premium/960/720",
        imageAlt:
          "Caixa retangular de couro escuro contendo garrafa de vinho tinto, tábua de madeira escura, taça de cristal e caixa de chocolates premium",
        items: [
          "Garrafa de vinho tinto da casa (Douro DOC)",
          "Tábua de madeira de demolição assinada",
          "Taça de cristal soprado à mão",
          "Caixa de chocolates 70% x16",
          "Cartão escrito a tinta nanquim",
        ],
        price: "R$ 624",
        ctaText: "Enviar com cartão personalizado",
        ctaUrl: "#caixa-premium",
      },
    ],
    footerCtaText: "Ver todas as caixas",
    footerCtaUrl: "/products",
    footerCtaStyle: "arrow",
    footerCtaColorScheme: "primary",
    cardCtaStyle: "default",
    cardCtaColorScheme: "primary",
    tone: "light",
  },
};
