import type { Meta, StoryObj } from "@storybook/react";
import { CursorFollow } from "../CursorFollow";
import {
  AnimatedSvgBackground,
  GEOMETRIC_SHAPES,
} from "./AnimatedSvgBackground";
import { RetroGrid } from "./RetroGrid";
import { InteractiveGridPattern } from "./InteractiveGridPattern";
import { DotPattern } from "./DotPattern";
import { StripedPattern } from "./StripedPattern";
import { GradientBars } from "./GradientBars";
import { ReactLenis } from "lenis/react";

const meta: Meta = {
  title: "UI/InteractiveMotion",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

/* ------------------------------------------------------------------ */
/*  CursorFollow — Default dot + text bubble on hover                  */
/* ------------------------------------------------------------------ */

export const CursorFollowDefault: Story = {
  render: () => (
    <div className="min-h-screen bg-base-100">
      <CursorFollow>
        <div className="flex min-h-screen flex-col items-center justify-center gap-12 px-8">
          <h1 className="text-4xl font-bold text-base-content md:text-5xl">
            Move your cursor around
          </h1>
          <p className="max-w-lg text-center text-base-content/60">
            The custom cursor follows your mouse with spring physics. Hover over
            the interactive elements below to see the cursor expand into a text
            bubble.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div
              className="rounded-box bg-base-200 px-8 py-6 text-base-content transition-colors hover:bg-base-300"
              data-cursor-text="View project"
            >
              Project Alpha
            </div>
            <div
              className="rounded-box bg-base-200 px-8 py-6 text-base-content transition-colors hover:bg-base-300"
              data-cursor-text="Read case study"
            >
              Case Study
            </div>
            <div
              className="rounded-box bg-base-200 px-8 py-6 text-base-content transition-colors hover:bg-base-300"
              data-cursor-text="Contact us"
            >
              Get in Touch
            </div>
          </div>
        </div>
      </CursorFollow>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  AnimatedSvgBackground — Geometric preset                           */
/* ------------------------------------------------------------------ */

export const SvgBackgroundGeometric: Story = {
  render: () => (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-base-100">
      <AnimatedSvgBackground shapes={GEOMETRIC_SHAPES} />
      <div className="relative z-10 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-base-content md:text-6xl">
          Geometric Background
        </h1>
        <p className="mt-4 text-lg text-base-content/60">
          SVG shapes draw themselves in with staggered path animations when the
          section scrolls into view. Uses the GEOMETRIC_SHAPES preset.
        </p>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  AnimatedSvgBackground — Custom organic shapes                      */
/* ------------------------------------------------------------------ */

export const SvgBackgroundCustom: Story = {
  render: () => (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-base-100">
      <AnimatedSvgBackground
        shapes={[
          {
            type: "ellipse",
            cx: 400,
            cy: 300,
            rx: 250,
            ry: 150,
            delay: 0,
          },
          {
            type: "ellipse",
            cx: 1000,
            cy: 400,
            rx: 200,
            ry: 200,
            delay: 0.1,
          },
          { type: "line", x1: 0, y1: 500, x2: 1440, y2: 500, delay: 0.15 },
          {
            type: "rect",
            x: 600,
            y: 100,
            width: 240,
            height: 240,
            rx: 20,
            delay: 0.2,
          },
          {
            type: "path",
            d: "M100,600 Q400,200 700,500 T1300,300",
            delay: 0.25,
          },
        ]}
        strokeWidth={1.5}
        duration={1.5}
        stagger={0.12}
      />
      <div className="relative z-10 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-base-content md:text-6xl">
          Custom Shapes
        </h1>
        <p className="mt-4 text-lg text-base-content/60">
          Define any combination of paths, circles, ellipses, rectangles, and
          lines. Each shape draws itself with configurable duration and stagger.
        </p>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Lenis Smooth Scroll — Showcase page with anchor navigation         */
/* ------------------------------------------------------------------ */

export const LenisSmoothScroll: Story = {
  render: () => (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2 }}>
      <div className="bg-base-100">
        <nav className="sticky top-0 z-40 flex items-center justify-center gap-6 border-b border-base-300 bg-base-100/80 px-4 py-4 backdrop-blur-md">
          {["about", "services", "work", "contact"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-sm font-medium capitalize text-base-content/60 transition-colors hover:text-primary"
            >
              {id}
            </a>
          ))}
        </nav>

        <section className="flex min-h-screen items-center justify-center px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-base-content md:text-6xl">
              Lenis Smooth Scroll
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-base-content/60">
              This page uses Lenis for buttery-smooth scrolling. Click the nav
              links or scroll naturally to feel the difference.
            </p>
            <a
              href="#about"
              className="mt-8 inline-block text-sm font-medium text-primary"
            >
              Scroll down ↓
            </a>
          </div>
        </section>

        <section
          id="about"
          className="flex min-h-screen items-center justify-center bg-base-200 px-8"
        >
          <div className="max-w-xl text-center">
            <h2 className="text-3xl font-bold text-base-content">About Us</h2>
            <p className="mt-4 text-base-content/60">
              We are a digital agency specializing in AI-powered website
              generation. Our platform creates fully optimized sites in minutes,
              not weeks.
            </p>
          </div>
        </section>

        <section
          id="services"
          className="flex min-h-screen items-center justify-center px-8"
        >
          <div className="max-w-xl text-center">
            <h2 className="text-3xl font-bold text-base-content">Services</h2>
            <p className="mt-4 text-base-content/60">
              Website generation, SEO optimization, brand identity systems, and
              ongoing performance monitoring — all powered by specialized AI
              agents.
            </p>
          </div>
        </section>

        <section
          id="work"
          className="flex min-h-screen items-center justify-center bg-base-200 px-8"
        >
          <div className="max-w-xl text-center">
            <h2 className="text-3xl font-bold text-base-content">Our Work</h2>
            <p className="mt-4 text-base-content/60">
              Over 500 sites generated and deployed. Each one crafted by our
              pipeline of specialized AI agents and fine-tuned for conversion.
            </p>
          </div>
        </section>

        <section
          id="contact"
          className="flex min-h-screen items-center justify-center px-8"
        >
          <div className="max-w-xl text-center">
            <h2 className="text-3xl font-bold text-base-content">Contact</h2>
            <p className="mt-4 text-base-content/60">
              Ready to transform your online presence? Reach out and we will get
              your site live within the hour.
            </p>
          </div>
        </section>
      </div>
    </ReactLenis>
  ),
};

/* ------------------------------------------------------------------ */
/*  RetroGrid  */
/* ------------------------------------------------------------------ */

export const RetroGridDefault: Story = {
  render: () => (
    <div className="relative min-h-screen overflow-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center gap-6 px-8 py-16 text-center translate-y-40">
        <h1 className="text-4xl font-bold text-base-content md:text-6xl">
          Shallow & Wide
        </h1>
        <p className="mt-4 text-lg text-base-content/60">
          A gentler angle with larger cells creates a subtle, expansive grid.
          Lower opacity keeps it as a soft background texture.
        </p>
      </div>
      <RetroGrid
        angle={30}
        cellSize={120}
        opacity={0.4}
        lightLineColor="oklch(0.5 0.0 0)"
        darkLineColor="oklch(0.7 0.0 0)"
      />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  InteractiveGridPattern — Hover-responsive grid                     */
/* ------------------------------------------------------------------ */

export const InteractiveGridDefault: Story = {
  render: () => (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-100">
      <InteractiveGridPattern className="[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12" />
      <div className="relative z-10 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-base-content md:text-6xl">
          Interactive Grid
        </h1>
        <p className="mt-4 text-lg text-base-content/60">
          Hover over the grid to highlight cells. The pattern uses a radial
          gradient mask and a subtle skew for depth. Cells light up with the
          primary color on hover.
        </p>
      </div>
    </div>
  ),
};

export const InteractiveGridWide: Story = {
  render: () => (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-100">
      <InteractiveGridPattern
        width={60}
        height={60}
        maxActiveSquares={2}
        className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
      />
      <div className="relative z-10 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-base-content md:text-6xl">
          Wider Cells
        </h1>
        <p className="mt-4 text-lg text-base-content/60">
          Larger cells with a broader hover radius. Two rings of cells highlight
          around the cursor, creating a softer interactive glow.
        </p>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  DotPattern — Repeating dot grid                                    */
/* ------------------------------------------------------------------ */

export const DotPatternDefault: Story = {
  render: () => (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-100">
      <DotPattern className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]" />
      <div className="relative z-10 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-base-content md:text-6xl">
          Dot Pattern
        </h1>
        <p className="mt-4 text-lg text-base-content/60">
          A subtle repeating dot grid fading out with a radial mask. Great as a
          background texture for hero sections or content areas.
        </p>
      </div>
    </div>
  ),
};

export const DotPatternDense: Story = {
  render: () => (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-100">
      <DotPattern
        width={10}
        height={10}
        radius={1.5}
        className="[mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
      />
      <div className="relative z-10 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-base-content md:text-6xl">
          Dense Dots
        </h1>
        <p className="mt-4 text-lg text-base-content/60">
          Tighter spacing and larger dots create a denser texture. Works well
          behind cards or as a section separator background.
        </p>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  StripedPattern — Diagonal stripes                                  */
/* ------------------------------------------------------------------ */

export const StripedPatternDefault: Story = {
  render: () => (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-100">
      <StripedPattern className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]" />
      <div className="relative z-10 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-base-content md:text-6xl">
          Striped Pattern
        </h1>
        <p className="mt-4 text-lg text-base-content/60">
          Diagonal repeating stripes with a radial fade. The 45-degree angle
          gives a clean, editorial feel to background sections.
        </p>
      </div>
    </div>
  ),
};

export const StripedPatternHorizontal: Story = {
  render: () => (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-100">
      <StripedPattern
        angle={0}
        stripeWidth={2}
        gap={10}
        className="[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
      />
      <div className="relative z-10 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-base-content md:text-6xl">
          Horizontal Lines
        </h1>
        <p className="mt-4 text-lg text-base-content/60">
          Zero-degree rotation produces horizontal lines. Thinner stripes with
          wider gaps create a minimal, calm texture.
        </p>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  GradientBars — Animated vertical bars                              */
/* ------------------------------------------------------------------ */

export const GradientBarsDefault: Story = {
  render: () => (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-100">
      <GradientBars />
      <div className="relative z-10 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-base-content md:text-6xl">
          Gradient Bars
        </h1>
        <p className="mt-4 text-lg text-base-content/60">
          Animated vertical bars with a bottom-to-top gradient using the primary
          theme color. Bars scale based on their distance from center and pulse
          with staggered timing.
        </p>
      </div>
    </div>
  ),
};

export const GradientBarsCustomColors: Story = {
  render: () => (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-100">
      <GradientBars
        bars={30}
        colors={["oklch(var(--color-secondary))", "transparent"]}
      />
      <div className="relative z-10 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-base-content md:text-6xl">
          Secondary Palette
        </h1>
        <p className="mt-4 text-lg text-base-content/60">
          More bars with the secondary color create a denser, more saturated
          backdrop. The wave animation becomes more visible with additional
          columns.
        </p>
      </div>
    </div>
  ),
};
