import type { Meta, StoryObj } from "@storybook/react";
import GalleryLightboxGrid from "./index";

const meta: Meta<typeof GalleryLightboxGrid> = {
  title: "Gallery/GalleryLightboxGrid",
  component: GalleryLightboxGrid,
  parameters: { layout: "fullscreen" },
  argTypes: {
    columns: { control: "select", options: [2, 3, 4] },
  },
};
export default meta;
type Story = StoryObj<typeof GalleryLightboxGrid>;

/** Real-estate listing — 6 photos with locations and photographer credit. */
export const RealEstateListing: Story = {
  args: {
    eyebrow: "Casa Almirante · Lisboa",
    headline:
      "Eight rooms, two patios, and the wall that gave the house its name",
    description:
      "Property tour shot by Joana Linhares in March 2025. Click any photograph to view full-resolution and read the caption.",
    columns: 3,
    items: [
      {
        image: "https://picsum.photos/seed/house-front/600/600",
        imageAlt: "Front facade of a whitewashed Lisbon townhouse",
        caption:
          "South-facing facade with the original 1894 azulejo restored above the door.",
        meta: "Front · Rua das Janelas Verdes",
      },
      {
        image: "https://picsum.photos/seed/house-living/600/600",
        imageAlt: "Living room with herringbone floor and tall windows",
        caption:
          "Living room — herringbone floor reclaimed from the building's original beams.",
        meta: "Floor 1 · 28 m²",
      },
      {
        image: "https://picsum.photos/seed/house-kitchen/600/600",
        imageAlt: "Kitchen with marble counter and brass fittings",
        caption:
          "Kitchen — Estremoz marble counter, brass fittings sourced from Águeda.",
        meta: "Floor 1 · 16 m²",
      },
      {
        image: "https://picsum.photos/seed/house-bath/600/600",
        imageAlt: "Bathroom with terrazzo floor and arched mirror",
        caption:
          "Primary bath — terrazzo poured in place, arched mirror handmade in Porto.",
        meta: "Floor 2 · 9 m²",
      },
      {
        image: "https://picsum.photos/seed/house-bed/600/600",
        imageAlt: "Bedroom with linen curtains and wooden ceiling",
        caption:
          "Primary bedroom — original chestnut ceiling, linen curtains by Sociedade Têxtil.",
        meta: "Floor 2 · 22 m²",
      },
      {
        image: "https://picsum.photos/seed/house-patio/600/600",
        imageAlt: "Inner patio with olive tree and stone pavers",
        caption: "Inner patio — 60-year-old olive tree, hand-cut stone pavers.",
        meta: "Garden · 18 m²",
      },
    ],
  },
};

/** Conference recap — 9 photos, 3-column grid, photographer credit per slot. */
export const ConferenceRecap: Story = {
  args: {
    eyebrow: "Field Notes 2025 · Mexico City",
    headline: "Three days of design talks, workshops, and very long dinners",
    description:
      "Selected stills from the conference. Photography by Daniel Schroeter, Luiza Camargo, and Rafael Tavares.",
    columns: 3,
    items: Array.from({ length: 9 }, (_, i) => {
      const photographers = [
        "Daniel Schroeter",
        "Luiza Camargo",
        "Rafael Tavares",
      ];
      const moments = [
        "Opening keynote — Mariana Cardoso on civic interfaces",
        "Workshop room — color systems on paper, not screens",
        "Lunch courtyard — long tables, longer conversations",
        "Studio visit — Estudio Acapulco backstage tour",
        "Q&A — Bianca Okazaki and Rafael Tavares on type",
        "Print room — risograph editions for attendees",
        "Closing party — under the jacaranda tree",
        "Hallway moment — sketchbooks open on the floor",
        "Departure morning — borrowing umbrellas at 6 a.m.",
      ];
      return {
        image: `https://picsum.photos/seed/conf-${i + 1}/600/600`,
        imageAlt: `Conference photograph — ${moments[i]}`,
        caption: moments[i],
        meta: `Day ${Math.floor(i / 3) + 1} · ${photographers[i % 3]}`,
      };
    }),
  },
};

/** Product photography — 4-column tight grid, captions optional. */
export const ProductPhotography: Story = {
  args: {
    eyebrow: "Spring/Summer 2025",
    headline: "The full collection, photographed on natural light",
    columns: 4,
    items: Array.from({ length: 12 }, (_, i) => ({
      image: `https://picsum.photos/seed/prod-${i + 1}/600/600`,
      imageAlt: `Product photograph number ${i + 1}`,
      caption: `Look ${String(i + 1).padStart(2, "0")} — wool coat over cotton shirt, photographed against limewash.`,
      meta: `SS25 · €${(189 + i * 24).toLocaleString("pt-PT")}`,
    })),
  },
};

/** Wedding venue — 6 photos, 2-column wide grid. */
export const WeddingVenue: Story = {
  args: {
    eyebrow: "Quinta da Lousa · Sintra",
    headline: "Six rooms across two estates, built between 1612 and 2024",
    description:
      "Click any photograph for the full-resolution view and notes from our events team.",
    columns: 2,
    items: [
      {
        image: "https://picsum.photos/seed/venue-hall/800/800",
        imageAlt: "Main hall with vaulted ceiling and chandelier",
        caption:
          "Main hall — 92 seated, 140 standing, original 17th-century vaulted ceiling.",
        meta: "Capacity 140 · Indoor",
      },
      {
        image: "https://picsum.photos/seed/venue-garden/800/800",
        imageAlt: "Walled garden with long stone tables",
        caption:
          "Walled garden — long tables seat 64; tented for rain in under three hours.",
        meta: "Capacity 84 · Outdoor",
      },
      {
        image: "https://picsum.photos/seed/venue-chapel/800/800",
        imageAlt: "Small private chapel with carved altar",
        caption:
          "Private chapel — used for ceremonies up to 40 guests; available for civil only.",
        meta: "Capacity 40 · Ceremony",
      },
      {
        image: "https://picsum.photos/seed/venue-suite/800/800",
        imageAlt: "Bridal suite with antique armoire",
        caption:
          "Bridal suite — south-facing morning light; private hair and makeup station.",
        meta: "Bridal · Annex Wing",
      },
      {
        image: "https://picsum.photos/seed/venue-bar/800/800",
        imageAlt: "Stone-arched bar with copper fittings",
        caption: "Drinks pavilion — covered, heated for winter weddings.",
        meta: "Reception · 80 standing",
      },
      {
        image: "https://picsum.photos/seed/venue-table/800/800",
        imageAlt: "Long banquet table set with linen and brass",
        caption:
          "Banquet table set — linens, glassware, and brass included with venue hire.",
        meta: "Inclusive of styling",
      },
    ],
  },
};
