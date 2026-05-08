import type { Meta, StoryObj } from "@storybook/react";
import ProductsScrollMarquee, { type MarqueeTile } from "./index";

const meta: Meta<typeof ProductsScrollMarquee> = {
  title: "Products/ProductsScrollMarquee",
  component: ProductsScrollMarquee,
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
type Story = StoryObj<typeof ProductsScrollMarquee>;

/* ------------------------------------------------------------------ */
/*  Helper — build a deterministic tile list from a seed prefix         */
/* ------------------------------------------------------------------ */

function buildTiles(
  seedPrefix: string,
  entries: Array<{ name: string; alt: string; slug: string }>,
): MarqueeTile[] {
  return entries.map((e, i) => ({
    productName: e.name,
    image: `https://picsum.photos/seed/${seedPrefix}-${i}/600/600`,
    imageAlt: e.alt,
    productUrl: `/products/${e.slug}`,
  }));
}

/* ------------------------------------------------------------------ */
/*  Sneaker drop — bold, energetic, dark slab                           */
/* ------------------------------------------------------------------ */

export const SneakerDropDark: Story = {
  args: {
    eyebrow: "Drop de outono",
    headline: "Catorze tênis numerados que entram no estoque na sexta",
    subheadline:
      "Numeração do 38 ao 46. Cada par sai do estoque com cartão escrito à mão e cordão extra na cor original. Numerações esgotadas voltam só na próxima fornada de fábrica.",
    tiles: buildTiles("sneaker", [
      {
        name: "Tamoio Cano Alto Areia",
        alt: "Tênis cano alto bege com solado branco volumoso fotografado em luz lateral",
        slug: "tamoio-areia",
      },
      {
        name: "Tamoio Cano Alto Carvão",
        alt: "Tênis cano alto preto com cadarço branco apoiado em banco de madeira",
        slug: "tamoio-carvao",
      },
      {
        name: "Itacolomi Trail",
        alt: "Tênis de trilha verde-musgo com solado agressivo posicionado em terra batida",
        slug: "itacolomi-trail",
      },
      {
        name: "Carcará Court Branco",
        alt: "Tênis baixo de couro branco fotografado contra fundo de concreto cinza",
        slug: "carcara-court-branco",
      },
      {
        name: "Carcará Court Cordovan",
        alt: "Tênis baixo de couro cordovan com costuras à mão sobre tapete de sisal",
        slug: "carcara-court-cordovan",
      },
      {
        name: "Boitatá Runner",
        alt: "Tênis de corrida com entressola laranja-fogo e cabedal preto em estúdio",
        slug: "boitata-runner",
      },
      {
        name: "Capivara Slip-on",
        alt: "Tênis sem cadarço em lona crua dobrado sobre fundo de papelão craft",
        slug: "capivara-slip-on",
      },
      {
        name: "Curupira Mid",
        alt: "Tênis cano médio em camurça verde-oliva apoiado em pedra natural",
        slug: "curupira-mid",
      },
      {
        name: "Tucunaré Skate",
        alt: "Tênis de skate em couro preto com solado vulcanizado fotografado de cima",
        slug: "tucunare-skate",
      },
      {
        name: "Saci Lightweight",
        alt: "Tênis de corrida leve em malha branca fotografado em movimento contra fundo claro",
        slug: "saci-lightweight",
      },
      {
        name: "Anhanguera Hiker",
        alt: "Bota baixa hiker em couro caramelo posicionada sobre pedra musgosa",
        slug: "anhanguera-hiker",
      },
      {
        name: "Tamandaré Classic",
        alt: "Tênis baixo clássico em lona azul-marinho com etiqueta de couro",
        slug: "tamandare-classic",
      },
      {
        name: "Iara Aqua Sock",
        alt: "Sapatilha aquática azul-petróleo apoiada em pedra molhada à beira-mar",
        slug: "iara-aqua",
      },
      {
        name: "Pororoca Wave",
        alt: "Tênis com cabedal ondulado em tom areia fotografado contra fundo branco minimalista",
        slug: "pororoca-wave",
      },
    ]),
    productCount: 120,
    topDuration: 55,
    bottomDuration: 70,
    ctaText: "Ver o drop completo",
    ctaUrl: "/products",
    ctaStyle: "glow",
    ctaColorScheme: "accent",
    tone: "dark",
  },
};

/* ------------------------------------------------------------------ */
/*  Padaria — light tone, friendly, smaller catalog                     */
/* ------------------------------------------------------------------ */

export const PadariaArtesanal: Story = {
  args: {
    eyebrow: "Forno da semana",
    headline: "Pães e doces saindo do forno duas vezes ao dia",
    subheadline:
      "Fermentação natural com massa madre da casa. Asse na quinta às 6h e às 16h, na sexta até esgotar. Reserva por WhatsApp para retirar quentinho.",
    tiles: buildTiles("padaria", [
      {
        name: "Pão de fermentação Aurora",
        alt: "Pão de massa madre com casca dourada e cortes geométricos sobre cesta de palha",
        slug: "pao-aurora",
      },
      {
        name: "Brioche de manteiga Boiadeira",
        alt: "Brioche dourado com casquinha brilhante apoiado em pano de algodão cru",
        slug: "brioche-boiadeira",
      },
      {
        name: "Pão integral Caraíva",
        alt: "Pão integral redondo com sementes de girassol fotografado sobre tábua de madeira clara",
        slug: "pao-caraiva",
      },
      {
        name: "Croissant amanteigado",
        alt: "Croissant em camadas crocantes com farinha sobre balcão de mármore branco",
        slug: "croissant-amanteigado",
      },
      {
        name: "Bolo de laranja Itaipava",
        alt: "Bolo de laranja em forma de coroa fotografado em luz natural com ralinho da fruta",
        slug: "bolo-itaipava",
      },
      {
        name: "Pão de queijo da casa",
        alt: "Pãezinhos de queijo dourados acabando de sair do forno em assadeira preta",
        slug: "pao-de-queijo",
      },
      {
        name: "Cookie de chocolate 70%",
        alt: "Cookie redondo com pedaços de chocolate amargo fotografado partido ao meio",
        slug: "cookie-chocolate",
      },
      {
        name: "Focaccia de tomate confit",
        alt: "Focaccia retangular com tomates confitados e alecrim sobre tábua de pinho",
        slug: "focaccia-confit",
      },
      {
        name: "Pão doce de canela Catuaba",
        alt: "Rolinhos de canela com cobertura de cream cheese arrumados em forma redonda",
        slug: "pao-doce-catuaba",
      },
      {
        name: "Banoffee em copinho",
        alt: "Sobremesa em copinho de vidro com camadas de banana caramelizada e creme batido",
        slug: "banoffee",
      },
      {
        name: "Pavê de café Cerrado",
        alt: "Pavê em fatia individual com camadas de biscoito molhado em café e creme branco",
        slug: "pave-cerrado",
      },
      {
        name: "Madeleine de mel",
        alt: "Madeleines em formato de concha douradas dispostas em prato pequeno de cerâmica",
        slug: "madeleine-mel",
      },
    ]),
    productCount: 50,
    topDuration: 65,
    bottomDuration: 80,
    ctaText: "Ver o cardápio completo",
    ctaUrl: "/products",
    ctaStyle: "arrow",
    ctaColorScheme: "primary",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Acessórios — tight catalog, no count, drawOutline CTA               */
/* ------------------------------------------------------------------ */

export const AcessoriosOuro: Story = {
  args: {
    eyebrow: "Joalheria autoral",
    headline: "Dez peças banhadas em ouro 24k feitas em pequenos lotes",
    subheadline:
      "Cada peça leva entre seis e oito semanas para ficar pronta no ateliê de Belo Horizonte. Numeração discreta no fecho indica o lote e o ano da fundição.",
    tiles: buildTiles("joia", [
      {
        name: "Brinco Acará pequeno",
        alt: "Brinco delicado em forma de gota dourada apoiado em veludo preto",
        slug: "brinco-acara",
      },
      {
        name: "Anel Pirarucu trançado",
        alt: "Anel grosso com trança de fios dourados fotografado em fundo claro neutro",
        slug: "anel-pirarucu",
      },
      {
        name: "Colar Tucano longo",
        alt: "Colar longo de elos finos com pingente geométrico em ouro escovado",
        slug: "colar-tucano",
      },
      {
        name: "Pulseira Boto rígida",
        alt: "Bracelete rígido em ouro escovado fotografado em pulso de tom oliva claro",
        slug: "pulseira-boto",
      },
      {
        name: "Brinco Caju assimétrico",
        alt: "Par de brincos assimétricos com formato orgânico em ouro polido",
        slug: "brinco-caju",
      },
      {
        name: "Anel Saci martelado",
        alt: "Anel largo com superfície martelada em ouro 24k apoiado em pedra escura",
        slug: "anel-saci",
      },
      {
        name: "Gargantilha Jurupari",
        alt: "Gargantilha curta em fios trançados de ouro com fecho lateral discreto",
        slug: "gargantilha-jurupari",
      },
      {
        name: "Pulseira Curupira fina",
        alt: "Pulseira fina com elo em formato de folha apoiada sobre couro caramelo",
        slug: "pulseira-curupira",
      },
      {
        name: "Brinco Itamaracá pendente",
        alt: "Brincos longos com pendente em formato de gota arredondada em ouro",
        slug: "brinco-itamaraca",
      },
      {
        name: "Anel Cabralia clássico",
        alt: "Anel solitário com pedra rosa-pálido cravejada em base de ouro escovado",
        slug: "anel-cabralia",
      },
    ]),
    topDuration: 70,
    bottomDuration: 90,
    ctaText: "Ver toda a joalheria",
    ctaUrl: "/products",
    ctaStyle: "drawOutline",
    ctaColorScheme: "secondary",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Vinhos — neutral CTA, big count framing                             */
/* ------------------------------------------------------------------ */

export const VinhosImportados: Story = {
  args: {
    eyebrow: "Adega no Brooklin",
    headline: "Vinhos chegando do porto este mês",
    subheadline:
      "Importação direta de pequenos produtores da Borgonha, do Piemonte e do Vale do Loire. Estoque rotativo — o que esgota só volta na próxima safra.",
    tiles: buildTiles("vinho", [
      {
        name: "Borgonha Pinot Noir 2021",
        alt: "Garrafa escura de vinho tinto com rótulo minimalista preto e branco em estante de madeira escura",
        slug: "borgonha-2021",
      },
      {
        name: "Chablis Premier Cru",
        alt: "Garrafa de vinho branco em vidro verde-musgo com rótulo creme apoiada em pedra clara",
        slug: "chablis-premier",
      },
      {
        name: "Barolo Riserva 2018",
        alt: "Garrafa de vinho italiano com rótulo escuro e selo dourado fotografada em luz quente",
        slug: "barolo-riserva",
      },
      {
        name: "Sancerre da casa Gilbert",
        alt: "Garrafa de vinho branco com rótulo manuscrito em barril de carvalho ao fundo",
        slug: "sancerre-gilbert",
      },
      {
        name: "Brunello di Montalcino",
        alt: "Garrafa de vinho tinto italiano alta com rótulo dourado fosco contra parede de pedra",
        slug: "brunello-montalcino",
      },
      {
        name: "Chenin Loire 2022",
        alt: "Garrafa de vinho branco com rótulo verde-claro fotografada em mesa rústica de carvalho",
        slug: "chenin-loire",
      },
      {
        name: "Champagne Blanc de Blancs",
        alt: "Garrafa de champanhe com rolha presa por gaiola dourada apoiada em balde de gelo",
        slug: "champagne-bdb",
      },
      {
        name: "Côte-Rôtie Syrah",
        alt: "Garrafa de syrah do Rhône com rótulo rústico fotografada em adega com iluminação baixa",
        slug: "cote-rotie",
      },
      {
        name: "Riesling Mosel seco",
        alt: "Garrafa alta e fina de riesling alemão verde-musgo com rótulo branco minimalista",
        slug: "riesling-mosel",
      },
      {
        name: "Vouvray pétillant",
        alt: "Garrafa de vinho espumante natural do Vale do Loire com cápsula prateada brilhante",
        slug: "vouvray-petillant",
      },
      {
        name: "Etna Rosso vulcânico",
        alt: "Garrafa de vinho tinto siciliano com rótulo grafite em mesa de pedra vulcânica",
        slug: "etna-rosso",
      },
      {
        name: "Beaujolais Cru Morgon",
        alt: "Garrafa de beaujolais com rótulo retrô apoiada em caixote de madeira com palha",
        slug: "beaujolais-morgon",
      },
    ]),
    productCount: 240,
    topDuration: 70,
    bottomDuration: 95,
    ctaText: "Ver toda a adega",
    ctaUrl: "/products",
    ctaStyle: "dotExpand",
    ctaColorScheme: "neutral",
    tone: "dark",
  },
};
