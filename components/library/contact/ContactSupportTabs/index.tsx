"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiHeadphones,
  FiHelpCircle,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiSmartphone,
  FiUser,
} from "react-icons/fi";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ContactSupportTabIcon =
  | "headphones"
  | "briefcase"
  | "user"
  | "help"
  | "smartphone"
  | "calendar";

export type ContactSupportChannelIcon =
  | "mail"
  | "phone"
  | "message"
  | "calendar";

export interface ContactSupportChannel {
  /** Pre-set icon */
  icon?: ContactSupportChannelIcon;
  /** Channel label (e.g. "Email", "Live chat", "Phone") */
  label: string;
  /** Channel value (e.g. "support@…", "+55 11 …", "Mon-Fri 9-18") */
  value: string;
  /** Optional href — if present, the row is a link */
  href?: string;
  /** Optional small caption (e.g. response SLA) */
  caption?: string;
}

export interface ContactSupportTab {
  /** Tab title (e.g. "Sales", "Support", "Press") */
  label: string;
  /** Pre-set icon — defaults to a question mark */
  icon?: ContactSupportTabIcon;
  /** Short description shown under the active tab title */
  description: string;
  /** 1-4 contact channels for this routing */
  channels: ContactSupportChannel[];
  /** Optional CTA at the bottom of the panel */
  ctaText?: string;
  /** CTA destination */
  ctaUrl?: string;
}

export interface ContactSupportTabsProps {
  /** Optional eyebrow rendered above the headline */
  eyebrow?: string;
  /** Section heading */
  headline: string;
  /** Supporting copy */
  description?: string;
  /** Tabs — typically 3-4 routing categories */
  tabs?: ContactSupportTab[];
  /** Index of the tab to show first */
  defaultTabIndex?: number;
  /** Visual variant for the in-panel CTA */
  ctaStyle?: CtaVariant;
  /** Color scheme for the in-panel CTA */
  ctaColorScheme?: ColorScheme;
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_TABS: ContactSupportTab[] = [
  {
    label: "Sales",
    icon: "briefcase",
    description:
      "For pricing, demos, and security reviews. We'll route you to the right account team within four hours.",
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
        caption: "Mon-Fri, 9am-6pm Pacific.",
      },
      {
        icon: "calendar",
        label: "Book a 30-min call",
        value: "northbeam.example/sales",
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
      "Bug reports, account issues, and how-do-I questions. Production-down tickets are routed straight to the on-call engineer.",
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
        caption: "Available Mon-Fri 8am-9pm UTC.",
      },
      {
        icon: "phone",
        label: "Production-down hotline",
        value: "+1 (415) 555-0188",
        href: "tel:+14155550188",
        caption: "On-call engineer answers, 24x7.",
      },
    ],
    ctaText: "Browse the docs",
    ctaUrl: "/docs",
  },
  {
    label: "Press",
    icon: "user",
    description:
      "Journalists, analysts, and podcasters covering platform engineering. Embargo handling supported on the booking form.",
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
        value: "northbeam.example/press",
        href: "https://cal.com/northbeam/press",
      },
    ],
    ctaText: "Download the press kit",
    ctaUrl: "/press-kit.zip",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const TAB_ICON_MAP: Record<ContactSupportTabIcon, typeof FiHelpCircle> = {
  headphones: FiHeadphones,
  briefcase: FiBriefcase,
  user: FiUser,
  help: FiHelpCircle,
  smartphone: FiSmartphone,
  calendar: FiCalendar,
};

const CHANNEL_ICON_MAP: Record<ContactSupportChannelIcon, typeof FiMail> = {
  mail: FiMail,
  phone: FiPhone,
  message: FiMessageSquare,
  calendar: FiCalendar,
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function TabPill({
  tab,
  isActive,
  onSelect,
  index,
}: {
  tab: ContactSupportTab;
  isActive: boolean;
  onSelect: () => void;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = TAB_ICON_MAP[tab.icon ?? "help"];

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`contact-support-panel-${index}`}
      id={`contact-support-tab-${index}`}
      onClick={onSelect}
      className={cn(
        "relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100 md:px-5 md:py-4",
        isActive
          ? "text-base-content"
          : "text-base-content/65 hover:bg-base-200 hover:text-base-content",
      )}
    >
      {isActive && (
        <motion.span
          layoutId="contact-support-active-bg"
          className="absolute inset-0 -z-0 rounded-xl bg-base-200 ring-1 ring-base-300"
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 400, damping: 32 }
          }
          aria-hidden="true"
        />
      )}
      <span
        className={cn(
          "relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          isActive
            ? "bg-primary/10 text-primary"
            : "bg-base-200 text-base-content/55",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="relative z-10 flex flex-col">
        <span className="text-sm font-semibold md:text-base">{tab.label}</span>
        <span className="line-clamp-1 text-xs text-base-content/55">
          {tab.description.split(".")[0]}
        </span>
      </span>
    </button>
  );
}

function ChannelRow({ channel }: { channel: ContactSupportChannel }) {
  const Icon = CHANNEL_ICON_MAP[channel.icon ?? "mail"];

  const inner = (
    <>
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-base-100 text-base-content ring-1 ring-base-300"
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-base-content/55">
          {channel.label}
        </span>
        <span className="text-sm font-medium text-base-content md:text-base">
          {channel.value}
        </span>
        {channel.caption && (
          <span className="text-xs text-base-content/55">
            {channel.caption}
          </span>
        )}
      </span>
      {channel.href && (
        <FiArrowRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 self-center text-base-content/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-base-content"
        />
      )}
    </>
  );

  if (channel.href) {
    const isExternal = channel.href.startsWith("http");
    return (
      <a
        href={channel.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-base-100"
      >
        {inner}
      </a>
    );
  }
  return <div className="flex items-start gap-3 p-3">{inner}</div>;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * ContactSupportTabs -- routing-style contact section. Multiple tabs
 * (Sales / Support / Press / Partnerships) each surface their own
 * channel list and a per-tab CTA. The visitor self-routes; the page
 * doesn't pretend they all read the same inbox.
 */
export default function ContactSupportTabs({
  eyebrow,
  headline,
  description,
  tabs = DEFAULT_TABS,
  defaultTabIndex = 0,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  className,
}: ContactSupportTabsProps) {
  const safeTabs = tabs.length > 0 ? tabs : DEFAULT_TABS;
  const initial = Math.min(Math.max(defaultTabIndex, 0), safeTabs.length - 1);
  const [activeIndex, setActiveIndex] = useState(initial);
  const shouldReduceMotion = useReducedMotion();

  const active = safeTabs[activeIndex];

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Header */}
        <motion.div
          className="mb-8 max-w-2xl md:mb-12"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              {eyebrow}
            </span>
          )}
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-base-content md:text-4xl">
            {headline}
          </h2>
          {description && (
            <p className="mt-3 text-base text-base-content/65 md:text-lg">
              {description}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_2fr)]">
          {/* Tab list */}
          <div
            role="tablist"
            aria-label="Support routing"
            className="flex flex-col gap-2"
          >
            {safeTabs.map((tab, idx) => (
              <TabPill
                key={tab.label}
                tab={tab}
                isActive={idx === activeIndex}
                onSelect={() => setActiveIndex(idx)}
                index={idx}
              />
            ))}
          </div>

          {/* Active panel */}
          <div className="min-h-[24rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                role="tabpanel"
                id={`contact-support-panel-${activeIndex}`}
                aria-labelledby={`contact-support-tab-${activeIndex}`}
                className="flex h-full flex-col gap-6 rounded-2xl bg-base-200 p-6 md:p-8"
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.2,
                  ease: "easeOut",
                }}
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-base-content md:text-2xl">
                    {active.label}
                  </h3>
                  <p className="text-sm text-base-content/65 md:text-base">
                    {active.description}
                  </p>
                </div>

                <div className="flex flex-col divide-y divide-base-300">
                  {active.channels.map((channel, idx) => (
                    <ChannelRow key={idx} channel={channel} />
                  ))}
                </div>

                {active.ctaText && active.ctaUrl && (
                  <div className="mt-auto self-start pt-2">
                    <CtaButton
                      variant={ctaStyle}
                      colorScheme={ctaColorScheme}
                      href={active.ctaUrl}
                    >
                      {active.ctaText}
                    </CtaButton>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
