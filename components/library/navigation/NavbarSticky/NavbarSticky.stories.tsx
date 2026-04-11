import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import NavbarSticky from "./index";
import type { NavbarLink } from "./index";

const SampleLogo = () => (
  <svg
    width="120"
    height="32"
    viewBox="0 0 120 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Company logo"
  >
    <rect width="32" height="32" rx="6" fill="currentColor" opacity="0.9" />
    <text
      x="40"
      y="22"
      fill="currentColor"
      fontFamily="sans-serif"
      fontSize="18"
      fontWeight="bold"
    >
      Acme
    </text>
  </svg>
);

const SampleFlyout = () => (
  <div className="w-64 p-4">
    <p className="mb-2 text-sm font-semibold text-base-content">Our Services</p>
    <ul className="space-y-2 text-sm text-base-content/70">
      <li>
        <a href="#" className="hover:text-primary">
          Web Development
        </a>
      </li>
      <li>
        <a href="#" className="hover:text-primary">
          Mobile Apps
        </a>
      </li>
      <li>
        <a href="#" className="hover:text-primary">
          Cloud Solutions
        </a>
      </li>
    </ul>
  </div>
);

const defaultLinks: NavbarLink[] = [
  { text: "Services", href: "#services", flyoutContent: SampleFlyout },
  { text: "About", href: "/about" },
  { text: "Portfolio", href: "#portfolio" },
  { text: "Contact", href: "#contact" },
];

const meta: Meta<typeof NavbarSticky> = {
  title: "Navigation/NavbarSticky",
  component: NavbarSticky,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        {/* Spacer so the scroll behavior is testable */}
        <div className="flex min-h-[200vh] items-center justify-center bg-base-200 pt-24">
          <p className="text-base-content/40">
            Scroll down to see the navbar transition
          </p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavbarSticky>;

export const Default: Story = {
  args: {
    logo: <SampleLogo />,
    links: defaultLinks,
    ctaText: "Get Started",
    ctaUrl: "#cta",
  },
};

export const WithoutCta: Story = {
  args: {
    logo: <SampleLogo />,
    links: defaultLinks,
  },
};

export const MinimalLinks: Story = {
  args: {
    logo: <SampleLogo />,
    links: [
      { text: "Home", href: "/" },
      { text: "Contact", href: "#contact" },
    ],
    ctaText: "Call Now",
    ctaUrl: "tel:+1234567890",
  },
};

export const ManyLinks: Story = {
  args: {
    logo: <SampleLogo />,
    links: [
      { text: "Services", href: "#services", flyoutContent: SampleFlyout },
      { text: "About", href: "/about" },
      { text: "Portfolio", href: "#portfolio" },
      { text: "Blog", href: "/blog" },
      { text: "Careers", href: "/careers" },
      { text: "Contact", href: "#contact" },
    ],
    ctaText: "Free Quote",
    ctaUrl: "#quote",
  },
};
