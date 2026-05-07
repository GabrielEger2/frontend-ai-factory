import type { Meta, StoryObj } from "@storybook/react";
import GalleryCaseStudy from "./index";

const meta: Meta<typeof GalleryCaseStudy> = {
  title: "Content/GalleryCaseStudy",
  component: GalleryCaseStudy,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaVariant: {
      control: "select",
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
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof GalleryCaseStudy>;

/** B2B SaaS rebrand — measurable conversion lift, drawOutline CTA. */
export const SaasRebrand: Story = {
  args: {
    eyebrow: "Case study · 2024",
    title:
      "Rebuilding the marketing site for a freight platform that grew 4x in 18 months",
    summary:
      "We replaced eleven inherited landing pages, a half-finished design system, and three different navigation patterns with a single voice — and held the migration window to 21 days.",
    heroImage: "https://picsum.photos/seed/case-saas/1600/900",
    heroImageAlt:
      "Freight platform marketing site shown across desktop and mobile",
    meta: [
      { label: "Client", value: "Cargo Atlas" },
      { label: "Role", value: "Brand · Web · Copy" },
      { label: "Timeline", value: "May–July 2024" },
      { label: "Team", value: "Mariana, Rafael, Bianca" },
    ],
    chapters: [
      {
        label: "Problem",
        heading: "Eleven landing pages saying eleven different things",
        body: "Three years of growth had left Cargo Atlas with a marketing site that read like a stack of disconnected announcements. Conversion data showed visitors bouncing between pages trying to figure out what the product actually did. Sales had stopped sending prospects to the site at all.",
        image: "https://picsum.photos/seed/case-saas-before/900/600",
        imageAlt: "Audit screenshot of inconsistent inherited landing pages",
      },
      {
        label: "Approach",
        heading: "One spine, three audiences, no orphan pages",
        body: "We mapped every existing page to one of three buyer journeys (shipper, broker, carrier), killed the seven that mapped to none, and rewrote the spine in a single voice. The component library shrunk from 84 patterns to 23, and every page got an explicit job before a single pixel moved.",
        image: "https://picsum.photos/seed/case-saas-process/900/600",
        imageAlt: "Information architecture diagram for new site spine",
      },
      {
        label: "Result",
        heading: "Inbound demos doubled in the first month after launch",
        body: "Sales started sending prospects to the site again. The new component library reduced new-page time from two weeks to two days, and the marketing team shipped twelve campaign pages in the quarter that followed without breaking the design system once.",
        image: "https://picsum.photos/seed/case-saas-after/900/600",
        imageAlt: "Final marketing site shown on multiple device sizes",
      },
    ],
    metrics: [
      { value: "+118%", label: "Inbound demo requests, month one" },
      { value: "21 days", label: "From kickoff to public launch" },
      { value: "84 → 23", label: "Component library reduction" },
      { value: "0", label: "Production rollback tickets" },
    ],
    ctaText: "Read the next study",
    ctaUrl: "/work/laboratorio-mira",
    ctaVariant: "drawOutline",
    ctaColorScheme: "neutral",
  },
};

/** Architecture project — hospitality renovation, slide CTA. */
export const HospitalityRenovation: Story = {
  args: {
    eyebrow: "Selected work · 2023",
    title:
      "Casa Almirante — restoring a 1894 townhouse for a contemporary host",
    summary:
      "A six-month renovation that kept the original facade, the chestnut beams, and exactly one of the inherited bathrooms. Everything else was rethought around the way the new owners actually live.",
    heroImage: "https://picsum.photos/seed/case-arch/1600/900",
    heroImageAlt:
      "Whitewashed Lisbon townhouse facade with restored azulejo above the door",
    meta: [
      { label: "Client", value: "Private commission" },
      { label: "Location", value: "Rua das Janelas Verdes" },
      { label: "Year", value: "2023" },
      { label: "Area", value: "247 m²" },
    ],
    chapters: [
      {
        label: "Inherited",
        heading: "Three previous renovations, none of them finished",
        body: "The house arrived to us mid-decade, with structural reinforcements left undone, an unbuilt loft staircase, and a kitchen that had been gutted then closed for storage. The challenge was archaeological as much as architectural — figuring out which layer to keep, which to remove, and which to make legible.",
        image: "https://picsum.photos/seed/case-arch-before/900/600",
        imageAlt: "Interior of the house before renovation, mid-construction",
      },
      {
        label: "Decision",
        heading: "Keep the bones. Rebuild every surface.",
        body: "We restored the original chestnut ceiling beams and the limewashed walls behind them, then poured new terrazzo floors, fitted a marble kitchen counter, and reopened the inner patio that had been bricked over in the 1970s. The new staircase to the loft uses the same chestnut, milled from a fallen tree on the owners' family farm.",
        image: "https://picsum.photos/seed/case-arch-process/900/600",
        imageAlt:
          "Detail of newly milled chestnut staircase under construction",
      },
      {
        label: "Lived",
        heading: "Two years in, the house has rearranged the family's habits",
        body: "Mornings now happen in the patio. The loft, which we expected to become a guest room, has instead become the place the household actually works. The owners have hosted three weddings in the garden — none of which were planned when we drew the first sketches.",
        image: "https://picsum.photos/seed/case-arch-after/900/600",
        imageAlt: "Final patio view with morning light through olive tree",
      },
    ],
    metrics: [
      { value: "247 m²", label: "Total habitable area" },
      { value: "11", label: "Original azulejos preserved" },
      { value: "6 mo", label: "From demolition to handover" },
      { value: "1894", label: "Original construction year" },
    ],
    ctaText: "Visit the house",
    ctaUrl: "/work/casa-almirante",
    ctaVariant: "slide",
    ctaColorScheme: "primary",
  },
};

/** Healthcare app redesign — accessibility-led, dotExpand CTA. */
export const HealthcareRedesign: Story = {
  args: {
    eyebrow: "Public-sector engagement · 2025",
    title:
      "Redesigning the appointment booking flow for a regional health authority",
    summary:
      "A 14-week engagement to rebuild the patient-facing booking flow used by 312,000 people across 47 primary-care centers in northern Portugal.",
    heroImage: "https://picsum.photos/seed/case-health/1600/900",
    heroImageAlt:
      "Patient-facing healthcare app shown on phone in waiting-room setting",
    meta: [
      { label: "Client", value: "ARS Norte" },
      { label: "Role", value: "Research · UX · Frontend" },
      { label: "Timeline", value: "Jan–April 2025" },
      { label: "Reach", value: "312k patients" },
    ],
    chapters: [
      {
        label: "Listening",
        heading:
          "The booking flow was built without ever watching anyone use it",
        body: "We sat with 47 patients across nine waiting rooms — Vila do Conde, Bragança, Vale do Sousa — and watched every one of them try to rebook. The single biggest barrier wasn't accessibility tooling, it was that the system asked for a citizen ID before showing any availability. People gave up before getting to a date.",
      },
      {
        label: "Rebuilding",
        heading: "Show what's available before asking who you are",
        body: "We inverted the flow: dates first, identification last. We added inline voice-input for older patients, hardened the Portuguese date parser against regional spellings, and rewrote every error message with a sample sentence. Color-contrast and screen-reader fixes shipped alongside, but the flow inversion did the heavy lifting.",
        image: "https://picsum.photos/seed/case-health-flow/900/600",
        imageAlt: "Side-by-side comparison of old and new booking flow",
      },
      {
        label: "Effect",
        heading: "Completed bookings rose 38.4 percent in the rollout quarter",
        body: "Phone-line load dropped enough that the central office cut a peak-hours overflow contract. Waiting-room kiosk sessions completed in under 90 seconds median, down from 4 minutes 12. The biggest indicator: rebooking, the metric we cared about most, climbed from 41% to 73%.",
      },
    ],
    metrics: [
      { value: "+38.4%", label: "Completed bookings, quarter one" },
      { value: "1m 27s", label: "New median session time" },
      { value: "73%", label: "Rebooking completion rate" },
      { value: "47", label: "Care centers in rollout" },
    ],
    ctaText: "Read the field-research notes",
    ctaUrl: "/work/ars-norte/research",
    ctaVariant: "dotExpand",
    ctaColorScheme: "primary",
  },
};

/** Brand identity — small footprint case, glow CTA. */
export const SmallBrandIdentity: Story = {
  args: {
    eyebrow: "Identity work · 2024",
    title: "A bakery that wanted its name to look like the bread it sells",
    summary:
      "A four-week identity engagement for Padaria da Paula — logotype, paper system, packaging, and the chalkboard hand at the counter.",
    heroImage: "https://picsum.photos/seed/case-bakery/1600/900",
    heroImageAlt:
      "Padaria da Paula storefront with handwritten chalkboard sign",
    meta: [
      { label: "Client", value: "Padaria da Paula" },
      { label: "Role", value: "Identity · Packaging" },
      { label: "Year", value: "2024" },
      { label: "Team", value: "Mariana + Bianca" },
    ],
    chapters: [
      {
        label: "Brief",
        heading: "Make it look like Paula's handwriting, not like a logo",
        body: "Paula bakes since 4 a.m. and writes the daily list on a chalkboard at 6. The brief was simple: make the brand look like that chalkboard, not like a logo on a coffee shop in an airport. So we started by photographing every sign Paula has written in the last six years.",
        image: "https://picsum.photos/seed/case-bakery-research/900/600",
        imageAlt: "Hand-photographed chalkboard signs from the bakery",
      },
      {
        label: "Type",
        heading: "Drawing the wordmark from twelve real chalkboards",
        body: "We traced the most consistent letterforms across twelve photographed boards, then redrew the wordmark with the same wrist as Paula. The final version was finalised by Paula at the bakery counter on a Tuesday morning, between two trays of bread coming out of the oven.",
        image: "https://picsum.photos/seed/case-bakery-type/900/600",
        imageAlt: "Logotype evolution sketches in pencil and chalk",
      },
      {
        label: "On the street",
        heading: "Six months later, customers are bringing back the bags",
        body: "The kraft paper bag carries a single date stamp and the wordmark. Customers started returning them folded for reuse, then asked for them as gift wrap, then started photographing them. The bakery's Instagram has tripled without a single ad.",
      },
    ],
    metrics: [
      { value: "12", label: "Chalkboards traced for the wordmark" },
      { value: "4 weeks", label: "From brief to printed packaging" },
      { value: "3,184", label: "Bags returned for reuse, six months in" },
      { value: "+214%", label: "Instagram following, post-launch" },
    ],
    ctaText: "See the packaging system",
    ctaUrl: "/work/padaria-paula/packaging",
    ctaVariant: "glow",
    ctaColorScheme: "neutral",
  },
};
