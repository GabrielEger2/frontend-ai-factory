import type { Meta, StoryObj } from "@storybook/react";
import LogoCloud from "./index";

const meta: Meta<typeof LogoCloud> = {
  title: "Layouts/Grid/LogoCloud",
  component: LogoCloud,
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: { control: "select", options: ["marquee", "grid"] },
    tone: { control: "select", options: ["subtle", "stark"] },
  },
};
export default meta;
type Story = StoryObj<typeof LogoCloud>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

const placeholder = (label: string) =>
  `https://placehold.co/160x48/EEEEEE/333333?text=${encodeURIComponent(label)}`;

/** SaaS — marquee with 8 customer logos, subtle tone */
export const SaasCustomerProof: Story = {
  args: {
    label: "Trusted by teams shipping every Friday",
    variant: "marquee",
    tone: "subtle",
    logos: [
      { name: "Hinge Health", src: placeholder("Hinge") },
      { name: "Gusto", src: placeholder("Gusto") },
      { name: "Ramp", src: placeholder("Ramp") },
      { name: "Mercury", src: placeholder("Mercury") },
      { name: "Vanta", src: placeholder("Vanta") },
      { name: "Linear", src: placeholder("Linear") },
      { name: "Loops", src: placeholder("Loops") },
      { name: "Replicate", src: placeholder("Replicate") },
    ],
  },
};

/** Editorial — press mentions in static grid */
export const EditorialPressMentions: Story = {
  args: {
    label: "As seen in",
    headline: "Coverage from publications that don't take press releases",
    variant: "grid",
    tone: "subtle",
    logos: [
      { name: "Wired", src: placeholder("WIRED") },
      { name: "The Verge", src: placeholder("The+Verge") },
      { name: "Fast Company", src: placeholder("Fast+Company") },
      { name: "Bloomberg", src: placeholder("Bloomberg") },
      { name: "TechCrunch", src: placeholder("TechCrunch") },
      { name: "Pitchfork", src: placeholder("Pitchfork") },
    ],
  },
};

/** Brazilian agency — client logos with headline, marquee */
export const AgencyClientWall: Story = {
  args: {
    label: "Marcas que confiam no estúdio",
    headline:
      "Trabalhamos com 64 marcas brasileiras desde 2019 — selecionamos algumas abaixo",
    variant: "marquee",
    tone: "subtle",
    logos: [
      { name: "Natura", src: placeholder("Natura") },
      { name: "Nubank", src: placeholder("Nubank") },
      { name: "iFood", src: placeholder("iFood") },
      { name: "Grão Direto", src: placeholder("Grao+Direto") },
      { name: "Loft", src: placeholder("Loft") },
      { name: "QuintoAndar", src: placeholder("QuintoAndar") },
      { name: "Quero Educação", src: placeholder("Quero") },
    ],
  },
};

/** Conference — sponsor wall in stark color grid */
export const ConferenceSponsors: Story = {
  args: {
    label: "Powered by",
    headline: "Sponsors who underwrite Frontend Summit 2026",
    variant: "grid",
    tone: "stark",
    logos: [
      {
        name: "Vercel",
        src: placeholder("Vercel"),
        href: "https://vercel.com",
      },
      {
        name: "Cloudflare",
        src: placeholder("Cloudflare"),
        href: "https://cloudflare.com",
      },
      { name: "Fly.io", src: placeholder("Fly.io"), href: "https://fly.io" },
      {
        name: "PlanetScale",
        src: placeholder("PlanetScale"),
        href: "https://planetscale.com",
      },
      { name: "Sentry", src: placeholder("Sentry"), href: "https://sentry.io" },
      {
        name: "Algolia",
        src: placeholder("Algolia"),
        href: "https://algolia.com",
      },
      {
        name: "Linear",
        src: placeholder("Linear"),
        href: "https://linear.app",
      },
      {
        name: "Resend",
        src: placeholder("Resend"),
        href: "https://resend.com",
      },
    ],
  },
};

/** Investor portfolio — grid variant, headline-only, eight portfolio companies */
export const VentureCapitalPortfolio: Story = {
  args: {
    headline: "Recent additions to the portfolio",
    variant: "grid",
    tone: "subtle",
    logos: [
      { name: "Cresta", src: placeholder("Cresta") },
      { name: "Anduril", src: placeholder("Anduril") },
      { name: "Replit", src: placeholder("Replit") },
      { name: "Hex", src: placeholder("Hex") },
      { name: "Watershed", src: placeholder("Watershed") },
      { name: "Decagon", src: placeholder("Decagon") },
    ],
  },
};
