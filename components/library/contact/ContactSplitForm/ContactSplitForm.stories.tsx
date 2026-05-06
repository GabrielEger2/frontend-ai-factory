import type { Meta, StoryObj } from "@storybook/react";
import ContactSplitForm from "./index";

const meta: Meta<typeof ContactSplitForm> = {
  title: "Contact/ContactSplitForm",
  component: ContactSplitForm,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof ContactSplitForm>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** B2B SaaS — slide CTA, topic select, EU-residency hours */
export const SaasGeneralInquiry: Story = {
  args: {
    eyebrow: "Talk to us",
    headline: "We answer every message within one business day",
    description:
      "Most teams of 4-12 are better served self-serving from the dashboard. If you'd rather have a human walk you through the first deploy, we're around.",
    namePlaceholder: "Your full name",
    emailPlaceholder: "you@yourcompany.com",
    companyPlaceholder: "Company (optional)",
    topicLabel: "What's this about?",
    topicOptions: [
      "Sales — talk to a human",
      "Onboarding & implementation",
      "Billing or invoices",
      "Security review",
      "Press or partnerships",
    ],
    messagePlaceholder:
      "A few sentences about what you're trying to do. Stack and team size help.",
    submitText: "Send the message",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    consentText:
      "By sending this we'll add your email to our weekly product update. Unsubscribe anytime.",
    infoTitle: "Or reach us directly",
    phoneUrl: "tel:+551134127319",
    phoneText: "+55 11 3412-7319",
    emailUrl: "mailto:hello@northbeam.example",
    emailText: "hello@northbeam.example",
    whatsappUrl: "https://wa.me/5511994128213",
    whatsappText: "+55 11 99412-8213",
    addressText:
      "Av. Paulista 2073, conj. 1804\nBela Vista, São Paulo · 01311-300",
    addressMapsUrl: "https://maps.google.com/?q=Av+Paulista+2073",
    hours: [
      { label: "Mon – Thu", value: "09:00 – 19:00" },
      { label: "Fri", value: "09:00 – 17:00" },
      { label: "Sat – Sun", value: "Closed" },
    ],
    hoursNote: "All times América/São_Paulo (GMT-3).",
  },
};

/** Architecture studio — minimal, no topic select, drawOutline CTA */
export const ArchitectureStudio: Story = {
  args: {
    eyebrow: "Studio inquiries",
    headline: "Tell us about the project, the site, and the timeline",
    description:
      "We take on six projects a year. Tell us roughly when you're hoping to break ground and we'll let you know within four working days.",
    namePlaceholder: "Your name",
    emailPlaceholder: "Email",
    companyPlaceholder: "Project name",
    messagePlaceholder:
      "What's the site like? Floor area, intended use, timeline? Photos welcome via Drive link.",
    submitText: "Send the brief",
    ctaStyle: "drawOutline",
    ctaColorScheme: "primary",
    infoTitle: "Studio",
    emailUrl: "mailto:studio@parcelas.example",
    emailText: "studio@parcelas.example",
    addressText: "Rua Bela Cintra 1428\nConsolação, São Paulo",
    addressMapsUrl: "https://maps.google.com/?q=Rua+Bela+Cintra+1428",
    hours: [
      { label: "Tue – Fri", value: "10:00 – 18:00" },
      { label: "Mon", value: "By appointment" },
    ],
    hoursNote: "Saturdays reserved for site visits.",
  },
};

/** Legal practice — formal, dotExpand CTA, weekday hours, no WhatsApp */
export const LegalPractice: Story = {
  args: {
    eyebrow: "Confidential intake",
    headline: "Send a brief outline and we'll set up a fifteen-minute consult",
    description:
      "Initial consultations are confidential and free. We'll confirm fit (and conflicts) before scheduling a longer meeting.",
    namePlaceholder: "Full name",
    emailPlaceholder: "Email",
    companyPlaceholder: "Company or matter reference",
    topicLabel: "Practice area",
    topicOptions: [
      "Corporate / M&A",
      "Tax & advisory",
      "Litigation",
      "Labor & employment",
      "Other",
    ],
    messagePlaceholder:
      "A short outline — names omitted is fine for the first message.",
    submitText: "Request a consult",
    ctaStyle: "dotExpand",
    ctaColorScheme: "neutral",
    consentText:
      "Submitting does not create an attorney-client relationship. We'll confirm before opening a matter.",
    infoTitle: "Office",
    phoneUrl: "tel:+551141221180",
    phoneText: "+55 11 4122-1180",
    emailUrl: "mailto:intake@kosaka-tavares.example",
    emailText: "intake@kosaka-tavares.example",
    addressText:
      "Rua Tabapuã 1450, 9º andar\nItaim Bibi, São Paulo · 04533-004",
    addressMapsUrl: "https://maps.google.com/?q=Rua+Tabapua+1450",
    hours: [
      { label: "Mon – Fri", value: "09:00 – 18:00" },
      { label: "Sat – Sun", value: "Closed" },
    ],
  },
};

/** Multi-channel SaaS support — default CTA, includes WhatsApp */
export const MultiChannelSupport: Story = {
  args: {
    headline: "Pick a channel — we monitor all four",
    description:
      "Email and the form get a reply within 24 hours. WhatsApp is for urgent production issues and reaches an on-call engineer.",
    namePlaceholder: "Your name",
    emailPlaceholder: "Work email",
    topicLabel: "Channel",
    topicOptions: [
      "Account or billing",
      "Bug or production issue",
      "Feature request",
      "Security disclosure",
    ],
    messagePlaceholder:
      "What happened, what you tried, and (if a bug) the workspace ID.",
    submitText: "Send to support",
    ctaStyle: "default",
    ctaColorScheme: "primary",
    consentText: "We never share support tickets with third parties.",
    infoTitle: "Direct channels",
    phoneUrl: "tel:+18005553210",
    phoneText: "+1 (800) 555-3210",
    emailUrl: "mailto:support@caldera.example",
    emailText: "support@caldera.example",
    whatsappUrl: "https://wa.me/14155550129",
    whatsappText: "+1 415 555-0129 (urgent only)",
    addressText: "1148 Folsom St, Suite 400\nSan Francisco, CA 94103",
    addressMapsUrl: "https://maps.google.com/?q=1148+Folsom+SF",
    hours: [
      { label: "Mon – Fri", value: "08:00 – 20:00 PT" },
      { label: "Sat", value: "10:00 – 16:00 PT" },
      { label: "Sun", value: "On-call only" },
    ],
    hoursNote:
      "Production-down calls reach an on-call engineer regardless of hours.",
  },
};
