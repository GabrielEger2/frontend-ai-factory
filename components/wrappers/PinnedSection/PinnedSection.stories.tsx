import type { Meta, StoryObj } from "@storybook/react";
import { FiCheck } from "react-icons/fi";
import PinnedSection from "./index";
import { CtaButton } from "@ui/button";

const meta: Meta<typeof PinnedSection> = {
  title: "Wrappers/PinnedSection",
  component: PinnedSection,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "150vh" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    pinnedSide: {
      control: { type: "select" },
      options: ["left", "right"],
    },
    stickyTop: {
      control: { type: "range", min: 0, max: 160, step: 8 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof PinnedSection>;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

interface FeatureBlockProps {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
}

function FeatureBlock({
  eyebrow,
  title,
  description,
  bullets,
}: FeatureBlockProps) {
  return (
    <div className="rounded-2xl bg-base-200 p-8 md:p-10">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-base-content/60">
        {eyebrow}
      </p>
      <h3 className="mb-4 text-2xl font-bold text-base-content md:text-3xl">
        {title}
      </h3>
      <p className="mb-6 text-base text-base-content/70">{description}</p>
      <ul className="space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-3">
            <FiCheck className="mt-1 shrink-0 text-primary" />
            <span className="text-sm text-base-content/80">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Product feature deep-dive — pinned mockup left, feature blocks right, slide CTA */
export const ProductFeatureDeepDive: Story = {
  args: {
    pinnedSide: "left",
    stickyTop: 96,
    purpose: "features",
    pinned: (
      <div className="overflow-hidden rounded-3xl bg-neutral p-8 shadow-2xl">
        <img
          src="https://placehold.co/720x520"
          alt="Product dashboard showing real-time analytics, pipeline status, and team activity feed"
          className="w-full rounded-xl"
          loading="lazy"
        />
        <div className="mt-6 flex items-center justify-between">
          <p className="text-neutral-content/80">
            Atlas Dashboard — live preview
          </p>
          <CtaButton variant="slide" colorScheme="primary" href="/demo">
            Launch demo
          </CtaButton>
        </div>
      </div>
    ),
    scrolling: (
      <div className="flex flex-col gap-8">
        <FeatureBlock
          eyebrow="Pipeline visibility"
          title="See every deal at every stage"
          description="The pipeline view consolidates every opportunity across every territory into a single live board. Filter by owner, segment, ARR band, or close date — your view, your team's view, the executive view, all from the same source of truth."
          bullets={[
            "Drag-and-drop stage transitions with audit logging",
            "Custom forecast categories scoped per business unit",
            "Inline activity feed showing emails, calls, and notes",
          ]}
        />
        <FeatureBlock
          eyebrow="Forecasting"
          title="Predict the quarter, not just the week"
          description="Our forecasting engine combines historical conversion rates with leading indicators — engagement scores, deal velocity, stage-skipping patterns — to surface forecast risk three months out, not three days out."
          bullets={[
            "Confidence intervals on every roll-up",
            "Scenario modeling for upside and downside cases",
            "Slack alerts when forecast deviates from plan",
          ]}
        />
        <FeatureBlock
          eyebrow="Team coaching"
          title="Spot coaching moments before QBRs"
          description="Every conversation is transcribed, scored against your call methodology, and summarized for managers. The weekly digest highlights reps who need coaching and which playbook patterns are converting."
          bullets={[
            "Methodology-aware scoring (MEDDPICC, BANT, custom)",
            "Auto-flagged objection handling and pricing moments",
            "One-click share to async coaching threads",
          ]}
        />
        <FeatureBlock
          eyebrow="Integrations"
          title="Plugs into the stack you already run"
          description="Bidirectional syncs with Salesforce, HubSpot, Outreach, Gong, Slack, and 60 more tools — no zaps, no middleware, no missing fields. Field-level sync rules let you pick exactly what flows where."
          bullets={[
            "Native Salesforce and HubSpot sync (no Zapier)",
            "Field-level mapping with conflict resolution",
            "Webhook events for everything else",
          ]}
        />
      </div>
    ),
  },
};

/** Founder profile — pinned portrait right, biography blocks left, drawOutline CTA */
export const FounderProfile: Story = {
  args: {
    pinnedSide: "right",
    stickyTop: 80,
    purpose: "about",
    pinned: (
      <div className="flex flex-col items-center text-center">
        <img
          src="https://placehold.co/520x680"
          alt="Portrait of founder Maria Costa standing in front of a brick wall"
          className="w-full max-w-sm rounded-3xl object-cover"
          loading="lazy"
        />
        <h3 className="mt-6 text-2xl font-bold text-base-content">
          Maria Costa
        </h3>
        <p className="text-base-content/60">Founder & CEO, Atlas</p>
        <CtaButton
          variant="drawOutline"
          colorScheme="accent"
          href="/team/maria"
        >
          Connect on LinkedIn
        </CtaButton>
      </div>
    ),
    scrolling: (
      <div className="flex flex-col gap-10">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-base-content/60">
            The early years
          </p>
          <h3 className="mb-4 text-2xl font-bold text-base-content md:text-3xl">
            From Lisbon engineering schools to Bay Area scale-ups
          </h3>
          <p className="text-base text-base-content/70 md:text-lg">
            Maria graduated from Instituto Superior Técnico in 2009 with a
            degree in computer engineering. After two years building trading
            systems for a Lisbon hedge fund, she moved to Mountain View to join
            an early-stage CRM startup as employee number eleven. By the time
            the company sold to Salesforce in 2017, she was running a 90-person
            engineering organization spread across three time zones.
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-base-content/60">
            Why she started Atlas
          </p>
          <h3 className="mb-4 text-2xl font-bold text-base-content md:text-3xl">
            The frustration that turned into a thesis
          </h3>
          <p className="text-base text-base-content/70 md:text-lg">
            In her last role, Maria sat through 47 quarterly business reviews in
            a single year. Every one of them opened with the same problem: the
            numbers in the deck did not match the numbers in the system. She
            started writing a memo about why operations data was so
            fundamentally broken — that memo became the founding investment
            thesis for Atlas, and the first hires were people who had cried at
            their own QBRs for the same reason.
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-base-content/60">
            How she leads
          </p>
          <h3 className="mb-4 text-2xl font-bold text-base-content md:text-3xl">
            A bias for the written word and the customer call
          </h3>
          <p className="text-base text-base-content/70 md:text-lg">
            Maria runs Atlas on a six-page memo cadence — every major decision
            starts as a written document, debated for a week, then committed in
            a meeting that ends in twenty minutes. She still takes four customer
            calls a week, every week, regardless of company stage. That habit
            shows up in the product roadmap more than any single executive
            feedback loop.
          </p>
        </div>
      </div>
    ),
  },
};

/** Long-form essay — pinned table-of-contents left, prose right, no CTA */
export const LongFormEssay: Story = {
  args: {
    pinnedSide: "left",
    stickyTop: 64,
    purpose: "story",
    pinned: (
      <nav className="rounded-2xl border border-base-300 bg-base-100 p-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-base-content/60">
          On this page
        </p>
        <ul className="space-y-3 text-base-content/80">
          <li className="border-l-2 border-primary pl-4 text-primary">
            1. The frame we kept getting wrong
          </li>
          <li className="border-l-2 border-base-300 pl-4 hover:text-base-content">
            2. What changed in 2023
          </li>
          <li className="border-l-2 border-base-300 pl-4 hover:text-base-content">
            3. The new constraints
          </li>
          <li className="border-l-2 border-base-300 pl-4 hover:text-base-content">
            4. What we ship next
          </li>
          <li className="border-l-2 border-base-300 pl-4 hover:text-base-content">
            5. An invitation to argue
          </li>
        </ul>
        <p className="mt-6 text-xs text-base-content/50">
          14 minute read · published Mar 2026
        </p>
      </nav>
    ),
    scrolling: (
      <article className="prose prose-lg max-w-none">
        <h2 className="text-3xl font-bold text-base-content md:text-4xl">
          The frame we kept getting wrong
        </h2>
        <p className="text-lg text-base-content/80">
          For five years our team treated the operations problem as a tooling
          problem. Buy the right CRM, layer the right BI tool on top, hire a
          revenue operations team to mediate between them — that was the
          orthodoxy, and we shipped product against it for the entire first
          chapter of the company.
        </p>
        <p className="text-lg text-base-content/80">
          The frame was wrong. It is now obvious it was wrong. It was wrong in a
          way that is easy to see in retrospect and was almost impossible to see
          at the time, because the symptom — better dashboards, faster reports,
          fewer manual exports — looked exactly like progress for as long as the
          underlying business kept growing.
        </p>
        <h2 className="mt-12 text-3xl font-bold text-base-content md:text-4xl">
          What changed in 2023
        </h2>
        <p className="text-lg text-base-content/80">
          What changed was the macro environment, and with it the patience our
          customers had for tools that delivered insight without delivering
          decisions. The 2023 customer conversations sounded different from the
          2022 ones in a single specific way: every operations leader we spoke
          to had been told to do more with a smaller team, and every one of them
          was looking at their tooling stack as a place to find that leverage.
        </p>
        <p className="text-lg text-base-content/80">
          The conversations made it impossible to keep shipping incremental
          dashboard improvements. We needed to ship a product that gave our
          customers their afternoons back — not a product that helped them spend
          their afternoons more efficiently inside the same dashboard.
        </p>
        <h2 className="mt-12 text-3xl font-bold text-base-content md:text-4xl">
          The new constraints
        </h2>
        <p className="text-lg text-base-content/80">
          The constraints we now ship against are explicit: any feature that
          shows the user a number must also show the user the next action that
          number suggests. Any workflow that requires the user to leave the tool
          to make a decision is incomplete. Any dashboard that requires
          interpretation by an analyst before a leader can act on it has failed
          at the only job that matters.
        </p>
        <p className="text-lg text-base-content/80">
          Those constraints have rewritten the roadmap, the hiring plan, and the
          org chart. They are also why we believe the next five years of this
          company will look almost nothing like the first five.
        </p>
      </article>
    ),
  },
};
