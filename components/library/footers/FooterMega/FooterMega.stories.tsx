import type { Meta, StoryObj } from "@storybook/react";
import FooterMega from "./index";

const meta: Meta<typeof FooterMega> = {
  title: "Footer/FooterMega",
  component: FooterMega,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof FooterMega>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** B2B SaaS — full configuration */
export const SaasFullConfig: Story = {
  args: {
    logoText: "Northbeam",
    tagline:
      "Production observability for teams that ship every day. Built in São Paulo and Stockholm; runs on AWS Frankfurt by default.",
    newsletterEyebrow: "Stay close",
    newsletterHeadline: "Four emails a year, never one more",
    newsletterDescription:
      "Quarterly release notes, the postmortems we publish, and the conferences we sponsor — that's the full list. No growth-hack sequences.",
    newsletterPlaceholder: "you@yourcompany.example",
    newsletterCtaText: "Subscribe",
    newsletterCtaStyle: "default",
    newsletterCtaColorScheme: "primary",
    newsletterPrivacyText:
      "We treat your email like a phone number. Never sold, never shared.",
    navColumns: [
      {
        title: "Product",
        links: [
          { text: "Overview", href: "/product" },
          { text: "Pricing", href: "/pricing" },
          { text: "Integrations", href: "/integrations" },
          { text: "Changelog", href: "/changelog", badge: "New" },
          { text: "Roadmap", href: "/roadmap" },
        ],
      },
      {
        title: "Resources",
        links: [
          { text: "Documentation", href: "/docs" },
          { text: "API reference", href: "/docs/api" },
          { text: "Customer stories", href: "/customers" },
          { text: "Engineering blog", href: "/blog" },
          { text: "Brand assets", href: "/brand" },
        ],
      },
      {
        title: "Company",
        links: [
          { text: "About", href: "/about" },
          { text: "Careers", href: "/careers", badge: "12 open" },
          { text: "Press", href: "/press" },
          { text: "Partners", href: "/partners" },
          { text: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Trust & policies",
        links: [
          { text: "Security & SOC 2", href: "/security" },
          { text: "Privacy policy", href: "/privacy" },
          { text: "Terms of service", href: "/terms" },
          { text: "Subprocessors", href: "/subprocessors" },
          { text: "DPA & MSA", href: "/legal/dpa" },
        ],
      },
    ],
    companyName: "Northbeam, Inc.",
    legalLinks: [
      { text: "Privacy", href: "/privacy" },
      { text: "Terms", href: "/terms" },
      { text: "Cookies", href: "/cookies" },
      { text: "Status", href: "https://status.northbeam.example" },
    ],
    socialLinks: [
      {
        network: "linkedin",
        url: "https://linkedin.com/company/northbeam",
        label: "Northbeam on LinkedIn",
      },
      {
        network: "twitter",
        url: "https://twitter.com/northbeam",
        label: "Northbeam on X",
      },
      {
        network: "youtube",
        url: "https://youtube.com/@northbeam",
        label: "Northbeam on YouTube",
      },
      {
        network: "instagram",
        url: "https://instagram.com/northbeam",
        label: "Northbeam on Instagram",
      },
    ],
  },
};

/** Editorial publication — five sitemap columns, no badges */
export const EditorialPublication: Story = {
  args: {
    logoText: "Estuário Daily",
    tagline:
      "An independent daily on infrastructure, climate, and the political economy of platforms. Reading takes seven minutes.",
    newsletterEyebrow: "Daily brief",
    newsletterHeadline: "The morning briefing, delivered at 06:30 GMT-3",
    newsletterDescription:
      "Open-rate is what we live or die by. We don't pad the brief; if there's nothing worth your seven minutes, we send a one-line note.",
    newsletterPlaceholder: "Your email",
    newsletterCtaText: "Get the brief",
    newsletterCtaStyle: "slide",
    newsletterCtaColorScheme: "primary",
    newsletterPrivacyText:
      "Read by 47,318 people across 92 countries. Unsubscribe in one click.",
    navColumns: [
      {
        title: "Sections",
        links: [
          { text: "Infrastructure", href: "/infrastructure" },
          { text: "Climate", href: "/climate" },
          { text: "Platforms", href: "/platforms" },
          { text: "Foreign policy", href: "/foreign-policy" },
          { text: "Long-form", href: "/longreads" },
        ],
      },
      {
        title: "Daily",
        links: [
          { text: "Morning brief", href: "/brief" },
          { text: "Long-read of the week", href: "/longread" },
          { text: "Q&A series", href: "/qa" },
          { text: "Numbers", href: "/numbers" },
        ],
      },
      {
        title: "About",
        links: [
          { text: "The team", href: "/team" },
          { text: "Editorial standards", href: "/standards" },
          { text: "Corrections policy", href: "/corrections" },
          { text: "Tip line", href: "/tip" },
        ],
      },
      {
        title: "Subscribe",
        links: [
          { text: "Pricing", href: "/subscribe" },
          { text: "Group rates", href: "/group" },
          { text: "Educator rate", href: "/edu" },
          { text: "Gift", href: "/gift" },
        ],
      },
    ],
    companyName: "Estuário Mídia Ltda.",
    legalLinks: [
      { text: "Política de privacidade", href: "/privacy" },
      { text: "Termos de uso", href: "/terms" },
    ],
    socialLinks: [
      {
        network: "twitter",
        url: "https://twitter.com/estuariodaily",
        label: "Estuário on X",
      },
      {
        network: "instagram",
        url: "https://instagram.com/estuariodaily",
        label: "Estuário on Instagram",
      },
      {
        network: "linkedin",
        url: "https://linkedin.com/company/estuariodaily",
        label: "Estuário on LinkedIn",
      },
      {
        network: "telegram",
        url: "https://t.me/estuariodaily",
        label: "Estuário on Telegram",
      },
    ],
  },
};

/** Marketplace — three columns, drawOutline CTA */
export const MarketplaceFooter: Story = {
  args: {
    logoText: "Refeira",
    tagline:
      "A curated marketplace for handmade goods. Buyers and makers in 47 countries.",
    newsletterEyebrow: "First dibs",
    newsletterHeadline: "New makers, drops, and restocks — every Sunday",
    newsletterDescription:
      "Sundays-only weekly digest. Exclusive maker spotlights and 24-hour early access on five drops a year.",
    newsletterCtaText: "Subscribe Sunday",
    newsletterCtaStyle: "drawOutline",
    newsletterCtaColorScheme: "primary",
    navColumns: [
      {
        title: "Shop",
        links: [
          { text: "All collections", href: "/shop" },
          { text: "New arrivals", href: "/new" },
          { text: "Maker spotlight", href: "/makers" },
          { text: "Sale", href: "/sale", badge: "47% off" },
        ],
      },
      {
        title: "Sell",
        links: [
          { text: "Open a seller account", href: "/sellers" },
          { text: "Pricing & fees", href: "/sellers/fees" },
          { text: "Seller handbook", href: "/sellers/handbook" },
          { text: "Office hours", href: "/sellers/office-hours" },
        ],
      },
      {
        title: "Help",
        links: [
          { text: "Help center", href: "/help" },
          { text: "Buyer protection", href: "/protection" },
          { text: "Disputes & appeals", href: "/disputes" },
          { text: "Contact", href: "/contact" },
        ],
      },
    ],
    companyName: "Refeira Marketplace",
    legalLinks: [
      { text: "Privacy", href: "/privacy" },
      { text: "Terms", href: "/terms" },
      { text: "Cookie settings", href: "/cookies" },
    ],
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
      {
        network: "pinterest",
        url: "https://pinterest.com/refeira",
        label: "Refeira on Pinterest",
      },
    ],
  },
};

/** Brazilian SMB — pt-BR copy, four columns */
export const BrazilianSMBFooter: Story = {
  args: {
    logoText: "Casa Reyes",
    tagline:
      "Catorze unidades, uma operação. Padaria, café e refeições saudáveis pela região metropolitana de Curitiba.",
    newsletterEyebrow: "Carta semanal",
    newsletterHeadline: "Cardápio da semana e novidades das unidades",
    newsletterDescription:
      "Toda quinta-feira de manhã. Recebe quem assina; ninguém mais.",
    newsletterPlaceholder: "Seu e-mail",
    newsletterCtaText: "Quero receber",
    newsletterPrivacyText:
      "Promessa: enviamos só uma vez por semana e dá pra cancelar com um clique.",
    newsletterSuccessText:
      "Combinado. Olha tua caixa nas próximas quintas a partir das 7h.",
    navColumns: [
      {
        title: "Unidades",
        links: [
          { text: "Centro", href: "/unidades/centro" },
          { text: "Batel", href: "/unidades/batel" },
          { text: "Água Verde", href: "/unidades/agua-verde" },
          { text: "Todas as 14", href: "/unidades" },
        ],
      },
      {
        title: "Cardápio",
        links: [
          { text: "Café da manhã", href: "/cardapio/cafe" },
          { text: "Almoço", href: "/cardapio/almoco" },
          { text: "Encomendas", href: "/encomendas" },
          { text: "Combos corporativos", href: "/corporativo" },
        ],
      },
      {
        title: "Casa",
        links: [
          { text: "Quem somos", href: "/sobre" },
          { text: "Carreiras", href: "/vagas", badge: "5 vagas" },
          { text: "Imprensa", href: "/imprensa" },
          { text: "Contato", href: "/contato" },
        ],
      },
    ],
    companyName: "Casa Reyes Alimentação Ltda.",
    legalLinks: [
      { text: "Política de privacidade", href: "/privacidade" },
      { text: "Termos de uso", href: "/termos" },
    ],
    socialLinks: [
      {
        network: "instagram",
        url: "https://instagram.com/casareyes",
        label: "Casa Reyes no Instagram",
      },
      {
        network: "whatsapp",
        url: "https://wa.me/5541994128213",
        label: "Casa Reyes no WhatsApp",
      },
      {
        network: "facebook",
        url: "https://facebook.com/casareyes",
        label: "Casa Reyes no Facebook",
      },
    ],
  },
};
