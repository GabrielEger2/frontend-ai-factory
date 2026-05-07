import type { Meta, StoryObj } from "@storybook/react";
import IconListSplit from "./index";

const meta: Meta<typeof IconListSplit> = {
  title: "Layout/Split/IconListSplit",
  component: IconListSplit,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof IconListSplit>;

/* ------------------------------------------------------------------ */
/*  Shared icon components for stories                                 */
/* ------------------------------------------------------------------ */

const RocketIcon = (
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
      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 003.46-8.62 2.25 2.25 0 00-2.18-2.18 14.98 14.98 0 00-8.62 3.46m5.34 7.34L7.25 21.06a1.5 1.5 0 01-2.12 0l-.18-.18a1.5 1.5 0 010-2.12l6.69-6.69m0 0a3.375 3.375 0 10-4.773-4.773L3.5 10.62"
    />
  </svg>
);

const CodeIcon = (
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
      d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
    />
  </svg>
);

const LockIcon = (
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
      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
    />
  </svg>
);

const ScaleIcon = (
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
      d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
    />
  </svg>
);

const HeartIcon = (
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
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

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

const BriefcaseIcon = (
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
      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
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

/** SaaS product — features with large circular image and partner logos */
export const SaasProductFeatures: Story = {
  args: {
    headline: "Ship Faster Without Sacrificing Quality",
    image: "https://placehold.co/700x700",
    imageAlt: "Developer reviewing a pull request on a wide-screen monitor",
    features: [
      {
        icon: RocketIcon,
        title: "One-Click Deployments",
        description:
          "Push to main and your changes are live in under sixty seconds. Zero-downtime rolling deploys across all regions with automatic rollback on health check failure.",
      },
      {
        icon: CodeIcon,
        title: "Built-In CI/CD Pipelines",
        description:
          "Every pull request gets an isolated preview environment with its own database seed. Run integration tests in parallel and merge with confidence.",
      },
      {
        icon: LockIcon,
        title: "SOC 2 Compliant by Default",
        description:
          "Encryption at rest and in transit, audit logging, and role-based access controls are enabled from day one. No add-on pricing, no enterprise tier required.",
      },
    ],
    logos: [
      { image: "https://placehold.co/140x40", imageAlt: "Vercel logo" },
      { image: "https://placehold.co/140x40", imageAlt: "Supabase logo" },
      { image: "https://placehold.co/140x40", imageAlt: "Stripe logo" },
      { image: "https://placehold.co/140x40", imageAlt: "Linear logo" },
      { image: "https://placehold.co/140x40", imageAlt: "Figma logo" },
    ],
    purpose: "saas-product-features",
  },
};

/** Law firm — services without image or logos */
export const LawFirmServices: Story = {
  args: {
    headline: "Legal Expertise You Can Rely On",
    features: [
      {
        icon: ScaleIcon,
        title: "Corporate Litigation",
        description:
          "Our trial team has handled over three hundred commercial disputes across federal and state courts. We prepare every case as if it will go to trial, which is often why it does not.",
      },
      {
        icon: BriefcaseIcon,
        title: "Mergers and Acquisitions",
        description:
          "End-to-end advisory from letter of intent through post-closing integration. We have closed transactions ranging from five million to two billion reais across twelve industries.",
      },
      {
        icon: ClipboardIcon,
        title: "Regulatory Compliance",
        description:
          "Proactive compliance programs tailored to your sector. We monitor legislative changes daily and translate them into actionable policies before enforcement deadlines arrive.",
      },
      {
        icon: LockIcon,
        title: "Data Privacy and LGPD",
        description:
          "Full LGPD compliance assessments, DPO-as-a-service, and incident response planning. We have guided over sixty companies through the certification process.",
      },
    ],
    purpose: "law-firm-services",
  },
};

/** Medical clinic — specialties with circular image */
export const MedicalClinicSpecialties: Story = {
  args: {
    headline: "Comprehensive Care Under One Roof",
    image: "https://placehold.co/700x700",
    imageAlt: "Modern medical clinic reception area with natural wood accents",
    features: [
      {
        icon: HeartIcon,
        title: "Preventive Cardiology",
        description:
          "Annual cardiovascular risk assessments, stress testing, and personalized nutrition plans designed to reduce cardiac events before they occur.",
      },
      {
        icon: ClipboardIcon,
        title: "Orthopedic Rehabilitation",
        description:
          "Post-surgical and sports injury recovery programs combining physiotherapy, hydrotherapy, and progressive strength training under physician supervision.",
      },
      {
        icon: ChartIcon,
        title: "Diagnostic Imaging",
        description:
          "On-site MRI, CT, and ultrasound with same-day reporting. Digital images are uploaded to your patient portal within two hours of your appointment.",
      },
    ],
    purpose: "medical-clinic-specialties",
  },
};

/** Digital agency — process steps with logos */
export const AgencyProcess: Story = {
  args: {
    headline: "A Process Built for Results, Not Meetings",
    features: [
      {
        icon: ClipboardIcon,
        title: "Discovery and Strategy",
        description:
          "We start with a two-week sprint where we interview stakeholders, audit existing assets, and map user journeys. The deliverable is a prioritized roadmap, not a slide deck.",
      },
      {
        icon: CodeIcon,
        title: "Design and Prototyping",
        description:
          "Interactive prototypes tested with real users before a single line of production code is written. We iterate in Figma until conversion metrics improve in A/B tests.",
      },
      {
        icon: RocketIcon,
        title: "Development and Launch",
        description:
          "Modular front-end architecture deployed incrementally. Every feature ships behind a flag so stakeholders can review in production before public release.",
      },
    ],
    logos: [
      {
        image: "https://placehold.co/140x40",
        imageAlt: "Google Partner badge",
      },
      {
        image: "https://placehold.co/140x40",
        imageAlt: "HubSpot Solutions Partner logo",
      },
      {
        image: "https://placehold.co/140x40",
        imageAlt: "Shopify Plus Partner logo",
      },
      {
        image: "https://placehold.co/140x40",
        imageAlt: "AWS Select Partner logo",
      },
      {
        image: "https://placehold.co/140x40",
        imageAlt: "Meta Business Partner logo",
      },
    ],
    purpose: "agency-process",
  },
};
