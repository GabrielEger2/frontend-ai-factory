import type { Meta, StoryObj } from "@storybook/react";
import { TextReveal } from "./TextReveal";
import { LineShadowText } from "./LineShadowText";
import { Reveal } from "./Reveal";
import { TypeWriter } from "./TypeWriter";

const meta: Meta = {
  title: "UI/AnimatedText",
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj;

/** All animated text primitives showcased together */
export const AllVariants: Story = {
  render: () => (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-20 bg-base-100 px-8 py-16">
      {/* TextReveal — Word Split */}
      <div>
        <p className="mb-4 text-sm font-medium text-base-content/60">
          TextReveal — Word Split
        </p>
        <h2 className="text-4xl font-bold text-base-content md:text-5xl">
          <TextReveal triggerOnView={false}>
            Build websites that convert visitors into customers
          </TextReveal>
        </h2>
      </div>

      {/* TextReveal — Letter Split */}
      <div>
        <p className="mb-4 text-sm font-medium text-base-content/60">
          TextReveal — Letter Split
        </p>
        <h2 className="text-4xl font-bold text-primary md:text-5xl">
          <TextReveal split="letter" delay={0.03} triggerOnView={false}>
            Precision matters
          </TextReveal>
        </h2>
      </div>

      {/* TextReveal — From Top */}
      <div>
        <p className="mb-4 text-sm font-medium text-base-content/60">
          TextReveal — From Top
        </p>
        <h2 className="text-3xl font-semibold text-base-content md:text-4xl">
          <TextReveal from="top" duration={0.4} triggerOnView={false}>
            Every detail designed with intention
          </TextReveal>
        </h2>
      </div>

      {/* LineShadowText */}
      <div>
        <p className="mb-4 text-sm font-medium text-base-content/60">
          LineShadowText — Default
        </p>
        <h2 className="text-5xl font-bold tracking-tight text-base-content md:text-7xl">
          <LineShadowText>SiteGen</LineShadowText>
        </h2>
      </div>

      {/* LineShadowText — With Custom Shadow Color */}
      <div>
        <p className="mb-4 text-sm font-medium text-base-content/60">
          LineShadowText — Custom Shadow Color
        </p>
        <h2 className="text-5xl font-bold tracking-tight text-primary md:text-7xl">
          <LineShadowText shadowColor="oklch(0.6 0.2 250)">
            Premium
          </LineShadowText>
        </h2>
      </div>

      {/* Reveal */}
      <div>
        <p className="mb-4 text-sm font-medium text-base-content/60">
          Reveal — Color Wipe
        </p>
        <Reveal>
          <h2 className="text-4xl font-bold text-base-content md:text-5xl">
            Unveiled with style
          </h2>
        </Reveal>
      </div>

      {/* TypeWriter */}
      <div>
        <p className="mb-4 text-sm font-medium text-base-content/60">
          TypeWriter — Rotating Words
        </p>
        <h2 className="text-4xl font-bold text-base-content md:text-5xl">
          We build{" "}
          <TypeWriter
            text={["websites", "landing pages", "digital experiences"]}
            className="text-primary"
            cursorClassName="text-primary"
            speed={60}
            deleteSpeed={40}
            pauseDelay={2000}
          />
        </h2>
      </div>
    </div>
  ),
};

/** TextReveal word-by-word with scroll trigger — add scrollable area to test */
export const TextRevealScrollTrigger: Story = {
  render: () => (
    <div className="w-screen bg-base-100">
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-base-content/60">
          Scroll down to trigger the reveal
        </p>
      </div>
      <div className="flex min-h-screen items-center justify-center px-8">
        <h2 className="max-w-3xl text-center text-4xl font-bold leading-tight text-base-content md:text-5xl">
          <TextReveal>
            Transform your online presence with AI-generated websites tailored
            to your brand
          </TextReveal>
        </h2>
      </div>
      <div className="min-h-[50vh]" />
    </div>
  ),
  parameters: { layout: "fullscreen" },
};

/** TextReveal letter-by-letter for short impactful statements */
export const TextRevealLetterByLetter: Story = {
  render: () => (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-16 bg-base-100 px-8">
      <div className="text-center">
        <h1 className="text-5xl font-black tracking-tight text-base-content md:text-7xl">
          <TextReveal
            split="letter"
            delay={0.03}
            duration={0.25}
            triggerOnView={false}
          >
            BOLD MOVES
          </TextReveal>
        </h1>
        <p className="mt-4 text-lg text-base-content/60">
          <TextReveal delay={0.04} duration={0.3} triggerOnView={false}>
            For businesses that refuse to blend in
          </TextReveal>
        </p>
      </div>
    </div>
  ),
};

/** LineShadowText used as headings in different sizes */
export const LineShadowHeadings: Story = {
  render: () => (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-12 bg-base-100 px-8">
      <LineShadowText
        as="h1"
        className="text-7xl font-black tracking-tighter text-base-content"
      >
        Headline
      </LineShadowText>
      <LineShadowText
        as="h2"
        className="text-5xl font-bold tracking-tight text-base-content"
      >
        Subheadline
      </LineShadowText>
      <LineShadowText
        as="h3"
        className="text-3xl font-semibold text-base-content"
      >
        Section Title
      </LineShadowText>
      <LineShadowText
        as="span"
        shadowColor="oklch(0.65 0.25 30)"
        className="text-5xl font-bold tracking-tight text-accent"
      >
        Accent Color
      </LineShadowText>
    </div>
  ),
};

/** Composition — combining multiple animated text primitives together */
export const ComposedHeroText: Story = {
  render: () => (
    <div className="flex min-h-screen w-screen items-center justify-center bg-base-100 px-8">
      <div className="max-w-3xl space-y-6 text-center">
        <Reveal>
          <h1 className="text-5xl font-black tracking-tight text-base-content md:text-7xl">
            <LineShadowText>Your website ready</LineShadowText>
          </h1>
        </Reveal>
        <h2 className="text-3xl font-bold text-base-content md:text-4xl">
          <TextReveal delay={0.06} triggerOnView={false}>
            in minutes, with artificial intelligence
          </TextReveal>
        </h2>
        <p className="text-xl text-base-content/60">
          We generate websites for{" "}
          <TypeWriter
            text={[
              "restaurants",
              "law firms",
              "medical clinics",
              "gyms",
              "real estate agencies",
            ]}
            className="font-semibold text-primary"
            cursorClassName="text-primary"
            speed={50}
            deleteSpeed={35}
            pauseDelay={1800}
          />
        </p>
      </div>
    </div>
  ),
};
