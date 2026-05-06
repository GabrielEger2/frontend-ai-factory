import type { Meta, StoryObj } from "@storybook/react";
import ContactMultiStep from "./index";

const meta: Meta<typeof ContactMultiStep> = {
  title: "Contact/ContactMultiStep",
  component: ContactMultiStep,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaStyle: {
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
    collectCompany: { control: "boolean" },
    collectPhone: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof ContactMultiStep>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** B2B SaaS — sales / support / partnerships / careers routing */
export const SaasMultiDepartment: Story = {
  args: {
    eyebrow: "Get in touch",
    headline: "Tell us where this should go — we'll do the rest",
    description:
      "Three quick steps. Picking a destination first means your note lands in the right inbox without a triage round-trip.",
    routes: [
      {
        id: "sales",
        label: "Sales",
        description: "Pricing, demo, procurement.",
        icon: "briefcase",
        nextStepEyebrow: "Sales inquiry",
        nextStepHeadline: "Who's evaluating us?",
      },
      {
        id: "support",
        label: "Support",
        description: "Bug, billing, or how-to question on a live account.",
        icon: "help",
        nextStepEyebrow: "Customer support",
        nextStepHeadline: "Help us find your account",
      },
      {
        id: "partnerships",
        label: "Partnerships",
        description: "Integrations, co-marketing, reseller programs.",
        icon: "handshake",
        nextStepEyebrow: "Partner team",
        nextStepHeadline: "Tell us about the partnership",
      },
      {
        id: "careers",
        label: "Careers",
        description: "Open roles or unsolicited application.",
        icon: "users",
        nextStepEyebrow: "Recruiting",
        nextStepHeadline: "Tell us about you",
      },
    ],
    submitText: "Send message",
    ctaStyle: "default",
    ctaColorScheme: "primary",
    consentText:
      "By sending you agree to our privacy policy. We'll never share your email outside the named team.",
  },
};

/** Real estate brokerage — buyer / seller / rental / agent-recruit */
export const RealEstateRouting: Story = {
  args: {
    eyebrow: "Falar connosco",
    headline: "Three quick steps — we'll route you to the right specialist",
    description:
      "Buying, selling, renting, or thinking about joining the brokerage. Pick the closest match and we'll connect you with the right agent within one business day.",
    routes: [
      {
        id: "buy",
        label: "I'm buying",
        description: "Looking for a home or investment property.",
        icon: "heart",
        nextStepEyebrow: "Buyer concierge",
        nextStepHeadline: "Tell us what you're looking for",
      },
      {
        id: "sell",
        label: "I'm selling",
        description: "Ready to list or want a valuation first.",
        icon: "briefcase",
        nextStepEyebrow: "Listing team",
        nextStepHeadline: "Tell us about the property",
      },
      {
        id: "rent",
        label: "I'm renting",
        description: "Long-term lease or short-stay rental.",
        icon: "user",
      },
      {
        id: "agent",
        label: "Joining the brokerage",
        description: "Talk to leadership about an agent seat.",
        icon: "users",
      },
    ],
    namePlaceholder: "Name and surname",
    emailPlaceholder: "name@example.com",
    phonePlaceholder: "+351 9XX XXX XXX",
    collectCompany: false,
    collectPhone: true,
    submitText: "Submit inquiry",
    ctaStyle: "slide",
    ctaColorScheme: "accent",
    consentText:
      "We'll only use your number to confirm the right agent — opt out any time.",
    successHeadline: "Recebido — obrigado",
    successDescription:
      "We'll have your dedicated agent reach out within one business day. Check your spam folder for the introduction email if you don't see it by tomorrow morning.",
  },
};

/** Healthcare clinic — appointment / question / billing / records request */
export const ClinicIntake: Story = {
  args: {
    eyebrow: "Patient services",
    headline: "Reach the right desk in three steps",
    description:
      "Appointment requests go to scheduling; clinical questions to nursing; billing and records to administration. Tell us which one you need.",
    routes: [
      {
        id: "appointment",
        label: "Book an appointment",
        description: "New patient or follow-up scheduling.",
        icon: "phone",
        nextStepEyebrow: "Scheduling desk",
        nextStepHeadline: "When works for you?",
      },
      {
        id: "clinical",
        label: "Clinical question",
        description: "Symptoms or follow-up question for a nurse.",
        icon: "help",
        nextStepEyebrow: "Nursing line",
        nextStepHeadline: "Tell us about the patient",
      },
      {
        id: "billing",
        label: "Billing or insurance",
        description: "Statements, claims, copays.",
        icon: "briefcase",
        nextStepEyebrow: "Billing team",
        nextStepHeadline: "Account details",
      },
      {
        id: "records",
        label: "Medical records request",
        description: "Release of records to another provider.",
        icon: "mail",
      },
    ],
    namePlaceholder: "Patient or guardian name",
    emailPlaceholder: "name@example.com",
    phonePlaceholder: "(555) 000-0000",
    collectCompany: false,
    collectPhone: true,
    submitText: "Send request",
    ctaStyle: "default",
    ctaColorScheme: "neutral",
    stepLabels: ["Reason", "Patient", "Details"],
    consentText:
      "Your message is encrypted and stored only in our HIPAA-aligned patient inbox. Never use this form for emergencies — call 911.",
    successHeadline: "Request received",
    successDescription:
      "Our patient services team will respond within one business day. For urgent clinical concerns, please call our 24-hour nurse line at (+1) 555-CARE.",
  },
};

/** Boutique agency — new project / existing client / press / job inquiry */
export const AgencyProjectInquiry: Story = {
  args: {
    eyebrow: "Start a conversation",
    headline:
      "We work with about a dozen clients a year — let's see if we're a fit",
    description:
      "Three steps. Pick the path, share who you are, and tell us what's on your mind. We read every note ourselves and reply within two business days.",
    routes: [
      {
        id: "new-project",
        label: "New project inquiry",
        description: "Brand, identity, or full website engagement.",
        icon: "zap",
        nextStepEyebrow: "Project intake",
        nextStepHeadline: "Tell us about the company",
      },
      {
        id: "existing",
        label: "Existing client",
        description: "Add scope or revisit an active engagement.",
        icon: "heart",
      },
      {
        id: "press",
        label: "Press inquiry",
        description: "Interviews, speaking, podcast appearances.",
        icon: "mail",
      },
    ],
    namePlaceholder: "First and last",
    emailPlaceholder: "you@company.com",
    companyPlaceholder: "Company name",
    collectCompany: true,
    collectPhone: false,
    submitText: "Send the brief",
    ctaStyle: "drawOutline",
    ctaColorScheme: "primary",
    stepLabels: ["Path", "About you", "Brief"],
    successHeadline: "Got it — thank you",
    successDescription:
      "Expect a personal reply from one of the partners within two business days. If we think there's a fit, we'll suggest a 30-minute scoping call.",
  },
};

/** Compact partnership form — only two routes, no extra fields */
export const PartnershipsCompact: Story = {
  args: {
    eyebrow: "Partner with us",
    headline: "Two paths — pick the one that matches what you have in mind",
    description:
      "Most partnership conversations fall into one of two buckets. Tell us which, give us a one-paragraph context, and we'll route from there.",
    routes: [
      {
        id: "tech",
        label: "Technology partnership",
        description: "Integrations, APIs, joint product surface.",
        icon: "zap",
        nextStepEyebrow: "Integrations team",
        nextStepHeadline: "Tell us about the integration idea",
      },
      {
        id: "channel",
        label: "Reseller or channel",
        description: "Resell, refer, or co-market our platform.",
        icon: "handshake",
        nextStepEyebrow: "Channel team",
        nextStepHeadline: "Tell us about your customer base",
      },
    ],
    namePlaceholder: "Your name",
    emailPlaceholder: "name@partner.com",
    companyPlaceholder: "Partner company",
    collectCompany: true,
    collectPhone: false,
    submitText: "Send to partnerships",
    ctaStyle: "glow",
    ctaColorScheme: "secondary",
    stepLabels: ["Path", "About you", "Context"],
    consentText:
      "We'll keep your note inside the partnerships team. No sales follow-up without your say-so.",
  },
};
