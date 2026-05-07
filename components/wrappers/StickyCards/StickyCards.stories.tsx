import type { Meta, StoryObj } from "@storybook/react";
import { FiCalendar, FiShield, FiZap, FiTrendingUp } from "react-icons/fi";
import StickyCards from "./index";
import { CtaButton } from "@ui/button";
import { cn } from "@lib/utils";

const meta: Meta<typeof StickyCards> = {
  title: "Wrappers/StickyCards",
  component: StickyCards,
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
type Story = StoryObj<typeof StickyCards>;

/* ------------------------------------------------------------------ */
/*  Shared card layouts for stories                                    */
/* ------------------------------------------------------------------ */

interface IconCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  ctaVariant: "glow" | "slide" | "drawOutline";
  ctaColorScheme: "primary" | "secondary" | "accent";
  isOdd?: boolean;
}

function IconCard({
  icon,
  title,
  description,
  ctaText,
  ctaUrl,
  ctaVariant,
  ctaColorScheme,
  isOdd,
}: IconCardProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 text-center md:px-8",
        isOdd ? "text-neutral-content" : "text-base-content",
      )}
    >
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-4 text-3xl font-semibold sm:text-4xl md:text-5xl">
        {title}
      </h3>
      <p
        className={cn(
          "mb-8 max-w-lg text-sm md:text-base",
          isOdd ? "text-neutral-content/70" : "text-base-content/70",
        )}
      >
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

interface ImageCardProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  ctaVariant: "glow" | "slide" | "drawOutline";
  ctaColorScheme: "primary" | "secondary" | "accent";
}

function ImageCard({
  image,
  imageAlt,
  title,
  description,
  ctaText,
  ctaUrl,
  ctaVariant,
  ctaColorScheme,
}: ImageCardProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 md:flex-row md:gap-12 md:px-8">
      <div className="flex w-full shrink-0 justify-center md:w-2/5">
        <img
          src={image}
          alt={imageAlt}
          className="max-h-64 w-auto rounded-lg object-cover md:max-h-80"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col items-center md:items-start">
        <h3 className="mb-4 text-center text-3xl font-semibold sm:text-4xl md:text-left md:text-5xl">
          {title}
        </h3>
        <p className="mb-8 max-w-lg text-center text-sm text-base-content/70 md:text-left md:text-base">
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS platform — icon-driven cards with section header, slide CTA */
export const SaasPlatformFeatures: Story = {
  args: {
    headline: "Everything you need to scale",
    subheadline:
      "From scheduling to analytics, our tools are built to grow with your team and simplify your day-to-day operations.",
    cards: [
      {
        content: (
          <IconCard
            icon={<FiCalendar className="text-4xl" />}
            title="Smart Scheduling"
            description="AI-powered calendar that learns your preferences, avoids conflicts, and finds the perfect meeting time for every participant across time zones."
            ctaText="Try scheduling"
            ctaUrl="/features/scheduling"
            ctaVariant="slide"
            ctaColorScheme="primary"
          />
        ),
      },
      {
        content: (
          <IconCard
            icon={<FiShield className="text-4xl" />}
            title="Enterprise Security"
            description="SOC 2 Type II certified with end-to-end encryption, role-based access controls, and real-time audit logs that keep your data protected at every layer."
            ctaText="See compliance"
            ctaUrl="/security"
            ctaVariant="slide"
            ctaColorScheme="primary"
          />
        ),
      },
      {
        content: (
          <IconCard
            icon={<FiZap className="text-4xl" />}
            title="Instant Integrations"
            description="Connect to 200+ tools in seconds. Slack, Salesforce, HubSpot, Notion — our pre-built connectors eliminate manual data entry and keep everything in sync."
            ctaText="Browse integrations"
            ctaUrl="/integrations"
            ctaVariant="slide"
            ctaColorScheme="primary"
          />
        ),
      },
      {
        content: (
          <IconCard
            icon={<FiTrendingUp className="text-4xl" />}
            title="Actionable Analytics"
            description="Custom dashboards and automated reports that surface the metrics that matter. Track team performance, pipeline health, and revenue trends at a glance."
            ctaText="Explore analytics"
            ctaUrl="/features/analytics"
            ctaVariant="slide"
            ctaColorScheme="primary"
          />
        ),
      },
    ],
  },
};

/** Consulting firm — image-driven cards showcasing the engagement process, drawOutline CTA */
export const ConsultingProcess: Story = {
  args: {
    headline: "How we deliver results",
    subheadline:
      "A proven four-phase engagement model that turns strategy into measurable impact within 90 days.",
    cards: [
      {
        content: (
          <ImageCard
            image="https://placehold.co/500x350"
            imageAlt="Consultant and client reviewing market research data on a whiteboard"
            title="Discovery & Diagnosis"
            description="We spend the first two weeks embedded with your team — interviewing stakeholders, auditing processes, and mapping the competitive landscape to identify the levers that matter most."
            ctaText="Learn about discovery"
            ctaUrl="/process/discovery"
            ctaVariant="drawOutline"
            ctaColorScheme="accent"
          />
        ),
      },
      {
        content: (
          <ImageCard
            image="https://placehold.co/500x350"
            imageAlt="Strategy workshop with executives around a conference table"
            title="Strategy Design"
            description="Armed with data, we co-create a prioritized roadmap with your leadership team. Every initiative is scored by impact, feasibility, and speed to value so resources go where they count."
            ctaText="See our frameworks"
            ctaUrl="/process/strategy"
            ctaVariant="drawOutline"
            ctaColorScheme="accent"
          />
        ),
      },
      {
        content: (
          <ImageCard
            image="https://placehold.co/500x350"
            imageAlt="Team implementing changes with project management dashboards on screen"
            title="Execution Support"
            description="Our consultants stay on the ground through implementation — running sprints, unblocking teams, and adjusting tactics in real time as market conditions shift."
            ctaText="View case studies"
            ctaUrl="/process/execution"
            ctaVariant="drawOutline"
            ctaColorScheme="accent"
          />
        ),
      },
      {
        content: (
          <ImageCard
            image="https://placehold.co/500x350"
            imageAlt="Analytics dashboard showing performance metrics and ROI tracking"
            title="Measurement & Handoff"
            description="Before we leave, we install dashboards, train your team on the new processes, and document everything. You keep the capability long after the engagement ends."
            ctaText="Read client outcomes"
            ctaUrl="/process/results"
            ctaVariant="drawOutline"
            ctaColorScheme="accent"
          />
        ),
      },
    ],
  },
};

/** Product showcase — mixed icon and image cards, glow CTA, no header */
export const ProductShowcase: Story = {
  args: {
    cardHeight: 650,
    cards: [
      {
        content: (
          <IconCard
            icon={"🎨"}
            title="Design Studio"
            description="A browser-based design environment with vector editing, prototyping, and developer handoff built into one tool. No plugins, no exports — just seamless collaboration from sketch to ship."
            ctaText="Try the studio"
            ctaUrl="/products/studio"
            ctaVariant="glow"
            ctaColorScheme="secondary"
          />
        ),
      },
      {
        content: (
          <ImageCard
            image="https://placehold.co/480x320"
            imageAlt="Component library panel showing reusable design tokens and UI elements"
            title="Component Library"
            description="Ship consistent interfaces faster with 500+ production-ready components. Every element follows your brand tokens and updates automatically when you change the design system."
            ctaText="Browse components"
            ctaUrl="/products/library"
            ctaVariant="glow"
            ctaColorScheme="secondary"
          />
        ),
      },
      {
        content: (
          <IconCard
            icon={"⚡"}
            title="Lightning Deploy"
            description="Push designs to staging with one click. Our build pipeline converts prototypes into optimized React code, runs accessibility checks, and deploys to a preview URL in under 60 seconds."
            ctaText="See it in action"
            ctaUrl="/products/deploy"
            ctaVariant="glow"
            ctaColorScheme="secondary"
          />
        ),
      },
    ],
  },
};
