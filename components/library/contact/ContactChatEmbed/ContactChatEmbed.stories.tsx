import type { Meta, StoryObj } from "@storybook/react";
import ContactChatEmbed from "./index";

const meta: Meta<typeof ContactChatEmbed> = {
  title: "Contact/ContactChatEmbed",
  component: ContactChatEmbed,
  parameters: { layout: "fullscreen" },
  argTypes: {
    provider: {
      control: "select",
      options: [
        "whatsapp",
        "intercom",
        "crisp",
        "messenger",
        "telegram",
        "livechat",
      ],
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
  },
};
export default meta;
type Story = StoryObj<typeof ContactChatEmbed>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** DTC apparel — WhatsApp-first support, fast median reply time */
export const ApparelWhatsapp: Story = {
  args: {
    eyebrow: "Customer care",
    headline: "Talk to a person, not a ticket queue",
    description:
      "Sizing, returns, restocks — our care team answers from Lisbon between 09:00 and 21:00, every day. The median reply is under five minutes.",
    provider: "whatsapp",
    ctaText: "Open WhatsApp",
    ctaUrl: "https://wa.me/351912345678?text=Hi%20there%20—",
    ctaStyle: "glow",
    ctaColorScheme: "primary",
    secondaryCtaText: "Or email care@labelhouse.example",
    secondaryCtaUrl: "mailto:care@labelhouse.example",
    trustRows: [
      {
        icon: "clock",
        label: "Median reply: 4 minutes",
        description: "Measured over the last 90 days, 09:00-21:00 WET.",
      },
      {
        icon: "users",
        label: "Real humans, in-house team",
        description: "Never offshored, never AI-routed without disclosure.",
      },
      {
        icon: "heart",
        label: "Free returns within 30 days",
        description: "Including any item we discussed in the chat.",
      },
    ],
    agent: {
      name: "Marina, Customer Care",
      role: "Lead, EU returns desk",
    },
    statusLabel: "Online now",
    previewMessages: [
      { from: "agent", text: "Hi! Looking for a size, restock, or return?" },
      {
        from: "agent",
        text: "I can pull stock on any colourway and tell you the next drop date.",
      },
    ],
  },
};

/** B2B SaaS — Intercom, drawOutline CTA, calm corporate tone */
export const SaasIntercom: Story = {
  args: {
    eyebrow: "Talk to product",
    headline: "Chat with the engineers shipping the platform",
    description:
      "Implementation questions, integration scoping, or a quick gut-check on whether we're a fit — engineers and PMs share the inbox. No SDR routing.",
    provider: "intercom",
    providerLabel: "Intercom Messenger",
    ctaText: "Start a chat",
    ctaUrl: "https://intercom-app.example/start?company=northbeam",
    ctaStyle: "drawOutline",
    ctaColorScheme: "primary",
    secondaryCtaText: "Or book a 30-min call instead",
    secondaryCtaUrl: "/book",
    trustRows: [
      {
        icon: "zap",
        label: "First reply within the hour",
        description:
          "Mon-Fri, 08:00-19:00 CET. Off-hours questions get triaged the next morning.",
      },
      {
        icon: "users",
        label: "You'll talk to engineering",
        description:
          "Solutions engineers on rotation — no pre-qualification gate.",
      },
      {
        icon: "shield",
        label: "Under NDA by default",
        description: "We'll never share the chat outside the named team.",
      },
    ],
    agent: {
      name: "Daniel, Solutions Engineering",
      role: "On rotation today",
    },
    statusLabel: "Replying now",
    previewMessages: [
      {
        from: "agent",
        text: "Hey — happy to dig into the integration question.",
      },
      { from: "agent", text: "Are you on Postgres or BigQuery as the source?" },
    ],
  },
};

/** Real-estate brokerage — Telegram, named agent, conversational copy */
export const RealEstateTelegram: Story = {
  args: {
    eyebrow: "Property concierge",
    headline: "Chat with the buyer's agent who actually knows the building",
    description:
      "Send a Telegram message about any listing on the site — Carla replies with the floor-plan PDF, the building's HOA notes, and what the neighbours are quietly saying.",
    provider: "telegram",
    ctaText: "Message on Telegram",
    ctaUrl: "https://t.me/carla_porto_imoveis",
    ctaStyle: "slide",
    ctaColorScheme: "accent",
    secondaryCtaText: "Or schedule a viewing",
    secondaryCtaUrl: "/viewings",
    trustRows: [
      {
        icon: "clock",
        label: "Replies between 08:00 and 22:00",
        description:
          "Weekends included — viewings often happen Saturday morning.",
      },
      {
        icon: "users",
        label: "One agent, end-to-end",
        description: "From first message through closing — no handoff churn.",
      },
      {
        icon: "check",
        label: "Floor plans on request",
        description: "Asked once and pinned in the chat for later.",
      },
    ],
    agent: {
      name: "Carla Mendes",
      role: "Buyer's agent — Porto centro",
    },
    statusLabel: "Online — 5 min reply",
    previewMessages: [
      {
        from: "agent",
        text: "Olá! Are you looking in Foz, Bonfim, or central?",
      },
      {
        from: "agent",
        text: "Tell me the budget ceiling and a must-have — I'll pull three matches before tomorrow.",
      },
    ],
  },
};

/** Healthcare clinic — Crisp, careful tone, slower reply window */
export const ClinicCrisp: Story = {
  args: {
    eyebrow: "Patient support",
    headline:
      "Message the clinic before booking — we'll help you find the right specialist",
    description:
      "Not sure if it's the dermatologist or the allergist you need? Send a short message and our patient care team will route you to the right consultation in under 24 hours.",
    provider: "crisp",
    ctaText: "Message patient support",
    ctaUrl: "https://app.crisp.chat/website/abc123/inbox",
    ctaStyle: "default",
    ctaColorScheme: "neutral",
    secondaryCtaText: "Urgent? Call (+351) 220 555 100",
    secondaryCtaUrl: "tel:+351220555100",
    trustRows: [
      {
        icon: "clock",
        label: "Reply within 24 hours",
        description: "Mon-Sat, 09:00-18:00. Urgent cases call the clinic line.",
      },
      {
        icon: "shield",
        label: "Confidential and HIPAA-aligned",
        description: "Patient records never leave the clinic's secure inbox.",
      },
      {
        icon: "heart",
        label: "Triage by a registered nurse",
        description: "Not a chatbot — the first responder is clinical staff.",
      },
    ],
    agent: {
      name: "Sofia, Patient Care",
      role: "Registered nurse on duty",
    },
    statusLabel: "Replies in under 24h",
    showStatusPulse: false,
    previewMessages: [
      {
        from: "agent",
        text: "Welcome — happy to help you find the right specialist.",
      },
      {
        from: "agent",
        text: "What symptoms are you considering, and how long have they been present?",
      },
    ],
    showTypingIndicator: false,
  },
};

/** Restaurant — Messenger, playful tone, cheerful copy */
export const RestaurantMessenger: Story = {
  args: {
    eyebrow: "Reservations & private dining",
    headline: "Send us a message — we'll save you the right table",
    description:
      "Birthdays, business lunches, or a quiet table for two — message us on Messenger and we'll confirm in under fifteen minutes during service hours.",
    provider: "messenger",
    ctaText: "Open Messenger",
    ctaUrl: "https://m.me/casadelmar.lisboa",
    ctaStyle: "dotExpand",
    ctaColorScheme: "secondary",
    secondaryCtaText: "Or call (+351) 213 456 789",
    secondaryCtaUrl: "tel:+351213456789",
    trustRows: [
      {
        icon: "zap",
        label: "Confirmed in 15 minutes",
        description: "During service: 12:00-15:30 and 19:00-23:00.",
      },
      {
        icon: "heart",
        label: "Allergies handled gladly",
        description:
          "Mention them in the chat and chef will brief the kitchen.",
      },
      {
        icon: "users",
        label: "Up to 24 guests for private dining",
        description: "The mezzanine room is reservable through the chat.",
      },
    ],
    agent: {
      name: "Tiago, Maître",
      role: "Front of house",
    },
    statusLabel: "Online — service hours",
    previewMessages: [
      {
        from: "agent",
        text: "Olá! Looking for a table tonight or planning ahead?",
      },
      {
        from: "agent",
        text: "Tell me the date, time, and number of guests and I'll confirm right away.",
      },
    ],
  },
};
