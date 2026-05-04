import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import FooterPulse from "./index";

const HaloLogo = () => (
  <span className="inline-flex items-center gap-2.5 text-base font-bold tracking-tight text-neutral-content">
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

const meta: Meta<typeof FooterPulse> = {
  title: "Footers/FooterPulse",
  component: FooterPulse,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaStyle: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof FooterPulse>;

/** Independent design studio — Lisbon clock, gradient email, full nav */
export const StudioLisbon: Story = {
  args: {
    logo: <HaloLogo />,
    tagline: "studio · journal · interface · futures",
    emailUrl: "mailto:hello@halo.studio",
    emailText: "hello@halo.studio",
    phoneUrl: "tel:+351912345678",
    phoneText: "+351 912 345 678",
    addressText: "Rua das Flores 27\nLisbon, 1200-194",
    addressMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Rua+das+Flores+Lisbon",
    locationLabel: "lisbon",
    timezone: "Europe/Lisbon",
    navColumns: [
      {
        title: "Studio",
        links: [
          { text: "About", href: "/about" },
          { text: "Approach", href: "/approach" },
          { text: "Careers", href: "/careers" },
        ],
      },
      {
        title: "Work",
        links: [
          { text: "Selected", href: "/work" },
          { text: "Case studies", href: "/cases" },
          { text: "Awards", href: "/awards" },
        ],
      },
      {
        title: "Connect",
        links: [
          { text: "Journal", href: "/journal" },
          { text: "Newsletter", href: "/newsletter" },
          { text: "Contact", href: "/contact" },
        ],
      },
    ],
    socialLinks: [
      {
        network: "instagram",
        url: "https://instagram.com",
        label: "Instagram",
      },
      { network: "linkedin", url: "https://linkedin.com", label: "LinkedIn" },
      { network: "twitter", url: "https://twitter.com", label: "Twitter" },
    ],
    companyName: "Halo Studio",
    ctaText: "Start a project",
    ctaUrl: "#brief",
    ctaStyle: "drawOutline",
  },
};

/** SaaS launch — minimal contact, glow CTA, São Paulo clock */
export const SaasLaunch: Story = {
  args: {
    logo: <HaloLogo />,
    tagline: "AI websites generated, optimized, deployed in minutes.",
    emailUrl: "mailto:contact@nimbus.ai",
    emailText: "contact@nimbus.ai",
    locationLabel: "são paulo",
    timezone: "America/Sao_Paulo",
    navColumns: [
      {
        title: "Product",
        links: [
          { text: "Features", href: "/features" },
          { text: "Pricing", href: "/pricing" },
          { text: "Changelog", href: "/changelog" },
        ],
      },
      {
        title: "Company",
        links: [
          { text: "About", href: "/about" },
          { text: "Blog", href: "/blog" },
          { text: "Contact", href: "/contact" },
        ],
      },
    ],
    socialLinks: [
      { network: "linkedin", url: "https://linkedin.com", label: "LinkedIn" },
      { network: "twitter", url: "https://twitter.com", label: "Twitter" },
      { network: "youtube", url: "https://youtube.com", label: "YouTube" },
    ],
    companyName: "Nimbus AI",
    ctaText: "Request access",
    ctaUrl: "#access",
    ctaStyle: "glow",
  },
};

/** Real estate — full contact stack, Tokyo clock, slide CTA */
export const RealEstateTokyo: Story = {
  args: {
    logo: <HaloLogo />,
    whatsappUrl: "https://wa.me/81312345678",
    whatsappText: "+81 3-1234-5678",
    phoneUrl: "tel:+81312345678",
    phoneText: "+81 3-1234-5678",
    emailUrl: "mailto:contact@kogei-estate.jp",
    emailText: "contact@kogei-estate.jp",
    addressText: "Roppongi 6-10-1\nMinato-ku, Tokyo 106-6108",
    addressMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Roppongi+Tokyo",
    hoursText: "Mon–Sat 10:00 – 19:00",
    locationLabel: "tokyo",
    timezone: "Asia/Tokyo",
    navColumns: [
      {
        title: "Properties",
        links: [
          { text: "Penthouses", href: "/penthouses" },
          { text: "Townhouses", href: "/townhouses" },
          { text: "Estates", href: "/estates" },
          { text: "Rentals", href: "/rentals" },
        ],
      },
      {
        title: "Services",
        links: [
          { text: "Buying", href: "/buying" },
          { text: "Selling", href: "/selling" },
          { text: "Concierge", href: "/concierge" },
        ],
      },
    ],
    socialLinks: [
      {
        network: "instagram",
        url: "https://instagram.com",
        label: "Instagram",
      },
      { network: "facebook", url: "https://facebook.com", label: "Facebook" },
      {
        network: "whatsapp",
        url: "https://wa.me/81312345678",
        label: "WhatsApp",
      },
    ],
    companyName: "Kogei Estate",
    ctaText: "Schedule a viewing",
    ctaUrl: "#viewing",
    ctaStyle: "slide",
  },
};

/** Freelancer portfolio — stripped down, no nav columns, no CTA */
export const FreelancerPortfolio: Story = {
  args: {
    logo: <HaloLogo />,
    tagline: "interface · motion · brand systems",
    emailUrl: "mailto:hello@janedoe.dev",
    emailText: "hello@janedoe.dev",
    locationLabel: "berlin",
    timezone: "Europe/Berlin",
    navColumns: [
      {
        title: "Links",
        links: [
          { text: "Home", href: "/" },
          { text: "Projects", href: "#projects" },
          { text: "Reading list", href: "/reading" },
        ],
      },
    ],
    socialLinks: [
      {
        network: "instagram",
        url: "https://instagram.com",
        label: "Instagram",
      },
      { network: "linkedin", url: "https://linkedin.com", label: "LinkedIn" },
    ],
    companyName: "Jane Doe",
  },
};
