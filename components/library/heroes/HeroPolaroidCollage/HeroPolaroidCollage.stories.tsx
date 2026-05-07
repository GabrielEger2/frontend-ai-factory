import type { Meta, StoryObj } from "@storybook/react";
import HeroPolaroidCollage from "./index";

const meta: Meta<typeof HeroPolaroidCollage> = {
  title: "Hero/HeroPolaroidCollage",
  component: HeroPolaroidCollage,
  parameters: { layout: "fullscreen" },
  argTypes: {
    scriptAccentColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    tapeColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
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
type Story = StoryObj<typeof HeroPolaroidCollage>;

/** Wedding photographer — script accent, four cards, slide CTA */
export const WeddingPhotographer: Story = {
  args: {
    eyebrow: "Booking 2026 — twelve weddings a year",
    headline: "Honest photographs of",
    scriptAccent: "small ceremonies.",
    scriptAccentColorScheme: "primary",
    subheadline:
      "Beatriz Okazaki is a wedding photographer based out of Porto Alegre, working primarily across the south of Brazil and northern Portugal. Twelve weddings a year, mostly weekday and elopement, always with a second shooter.",
    ctaText: "See recent weddings",
    ctaUrl: "/portfolio",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    secondaryCtaText: "How I work",
    secondaryCtaUrl: "/process",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    tapeColorScheme: "accent",
    polaroids: [
      {
        image: "https://placehold.co/400x400",
        imageAlt:
          "Couple laughing on a balcony just after the ceremony in late afternoon light",
        caption: "rafael & mari · 04.2026",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt:
          "Detail of joined hands resting on an embroidered linen napkin",
        caption: "the toast",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt:
          "Long table reception lit only by candles and string lights at dusk",
        caption: "9:14pm",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt:
          "Bride and her father walking through a sunlit cloister before ceremony",
        caption: "before",
      },
    ],
  },
};

/** Slow-cafe family business — playful, accent script, three cards */
export const NeighborhoodCafe: Story = {
  args: {
    eyebrow: "Calle das Flores 47, Porto · open 7 — 18",
    headline: "A small cafe, run by",
    scriptAccent: "two siblings.",
    scriptAccentColorScheme: "accent",
    subheadline:
      "We bake everything in the morning, close at six, and rest on Mondays. The espresso comes from a roaster two streets over, and the flat whites are made by the same person who said hello when you walked in.",
    ctaText: "See the menu",
    ctaUrl: "/menu",
    ctaStyle: "default",
    ctaColorScheme: "accent",
    secondaryCtaText: "Visit the cafe",
    secondaryCtaUrl: "/visit",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    tapeColorScheme: "primary",
    polaroids: [
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Detail of a freshly poured flat white on a wooden counter",
        caption: "flat white · 08:14",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Tray of warm cardamom buns just out of the oven",
        caption: "cardamom buns",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Sister tying her apron at the start of a Saturday shift",
        caption: "ana, saturday",
      },
    ],
  },
};

/** Family bookshop — restrained, neutral accent, four cards, glow CTA */
export const IndependentBookshop: Story = {
  args: {
    eyebrow: "Open 22 years · run by three generations",
    headline: "A small bookshop with",
    scriptAccent: "long memory.",
    scriptAccentColorScheme: "neutral",
    subheadline:
      "Three thousand titles in three languages, hand-arranged by the people who actually read them. Saturday morning poetry hour, monthly translation circle, and a coffee from the cafe next door if you ask nicely.",
    ctaText: "Browse the shelves",
    ctaUrl: "/shelves",
    ctaStyle: "glow",
    ctaColorScheme: "neutral",
    secondaryCtaText: "Read our newsletter",
    secondaryCtaUrl: "/letter",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    tapeColorScheme: "secondary",
    polaroids: [
      {
        image: "https://placehold.co/400x400",
        imageAlt:
          "Tall bookshelves seen from the front desk in afternoon light",
        caption: "front room",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Stack of poetry books with a hand-written note on top",
        caption: "this week's pick",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt:
          "Owner reading at the front counter, mid-conversation with a regular",
        caption: "andre, weds",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Cat asleep on a closed hardcover by the window",
        caption: "rosa",
      },
    ],
  },
};

/** Travel diary publication — friendly, dotExpand CTA, accent script, three cards */
export const TravelDiary: Story = {
  args: {
    eyebrow: "Issue 07 — argentina, autumn",
    headline: "Three weeks across Patagonia,",
    scriptAccent: "photographed slow.",
    scriptAccentColorScheme: "primary",
    subheadline:
      "A long-form essay across El Chalten, Bariloche, and the long flat road south. Sixty-eight photographs, four conversations with the people who keep that part of the country open in winter, and a foldout map of the route.",
    ctaText: "Read issue 07",
    ctaUrl: "/issues/07",
    ctaStyle: "dotExpand",
    ctaColorScheme: "primary",
    secondaryCtaText: "Subscribe to the diary",
    secondaryCtaUrl: "/subscribe",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    tapeColorScheme: "accent",
    polaroids: [
      {
        image: "https://placehold.co/400x400",
        imageAlt:
          "Wide grassland and a distant peak under a long flat sky in early autumn",
        caption: "ruta 40 · 06:14",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt:
          "Hands holding a small enamel mug of mate in cold morning air",
        caption: "first mate",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt:
          "Long-distance photo of a horse and rider crossing a low riverbed",
        caption: "near el chalten",
      },
    ],
  },
};

/** Pottery studio drop — secondary script, four cards, arrow CTA */
export const PotteryStudioDrop: Story = {
  args: {
    eyebrow: "Spring drop — 14 may, 11am brt",
    headline: "Forty-eight new vessels,",
    scriptAccent: "thrown in pairs.",
    scriptAccentColorScheme: "secondary",
    subheadline:
      "Each piece in this season is thrown by hand and finished in lots of two — one we keep in the studio, one we ship out. Glazed in three colorways drawn from the studio garden in late summer.",
    ctaText: "Reserve a piece",
    ctaUrl: "/shop/spring",
    ctaStyle: "arrow",
    ctaColorScheme: "secondary",
    secondaryCtaText: "Visit the studio",
    secondaryCtaUrl: "/studio",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "secondary",
    tapeColorScheme: "neutral",
    polaroids: [
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Detail of a freshly glazed bowl on the studio windowsill",
        caption: "glaze 03",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Studio worktable mid-throw with hands on a wet vessel",
        caption: "in progress",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Row of finished pieces drying under a white shelf",
        caption: "drying rack",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Studio cat watching from a stool by the kiln door",
        caption: "kintaro",
      },
    ],
  },
};
