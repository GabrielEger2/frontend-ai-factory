import type { Meta, StoryObj } from "@storybook/react";
import HorizontalScroll from "./index";
import { CtaButton } from "@ui/button";
import { cn } from "@lib/utils";

const meta: Meta<typeof HorizontalScroll> = {
  title: "Wrappers/HorizontalScroll",
  component: HorizontalScroll,
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
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof HorizontalScroll>;

/* ------------------------------------------------------------------ */
/*  Shared panel layouts                                               */
/* ------------------------------------------------------------------ */

interface SplitPanelProps {
  eyebrow: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  ctaVariant: "glow" | "slide" | "drawOutline";
  ctaColorScheme: "primary" | "secondary" | "accent";
  image: string;
  imageAlt: string;
  bgClass?: string;
}

function SplitPanel({
  eyebrow,
  title,
  description,
  ctaText,
  ctaUrl,
  ctaVariant,
  ctaColorScheme,
  image,
  imageAlt,
  bgClass,
}: SplitPanelProps) {
  return (
    <div
      className={cn(
        "mx-auto flex h-full w-screen max-w-7xl flex-col items-center gap-10 px-8 md:flex-row md:gap-16",
        bgClass,
      )}
    >
      <div className="flex w-full flex-col items-start md:w-1/2">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-base-content/60">
          {eyebrow}
        </p>
        <h3 className="mb-5 text-4xl font-bold text-base-content sm:text-5xl md:text-6xl">
          {title}
        </h3>
        <p className="mb-8 max-w-md text-base text-base-content/70 md:text-lg">
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
          className="h-64 w-full rounded-2xl object-cover md:h-[440px]"
          loading="lazy"
        />
      </div>
    </div>
  );
}

interface BoldPanelProps {
  number: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  ctaVariant: "glow" | "slide" | "drawOutline";
  ctaColorScheme: "primary" | "secondary" | "accent";
  bgClass: string;
  textClass: string;
  mutedClass: string;
}

function BoldPanel({
  number,
  title,
  description,
  ctaText,
  ctaUrl,
  ctaVariant,
  ctaColorScheme,
  bgClass,
  textClass,
  mutedClass,
}: BoldPanelProps) {
  return (
    <div
      className={cn(
        "flex h-full w-screen flex-col items-center justify-center gap-6 px-8 text-center",
        bgClass,
      )}
    >
      <p className={cn("text-7xl font-black md:text-9xl", mutedClass)}>
        {number}
      </p>
      <h3
        className={cn(
          "max-w-3xl text-4xl font-bold sm:text-5xl md:text-6xl",
          textClass,
        )}
      >
        {title}
      </h3>
      <p className={cn("max-w-xl text-base md:text-lg", mutedClass)}>
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
  );
}

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Outdoor brand — image-led horizontal product story, slide CTA */
export const OutdoorBrandStory: Story = {
  args: {
    headline: "Built for the long route home",
    subheadline:
      "Three years of field testing across four continents went into the new winter line. Scroll sideways through the gear that earned the badge.",
    purpose: "showcase",
    panels: [
      {
        content: (
          <SplitPanel
            eyebrow="Layer 01 — Base"
            title="Merino that breathes through the climb"
            description="Hand-loomed New Zealand merino with a 17.5-micron count, finished in a flatlock seam pattern that disappears under a pack strap. Tested on a 6-day Patagonian traverse with zero hot spots reported."
            ctaText="Shop the base layer"
            ctaUrl="/products/merino-base"
            ctaVariant="slide"
            ctaColorScheme="primary"
            image="https://placehold.co/700x500"
            imageAlt="Hiker layering a merino base shirt at dawn camp"
          />
        ),
      },
      {
        content: (
          <SplitPanel
            eyebrow="Layer 02 — Insulation"
            title="A puffy that compresses to a coffee mug"
            description="800-fill responsibly-sourced down inside a 7-denier ripstop shell, baffled in vertical chambers to keep the warmth where it matters. Packs into its own chest pocket — fits inside the mesh side pocket of any 30L pack."
            ctaText="See the puffy"
            ctaUrl="/products/down-jacket"
            ctaVariant="slide"
            ctaColorScheme="primary"
            image="https://placehold.co/700x500"
            imageAlt="Compressed down jacket next to a stainless coffee mug for scale"
          />
        ),
      },
      {
        content: (
          <SplitPanel
            eyebrow="Layer 03 — Shell"
            title="A hardshell rated for a Scottish winter"
            description="3-layer Pertex Shield Pro membrane with fully taped seams and articulated elbows. Helmet-compatible hood, two-way pit zips, and a hem cinch you can adjust one-handed. Field-tested at 95mph on the Cairngorm plateau."
            ctaText="Explore the hardshell"
            ctaUrl="/products/storm-shell"
            ctaVariant="slide"
            ctaColorScheme="primary"
            image="https://placehold.co/700x500"
            imageAlt="Mountaineer in a hooded hardshell standing in a windswept landscape"
          />
        ),
      },
    ],
  },
};

/** Editorial agency — bold typographic chapters, drawOutline CTA */
export const EditorialChapters: Story = {
  args: {
    headline: "How a brand becomes a verb",
    subheadline:
      "We rebuilt three category-defining brands in 18 months. Here is the playbook in three chapters.",
    purpose: "story",
    panels: [
      {
        content: (
          <BoldPanel
            number="01"
            title="Find the noun nobody owns"
            description="Every breakthrough brand starts by claiming a word the category has left unattended. We spend the first four weeks listening for it — in customer transcripts, in support tickets, in the language sales teams use when they think nobody is recording."
            ctaText="Read chapter one"
            ctaUrl="/playbook/chapter-1"
            ctaVariant="drawOutline"
            ctaColorScheme="accent"
            bgClass="bg-base-200"
            textClass="text-base-content"
            mutedClass="text-base-content/60"
          />
        ),
      },
      {
        content: (
          <BoldPanel
            number="02"
            title="Repeat it until the world catches up"
            description="A brand becomes a verb through obsessive repetition — same word, same posture, same point of view, across every surface for at least 18 months. The temptation to vary the message is the single biggest reason most rebrands fail."
            ctaText="Read chapter two"
            ctaUrl="/playbook/chapter-2"
            ctaVariant="drawOutline"
            ctaColorScheme="accent"
            bgClass="bg-neutral"
            textClass="text-neutral-content"
            mutedClass="text-neutral-content/70"
          />
        ),
      },
      {
        content: (
          <BoldPanel
            number="03"
            title="Defend it like a copyright"
            description="Once the word is yours, the work is keeping it. We audit every campaign, every job description, every onboarding deck for drift — because the day the brand starts sounding like its competitors is the day the equity starts decaying."
            ctaText="Read chapter three"
            ctaUrl="/playbook/chapter-3"
            ctaVariant="drawOutline"
            ctaColorScheme="accent"
            bgClass="bg-primary"
            textClass="text-primary-content"
            mutedClass="text-primary-content/80"
          />
        ),
      },
    ],
  },
};

/** Conference recap — four-panel highlights reel, glow CTA, no header */
export const ConferenceRecap: Story = {
  args: {
    purpose: "showcase",
    panels: [
      {
        content: (
          <BoldPanel
            number="Day 1"
            title="2,400 builders in one warehouse"
            description="Doors opened at 8am to a line wrapped twice around the block. The keynote stage seated 1,800; the overflow rooms ran the live feed for everyone else. By lunch, the attendee Slack had crossed 12,000 messages."
            ctaText="Watch day one"
            ctaUrl="/conference/day-1"
            ctaVariant="glow"
            ctaColorScheme="secondary"
            bgClass="bg-secondary"
            textClass="text-secondary-content"
            mutedClass="text-secondary-content/80"
          />
        ),
      },
      {
        content: (
          <BoldPanel
            number="Day 2"
            title="Workshop tracks, full to capacity"
            description="Sixteen workshops ran in parallel — TypeScript at scale, Postgres tuning, design systems for AI products. Every room hit capacity within ten minutes of opening, so we recorded everything for the on-demand library."
            ctaText="Browse workshops"
            ctaUrl="/conference/day-2"
            ctaVariant="glow"
            ctaColorScheme="secondary"
            bgClass="bg-base-100"
            textClass="text-base-content"
            mutedClass="text-base-content/70"
          />
        ),
      },
      {
        content: (
          <BoldPanel
            number="Day 3"
            title="Demo day on the main stage"
            description="Twenty-four founder demos, each capped at four minutes, judged by a panel of operators and investors. The winner — a developer-tooling startup from Lisbon — closed a seed round before the closing party started."
            ctaText="See the demos"
            ctaUrl="/conference/day-3"
            ctaVariant="glow"
            ctaColorScheme="secondary"
            bgClass="bg-accent"
            textClass="text-accent-content"
            mutedClass="text-accent-content/80"
          />
        ),
      },
      {
        content: (
          <BoldPanel
            number="2026"
            title="Tickets open in March"
            description="We are doubling the venue, tripling the workshop count, and adding a hardware track for embedded and robotics teams. Early-access tickets go live to last year's attendees first; everyone else gets in line on March 15."
            ctaText="Get notified"
            ctaUrl="/conference/2026"
            ctaVariant="glow"
            ctaColorScheme="secondary"
            bgClass="bg-neutral"
            textClass="text-neutral-content"
            mutedClass="text-neutral-content/70"
          />
        ),
      },
    ],
  },
};
