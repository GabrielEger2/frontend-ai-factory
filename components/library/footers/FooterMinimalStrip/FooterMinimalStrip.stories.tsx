import type { Meta, StoryObj } from "@storybook/react";
import FooterMinimalStrip from "./index";

const meta: Meta<typeof FooterMinimalStrip> = {
  title: "Footer/FooterMinimalStrip",
  component: FooterMinimalStrip,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "subtle"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof FooterMinimalStrip>;

/* ------------------------------------------------------------------ */
/*  Stories — five scenarios, each with unique segment + content       */
/* ------------------------------------------------------------------ */

/** Photographer portfolio — minimal social row, neutral tone */
export const PhotographerPortfolio: Story = {
  args: {
    logoText: "Mariana Cardoso",
    caption: "Portrait & editorial · São Paulo",
    companyName: "Mariana Cardoso Fotografia",
    copyrightSuffix: "Booking is currently open through Q3.",
    legalLinks: [
      { text: "Image rights", href: "/rights" },
      { text: "Contact", href: "/contact" },
    ],
    socialLinks: [
      {
        network: "instagram",
        url: "https://instagram.com/marianacardoso.fotografia",
        label: "Mariana Cardoso on Instagram",
      },
      {
        network: "pinterest",
        url: "https://pinterest.com/marianacardoso",
        label: "Mariana Cardoso on Pinterest",
      },
    ],
    tone: "neutral",
  },
};

/** Design studio — three legal links, subtle tone on light surface */
export const DesignStudioLight: Story = {
  args: {
    logoText: "Estuário Studio",
    caption: "Brand systems · Curitiba & Porto",
    companyName: "Estuário Design Ltda.",
    legalLinks: [
      { text: "Privacy", href: "/privacy" },
      { text: "Terms", href: "/terms" },
      { text: "Imprint", href: "/imprint" },
    ],
    socialLinks: [
      {
        network: "linkedin",
        url: "https://linkedin.com/company/estuario-studio",
        label: "Estuário Studio on LinkedIn",
      },
      {
        network: "instagram",
        url: "https://instagram.com/estuario.studio",
        label: "Estuário Studio on Instagram",
      },
      {
        network: "twitter",
        url: "https://twitter.com/estuariostudio",
        label: "Estuário Studio on X",
      },
    ],
    tone: "subtle",
  },
};

/** Indie SaaS — copyright suffix, lean social row */
export const IndieSaaS: Story = {
  args: {
    logoText: "Northbeam",
    companyName: "Northbeam, Inc.",
    copyrightSuffix: "Built in Floripa, deployed everywhere.",
    legalLinks: [
      { text: "Privacy", href: "/privacy" },
      { text: "Terms", href: "/terms" },
      { text: "Status", href: "https://status.northbeam.example" },
    ],
    socialLinks: [
      {
        network: "twitter",
        url: "https://twitter.com/northbeam",
        label: "Northbeam on X",
      },
      {
        network: "linkedin",
        url: "https://linkedin.com/company/northbeam",
        label: "Northbeam on LinkedIn",
      },
      {
        network: "youtube",
        url: "https://youtube.com/@northbeam",
        label: "Northbeam on YouTube",
      },
    ],
    tone: "neutral",
  },
};

/** Brazilian SMB (pt-BR) — WhatsApp-first social row, subtle tone */
export const BrazilianSMB: Story = {
  args: {
    logoText: "Casa Reyes",
    caption: "Padaria · Café · Encomendas",
    companyName: "Casa Reyes Alimentação Ltda.",
    legalLinks: [
      { text: "Política de privacidade", href: "/privacidade" },
      { text: "Termos", href: "/termos" },
    ],
    socialLinks: [
      {
        network: "whatsapp",
        url: "https://wa.me/5541994128213",
        label: "Casa Reyes no WhatsApp",
      },
      {
        network: "instagram",
        url: "https://instagram.com/casareyes",
        label: "Casa Reyes no Instagram",
      },
      {
        network: "facebook",
        url: "https://facebook.com/casareyes",
        label: "Casa Reyes no Facebook",
      },
    ],
    tone: "subtle",
  },
};

/** Bare minimum — no legal links, no caption, neutral tone */
export const BareMinimum: Story = {
  args: {
    logoText: "Refeira",
    companyName: "Refeira Marketplace",
    socialLinks: [
      {
        network: "instagram",
        url: "https://instagram.com/refeira",
        label: "Refeira on Instagram",
      },
      {
        network: "tiktok",
        url: "https://tiktok.com/@refeira",
        label: "Refeira on TikTok",
      },
    ],
    tone: "neutral",
  },
};
