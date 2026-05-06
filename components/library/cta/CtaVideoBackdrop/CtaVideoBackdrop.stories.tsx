import type { Meta, StoryObj } from "@storybook/react";
import CtaVideoBackdrop from "./index";

const meta: Meta<typeof CtaVideoBackdrop> = {
  title: "CTA/CtaVideoBackdrop",
  component: CtaVideoBackdrop,
  parameters: { layout: "fullscreen" },
  argTypes: {
    align: { control: "select", options: ["left", "center"] },
    overlayOpacity: { control: { type: "range", min: 0, max: 100, step: 5 } },
  },
};
export default meta;
type Story = StoryObj<typeof CtaVideoBackdrop>;

/* ------------------------------------------------------------------ */
/*  Public-domain looping clips from Pexels — used only inside Storybook
/*  fixtures. AI-pipeline outputs MUST inject site-specific videos.    */
/* ------------------------------------------------------------------ */

const COASTLINE_VIDEO =
  "https://videos.pexels.com/video-files/2169307/2169307-uhd_2560_1440_30fps.mp4";
const CITY_NIGHT_VIDEO =
  "https://videos.pexels.com/video-files/3015527/3015527-uhd_2560_1440_24fps.mp4";
const ATELIER_VIDEO =
  "https://videos.pexels.com/video-files/4488747/4488747-uhd_2732_1440_25fps.mp4";

/** Hospitality launch — coastal loop, left-aligned, calm overlay */
export const HospitalityLaunch: Story = {
  args: {
    eyebrow: "Reservations open · Casa Caju",
    headline: "Twelve rooms above a quiet stretch of the Bahia coastline",
    description:
      "Open from October. Six oceanfront suites, six garden rooms, one shared kitchen run by a chef who used to cook in São Paulo and grew tired of cities.",
    ctaText: "Hold a date",
    ctaUrl: "/reserve",
    secondaryText: "Read the guest letter",
    secondaryUrl: "/letter",
    videoSrc: COASTLINE_VIDEO,
    poster: "https://picsum.photos/seed/hospitality-coast/1920/1080",
    videoAriaLabel:
      "Slow drone footage panning over a green coastline meeting the Atlantic ocean.",
    overlayOpacity: 35,
    align: "left",
    minHeight: "85vh",
  },
};

/** SaaS product launch — energetic city loop, glow CTA via styleKit */
export const SaasProductLaunch: Story = {
  args: {
    eyebrow: "v3.0 ships Tuesday",
    headline: "Ship the next hundred PRs without losing a Friday afternoon",
    description:
      "Diff summaries, flake detection, and a review queue that learns who actually has context. We use it on this codebase — that's why it ships on Tuesdays.",
    ctaText: "Get a launch seat",
    ctaUrl: "/launch",
    secondaryText: "See the v3 changelog",
    secondaryUrl: "/changelog",
    videoSrc: CITY_NIGHT_VIDEO,
    poster: "https://picsum.photos/seed/saas-city-night/1920/1080",
    videoAriaLabel:
      "Time-lapse of a downtown skyline with traffic light trails moving between high-rises.",
    overlayOpacity: 55,
    align: "left",
    styleKit: { ctaVariant: "glow", ctaColorScheme: "primary" },
  },
};

/** Premium consumer brand — atelier loop, centered headline, heavier overlay */
export const PremiumConsumer: Story = {
  args: {
    eyebrow: "Numbered run · 312 pieces",
    headline:
      "A coat made the way they were made before logistics flattened them",
    description:
      "Sixteen panels, two interior pockets, one Italian wool we've been saving for three winters. Each piece numbered on the inside hem.",
    ctaText: "Reserve a numbered piece",
    ctaUrl: "/reserve",
    videoSrc: ATELIER_VIDEO,
    poster: "https://picsum.photos/seed/atelier-coat/1920/1080",
    videoAriaLabel:
      "A tailor's hands stitching a navy wool coat under a workshop lamp.",
    overlayOpacity: 50,
    align: "center",
    minHeight: "90vh",
  },
};

/** pt-BR campanha de lançamento — left-aligned, slide-style CTA */
export const PortugueseCampaignBR: Story = {
  args: {
    eyebrow: "Edição limitada · Bahia",
    headline: "O verão que a gente esperou três invernos",
    description:
      "Doze peças costuradas no ateliê em Salvador, com o nome de quem cortou e o nome de quem costurou impressos por dentro. Cada peça é numerada à mão.",
    ctaText: "Reservar uma peça",
    ctaUrl: "/reservar",
    secondaryText: "Ler a carta do verão",
    secondaryUrl: "/carta",
    videoSrc: COASTLINE_VIDEO,
    poster: "https://picsum.photos/seed/verao-bahia/1920/1080",
    videoAriaLabel:
      "Cena lenta de drone sobre uma costa verde encontrando o oceano Atlântico.",
    overlayOpacity: 40,
    align: "left",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "accent" },
  },
};

/** Performance-first — controls hidden, dark overlay, single ask */
export const PerformanceFirst: Story = {
  args: {
    eyebrow: "Annual report",
    headline: "What we built, who we hired, and what stayed broken",
    description:
      "Twelve pages, written by the operators who shipped the work. Numbers are messy on purpose — round figures hide the things we want you to learn from.",
    ctaText: "Read the 2025 letter",
    ctaUrl: "/2025",
    videoSrc: ATELIER_VIDEO,
    poster: "https://picsum.photos/seed/annual-report/1920/1080",
    videoAriaLabel:
      "Slow footage of paper being threaded through a letterpress.",
    overlayOpacity: 60,
    align: "left",
    showControls: false,
  },
};
