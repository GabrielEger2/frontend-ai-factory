import type { Meta, StoryObj } from "@storybook/react";
import HeroShuffleCards from "./index";

const meta: Meta<typeof HeroShuffleCards> = {
  title: "Hero/HeroShuffleCards",
  component: HeroShuffleCards,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof HeroShuffleCards>;

/* ------------------------------------------------------------------ */
/*  Shared card data                                                   */
/* ------------------------------------------------------------------ */

const testimonialCards = [
  {
    image: "https://placehold.co/128x128",
    imageAlt: "Portrait of Jenn Ferreira, Marketing Director",
    quote:
      "I feel like I've learned as much from this platform as I did completing my masters. It's the first thing I check every morning.",
    author: "Jenn Ferreira - Marketing Director @ Square",
  },
  {
    image: "https://placehold.co/128x128",
    imageAlt: "Portrait of Adrian Yamamoto, Product Marketing Manager",
    quote:
      "My boss thinks I know what I'm doing. Honestly, I just read their weekly breakdown.",
    author: "Adrian Yamamoto - Product Marketing @ Meta",
  },
  {
    image: "https://placehold.co/128x128",
    imageAlt: "Portrait of Devin Rocha, Growth Marketing Lead",
    quote:
      "If this was $5,000 a month it would be worth every penny. The insights are genuinely unmatched in the industry.",
    author: "Devin Rocha - Growth Marketing Lead @ OpenAI",
  },
];

const productCards = [
  {
    image: "https://placehold.co/128x128",
    imageAlt: "Wireless noise-cancelling headphones in matte black",
    quote:
      "Crystal clear sound with 40-hour battery life. The adaptive noise cancellation adjusts to your environment automatically.",
    author: "SoundPro X1 - $299",
  },
  {
    image: "https://placehold.co/128x128",
    imageAlt: "Minimalist smartwatch with titanium case",
    quote:
      "Track your health metrics, manage notifications, and navigate your day — all from a watch that looks like a classic timepiece.",
    author: "ChronoFit Ultra - $449",
  },
  {
    image: "https://placehold.co/128x128",
    imageAlt: "Portable Bluetooth speaker with fabric exterior",
    quote:
      "360-degree immersive sound in a package that fits in your backpack. Waterproof, dustproof, and built for adventure.",
    author: "BoomCore Mini - $129",
  },
];

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default: testimonial cards with a plain CTA button */
export const Default: Story = {
  args: {
    headline: "You don't know marketing",
    subheadline:
      "...but we're going to help. We send out weekly breakdowns of exactly what's working and what's not for the largest companies in the world. It's free.",
    ctaText: "Start Learning",
    ctaUrl: "#signup",
    cards: testimonialCards,
  },
};

/** Typewriter: the last headline line cycles through rotating words */
export const WithTypewriter: Story = {
  args: {
    headline: "We help you master",
    headlineRotatingWords: [
      "growth marketing",
      "content strategy",
      "brand positioning",
      "paid acquisition",
    ],
    subheadline:
      "Join 45,000+ marketers who get our free weekly breakdown of what's working at the world's top companies.",
    ctaText: "Get Started",
    ctaUrl: "#signup",
    cards: testimonialCards,
  },
};

/** Email capture: shows an email input form instead of a plain CTA link */
export const WithEmailCapture: Story = {
  args: {
    headline: "You don't know marketing",
    subheadline:
      "...but we're going to help. We send out weekly breakdowns of exactly what's working and what's not for the largest companies in the world. It's free.",
    ctaText: "Join Newsletter",
    ctaUrl: "#",
    emailPlaceholder: "Enter your email",
    onEmailSubmit: (email: string) => console.log("Submitted:", email),
    cards: testimonialCards,
  },
};

/** Typewriter + email capture combined */
export const TypewriterWithEmail: Story = {
  args: {
    headline: "We help you master",
    headlineRotatingWords: [
      "growth marketing",
      "content strategy",
      "brand positioning",
    ],
    subheadline:
      "Join 45,000+ marketers who get our free weekly breakdown of what's working at the world's top companies.",
    ctaText: "Subscribe Free",
    ctaUrl: "#",
    emailPlaceholder: "your@email.com",
    onEmailSubmit: (email: string) => console.log("Submitted:", email),
    cards: testimonialCards,
  },
};

/** Product cards: same component used to showcase products instead of testimonials */
export const ProductCards: Story = {
  args: {
    headline: "Gear that moves with you",
    subheadline:
      "Our top-rated electronics are designed for people who demand performance without compromising on style. Swipe through our bestsellers.",
    ctaText: "Shop All",
    ctaUrl: "#products",
    cards: productCards,
  },
};

/** Product cards with typewriter variation */
export const ProductCardsWithTypewriter: Story = {
  args: {
    headline: "Built for",
    headlineRotatingWords: [
      "music lovers",
      "fitness enthusiasts",
      "remote workers",
      "adventurers",
    ],
    subheadline:
      "Our top-rated electronics are designed for people who demand performance without compromising on style.",
    ctaText: "Explore Collection",
    ctaUrl: "#products",
    cards: productCards,
  },
};
