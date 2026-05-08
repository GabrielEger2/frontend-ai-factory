import type { Meta, StoryObj } from "@storybook/react";
import CarouselBeforeAfter from "./index";

const meta: Meta<typeof CarouselBeforeAfter> = {
  title: "Content/CarouselBeforeAfter",
  component: CarouselBeforeAfter,
  parameters: { layout: "fullscreen" },
  argTypes: {
    initialPosition: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    ctaVariant: {
      control: { type: "select" },
      options: [
        "default",
        "slide",
        "dotExpand",
        "drawOutline",
        "glow",
        "arrow",
      ],
    },
    ctaColorScheme: {
      control: { type: "select" },
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof CarouselBeforeAfter>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Architecture firm — full case-study framing: project meta, three
 * narrated cases with structured notes, pull-quote, outcome band, CTA. */
export const ArchitectureRestoration: Story = {
  args: {
    eyebrow: "Selected restoration · 2024",
    headline: "Three buildings, three different briefs, one studio",
    subheadline:
      "Drag the slider on each image to compare the inherited condition against what we delivered. The notes column carries scope, crew and outcome for each project — the metric band below sums up the year.",
    meta: [
      { label: "Studio", value: "Cardoso & Tavares Atelier" },
      { label: "Scope", value: "Restoration · Adaptive reuse" },
      { label: "Window", value: "Jan – Dec 2024" },
      { label: "Lead", value: "Mariana Cardoso" },
    ],
    items: [
      {
        title: "1890 brownstone façade · Beacon Hill",
        description:
          "Original lime mortar repointed, copper detail re-soldered, eight-week scope without a change of ownership. The cornice was rebuilt in matching pressed copper from a salvage yard in Quincy.",
        meta: "Beacon Hill, MA · 2024",
        notes: [
          { label: "Scope", value: "Façade · cornice · entry stair" },
          { label: "Crew", value: "4 masons · 2 metalworkers" },
          {
            label: "Approval",
            value: "Historic district, first submission",
          },
        ],
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
          "Two-bedroom apartment opened into a single floor-through; the kitchen relocated, a west-facing reading nook added, original quaresmeira flooring sanded back and re-oiled in place.",
        meta: "São Paulo, BR · 2023",
        notes: [
          { label: "Area", value: "118 m² single floor" },
          { label: "Walls removed", value: "3 non-load-bearing partitions" },
          { label: "Lead time", value: "11 weeks, occupied" },
        ],
        beforeImage: "https://picsum.photos/seed/beforeafter-loft-pre/1280/800",
        beforeAlt: "Apartment interior before conversion",
        afterImage: "https://picsum.photos/seed/beforeafter-loft-post/1280/800",
        afterAlt: "Loft interior after conversion",
      },
      {
        title: "Storefront refresh · Pinheiros",
        description:
          "New signage, awning, and a four-color paint palette pulled from the building's original 1928 tile work. The hand-painted sign is by Estúdio Baião, finished on site over two mornings.",
        meta: "São Paulo, BR · 2024",
        notes: [
          { label: "Surfaces", value: "Awning · sign · door · window frames" },
          { label: "Palette source", value: "1928 entrance tile" },
          { label: "Install", value: "Weekend · open Monday morning" },
        ],
        beforeImage:
          "https://picsum.photos/seed/beforeafter-storefront-pre/1280/800",
        beforeAlt: "Storefront before redesign",
        afterImage:
          "https://picsum.photos/seed/beforeafter-storefront-post/1280/800",
        afterAlt: "Storefront after redesign with new signage",
      },
    ],
    pullQuote: {
      quote:
        "They handed us back a building we already loved, with the parts we never noticed quietly fixed.",
      attribution: "Inês Bahia",
      attributionMeta: "Owner · Beacon Hill brownstone",
    },
    metrics: [
      { value: "11 yrs", label: "Average building age before scope" },
      { value: "47.2%", label: "Energy efficiency lift, post-retrofit" },
      { value: "3 / 3", label: "Projects delivered on schedule" },
      { value: "1,820 hrs", label: "Logged across the three projects" },
    ],
    ctaText: "See the full project archive",
    ctaUrl: "#",
    ctaVariant: "arrow",
  },
};

/** Brand identity refresh — section meta, custom Old/New labels, no
 * metrics band, glow CTA. Notes carry surface-by-surface detail. */
export const BrandIdentityRefresh: Story = {
  args: {
    eyebrow: "Six-month rebrand · case study",
    headline: "Old marks, new marks — every screen we owned",
    subheadline:
      "We rolled the rebrand across six surfaces in a single weekend. These are four of them, with the call-outs that mattered to each team that owned them.",
    meta: [
      { label: "Client", value: "Cargo Atlas" },
      { label: "Workstreams", value: "Identity · Web · Lifecycle · App" },
      { label: "Window", value: "Sep 2023 – Mar 2024" },
      { label: "Team", value: "Bianca Okazaki + 3" },
    ],
    items: [
      {
        title: "Marketing site",
        description:
          "Three-column homepage replaced with an editorial split. Five inherited landing pages collapsed into one spine that tells the same story for shippers, brokers and carriers.",
        meta: "Web · launched March",
        notes: [
          { label: "Pages cut", value: "11 → 4 canonical" },
          { label: "New hero", value: "Editorial split, asymmetric" },
          { label: "First-week traffic", value: "+38% vs. trailing month" },
        ],
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
          "Sidebar restructured around the four nouns that drove 80% of pageviews. Settings moved out of the global nav and into profile, freeing the chrome for actual work.",
        meta: "Product · v4.2",
        notes: [
          { label: "Nav nouns", value: "Shipments · Quotes · Invoices · Team" },
          { label: "Removed", value: "Settings tab · help drawer · banner" },
          { label: "Density", value: "Tightened by 12 px row height" },
        ],
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
          "Single canonical layout, ten content blocks, no decorative gradients. The inherited fourteen templates were rebuilt from a single MJML root.",
        meta: "Lifecycle · 14 templates",
        notes: [
          { label: "Templates", value: "14 rebuilt from one root" },
          { label: "Open lift", value: "+9.2% across the suite" },
          { label: "Deliverability", value: "100% clean DMARC alignment" },
        ],
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
          "Tab bar collapsed from five tabs to three; settings lives in profile. The map became the home screen for drivers — the screen they actually open every shift.",
        meta: "iOS / Android · v6.0",
        notes: [
          { label: "Tabs", value: "5 → 3 (Home · Map · Profile)" },
          { label: "Default home", value: "Map for drivers · List for ops" },
          { label: "Onboarding", value: "Cut from 6 screens to 3" },
        ],
        beforeImage: "https://picsum.photos/seed/brand-mobile-old/1280/800",
        beforeAlt: "Old mobile app interface",
        afterImage: "https://picsum.photos/seed/brand-mobile-new/1280/800",
        afterAlt: "New mobile app interface",
        beforeLabel: "Old",
        afterLabel: "New",
      },
    ],
    pullQuote: {
      quote:
        "The first thing our drivers said after the update was that the app finally felt like the company.",
      attribution: "Rafael Tavares",
      attributionMeta: "Head of Mobile · Cargo Atlas",
    },
    ctaText: "Read the rebrand write-up",
    ctaUrl: "#",
    ctaVariant: "glow",
    ctaColorScheme: "primary",
  },
};

/** Aesthetic clinic — Day 0 / Day 60 labels, opens at 35%, no CTA but
 * keeps the project meta strip and a results-led pull-quote. */
export const AestheticTreatmentResults: Story = {
  args: {
    eyebrow: "Treatment results · cohort review",
    headline: "Sixty-day check-ins, photographed under the same light",
    subheadline:
      "Same camera, same lens, same time of day. Each slide moves the slider to compare day zero with the sixty-day follow-up; the notes column carries the protocol used.",
    initialPosition: 35,
    meta: [
      { label: "Clinic", value: "Clínica Aurora" },
      { label: "Cohort window", value: "Q1 2024" },
      { label: "Cases reviewed", value: "1,247 standardised" },
      { label: "Lead clinician", value: "Dra. Bianca Okazaki" },
    ],
    items: [
      {
        title: "Skin clarity protocol — case A047",
        description:
          "Standard six-week clarity protocol followed by two maintenance sessions. No filler, no retouching; lighting standardised against the cohort reference card.",
        meta: "Cohort A · 6-week protocol",
        notes: [
          { label: "Sessions", value: "6 + 2 maintenance" },
          { label: "Active agents", value: "Salicylic 2% · niacinamide 5%" },
          { label: "Side effects", value: "None reported, day 14 onward" },
        ],
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
          "Three-session fade protocol; results held at the four-month follow-up under the same lighting setup as the day-zero plate.",
        meta: "Cohort B · 3 sessions",
        notes: [
          { label: "Sessions", value: "3 spaced 21 days apart" },
          { label: "Modality", value: "Q-switched 532 nm + topical regimen" },
          { label: "Maintenance", value: "Quarterly photo follow-up" },
        ],
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
          "Combined microneedling and topical regimen. Skin texture standardised at sixty days against the same reference grid used at intake.",
        meta: "Cohort C · combined regimen",
        notes: [
          { label: "Modality", value: "Microneedling 0.5 mm + retinoid" },
          { label: "Cadence", value: "Bi-weekly · 6 sessions" },
          { label: "Photo plate", value: "Cross-polarised, ring-light fixed" },
        ],
        beforeImage: "https://picsum.photos/seed/clinic-c233-day0/1280/800",
        beforeAlt: "Patient C233 texture, day 0",
        afterImage: "https://picsum.photos/seed/clinic-c233-day60/1280/800",
        afterAlt: "Patient C233 texture, day 60",
        beforeLabel: "Day 0",
        afterLabel: "Day 60",
      },
    ],
    pullQuote: {
      quote:
        "Standardising the lighting was the single thing that turned our review meetings from arguments into agreements.",
      attribution: "Dra. Bianca Okazaki",
      attributionMeta: "Lead clinician · Clínica Aurora",
    },
    metrics: [
      { value: "94%", label: "Patients reporting visible improvement" },
      { value: "60 days", label: "Standardised follow-up window" },
      { value: "1,247", label: "Cases photographed in 2024" },
      { value: "0", label: "Cases excluded for lighting drift" },
    ],
  },
};

/** Single comparison — full impact, no carousel nav, draw-outline CTA.
 * Demonstrates the component as a deep-dive single-case anchor. */
export const SingleProjectFocus: Story = {
  args: {
    eyebrow: "Anchor project · 2024",
    headline: "Eight months in: the old loading bay vs. what's there now",
    subheadline:
      "One project, photographed from the same camera position before demolition and after handover. The notes column carries the structural decisions; the metric band sums up what changed for the operations team.",
    meta: [
      { label: "Client", value: "Northwave Logistics" },
      { label: "Location", value: "Saint Paul, MN" },
      { label: "Window", value: "Mar – Nov 2024" },
      { label: "Scope", value: "Demolition · rebuild · EV install" },
    ],
    items: [
      {
        title: "Northwave HQ — loading bay rebuild",
        description:
          "Concrete pad replaced, EV charging added, exterior cladding swapped to a black corrugated panel system. The bay stayed operational on a half-shift schedule for the entire scope.",
        meta: "Saint Paul, MN · 2024",
        notes: [
          { label: "Scope", value: "Pad · cladding · 4× EV stations" },
          { label: "Downtime", value: "0 full shifts lost" },
          { label: "Permits", value: "City + utility, parallel filings" },
          {
            label: "Crew",
            value: "Daytime concrete, overnight electrical",
          },
        ],
        beforeImage: "https://picsum.photos/seed/single-loading-pre/1280/800",
        beforeAlt: "Loading bay before rebuild",
        afterImage: "https://picsum.photos/seed/single-loading-post/1280/800",
        afterAlt: "Loading bay after rebuild",
      },
    ],
    pullQuote: {
      quote:
        "The day they finished, our drivers asked which yard we were borrowing — they didn't recognise it.",
      attribution: "Henrique Salles",
      attributionMeta: "Operations Director · Northwave Logistics",
    },
    metrics: [
      { value: "0", label: "Full shifts lost during rebuild" },
      { value: "4", label: "EV charging stations added" },
      { value: "32 t", label: "Concrete recycled on site" },
      { value: "8 mo", label: "From demolition to handover" },
    ],
    ctaText: "Tour the full Northwave campus",
    ctaUrl: "#",
    ctaVariant: "drawOutline",
    ctaColorScheme: "primary",
  },
};
