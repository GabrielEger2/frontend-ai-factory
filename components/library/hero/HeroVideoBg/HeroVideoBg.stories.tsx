import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import HeroVideoBg from "./index";

const meta: Meta<typeof HeroVideoBg> = {
  title: "Hero/HeroVideoBg",
  component: HeroVideoBg,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof HeroVideoBg>;

export const Default: Story = {
  args: {
    headline: "Experience Innovation in Motion",
    subheadline:
      "We craft immersive digital experiences that captivate audiences and drive measurable results for ambitious brands.",
    ctaText: "Watch Our Reel",
    ctaUrl: "#portfolio",
    posterImage:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1600&h=900&fit=crop",
  },
};

export const DarkTheme: Story = {
  args: {
    headline: "Luxury Redefined for the Modern Era",
    subheadline:
      "Discover a new standard of elegance where timeless craftsmanship meets cutting-edge design technology.",
    ctaText: "Explore Collection",
    ctaUrl: "#collection",
    posterImage:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&h=900&fit=crop",
  },
  globals: {
    theme: "default-dark",
  },
};
