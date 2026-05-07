import type { Meta, StoryObj } from "@storybook/react";
import CarouselThumbnailNav from "./index";

const meta: Meta<typeof CarouselThumbnailNav> = {
  title: "Gallery/CarouselThumbnailNav",
  component: CarouselThumbnailNav,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    aspectRatio: {
      control: { type: "select" },
      options: ["1:1", "4:3", "3:2", "16:9"],
    },
    showArrows: { control: { type: "boolean" } },
    zoomHint: { control: { type: "boolean" } },
    dragBuffer: {
      control: { type: "range", min: 20, max: 200, step: 10 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof CarouselThumbnailNav>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** E-commerce product page — leather weekender shown from multiple angles. */
export const ProductDetail: Story = {
  args: {
    eyebrow: "Travel · The Cognac Edition",
    headline: "Rua Augusta Weekender, 38L",
    description:
      "Full-grain Brazilian leather, dual-zip top, and a structured base that keeps its shape after 12 boarding passes. Photographed in Vila Madalena.",
    aspectRatio: "4:3",
    zoomHint: true,
    items: [
      {
        image: "https://picsum.photos/seed/weekender-front/1280/960",
        thumbnail: "https://picsum.photos/seed/weekender-front/240/240",
        imageAlt:
          "Cognac leather weekender bag photographed from the front against a linen backdrop",
        caption: "Front — full-grain leather, oxidized brass hardware",
      },
      {
        image: "https://picsum.photos/seed/weekender-side/1280/960",
        thumbnail: "https://picsum.photos/seed/weekender-side/240/240",
        imageAlt: "Side profile showing the gusset stitching and side handle",
        caption: "Side — hand-stitched gusset with reinforced corners",
      },
      {
        image: "https://picsum.photos/seed/weekender-interior/1280/960",
        thumbnail: "https://picsum.photos/seed/weekender-interior/240/240",
        imageAlt:
          "Interior view of the bag open, showing the laundry pocket and laptop sleeve",
        caption: "Interior — separate laundry pocket, padded 16-inch sleeve",
      },
      {
        image: "https://picsum.photos/seed/weekender-detail/1280/960",
        thumbnail: "https://picsum.photos/seed/weekender-detail/240/240",
        imageAlt:
          "Macro detail of the brass buckle and edge-painted leather strap",
        caption: "Hardware — solid brass buckle, edge-painted strap",
      },
      {
        image: "https://picsum.photos/seed/weekender-styled/1280/960",
        thumbnail: "https://picsum.photos/seed/weekender-styled/240/240",
        imageAlt: "Bag styled on a wooden bench at a São Paulo train platform",
        caption: "On location — Estação da Luz, late afternoon",
      },
    ],
  },
};

/** Real estate listing — showing rooms of a single property. */
export const PropertyTour: Story = {
  args: {
    eyebrow: "Listing · Pinheiros, 142m²",
    headline: "Two-bedroom loft on Rua Cardeal Arcoverde",
    description:
      "Recently renovated, north-facing, with original 1960s parquet and a 12m² balcony overlooking the canopy of Praça Benedito Calixto.",
    aspectRatio: "3:2",
    items: [
      {
        image: "https://picsum.photos/seed/loft-living/1280/853",
        imageAlt:
          "Open living room with original parquet floors and floor-to-ceiling windows",
        caption: "Living — 28m², north-facing windows",
      },
      {
        image: "https://picsum.photos/seed/loft-kitchen/1280/853",
        imageAlt:
          "Open kitchen with island, marble countertop and brass tap fixtures",
        caption: "Kitchen — 14m², island seating for four",
      },
      {
        image: "https://picsum.photos/seed/loft-bedroom/1280/853",
        imageAlt:
          "Master bedroom with built-in oak wardrobes and en-suite door",
        caption: "Master suite — 22m² with walk-through closet",
      },
      {
        image: "https://picsum.photos/seed/loft-bath/1280/853",
        imageAlt: "Bathroom with terrazzo flooring and a freestanding tub",
        caption: "Master bath — terrazzo, freestanding tub",
      },
      {
        image: "https://picsum.photos/seed/loft-balcony/1280/853",
        imageAlt:
          "Balcony with potted plants overlooking a tree-lined city square",
        caption: "Balcony — 12m², south-east aspect",
      },
      {
        image: "https://picsum.photos/seed/loft-floorplan/1280/853",
        imageAlt: "Floor plan of the apartment showing room layout",
        caption: "Floor plan — total 142m² built area",
      },
    ],
  },
};

/** Portfolio case — design system rollout shown stage by stage. */
export const PortfolioCase: Story = {
  args: {
    eyebrow: "Case study · Banco Sequoia",
    headline: "From a 47-page brand audit to a working design system",
    description:
      "Engagement summary across four months: discovery, foundations, component library, and the first product surface to ship on the new system.",
    aspectRatio: "16:9",
    items: [
      {
        image: "https://picsum.photos/seed/case-discovery/1600/900",
        imageAlt:
          "Workshop wall covered in printed audit pages and sticky notes",
        caption: "Phase 1 — 47-page audit across product, marketing, and ops",
      },
      {
        image: "https://picsum.photos/seed/case-foundations/1600/900",
        imageAlt: "Design tokens displayed on a Figma canvas",
        caption: "Phase 2 — color, type, spacing, and motion tokens",
      },
      {
        image: "https://picsum.photos/seed/case-library/1600/900",
        imageAlt: "Component library page in Figma showing button variants",
        caption: "Phase 3 — 64 components, all themed off the token set",
      },
      {
        image: "https://picsum.photos/seed/case-shipped/1600/900",
        imageAlt:
          "Final account dashboard rebuilt on the new system, in light theme",
        caption: "Phase 4 — account dashboard live to 18,400 customers",
      },
    ],
  },
};

/** Two-image edge case — minimal item count, headline only. */
export const SquareTwoUp: Story = {
  args: {
    headline: "Old workshop · new workshop",
    aspectRatio: "1:1",
    showArrows: true,
    items: [
      {
        image: "https://picsum.photos/seed/workshop-old/1000/1000",
        imageAlt: "Cluttered original carpentry workshop with timber stacks",
        caption: "Original space, Avenida Pacaembu — 64m²",
      },
      {
        image: "https://picsum.photos/seed/workshop-new/1000/1000",
        imageAlt: "Renovated workshop with organized tool walls and machinery",
        caption: "Renovated space, Rua Coriolano — 184m²",
      },
    ],
  },
};

/** No header — uses default placeholder items, useful for picker previews. */
export const HeaderlessDefaults: Story = {
  args: {
    aspectRatio: "4:3",
    zoomHint: false,
  },
};
