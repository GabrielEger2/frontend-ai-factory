import type { Meta, StoryObj } from "@storybook/react";
import ContactShapesForm from "./index";

const meta: Meta<typeof ContactShapesForm> = {
  title: "Contact/ContactShapesForm",
  component: ContactShapesForm,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaStyle: {
      control: "select",
      options: ["primary", "secondary", "ghost"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof ContactShapesForm>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Boutique architecture studio in Manhattan — flagship contact panel. */
export const ArchitectureStudio: Story = {
  args: {
    headline: "Contact Us",
    body: "You are always welcome to visit the studio. Our team is available Monday to Friday from 9:00 a.m. to 8:00 p.m. and weekends from 10:00 a.m. to 6:00 p.m. (GMT-5). We look forward to hearing about your project.",
    submitText: "Send Message",
    ctaStyle: "primary",
    mapImageUrl: "https://placehold.co/960x720?text=Manhattan+Studio",
    mapImageAlt: "Map showing the architecture studio location in Manhattan",
    locationLabel: "Manhattan",
    locationAddress: "245 W 14th St, New York, NY, USA",
  },
};

/** Independent dental clinic — appointment requests with a softer CTA. */
export const DentalClinic: Story = {
  args: {
    headline: "Book Your Visit",
    body: "First consultation is on us. Send a quick note and our front desk will confirm your appointment within one business day. We accept all major insurance plans.",
    namePlaceholder: "Your full name",
    emailPlaceholder: "Email or WhatsApp number",
    messagePlaceholder: "Tell us briefly what you need",
    submitText: "Request Appointment",
    ctaStyle: "secondary",
    mapImageUrl: "https://placehold.co/960x720?text=Brooklyn+Heights+Dental",
    mapImageAlt: "Map showing Brooklyn Heights Dental location",
    locationLabel: "Brooklyn Heights Dental",
    locationAddress: "110 Henry St, Brooklyn, NY 11201",
  },
};

/** Coastal restaurant — minimal copy and a quiet ghost CTA. */
export const CoastalRestaurant: Story = {
  args: {
    headline: "Reserve a Table",
    body: "Tasting menu service runs Wednesday through Sunday from 6:00 p.m. Drop us a line for private events, large parties, or off-menu dietary requests and we will reply the same evening.",
    namePlaceholder: "Guest name",
    emailPlaceholder: "Best email to confirm",
    messagePlaceholder: "Date, party size, occasion",
    submitText: "Send Reservation",
    ctaStyle: "ghost",
    mapImageUrl: "https://placehold.co/960x720?text=Half+Moon+Bay",
    mapImageAlt: "Map showing the restaurant on Half Moon Bay",
    locationLabel: "Sea Oat Kitchen",
    locationAddress: "82 Mirada Rd, Half Moon Bay, CA",
  },
};

/** SaaS onboarding team — embedded interactive map. */
export const SaasOnboarding: Story = {
  args: {
    headline: "Talk to Onboarding",
    body: "Our customer success squad pairs you with a dedicated specialist within two business hours. Share what you are migrating from and we will scope the rollout before the call.",
    namePlaceholder: "Work name",
    emailPlaceholder: "Work email",
    messagePlaceholder: "Current stack and timeline",
    submitText: "Schedule a Walkthrough",
    ctaStyle: "primary",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Austin,TX&output=embed",
    locationLabel: "Austin HQ",
    locationAddress: "600 Congress Ave, Austin, TX 78701",
  },
};

/** Local real estate agency — neighborhood office with no embed. */
export const RealEstateAgency: Story = {
  args: {
    headline: "Drop By the Office",
    body: "Open houses run every Saturday from 10:00 a.m. to 4:00 p.m. For private showings, send us your preferred neighborhoods and budget and one of our agents will follow up the same week.",
    namePlaceholder: "Your name",
    emailPlaceholder: "Email address",
    messagePlaceholder: "Neighborhoods and budget",
    submitText: "Get in Touch",
    ctaStyle: "secondary",
    mapImageUrl: "https://placehold.co/960x720?text=Sunset+District+Office",
    mapImageAlt: "Map showing the Sunset District office location",
    locationLabel: "Sunset District Office",
    locationAddress: "1840 Irving St, San Francisco, CA",
  },
};
