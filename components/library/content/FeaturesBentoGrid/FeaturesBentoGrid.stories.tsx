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
/*  CreatorToolsApp — 1 large + 4 small (5 items), glow CTA            */
/* ------------------------------------------------------------------ */

export const CreatorToolsApp: Story = {
  args: {
    eyebrow: "Built for Solo Operators",
    headline: "Run a one-person studio without losing the plot",
    subheadline:
      "Hexa pulls your thumbnails, scripts, releases, and revenue into one canvas so the part of the day you actually spend creating gets bigger.",
    features: [
      {
        size: "large",
        iconName: "FiVideo",
        accentScheme: "primary",
        title: "Edit, render, ship — without leaving the canvas",
        description:
          "Drop a 4K source in, scrub a rough cut on the timeline, and queue an export to YouTube and TikTok in the same window. No round trips through three apps and a shared drive.",
      },
      {
        size: "small",
        iconName: "FiClock",
        accentScheme: "secondary",
        title: "Batched scripting",
        description:
          "Group three weeks of episodes into one writing block — the outline view keeps callbacks straight.",
      },
      {
        size: "small",
        iconName: "FiBarChart2",
        accentScheme: "accent",
        title: "Numbers that don't lie",
        description:
          "Subscriber lift, watch-time delta, RPM by upload — refreshed every 12 minutes from the platforms directly.",
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
    ctaText: "Try Hexa free for 21 days",
    ctaUrl: "/start",
    ctaVariant: "glow",
    ctaColorScheme: "primary",
  },
};

/* ------------------------------------------------------------------ */
/*  LifestyleDtcBrand — 2 medium + 3 small (5 items), dotExpand CTA    */
/* ------------------------------------------------------------------ */

export const LifestyleDtcBrand: Story = {
  args: {
    eyebrow: "What's in the box",
    headline: "A bedroom kit that doesn't feel like a bedroom kit",
    subheadline:
      "Linen sheets, an alarm clock you can actually look at without flinching, and a lamp warm enough to wind down by. Sold once, kept forever.",
    features: [
      {
        size: "medium",
        iconName: "FiSun",
        accentScheme: "accent",
        title: "Stone-washed long-staple linen",
        description:
          "Heavyweight 195 gsm — softer after every wash. Comes in five quiet colors picked from old Portuguese tile work.",
      },
      {
        size: "medium",
        iconName: "FiClock",
        accentScheme: "primary",
        title: "Sunrise alarm, no glowing screen",
        description:
          "Wakes you with a 23-minute warm-light fade. The face is brushed brass with a single hour hand. That's it.",
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
    ctaText: "See the full kit",
    ctaUrl: "/the-kit",
    ctaVariant: "dotExpand",
    ctaColorScheme: "neutral",
  },
};

/* ------------------------------------------------------------------ */
/*  IndieGameStudio — 1 large + 2 medium + 4 small (7 items)           */
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
        accentScheme: "primary",
        title: "A coastline you actually want to get lost on",
        description:
          "We hand-painted 47 km of shoreline — tide pools, cliff caves, a lighthouse you can climb at any time of day. The sky has a real circadian cycle, weather rolls in from the west, and the fish are doing their own thing whether or not you're watching.",
      },
      {
        size: "medium",
        iconName: "FiUsers",
        accentScheme: "accent",
        title: "Nine NPCs with their own agendas",
        description:
          "Each one wakes up, works, eats, and goes to bed on their own schedule. Help one and the others notice. Ignore them and they keep moving anyway.",
      },
      {
        size: "medium",
        iconName: "FiMusic",
        accentScheme: "secondary",
        title: "An adaptive score by Inês Tavares",
        description:
          "73 tracks that fade between each other based on time of day, weather, and what you're doing. Recorded on a single piano in a Lisbon church.",
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
    ctaText: "Read the full devlog",
    ctaUrl: "/devlog/14",
    ctaVariant: "drawOutline",
    ctaColorScheme: "primary",
  },
};

/* ------------------------------------------------------------------ */
/*  EdtechPlatform — 1 large + 3 medium + 2 small (6 items), slide     */
/* ------------------------------------------------------------------ */

export const EdtechPlatform: Story = {
  args: {
    eyebrow: "For middle-school teachers",
    headline: "Less grading, more teaching",
    subheadline:
      "Lumen Lab gives you the boring half of the job back — auto-graded quizzes that actually parse short answers, attendance that syncs with your district, and a parent-comms inbox that drafts the first reply for you.",
    features: [
      {
        size: "large",
        iconName: "FiCheckCircle",
        accentScheme: "primary",
        title: "Short-answer auto-grading that doesn't need exact wording",
        description:
          "Our rubric model reads what the kid wrote, not what we hoped they'd write. It groups responses by reasoning pattern, flags the eight that need a human eye, and gives you a single screen to confirm the rest. Saves the average teacher 3.4 hours a week.",
      },
      {
        size: "medium",
        iconName: "FiCalendar",
        accentScheme: "secondary",
        title: "Attendance, synced",
        description:
          "Pulls from PowerSchool, Infinite Campus, and Skyward. No more typing the same names twice on Monday morning.",
      },
      {
        size: "medium",
        iconName: "FiMail",
        accentScheme: "accent",
        title: "Drafted parent emails",
        description:
          'Click a kid\'s name, hit "draft an update" — Lumen pulls recent grades, attendance, and behavior notes into a tone-checked first draft.',
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
    ctaText: "Book a 20-minute walkthrough",
    ctaUrl: "/walkthrough",
    ctaVariant: "slide",
    ctaColorScheme: "secondary",
  },
};

/* ------------------------------------------------------------------ */
/*  FintechConsumer — 2 large + 2 medium + 3 small (7 items), default  */
/* ------------------------------------------------------------------ */

export const FintechConsumer: Story = {
  args: {
    eyebrow: "Tilt — banking that explains itself",
    headline: "Money apps usually feel like spreadsheets. Tilt doesn't.",
    subheadline:
      "Built around the question your bank app should answer first: where did it actually go this month, and what should I do about it?",
    features: [
      {
        size: "large",
        iconName: "FiTrendingUp",
        accentScheme: "primary",
        title: "Spending broken down by what you'll actually recognize",
        description:
          'Not "Merchandise" and "Misc" — Tilt clusters your transactions by the actual habit behind them: weekday lunches, weekend bars, recurring subscriptions you forgot about. Tap any cluster to see the receipts and what changed since last month.',
      },
      {
        size: "small",
        iconName: "FiZap",
        accentScheme: "accent",
        title: "Instant transfers",
        description: "Friend-to-friend in under 6 seconds, even across banks.",
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
        accentScheme: "secondary",
        title: "Round-up savings, finally useful",
        description:
          "Round every purchase to the next dollar and we'll route the spare change to a goal you set — a flight, an emergency fund, whatever.",
      },
      {
        size: "medium",
        iconName: "FiUsers",
        accentScheme: "accent",
        title: "Shared pots for couples and roommates",
        description:
          "Joint mini-accounts for rent, utilities, and groceries — with a clean per-person view of who paid what.",
      },
      {
        size: "large",
        iconName: "FiShield",
        accentScheme: "primary",
        title: "Backed by a real bank, with deposits insured to $250K",
        description:
          "Tilt is a banking app, not a wallet. Your balance lives at our partner bank Cross River, FDIC-insured, and we never touch the principal. Two-factor login is on by default and we'll never ask for a code over the phone.",
      },
    ],
    ctaText: "Open an account",
    ctaUrl: "/open",
    ctaVariant: "default",
    ctaColorScheme: "primary",
  },
};
