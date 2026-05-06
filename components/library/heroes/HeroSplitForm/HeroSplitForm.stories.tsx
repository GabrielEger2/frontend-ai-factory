import type { Meta, StoryObj } from "@storybook/react";
import HeroSplitForm from "./index";

const meta: Meta<typeof HeroSplitForm> = {
  title: "Heroes/HeroSplitForm",
  component: HeroSplitForm,
  parameters: { layout: "fullscreen" },
  argTypes: {
    submitColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    tone: { control: "select", options: ["light", "muted", "accent"] },
  },
};
export default meta;
type Story = StoryObj<typeof HeroSplitForm>;

/** B2B SaaS demo request — full form, four trust bullets */
export const SaasDemoRequest: Story = {
  args: {
    eyebrow: "Trusted by 384 mid-market sales teams",
    headline:
      "Reconcile your forecast and your CRM in the eight minutes before a Monday standup.",
    subheadline:
      "Lift turns the messy parts of pipeline management — split deals, mid-quarter coaching, partner attribution — into a single workflow your reps will actually keep open.",
    trustBullets: [
      { label: "SOC 2 Type II — renewed Apr 2026" },
      { label: "Implementation in 3 weeks" },
      { label: "Native Salesforce + HubSpot" },
      { label: "47.2% avg pipeline-coverage lift" },
    ],
    formTitle: "Book a working demo",
    formSubtitle:
      "Thirty minutes with a senior solutions engineer. We come prepared with a tailored agenda for your team.",
    namePlaceholder: "Full name",
    emailPlaceholder: "Work email",
    phonePlaceholder: "Direct line (optional)",
    submitText: "Request a demo",
    submitColorScheme: "primary",
    disclaimer:
      "We respond inside one business day. We will never sell, share, or rent your contact information. Read our privacy notice for the full policy.",
    tone: "muted",
  },
};

/** Financial advisor consultation — accent palette, two trust bullets, no phone */
export const FinancialAdvisor: Story = {
  args: {
    eyebrow: "Independent · fiduciary · fee-only",
    headline:
      "Plan the next twenty years of money decisions with someone who has no incentive to sell you a product.",
    subheadline:
      "We are a small fiduciary practice in Curitiba serving forty-eight families across Brazil and Portugal. We accept twelve new clients a year, and the consult is always free.",
    trustBullets: [
      { label: "CVM-registered AAI · 17 years" },
      { label: "Fee-only · zero commission" },
    ],
    formTitle: "Schedule a free consult",
    formSubtitle:
      "Forty-five minutes by video. No prep required — bring whatever questions you have.",
    namePlaceholder: "Your full name",
    emailPlaceholder: "Best email",
    submitText: "Book the consult",
    submitColorScheme: "accent",
    disclaimer:
      "Consults are confidential. After the call you decide if you want a written plan, ongoing planning, or no further contact.",
    tone: "accent",
  },
};

/** Newsletter signup — minimal, no phone, no name, neutral submit, light tone */
export const NewsletterSignup: Story = {
  args: {
    eyebrow: "Weekly · saturday morning · 4 minute read",
    headline:
      "A short letter on the small businesses quietly figuring out the rest of this decade.",
    subheadline:
      "I write to 8,724 readers about food, hospitality, and slow consumer goods. One story, one number, one thing I changed my mind about. Always free, never sponsored.",
    trustBullets: [
      { label: "Unsubscribe in one click" },
      { label: "No tracking pixels" },
      { label: "Three years, never missed a saturday" },
    ],
    formTitle: "Saturday letter",
    formSubtitle: "First letter arrives in the next 24 hours.",
    emailPlaceholder: "your-best-address@email.com",
    submitText: "Subscribe — free",
    submitColorScheme: "neutral",
    tone: "light",
  },
};

/** Online course waitlist — playful, full form, accent CTA */
export const CourseWaitlist: Story = {
  args: {
    eyebrow: "Cohort 11 — opens 14 october",
    headline:
      "Twelve weeks of slow editing for working photographers who want to look at fewer photographs at a time.",
    subheadline:
      "A small mentorship from Beatriz Okazaki and Andre Gomes. Three editors review every submission. We close every cohort with a short printed zine, which we mail to every student worldwide.",
    trustBullets: [
      { label: "Three editors · live critique" },
      { label: "Printed zine for every student" },
      { label: "184 alumni across 27 countries" },
    ],
    formTitle: "Join the cohort 11 waitlist",
    formSubtitle:
      "Spots fill from the waitlist in the order requests arrive. Late September.",
    namePlaceholder: "First and last name",
    emailPlaceholder: "Email you actually read",
    phonePlaceholder: "WhatsApp (optional, for cohort group)",
    submitText: "Save my spot",
    submitColorScheme: "accent",
    disclaimer:
      "Tuition is R$ 1,847 paid in three installments. Sliding-scale spots reserved for students from Latin America and the Lusophone world.",
    successHeadline: "You're on the list.",
    successBody:
      "Cohort invitations go out in two waves on the fourteenth and the twentieth. Watch for an email from beatriz@studio.example.",
    tone: "muted",
  },
};

/** Enterprise security RFP — corporate, secondary submit, name + email only */
export const EnterpriseSecurityRfp: Story = {
  args: {
    eyebrow: "For security and platform teams · 200+ engineers",
    headline:
      "Talk to an engineer about your runtime threat model in plain English.",
    subheadline:
      "Cordial is a runtime detection platform built specifically for teams already running their own SIEM. We review your existing stack, identify gaps, and tell you honestly whether we are a fit.",
    trustBullets: [
      { label: "ISO 27001 + SOC 2 + FedRAMP Moderate" },
      { label: "Customer engineers, no SDRs" },
      { label: "Avg pilot-to-prod: 6.4 weeks" },
    ],
    formTitle: "Request a technical review",
    formSubtitle:
      "We respond within four business hours from the security engineering team in Toronto.",
    namePlaceholder: "Full name and title",
    emailPlaceholder: "Work email (.com / .gov / .org)",
    submitText: "Schedule the review",
    submitColorScheme: "secondary",
    disclaimer:
      "Submissions are routed to a named engineer; no inside sales involvement. We sign mutual NDA before the call if your procurement requires it.",
    tone: "muted",
  },
};
