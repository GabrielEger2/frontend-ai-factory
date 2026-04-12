import type { Meta, StoryObj } from "@storybook/react";
import FeaturesIconList from "./index";

const meta: Meta<typeof FeaturesIconList> = {
  title: "Layouts/FeaturesIconList",
  component: FeaturesIconList,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof FeaturesIconList>;

/* ------------------------------------------------------------------ */
/*  Shared icon components for stories                                 */
/* ------------------------------------------------------------------ */

const ClipboardIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

const SlidersIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
    />
  </svg>
);

const FlameIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
    />
  </svg>
);

const ShieldIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const ChartIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Design system product — features with large circular image and partner logos */
export const DesignSystemProduct: Story = {
  args: {
    headline: "Explore Our Awesome Components",
    image: "https://placehold.co/700x700",
    imageAlt:
      "Developer working on a laptop with a component library visible on screen",
    features: [
      {
        icon: ClipboardIcon,
        title: "Copy & Paste Components",
        description:
          "Production-ready React components that drop into your project with a single import. No complex configuration, no peer dependency conflicts.",
      },
      {
        icon: SlidersIcon,
        title: "Zero Configuration",
        description:
          "Sensible defaults for spacing, color tokens, and responsive breakpoints. Override only what your brand needs — everything else works out of the box.",
      },
      {
        icon: FlameIcon,
        title: "Elegant Dark Mode",
        description:
          "Semantic color tokens switch automatically between light and dark themes. One line of CSS and every component adapts without manual overrides.",
      },
    ],
    logos: [
      { image: "https://placehold.co/140x40", imageAlt: "Acme Corp logo" },
      { image: "https://placehold.co/140x40", imageAlt: "Globex logo" },
      { image: "https://placehold.co/140x40", imageAlt: "Initech logo" },
      { image: "https://placehold.co/140x40", imageAlt: "Umbrella logo" },
      {
        image: "https://placehold.co/140x40",
        imageAlt: "Stark Industries logo",
      },
    ],
  },
};

/** Cybersecurity platform — technical features without image */
export const CybersecurityPlatform: Story = {
  args: {
    headline: "Enterprise-Grade Security Built In",
    features: [
      {
        icon: ShieldIcon,
        title: "Threat Detection in Real Time",
        description:
          "Machine learning models analyze network traffic patterns and flag anomalies within milliseconds, reducing mean time to detection from hours to seconds.",
      },
      {
        icon: SlidersIcon,
        title: "Granular Policy Controls",
        description:
          "Define access rules at the user, device, and network level. Policies sync across your entire fleet in under thirty seconds.",
      },
      {
        icon: ChartIcon,
        title: "Compliance Reporting",
        description:
          "Pre-built templates for SOC 2, HIPAA, and GDPR. Generate audit-ready reports with a single click and export to PDF or your GRC platform.",
      },
    ],
  },
};

/** Accounting SaaS — features with image and no logos */
export const AccountingSaas: Story = {
  args: {
    headline: "Bookkeeping That Runs Itself",
    image: "https://placehold.co/700x700",
    imageAlt:
      "Financial dashboard showing revenue charts and expense breakdowns",
    features: [
      {
        icon: ClipboardIcon,
        title: "Automatic Bank Reconciliation",
        description:
          "Transactions from over two hundred banks are imported and categorized automatically. Review exceptions, not every line item.",
      },
      {
        icon: ChartIcon,
        title: "Real-Time Cash Flow Forecasting",
        description:
          "See thirty, sixty, and ninety-day projections updated daily based on your actual receivables and payables data.",
      },
      {
        icon: ShieldIcon,
        title: "Audit-Ready Ledger",
        description:
          "Every entry is timestamped, attributed, and immutable. Your accountant gets read-only access and can generate trial balances without asking you.",
      },
      {
        icon: FlameIcon,
        title: "Multi-Currency Support",
        description:
          "Invoicing and reporting in over forty currencies with automatic exchange-rate updates from the European Central Bank.",
      },
    ],
  },
};

/** E-learning platform — features with logos only */
export const ElearningPlatform: Story = {
  args: {
    headline: "Built for Modern Educators",
    features: [
      {
        icon: ClipboardIcon,
        title: "Course Builder with Drag and Drop",
        description:
          "Structure modules, lessons, and assessments visually. Reorder content in seconds and preview exactly what students will see.",
      },
      {
        icon: ChartIcon,
        title: "Student Analytics Dashboard",
        description:
          "Track completion rates, quiz performance, and engagement metrics at the cohort and individual level with exportable reports.",
      },
      {
        icon: SlidersIcon,
        title: "White-Label Branding",
        description:
          "Custom domain, logo, color scheme, and email templates. Your students see your brand, not ours.",
      },
    ],
    logos: [
      {
        image: "https://placehold.co/140x40",
        imageAlt: "University of Porto logo",
      },
      {
        image: "https://placehold.co/140x40",
        imageAlt: "Digital Academy logo",
      },
      { image: "https://placehold.co/140x40", imageAlt: "LearnHub logo" },
      { image: "https://placehold.co/140x40", imageAlt: "EduFuture logo" },
      { image: "https://placehold.co/140x40", imageAlt: "CodeSchool logo" },
    ],
  },
};
