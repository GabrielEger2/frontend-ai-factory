import type { Meta, StoryObj } from "@storybook/react";
import StackedReveal from "./index";
import { CtaButton } from "@ui/button";
import { cn } from "@lib/utils";

const meta: Meta<typeof StackedReveal> = {
  title: "Wrappers/StackedReveal",
  component: StackedReveal,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    stickyTop: {
      control: { type: "range", min: 0, max: 96, step: 4 },
    },
    outgoingScale: {
      control: { type: "range", min: 0.7, max: 1, step: 0.02 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof StackedReveal>;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

interface StackedFeatureProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaText: string;
  ctaUrl: string;
  ctaVariant: "glow" | "slide" | "drawOutline";
  ctaColorScheme: "primary" | "secondary" | "accent";
  textTone?: "light" | "dark";
}

function StackedFeature({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  ctaText,
  ctaUrl,
  ctaVariant,
  ctaColorScheme,
  textTone = "dark",
}: StackedFeatureProps) {
  const muted = textTone === "light" ? "text-current/80" : "text-current/70";

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col items-center gap-10 px-8 md:flex-row md:gap-16">
      <div className="flex w-full flex-col items-start md:w-1/2">
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-widest",
            muted,
          )}
        >
          {eyebrow}
        </p>
        <h3 className="mb-5 text-3xl font-bold sm:text-4xl md:text-5xl">
          {title}
        </h3>
        <p className={cn("mb-8 max-w-md text-base md:text-lg", muted)}>
          {description}
        </p>
        <CtaButton
          variant={ctaVariant}
          colorScheme={ctaColorScheme}
          href={ctaUrl}
        >
          {ctaText}
        </CtaButton>
      </div>
      <div className="w-full md:w-1/2">
        <img
          src={image}
          alt={imageAlt}
          className="h-56 w-full rounded-2xl object-cover md:h-[420px]"
          loading="lazy"
        />
      </div>
    </div>
  );
}

interface QuotePanelProps {
  quote: string;
  author: string;
  role: string;
  textTone?: "light" | "dark";
}

function QuotePanel({
  quote,
  author,
  role,
  textTone = "dark",
}: QuotePanelProps) {
  const muted = textTone === "light" ? "text-current/70" : "text-current/60";
  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center gap-8 px-8 text-center">
      <p className="text-3xl font-medium leading-snug sm:text-4xl md:text-5xl">
        &ldquo;{quote}&rdquo;
      </p>
      <div>
        <p className="text-lg font-semibold">{author}</p>
        <p className={cn("text-sm", muted)}>{role}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Fintech product tour — three feature panels with images, slide CTA */
export const FintechProductTour: Story = {
  args: {
    headline: "A bank that grew up online",
    subheadline:
      "Three pillars of the new Nova platform — designed for small businesses that have outgrown personal banking but cannot afford the friction of legacy enterprise tools.",
    purpose: "features",
    panels: [
      {
        bgClass: "bg-primary text-primary-content",
        content: (
          <StackedFeature
            eyebrow="Pillar 01 — Banking"
            title="Real-time accounts, no monthly fees"
            description="Open a business checking account in under nine minutes with just an EIN and a government ID. Free domestic ACH, free wires up to ten per month, and a debit card that ships overnight to any U.S. address."
            image="https://placehold.co/640x460"
            imageAlt="Mobile banking app showing real-time transaction feed and account balance"
            ctaText="Open an account"
            ctaUrl="/banking"
            ctaVariant="slide"
            ctaColorScheme="primary"
            textTone="light"
          />
        ),
      },
      {
        bgClass: "bg-secondary text-secondary-content",
        content: (
          <StackedFeature
            eyebrow="Pillar 02 — Cards"
            title="Issue cards as fast as you onboard hires"
            description="Spin up virtual cards for every team member, every contractor, every recurring vendor — all with category-level spending controls, automated receipt capture, and direct sync to QuickBooks, Xero, or NetSuite."
            image="https://placehold.co/640x460"
            imageAlt="Corporate card management dashboard with employee cards and spending limits"
            ctaText="See card controls"
            ctaUrl="/cards"
            ctaVariant="slide"
            ctaColorScheme="primary"
            textTone="light"
          />
        ),
      },
      {
        bgClass: "bg-accent text-accent-content",
        content: (
          <StackedFeature
            eyebrow="Pillar 03 — Capital"
            title="Working capital without the dance"
            description="Apply for a line of credit in under three minutes using the cash flow data Nova already has. Approval decisions in under 48 hours, draws settled the same day, and rates that adjust as the business grows."
            image="https://placehold.co/640x460"
            imageAlt="Working capital application showing instant credit decision and rate breakdown"
            ctaText="Get pre-qualified"
            ctaUrl="/capital"
            ctaVariant="slide"
            ctaColorScheme="primary"
            textTone="light"
          />
        ),
      },
    ],
  },
};

/** Customer testimonials — four stacked quotes from category leaders, drawOutline CTA */
export const TestimonialStack: Story = {
  args: {
    headline: "Trusted by the teams setting the bar",
    subheadline:
      "Operators from category-defining companies on what changed after they adopted Atlas.",
    stickyTop: 48,
    outgoingScale: 0.94,
    purpose: "testimonials",
    panels: [
      {
        bgClass: "bg-base-200 text-base-content",
        content: (
          <QuotePanel
            quote="We cut our weekly forecast cycle from four hours of analyst time to twenty minutes of executive review. The trust in the numbers went up at the same time."
            author="Priya Anand"
            role="VP RevOps, Linear Robotics ($412M ARR)"
          />
        ),
      },
      {
        bgClass: "bg-neutral text-neutral-content",
        content: (
          <QuotePanel
            quote="Every operations leader I know has tried to build the dashboard Atlas ships out of the box. Most of us spent two years failing at it before we tried this."
            author="Marcus Tanaka"
            role="Head of Operations, Helio Health"
            textTone="light"
          />
        ),
      },
      {
        bgClass: "bg-primary text-primary-content",
        content: (
          <QuotePanel
            quote="The first quarter on Atlas was the first quarter in three years where the leadership team disagreed about strategy instead of disagreeing about whose numbers were right."
            author="Sofia Mendes"
            role="CFO, Pravus Insurance"
            textTone="light"
          />
        ),
      },
      {
        bgClass: "bg-base-100 text-base-content",
        content: (
          <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center gap-8 px-8 text-center">
            <h3 className="text-3xl font-bold sm:text-4xl md:text-5xl">
              Read the long-form case studies
            </h3>
            <p className="max-w-xl text-base text-base-content/70 md:text-lg">
              Each of these teams documented their migration in detail — tooling
              stack before and after, time-to-value, and the metrics their
              boards now ask about every quarter.
            </p>
            <CtaButton
              variant="drawOutline"
              colorScheme="accent"
              href="/case-studies"
            >
              Browse case studies
            </CtaButton>
          </div>
        ),
      },
    ],
  },
};

/** Editorial brand chapters — bold typography stacked over a hero image close, glow CTA */
export const EditorialChapters: Story = {
  args: {
    purpose: "brand-statement",
    stickyTop: 24,
    outgoingScale: 0.9,
    panels: [
      {
        bgClass: "bg-neutral text-neutral-content",
        content: (
          <div className="mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-70">
              Chapter one
            </p>
            <h3 className="text-5xl font-black sm:text-6xl md:text-7xl">
              Coffee was never supposed to be complicated.
            </h3>
            <p className="max-w-xl text-base opacity-80 md:text-lg">
              Twelve farms. One roastery. A subscription that ships the same
              week the beans come off the pulper. That is the entire model.
            </p>
          </div>
        ),
      },
      {
        bgClass: "bg-base-200 text-base-content",
        content: (
          <div className="mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-70">
              Chapter two
            </p>
            <h3 className="text-5xl font-black sm:text-6xl md:text-7xl">
              We pay growers four times the C-market rate.
            </h3>
            <p className="max-w-xl text-base opacity-70 md:text-lg">
              Direct contracts, three-year minimum durations, and a published
              price floor that adjusts annually with the local cost of living —
              published on every bag.
            </p>
          </div>
        ),
      },
      {
        bgClass: "bg-primary text-primary-content",
        content: (
          <div className="mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-70">
              Chapter three
            </p>
            <h3 className="text-5xl font-black sm:text-6xl md:text-7xl">
              Roasted Tuesday. On your doorstep Friday.
            </h3>
            <p className="max-w-xl text-base opacity-80 md:text-lg">
              No warehouse middle. No four-month-old beans. The week we roast is
              the week you brew, and the bag tells you exactly when it came off
              the drum.
            </p>
            <CtaButton variant="glow" colorScheme="secondary" href="/subscribe">
              Start the subscription
            </CtaButton>
          </div>
        ),
      },
    ],
  },
};
