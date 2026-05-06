import type { Meta, StoryObj } from "@storybook/react";
import FaqTabbed from "./index";

const meta: Meta<typeof FaqTabbed> = {
  title: "FAQ/FaqTabbed",
  component: FaqTabbed,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof FaqTabbed>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** B2B SaaS — billing / privacy / onboarding */
export const SaasOnboarding: Story = {
  args: {
    headline: "Questions teams ask before they sign",
    subheadline:
      "Fourteen days of trial answer most of these. The rest live here so you don't have to chase your account team.",
    defaultCategoryIndex: 0,
    defaultOpenQuestionIndex: 0,
    categories: [
      {
        label: "Onboarding",
        description: "What the first two weeks actually look like.",
        questions: [
          {
            question: "How fast does a 25-person team get to production?",
            answer:
              "Most reach production by day eleven. We pair you with a solutions engineer for the first two weeks, included on every paid plan.",
          },
          {
            question: "Do you migrate from Notion, Airtable, or a CSV dump?",
            answer:
              "Yes — those three are first-class importers. For anything else, we write the migration script and run a dry-run before cutover.",
          },
          {
            question: "What does kickoff actually cover?",
            answer:
              "Goals for the first quarter, integrations you need on day one, and a written ownership checklist. Forty-five minutes, no slide deck.",
          },
        ],
      },
      {
        label: "Billing",
        description: "How seats, plans, and renewals actually work.",
        questions: [
          {
            question: "Can we change plans mid-cycle?",
            answer:
              "Anytime. Upgrades pro-rate the day you flip the switch; downgrades take effect at the next renewal so you don't lose paid days.",
          },
          {
            question: "What does volume pricing look like past 50 seats?",
            answer:
              "We publish a tiered table — 51-100 seats lose 12%, 101-250 lose 18%, 250+ are quoted by your account team within one business day.",
          },
        ],
      },
      {
        label: "Security",
        description: "Where your data lives and how it's protected.",
        questions: [
          {
            question: "Are you SOC 2 Type II?",
            answer:
              "Yes — current report dated 2025-11-12 is on the security portal. Quarterly pen tests; executive summaries are public.",
          },
          {
            question: "Can we pin data residency to the EU?",
            answer:
              "Available on Business and Enterprise. Pick Frankfurt or Stockholm at provisioning — traffic and backups never leave the chosen region.",
          },
        ],
      },
    ],
  },
};

/** Marketplace — sellers, buyers, and disputes */
export const MarketplaceTrust: Story = {
  args: {
    headline: "Marketplace policies, written like humans wrote them",
    subheadline:
      "Three quick segments. If you're new, start with the seller tab — most refund questions are buyer questions in disguise.",
    defaultCategoryIndex: 1,
    categories: [
      {
        label: "For sellers",
        questions: [
          {
            question: "How quickly do payouts hit my account?",
            answer:
              "Standard payouts arrive in three business days; express payouts arrive same-day for a 1.4% premium. Both ride on Stripe Express.",
          },
          {
            question: "What's the seller fee on a $94 order?",
            answer:
              "8.5% platform fee plus 2.9% + $0.30 payment processing — for a $94 sale that nets you about $83.21 after rounding.",
          },
        ],
      },
      {
        label: "For buyers",
        description:
          "Ordering, shipping, and what to do when something is off.",
        questions: [
          {
            question: "How long does shipping actually take?",
            answer:
              "Domestic: 4-7 business days for standard, 2 days for expedited. International: 9-14 days, sometimes longer when customs gets involved.",
          },
          {
            question: "What if the item arrives damaged?",
            answer:
              "Photograph it within 48 hours and open a dispute from the order page. Refunds for damaged goods clear in under 72 hours, on average.",
          },
          {
            question: "Are refunds automatic for late shipments?",
            answer:
              "Past the seller-promised date plus three business days, yes — the platform refunds shipping automatically and credits your card.",
          },
        ],
      },
      {
        label: "Disputes",
        questions: [
          {
            question: "Who decides a dispute when buyer and seller disagree?",
            answer:
              "A trust-and-safety reviewer assigned within 24 hours. We document the reasoning and share it with both parties before closing the case.",
          },
          {
            question: "Can I appeal a closed dispute?",
            answer:
              "One appeal per case, within seven days, with new evidence — tracking screenshots, chat logs, or a courier statement. Reviews take five days.",
          },
        ],
      },
    ],
  },
};

/** Fintech — compliance, fees, supported regions */
export const FintechCompliance: Story = {
  args: {
    headline: "What our compliance and finance ops teams ask first",
    subheadline:
      "Ordered the way procurement asks them. Skim the headers, expand only what matters to your review.",
    categories: [
      {
        label: "Compliance",
        description: "Audits, certifications, and the paper trail.",
        questions: [
          {
            question: "Are you a registered Money Services Business?",
            answer:
              "FinCEN MSB number 31000241647329, registered since March 2022. State licenses are listed on /licensing along with their expiration dates.",
          },
          {
            question: "How do you handle KYC for end-users?",
            answer:
              "Two-tier KYC: lightweight for sub-$1,000 monthly volume, full IDV (document + selfie liveness) above that. Onboarding clears in under 90 seconds for 92% of users.",
          },
          {
            question: "What's your AML monitoring stack?",
            answer:
              "Rules-based and ML-scored, reviewed by a 24x7 ops team. Average suspicious-activity report goes from flag to filed in 4.7 days.",
          },
        ],
      },
      {
        label: "Fees",
        questions: [
          {
            question: "What are the platform fees on a $50,000 transfer?",
            answer:
              "0.45% on the first $25,000 and 0.28% above that — total $182.50. FX spread is published live on /pricing and rebates 0.05% above $250k.",
          },
          {
            question: "Are there hidden FX markups?",
            answer:
              "No — we show the mid-market rate and our spread side by side at quote time. The number you accept is the number that settles.",
          },
        ],
      },
      {
        label: "Coverage",
        description: "Where you can send money today.",
        questions: [
          {
            question: "Which countries are you live in?",
            answer:
              "Live in 47 countries across North America, EMEA, and APAC. Brazil, Mexico, and India are the busiest corridors; SEPA covers all eurozone countries.",
          },
          {
            question: "Are you adding new countries?",
            answer:
              "Yes — Argentina, Egypt, and Vietnam are in licensing review for Q3 2026. Subscribe at /coverage to get an email the day a corridor opens.",
          },
        ],
      },
    ],
  },
};

/** Education platform — tabs reflect roles (students, teachers, admins) */
export const EduPlatformRoles: Story = {
  args: {
    headline: "Answers, sorted by who's asking",
    subheadline:
      "Pick the role that fits and skim. The platform answers the same question slightly differently for a student, a teacher, and an admin — that's the point.",
    categories: [
      {
        label: "Students",
        questions: [
          {
            question: "Will my progress sync across devices?",
            answer:
              "Yes — phone, tablet, and laptop stay in sync within about 12 seconds. Offline progress queues and posts when you reconnect.",
          },
          {
            question: "What happens if I miss a deadline?",
            answer:
              "Your teacher controls late policy. Default is 10% per day, capped at four days, then closed. You can ask for an extension from the assignment page.",
          },
        ],
      },
      {
        label: "Teachers",
        description: "Day-to-day tools and the gradebook.",
        questions: [
          {
            question: "How does the AI grading assist work?",
            answer:
              "It pre-scores short-answer and rubric-based work and shows the reasoning. You're always the final reviewer — nothing posts to a student until you publish.",
          },
          {
            question: "Can I import my old gradebook?",
            answer:
              "Yes — Google Classroom, Schoology, Canvas, and CSV are first-class. Two-click migration; we keep the original IDs for cross-system reconciliation.",
          },
          {
            question: "Does it work for combined-grade classrooms?",
            answer:
              "Yes — assign content per learner instead of per class. Pacing groups and stations are first-class concepts in the platform.",
          },
        ],
      },
      {
        label: "Administrators",
        description: "SSO, rostering, and district reports.",
        questions: [
          {
            question: "Do you support OneRoster 1.2 and Clever?",
            answer:
              "Both, plus SAML/SSO via Okta, Azure AD, and Google Workspace. SCIM provisioning is on every Enterprise district contract.",
          },
          {
            question: "What district-level reports come out of the box?",
            answer:
              "Engagement, mastery by standard, intervention impact, and a parent-communication digest. All exportable as CSV and Looker-ready Parquet.",
          },
        ],
      },
    ],
  },
};
