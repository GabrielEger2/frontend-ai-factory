import type { Meta, StoryObj } from "@storybook/react";
import GalleryMasonry from "./index";

const meta: Meta<typeof GalleryMasonry> = {
  title: "Gallery/GalleryMasonry",
  component: GalleryMasonry,
  parameters: { layout: "fullscreen" },
  argTypes: {
    columns: { control: "select", options: [3, 4] },
  },
};
export default meta;
type Story = StoryObj<typeof GalleryMasonry>;

/** Portuguese-speaking design studio — varied shapes, 3-column desktop. */
export const StudioWorkArchive: Story = {
  args: {
    eyebrow: "Trabalhos selecionados",
    headline:
      "Identidade, embalagem e direção de arte para marcas que precisam ser lembradas",
    description:
      "Uma seleção de projetos entregues entre 2022 e 2025 para clientes brasileiros e portugueses. Clique em qualquer peça para abrir o estudo de caso completo.",
    columns: 3,
    items: [
      {
        image: "https://picsum.photos/seed/studio-paula/700/900",
        imageAlt: "Identidade visual da padaria Paula com paleta âmbar",
        title: "Padaria da Paula",
        category: "Identidade",
        shape: "tall",
        href: "/work/padaria-paula",
      },
      {
        image: "https://picsum.photos/seed/studio-cafe/900/600",
        imageAlt: "Embalagem de café especial em cores terrosas",
        title: "Café Mariana Tavares",
        category: "Embalagem",
        shape: "wide",
        href: "/work/cafe-mariana",
      },
      {
        image: "https://picsum.photos/seed/studio-dance/700/700",
        imageAlt: "Cartaz tipográfico para festival de dança contemporânea",
        title: "Festival Cíclico",
        category: "Cartaz",
        href: "/work/festival-ciclico",
      },
      {
        image: "https://picsum.photos/seed/studio-perfume/600/900",
        imageAlt: "Frasco de perfume artesanal com etiqueta de papel",
        title: "Perfumaria Okazaki",
        category: "Embalagem",
        shape: "tall",
        href: "/work/okazaki",
      },
      {
        image: "https://picsum.photos/seed/studio-restaurant/700/700",
        imageAlt: "Identidade aplicada em cardápio de restaurante",
        title: "Restaurante 17:43",
        category: "Identidade",
        href: "/work/dezessete-quarenta-tres",
      },
      {
        image: "https://picsum.photos/seed/studio-poster/900/600",
        imageAlt: "Pôster editorial para revista de arquitetura",
        title: "Revista Vão",
        category: "Editorial",
        shape: "wide",
        href: "/work/vao",
      },
      {
        image: "https://picsum.photos/seed/studio-shop/700/900",
        imageAlt: "Comunicação visual em vitrine de loja conceito",
        title: "Loja Marés",
        category: "Sinalização",
        shape: "tall",
        href: "/work/mares",
      },
      {
        image: "https://picsum.photos/seed/studio-wine/700/700",
        imageAlt: "Rótulo de vinho natural com ilustração orgânica",
        title: "Vinhos Rafael Tavares",
        category: "Rótulo",
        href: "/work/rafael-tavares",
      },
      {
        image: "https://picsum.photos/seed/studio-bag/700/700",
        imageAlt: "Sacola de papel com identidade aplicada",
        title: "Sacola Bianca",
        category: "Material",
        href: "/work/sacola-bianca",
      },
    ],
  },
};

/** Photographer portfolio — 4-column dense grid, no titles. */
export const PhotographerPortfolio: Story = {
  args: {
    headline: "Light, surfaces, and the people who pass through them",
    description:
      "Selected stills from editorial commissions and personal series shot in Lisbon, São Paulo, and Mexico City between 2021 and 2025.",
    columns: 4,
    items: Array.from({ length: 14 }, (_, i) => ({
      image: `https://picsum.photos/seed/photog-${i + 1}/600/${i % 3 === 0 ? 900 : 600}`,
      imageAlt: `Photographic still number ${i + 1}`,
      shape: (i % 3 === 0 ? "tall" : i % 5 === 0 ? "wide" : "default") as
        | "tall"
        | "wide"
        | "default",
    })),
  },
};

/** Architecture firm — captioned tiles, 3 columns. */
export const ArchitectureFirm: Story = {
  args: {
    eyebrow: "Built work — 2014 to 2025",
    headline: "Houses, civic buildings, and the rooms in between",
    description:
      "Eleven completed projects across the Iberian peninsula, photographed by Joana Linhares, Clara Mendes, and Daniel Schroeter.",
    columns: 3,
    items: [
      {
        image: "https://picsum.photos/seed/arch-house/900/600",
        imageAlt: "Whitewashed courtyard house with olive tree",
        title: "Casa Almirante",
        category: "Residential · 2024",
        shape: "wide",
      },
      {
        image: "https://picsum.photos/seed/arch-civic/700/900",
        imageAlt: "Civic library with stepped concrete reading terraces",
        title: "Biblioteca da Sé",
        category: "Civic · 2023",
        shape: "tall",
      },
      {
        image: "https://picsum.photos/seed/arch-school/700/700",
        imageAlt: "Primary school courtyard with painted volumes",
        title: "Escola Vale Verde",
        category: "Education · 2022",
      },
      {
        image: "https://picsum.photos/seed/arch-stair/600/900",
        imageAlt: "Helical timber stair against limewashed wall",
        title: "Casa Pátio",
        category: "Residential · 2021",
        shape: "tall",
      },
      {
        image: "https://picsum.photos/seed/arch-chapel/900/600",
        imageAlt: "Rural chapel renovation with hand-shaped vault",
        title: "Capela do Monte",
        category: "Religious · 2019",
        shape: "wide",
      },
      {
        image: "https://picsum.photos/seed/arch-office/700/700",
        imageAlt: "Adaptive-reuse office in a former tannery",
        title: "Curtumes 47",
        category: "Workplace · 2018",
      },
      {
        image: "https://picsum.photos/seed/arch-plaza/900/600",
        imageAlt: "Public plaza with linear stone seating",
        title: "Praça do Monção",
        category: "Public · 2017",
        shape: "wide",
      },
      {
        image: "https://picsum.photos/seed/arch-hotel/700/900",
        imageAlt: "Boutique hotel guest room with arched window",
        title: "Hotel Cardoso",
        category: "Hospitality · 2016",
        shape: "tall",
      },
    ],
  },
};

/** Restaurant lookbook — playful, no overlays, square-leaning grid. */
export const RestaurantLookbook: Story = {
  args: {
    eyebrow: "From the test kitchen",
    headline: "Plates we wrote down before they leave the menu",
    columns: 3,
    items: Array.from({ length: 9 }, (_, i) => ({
      image: `https://picsum.photos/seed/food-${i + 1}/700/${
        i % 4 === 1 ? 900 : 700
      }`,
      imageAlt: `Plated dish photograph ${i + 1}`,
      shape: (i % 4 === 1 ? "tall" : "default") as "tall" | "default",
    })),
  },
};
