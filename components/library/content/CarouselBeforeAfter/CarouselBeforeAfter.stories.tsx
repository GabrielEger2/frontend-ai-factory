import type { Meta, StoryObj } from "@storybook/react";
import CarouselBeforeAfter from "./index";

const meta: Meta<typeof CarouselBeforeAfter> = {
  title: "Content/CarouselBeforeAfter",
  component: CarouselBeforeAfter,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof CarouselBeforeAfter>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Architecture firm — three projects, default labels */
export const ArchitectureRestoration: Story = {
  args: {
    eyebrow: "Recent restorations",
    headline: "Three buildings, three different briefs",
    subheadline:
      "Drag the slider on each image to see the original condition next to what we delivered.",
    items: [
      {
        title: "1890 brownstone façade · Beacon Hill",
        description:
          "Original lime mortar repointed, copper detail re-soldered, eight-week scope without a change of ownership.",
        beforeImage:
          "https://picsum.photos/seed/beforeafter-brownstone-pre/1280/800",
        beforeAlt: "Brownstone façade before restoration, weathered stone",
        afterImage:
          "https://picsum.photos/seed/beforeafter-brownstone-post/1280/800",
        afterAlt: "Brownstone façade after restoration, clean stone and copper",
      },
      {
        title: "Loft conversion · Vila Mariana",
        description:
          "Two-bedroom apartment opened into a single floor-through; the kitchen relocated and a west-facing reading nook added.",
        beforeImage: "https://picsum.photos/seed/beforeafter-loft-pre/1280/800",
        beforeAlt: "Apartment interior before conversion",
        afterImage: "https://picsum.photos/seed/beforeafter-loft-post/1280/800",
        afterAlt: "Loft interior after conversion",
      },
      {
        title: "Storefront refresh · Pinheiros",
        description:
          "New signage, awning, and a four-color paint palette pulled from the building's original 1928 tile work.",
        beforeImage:
          "https://picsum.photos/seed/beforeafter-storefront-pre/1280/800",
        beforeAlt: "Storefront before redesign",
        afterImage:
          "https://picsum.photos/seed/beforeafter-storefront-post/1280/800",
        afterAlt: "Storefront after redesign with new signage",
      },
    ],
  },
};

/** Brand identity refresh — custom labels (Old / New) */
export const BrandIdentityRefresh: Story = {
  args: {
    eyebrow: "Six-month rebrand",
    headline: "Old marks, new marks — every screen we owned",
    subheadline:
      "We rolled the rebrand across six surfaces in a single weekend. These are four of them.",
    items: [
      {
        title: "Marketing site",
        description: "Three-column homepage replaced with an editorial split.",
        beforeImage: "https://picsum.photos/seed/brand-marketing-old/1280/800",
        beforeAlt: "Old marketing site homepage",
        afterImage: "https://picsum.photos/seed/brand-marketing-new/1280/800",
        afterAlt: "New marketing site homepage",
        beforeLabel: "Old",
        afterLabel: "New",
      },
      {
        title: "Product dashboard",
        description:
          "Sidebar restructured around the four nouns that drove 80% of pageviews.",
        beforeImage: "https://picsum.photos/seed/brand-dashboard-old/1280/800",
        beforeAlt: "Old product dashboard",
        afterImage: "https://picsum.photos/seed/brand-dashboard-new/1280/800",
        afterAlt: "New product dashboard",
        beforeLabel: "Old",
        afterLabel: "New",
      },
      {
        title: "Email templates",
        description:
          "Single canonical layout, ten content blocks, no decorative gradients.",
        beforeImage: "https://picsum.photos/seed/brand-email-old/1280/800",
        beforeAlt: "Old email template",
        afterImage: "https://picsum.photos/seed/brand-email-new/1280/800",
        afterAlt: "New email template",
        beforeLabel: "Old",
        afterLabel: "New",
      },
      {
        title: "Mobile app",
        description:
          "Tab bar collapsed from five tabs to three; settings lives in profile.",
        beforeImage: "https://picsum.photos/seed/brand-mobile-old/1280/800",
        beforeAlt: "Old mobile app interface",
        afterImage: "https://picsum.photos/seed/brand-mobile-new/1280/800",
        afterAlt: "New mobile app interface",
        beforeLabel: "Old",
        afterLabel: "New",
      },
    ],
  },
};

/** Aesthetic clinic — custom labels (Day 0 / Day 60) */
export const AestheticTreatmentResults: Story = {
  args: {
    eyebrow: "Treatment results",
    headline: "Sixty-day check-ins, photographed under the same light",
    subheadline:
      "Same camera, same lens, same time of day. Each slide moves the slider to compare day zero with the sixty-day follow-up.",
    initialPosition: 35,
    items: [
      {
        title: "Skin clarity protocol — case A047",
        description:
          "Standard six-week clarity protocol followed by two maintenance sessions. No filler, no retouching.",
        beforeImage: "https://picsum.photos/seed/clinic-a047-day0/1280/800",
        beforeAlt: "Patient A047 skin clarity, day 0",
        afterImage: "https://picsum.photos/seed/clinic-a047-day60/1280/800",
        afterAlt: "Patient A047 skin clarity, day 60",
        beforeLabel: "Day 0",
        afterLabel: "Day 60",
      },
      {
        title: "Pigmentation fade — case B112",
        description:
          "Three-session fade protocol; results held at the four-month follow-up.",
        beforeImage: "https://picsum.photos/seed/clinic-b112-day0/1280/800",
        beforeAlt: "Patient B112 pigmentation, day 0",
        afterImage: "https://picsum.photos/seed/clinic-b112-day60/1280/800",
        afterAlt: "Patient B112 pigmentation, day 60",
        beforeLabel: "Day 0",
        afterLabel: "Day 60",
      },
      {
        title: "Texture refinement — case C233",
        description:
          "Combined microneedling and topical regimen. Skin texture standardized at sixty days.",
        beforeImage: "https://picsum.photos/seed/clinic-c233-day0/1280/800",
        beforeAlt: "Patient C233 texture, day 0",
        afterImage: "https://picsum.photos/seed/clinic-c233-day60/1280/800",
        afterAlt: "Patient C233 texture, day 60",
        beforeLabel: "Day 0",
        afterLabel: "Day 60",
      },
    ],
  },
};

/** Single comparison — full impact, no carousel nav shown */
export const SingleProjectFocus: Story = {
  args: {
    eyebrow: "Anchor project",
    headline: "Eight months in: the old loading bay vs. what's there now",
    items: [
      {
        title: "Northwave HQ — loading bay rebuild",
        description:
          "Concrete pad replaced, EV charging added, exterior cladding swapped to a black corrugated panel system.",
        beforeImage: "https://picsum.photos/seed/single-loading-pre/1280/800",
        beforeAlt: "Loading bay before rebuild",
        afterImage: "https://picsum.photos/seed/single-loading-post/1280/800",
        afterAlt: "Loading bay after rebuild",
      },
    ],
  },
};
