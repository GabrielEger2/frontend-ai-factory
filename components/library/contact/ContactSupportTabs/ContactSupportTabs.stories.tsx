import type { Meta, StoryObj } from "@storybook/react";
import ContactSupportTabs from "./index";

const meta: Meta<typeof ContactSupportTabs> = {
  title: "Contact/ContactSupportTabs",
  component: ContactSupportTabs,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof ContactSupportTabs>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** B2B SaaS — sales / support / press / partnerships */
export const SaasFourLanes: Story = {
  args: {
    eyebrow: "How to reach us",
    headline: "Pick the lane — we read all four, but routing helps",
    description:
      "Submitting through the right channel cuts the average reply time roughly in half. The badge next to each one is the actual SLA we hit.",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    tabs: [
      {
        label: "Sales",
        icon: "briefcase",
        description:
          "For pricing, demos, and security reviews. We'll route you to the right account team within four business hours.",
        channels: [
          {
            icon: "mail",
            label: "Email",
            value: "sales@northbeam.example",
            href: "mailto:sales@northbeam.example",
            caption: "Reply within 4 business hours.",
          },
          {
            icon: "phone",
            label: "Phone",
            value: "+1 (415) 555-0142",
            href: "tel:+14155550142",
            caption: "Mon-Fri 9am-6pm Pacific.",
          },
          {
            icon: "calendar",
            label: "Book a 30-min call",
            value: "cal.com/northbeam/sales",
            href: "https://cal.com/northbeam/sales",
          },
        ],
        ctaText: "Open the pricing page",
        ctaUrl: "/pricing",
      },
      {
        label: "Support",
        icon: "headphones",
        description:
          "Bug reports, account issues, and how-do-I questions. Production-down tickets reach the on-call engineer immediately.",
        channels: [
          {
            icon: "mail",
            label: "Email",
            value: "support@northbeam.example",
            href: "mailto:support@northbeam.example",
            caption: "Reply within 24 hours, faster on paid plans.",
          },
          {
            icon: "message",
            label: "Live chat",
            value: "Inside the dashboard",
            href: "/dashboard",
            caption: "Mon-Fri 8am-9pm UTC.",
          },
          {
            icon: "phone",
            label: "Production-down hotline",
            value: "+1 (415) 555-0188",
            href: "tel:+14155550188",
            caption: "On-call answers 24x7.",
          },
        ],
        ctaText: "Browse the docs",
        ctaUrl: "/docs",
      },
      {
        label: "Press",
        icon: "user",
        description:
          "Journalists, analysts, and podcasters covering platform engineering. Embargo handling supported.",
        channels: [
          {
            icon: "mail",
            label: "Email",
            value: "press@northbeam.example",
            href: "mailto:press@northbeam.example",
            caption: "Reply within one business day.",
          },
          {
            icon: "calendar",
            label: "Schedule a briefing",
            value: "cal.com/northbeam/press",
            href: "https://cal.com/northbeam/press",
          },
        ],
        ctaText: "Download the press kit",
        ctaUrl: "/press-kit.zip",
      },
      {
        label: "Partnerships",
        icon: "user",
        description:
          "Integration partners, channel resellers, and joint go-to-market. Briefly tell us what you're building.",
        channels: [
          {
            icon: "mail",
            label: "Email",
            value: "partners@northbeam.example",
            href: "mailto:partners@northbeam.example",
            caption: "Reply within five business days.",
          },
          {
            icon: "calendar",
            label: "Book an exploratory call",
            value: "cal.com/northbeam/partners",
            href: "https://cal.com/northbeam/partners",
          },
        ],
        ctaText: "See active integrations",
        ctaUrl: "/integrations",
      },
    ],
  },
};

/** Marketplace — buyer / seller / disputes */
export const MarketplaceTrust: Story = {
  args: {
    eyebrow: "Talk to a human",
    headline: "Three lanes — pick the one that fits what's going on",
    description:
      "Most messages get answered the same day. Disputes go to a dedicated trust-and-safety reviewer assigned within 24 hours.",
    defaultTabIndex: 1,
    ctaStyle: "default",
    ctaColorScheme: "primary",
    tabs: [
      {
        label: "Buyers",
        icon: "user",
        description:
          "Order issues, refunds, and shipping. Late-shipment refunds clear automatically — no message needed.",
        channels: [
          {
            icon: "message",
            label: "Live chat",
            value: "From the order page",
            href: "/orders",
            caption: "Mon-Sun 6am-midnight UTC.",
          },
          {
            icon: "mail",
            label: "Email",
            value: "buyers@marketplace.example",
            href: "mailto:buyers@marketplace.example",
            caption: "Reply within 12 hours.",
          },
        ],
      },
      {
        label: "Sellers",
        icon: "briefcase",
        description:
          "Listings, payouts, and store help. Payouts in motion get priority routing during business hours.",
        channels: [
          {
            icon: "mail",
            label: "Email",
            value: "sellers@marketplace.example",
            href: "mailto:sellers@marketplace.example",
            caption: "Reply within 6 business hours.",
          },
          {
            icon: "calendar",
            label: "Open seller office hours",
            value: "Tuesdays 14:00-15:30 UTC",
            href: "/sellers/office-hours",
          },
        ],
        ctaText: "Read the seller handbook",
        ctaUrl: "/sellers/handbook",
      },
      {
        label: "Disputes",
        icon: "help",
        description:
          "Open or appeal a dispute. A trust-and-safety reviewer is assigned within 24 hours and posts findings inside the dispute thread.",
        channels: [
          {
            icon: "message",
            label: "Open a dispute",
            value: "From the relevant order page",
            href: "/orders",
          },
          {
            icon: "mail",
            label: "Appeals",
            value: "appeals@marketplace.example",
            href: "mailto:appeals@marketplace.example",
            caption: "Within 7 days of a closed dispute.",
          },
        ],
        ctaText: "Read the dispute policy",
        ctaUrl: "/policies/disputes",
      },
    ],
  },
};

/** Solo founder — careers / press / hello, friendly tone */
export const SoloFounder: Story = {
  args: {
    headline: "Three things I read, in this order",
    description:
      "I'm one human. I'd rather you reach the right inbox than send the same message four times.",
    ctaStyle: "drawOutline",
    ctaColorScheme: "primary",
    tabs: [
      {
        label: "Hello",
        icon: "user",
        description:
          "Reader notes, kind words, and 'I think you should write about X' — these are my favorite emails.",
        channels: [
          {
            icon: "mail",
            label: "Email",
            value: "hello@yukitanaka.example",
            href: "mailto:hello@yukitanaka.example",
            caption: "I read everything; I reply when I can.",
          },
          {
            icon: "message",
            label: "Twitter / Bluesky",
            value: "@yukitanaka",
            href: "https://bsky.app/profile/yukitanaka.bsky.social",
          },
        ],
      },
      {
        label: "Press",
        icon: "user",
        description:
          "Interviews, podcasts, and quote requests. Send the angle and the deadline up front.",
        channels: [
          {
            icon: "mail",
            label: "Email",
            value: "press@yukitanaka.example",
            href: "mailto:press@yukitanaka.example",
            caption: "Reply within 2 business days.",
          },
        ],
        ctaText: "Speaker bio + headshots",
        ctaUrl: "/press",
      },
      {
        label: "Working with me",
        icon: "briefcase",
        description:
          "Workshops, advisory, and writing assignments. I take on five engagements a year — none in December.",
        channels: [
          {
            icon: "mail",
            label: "Email",
            value: "work@yukitanaka.example",
            href: "mailto:work@yukitanaka.example",
            caption: "Brief outline + budget = faster reply.",
          },
          {
            icon: "calendar",
            label: "Pre-book a discovery call",
            value: "cal.com/yukitanaka/discovery",
            href: "https://cal.com/yukitanaka/discovery",
          },
        ],
        ctaText: "Read the engagement note",
        ctaUrl: "/work",
      },
    ],
  },
};
