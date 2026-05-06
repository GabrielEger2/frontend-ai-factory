"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TimelineEvent {
  /** Time marker for the event — year, date, phase label, etc. */
  marker: string;
  /** Headline for this event. */
  title: string;
  /** Body copy describing what happened. */
  description: string;
  /** Optional metric or single fact to highlight (e.g. "+1,284 deliveries"). */
  metric?: string;
}

export interface VerticalTimelineSplitProps {
  /** Optional small kicker label shown above the headline. */
  eyebrow?: string;
  /** Lead headline — sticks on the left while the timeline scrolls. */
  headline: string;
  /** Supporting paragraph below the headline. */
  description: string;
  /** Optional CTA text shown beneath the description. */
  ctaText?: string;
  /** Optional CTA url shown beneath the description. */
  ctaUrl?: string;
  /** Ordered timeline events — render top to bottom. */
  events: TimelineEvent[];
  /** Background color scheme. */
  colorScheme?: "light" | "dark";
  /** Site-wide style configuration — provides ctaVariant and ctaColorScheme. */
  styleKit?: StyleKit;
  /** Informational purpose tag for the section. */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_EVENTS: TimelineEvent[] = [
  {
    marker: "2017",
    title: "Two engineers and a borrowed living room",
    description:
      "Beatriz Salles and Davi Albuquerque ship the first prototype out of an apartment in Pinheiros. The MVP is a CSV importer and a Stripe webhook listener.",
    metric: "MRR R$ 0",
  },
  {
    marker: "2019",
    title: "First enterprise contract — and the rewrite that paid for it",
    description:
      "A logistics company in Curitiba signs a three-year deal that requires SOC 2 evidence we did not have. We spend nine months replacing the proof-of-concept stack with the platform we still run today.",
    metric: "ARR R$ 1.4M",
  },
  {
    marker: "2022",
    title: "Series A and the first 50 hires we did not need",
    description:
      "We raise a R$ 84M Series A from Astella and Maya Capital. We hire too fast, ship too slowly for two quarters, and learn the lesson everyone warns about. By Q4 we are back to a weekly release cadence.",
    metric: "47 employees",
  },
  {
    marker: "2024",
    title: "Profitability without slowing the roadmap",
    description:
      "Q3 2024 closes with positive operating cash flow for the first time. We do it without freezing hiring or shelving the European expansion plan we announced in January.",
    metric: "ARR R$ 31.7M",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * VerticalTimelineSplit — a sticky narrative on the left, a vertical
 * timeline of events on the right. Built for company histories, product
 * changelogs at a glance, and roadmap reveals where the order matters.
 */
export default function VerticalTimelineSplit({
  eyebrow,
  headline,
  description,
  ctaText,
  ctaUrl,
  events = DEFAULT_EVENTS,
  colorScheme = "light",
  styleKit,
  purpose,
  className,
}: VerticalTimelineSplitProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDark = colorScheme === "dark";

  return (
    <section
      data-purpose={purpose}
      className={cn(
        "relative w-full overflow-hidden",
        isDark
          ? "bg-neutral text-neutral-content"
          : "bg-base-100 text-base-content",
        "py-16 md:py-24",
        className,
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:px-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
        {/* Sticky narrative column */}
        <motion.div
          className="lg:sticky lg:top-24 lg:self-start"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {eyebrow && (
            <motion.p
              variants={fadeUp}
              className={cn(
                "mb-4 text-xs font-semibold uppercase tracking-[0.3em]",
                isDark ? "text-primary" : "text-primary",
              )}
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h2
            variants={fadeUp}
            className={cn(
              "text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl",
              isDark ? "text-neutral-content" : "text-base-content",
            )}
          >
            {headline}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className={cn(
              "mt-5 max-w-md text-base leading-relaxed md:text-lg",
              isDark ? "text-neutral-content/70" : "text-base-content/70",
            )}
          >
            {description}
          </motion.p>

          {ctaText && ctaUrl && (
            <motion.div variants={fadeUp} className="mt-8">
              <CtaButton
                variant={styleKit?.ctaVariant ?? "default"}
                colorScheme={styleKit?.ctaColorScheme ?? "primary"}
                href={ctaUrl}
              >
                {ctaText}
              </CtaButton>
            </motion.div>
          )}
        </motion.div>

        {/* Timeline column */}
        <motion.ol
          className="relative"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          aria-label="Timeline of events"
        >
          {/* Vertical guide line */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-[7px] top-2 bottom-2 w-px",
              isDark ? "bg-neutral-content/15" : "bg-base-300",
            )}
          />

          {events.map((event, i) => (
            <motion.li
              key={i}
              variants={fadeUp}
              className="relative pl-10 md:pl-12"
            >
              {/* Node */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-2 inline-block h-4 w-4 rounded-full border-2",
                  isDark
                    ? "border-primary bg-neutral"
                    : "border-primary bg-base-100",
                )}
              />
              <span
                aria-hidden="true"
                className="absolute left-[5px] top-[14px] inline-block h-1.5 w-1.5 rounded-full bg-primary"
              />

              <div className="pb-12 md:pb-14">
                <div className="mb-3 flex flex-wrap items-baseline gap-3">
                  <span
                    className={cn(
                      "font-mono text-sm font-semibold tracking-wide",
                      isDark ? "text-primary" : "text-primary",
                    )}
                  >
                    {event.marker}
                  </span>
                  {event.metric && (
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 font-mono text-xs",
                        isDark
                          ? "bg-neutral-content/10 text-neutral-content/80"
                          : "bg-base-200 text-base-content/70",
                      )}
                    >
                      {event.metric}
                    </span>
                  )}
                </div>

                <h3
                  className={cn(
                    "text-xl font-semibold leading-tight md:text-2xl",
                    isDark ? "text-neutral-content" : "text-base-content",
                  )}
                >
                  {event.title}
                </h3>

                <p
                  className={cn(
                    "mt-3 max-w-xl text-base leading-relaxed",
                    isDark ? "text-neutral-content/70" : "text-base-content/70",
                  )}
                >
                  {event.description}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
