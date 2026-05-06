import type { Meta, StoryObj } from "@storybook/react";
import FaqCategorized from "./index";

const meta: Meta<typeof FaqCategorized> = {
  title: "FAQ/FaqCategorized",
  component: FaqCategorized,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    defaultCategoryIndex: { control: "number" },
    defaultOpenQuestionIndex: { control: "number" },
  },
};
export default meta;
type Story = StoryObj<typeof FaqCategorized>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** B2B SaaS help center — billing, security, and implementation buckets. */
export const SaasHelpCenter: Story = {
  args: {
    headline: "How can we help?",
    subheadline:
      "Pick a topic on the left to jump to the questions our customers ask most often during evaluation and rollout.",
    defaultCategoryIndex: 0,
    defaultOpenQuestionIndex: 0,
    categories: [
      {
        label: "Implementation",
        description: "What the first 30 days actually look like.",
        questions: [
          {
            question: "How long does setup take for a 40-person team?",
            answer:
              "Most 30-50 person teams are running production workflows by day five. We schedule a 45-minute kickoff, configure SSO together, and pair you with a solutions engineer for the first two weeks at no extra cost.",
          },
          {
            question: "Do you migrate our existing data?",
            answer:
              "Yes — CSV, Postgres, Airtable, Notion, and Linear are first-class importers. Anything else, our team writes the importer for you and runs a dry-run before cutover so we never push half-migrated data into your live workspace.",
          },
          {
            question: "Can we sandbox a pilot before company-wide rollout?",
            answer:
              "Pilot workspaces are included on every Business and Enterprise plan. Most customers run a 4-week pilot with one team before flipping the switch — we transfer all pilot data to the production workspace at rollout.",
          },
        ],
      },
      {
        label: "Billing & plans",
        description: "How seats, contracts, and renewals actually work.",
        questions: [
          {
            question: "Can we change plans mid-cycle?",
            answer:
              "Anytime. Upgrades pro-rate the day you flip the switch; downgrades take effect at the next renewal so you don't lose paid days. We also publish a written invoice preview before any plan change goes through.",
          },
          {
            question: "How does volume pricing work past 100 seats?",
            answer:
              "Public discounts apply automatically: 51-100 seats lose 12%, 101-250 lose 18%, 250+ get a written quote from your account team within one business day. We never use a hidden 'enterprise upcharge' — the public table is the floor.",
          },
          {
            question: "Do you offer multi-year contracts?",
            answer:
              "Two- and three-year terms unlock an additional 5% and 8% discount respectively, payable annually in advance. We include a price-lock for the full term so renewals never come with a surprise increase.",
          },
        ],
      },
      {
        label: "Security & compliance",
        description: "Where data lives and how we protect it.",
        questions: [
          {
            question: "Is the platform SOC 2 Type II certified?",
            answer:
              "Yes — current Type II report dated November 2025 is on the security portal. We undergo penetration testing each quarter and publish executive summaries to enterprise customers under NDA.",
          },
          {
            question: "Can we choose EU-only data residency?",
            answer:
              "Frankfurt and Stockholm regions are available on Business and Enterprise plans. Once selected at provisioning, your traffic, backups, and audit logs never leave the chosen region.",
          },
          {
            question: "How is access governed for admin users?",
            answer:
              "SCIM provisioning, SAML SSO, and role-based access are standard on Business. Enterprise adds IP allowlisting, fine-grained scopes, and a quarterly access-review export your IT team can attest in 15 minutes.",
          },
        ],
      },
      {
        label: "Integrations & API",
        description: "What ships in the box and what you can build.",
        questions: [
          {
            question: "Which integrations are native versus Zapier-only?",
            answer:
              "Slack, Notion, Linear, GitHub, Figma, and the Google and Microsoft suites are native — bidirectional and real-time. Everything else is reachable through Zapier, a documented webhooks layer, and a fully typed REST API.",
          },
          {
            question: "What's the rate limit on the public API?",
            answer:
              "Default is 600 requests per minute per token, burst up to 1,200 for 30 seconds. Enterprise contracts can request a custom ceiling — most go to 5,000 RPM, a few specialized customers run at 18,000.",
          },
          {
            question: "Do you sign outbound webhooks?",
            answer:
              "Every webhook is signed with HMAC-SHA256 using a secret you control. We also include a replay-protection timestamp; the example verifier in our docs handles both checks in under 15 lines of Node.",
          },
        ],
      },
    ],
  },
};

/** Boutique law firm — practice-area grouped client questions. */
export const LawFirmPracticeAreas: Story = {
  args: {
    headline: "Frequently asked, by practice area",
    subheadline:
      "Pick the area closest to your matter — every answer below comes from a real intake call we've had in the last twelve months.",
    categories: [
      {
        label: "Contract review",
        description: "Vendor agreements, MSAs, and customer paper.",
        questions: [
          {
            question: "How quickly can you turn a 20-page MSA?",
            answer:
              "Standard turnaround is 48 business hours for redlines on a typical SaaS or services MSA. Rush turnaround (same-day) is available at a 1.5x rate when our team has capacity — we'll quote both options on intake.",
          },
          {
            question: "Do you bill flat-fee or hourly for contract review?",
            answer:
              "Both. Most clients prefer flat-fee on standardized templates (NDAs, MSAs, DPAs) and hourly for negotiated counter-redlines. We commit to a flat-fee ceiling on hourly engagements when you want budget predictability.",
          },
        ],
      },
      {
        label: "Employment",
        description: "Hiring, separations, and handbooks.",
        questions: [
          {
            question:
              "Can you draft an offer letter and equity grant together?",
            answer:
              "Yes — we coordinate with your equity administrator (Carta, Pulley, etc.) so the grant agreement, offer letter, and 83(b) instructions all land at the candidate together. Standard turnaround is 3 business days.",
          },
          {
            question: "What does a separation agreement engagement cover?",
            answer:
              "We draft the separation agreement, advise on consideration period and ADEA compliance, prepare a tailored release tuned to the role, and (if needed) handle counsel-to-counsel negotiation with the departing employee's attorney.",
          },
          {
            question: "Do you write or audit employee handbooks?",
            answer:
              "Both. Audits are flat-fee and turn around in 7 business days for handbooks under 50 pages. New handbook builds are scoped after a 30-minute call about your headcount, jurisdictions, and existing policies.",
          },
        ],
      },
      {
        label: "Privacy & data",
        description: "DPAs, GDPR, and customer-facing privacy posture.",
        questions: [
          {
            question: "Can you review our customer DPA template?",
            answer:
              "Yes — we audit your existing template against the latest SCCs and the UK addendum, suggest jurisdiction-specific edits, and produce a redlined version plus a one-page summary for your sales team to use during negotiation.",
          },
          {
            question: "Do you handle vendor DPA negotiations on our behalf?",
            answer:
              "On retainer engagements we negotiate vendor DPAs as part of the regular procurement workflow — most close within 5 business days. One-off vendor reviews are quoted flat-fee and average $640 per agreement.",
          },
        ],
      },
      {
        label: "Disputes",
        description: "Pre-litigation and active matters.",
        questions: [
          {
            question: "When should we engage counsel on a payment dispute?",
            answer:
              "Earlier than most clients think — a written demand letter on firm letterhead resolves about 60% of payment disputes without ever filing. Send us the contract and the most recent communication thread; we'll triage within 24 hours.",
          },
          {
            question: "Do you litigate or refer out?",
            answer:
              "We handle pre-litigation and most contract disputes through arbitration. For complex commercial litigation we co-counsel with one of three trial firms we trust — you keep us as your primary point of contact through the matter.",
          },
        ],
      },
    ],
  },
};

/** University admissions — applicant-shaped buckets. */
export const UniversityAdmissions: Story = {
  args: {
    headline: "Admissions, in plain language",
    subheadline:
      "Browse by where you are in the process — most prospective students find their answer in under a minute here.",
    defaultCategoryIndex: 1,
    categories: [
      {
        label: "Before applying",
        description: "Eligibility, deadlines, and what to prepare.",
        questions: [
          {
            question: "Are international transcripts evaluated in-house?",
            answer:
              "Yes for institutions in our 47-country recognition list. For everywhere else, we accept WES, ECE, or IERF evaluations — and we cover the evaluation fee for applicants from our partner countries through the Global Access scholarship.",
          },
          {
            question: "Is the SAT or ACT required for the 2026 cycle?",
            answer:
              "Test-optional through the 2026 cycle. If you submit scores we'll consider them as one signal alongside your transcript, essays, and recommendations — never as a hard filter.",
          },
          {
            question: "When are the priority and final deadlines?",
            answer:
              "Priority deadline is November 15 (for the largest scholarship pool); final deadline is February 1. Late applications are reviewed on a rolling basis through April 15 if program seats remain.",
          },
        ],
      },
      {
        label: "Application & essays",
        description: "What we're actually reading for.",
        questions: [
          {
            question: "What length should the personal statement be?",
            answer:
              "650 words is the upper bound — we read every word. The strongest essays we admit average around 540 words and tell one specific story rather than summarizing a résumé.",
          },
          {
            question: "Do recommendation letters need to be from teachers?",
            answer:
              "Two letters from people who've supervised your academic or professional work in the last three years. Coaches, employers, and research mentors all qualify; we just ask that they speak to specific work, not generic character.",
          },
          {
            question: "Can I submit a creative supplement?",
            answer:
              "Yes — visual arts, music, writing samples, code repositories, and research papers are all accepted through SlideRoom. Submit only what you'd be comfortable being judged on; quantity over quality has no upside.",
          },
        ],
      },
      {
        label: "Tuition & aid",
        description: "Cost, scholarships, and financial aid timing.",
        questions: [
          {
            question:
              "What does total cost of attendance look like for 2026-27?",
            answer:
              "$58,420 in tuition plus $14,780 in room, board, and fees — roughly $73,200 sticker. After need- and merit-based aid, the median student pays $31,400 net. The full distribution is published in our annual aid transparency report.",
          },
          {
            question: "When are aid decisions sent out?",
            answer:
              "Aid offers are sent within 14 days of an admissions decision. If you're admitted in early action (December 12), your aid offer arrives by December 26 — never later than the start of the new year.",
          },
          {
            question: "Are merit scholarships renewable?",
            answer:
              "Yes — all merit scholarships are four-year renewable as long as you remain in good academic standing (GPA 3.0+). There's no separate renewal application and the dollar amount is locked at the original offer.",
          },
        ],
      },
    ],
  },
};
