import type { Meta, StoryObj } from "@storybook/react";
import { FiAward, FiTarget, FiUsers, FiZap } from "react-icons/fi";
import RevealOnScroll from "./index";
import { CtaButton } from "@ui/button";

const meta: Meta<typeof RevealOnScroll> = {
  title: "Wrappers/RevealOnScroll",
  component: RevealOnScroll,
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
    direction: {
      control: { type: "select" },
      options: ["up", "down", "left", "right", "fade"],
    },
    distance: {
      control: { type: "range", min: 0, max: 80, step: 4 },
    },
    stagger: {
      control: { type: "range", min: 0, max: 0.4, step: 0.02 },
    },
    duration: {
      control: { type: "range", min: 0.2, max: 1.5, step: 0.1 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof RevealOnScroll>;

/** Founder letter — reveal up, slow stagger, slide CTA */
export const FounderLetter: Story = {
  args: {
    direction: "up",
    distance: 32,
    stagger: 0.15,
    duration: 0.7,
    purpose: "story",
    children: (
      <>
        <div className="mx-auto w-full max-w-3xl px-6 pt-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-base-content/60">
            From the founder
          </p>
        </div>
        <div className="mx-auto w-full max-w-3xl px-6 py-6 text-center">
          <h2 className="text-4xl font-bold text-base-content sm:text-5xl md:text-6xl">
            We started this company on a kitchen table.
          </h2>
        </div>
        <div className="mx-auto w-full max-w-3xl px-6 py-4">
          <p className="text-lg text-base-content/70 md:text-xl">
            In 2019, my co-founder and I were both running operations teams at
            companies that had outgrown their tooling. We kept hitting the same
            wall — every dashboard told a different story, and nobody had time
            to reconcile them. So we sketched the first version of what would
            become Atlas on a napkin one Saturday morning.
          </p>
        </div>
        <div className="mx-auto w-full max-w-3xl px-6 py-4">
          <p className="text-lg text-base-content/70 md:text-xl">
            Five years later, Atlas runs the operations stack at 1,400
            companies. We process 12 billion events a month. Twelve people on
            the team have moved their families across countries to be here. None
            of that was on the napkin.
          </p>
        </div>
        <div className="mx-auto w-full max-w-3xl px-6 py-4">
          <p className="text-lg text-base-content/70 md:text-xl">
            What is on the napkin — what we wrote down that Saturday — is the
            promise that operations teams should be able to trust their data
            without becoming data engineers. That promise is still the yardstick
            we measure every shipped feature against.
          </p>
        </div>
        <div className="mx-auto w-full max-w-3xl px-6 py-12 text-center">
          <CtaButton variant="slide" colorScheme="primary" href="/about">
            Read our origin story
          </CtaButton>
        </div>
      </>
    ),
  },
};

/** Awards grid — reveal left, tight stagger, glow CTA */
export const AwardsAndRecognition: Story = {
  args: {
    direction: "left",
    distance: 48,
    stagger: 0.06,
    duration: 0.5,
    purpose: "showcase",
    children: (
      <>
        <div className="mx-auto w-full max-w-4xl px-6 py-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-base-content/60">
            Recognition
          </p>
          <h2 className="text-4xl font-bold text-base-content sm:text-5xl">
            Honored by the categories we serve
          </h2>
        </div>
        {[
          {
            icon: <FiAward className="text-3xl text-primary" />,
            title: "Forbes Cloud 100",
            year: "2024",
            description:
              "Ranked #34 on the annual list of the most valuable private cloud companies in the world, alongside Stripe, Canva, and Databricks.",
          },
          {
            icon: <FiTarget className="text-3xl text-primary" />,
            title: "G2 Best Software Awards",
            year: "2024",
            description:
              "Top 50 Best Mid-Market Products and Top 100 Highest Satisfaction Products, based on aggregated review scores from 47,000 verified buyers.",
          },
          {
            icon: <FiUsers className="text-3xl text-primary" />,
            title: "Built In Best Places to Work",
            year: "2024",
            description:
              "Best Mid-Sized Companies to Work For nationally, with top-five rankings in Boston, Austin, and remote-first categories for the third year running.",
          },
          {
            icon: <FiZap className="text-3xl text-primary" />,
            title: "Fast Company Most Innovative",
            year: "2023",
            description:
              "Recognized in the enterprise software category for the launch of the predictive routing engine, which cut average ticket resolution time by 41 percent.",
          },
        ].map((award) => (
          <div
            key={award.title}
            className="mx-auto mb-6 flex w-full max-w-4xl items-start gap-6 rounded-2xl bg-base-200 px-6 py-8"
          >
            <div className="shrink-0 pt-1">{award.icon}</div>
            <div className="flex-1">
              <div className="mb-2 flex items-baseline gap-3">
                <h3 className="text-xl font-semibold text-base-content">
                  {award.title}
                </h3>
                <span className="text-sm text-base-content/60">
                  {award.year}
                </span>
              </div>
              <p className="text-base text-base-content/70">
                {award.description}
              </p>
            </div>
          </div>
        ))}
        <div className="mx-auto w-full max-w-4xl px-6 py-12 text-center">
          <CtaButton variant="glow" colorScheme="accent" href="/press">
            See the full press kit
          </CtaButton>
        </div>
      </>
    ),
  },
};

/** Manifesto — fade only, slow stagger, drawOutline CTA */
export const ManifestoFade: Story = {
  args: {
    direction: "fade",
    stagger: 0.25,
    duration: 1.0,
    purpose: "brand-statement",
    children: (
      <>
        <div className="mx-auto w-full max-w-3xl px-6 pt-32 text-center">
          <h2 className="text-5xl font-bold text-base-content sm:text-6xl md:text-7xl">
            We believe the work matters more than the tool.
          </h2>
        </div>
        <div className="mx-auto w-full max-w-2xl px-6 py-16 text-center">
          <p className="text-2xl text-base-content/70 md:text-3xl">
            Software exists to give people their time back.
          </p>
        </div>
        <div className="mx-auto w-full max-w-2xl px-6 py-16 text-center">
          <p className="text-2xl text-base-content/70 md:text-3xl">
            Every feature we ship is a vote for someone&apos;s afternoon.
          </p>
        </div>
        <div className="mx-auto w-full max-w-2xl px-6 py-16 text-center">
          <p className="text-2xl text-base-content/70 md:text-3xl">
            We owe our customers ruthless simplicity.
          </p>
        </div>
        <div className="mx-auto w-full max-w-2xl px-6 py-24 text-center">
          <CtaButton
            variant="drawOutline"
            colorScheme="secondary"
            href="/principles"
          >
            Read all twelve principles
          </CtaButton>
        </div>
      </>
    ),
  },
};
