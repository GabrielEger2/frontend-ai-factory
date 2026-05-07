import type { Meta, StoryObj } from "@storybook/react";
import HeroGridGallery from "./index";

const meta: Meta<typeof HeroGridGallery> = {
  title: "Hero/HeroGridGallery",
  component: HeroGridGallery,
  parameters: { layout: "fullscreen" },
  argTypes: {
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
    secondaryCtaStyle: {
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
    secondaryCtaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof HeroGridGallery>;

/** Boutique hotel — coastal warmth, glow CTA, neutral badges */
export const CoastalBoutiqueHotel: Story = {
  args: {
    badge: "Booking — Sept",
    eyebrow: "Trancoso, Bahia",
    headline: "A small hotel above a beach you can hear from the bedroom.",
    subheadline:
      "Twelve rooms, an open kitchen with one daily set menu, and a long flat path down through the cashew trees to the water. Open year-round, busy from December through Carnival.",
    ctaText: "Check rates",
    ctaUrl: "/booking",
    ctaStyle: "glow",
    ctaColorScheme: "primary",
    secondaryCtaText: "See the rooms",
    secondaryCtaUrl: "/rooms",
    secondaryCtaStyle: "drawOutline",
    tiles: [
      {
        image: "https://placehold.co/800x1200",
        imageAlt: "Late-afternoon view from a balcony framed by cashew leaves",
        caption: "Suite 04",
      },
      {
        image: "https://placehold.co/500x500",
        imageAlt: "Outdoor breakfast table with fresh papaya and pao de queijo",
      },
      {
        image: "https://placehold.co/300x500",
        imageAlt: "Sand path leading down through low coastal trees",
        caption: "Praia",
      },
      {
        image: "https://placehold.co/300x500",
        imageAlt: "Detail of woven hammock hanging in soft afternoon light",
      },
    ],
  },
};

/** Independent design studio — restrained, neutral CTA, draw outline secondary */
export const IndependentDesignStudio: Story = {
  args: {
    badge: "Studio 2017",
    eyebrow: "Selected work, 2022 — 2026",
    headline: "We design identity systems for places that have to feel real.",
    subheadline:
      "Forty-three projects, mostly hospitality and slow consumer goods. We work in pairs, take fourteen new clients a year, and answer email by Wednesday afternoons.",
    ctaText: "View all projects",
    ctaUrl: "/work",
    ctaStyle: "default",
    ctaColorScheme: "neutral",
    secondaryCtaText: "Studio",
    secondaryCtaUrl: "/about",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    tiles: [
      {
        image: "https://placehold.co/800x1200",
        imageAlt:
          "Identity system on a tall printed poster, hung in a workshop",
        caption: "Casa Lavanda",
      },
      {
        image: "https://placehold.co/500x500",
        imageAlt: "Wordmark detail laser-cut into birch plywood signage",
        caption: "Padaria Tate",
      },
      {
        image: "https://placehold.co/300x500",
        imageAlt: "Brand book opened to a tone-of-voice spread",
      },
      {
        image: "https://placehold.co/300x500",
        imageAlt:
          "Spec sheet showing colour values printed onto uncoated stock",
        caption: "Vol. 03",
      },
    ],
  },
};

/** Floral atelier weekly drop — warm secondary, dotExpand CTA */
export const FloralAtelierDrop: Story = {
  args: {
    badge: "Drop 18",
    eyebrow: "Weekly atelier release — friday 10am",
    headline: "Ranunculus, ammi, and the last of the season's anemones.",
    subheadline:
      "Forty-eight bouquets are wrapped and labelled in the studio on Calle Pintor Sorolla every Friday morning. Pickup before 7pm, or hand-delivery within central Valencia for an extra eight euro.",
    ctaText: "Reserve a bouquet",
    ctaUrl: "/reserve",
    ctaStyle: "dotExpand",
    ctaColorScheme: "secondary",
    secondaryCtaText: "How we work",
    secondaryCtaUrl: "/atelier",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "secondary",
    tiles: [
      {
        image: "https://placehold.co/800x1200",
        imageAlt: "Tall arrangement of pale ranunculus on a stone studio bench",
      },
      {
        image: "https://placehold.co/500x500",
        imageAlt: "Hand wrapping a small bouquet in brown kraft paper",
        caption: "Studio",
      },
      {
        image: "https://placehold.co/300x500",
        imageAlt: "Detail of anemone petals against a soft grey background",
      },
      {
        image: "https://placehold.co/300x500",
        imageAlt:
          "Studio shelf lined with labelled glass vases ready for pickup",
        caption: "07.06",
      },
    ],
  },
};

/** Restaurant tasting menu reveal — accent palette, slide CTA */
export const RestaurantTastingMenu: Story = {
  args: {
    badge: "Outono 2026",
    eyebrow: "Lapa, Rio de Janeiro",
    headline: "An eleven-course menu drawn from one cooperative in Petropolis.",
    subheadline:
      "We close every August to rebuild the menu. This season's table is open Wednesday through Saturday, two seatings, with a bar pairing developed alongside the kitchen.",
    ctaText: "Reserve a table",
    ctaUrl: "/reservations",
    ctaStyle: "slide",
    ctaColorScheme: "accent",
    secondaryCtaText: "Read the menu",
    secondaryCtaUrl: "/menu",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "accent",
    tiles: [
      {
        image: "https://placehold.co/800x1200",
        imageAlt: "Plated course with charred root vegetables on smoked cream",
        caption: "Course IV",
      },
      {
        image: "https://placehold.co/500x500",
        imageAlt:
          "Cooperative grower holding a basket of small autumn radishes",
      },
      {
        image: "https://placehold.co/300x500",
        imageAlt: "Bar service preparing the second pour of the evening",
        caption: "Bar",
      },
      {
        image: "https://placehold.co/300x500",
        imageAlt: "Dining room corner with hand-thrown ceramics on the pass",
      },
    ],
  },
};

/** Photography editorial — bold neutral, no secondary, arrow CTA */
export const PhotographyEditorial: Story = {
  args: {
    badge: "Issue 09",
    eyebrow: "Field journal",
    headline: "Three weeks across the Pampa, photographed slow.",
    subheadline:
      "A long-form essay on the gauchos still riding fence near Santana do Livramento, paired with sixty-eight photographs and a shorter conversation with the elder who kept all of it open.",
    ctaText: "Read the issue",
    ctaUrl: "/issues/09",
    ctaStyle: "arrow",
    ctaColorScheme: "neutral",
    tiles: [
      {
        image: "https://placehold.co/800x1200",
        imageAlt: "Wide shot of a rider crossing low grassland near sunset",
      },
      {
        image: "https://placehold.co/500x500",
        imageAlt: "Worn leather saddle resting on a wooden gatepost",
        caption: "06:14",
      },
      {
        image: "https://placehold.co/300x500",
        imageAlt: "Portrait detail of an older man's hands holding reins",
      },
      {
        image: "https://placehold.co/300x500",
        imageAlt: "Wire fence stretching into low fog at first light",
        caption: "Pampa",
      },
    ],
  },
};
