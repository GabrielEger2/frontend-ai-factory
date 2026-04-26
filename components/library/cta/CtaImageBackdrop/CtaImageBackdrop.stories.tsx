import type { Meta, StoryObj } from "@storybook/react";
import CtaImageBackdrop from "./index";

const meta: Meta<typeof CtaImageBackdrop> = {
  title: "CTA/CtaImageBackdrop",
  component: CtaImageBackdrop,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaStyle: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    align: {
      control: "select",
      options: ["left", "center"],
    },
    overlayOpacity: {
      control: { type: "range", min: 0, max: 100, step: 5 },
    },
    parallax: { control: "boolean" },
    revealDisplayWord: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div>
        <div className="flex h-32 items-center justify-center bg-base-200 text-sm text-base-content/60">
          Scroll down to see the section
        </div>
        <Story />
        <div className="min-h-[60vh] bg-base-100" />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof CtaImageBackdrop>;

export const ResidentialDeveloper: Story = {
  args: {
    eyebrow: "Our purpose is to\ntransform the way you",
    displayWord: "live well.",
    body: "We craft homes where every detail changes everything and routines become unforgettable memories. A place where happiness is the rule, not the exception.",
    backgroundImage:
      "https://placehold.co/1920x1080/2a2418/efe6d4?text=Family+Living+Room",
    backgroundImageAlt:
      "A family laughing together in a sunlit living room with floor-to-ceiling windows",
    overlayOpacity: 35,
    parallax: true,
    align: "left",
    revealDisplayWord: true,
  },
};

export const BoutiqueHotel: Story = {
  args: {
    eyebrow: "A weekend should\nfeel like",
    displayWord: "a year off.",
    body: "Twelve rooms above a quiet courtyard in the old quarter of Lisbon. No keycards, no concierge, no playlist piped through the lobby — just slow mornings and the sound of the river.",
    backgroundImage:
      "https://placehold.co/1920x1080/1c2024/d4dae0?text=Hotel+Courtyard",
    backgroundImageAlt:
      "Stone courtyard of a small Lisbon hotel at dusk with warm lamplight in the windows",
    ctaText: "Reserve a room",
    ctaUrl: "#book",
    ctaStyle: "drawOutline",
    ctaColorScheme: "neutral",
    overlayOpacity: 45,
    parallax: true,
    highlightWord: "year off",
  },
};

export const SustainableFashion: Story = {
  args: {
    eyebrow: "Made by people you can name,\nin numbers you can count.",
    displayWord: "Built to last.",
    body: "Twenty-four pieces a year, cut from deadstock wool and organic linen, sewn in a single workshop in Porto. When you buy one, we tell you who made it.",
    backgroundImage:
      "https://placehold.co/1920x1080/2c1f1a/e8d6c4?text=Atelier+Workshop",
    backgroundImageAlt:
      "Two seamstresses working at industrial machines in a sunlit Porto atelier",
    ctaText: "See the spring drop",
    ctaUrl: "#shop",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    overlayOpacity: 30,
    parallax: false,
    align: "left",
  },
};

export const WellnessRetreat: Story = {
  args: {
    eyebrow: "Three days without\nsignal, screens, or",
    displayWord: "small talk.",
    body: "A guided silence retreat in the Sintra hills — eight people, one cook, no phones. We unplug the WiFi the moment you arrive and reconnect it the moment you leave.",
    backgroundImage:
      "https://placehold.co/1920x1080/1a2418/d6e8d4?text=Misty+Forest",
    backgroundImageAlt:
      "Misty pine forest path with dappled morning light filtering through tall trees",
    ctaText: "Book the next retreat",
    ctaUrl: "#retreat",
    ctaStyle: "glow",
    ctaColorScheme: "accent",
    overlayOpacity: 50,
    parallax: true,
    align: "center",
    revealDisplayWord: true,
  },
};

export const HighContrastFallback: Story = {
  name: "Busy image (high contrast)",
  args: {
    eyebrow: "On the brightest streets,\nyour message still has to",
    displayWord: "land cleanly.",
    body: "This story shows the overlay cranked up so the typography stays legible even when the background photograph has its own bright highlights and busy detail.",
    backgroundImage:
      "https://placehold.co/1920x1080/eaeaea/333333?text=Busy+City+Street",
    backgroundImageAlt:
      "Crowded high-contrast street scene with neon signage and bright midday sun",
    ctaText: "See the case study",
    ctaUrl: "#case",
    ctaStyle: "default",
    ctaColorScheme: "primary",
    overlayOpacity: 60,
    parallax: false,
    align: "left",
  },
};
