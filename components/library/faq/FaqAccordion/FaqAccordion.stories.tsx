import type { Meta, StoryObj } from "@storybook/react";
import FaqAccordion from "./index";

const meta: Meta<typeof FaqAccordion> = {
  title: "FAQ/FaqAccordion",
  component: FaqAccordion,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    allowMultiple: { control: "boolean" },
    defaultOpenIndex: { control: "number" },
  },
};
export default meta;
type Story = StoryObj<typeof FaqAccordion>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS product — common customer questions about billing and features */
export const SaasProduct: Story = {
  args: {
    headline: "Frequently Asked Questions",
    subheadline:
      "Everything you need to know about our platform. Can't find an answer? Reach out to our support team.",
    defaultOpenIndex: 0,
    items: [
      {
        question: "How does the 14-day free trial work?",
        answer:
          "You get full access to all features for 14 days with no credit card required. At the end of your trial, choose a plan that fits your team size or continue with the free tier for up to 3 users.",
      },
      {
        question: "Can I switch plans after signing up?",
        answer:
          "Absolutely. You can upgrade or downgrade at any time from your account settings. When upgrading, you only pay the prorated difference for the remainder of your billing cycle.",
      },
      {
        question: "What happens to my data if I cancel?",
        answer:
          "Your data remains accessible for 30 days after cancellation. During that period you can export everything as CSV or JSON. After 30 days, all data is permanently deleted from our servers.",
      },
      {
        question:
          "Do you offer discounts for nonprofits or educational institutions?",
        answer:
          "Yes. Qualified nonprofits and accredited educational institutions receive 50% off any paid plan. Contact our sales team with proof of status to activate the discount.",
      },
      {
        question: "Is my data encrypted and secure?",
        answer:
          "All data is encrypted at rest with AES-256 and in transit with TLS 1.3. We undergo annual SOC 2 Type II audits and maintain GDPR compliance for European customers.",
      },
    ],
  },
};

/** Legal services firm — questions clients ask before hiring */
export const LegalServices: Story = {
  args: {
    headline: "What Our Clients Want to Know",
    subheadline:
      "We believe transparency builds trust. Here are the questions we hear most often.",
    items: [
      {
        question: "How are your fees structured?",
        answer:
          "We offer both hourly billing and flat-fee arrangements depending on the nature of your case. During our initial consultation, we provide a clear estimate so there are no surprises.",
      },
      {
        question: "How long does a typical case take to resolve?",
        answer:
          "Timelines vary significantly by case type. A straightforward contract review may take 2-3 business days, while litigation can span 6 to 18 months. We set realistic expectations from day one.",
      },
      {
        question: "Do you handle cases outside your listed practice areas?",
        answer:
          "If your matter falls outside our core expertise, we will refer you to a trusted colleague in our professional network. We would rather connect you with the right specialist than take on a case we cannot serve well.",
      },
      {
        question: "What should I bring to my first consultation?",
        answer:
          "Bring any relevant documents — contracts, correspondence, court filings — along with a written timeline of key events. The more context we have upfront, the more productive our first meeting will be.",
      },
    ],
  },
};

/** Fitness studio — membership and class questions with multiple open */
export const FitnessStudio: Story = {
  args: {
    headline: "Got Questions? We Have Answers",
    allowMultiple: true,
    items: [
      {
        question: "What should I wear to my first class?",
        answer:
          "Comfortable athletic clothing and clean indoor shoes. We provide towels and filtered water stations in every studio. Lockers with combination locks are available at no extra charge.",
      },
      {
        question: "Can I freeze my membership if I travel often?",
        answer:
          "Members on quarterly or annual plans can freeze for up to 60 days per year at no cost. Simply submit a freeze request through the app at least 48 hours before your next billing date.",
      },
      {
        question: "Do I need prior experience for advanced classes?",
        answer:
          "Advanced classes require completion of at least four foundational sessions in the same discipline. Your instructor will assess your readiness and may recommend additional prep if needed.",
      },
      {
        question: "Are there family or group discounts available?",
        answer:
          "Households of two or more receive 15% off each membership. Corporate partnerships start at groups of five with up to 25% savings. Ask the front desk for a custom quote.",
      },
      {
        question: "What is your cancellation policy?",
        answer:
          "Monthly memberships can be cancelled anytime with 30 days notice. Annual memberships are eligible for a prorated refund during the first 90 days. No cancellation fees ever.",
      },
    ],
  },
};
