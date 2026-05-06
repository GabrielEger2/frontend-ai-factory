import type { Meta, StoryObj } from "@storybook/react";
import ContactBookingEmbed from "./index";

const meta: Meta<typeof ContactBookingEmbed> = {
  title: "Contact/ContactBookingEmbed",
  component: ContactBookingEmbed,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof ContactBookingEmbed>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** B2B SaaS — sales call, Cal.com */
export const SaasSalesCall: Story = {
  args: {
    eyebrow: "Talk to a human",
    headline: "Book thirty minutes with the team that ships the platform",
    description:
      "Engineers and product on the call — no pre-sales gatekeeping. We'll cover your stack, the data path, and how onboarding actually works.",
    embedUrl: "https://cal.com/team/northbeam/intro?embed=true",
    providerLabel: "Powered by Cal.com",
    details: [
      {
        icon: "clock",
        label: "30 minutes",
        description: "Honest about cutoffs — we end on the dot.",
      },
      {
        icon: "video",
        label: "Google Meet",
        description: "Joining link arrives the moment you confirm.",
      },
      {
        icon: "check",
        label: "No follow-up sequence",
        description: "We'll send the Loom recording, then leave you alone.",
      },
    ],
    fallbackPromptText: "Or skip the calendar and reach the team directly:",
    fallbackEmailUrl: "mailto:hello@northbeam.example",
    fallbackEmailText: "Email hello@northbeam.example",
    fallbackCtaStyle: "default",
    fallbackCtaColorScheme: "neutral",
  },
};

/** Founder office hours — Calendly, drawOutline CTA, longer minimum height */
export const FounderOfficeHours: Story = {
  args: {
    eyebrow: "Founder office hours",
    headline: "Forty-five minutes with the founder, every other Wednesday",
    description:
      "First two slots each session are reserved for early-stage builders. Bring one specific question — we'll go deeper than a generic intro call.",
    embedUrl:
      "https://calendly.com/yuki-tanaka/office-hours?embed_domain=storybook&embed_type=Inline",
    providerLabel: "Powered by Calendly",
    embedMinHeight: 820,
    details: [
      {
        icon: "clock",
        label: "45 minutes",
        description: "Wednesdays 14:00-17:00 GMT-3.",
      },
      {
        icon: "video",
        label: "Zoom",
        description: "Link delivered with the calendar invite.",
      },
      {
        icon: "check",
        label: "One specific question",
        description: "Skim the docs first; we'll skip the obvious answers.",
      },
    ],
    fallbackPromptText:
      "If you only need a written nudge — we read everything that comes here:",
    fallbackEmailUrl: "mailto:office-hours@yukitanaka.example",
    fallbackEmailText: "Send a written question",
    fallbackCtaStyle: "drawOutline",
    fallbackCtaColorScheme: "primary",
  },
};

/** Therapy / coaching practice — softer copy, simple bullets */
export const CoachingIntake: Story = {
  args: {
    eyebrow: "Free intake call",
    headline: "Twenty minutes to see whether we're a fit",
    description:
      "We'll talk about what's been on your mind, what you've tried, and whether what I do is the right shape for it. No pressure to commit to ongoing sessions.",
    embedUrl: "https://cal.com/maria-cardoso/intake?embed=true&theme=light",
    providerLabel: "Powered by Cal.com",
    details: [
      {
        icon: "clock",
        label: "20 minutes",
        description: "Held twice a week, Tuesdays and Thursdays.",
      },
      {
        icon: "video",
        label: "Zoom or phone",
        description: "Whichever feels less performative for you.",
      },
      { icon: "check", label: "Free of charge" },
    ],
    fallbackPromptText: "Prefer to write first? Email is just as fine.",
    fallbackEmailUrl: "mailto:hi@cardoso.example",
    fallbackEmailText: "Write to me",
    fallbackCtaStyle: "default",
    fallbackCtaColorScheme: "primary",
  },
};

/** Press inquiries — short, glow CTA */
export const PressInquiries: Story = {
  args: {
    eyebrow: "Press & analyst inquiries",
    headline: "Schedule a press briefing",
    description:
      "Open to journalists, analysts, and podcasters covering platform engineering, infrastructure, or developer experience.",
    embedUrl: "https://cal.com/team/caldera/press?embed=true",
    providerLabel: "Powered by Cal.com",
    details: [
      { icon: "clock", label: "30 minutes" },
      { icon: "video", label: "On the record" },
      {
        icon: "check",
        label: "Embargo handling supported",
        description: "Mention it on the booking form and we'll honor it.",
      },
    ],
    fallbackPromptText: "Filing on a tight deadline? Skip the calendar:",
    fallbackEmailUrl: "mailto:press@caldera.example",
    fallbackEmailText: "Email press@caldera.example",
    fallbackCtaStyle: "glow",
    fallbackCtaColorScheme: "accent",
  },
};
