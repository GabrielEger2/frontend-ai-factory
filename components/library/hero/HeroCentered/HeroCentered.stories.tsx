import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import HeroCentered from "./index";

const meta: Meta<typeof HeroCentered> = {
  title: "Hero/HeroCentered",
  component: HeroCentered,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof HeroCentered>;

export const Default: Story = {
  args: {
    headline: "Simplify Your Workflow, Amplify Your Results",
    subheadline:
      "A streamlined platform that removes complexity so your team can focus on what matters most — delivering value to your customers.",
    ctaText: "Get Started",
    ctaUrl: "#signup",
    ctaSecondaryText: "Learn More",
    ctaSecondaryUrl: "#features",
  },
};

export const DarkTheme: Story = {
  args: {
    headline: "The Calm Approach to Modern Business",
    subheadline:
      "Less noise, more signal. Our platform distills complex operations into clear, actionable insights for growing teams.",
    ctaText: "Try It Free",
    ctaUrl: "#trial",
    ctaSecondaryText: "See Pricing",
    ctaSecondaryUrl: "#pricing",
  },
  globals: {
    theme: "default-dark",
  },
};
