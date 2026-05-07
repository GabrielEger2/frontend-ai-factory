import type { Meta, StoryObj } from "@storybook/react";
import HeroSpotlightCenter from "./index";

const meta: Meta<typeof HeroSpotlightCenter> = {
  title: "Hero/HeroSpotlightCenter",
  component: HeroSpotlightCenter,
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
    showRadialGlow: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof HeroSpotlightCenter>;

/** Founder-led therapy practice — calm, slide CTA, two chips */
export const TherapyPractice: Story = {
  args: {
    eyebrow: "Accepting new clients — May",
    headline:
      "A small private practice for adults navigating loss, change, and the long middle of a life.",
    subheadline:
      "Mariana Cardoso, MA, sees fourteen clients a week from a quiet office in Lapa. Sliding-scale slots are reserved for caregivers, teachers, and public-health workers in the Rio de Janeiro metro region.",
    ctaText: "Schedule a consult",
    ctaUrl: "/consult",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    secondaryCtaText: "How sessions work",
    secondaryCtaUrl: "/sessions",
    secondaryCtaStyle: "drawOutline",
    spotlightImage: "https://placehold.co/600x600",
    spotlightImageAlt: "Soft portrait of the practitioner in natural daylight",
    chips: [
      { label: "Lic. CRP 05/47821", position: "top-left" },
      { label: "Sliding-scale Wed", position: "bottom-right" },
    ],
    showRadialGlow: true,
  },
};

/** Indie SaaS waitlist — minimal, accent CTA, four chips */
export const SaasWaitlist: Story = {
  args: {
    eyebrow: "Private beta — opens 14.06",
    headline:
      "Read every contract you signed last year in one quiet afternoon.",
    subheadline:
      "Inbound is a single-purpose desktop app for consultants who keep losing track of which clause they negotiated where. Two engineers, no investors, a flat one-time license.",
    ctaText: "Request access",
    ctaUrl: "/access",
    ctaStyle: "dotExpand",
    ctaColorScheme: "accent",
    secondaryCtaText: "Read the manifesto",
    secondaryCtaUrl: "/manifesto",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "accent",
    chips: [
      { label: "Mac & Linux", position: "top-left" },
      { label: "$74 once", position: "top-right" },
      { label: "1.4MB binary", position: "bottom-left" },
      { label: "Local-first", position: "bottom-right" },
    ],
    showRadialGlow: true,
  },
};

/** Independent perfumery — luxury restraint, glow CTA, image, two chips */
export const PerfumeryLaunch: Story = {
  args: {
    eyebrow: "Edition 03 — autumn",
    headline:
      "Three new fragrances, blended in lots of two hundred, and never again.",
    subheadline:
      "Composed in a workshop above a printmaker on Rua das Flores. Each bottle ships with the formula card, the story of the materials, and a hand-numbered seal in matte foil.",
    ctaText: "Reserve a bottle",
    ctaUrl: "/reserve",
    ctaStyle: "glow",
    ctaColorScheme: "secondary",
    secondaryCtaText: "Visit the studio",
    secondaryCtaUrl: "/studio",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    spotlightImage: "https://placehold.co/600x600",
    spotlightImageAlt:
      "Amber glass perfume bottle photographed against linen at golden hour",
    chips: [
      { label: "Lot 03 of 200", position: "top-right" },
      { label: "Ships from Porto", position: "bottom-left" },
    ],
    showRadialGlow: true,
  },
};

/** Photography mentorship — friendly, arrow CTA, no glow, three chips with images */
export const PhotographyMentorship: Story = {
  args: {
    eyebrow: "Cohort iv — october through december",
    headline:
      "Twelve weeks of slow photography, one critique a week, no presets.",
    subheadline:
      "A small mentorship for working photographers who want to shoot more film and edit less. Three editors review every submission, and we close every cohort with a short printed zine.",
    ctaText: "Apply for cohort iv",
    ctaUrl: "/apply",
    ctaStyle: "arrow",
    ctaColorScheme: "primary",
    secondaryCtaText: "Read past zines",
    secondaryCtaUrl: "/zines",
    secondaryCtaStyle: "drawOutline",
    chips: [
      {
        label: "Beatriz O.",
        image: "https://placehold.co/64x64",
        imageAlt: "Mentor portrait",
        position: "top-left",
      },
      {
        label: "Rafael T.",
        image: "https://placehold.co/64x64",
        imageAlt: "Mentor portrait",
        position: "top-right",
      },
      {
        label: "12 weeks · 14 spots",
        position: "bottom-right",
      },
    ],
    showRadialGlow: false,
  },
};

/** Members-only club announcement — neutral, default CTA, no chips */
export const MembersClub: Story = {
  args: {
    eyebrow: "Membership renewal — oct 14 to nov 30",
    headline: "A small dining room above a bookshop, open four nights a week.",
    subheadline:
      "Forty-two members. One set menu, two seatings, a long pour at 10:14pm. Renewals open for current members on the fourteenth, and the waitlist clears in early November.",
    ctaText: "Join the waitlist",
    ctaUrl: "/waitlist",
    ctaStyle: "default",
    ctaColorScheme: "neutral",
    showRadialGlow: true,
  },
};
