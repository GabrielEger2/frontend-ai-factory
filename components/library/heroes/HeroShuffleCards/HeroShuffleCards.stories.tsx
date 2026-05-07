import type { Meta, StoryObj } from "@storybook/react";
import HeroShuffleCards from "./index";

const meta: Meta<typeof HeroShuffleCards> = {
  title: "Hero/HeroShuffleCards",
  component: HeroShuffleCards,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    ctaStyle: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    highlightWord: { control: "text" },
    revealHeadline: { control: "boolean" },
    accentColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof HeroShuffleCards>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Marketing platform — testimonial cards, default CTA */
export const MarketingPlatform: Story = {
  args: {
    headline: "You don't know marketing",
    subheadline:
      "...but we're going to help. We send out weekly breakdowns of exactly what's working and what's not for the largest companies in the world. It's free.",
    ctaText: "Start Learning",
    ctaUrl: "#signup",
    cards: [
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
    ],
  },
};

/** SaaS onboarding — typewriter headline, slide CTA */
export const SaasOnboarding: Story = {
  args: {
    headline: "Build faster with",
    headlineRotatingWords: [
      "real-time collaboration",
      "AI-powered workflows",
      "smart automation",
      "instant deploys",
    ],
    subheadline:
      "The developer platform trusted by 12,000+ teams to ship products 3x faster. No credit card required.",
    ctaText: "Try It Free",
    ctaUrl: "#trial",
    ctaStyle: "slide",
    cards: [
      {
        image: "https://placehold.co/128x128",
        imageAlt: "Portrait of Sara Chen, CTO",
        quote:
          "We cut our deploy time from 45 minutes to under 3. The team hasn't looked back.",
        author: "Sara Chen - CTO @ Lattice",
      },
      {
        image: "https://placehold.co/128x128",
        imageAlt: "Portrait of Marcus Webb, Engineering Lead",
        quote:
          "Finally a tool that doesn't get in the way. It just works, every single time.",
        author: "Marcus Webb - Engineering Lead @ Figma",
      },
      {
        image: "https://placehold.co/128x128",
        imageAlt: "Portrait of Priya Desai, VP Engineering",
        quote:
          "Onboarding new devs used to take a week. Now it's an afternoon.",
        author: "Priya Desai - VP Engineering @ Notion",
      },
    ],
  },
};

/** E-commerce product showcase — product cards, glow CTA */
export const ProductShowcase: Story = {
  args: {
    headline: "Gear that moves with you",
    subheadline:
      "Our top-rated electronics are designed for people who demand performance without compromising on style. Swipe through our bestsellers.",
    ctaText: "Shop All",
    ctaUrl: "#products",
    ctaStyle: "glow",
    cards: [
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
    ],
  },
};

/** Newsletter signup — email capture form */
export const NewsletterSignup: Story = {
  args: {
    headline: "Stay ahead of the curve",
    subheadline:
      "Get curated insights on design, product, and engineering delivered to your inbox every Wednesday. Trusted by 20,000+ builders.",
    ctaText: "Subscribe",
    ctaUrl: "#",
    emailPlaceholder: "Enter your email",
    onEmailSubmit: (email: string) => console.log("Submitted:", email),
    cards: [
      {
        image: "https://placehold.co/128x128",
        imageAlt: "Portrait of Lisa Park, Design Director",
        quote:
          "This newsletter is the only one I actually open. Every issue has at least one insight I can apply immediately.",
        author: "Lisa Park - Design Director @ Airbnb",
      },
      {
        image: "https://placehold.co/128x128",
        imageAlt: "Portrait of Tom Rivera, Senior PM",
        quote:
          "I've shared this with my entire product org. It's become required reading for our team.",
        author: "Tom Rivera - Senior PM @ Stripe",
      },
      {
        image: "https://placehold.co/128x128",
        imageAlt: "Portrait of Aisha Okafor, Freelance Developer",
        quote:
          "As a solo founder, this is like having a mentor who actually knows what's happening in the industry right now.",
        author: "Aisha Okafor - Freelance Developer",
      },
    ],
  },
};

/** Real estate agency — drawOutline CTA */
export const RealEstate: Story = {
  args: {
    headline: "Find your dream property",
    subheadline:
      "Over 500 apartments, houses, and land options in the best neighborhoods. Personalized service from start to finish.",
    ctaText: "View Properties",
    ctaUrl: "#properties",
    ctaStyle: "drawOutline",
    cards: [
      {
        image: "https://placehold.co/128x128",
        imageAlt: "Portrait of Robert Lima, satisfied buyer",
        quote:
          "I bought my first apartment with their help. The entire process was transparent and incredibly fast.",
        author: "Robert Lima - Buyer",
      },
      {
        image: "https://placehold.co/128x128",
        imageAlt: "Portrait of Camila Santos, investor",
        quote:
          "I've made three investments with this agency. The team knows the market like no one else.",
        author: "Camila Santos - Investor",
      },
      {
        image: "https://placehold.co/128x128",
        imageAlt: "Portrait of Fernando Costa, property owner",
        quote:
          "I sold my property in less than a month. The valuation was fair and the support was impeccable.",
        author: "Fernando Costa - Property Owner",
      },
    ],
  },
};
