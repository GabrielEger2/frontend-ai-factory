import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import HeroGradient from "./index";

const meta: Meta<typeof HeroGradient> = {
  title: "Hero/HeroGradient",
  component: HeroGradient,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof HeroGradient>;

export const Default: Story = {
  args: {
    headline: "Bring Your Ideas to Life with Creative Tools",
    subheadline:
      "A playful yet powerful platform that helps creators, makers, and dreamers build something extraordinary every day.",
    ctaText: "Start Creating",
    ctaUrl: "#signup",
    tagline: "Made for Creators",
  },
};

export const DarkTheme: Story = {
  args: {
    headline: "Where Energy Meets Innovation",
    subheadline:
      "Join thousands of teams who use our platform to turn ambitious ideas into shipped products at record speed.",
    ctaText: "Join the Movement",
    ctaUrl: "#join",
    tagline: "Launch Faster",
  },
  globals: {
    theme: "default-dark",
  },
};
