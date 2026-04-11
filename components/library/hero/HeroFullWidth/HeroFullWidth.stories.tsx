import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import HeroFullWidth from "./index";

const meta: Meta<typeof HeroFullWidth> = {
  title: "Hero/HeroFullWidth",
  component: HeroFullWidth,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof HeroFullWidth>;

export const Default: Story = {
  args: {
    headline: "Transform Your Business with Smart Solutions",
    subheadline:
      "We help companies streamline operations, reduce costs, and accelerate growth with tailored technology strategies.",
    ctaText: "Get Started",
    ctaUrl: "#contact",
    imageSrc:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop",
    imageAlt: "Modern office space with collaborative workspace",
  },
};

export const DarkTheme: Story = {
  args: {
    headline: "Build the Future of Digital Commerce",
    subheadline:
      "Our platform empowers retailers to create seamless online experiences that convert visitors into loyal customers.",
    ctaText: "See Plans",
    ctaUrl: "#pricing",
    imageSrc:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&h=900&fit=crop",
    imageAlt: "City skyline at night with illuminated buildings",
  },
  globals: {
    theme: "default-dark",
  },
};
