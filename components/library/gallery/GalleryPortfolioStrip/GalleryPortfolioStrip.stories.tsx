import type { Meta, StoryObj } from "@storybook/react";
import GalleryPortfolioStrip from "./index";

const meta: Meta<typeof GalleryPortfolioStrip> = {
  title: "Gallery/GalleryPortfolioStrip",
  component: GalleryPortfolioStrip,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof GalleryPortfolioStrip>;

/** Brand studio — full names, disciplines, year subtitles. */
export const StudioWorkIndex: Story = {
  args: {
    eyebrow: "Selected work · 2019 — 2025",
    headline: "Forty-two projects, three disciplines, no decks",
    description:
      "We work across identity, packaging, and motion. Tap a card to open the case study, or scroll for the rest.",
    items: [
      {
        image: "https://picsum.photos/seed/strip-paula/700/900",
        imageAlt: "Padaria da Paula identity applied on a paper bag",
        title: "Padaria da Paula",
        subtitle: "2024",
        discipline: "Identity",
        href: "/work/padaria-paula",
      },
      {
        image: "https://picsum.photos/seed/strip-rafael/700/900",
        imageAlt: "Rafael Tavares natural wine bottle with hand-drawn label",
        title: "Rafael Tavares Vinhos",
        subtitle: "2024",
        discipline: "Packaging",
        href: "/work/rafael-tavares",
      },
      {
        image: "https://picsum.photos/seed/strip-okazaki/700/900",
        imageAlt: "Bianca Okazaki perfumery glass bottle",
        title: "Perfumaria Okazaki",
        subtitle: "2023",
        discipline: "Packaging",
        href: "/work/okazaki",
      },
      {
        image: "https://picsum.photos/seed/strip-mira/700/900",
        imageAlt: "Laboratório Mira poster with kinetic typography",
        title: "Laboratório Mira",
        subtitle: "2023",
        discipline: "Motion",
        href: "/work/laboratorio-mira",
      },
      {
        image: "https://picsum.photos/seed/strip-mares/700/900",
        imageAlt: "Loja Marés storefront with hand-painted signage",
        title: "Loja Marés",
        subtitle: "2022",
        discipline: "Identity",
        href: "/work/mares",
      },
      {
        image: "https://picsum.photos/seed/strip-vao/700/900",
        imageAlt: "Revista Vão magazine cover with overprinted type",
        title: "Revista Vão",
        subtitle: "2022",
        discipline: "Editorial",
        href: "/work/vao",
      },
      {
        image: "https://picsum.photos/seed/strip-ciclico/700/900",
        imageAlt: "Festival Cíclico typographic poster",
        title: "Festival Cíclico",
        subtitle: "2021",
        discipline: "Identity",
        href: "/work/festival-ciclico",
      },
      {
        image: "https://picsum.photos/seed/strip-cardoso/700/900",
        imageAlt: "Hotel Cardoso brand stationery suite",
        title: "Hotel Cardoso",
        subtitle: "2021",
        discipline: "Identity",
        href: "/work/hotel-cardoso",
      },
    ],
  },
};

/** Photographer client list — one-word disciplines, no subtitles. */
export const PhotographerClientList: Story = {
  args: {
    headline: "Recent commissions",
    items: Array.from({ length: 9 }, (_, i) => {
      const clients = [
        "Aether Coffee",
        "Mariana Cardoso",
        "Hotel Cardoso",
        "Quinta da Lousa",
        "Padaria da Paula",
        "Sociedade Têxtil",
        "Rafael Tavares",
        "ARS Norte",
        "Curtumes 47",
      ];
      const disciplines = [
        "Editorial",
        "Portrait",
        "Hospitality",
        "Wedding",
        "Brand",
        "Product",
        "Bottle",
        "Documentary",
        "Architecture",
      ];
      return {
        image: `https://picsum.photos/seed/photo-strip-${i + 1}/700/900`,
        imageAlt: `Editorial photograph for ${clients[i]}`,
        title: clients[i],
        discipline: disciplines[i],
      };
    }),
  },
};

/** Architecture practice — five flagship projects. */
export const ArchitectureFlagships: Story = {
  args: {
    eyebrow: "Built work",
    headline: "Five projects we still go back to",
    description:
      "Every commission listed here is open to visit by appointment. Email us first.",
    items: [
      {
        image: "https://picsum.photos/seed/arch-strip-almirante/700/900",
        imageAlt: "Casa Almirante exterior in morning light",
        title: "Casa Almirante",
        subtitle: "Lisboa · 2023",
        discipline: "Residential",
        href: "/work/casa-almirante",
      },
      {
        image: "https://picsum.photos/seed/arch-strip-biblioteca/700/900",
        imageAlt: "Biblioteca da Sé with stepped reading terraces",
        title: "Biblioteca da Sé",
        subtitle: "Porto · 2022",
        discipline: "Civic",
        href: "/work/biblioteca-da-se",
      },
      {
        image: "https://picsum.photos/seed/arch-strip-vale/700/900",
        imageAlt: "Escola Vale Verde primary school courtyard",
        title: "Escola Vale Verde",
        subtitle: "Braga · 2021",
        discipline: "Education",
        href: "/work/escola-vale-verde",
      },
      {
        image: "https://picsum.photos/seed/arch-strip-monte/700/900",
        imageAlt: "Capela do Monte rural chapel renovation",
        title: "Capela do Monte",
        subtitle: "Alentejo · 2019",
        discipline: "Religious",
        href: "/work/capela-do-monte",
      },
      {
        image: "https://picsum.photos/seed/arch-strip-curtumes/700/900",
        imageAlt: "Curtumes 47 adaptive-reuse office in former tannery",
        title: "Curtumes 47",
        subtitle: "Porto · 2018",
        discipline: "Workplace",
        href: "/work/curtumes-47",
      },
    ],
  },
};

/** Product collection — no disciplines, year-coded subtitles. */
export const ProductCollection: Story = {
  args: {
    eyebrow: "Spring/Summer 2025",
    headline: "The full collection",
    description:
      "Twelve looks photographed by Joana Linhares against limewashed walls in our Lisbon studio.",
    items: Array.from({ length: 12 }, (_, i) => ({
      image: `https://picsum.photos/seed/prod-strip-${i + 1}/700/900`,
      imageAlt: `Look number ${String(i + 1).padStart(2, "0")} in the SS25 collection`,
      title: `Look ${String(i + 1).padStart(2, "0")}`,
      subtitle: `€${(189 + i * 24).toLocaleString("pt-PT")}`,
    })),
  },
};
