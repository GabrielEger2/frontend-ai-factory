import type { Meta, StoryObj } from "@storybook/react";
import FeaturesBentoGrid from "./index";

const meta: Meta<typeof FeaturesBentoGrid> = {
  title: "Content/FeaturesBentoGrid",
  component: FeaturesBentoGrid,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaVariant: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof FeaturesBentoGrid>;

/* ------------------------------------------------------------------ */
/*  CreatorToolsApp — full editorial framing: meta strip, per-tile     */
/*  metrics, footnote, pull-quote, metrics band, glow CTA              */
/* ------------------------------------------------------------------ */

export const CreatorToolsApp: Story = {
  args: {
    eyebrow: "Built for solo operators",
    headline: "Run a one-person studio without losing the plot",
    subheadline:
      "Hexa pulls your thumbnails, scripts, releases, and revenue into one canvas so the part of the day you actually spend creating gets bigger.",
    meta: [
      { label: "Stack", value: "macOS · iPad · Web" },
      { label: "Pricing", value: "Free 21 days · $14/mo after" },
      { label: "Built by", value: "Hexa Studio · Lisbon" },
      { label: "Verified by", value: "Creator Coalition Q1 review" },
    ],
    features: [
      {
        size: "large",
        iconName: "FiVideo",
        eyebrow: "Module 01 · Edit",
        accentScheme: "primary",
        title: "Edit, render, ship — without leaving the canvas",
        description:
          "Drop a 4K source in, scrub a rough cut on the timeline, and queue an export to YouTube and TikTok in the same window. No round trips through three apps and a shared drive.",
        bullets: [
          "Multi-track timeline with magnetic snap and J-cuts",
          "One-click vertical reframe for Shorts and TikTok",
          "Export queue runs in the background while you script",
        ],
        metric: { value: "3.4 hrs/wk", label: "Saved on round-tripping" },
      },
      {
        size: "small",
        iconName: "FiClock",
        accentScheme: "secondary",
        title: "Batched scripting",
        description:
          "Group three weeks of episodes into one writing block — the outline view keeps callbacks straight.",
        metric: { value: "2.7×", label: "Outline reuse rate" },
      },
      {
        size: "small",
        iconName: "FiBarChart2",
        accentScheme: "accent",
        title: "Numbers that don't lie",
        description:
          "Subscriber lift, watch-time delta, RPM by upload — refreshed every 12 minutes from the platforms directly.",
        metric: { value: "12 min", label: "Refresh window" },
      },
      {
        size: "small",
        iconName: "FiInbox",
        accentScheme: "primary",
        title: "Brand inbox, sorted",
        description:
          "Auto-tag sponsorship outreach by fit and budget so you stop re-reading the same boilerplate at 1 a.m.",
      },
      {
        size: "small",
        iconName: "FiArchive",
        accentScheme: "secondary",
        title: "Versioned everything",
        description:
          "Every cut, thumbnail, and caption is one click away — including the 11 thumbnails you tested last week.",
      },
    ],
    footnote:
      "Time-saved figures average across 1,847 active solo creators in the Q1 cohort, measured against the same workflow before Hexa import. Self-reported, sampled monthly, no aggregation across teams.",
    pullQuote: {
      quote:
        "I stopped opening four apps to ship one video. That's the whole pitch and it ended up being true.",
      attribution: "Mariana Cardoso",
      attributionMeta: "Documentary YouTuber · 218K subs",
    },
    metrics: [
      { value: "1,847", label: "Solo creators in Q1 cohort" },
      { value: "47.2%", label: "Lift in weekly upload cadence" },
      { value: "3.4 hrs", label: "Saved per week, on average" },
      { value: "11/12", label: "Stay subscribed past month three" },
    ],
    ctaText: "Try Hexa free for 21 days",
    ctaUrl: "/start",
    ctaVariant: "glow",
    ctaColorScheme: "primary",
  },
};

/* ------------------------------------------------------------------ */
/*  LifestyleDtcBrand — meta strip + footnote, no pull-quote/metrics,  */
/*  per-tile metrics on the larger tiles, dotExpand CTA                */
/* ------------------------------------------------------------------ */

export const LifestyleDtcBrand: Story = {
  args: {
    eyebrow: "What's in the box",
    headline: "A bedroom kit that doesn't feel like a bedroom kit",
    subheadline:
      "Linen sheets, an alarm clock you can actually look at without flinching, and a lamp warm enough to wind down by. Sold once, kept forever.",
    meta: [
      { label: "Pieces", value: "5 · sized for queen + king" },
      { label: "Lead time", value: "Ships in 4 days" },
      { label: "Made in", value: "Porto · Mexico City · Aveiro" },
      { label: "Returns", value: "60 nights, free pickup" },
    ],
    features: [
      {
        size: "medium",
        iconName: "FiSun",
        eyebrow: "Centrepiece",
        accentScheme: "accent",
        title: "Stone-washed long-staple linen",
        description:
          "Heavyweight 195 gsm — softer after every wash. Comes in five quiet colors picked from old Portuguese tile work.",
        metric: { value: "195 gsm", label: "Heavyweight, gets softer" },
      },
      {
        size: "medium",
        iconName: "FiClock",
        eyebrow: "Daily anchor",
        accentScheme: "primary",
        title: "Sunrise alarm, no glowing screen",
        description:
          "Wakes you with a 23-minute warm-light fade. The face is brushed brass with a single hour hand. That's it.",
        metric: { value: "23 min", label: "Light-fade wake cycle" },
      },
      {
        size: "small",
        iconName: "FiCoffee",
        accentScheme: "secondary",
        title: "Weighted ceramic mug",
        description: "Holds 11 oz, sits flat on uneven nightstands.",
      },
      {
        size: "small",
        iconName: "FiBookOpen",
        accentScheme: "accent",
        title: "Reading lamp",
        description: "Bias-tilt arm, 2700K bulb, copper-pull dimmer.",
      },
      {
        size: "small",
        iconName: "FiPackage",
        accentScheme: "primary",
        title: "Free returns, 60 days",
        description:
          "Sleep on the linens for two months. If the texture doesn't grow on you, we'll pick them up.",
      },
    ],
    footnote:
      "Linen weight measured per Oeko-Tex 100 certified mill spec. Wake-cycle figure based on factory default; configurable from 12 to 45 minutes in the companion app.",
    ctaText: "See the full kit",
    ctaUrl: "/the-kit",
    ctaVariant: "dotExpand",
    ctaColorScheme: "neutral",
  },
};

/* ------------------------------------------------------------------ */
/*  IndieGameStudio — pull-quote and metrics band, no meta strip; per- */
/*  tile metrics on the headline tiles, drawOutline CTA                */
/* ------------------------------------------------------------------ */

export const IndieGameStudio: Story = {
  args: {
    eyebrow: "Devlog 14",
    headline: "Why Drift Harbor took us four years and we're glad it did",
    subheadline:
      "We're a four-person team in Porto. We don't ship roadmaps, we ship the game. Here's what that actually meant in practice.",
    features: [
      {
        size: "large",
        iconName: "FiCompass",
        eyebrow: "Open world",
        accentScheme: "primary",
        title: "A coastline you actually want to get lost on",
        description:
          "We hand-painted 47 km of shoreline — tide pools, cliff caves, a lighthouse you can climb at any time of day. The sky has a real circadian cycle, weather rolls in from the west, and the fish are doing their own thing whether or not you're watching.",
        bullets: [
          "47 km of hand-painted shoreline, no procedural fill",
          "24-minute in-game day with real circadian shift",
          "Four weather systems that move with prevailing wind",
        ],
        metric: { value: "47 km", label: "Of hand-painted coastline" },
      },
      {
        size: "medium",
        iconName: "FiUsers",
        accentScheme: "accent",
        title: "Nine NPCs with their own agendas",
        description:
          "Each one wakes up, works, eats, and goes to bed on their own schedule. Help one and the others notice. Ignore them and they keep moving anyway.",
        metric: { value: "9", label: "NPCs with full daily routines" },
      },
      {
        size: "medium",
        iconName: "FiMusic",
        accentScheme: "secondary",
        title: "An adaptive score by Inês Tavares",
        description:
          "73 tracks that fade between each other based on time of day, weather, and what you're doing. Recorded on a single piano in a Lisbon church.",
        metric: { value: "73", label: "Adaptive piano tracks" },
      },
      {
        size: "small",
        iconName: "FiAnchor",
        accentScheme: "primary",
        title: "Sail mechanics that respect wind",
        description:
          "Real boat physics. Tack into the wind, ride a downwind run.",
      },
      {
        size: "small",
        iconName: "FiCloud",
        accentScheme: "accent",
        title: "Storm system",
        description: "Cross-seasonal pressure fronts. Don't sail through one.",
      },
      {
        size: "small",
        iconName: "FiCamera",
        accentScheme: "secondary",
        title: "Photo mode",
        description:
          "Free camera, 12 lens presets, no UI. Saves to your desktop.",
      },
      {
        size: "small",
        iconName: "FiMap",
        accentScheme: "primary",
        title: "No map markers",
        description: "You navigate by landmarks. We'll explain why.",
      },
    ],
    pullQuote: {
      quote:
        "Four years of nobody yelling at us about a roadmap is what made the coastline feel like a coastline.",
      attribution: "Rafael Tavares",
      attributionMeta: "Co-founder · Drift Harbor",
    },
    metrics: [
      { value: "4 yrs", label: "From first prototype to ship" },
      { value: "47 km", label: "Of coastline hand-painted" },
      { value: "73", label: "Original adaptive piano tracks" },
      { value: "0", label: "Microtransactions, ever" },
    ],
    ctaText: "Read the full devlog",
    ctaUrl: "/devlog/14",
    ctaVariant: "drawOutline",
    ctaColorScheme: "primary",
  },
};

/* ------------------------------------------------------------------ */
/*  EdtechPlatform — full editorial framing, slide CTA, per-tile       */
/*  metrics on the boring half so the saved-time pitch lands           */
/* ------------------------------------------------------------------ */

export const EdtechPlatform: Story = {
  args: {
    eyebrow: "For middle-school teachers",
    headline: "Less grading, more teaching",
    subheadline:
      "Lumen Lab gives you the boring half of the job back — auto-graded quizzes that actually parse short answers, attendance that syncs with your district, and a parent-comms inbox that drafts the first reply for you.",
    meta: [
      { label: "Districts", value: "412 across 9 states" },
      { label: "Grades", value: "5 – 8 · ELA · Math · Science" },
      { label: "Compliance", value: "FERPA · COPPA · SOC 2" },
      { label: "Pilot window", value: "Free through October" },
    ],
    features: [
      {
        size: "large",
        iconName: "FiCheckCircle",
        eyebrow: "Module 01 · Grading",
        accentScheme: "primary",
        title: "Short-answer auto-grading that doesn't need exact wording",
        description:
          "Our rubric model reads what the kid wrote, not what we hoped they'd write. It groups responses by reasoning pattern, flags the eight that need a human eye, and gives you a single screen to confirm the rest.",
        bullets: [
          "Trained on 1.4M graded short-answer responses",
          "Flags the 4–8 outliers per assignment for human review",
          "Confirm-or-edit screen averages 12 seconds per student",
        ],
        metric: { value: "3.4 hrs/wk", label: "Saved on grading, average" },
      },
      {
        size: "medium",
        iconName: "FiCalendar",
        eyebrow: "Module 02 · Roster",
        accentScheme: "secondary",
        title: "Attendance, synced",
        description:
          "Pulls from PowerSchool, Infinite Campus, and Skyward. No more typing the same names twice on Monday morning.",
        metric: { value: "3", label: "SIS integrations live, zero typing" },
      },
      {
        size: "medium",
        iconName: "FiMail",
        eyebrow: "Module 03 · Comms",
        accentScheme: "accent",
        title: "Drafted parent emails",
        description:
          'Click a kid\'s name, hit "draft an update" — Lumen pulls recent grades, attendance, and behavior notes into a tone-checked first draft.',
        metric: { value: "47%", label: "First-draft acceptance rate" },
      },
      {
        size: "medium",
        iconName: "FiBookmark",
        accentScheme: "primary",
        title: "Re-usable lesson library",
        description:
          "Save a lesson once, re-tag it for next year, and watch it adapt to your new roster's reading levels automatically.",
      },
      {
        size: "small",
        iconName: "FiShield",
        accentScheme: "secondary",
        title: "FERPA + COPPA compliant",
        description: "Audit logs, district SSO, no third-party trackers.",
      },
      {
        size: "small",
        iconName: "FiHelpCircle",
        accentScheme: "accent",
        title: "Live human support",
        description:
          "Chat opens at 7:15 a.m. Eastern. Real teachers, not bots.",
      },
    ],
    footnote:
      "Time-saved figures from a 412-teacher controlled cohort in spring 2024, measured against same teachers' grading and comms time the previous semester. Independent review by EdTech Insight Labs available on request.",
    pullQuote: {
      quote:
        "I got my Sunday afternoons back. That's not a feature, that's the whole product.",
      attribution: "Bianca Okazaki",
      attributionMeta: "7th-grade ELA · Aurora Public Schools",
    },
    metrics: [
      { value: "412", label: "Teachers in Q1 controlled cohort" },
      { value: "3.4 hrs", label: "Saved weekly on grading" },
      { value: "1.4M", label: "Short-answer responses trained on" },
      { value: "9 / 10", label: "Renew at end of pilot" },
    ],
    ctaText: "Book a 20-minute walkthrough",
    ctaUrl: "/walkthrough",
    ctaVariant: "slide",
    ctaColorScheme: "secondary",
  },
};

/* ------------------------------------------------------------------ */
/*  FintechConsumer — meta strip + pull-quote, no metrics band,        */
/*  per-tile metrics carry the regulatory weight, default CTA          */
/* ------------------------------------------------------------------ */

export const FintechConsumer: Story = {
  args: {
    eyebrow: "Tilt — banking that explains itself",
    headline: "Money apps usually feel like spreadsheets. Tilt doesn't.",
    subheadline:
      "Built around the question your bank app should answer first: where did it actually go this month, and what should I do about it?",
    meta: [
      { label: "Bank partner", value: "Cross River · FDIC #58410" },
      { label: "Insured to", value: "$250K per account" },
      { label: "Regulator", value: "Reg E · Reg DD compliant" },
      { label: "Founded", value: "2021 · Brooklyn, NY" },
    ],
    features: [
      {
        size: "large",
        iconName: "FiTrendingUp",
        eyebrow: "Module 01 · Insight",
        accentScheme: "primary",
        title: "Spending broken down by what you'll actually recognize",
        description:
          'Not "Merchandise" and "Misc" — Tilt clusters your transactions by the actual habit behind them: weekday lunches, weekend bars, recurring subscriptions you forgot about.',
        bullets: [
          "21 habit clusters tuned per user, not generic categories",
          "Tap any cluster to see the receipts and what changed",
          "Month-over-month delta surfaces in the home tile",
        ],
        metric: { value: "21", label: "Habit clusters per user" },
      },
      {
        size: "small",
        iconName: "FiZap",
        accentScheme: "accent",
        title: "Instant transfers",
        description: "Friend-to-friend in under 6 seconds, even across banks.",
        metric: { value: "5.8 s", label: "Median transfer time" },
      },
      {
        size: "small",
        iconName: "FiLock",
        accentScheme: "secondary",
        title: "Card freeze on tap",
        description: "Lost it at brunch? Long-press the card art, done.",
      },
      {
        size: "small",
        iconName: "FiBell",
        accentScheme: "primary",
        title: "Smart nudges, not nags",
        description: "Heads-up when a free trial is about to renew at $14.99.",
      },
      {
        size: "medium",
        iconName: "FiPieChart",
        eyebrow: "Module 02 · Save",
        accentScheme: "secondary",
        title: "Round-up savings, finally useful",
        description:
          "Round every purchase to the next dollar and we'll route the spare change to a goal you set — a flight, an emergency fund, whatever.",
        metric: { value: "$1,847", label: "Median saved in year one" },
      },
      {
        size: "medium",
        iconName: "FiUsers",
        accentScheme: "accent",
        title: "Shared pots for couples and roommates",
        description:
          "Joint mini-accounts for rent, utilities, and groceries — with a clean per-person view of who paid what.",
        metric: { value: "4", label: "Sub-pots per shared account" },
      },
      {
        size: "large",
        iconName: "FiShield",
        eyebrow: "Module 03 · Trust",
        accentScheme: "primary",
        title: "Backed by a real bank, with deposits insured to $250K",
        description:
          "Tilt is a banking app, not a wallet. Your balance lives at our partner bank Cross River, FDIC-insured, and we never touch the principal.",
        bullets: [
          "Two-factor login on by default, hardware key supported",
          "We will never ask for a code over the phone",
          "Open the audit trail for every action on your account",
        ],
        metric: { value: "$250K", label: "FDIC-insured deposit ceiling" },
      },
    ],
    footnote:
      "Tilt is a financial-technology company, not a bank; banking services provided by Cross River Bank, member FDIC. Insurance coverage applies to deposits at the partner bank up to the standard maximum, subject to aggregation rules.",
    pullQuote: {
      quote:
        "It's the first money app where I don't have to translate what it's telling me before I trust it.",
      attribution: "Henrique Salles",
      attributionMeta: "Tilt customer since March 2023",
    },
    ctaText: "Open an account",
    ctaUrl: "/open",
    ctaVariant: "default",
    ctaColorScheme: "primary",
  },
};
