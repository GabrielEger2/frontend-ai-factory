import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import HeroSplit from "./index";

const meta: Meta<typeof HeroSplit> = {
  title: "Hero/HeroSplit",
  component: HeroSplit,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof HeroSplit>;

export const Default: Story = {
  args: {
    headline: "Accelerate Your Growth with Data-Driven Insights",
    subheadline:
      "Our analytics platform turns raw data into actionable strategies, helping businesses make smarter decisions faster.",
    ctaText: "Start Free Trial",
    ctaUrl: "#trial",
    imageSrc:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    imageAlt: "Dashboard showing business analytics and growth charts",
    badgeText: "New Release",
  },
};

export const DarkTheme: Story = {
  args: {
    headline: "Design Systems That Scale with Your Team",
    subheadline:
      "Build consistent, accessible interfaces across every product with our comprehensive component toolkit.",
    ctaText: "Explore Components",
    ctaUrl: "#components",
    imageSrc:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
    imageAlt: "Team collaborating on design system components",
    badgeText: "Enterprise Ready",
  },
  globals: {
    theme: "default-dark",
  },
};
