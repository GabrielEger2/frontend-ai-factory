import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import NavbarPill from "./index";
import { GlowOrbs } from "../../../ui/backgrounds/GlowOrbs";

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

const HaloLogo = () => (
  <span className="inline-flex items-center gap-2.5 text-base font-bold tracking-tight text-base-content">
    <span
      aria-hidden="true"
      className="block h-[22px] w-[22px] rounded-full shadow-[0_0_18px_rgba(124,58,237,0.6)]"
      style={{
        background:
          "conic-gradient(from 0deg, oklch(var(--color-primary)), oklch(var(--color-secondary)), oklch(var(--color-accent)), oklch(var(--color-primary)))",
      }}
    />
    Halo
    <span className="text-accent">.</span>
  </span>
);

const ServicesFlyout = () => (
  <div className="w-64 p-4">
    <p className="mb-2 text-sm font-semibold text-base-content">Capabilities</p>
    <ul className="space-y-2 text-sm text-base-content/70">
      <li>
        <a href="#" className="hover:text-primary">
          Brand identity
        </a>
      </li>
      <li>
        <a href="#" className="hover:text-primary">
          Interface design
        </a>
      </li>
      <li>
        <a href="#" className="hover:text-primary">
          Motion direction
        </a>
      </li>
    </ul>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof NavbarPill> = {
  title: "Navigation/NavbarPill",
  component: NavbarPill,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaStyle: {
      control: "select",
      options: [
        "arrow",
        "default",
        "slide",
        "dotExpand",
        "drawOutline",
        "glow",
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="relative isolate min-h-[200vh] overflow-hidden bg-base-300">
        <GlowOrbs palette="aurora" />
        <Story />
        <div className="relative z-10 flex min-h-[200vh] items-center justify-center pt-32 text-base-content/50">
          <p>Scroll down to see the pill tighten and gain glass blur</p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavbarPill>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Independent design studio — flyout, arrow CTA over an aurora background */
export const StudioSite: Story = {
  args: {
    logo: <HaloLogo />,
    links: [
      { text: "Studio", href: "#studio" },
      { text: "Work", href: "#work", flyoutContent: ServicesFlyout },
      { text: "Journal", href: "/journal" },
      { text: "Contact", href: "#contact" },
    ],
    ctaText: "Start a project",
    ctaUrl: "#cta",
    ctaStyle: "arrow",
  },
};

/** Minimal personal site — two links, no CTA */
export const PersonalMinimal: Story = {
  args: {
    logo: <HaloLogo />,
    links: [
      { text: "Home", href: "/" },
      { text: "Contact", href: "#contact" },
    ],
  },
};

/** SaaS launch — five links, glow CTA */
export const SaasLaunch: Story = {
  args: {
    logo: <HaloLogo />,
    links: [
      { text: "Product", href: "#product" },
      { text: "Pricing", href: "/pricing" },
      { text: "Docs", href: "/docs" },
      { text: "Changelog", href: "/changelog" },
      { text: "Blog", href: "/blog" },
    ],
    ctaText: "Get early access",
    ctaUrl: "#trial",
    ctaStyle: "glow",
  },
};

/** Editorial publication — drawOutline CTA, lower scroll threshold */
export const EditorialMagazine: Story = {
  args: {
    logo: <HaloLogo />,
    links: [
      { text: "Issues", href: "/issues" },
      { text: "Authors", href: "/authors" },
      { text: "Subscribe", href: "#subscribe" },
    ],
    ctaText: "Subscribe",
    ctaUrl: "#subscribe",
    ctaStyle: "drawOutline",
    scrollThreshold: 30,
  },
};

/** Agency portfolio — slide CTA with custom logo text */
export const AgencyPortfolio: Story = {
  args: {
    logo: <HaloLogo />,
    links: [
      { text: "About", href: "/about" },
      { text: "Services", href: "#services", flyoutContent: ServicesFlyout },
      { text: "Cases", href: "/cases" },
      { text: "Contact", href: "#contact" },
    ],
    ctaText: "Brief us",
    ctaUrl: "#brief",
    ctaStyle: "slide",
  },
};
