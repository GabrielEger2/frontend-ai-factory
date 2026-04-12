import type { Meta, StoryObj } from "@storybook/react";
import CarouselSwipe from "./index";

const meta: Meta<typeof CarouselSwipe> = {
  title: "Carousel/CarouselSwipe",
  component: CarouselSwipe,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    autoAdvanceMs: {
      control: { type: "range", min: 0, max: 20000, step: 1000 },
    },
    dragBuffer: {
      control: { type: "range", min: 10, max: 150, step: 10 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof CarouselSwipe>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Photography portfolio -- landscape and nature images */
export const PhotographyPortfolio: Story = {
  args: {
    items: [
      {
        image:
          "https://placehold.co/1920x1080/1a1a2e/e0e0e0?text=Mountain+Summit",
        imageAlt: "Snow-capped mountain summit at sunrise with golden light",
      },
      {
        image: "https://placehold.co/1920x1080/2d3436/e0e0e0?text=Forest+Trail",
        imageAlt: "Misty forest trail winding through ancient redwood trees",
      },
      {
        image: "https://placehold.co/1920x1080/0a3d62/e0e0e0?text=Ocean+Cliffs",
        imageAlt: "Dramatic ocean cliffs with waves crashing below at sunset",
      },
      {
        image: "https://placehold.co/1920x1080/1e272e/e0e0e0?text=Desert+Dunes",
        imageAlt: "Rolling sand dunes under a clear blue sky in the Sahara",
      },
      {
        image:
          "https://placehold.co/1920x1080/0c2461/e0e0e0?text=Northern+Lights",
        imageAlt: "Northern lights dancing green and purple over a frozen lake",
      },
    ],
    autoAdvanceMs: 10000,
  },
};

/** Real estate property showcase -- residential home images */
export const PropertyShowcase: Story = {
  args: {
    items: [
      {
        image: "https://placehold.co/1920x1080/4a4a4a/e0e0e0?text=Living+Room",
        imageAlt:
          "Spacious open-concept living room with hardwood floors and fireplace",
      },
      {
        image: "https://placehold.co/1920x1080/5a5a5a/e0e0e0?text=Kitchen",
        imageAlt:
          "Modern kitchen with granite countertops and stainless steel appliances",
      },
      {
        image:
          "https://placehold.co/1920x1080/6a6a6a/e0e0e0?text=Master+Bedroom",
        imageAlt: "Master bedroom with vaulted ceilings and en-suite bathroom",
      },
      {
        image: "https://placehold.co/1920x1080/3a3a3a/e0e0e0?text=Backyard",
        imageAlt: "Landscaped backyard with in-ground pool and covered patio",
      },
    ],
    autoAdvanceMs: 8000,
  },
};

/** Product showcase -- minimal items with no auto-advance */
export const ProductGallery: Story = {
  args: {
    items: [
      {
        image: "https://placehold.co/1920x1080/2c3e50/e0e0e0?text=Watch+Front",
        imageAlt:
          "Luxury automatic watch face with sapphire crystal and leather strap",
      },
      {
        image: "https://placehold.co/1920x1080/34495e/e0e0e0?text=Watch+Side",
        imageAlt: "Side profile showing the brushed titanium case and crown",
      },
      {
        image: "https://placehold.co/1920x1080/2c3e50/e0e0e0?text=Watch+Back",
        imageAlt: "Exhibition caseback revealing the Swiss movement mechanism",
      },
    ],
    autoAdvanceMs: 0,
  },
};
