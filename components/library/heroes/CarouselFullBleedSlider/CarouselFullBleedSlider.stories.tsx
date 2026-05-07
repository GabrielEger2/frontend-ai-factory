import type { Meta, StoryObj } from "@storybook/react";
import CarouselFullBleedSlider from "./index";

const meta: Meta<typeof CarouselFullBleedSlider> = {
  title: "Hero/CarouselFullBleedSlider",
  component: CarouselFullBleedSlider,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    captionAlignment: {
      control: { type: "select" },
      options: ["bottom-left", "bottom-center", "center-left", "center"],
    },
    height: {
      control: { type: "select" },
      options: ["short", "tall", "full"],
    },
    autoAdvanceMs: {
      control: { type: "range", min: 0, max: 15000, step: 500 },
    },
    showArrows: { control: { type: "boolean" } },
    showDots: { control: { type: "boolean" } },
    showPlayPause: { control: { type: "boolean" } },
    dragBuffer: {
      control: { type: "range", min: 20, max: 200, step: 10 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof CarouselFullBleedSlider>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Travel editorial — three field stories with bottom-left captions. */
export const TravelEditorial: Story = {
  args: {
    captionAlignment: "bottom-left",
    height: "tall",
    autoAdvanceMs: 7000,
    items: [
      {
        image: "https://picsum.photos/seed/travel-altiplano/1920/1080",
        imageAlt:
          "Aerial photograph of a salt flat at sunrise with reflected mountains",
        eyebrow: "Atacama · 2024",
        headline: "Three days at 4,200 metres, no plan past breakfast",
        description:
          "We rented a Hilux in Calama and drove until the asphalt ended. The salt flats kept us occupied for two of the three days; the third we slept.",
        ctaText: "Read the field notes",
        ctaUrl: "#atacama",
      },
      {
        image: "https://picsum.photos/seed/travel-coast/1920/1080",
        imageAlt:
          "Wave-cut cliffs along a winding coastal road in late afternoon light",
        eyebrow: "Cabo Polonio · 2023",
        headline: "The town with no roads, no power, and one bakery",
        description:
          "Reachable only by 4x4 across the dunes. We stayed four nights longer than planned. Rosa's bread is the reason.",
        ctaText: "See the route",
        ctaUrl: "#cabo-polonio",
      },
      {
        image: "https://picsum.photos/seed/travel-canopy/1920/1080",
        imageAlt: "Misty rainforest canopy from a hanging walkway",
        eyebrow: "Iracambi · 2024",
        headline: "Counting bromeliads at the edge of the Mata Atlântica",
        description:
          "Three weeks helping the Iracambi research station map a 12-hectare regrowth plot. Surprisingly good coffee at altitude.",
        ctaText: "Open the dataset",
        ctaUrl: "#iracambi",
      },
    ],
  },
};

/** Hotel landing — center-aligned captions, longer auto-advance. */
export const HotelLanding: Story = {
  args: {
    captionAlignment: "bottom-center",
    height: "full",
    autoAdvanceMs: 9000,
    items: [
      {
        image: "https://picsum.photos/seed/hotel-pool/1920/1080",
        imageAlt:
          "Infinity pool overlooking a tropical bay at golden hour, sun loungers in foreground",
        eyebrow: "Pousada Tagomago",
        headline: "Open since 1978 · Revived in 2022",
        description:
          "Twelve suites, one quiet pool, and the same family running the kitchen for four decades.",
        ctaText: "Book a stay",
        ctaUrl: "#book",
      },
      {
        image: "https://picsum.photos/seed/hotel-suite/1920/1080",
        imageAlt:
          "Hotel suite interior with a four-poster bed and balcony doors open to the sea",
        eyebrow: "Casa Suite",
        headline: "Sea-facing rooms from R$ 1,840 a night",
        description:
          "Six of our twelve suites face the bay directly. The other six face the courtyard garden — quieter, three degrees cooler.",
        ctaText: "See the rooms",
        ctaUrl: "#rooms",
      },
      {
        image: "https://picsum.photos/seed/hotel-dinner/1920/1080",
        imageAlt:
          "Outdoor dining table set under string lights with the ocean in the background",
        eyebrow: "Restaurante",
        headline: "Mariana cooks Wednesday through Sunday",
        description:
          "Fish landed that morning, vegetables from the garden out back. Eight tables, one service, no menu.",
        ctaText: "Reserve a table",
        ctaUrl: "#dining",
      },
      {
        image: "https://picsum.photos/seed/hotel-spa/1920/1080",
        imageAlt:
          "Open-air stone bath surrounded by tropical plants and bamboo screens",
        eyebrow: "O Banho",
        headline: "A 90-minute ritual built around hot stone and breath",
        description:
          "Designed with herbalist Beatriz Ribeiro using leaves and oils from within five kilometres of the property.",
        ctaText: "Book a treatment",
        ctaUrl: "#spa",
      },
    ],
  },
};

/** Agency case-work showcase — center-left captions, fast pacing. */
export const AgencyShowcase: Story = {
  args: {
    captionAlignment: "center-left",
    height: "tall",
    autoAdvanceMs: 5500,
    items: [
      {
        image: "https://picsum.photos/seed/agency-rebrand/1920/1080",
        imageAlt:
          "Brand identity boards laid out on a large studio table with samples",
        eyebrow: "Banco Sequoia · Identity",
        headline: "From a 47-page audit to a working brand system",
        description:
          "Three audiences, two product surfaces, one lockup. The system shipped in 14 weeks and now runs across 38 product screens.",
        ctaText: "Read the case",
        ctaUrl: "#banco-sequoia",
      },
      {
        image: "https://picsum.photos/seed/agency-product/1920/1080",
        imageAlt:
          "Mobile app screens for a health platform mocked up on physical devices",
        eyebrow: "Cuidar.me · Product",
        headline: "Cutting onboarding from 11 minutes to 94 seconds",
        description:
          "Re-architected the sign-up flow, killed three sub-screens, and let users skip ID verification until checkout. Activation up 38.4%.",
        ctaText: "See the work",
        ctaUrl: "#cuidar-me",
      },
      {
        image: "https://picsum.photos/seed/agency-campaign/1920/1080",
        imageAlt:
          "Out-of-home billboards photographed at night across a São Paulo avenue",
        eyebrow: "Cervejaria Coroa · Campaign",
        headline: "A summer campaign that ran on fourteen surfaces",
        description:
          "Print, OOH, social, in-store. One typographic system, one color, no mascot. Earned media: 11.3M impressions in four weeks.",
        ctaText: "Watch the spot",
        ctaUrl: "#coroa",
      },
    ],
  },
};

/** Image-only / no autoplay — fully manual gallery, dragger-friendly. */
export const ManualGallery: Story = {
  args: {
    captionAlignment: "bottom-left",
    height: "short",
    autoAdvanceMs: 0,
    showPlayPause: false,
    items: [
      {
        image: "https://picsum.photos/seed/manual-1/1920/1080",
        imageAlt: "Gallery image one — abstract architecture detail",
        eyebrow: "01",
        headline: "Edifício Niemeyer · column detail",
      },
      {
        image: "https://picsum.photos/seed/manual-2/1920/1080",
        imageAlt: "Gallery image two — staircase from below",
        eyebrow: "02",
        headline: "Fundação Iberê · staircase from the lobby",
      },
      {
        image: "https://picsum.photos/seed/manual-3/1920/1080",
        imageAlt: "Gallery image three — rooftop vent grid",
        eyebrow: "03",
        headline: "Sesc Pompéia · rooftop diffusers",
      },
      {
        image: "https://picsum.photos/seed/manual-4/1920/1080",
        imageAlt: "Gallery image four — interior light wells",
        eyebrow: "04",
        headline: "Casa de Vidro · light well array",
      },
    ],
  },
};

/** Single CTA-driven slide — minimal copy, center-aligned, headline only. */
export const CenteredAnnouncement: Story = {
  args: {
    captionAlignment: "center",
    height: "tall",
    autoAdvanceMs: 8000,
    items: [
      {
        image: "https://picsum.photos/seed/announce-launch/1920/1080",
        imageAlt:
          "Wide-angle photo of a packed amphitheatre at the start of an event",
        headline: "Annual conference · 14 — 16 August · Recife",
        description:
          "Three days, eleven speakers, one boat trip on the Capibaribe.",
        ctaText: "Reserve a seat",
        ctaUrl: "#conf",
      },
      {
        image: "https://picsum.photos/seed/announce-program/1920/1080",
        imageAlt:
          "Open notebook on a wooden lectern with the conference programme printed",
        headline: "Programme published — 32 sessions, 6 workshops",
        description: "Including the deep-dive track on platform economics.",
        ctaText: "View the schedule",
        ctaUrl: "#schedule",
      },
    ],
  },
};
