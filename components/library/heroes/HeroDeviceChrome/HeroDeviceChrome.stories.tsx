import type { Meta, StoryObj } from "@storybook/react";
import HeroDeviceChrome from "./index";

const meta: Meta<typeof HeroDeviceChrome> = {
  title: "Hero/HeroDeviceChrome",
  component: HeroDeviceChrome,
  parameters: { layout: "fullscreen" },
  argTypes: {
    deviceFrame: {
      control: "select",
      options: ["browser", "macbook", "phone", "tablet"],
    },
    ctaStyle: {
      control: "select",
      options: [
        "default",
        "slide",
        "dotExpand",
        "drawOutline",
        "glow",
        "arrow",
      ],
    },
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    secondaryCtaStyle: {
      control: "select",
      options: [
        "default",
        "slide",
        "dotExpand",
        "drawOutline",
        "glow",
        "arrow",
      ],
    },
    secondaryCtaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof HeroDeviceChrome>;

/** Project-management SaaS — browser frame, primary glow CTA */
export const ProjectSaas: Story = {
  args: {
    eyebrow: "Used by 1,847 product teams",
    headline: "Plan, ship, and review work without losing the thread.",
    highlightWord: "thread",
    subheadline:
      "Cordial Plan stitches your sprint board, design files, and PR reviews into one quiet workspace your engineers will actually open in the morning.",
    ctaText: "Start free trial",
    ctaUrl: "/start",
    ctaStyle: "glow",
    ctaColorScheme: "primary",
    secondaryCtaText: "Book a walkthrough",
    secondaryCtaUrl: "/demo",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "primary",
    screenshotImage: "https://picsum.photos/seed/cordial-plan-app/1280/800",
    screenshotAlt: "Cordial Plan sprint board with grouped tickets",
    deviceFrame: "browser",
    browserUrl: "app.cordialplan.com/team/atlas",
    trustBadges: [
      { label: "SOC 2 Type II", caption: "renewed Apr 2026" },
      { label: "4.7 / 5", caption: "G2, 412 reviews" },
      { label: "1,847 teams", caption: "shipping this week" },
    ],
    showAccentGlow: true,
  },
};

/** Mobile banking app — phone frame, slide CTA */
export const MobileBankingApp: Story = {
  args: {
    eyebrow: "Available on iOS and Android",
    headline: "A bank that closes its account-opening flow in four taps.",
    highlightWord: "four taps",
    subheadline:
      "No paper, no notary, no in-branch visit. Open an account from the couch in the time it takes to reheat coffee.",
    ctaText: "Get the app",
    ctaUrl: "/download",
    ctaStyle: "slide",
    ctaColorScheme: "accent",
    secondaryCtaText: "See fees",
    secondaryCtaUrl: "/pricing",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "accent",
    screenshotImage: "https://picsum.photos/seed/banking-app-screen/720/1520",
    screenshotAlt: "Mobile banking dashboard with account balance",
    deviceFrame: "phone",
    trustBadges: [
      { label: "FDIC member", caption: "deposits to $250k" },
      { label: "73,418 customers", caption: "as of last month" },
    ],
    showAccentGlow: true,
  },
};

/** Design tool — macbook frame, arrow CTA */
export const DesignTool: Story = {
  args: {
    eyebrow: "Now in public beta",
    headline: "Design files that don't break when someone pushes to main.",
    highlightWord: "main",
    subheadline:
      "Cordial Canvas branches your design files like git, merges them like git, and resolves conflicts with a real diff view instead of seven Slack threads.",
    ctaText: "Try the beta",
    ctaUrl: "/beta",
    ctaStyle: "arrow",
    ctaColorScheme: "primary",
    secondaryCtaText: "Watch the changelog",
    secondaryCtaUrl: "/changelog",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    screenshotImage: "https://picsum.photos/seed/canvas-design-tool/1280/800",
    screenshotAlt: "Cordial Canvas branching diff view",
    deviceFrame: "macbook",
    trustBadges: [
      { label: "Linear, Loom, Stripe", caption: "early adopters" },
      { label: "v0.9.4", caption: "shipped 2 days ago" },
    ],
    showAccentGlow: true,
  },
};

/** Field-ops tablet app — tablet frame, dotExpand CTA */
export const FieldOpsTablet: Story = {
  args: {
    eyebrow: "Built for the warehouse floor",
    headline: "Inventory counts that survive a forklift.",
    subheadline:
      "Rugged tablet UI, offline-first sync, and barcode scanning that works through plastic wrap. Pilots running at three Brazilian distribution centers.",
    ctaText: "Pilot in your DC",
    ctaUrl: "/pilot",
    ctaStyle: "dotExpand",
    ctaColorScheme: "secondary",
    secondaryCtaText: "Hardware specs",
    secondaryCtaUrl: "/hardware",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    screenshotImage: "https://picsum.photos/seed/inventory-tablet-app/1024/768",
    screenshotAlt: "Tablet warehouse inventory app with scanner panel",
    deviceFrame: "tablet",
    trustBadges: [
      { label: "Loggi, Magalu, Madeira", caption: "active pilots" },
      { label: "47.2% lift", caption: "in count accuracy" },
    ],
    showAccentGlow: false,
  },
};

/** Marketing analytics — browser frame, no badges, neutral scheme */
export const MarketingAnalytics: Story = {
  args: {
    eyebrow: "v4.2 — campaign attribution",
    headline: "Find the channel that actually paid for your last hire.",
    highlightWord: "actually",
    subheadline:
      "Cordial Attribute reconciles seven analytics tools into one honest revenue waterfall. The only thing it doesn't do is make the answer flattering.",
    ctaText: "Connect your stack",
    ctaUrl: "/connect",
    ctaStyle: "default",
    ctaColorScheme: "neutral",
    secondaryCtaText: "See sample report",
    secondaryCtaUrl: "/sample",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    screenshotImage:
      "https://picsum.photos/seed/attribution-dashboard/1280/800",
    screenshotAlt: "Marketing attribution waterfall dashboard",
    deviceFrame: "browser",
    browserUrl: "app.cordialattribute.com/q3",
    showAccentGlow: true,
  },
};
