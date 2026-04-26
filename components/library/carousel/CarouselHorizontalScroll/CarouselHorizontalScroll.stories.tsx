import type { Meta, StoryObj } from "@storybook/react";
import CarouselHorizontalScroll from "./index";

const meta: Meta<typeof CarouselHorizontalScroll> = {
  title: "Carousel/CarouselHorizontalScroll",
  component: CarouselHorizontalScroll,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    scrollHeightVh: {
      control: { type: "range", min: 2, max: 6, step: 1 },
    },
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div className="min-h-[40vh] bg-base-200" />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof CarouselHorizontalScroll>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Travel agency portfolio -- destinations with bold title overlays and scroll hints */
export const TravelDestinations: Story = {
  args: {
    scrollHintBefore: "Scroll down",
    scrollHintAfter: "Scroll up",
    items: [
      {
        image: "https://placehold.co/900x900/0f3460/e0e0e0?text=Iceland",
        imageAlt: "Glacier lagoon at twilight in Iceland",
        title: "Iceland",
      },
      {
        image: "https://placehold.co/900x900/2d3436/e0e0e0?text=Patagonia",
        imageAlt: "Granite peaks rising over a turquoise lake in Patagonia",
        title: "Patagonia",
      },
      {
        image: "https://placehold.co/900x900/1a1a2e/e0e0e0?text=Kyoto",
        imageAlt: "Bamboo forest path in Arashiyama, Kyoto",
        title: "Kyoto",
      },
      {
        image: "https://placehold.co/900x900/0a3d62/e0e0e0?text=Faroe",
        imageAlt: "Sea cliffs and grass-roofed cottages in the Faroe Islands",
        title: "Faroe",
      },
      {
        image: "https://placehold.co/900x900/4a4a4a/e0e0e0?text=Marrakech",
        imageAlt: "Spice market under woven canopies in Marrakech",
        title: "Marrakech",
      },
      {
        image: "https://placehold.co/900x900/0c2461/e0e0e0?text=Norway",
        imageAlt: "Fjord cliff overlook with a cruise ship below in Norway",
        title: "Norway",
      },
      {
        image: "https://placehold.co/900x900/3a3a3a/e0e0e0?text=Atacama",
        imageAlt: "Salt flats reflecting volcanoes at sunrise in the Atacama",
        title: "Atacama",
      },
    ],
    scrollHeightVh: 3,
  },
};

/** Studio case studies -- editorial headline with project thumbnails */
export const StudioCaseStudies: Story = {
  args: {
    headline: "Selected work, 2018 — 2026",
    subheadline:
      "A decade of brand systems, product launches and editorial sites. Scroll to walk through the archive.",
    items: [
      {
        image: "https://placehold.co/900x900/2c3e50/e0e0e0?text=Lumen",
        imageAlt: "Lumen brand identity — wordmark on a deep navy background",
        title: "Lumen",
      },
      {
        image: "https://placehold.co/900x900/34495e/e0e0e0?text=Forma",
        imageAlt: "Forma packaging design — minimalist typography on cream",
        title: "Forma",
      },
      {
        image: "https://placehold.co/900x900/1e272e/e0e0e0?text=Northwind",
        imageAlt:
          "Northwind website hero — compass mark over a topographic map",
        title: "Northwind",
      },
      {
        image: "https://placehold.co/900x900/2d3436/e0e0e0?text=Atlas",
        imageAlt: "Atlas annual report — data visualization spread",
        title: "Atlas",
      },
      {
        image: "https://placehold.co/900x900/0c2461/e0e0e0?text=Helio",
        imageAlt: "Helio app interface — onboarding screens on three devices",
        title: "Helio",
      },
      {
        image: "https://placehold.co/900x900/4a4a4a/e0e0e0?text=Verdant",
        imageAlt: "Verdant restaurant identity — leaf monogram on a menu card",
        title: "Verdant",
      },
    ],
    scrollHeightVh: 4,
  },
};

/** Product line -- minimal images without text overlays for cleaner reveal */
export const ProductGallery: Story = {
  args: {
    headline: "The Spring 2026 collection",
    items: [
      {
        image: "https://placehold.co/900x900/3a3a3a/e0e0e0?text=Coat+01",
        imageAlt: "Camel wool overcoat photographed on a neutral backdrop",
      },
      {
        image: "https://placehold.co/900x900/2c3e50/e0e0e0?text=Knit+02",
        imageAlt: "Cream cable-knit sweater folded on a wooden surface",
      },
      {
        image: "https://placehold.co/900x900/4a4a4a/e0e0e0?text=Bag+03",
        imageAlt: "Black leather weekender bag with brass hardware",
      },
      {
        image: "https://placehold.co/900x900/5a5a5a/e0e0e0?text=Boot+04",
        imageAlt: "Pair of suede chelsea boots in chestnut",
      },
      {
        image: "https://placehold.co/900x900/6a6a6a/e0e0e0?text=Scarf+05",
        imageAlt: "Hand-loomed merino scarf in a herringbone pattern",
      },
      {
        image: "https://placehold.co/900x900/7a7a7a/e0e0e0?text=Hat+06",
        imageAlt: "Wide-brim wool felt hat resting on a stone bench",
      },
    ],
    scrollHeightVh: 3,
  },
};

/** Conference recap -- year milestones with bold title overlays and faster pacing */
export const ConferenceRecap: Story = {
  args: {
    headline: "Six years of the conference",
    subheadline:
      "Every edition leaves a mark. Here are the moments we keep coming back to.",
    items: [
      {
        image: "https://placehold.co/900x900/0a3d62/e0e0e0?text=2020",
        imageAlt: "Empty auditorium — the year we went fully remote",
        title: "2020",
      },
      {
        image: "https://placehold.co/900x900/1a1a2e/e0e0e0?text=2021",
        imageAlt: "Hybrid stage with a small in-person audience",
        title: "2021",
      },
      {
        image: "https://placehold.co/900x900/0f3460/e0e0e0?text=2022",
        imageAlt: "Sold-out main hall with a packed standing ovation",
        title: "2022",
      },
      {
        image: "https://placehold.co/900x900/2d3436/e0e0e0?text=2023",
        imageAlt: "Outdoor evening reception with string lights",
        title: "2023",
      },
      {
        image: "https://placehold.co/900x900/0c2461/e0e0e0?text=2024",
        imageAlt: "New satellite event in Lisbon at sunset",
        title: "2024",
      },
      {
        image: "https://placehold.co/900x900/3a3a3a/e0e0e0?text=2025",
        imageAlt: "Workshop room with attendees collaborating on whiteboards",
        title: "2025",
      },
    ],
    scrollHeightVh: 2,
  },
};
