import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import NavbarSticky from "./index";
import type { NavbarLink } from "./index";

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

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

const ServicesFlyout = () => (
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

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof NavbarSticky> = {
  title: "Navigation/NavbarSticky",
  component: NavbarSticky,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    ctaStyle: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
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

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Agency site — flyout menu, slide CTA */
export const AgencySite: Story = {
  args: {
    logo: <SampleLogo />,
    links: [
      { text: "Services", href: "#services", flyoutContent: ServicesFlyout },
      { text: "About", href: "/about" },
      { text: "Portfolio", href: "#portfolio" },
      { text: "Contact", href: "#contact" },
    ],
    ctaText: "Get Started",
    ctaUrl: "#cta",
    ctaStyle: "slide",
  },
};

/** Minimal landing page — two links, no CTA */
export const MinimalLanding: Story = {
  args: {
    logo: <SampleLogo />,
    links: [
      { text: "Home", href: "/" },
      { text: "Contact", href: "#contact" },
    ],
  },
};

/** SaaS product — many nav items, glow CTA */
export const SaasProduct: Story = {
  args: {
    logo: <SampleLogo />,
    links: [
      { text: "Features", href: "#features" },
      { text: "Pricing", href: "/pricing" },
      { text: "Docs", href: "/docs" },
      { text: "Blog", href: "/blog" },
      { text: "Changelog", href: "/changelog" },
    ],
    ctaText: "Start Free Trial",
    ctaUrl: "#trial",
    ctaStyle: "glow",
  },
};

/** Real estate — property-focused nav, drawOutline CTA */
export const RealEstate: Story = {
  args: {
    logo: <SampleLogo />,
    links: [
      { text: "Properties", href: "#properties" },
      { text: "About", href: "/about" },
      { text: "Contact", href: "#contact" },
    ],
    ctaText: "Schedule Visit",
    ctaUrl: "#schedule",
    ctaStyle: "drawOutline",
  },
};

/** E-commerce — dotExpand CTA, custom scroll threshold */
export const Ecommerce: Story = {
  args: {
    logo: <SampleLogo />,
    links: [
      { text: "Shop", href: "/shop" },
      { text: "New Arrivals", href: "#new" },
      { text: "Sale", href: "#sale" },
      { text: "About", href: "/about" },
    ],
    ctaText: "My Cart",
    ctaUrl: "#cart",
    ctaStyle: "dotExpand",
    scrollThreshold: 150,
  },
};
