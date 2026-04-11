import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import FooterReveal from "./index";
import type { FooterNavColumn, FooterSocialLink } from "./index";

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

const defaultNavColumns: FooterNavColumn[] = [
  {
    title: "Website",
    links: [
      { text: "Quem Somos", href: "/quem-somos" },
      { text: "Diferenciais", href: "#diferenciais" },
      { text: "Empreendimentos", href: "/empreendimentos" },
      { text: "Fale Conosco", href: "#fale-conosco" },
    ],
  },
  {
    title: "Redes",
    links: [
      { text: "Facebook", href: "https://facebook.com" },
      { text: "Instagram", href: "https://instagram.com" },
      { text: "LinkedIn", href: "https://linkedin.com" },
    ],
  },
];

const defaultSocialLinks: FooterSocialLink[] = [
  { network: "instagram", url: "https://instagram.com", label: "Instagram" },
  { network: "linkedin", url: "https://linkedin.com", label: "LinkedIn" },
  { network: "facebook", url: "https://facebook.com", label: "Facebook" },
];

const meta: Meta<typeof FooterReveal> = {
  title: "Footers/FooterReveal",
  component: FooterReveal,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div>
        {/* Spacer so the clip-path reveal effect is visible when scrolling */}
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

export const Default: Story = {
  args: {
    logo: <SampleLogo />,
    whatsappUrl:
      "https://wa.me/5511999999999?text=Ol%C3%A1%2C%20tenho%20interesse.",
    whatsappText: "+55 11 99999-9999",
    phoneUrl: "tel:+5511999999999",
    phoneText: "+55 11 99999-9999",
    emailUrl:
      "mailto:contato@acme.com.br?subject=Contato%20via%20site&body=Ol%C3%A1%2C%20tenho%20interesse.",
    emailText: "contato@acme.com.br",
    addressText: "Rua Example, 123\nSao Paulo - SP, 01000-000",
    addressMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Rua+Example+123+Sao+Paulo",
    navColumns: defaultNavColumns,
    socialLinks: defaultSocialLinks,
    companyName: "Acme Empreendimentos",
  },
};

export const MinimalContact: Story = {
  args: {
    logo: <SampleLogo />,
    whatsappUrl:
      "https://wa.me/5511999999999?text=Ol%C3%A1%2C%20tenho%20interesse.",
    whatsappText: "+55 11 99999-9999",
    emailUrl: "mailto:contato@acme.com.br",
    emailText: "contato@acme.com.br",
    navColumns: [
      {
        title: "Links",
        links: [
          { text: "Inicio", href: "/" },
          { text: "Contato", href: "#contato" },
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
    companyName: "Acme",
  },
};

export const FourColumns: Story = {
  args: {
    logo: <SampleLogo />,
    whatsappUrl:
      "https://wa.me/5511999999999?text=Ol%C3%A1%2C%20tenho%20interesse.",
    whatsappText: "+55 11 99999-9999",
    phoneUrl: "tel:+5511999999999",
    phoneText: "+55 11 99999-9999",
    emailUrl: "mailto:contato@acme.com.br",
    emailText: "contato@acme.com.br",
    addressText: "Av. Paulista, 1000\nSao Paulo - SP, 01310-100",
    addressMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Av+Paulista+1000",
    navColumns: [
      {
        title: "Empresa",
        links: [
          { text: "Quem Somos", href: "/quem-somos" },
          { text: "Equipe", href: "/equipe" },
          { text: "Carreiras", href: "/carreiras" },
        ],
      },
      {
        title: "Servicos",
        links: [
          { text: "Consultoria", href: "/consultoria" },
          { text: "Projetos", href: "/projetos" },
          { text: "Suporte", href: "/suporte" },
        ],
      },
      {
        title: "Recursos",
        links: [
          { text: "Blog", href: "/blog" },
          { text: "FAQ", href: "/faq" },
          { text: "Downloads", href: "/downloads" },
        ],
      },
      {
        title: "Legal",
        links: [
          { text: "Privacidade", href: "/privacidade" },
          { text: "Termos", href: "/termos" },
        ],
      },
    ],
    socialLinks: defaultSocialLinks,
    companyName: "Acme Consultoria",
  },
};
