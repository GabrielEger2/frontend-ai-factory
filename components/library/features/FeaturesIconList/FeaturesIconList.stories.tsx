import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import FeaturesIconList from "./index";

const meta: Meta<typeof FeaturesIconList> = {
  title: "Features/FeaturesIconList",
  component: FeaturesIconList,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof FeaturesIconList>;

export const Default: Story = {
  args: {
    sectionTitle: "Built for Modern Teams",
    sectionSubtitle:
      "Simple, powerful features that help your team stay aligned and move faster every day.",
    features: [
      {
        icon: "https://api.iconify.design/lucide:layers.svg",
        title: "Modular Architecture",
        description:
          "Build with composable modules that adapt to your unique business requirements.",
      },
      {
        icon: "https://api.iconify.design/lucide:refresh-cw.svg",
        title: "Automated Workflows",
        description:
          "Eliminate repetitive tasks with intelligent automation rules and triggers.",
      },
      {
        icon: "https://api.iconify.design/lucide:eye.svg",
        title: "Real-Time Monitoring",
        description:
          "Track performance metrics and system health with live dashboards and alerts.",
      },
      {
        icon: "https://api.iconify.design/lucide:file-text.svg",
        title: "Custom Reports",
        description:
          "Generate detailed reports tailored to your KPIs with one-click export.",
      },
      {
        icon: "https://api.iconify.design/lucide:git-branch.svg",
        title: "Version Control",
        description:
          "Keep full history of changes with built-in version tracking and rollback.",
      },
      {
        icon: "https://api.iconify.design/lucide:cloud.svg",
        title: "Cloud Native",
        description:
          "Deployed on modern cloud infrastructure for reliability and global reach.",
      },
    ],
  },
};

export const DarkTheme: Story = {
  args: {
    sectionTitle: "What Sets Us Apart",
    sectionSubtitle:
      "We focus on the details that matter most to growing businesses.",
    features: [
      {
        icon: "https://api.iconify.design/lucide:sparkles.svg",
        title: "AI-Powered Insights",
        description:
          "Machine learning algorithms surface trends and opportunities you might miss.",
      },
      {
        icon: "https://api.iconify.design/lucide:lock.svg",
        title: "Zero-Trust Security",
        description:
          "Every request is verified and encrypted, from edge to origin.",
      },
      {
        icon: "https://api.iconify.design/lucide:smartphone.svg",
        title: "Mobile First",
        description:
          "Fully responsive interfaces that work beautifully on every device.",
      },
      {
        icon: "https://api.iconify.design/lucide:clock.svg",
        title: "99.99% Uptime",
        description:
          "Enterprise-grade infrastructure with redundancy across multiple regions.",
      },
    ],
  },
  globals: {
    theme: "default-dark",
  },
};
