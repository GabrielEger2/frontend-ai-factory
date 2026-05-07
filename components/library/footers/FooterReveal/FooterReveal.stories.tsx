import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import FooterReveal from "./index";

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
      Holloway & Co
    </text>
  </svg>
);

const meta: Meta<typeof FooterReveal> = {
  title: "Footer/FooterReveal",
  component: FooterReveal,
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
        <div className="flex min-h-[150vh] items-center justify-center bg-base-200">
          <p className="text-base-content/40">
            Scroll down to see the footer reveal
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FooterReveal>;

/** Real estate company — full contact info, slide CTA */
export const RealEstate: Story = {
  args: {
    logo: <SampleLogo />,
    whatsappUrl: "https://wa.me/15551234567?text=Hello%2C%20I'm%20interested.",
    whatsappText: "+1 (555) 123-4567",
    phoneUrl: "tel:+15551234567",
    phoneText: "+1 (555) 123-4567",
    emailUrl:
      "mailto:contact@driftwoodrealty.com?subject=Website%20inquiry&body=Hello%2C%20I'm%20interested.",
    emailText: "contact@driftwoodrealty.com",
    addressText: "123 Main Street\nNew York, NY 10001",
    addressMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=123+Main+Street+New+York",
    navColumns: [
      {
        title: "Website",
        links: [
          { text: "About Us", href: "/about" },
          { text: "Why Choose Us", href: "#why-us" },
          { text: "Properties", href: "/properties" },
          { text: "Contact Us", href: "#contact" },
        ],
      },
      {
        title: "Social",
        links: [
          { text: "Facebook", href: "https://facebook.com" },
          { text: "Instagram", href: "https://instagram.com" },
          { text: "LinkedIn", href: "https://linkedin.com" },
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
      { network: "facebook", url: "https://facebook.com", label: "Facebook" },
    ],
    companyName: "Driftwood Realty",
    ctaText: "Schedule a Visit",
    ctaUrl: "#schedule",
    ctaStyle: "slide",
  },
};

/** Freelancer portfolio — minimal contact, no CTA */
export const FreelancerPortfolio: Story = {
  args: {
    logo: <SampleLogo />,
    whatsappUrl:
      "https://wa.me/15559876543?text=Hi%2C%20I%20saw%20your%20portfolio.",
    whatsappText: "+1 (555) 987-6543",
    emailUrl: "mailto:hello@nadiahaddad.dev",
    emailText: "hello@nadiahaddad.dev",
    navColumns: [
      {
        title: "Links",
        links: [
          { text: "Home", href: "/" },
          { text: "Projects", href: "#projects" },
          { text: "Contact", href: "#contact" },
        ],
      },
    ],
    socialLinks: [
      {
        network: "instagram",
        url: "https://instagram.com",
        label: "Instagram",
      },
    ],
    companyName: "Nadia Haddad",
  },
};

/** Consulting firm — 4-column nav, glow CTA */
export const ConsultingFirm: Story = {
  args: {
    logo: <SampleLogo />,
    phoneUrl: "tel:+15557776666",
    phoneText: "+1 (555) 777-6666",
    emailUrl: "mailto:contact@nexusconsulting.com",
    emailText: "contact@nexusconsulting.com",
    addressText: "1000 Park Avenue\nNew York, NY 10028",
    addressMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=1000+Park+Avenue+New+York",
    navColumns: [
      {
        title: "Company",
        links: [
          { text: "About Us", href: "/about" },
          { text: "Team", href: "/team" },
          { text: "Careers", href: "/careers" },
        ],
      },
      {
        title: "Services",
        links: [
          { text: "Consulting", href: "/consulting" },
          { text: "Projects", href: "/projects" },
          { text: "Support", href: "/support" },
        ],
      },
      {
        title: "Resources",
        links: [
          { text: "Blog", href: "/blog" },
          { text: "FAQ", href: "/faq" },
          { text: "Downloads", href: "/downloads" },
        ],
      },
      {
        title: "Legal",
        links: [
          { text: "Privacy", href: "/privacy" },
          { text: "Terms", href: "/terms" },
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
      { network: "facebook", url: "https://facebook.com", label: "Facebook" },
      {
        network: "whatsapp",
        url: "https://wa.me/15557776666",
        label: "WhatsApp",
      },
    ],
    companyName: "Nexus Consulting",
    ctaText: "Request a Quote",
    ctaUrl: "#quote",
    ctaStyle: "glow",
  },
};
