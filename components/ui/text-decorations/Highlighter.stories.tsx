import type { Meta, StoryObj } from "@storybook/react";
import { Highlighter } from "./Highlighter";

const meta: Meta<typeof Highlighter> = {
  title: "UI/Highlighter",
  component: Highlighter,
  argTypes: {
    action: {
      control: "select",
      options: [
        "highlight",
        "underline",
        "box",
        "circle",
        "strike-through",
        "crossed-off",
        "bracket",
      ],
    },
    colorScheme: {
      control: "select",
      options: [
        undefined,
        "primary",
        "secondary",
        "accent",
        "neutral",
        "info",
        "success",
        "warning",
        "error",
      ],
    },
    color: { control: "color" },
    strokeWidth: { control: { type: "range", min: 0.5, max: 5, step: 0.5 } },
    animationDuration: {
      control: { type: "range", min: 100, max: 2000, step: 100 },
    },
    iterations: { control: { type: "range", min: 1, max: 5, step: 1 } },
    padding: { control: { type: "range", min: 0, max: 20, step: 1 } },
  },
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Highlighter>;

/** All annotation styles using theme color schemes */
export const AllAnnotationStyles: Story = {
  render: () => (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-12 bg-base-100 px-8 py-16">
      <div>
        <p className="mb-4 text-sm font-medium text-base-content/60">
          Highlight — Primary
        </p>
        <h2 className="text-3xl font-bold text-base-content md:text-4xl">
          We deliver{" "}
          <Highlighter action="highlight" colorScheme="primary">
            results that matter
          </Highlighter>
        </h2>
      </div>

      <div>
        <p className="mb-4 text-sm font-medium text-base-content/60">
          Underline — Secondary
        </p>
        <h2 className="text-3xl font-bold text-base-content md:text-4xl">
          Built for{" "}
          <Highlighter
            action="underline"
            colorScheme="secondary"
            strokeWidth={2.5}
          >
            speed and scale
          </Highlighter>
        </h2>
      </div>

      <div>
        <p className="mb-4 text-sm font-medium text-base-content/60">
          Box — Error
        </p>
        <h2 className="text-3xl font-bold text-base-content md:text-4xl">
          Your website,{" "}
          <Highlighter action="box" colorScheme="error" strokeWidth={2}>
            ready in minutes
          </Highlighter>
        </h2>
      </div>

      <div>
        <p className="mb-4 text-sm font-medium text-base-content/60">
          Circle — Warning
        </p>
        <h2 className="text-3xl font-bold text-base-content md:text-4xl">
          The{" "}
          <Highlighter action="circle" colorScheme="warning" strokeWidth={2}>
            smart
          </Highlighter>{" "}
          choice for your brand
        </h2>
      </div>

      <div>
        <p className="mb-4 text-sm font-medium text-base-content/60">
          Strike-through — Error
        </p>
        <h2 className="text-3xl font-bold text-base-content md:text-4xl">
          No more{" "}
          <Highlighter
            action="strike-through"
            colorScheme="error"
            strokeWidth={2}
          >
            manual coding
          </Highlighter>
          , just results
        </h2>
      </div>

      <div>
        <p className="mb-4 text-sm font-medium text-base-content/60">
          Crossed-off — Accent
        </p>
        <h2 className="text-3xl font-bold text-base-content md:text-4xl">
          Say goodbye to{" "}
          <Highlighter
            action="crossed-off"
            colorScheme="accent"
            strokeWidth={2}
          >
            slow launches
          </Highlighter>
        </h2>
      </div>

      <div>
        <p className="mb-4 text-sm font-medium text-base-content/60">
          Bracket — Info
        </p>
        <h2 className="text-3xl font-bold text-base-content md:text-4xl">
          Powered by{" "}
          <Highlighter action="bracket" colorScheme="info" strokeWidth={2}>
            artificial intelligence
          </Highlighter>
        </h2>
      </div>
    </div>
  ),
};

/** Highlight used in a marketing headline with theme colors */
export const MarketingHeadline: Story = {
  render: () => (
    <div className="flex min-h-screen w-screen items-center justify-center bg-base-100 px-8">
      <div className="max-w-3xl space-y-6 text-center">
        <h1 className="text-5xl font-black leading-tight tracking-tight text-base-content md:text-7xl">
          Generate{" "}
          <Highlighter
            action="highlight"
            colorScheme="primary"
            animationDuration={800}
          >
            stunning websites
          </Highlighter>{" "}
          with AI
        </h1>
        <p className="text-xl text-base-content/60">
          Input your company details and get a{" "}
          <Highlighter action="underline" colorScheme="success" strokeWidth={2}>
            production-ready
          </Highlighter>{" "}
          website deployed in minutes, not weeks.
        </p>
      </div>
    </div>
  ),
};

/** Scroll-triggered annotations using theme colors */
export const ScrollTriggered: Story = {
  render: () => (
    <div className="w-screen bg-base-100">
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-base-content/60">
          Scroll down to trigger the annotations
        </p>
      </div>
      <div className="flex min-h-screen items-center justify-center px-8">
        <div className="max-w-2xl space-y-8">
          <h2 className="text-4xl font-bold text-base-content md:text-5xl">
            We help businesses{" "}
            <Highlighter
              action="highlight"
              colorScheme="warning"
              triggerOnView
              animationDuration={1000}
            >
              grow faster
            </Highlighter>{" "}
            online
          </h2>
          <p className="text-xl leading-relaxed text-base-content/70">
            Our AI-powered platform handles everything from{" "}
            <Highlighter
              action="underline"
              colorScheme="secondary"
              strokeWidth={2}
              triggerOnView
            >
              design and copywriting
            </Highlighter>{" "}
            to{" "}
            <Highlighter
              action="underline"
              colorScheme="error"
              strokeWidth={2}
              triggerOnView
            >
              SEO optimization
            </Highlighter>
            , so you can focus on running your business.
          </p>
        </div>
      </div>
      <div className="min-h-[50vh]" />
    </div>
  ),
  parameters: { layout: "fullscreen" },
};

/** Feature comparison using theme colors for strike-through and highlights */
export const FeatureComparison: Story = {
  render: () => (
    <div className="flex min-h-screen w-screen items-center justify-center bg-base-100 px-8">
      <div className="max-w-2xl space-y-8">
        <h2 className="text-3xl font-bold text-base-content md:text-4xl">
          Why choose SiteGen?
        </h2>
        <ul className="space-y-4 text-xl text-base-content">
          <li>
            <Highlighter
              action="strike-through"
              colorScheme="error"
              strokeWidth={2}
            >
              Weeks of development time
            </Highlighter>{" "}
            <span className="font-semibold text-base-content">
              — done in 5 minutes
            </span>
          </li>
          <li>
            <Highlighter
              action="strike-through"
              colorScheme="error"
              strokeWidth={2}
            >
              Expensive design agencies
            </Highlighter>{" "}
            <span className="font-semibold text-base-content">
              — AI-powered for a fraction of the cost
            </span>
          </li>
          <li>
            <Highlighter
              action="strike-through"
              colorScheme="error"
              strokeWidth={2}
            >
              Generic cookie-cutter templates
            </Highlighter>{" "}
            <span className="font-semibold text-base-content">
              — tailored to your brand and segment
            </span>
          </li>
          <li>
            <Highlighter
              action="highlight"
              colorScheme="success"
              strokeWidth={1.5}
            >
              SEO-optimized from day one
            </Highlighter>
          </li>
          <li>
            <Highlighter
              action="highlight"
              colorScheme="success"
              strokeWidth={1.5}
            >
              Responsive on every device
            </Highlighter>
          </li>
        </ul>
      </div>
    </div>
  ),
};

/** Interactive playground with controls */
export const Playground: Story = {
  args: {
    children: "Annotate this text",
    action: "highlight",
    colorScheme: "primary",
    strokeWidth: 1.5,
    animationDuration: 600,
    iterations: 2,
    padding: 2,
    multiline: true,
    triggerOnView: false,
  },
  render: (args) => (
    <div className="flex min-h-screen w-screen items-center justify-center bg-base-100 px-8">
      <h2 className="text-4xl font-bold text-base-content md:text-5xl">
        <Highlighter {...args} />
      </h2>
    </div>
  ),
};
