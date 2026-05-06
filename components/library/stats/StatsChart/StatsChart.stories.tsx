import type { Meta, StoryObj } from "@storybook/react";
import StatsChart from "./index";

const meta: Meta<typeof StatsChart> = {
  title: "Stats/StatsChart",
  component: StatsChart,
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: { control: "select", options: ["bars", "sparkline"] },
    sparklineTrendDirection: {
      control: "select",
      options: ["up", "down", "flat"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof StatsChart>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Sales-ops case study — bar chart, four metrics */
export const SalesOpsResults: Story = {
  args: {
    eyebrow: "Case study",
    headline: "Six months after the rebuild, the numbers settled here",
    description:
      "We instrumented the funnel before launch, then re-measured at the 90 and 180 day marks. The deltas held; the team kept the playbook.",
    variant: "bars",
    bars: [
      {
        label: "Lead-to-meeting conversion",
        value: 47.2,
        suffix: "%",
        decimals: 1,
        caption: "Q4 2025 vs. Q4 2024",
        tone: "primary",
      },
      {
        label: "Reply rate on warm sequences",
        value: 38.6,
        suffix: "%",
        decimals: 1,
        caption: "trailing 90 days",
        tone: "primary",
      },
      {
        label: "Average days in pipeline",
        value: 19,
        suffix: "d",
        caption: "down from 31d in Q1",
        tone: "accent",
      },
      {
        label: "Pipeline meetings booked",
        value: 1284,
        caption: "Jan-Nov 2025",
        tone: "neutral",
      },
    ],
    footnote:
      "Source: Internal dashboard, audited by RG Advisory in November 2025.",
  },
};

/** Annual recurring revenue — sparkline trend */
export const AnnualRecurringRevenue: Story = {
  args: {
    eyebrow: "Trailing twelve months",
    headline: "ARR clears $1.4M for the first time",
    description:
      "Eight straight months of expansion revenue from existing logos, plus a steady run of mid-market wins. Numbers updated nightly from Stripe.",
    variant: "sparkline",
    sparklineMetric: "$1.42M",
    sparklineCaption: "Trailing twelve-month annual recurring revenue",
    sparklineTrend: "+38.2% YoY",
    sparklineTrendDirection: "up",
    sparklinePoints: [
      { label: "Jan", value: 412 },
      { label: "Feb", value: 461 },
      { label: "Mar", value: 503 },
      { label: "Apr", value: 528 },
      { label: "May", value: 614 },
      { label: "Jun", value: 729 },
      { label: "Jul", value: 802 },
      { label: "Aug", value: 871 },
      { label: "Sep", value: 996 },
      { label: "Oct", value: 1124 },
      { label: "Nov", value: 1283 },
      { label: "Dec", value: 1421 },
    ],
    footnote: "Live data, refreshed at 03:00 UTC daily.",
  },
};

/** SRE / infra dashboard — descending trend, accent tone */
export const InfrastructureLatency: Story = {
  args: {
    eyebrow: "Q3 reliability brief",
    headline: "p95 latency keeps falling, quarter over quarter",
    description:
      "Edge cache hit ratio crossed 92% in August, which dragged the long-tail down faster than the SRE roadmap predicted.",
    variant: "sparkline",
    sparklineMetric: "184ms",
    sparklineCaption: "p95 API latency, rolling four-week average",
    sparklineTrend: "-27.4% QoQ",
    sparklineTrendDirection: "down",
    sparklinePoints: [
      { label: "W1", value: 261 },
      { label: "W2", value: 254 },
      { label: "W3", value: 248 },
      { label: "W4", value: 240 },
      { label: "W5", value: 235 },
      { label: "W6", value: 222 },
      { label: "W7", value: 217 },
      { label: "W8", value: 211 },
      { label: "W9", value: 203 },
      { label: "W10", value: 197 },
      { label: "W11", value: 189 },
      { label: "W12", value: 184 },
    ],
    footnote: "p95 is good when it falls. Lower is better.",
  },
};

/** Climate org impact — bar chart, neutral palette mix */
export const ClimateOrgImpact: Story = {
  args: {
    eyebrow: "2025 impact report",
    headline: "Where the year's funded restoration actually landed",
    description:
      "Numbers reconciled with on-the-ground partners in February 2026. Anything we couldn't independently verify, we left out.",
    variant: "bars",
    bars: [
      {
        label: "Hectares of mangrove restored",
        value: 3847,
        caption: "Pará and Maranhão coastline",
        tone: "primary",
      },
      {
        label: "Tonnes CO₂-eq sequestered (annualized)",
        value: 18420,
        caption: "third-party verified",
        tone: "primary",
      },
      {
        label: "Smallholder families on payout",
        value: 612,
        caption: "monthly stipend, 24-month commitment",
        tone: "accent",
      },
      {
        label: "Hectares preserved (no-deforestation MoU)",
        value: 11240,
        caption: "indigenous-led stewardship",
        tone: "neutral",
      },
    ],
    duration: 2.0,
    footnote: "Verified by Verra and Cerflor between Sep 2025 and Jan 2026.",
  },
};

/** Active users sparkline — flat trend after a flatline period */
export const SaasFlatPeriod: Story = {
  args: {
    eyebrow: "DAU benchmark",
    headline: "Daily active users plateau through the holiday quarter",
    description:
      "Expected — onboarding is paused for the December freeze. Pre-launch traffic resumes the second week of January.",
    variant: "sparkline",
    sparklineMetric: "47,318",
    sparklineCaption: "Daily active users, seven-day moving average",
    sparklineTrend: "+0.8% QoQ",
    sparklineTrendDirection: "flat",
    sparklinePoints: [
      { label: "Oct 1", value: 46210 },
      { label: "Oct 8", value: 46415 },
      { label: "Oct 15", value: 46802 },
      { label: "Oct 22", value: 47018 },
      { label: "Oct 29", value: 47125 },
      { label: "Nov 5", value: 47208 },
      { label: "Nov 12", value: 47241 },
      { label: "Nov 19", value: 47198 },
      { label: "Nov 26", value: 47284 },
      { label: "Dec 3", value: 47312 },
      { label: "Dec 10", value: 47305 },
      { label: "Dec 17", value: 47318 },
    ],
  },
};
