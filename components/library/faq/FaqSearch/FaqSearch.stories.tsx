import type { Meta, StoryObj } from "@storybook/react";
import FaqSearch from "./index";

const meta: Meta<typeof FaqSearch> = {
  title: "FAQ/FaqSearch",
  component: FaqSearch,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    defaultOpenIndex: { control: "number" },
  },
};
export default meta;
type Story = StoryObj<typeof FaqSearch>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS help center — large library best navigated by typing a keyword. */
export const SaasHelpCenter: Story = {
  args: {
    headline: "How can we help?",
    subheadline:
      "Search the help center, or browse the most common questions our customers ask before signing up.",
    searchPlaceholder: "Try 'SSO setup' or 'export data'...",
    items: [
      {
        question: "How do I configure SAML SSO with Okta?",
        answer:
          "From the admin dashboard go to Security > SSO, paste your Okta metadata XML, and run the test connection. The first sign-in provisions the user automatically; subsequent ones are gated by your Okta group rules.",
        tags: ["sso", "saml", "okta", "security"],
      },
      {
        question: "Can I export workspace data as CSV?",
        answer:
          "Yes. Workspace owners can trigger an export from Settings > Data > Export. CSV, JSON, and Postgres dump formats are all supported, and exports over 1 GB are delivered as a signed S3 link valid for 72 hours.",
        tags: ["export", "csv", "data", "backup"],
      },
      {
        question: "What is the rate limit on the public API?",
        answer:
          "Default rate limit is 600 requests per minute per token, burst up to 1,200 for 30 seconds. Enterprise contracts can request a custom ceiling — most go to 5,000 RPM, a few specialized customers run at 18,000.",
        tags: ["api", "rate-limit", "developer"],
      },
      {
        question: "How do I rotate an API token without breaking integrations?",
        answer:
          "Generate the new token first, deploy it to your integration, then revoke the old one — both can coexist for up to 30 days. We also send a Slack and email reminder 7 days before any token's expiry.",
        tags: ["api", "token", "rotation", "security"],
      },
      {
        question: "Where are audit logs retained and for how long?",
        answer:
          "Audit logs live in the same region as your workspace. Retention is 90 days on Business, 18 months on Enterprise, and indefinite if you stream them to your own SIEM via the Splunk or Datadog connector.",
        tags: ["audit", "logs", "compliance", "retention"],
      },
      {
        question: "Can I restrict access by IP range?",
        answer:
          "IP allowlists are available on Business and Enterprise plans. You can attach a CIDR list to the whole workspace or to specific roles — for example, locking admin access to your office VPN while leaving member access open.",
        tags: ["security", "ip-allowlist", "access"],
      },
      {
        question: "How do I reassign an account if a teammate leaves?",
        answer:
          "Workspace owners can transfer ownership of any resource from Members > Offboard. Reassigning preserves the full history and audit trail, and the leaving user's session is invalidated within 60 seconds.",
        tags: ["offboarding", "members", "transfer"],
      },
      {
        question: "Do you support webhook signing?",
        answer:
          "Every outbound webhook is signed with HMAC-SHA256 using a secret you control. We also include a replay-protection timestamp; the example verifier in our docs handles both checks in under 15 lines of Node.",
        tags: ["webhooks", "security", "hmac"],
      },
    ],
  },
};

/** Real estate brokerage — buyer-side questions about offers and closing. */
export const RealEstateBrokerage: Story = {
  args: {
    headline: "Buyer questions, answered",
    subheadline:
      "Type a topic — earnest money, inspection, closing — and we'll surface the answers that come up in 9 out of 10 first calls.",
    searchPlaceholder: "Search closing, inspection, financing...",
    emptyStateText:
      "No matching answer yet. Send our team a note and we'll add it within a week.",
    defaultOpenIndex: 0,
    items: [
      {
        question: "How much earnest money should I put down on an offer?",
        answer:
          "In the Lisbon and Porto markets, 10% of the purchase price is standard for a winning offer; we've seen 5% accepted on slower listings and 15% on contested ones. Earnest is held in a notarial escrow account and credited to closing if the deal goes through.",
        tags: ["offer", "earnest", "escrow"],
      },
      {
        question: "What does a typical inspection contingency cover?",
        answer:
          "Structural, electrical, plumbing, and roof — plus thermal-bridge imaging on any unit older than 1980. We schedule the inspection within 5 business days of acceptance and you get the written report 48 hours later.",
        tags: ["inspection", "contingency", "due-diligence"],
      },
      {
        question: "How long is a typical closing timeline?",
        answer:
          "From accepted offer to keys-in-hand averages 47 days when the buyer is paying cash and 62 days when financing is involved. The two biggest variables are appraisal scheduling and the seller's title-clearance work.",
        tags: ["closing", "timeline", "financing"],
      },
      {
        question: "Are agent fees negotiable on the buy side?",
        answer:
          "Buyer-agent commission is paid by the seller through the listing agreement, so there's no out-of-pocket fee for you in 95% of transactions. The remaining 5% — usually for-sale-by-owner deals — we discuss the structure in writing before any showing.",
        tags: ["fees", "commission", "buyer-agent"],
      },
      {
        question: "Can I write an offer without a pre-approval letter?",
        answer:
          "Technically yes, but in this market a written offer without pre-approval is rejected almost on sight. We can introduce you to three lenders we trust who turn pre-approval around in 48 hours — no application fee.",
        tags: ["financing", "pre-approval", "offer"],
      },
      {
        question: "What happens if the appraisal comes in low?",
        answer:
          "You have three options: renegotiate the price down to the appraised value, cover the gap in cash, or walk and recover your earnest money under the financing contingency. We'll model all three in writing the same day the appraisal lands.",
        tags: ["appraisal", "financing", "contingency"],
      },
    ],
  },
};

/** Accounting firm — pre-engagement client questions. */
export const AccountingFirm: Story = {
  args: {
    headline: "Before we sign an engagement",
    subheadline:
      "Most prospective clients ask the same dozen questions before retaining us. Search by topic — fees, deadlines, audits — to find yours.",
    searchPlaceholder: "Try 'IRS audit' or 'monthly retainer'...",
    items: [
      {
        question: "How are your fees structured for ongoing bookkeeping?",
        answer:
          "Monthly retainer based on transaction volume and entity count. Most single-entity SMBs land between $640 and $1,180 per month, all-inclusive. We provide a written quote after a 30-minute discovery call — never a generic price-by-headcount table.",
        tags: ["fees", "retainer", "bookkeeping"],
      },
      {
        question: "What happens if the IRS opens an audit on a year you filed?",
        answer:
          "Audit defense is included for any return we prepared — we represent you, prepare every document, and attend any meetings. There's no separate audit-defense product upcharge, which is unusual in our category but we think the right default.",
        tags: ["audit", "irs", "defense"],
      },
      {
        question: "Do you handle multi-state and remote-employee filings?",
        answer:
          "Yes. We currently file in 38 states for our client base, including all the high-friction ones (CA, NY, IL, MA). Adding a new state is a one-time $215 setup plus the recurring monthly cost — no surprise add-ons during the year.",
        tags: ["state", "filing", "remote", "multi-state"],
      },
      {
        question: "When during the year should I switch firms?",
        answer:
          "August through October is ideal — gives us 90+ days to onboard before tax season. Switching mid-Q1 is possible but creates handoff risk; we'll be candid if we think you'd be better served waiting until April 16th.",
        tags: ["onboarding", "switching", "calendar"],
      },
      {
        question: "What software do you require us to use?",
        answer:
          "We work with QuickBooks Online, Xero, and NetSuite. If you're on desktop QuickBooks or Wave we can migrate you during onboarding — the migration itself is included in the first month's retainer.",
        tags: ["software", "quickbooks", "xero", "migration"],
      },
      {
        question: "How do you handle payroll and 1099 filings?",
        answer:
          "We integrate with Gusto, Rippling, and Justworks for full-cycle payroll. 1099s are prepared in early January with a January 18 owner-review window before we e-file with the IRS — every contractor gets their copy by January 25.",
        tags: ["payroll", "1099", "gusto"],
      },
    ],
  },
};
