import type { Meta, StoryObj } from "@storybook/react";
import ProductsCategoryHub from "./index";

// Pexels public-domain clip reused from CtaVideoBackdrop.stories.tsx.
// 16:9 backdrop cropped via object-cover into a 4:3 lead tile.
const CASA_VIDEO =
  "https://videos.pexels.com/video-files/2169307/2169307-uhd_2560_1440_30fps.mp4";

const meta: Meta<typeof ProductsCategoryHub> = {
  title: "Products/ProductsCategoryHub",
  component: ProductsCategoryHub,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: {
      control: "select",
      options: ["light", "dark"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof ProductsCategoryHub>;

/* ------------------------------------------------------------------ */
/*  Casa Carambola — three categories, light tone                       */
/* ------------------------------------------------------------------ */

export const CasaCarambolaThreeUp: Story = {
  args: {
    eyebrow: "Casa & decoração",
    headline: "Três coleções para começar pela parte que mais te interessa",
    subheadline:
      "A loja é dividida por ambiente. Comece pela sala, pela cozinha ou pelo home office — todas as coleções compartilham a mesma paleta de tons terrosos.",
    categories: [
      {
        name: "Sala de estar",
        backgroundImage:
          "https://picsum.photos/seed/categoryhub-living-bg/1600/1200",
        imageAlt:
          "Sala de estar com sofá de linho cru, mesa de centro de madeira escura e estante baixa repleta de livros",
        videoSrc: CASA_VIDEO,
        bestsellerThumb:
          "https://picsum.photos/seed/categoryhub-living-thumb/240/240",
        bestsellerThumbAlt: "Sofá modular de três lugares em linho cru",
        bestsellerName: "Sofá Pirenópolis modular",
        productCount: 48,
        categoryUrl: "/products?category=sala",
      },
      {
        name: "Cozinha",
        backgroundImage:
          "https://picsum.photos/seed/categoryhub-kitchen-bg/1600/1200",
        imageAlt:
          "Bancada de cozinha com utensílios de madeira e cerâmica artesanal organizados em prateleira aberta",
        bestsellerThumb:
          "https://picsum.photos/seed/categoryhub-kitchen-thumb/240/240",
        bestsellerThumbAlt: "Conjunto de pratos rasos em cerâmica argila",
        bestsellerName: "Jogo de pratos Acará 6 peças",
        productCount: 36,
        categoryUrl: "/products?category=cozinha",
      },
      {
        name: "Home office",
        backgroundImage:
          "https://picsum.photos/seed/categoryhub-office-bg/1600/1200",
        imageAlt:
          "Mesa de trabalho de madeira clara com luminária articulada, cadeira ergonômica e quadro de cortiça",
        bestsellerThumb:
          "https://picsum.photos/seed/categoryhub-office-thumb/240/240",
        bestsellerThumbAlt: "Mesa de trabalho retangular em freijó natural",
        bestsellerName: "Escrivaninha Catuaí 1,40m",
        productCount: 22,
        categoryUrl: "/products?category=home-office",
      },
    ],
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Marca de moda — four categories, dark tone                          */
/* ------------------------------------------------------------------ */

export const MarcaDeModaQuatroDepartamentos: Story = {
  args: {
    eyebrow: "Departamentos",
    headline: "Quatro andares de loja em quatro coleções online",
    subheadline:
      "Os mesmos departamentos da loja física da Oscar Freire — feminino, masculino, calçados e acessórios. Estoque sincronizado em tempo real, retire em duas horas no centro de São Paulo.",
    categories: [
      {
        name: "Feminino",
        backgroundImage:
          "https://picsum.photos/seed/categoryhub-women-bg/1600/1200",
        imageAlt:
          "Manequim feminino com vestido longo de seda em arara metálica de ambiente comercial iluminado",
        bestsellerThumb:
          "https://picsum.photos/seed/categoryhub-women-thumb/240/240",
        bestsellerThumbAlt: "Vestido longo de seda em tom marfim",
        bestsellerName: "Vestido Tarsila seda",
        productCount: 184,
        categoryUrl: "/products?category=feminino",
      },
      {
        name: "Masculino",
        backgroundImage:
          "https://picsum.photos/seed/categoryhub-men-bg/1600/1200",
        imageAlt:
          "Manequim masculino com terno de linho cinza claro fotografado contra parede de concreto aparente",
        bestsellerThumb:
          "https://picsum.photos/seed/categoryhub-men-thumb/240/240",
        bestsellerThumbAlt: "Blazer de alfaiataria em linho cinza claro",
        bestsellerName: "Blazer Pirenópolis linho",
        productCount: 142,
        categoryUrl: "/products?category=masculino",
      },
      {
        name: "Calçados",
        backgroundImage:
          "https://picsum.photos/seed/categoryhub-shoes-bg/1600/1200",
        imageAlt:
          "Prateleira de tênis brancos e botas de couro caramelo dispostos sobre madeira escura",
        bestsellerThumb:
          "https://picsum.photos/seed/categoryhub-shoes-thumb/240/240",
        bestsellerThumbAlt: "Tênis baixo de couro branco",
        bestsellerName: "Tênis Carcará Court",
        productCount: 68,
        categoryUrl: "/products?category=calcados",
      },
      {
        name: "Acessórios",
        backgroundImage:
          "https://picsum.photos/seed/categoryhub-acc-bg/1600/1200",
        imageAlt:
          "Vitrine com bolsas de couro, lenços de seda e cintos finos arrumados em mesa de mármore",
        bestsellerThumb:
          "https://picsum.photos/seed/categoryhub-acc-thumb/240/240",
        bestsellerThumbAlt: "Bolsa estruturada em couro caramelo",
        bestsellerName: "Bolsa Itacaré couro",
        productCount: 96,
        categoryUrl: "/products?category=acessorios",
      },
    ],
    tone: "dark",
  },
};

/* ------------------------------------------------------------------ */
/*  Mercearia — three departments with custom count labels              */
/* ------------------------------------------------------------------ */

export const MerceariaItensCustom: Story = {
  args: {
    eyebrow: "Mercearia da Vila Madalena",
    headline: "Três corredores com produtores que conhecemos pelo nome",
    subheadline:
      "Cada produtor passa pela cozinha-laboratório antes de entrar no estoque. Lista de fornecedores e fichas técnicas ficam disponíveis na página de cada categoria.",
    categories: [
      {
        name: "Cafés especiais",
        backgroundImage:
          "https://picsum.photos/seed/categoryhub-coffee-bg/1600/1200",
        imageAlt:
          "Pacotes de café especial com etiquetas artesanais dispostos em prateleira de madeira clara",
        bestsellerThumb:
          "https://picsum.photos/seed/categoryhub-coffee-thumb/240/240",
        bestsellerThumbAlt: "Pacote de café Yellow Bourbon",
        bestsellerName: "Yellow Bourbon Mantiqueira",
        productCount: 14,
        countLabel: "14 torras ativas",
        categoryUrl: "/products?category=cafes",
      },
      {
        name: "Vinhos naturais",
        backgroundImage:
          "https://picsum.photos/seed/categoryhub-wine-bg/1600/1200",
        imageAlt:
          "Adega doméstica com garrafas de vinho deitadas em estante de madeira escura iluminada por luz quente",
        bestsellerThumb:
          "https://picsum.photos/seed/categoryhub-wine-thumb/240/240",
        bestsellerThumbAlt: "Garrafa de vinho tinto natural",
        bestsellerName: "Tinto da casa Tavares",
        productCount: 32,
        countLabel: "32 rótulos no estoque",
        categoryUrl: "/products?category=vinhos",
      },
      {
        name: "Queijos artesanais",
        backgroundImage:
          "https://picsum.photos/seed/categoryhub-cheese-bg/1600/1200",
        imageAlt:
          "Tábua de queijos com pedaços de variedades artesanais e azeitonas pretas sobre tábua de carvalho",
        bestsellerThumb:
          "https://picsum.photos/seed/categoryhub-cheese-thumb/240/240",
        bestsellerThumbAlt: "Queijo da Serra da Canastra",
        bestsellerName: "Canastra meia-cura",
        productCount: 8,
        countLabel: "8 produtores selecionados",
        categoryUrl: "/products?category=queijos",
      },
    ],
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Beleza — four categories, light tone, longer copy                   */
/* ------------------------------------------------------------------ */

export const BelezaQuatroLinhas: Story = {
  args: {
    eyebrow: "Linhas do atelier",
    headline: "Quatro famílias de produtos manipulados na nossa farmácia",
    subheadline:
      "Cada linha tem fórmula publicada na página da categoria. Manipulação em pequenos lotes na farmácia da Aclimação por uma farmacêutica e duas técnicas — sem terceirização.",
    categories: [
      {
        name: "Rosto",
        backgroundImage:
          "https://picsum.photos/seed/categoryhub-face-bg/1600/1200",
        imageAlt:
          "Bancada de banheiro com frascos de skincare em vidro âmbar e folhas verdes ao lado de espelho redondo",
        bestsellerThumb:
          "https://picsum.photos/seed/categoryhub-face-thumb/240/240",
        bestsellerThumbAlt: "Frasco âmbar de sérum facial",
        bestsellerName: "Sérum Nascente vitamina C",
        productCount: 18,
        categoryUrl: "/products?category=rosto",
      },
      {
        name: "Corpo",
        backgroundImage:
          "https://picsum.photos/seed/categoryhub-body-bg/1600/1200",
        imageAlt:
          "Banheira de pedra com sabonete em barra e bucha vegetal apoiados em bandeja de madeira clara",
        bestsellerThumb:
          "https://picsum.photos/seed/categoryhub-body-thumb/240/240",
        bestsellerThumbAlt: "Sabonete em barra com aveia",
        bestsellerName: "Sabonete Caatinga aveia",
        productCount: 14,
        categoryUrl: "/products?category=corpo",
      },
      {
        name: "Cabelo",
        backgroundImage:
          "https://picsum.photos/seed/categoryhub-hair-bg/1600/1200",
        imageAlt:
          "Frascos de shampoo e máscara capilar dispostos em chuveiro de azulejo branco com pendente verde ao fundo",
        bestsellerThumb:
          "https://picsum.photos/seed/categoryhub-hair-thumb/240/240",
        bestsellerThumbAlt: "Frasco de máscara capilar",
        bestsellerName: "Máscara Maresia hidratante",
        productCount: 12,
        categoryUrl: "/products?category=cabelo",
      },
      {
        name: "Aromaterapia",
        backgroundImage:
          "https://picsum.photos/seed/categoryhub-aroma-bg/1600/1200",
        imageAlt:
          "Vela aromática queimando em pote de cerâmica artesanal ao lado de difusor de bambu sobre mesa de mármore",
        bestsellerThumb:
          "https://picsum.photos/seed/categoryhub-aroma-thumb/240/240",
        bestsellerThumbAlt: "Vela em pote de cerâmica artesanal",
        bestsellerName: "Vela Boto cedro e bergamota",
        productCount: 9,
        categoryUrl: "/products?category=aromaterapia",
      },
    ],
    tone: "light",
  },
};
