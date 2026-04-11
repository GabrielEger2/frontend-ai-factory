import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import FeaturesGrid from "./index";

const meta: Meta<typeof FeaturesGrid> = {
  title: "Features/FeaturesGrid",
  component: FeaturesGrid,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof FeaturesGrid>;

export const Default: Story = {
  args: {
    sectionTitle: "Everything You Need to Succeed",
    sectionSubtitle:
      "Our platform provides powerful tools and integrations that help your team work smarter, not harder.",
    features: [
      {
        icon: "https://api.iconify.design/lucide:zap.svg",
        title: "Lightning Fast",
        description:
          "Optimized performance ensures your workflow never slows down, even with large datasets.",
      },
      {
        icon: "https://api.iconify.design/lucide:shield.svg",
        title: "Enterprise Security",
        description:
          "Bank-grade encryption and compliance certifications keep your data safe and secure.",
      },
      {
        icon: "https://api.iconify.design/lucide:bar-chart-3.svg",
        title: "Advanced Analytics",
        description:
          "Real-time dashboards and custom reports give you full visibility into performance.",
      },
      {
        icon: "https://api.iconify.design/lucide:users.svg",
        title: "Team Collaboration",
        description:
          "Built-in tools for sharing, commenting, and collaborating across departments.",
      },
      {
        icon: "https://api.iconify.design/lucide:puzzle.svg",
        title: "Easy Integrations",
        description:
          "Connect with 200+ apps and services to streamline your existing workflows.",
      },
      {
        icon: "https://api.iconify.design/lucide:headphones.svg",
        title: "24/7 Support",
        description:
          "Our dedicated support team is always available to help you resolve issues quickly.",
      },
    ],
  },
};

export const DarkTheme: Story = {
  args: {
    sectionTitle: "Why Companies Trust Our Platform",
    sectionSubtitle:
      "From startups to enterprises, businesses rely on our tools to drive growth and efficiency.",
    features: [
      {
        icon: "https://api.iconify.design/lucide:rocket.svg",
        title: "Quick Setup",
        description:
          "Get started in minutes with our guided onboarding and pre-built templates.",
      },
      {
        icon: "https://api.iconify.design/lucide:globe.svg",
        title: "Global Scale",
        description:
          "Deploy across regions with automatic scaling and edge delivery for low latency.",
      },
      {
        icon: "https://api.iconify.design/lucide:lock.svg",
        title: "Data Privacy",
        description:
          "Full GDPR and LGPD compliance with granular data access controls.",
      },
    ],
  },
  globals: {
    theme: "default-dark",
  },
};
