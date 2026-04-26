import type { Meta, StoryObj } from "@storybook/react";
import EditorialFramedSplit from "./index";

const meta: Meta<typeof EditorialFramedSplit> = {
  title: "Layouts/Split/EditorialFramedSplit",
  component: EditorialFramedSplit,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaVariant: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof EditorialFramedSplit>;

export const ArchitectureStudio: Story = {
  args: {
    eyebrow: "Our Practice",
    headline: "From Inspiration to Reality",
    highlightWord: "Reality",
    ctaText: "Read More",
    ctaUrl: "#story",
    leadImage: "https://placehold.co/720x900",
    leadImageAlt: "Architect sketching plans at a sunlit drafting desk",
    secondaryImage: "https://placehold.co/720x540",
    secondaryImageAlt: "Two designers reviewing a notebook of hand-drawn floor plans",
    supportingHeadline: "Customized Functionality",
    supportingBody:
      "Our depth in residential trends, two decades of joinery experience, and quiet obsession with how a home actually lives day to day are what turn a brief into a place that fits its owners.",
    ctaVariant: "default",
    ctaColorScheme: "neutral",
  },
};

export const HeritageWinery: Story = {
  args: {
    eyebrow: "Estate & Vineyard",
    headline: "Three Generations, One Hillside",
    highlightWord: "Hillside",
    ctaText: "Visit the Estate",
    ctaUrl: "/estate",
    leadImage: "https://placehold.co/720x900",
    leadImageAlt: "Vineyard rows climbing a sunlit hillside at golden hour",
    secondaryImage: "https://placehold.co/720x540",
    secondaryImageAlt: "Cellar master pouring a barrel sample into a tasting glass",
    supportingHeadline: "Single-Vineyard Expression",
    supportingBody:
      "Every cuvee carries the soil it grew in. We bottle each block separately so you taste a specific year, a specific slope, and the patience of a family that has not been in a hurry since 1962.",
    ctaVariant: "slide",
    ctaColorScheme: "primary",
  },
};

export const BoutiqueFurniture: Story = {
  args: {
    eyebrow: "Workshop",
    headline: "Handmade Pieces, Built to Outlast Trends",
    highlightWord: "Outlast",
    ctaText: "Browse the Catalogue",
    ctaUrl: "/catalogue",
    leadImage: "https://placehold.co/720x900",
    leadImageAlt: "Cabinetmaker planing a long oak board in a daylit workshop",
    secondaryImage: "https://placehold.co/720x540",
    secondaryImageAlt: "Detail shot of a hand-cut dovetail joint",
    supportingHeadline: "Sourced, Cut, Joined Under One Roof",
    supportingBody:
      "We mill our own boards, dry them slowly, and finish each piece by hand. Nothing leaves the workshop until it could pass for a fifty-year-old heirloom on the day of delivery.",
    ctaVariant: "drawOutline",
    ctaColorScheme: "neutral",
  },
};

export const PrivateMedicalClinic: Story = {
  args: {
    eyebrow: "Whole-Person Care",
    headline: "Medicine That Listens Before It Prescribes",
    highlightWord: "Listens",
    ctaText: "Book a Consultation",
    ctaUrl: "/book",
    leadImage: "https://placehold.co/720x900",
    leadImageAlt: "Physician taking notes during an unhurried consultation with a patient",
    secondaryImage: "https://placehold.co/720x540",
    secondaryImageAlt: "Calm waiting lounge with linen seating and warm wood detailing",
    supportingHeadline: "Forty-Five Minute Appointments",
    supportingBody:
      "Our consultations run nearly four times the national average because the questions that matter rarely surface in the first ten minutes. We design every part of the visit around having time to actually think.",
    ctaVariant: "glow",
    ctaColorScheme: "accent",
  },
};

export const CoastalRealEstate: Story = {
  args: {
    eyebrow: "Properties",
    headline: "Homes That Catch the First Light of the Bay",
    highlightWord: "First Light",
    ctaText: "View Listings",
    ctaUrl: "/listings",
    leadImage: "https://placehold.co/720x900",
    leadImageAlt: "Modern coastal home glowing under early morning sun, water in the distance",
    secondaryImage: "https://placehold.co/720x540",
    secondaryImageAlt: "Open-plan kitchen and living room facing floor-to-ceiling windows",
    supportingHeadline: "Local Knowledge, Quiet Process",
    supportingBody:
      "We list fewer properties on purpose. Each one gets a tailored campaign, professional staging, and an agent who has actually walked the neighborhood at sunrise. No mass mailers, no pressure tours.",
    ctaVariant: "dotExpand",
    ctaColorScheme: "primary",
  },
};
