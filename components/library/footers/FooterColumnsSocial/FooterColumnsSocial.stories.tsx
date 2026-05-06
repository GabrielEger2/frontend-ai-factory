import type { Meta, StoryObj } from "@storybook/react";
import FooterColumnsSocial from "./index";

const meta: Meta<typeof FooterColumnsSocial> = {
  title: "Footer/FooterColumnsSocial",
  component: FooterColumnsSocial,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof FooterColumnsSocial>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Creator-led brand — five social handles, three nav columns */
export const CreatorBrand: Story = {
  args: {
    logoText: "Refeira",
    tagline:
      "A curated marketplace for handmade goods. Buyers and makers in 47 countries.",
    regionLabel: "Brasil · Worldwide",
    navColumns: [
      {
        title: "Shop",
        links: [
          { text: "All collections", href: "/shop" },
          { text: "New arrivals", href: "/new" },
          { text: "Maker spotlight", href: "/makers" },
          { text: "Sale", href: "/sale" },
        ],
      },
      {
        title: "Sell",
        links: [
          { text: "Open a seller account", href: "/sellers" },
          { text: "Pricing & fees", href: "/sellers/fees" },
          { text: "Seller handbook", href: "/sellers/handbook" },
        ],
      },
      {
        title: "Help",
        links: [
          { text: "Help center", href: "/help" },
          { text: "Buyer protection", href: "/protection" },
          { text: "Contact", href: "/contact" },
        ],
      },
    ],
    socialHeading: "Follow along",
    socialHandles: [
      {
        network: "instagram",
        url: "https://instagram.com/refeira",
        handle: "@refeira",
        label: "Refeira on Instagram",
      },
      {
        network: "tiktok",
        url: "https://tiktok.com/@refeira",
        handle: "@refeira",
        label: "Refeira on TikTok",
      },
      {
        network: "pinterest",
        url: "https://pinterest.com/refeira",
        handle: "Refeira",
        label: "Refeira on Pinterest",
      },
      {
        network: "youtube",
        url: "https://youtube.com/@refeira",
        handle: "@refeira",
        label: "Refeira on YouTube",
      },
    ],
    companyName: "Refeira Marketplace",
    legalLinks: [
      { text: "Privacy", href: "/privacy" },
      { text: "Terms", href: "/terms" },
      { text: "Cookie settings", href: "/cookies" },
    ],
  },
};

/** B2B SaaS — four nav columns, three professional handles */
export const B2BSaas: Story = {
  args: {
    logoText: "Northbeam",
    tagline:
      "Production observability for teams that ship every day. Built in São Paulo and Stockholm.",
    regionLabel: "Global · EU residency",
    navColumns: [
      {
        title: "Product",
        links: [
          { text: "Overview", href: "/product" },
          { text: "Pricing", href: "/pricing" },
          { text: "Integrations", href: "/integrations" },
          { text: "Changelog", href: "/changelog" },
        ],
      },
      {
        title: "Resources",
        links: [
          { text: "Documentation", href: "/docs" },
          { text: "API reference", href: "/docs/api" },
          { text: "Customer stories", href: "/customers" },
          { text: "Engineering blog", href: "/blog" },
        ],
      },
      {
        title: "Company",
        links: [
          { text: "About", href: "/about" },
          { text: "Careers", href: "/careers" },
          { text: "Press", href: "/press" },
          { text: "Contact", href: "/contact" },
        ],
      },
    ],
    socialHeading: "Find us",
    socialHandles: [
      {
        network: "linkedin",
        url: "https://linkedin.com/company/northbeam",
        handle: "Northbeam",
        label: "Northbeam on LinkedIn",
      },
      {
        network: "twitter",
        url: "https://twitter.com/northbeam",
        handle: "@northbeam",
        label: "Northbeam on X",
      },
      {
        network: "youtube",
        url: "https://youtube.com/@northbeam",
        handle: "@northbeam",
        label: "Northbeam on YouTube",
      },
    ],
    companyName: "Northbeam, Inc.",
    legalLinks: [
      { text: "Privacy", href: "/privacy" },
      { text: "Terms", href: "/terms" },
      { text: "Security", href: "/security" },
      { text: "Status", href: "https://status.northbeam.example" },
    ],
  },
};

/** Editorial publication — terse columns, four handles */
export const EditorialPublication: Story = {
  args: {
    logoText: "Estuário Daily",
    tagline:
      "An independent daily on infrastructure, climate, and the political economy of platforms.",
    regionLabel: "Reading · 7 min",
    navColumns: [
      {
        title: "Sections",
        links: [
          { text: "Infrastructure", href: "/infrastructure" },
          { text: "Climate", href: "/climate" },
          { text: "Platforms", href: "/platforms" },
          { text: "Long-form", href: "/longreads" },
        ],
      },
      {
        title: "About",
        links: [
          { text: "The team", href: "/team" },
          { text: "Editorial standards", href: "/standards" },
          { text: "Corrections", href: "/corrections" },
          { text: "Tip line", href: "/tip" },
        ],
      },
      {
        title: "Subscribe",
        links: [
          { text: "Pricing", href: "/subscribe" },
          { text: "Group rates", href: "/group" },
          { text: "Educator rate", href: "/edu" },
        ],
      },
    ],
    socialHeading: "Read elsewhere",
    socialHandles: [
      {
        network: "twitter",
        url: "https://twitter.com/estuariodaily",
        handle: "@estuariodaily",
        label: "Estuário on X",
      },
      {
        network: "instagram",
        url: "https://instagram.com/estuariodaily",
        handle: "@estuariodaily",
        label: "Estuário on Instagram",
      },
      {
        network: "linkedin",
        url: "https://linkedin.com/company/estuariodaily",
        handle: "Estuário Daily",
        label: "Estuário on LinkedIn",
      },
      {
        network: "telegram",
        url: "https://t.me/estuariodaily",
        handle: "estuariodaily",
        label: "Estuário on Telegram",
      },
    ],
    companyName: "Estuário Mídia Ltda.",
    legalLinks: [
      { text: "Política de privacidade", href: "/privacy" },
      { text: "Termos de uso", href: "/terms" },
    ],
  },
};

/** Brazilian SMB (pt-BR) — WhatsApp-first, three nav columns */
export const BrazilianSMB: Story = {
  args: {
    logoText: "Casa Reyes",
    tagline:
      "Catorze unidades, uma operação. Padaria, café e refeições saudáveis pela região metropolitana de Curitiba.",
    regionLabel: "Curitiba · 14 unidades",
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
        ],
      },
      {
        title: "Casa",
        links: [
          { text: "Quem somos", href: "/sobre" },
          { text: "Carreiras", href: "/vagas" },
          { text: "Imprensa", href: "/imprensa" },
          { text: "Contato", href: "/contato" },
        ],
      },
    ],
    socialHeading: "Fala com a gente",
    socialHandles: [
      {
        network: "whatsapp",
        url: "https://wa.me/5541994128213",
        handle: "(41) 99412-8213",
        label: "Casa Reyes no WhatsApp",
      },
      {
        network: "instagram",
        url: "https://instagram.com/casareyes",
        handle: "@casareyes",
        label: "Casa Reyes no Instagram",
      },
      {
        network: "facebook",
        url: "https://facebook.com/casareyes",
        handle: "Casa Reyes",
        label: "Casa Reyes no Facebook",
      },
    ],
    companyName: "Casa Reyes Alimentação Ltda.",
    legalLinks: [
      { text: "Política de privacidade", href: "/privacidade" },
      { text: "Termos de uso", href: "/termos" },
    ],
  },
};

/** No social column — pure utility footer fallback */
export const SitemapOnly: Story = {
  args: {
    logoText: "Tavora & Almeida",
    tagline:
      "Boutique tax & corporate law firm. Practicing in São Paulo and Lisboa since 1997.",
    regionLabel: "BR · PT",
    navColumns: [
      {
        title: "Practice areas",
        links: [
          { text: "Corporate", href: "/corporate" },
          { text: "Tax", href: "/tax" },
          { text: "M&A", href: "/ma" },
          { text: "Litigation", href: "/litigation" },
        ],
      },
      {
        title: "Firm",
        links: [
          { text: "Partners", href: "/partners" },
          { text: "Associates", href: "/associates" },
          { text: "Pro bono", href: "/probono" },
          { text: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Insights",
        links: [
          { text: "Newsletters", href: "/newsletters" },
          { text: "Whitepapers", href: "/papers" },
          { text: "Speaking", href: "/speaking" },
        ],
      },
    ],
    companyName: "Tavora & Almeida Sociedade de Advogados",
    legalLinks: [
      { text: "Privacidade", href: "/privacy" },
      { text: "Avisos legais", href: "/legal" },
    ],
  },
};
