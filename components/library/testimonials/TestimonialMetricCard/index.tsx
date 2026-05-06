"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TestimonialMetricCardItem {
  /** Numeric target value for the count-up (e.g. 47.2, 11, 3847) */
  metricValue: number;
  /** Decimal places to render. Defaults to 0 */
  metricDecimals?: number;
  /** Text rendered before the number (e.g. "$", "R$", "+") */
  metricPrefix?: string;
  /** Text rendered after the number (e.g. "%", "x", "K", " days") */
  metricSuffix?: string;
  /** Short metric label (e.g. "Pipeline lift", "Days to launch") */
  metricLabel: string;
  /** Optional secondary metric (e.g. "in 90 days") rendered as a small caption */
  metricCaption?: string;
  /** Pull-quote text */
  quote: string;
  /** Author full name */
  authorName: string;
  /** Author title / company */
  authorTitle: string;
  /** Optional author photo */
  authorImage?: string;
  /** Accessible alt for the author photo */
  authorImageAlt?: string;
  /** Optional company logo */
  companyLogo?: string;
  /** Accessible alt for the company logo */
  companyLogoAlt?: string;
}

export interface TestimonialMetricCardProps {
  /** Optional eyebrow */
  eyebrow?: string;
  /** Optional section headline */
  headline?: string;
  /** Optional supporting copy under the headline */
  subheadline?: string;
  /** 1-3 metric + testimonial pairs. Lays out as 1 / 2 / 3 columns. */
  items?: TestimonialMetricCardItem[];
  /** Animation duration in seconds for the metric count-up. Defaults to 2 */
  countUpDuration?: number;
  /**
   * "neutral" — bg-base-100 (default)
   * "muted" — bg-base-200 page surface
   * "inverse" — bg-base-content text-base-100, editorial slab
   */
  tone?: "neutral" | "muted" | "inverse";
  /** Site-wide visual configuration — accepted for API consistency */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS: TestimonialMetricCardItem[] = [
  {
    metricValue: 47.2,
    metricDecimals: 1,
    metricSuffix: "%",
    metricLabel: "Pipeline lift in Q1",
    metricCaption: "vs. prior-year baseline",
    quote:
      "Three weeks in, the platform team migrated 84 services without filing a single ticket against us. The redesign paid for itself before the next billing cycle.",
    authorName: "Mariana Cardoso",
    authorTitle: "VP Platform Engineering, Northbeam",
    authorImage: "https://picsum.photos/seed/metric-mariana-cardoso/120/120",
    authorImageAlt: "Mariana Cardoso",
  },
  {
    metricValue: 11,
    metricSuffix: " days",
    metricLabel: "Time from referral to care",
    metricCaption: "down from 47 days",
    quote:
      "Nothing about that would have happened without the protocol document the team handed us in the fourth week — written for our staff, not their template library.",
    authorName: "Dr. David Okafor",
    authorTitle: "CMO, Aurora Health Network",
    authorImage: "https://picsum.photos/seed/metric-david-okafor/120/120",
    authorImageAlt: "Dr. David Okafor",
  },
  {
    metricValue: 3847,
    metricSuffix: "",
    metricLabel: "Deliveries on launch day",
    metricCaption: "zero downtime, zero rollbacks",
    quote:
      "We charged the first order at 8:14am and didn't stop until midnight. The infrastructure never blinked.",
    authorName: "Bianca Okazaki",
    authorTitle: "Founder, Foxtrot Studio",
    authorImage: "https://picsum.photos/seed/metric-bianca-okazaki/120/120",
    authorImageAlt: "Bianca Okazaki",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function MetricValue({
  value,
  decimals,
  prefix,
  suffix,
  duration,
  isInverse,
  shouldReduceMotion,
}: {
  value: number;
  decimals: number;
  prefix?: string;
  suffix?: string;
  duration: number;
  isInverse: boolean;
  shouldReduceMotion: boolean | null;
}) {
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView || !numberRef.current) return;

    if (shouldReduceMotion) {
      numberRef.current.textContent = value.toFixed(decimals);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        if (!numberRef.current) return;
        numberRef.current.textContent = v.toFixed(decimals);
      },
    });

    return () => controls.stop();
  }, [value, decimals, duration, isInView, shouldReduceMotion]);

  return (
    <p
      ref={containerRef}
      className={cn(
        "font-semibold leading-none tracking-tight tabular-nums",
        "text-5xl md:text-6xl lg:text-[5rem]",
        isInverse ? "text-base-100" : "text-base-content",
      )}
    >
      {prefix && <span className="opacity-80">{prefix}</span>}
      <span ref={numberRef}>{(0).toFixed(decimals)}</span>
      {suffix && <span className="opacity-80">{suffix}</span>}
    </p>
  );
}

function MetricCard({
  item,
  index,
  countUpDuration,
  tone,
  shouldReduceMotion,
}: {
  item: TestimonialMetricCardItem;
  index: number;
  countUpDuration: number;
  tone: "neutral" | "muted" | "inverse";
  shouldReduceMotion: boolean | null;
}) {
  const safeImage = useSafeImageSrc(
    item.authorImage,
    `metric-${index}-${item.authorName}`,
    120,
    120,
  );
  const isInverse = tone === "inverse";

  /* Card surface — sits on top of the section surface, so we contrast lightly */
  const cardClass = cn(
    "relative flex h-full flex-col gap-6 rounded-2xl p-6 md:p-8",
    isInverse
      ? "bg-base-100/[0.06] ring-1 ring-base-100/15 backdrop-blur-sm"
      : tone === "muted"
        ? "bg-base-100 ring-1 ring-base-300"
        : "bg-base-200 ring-1 ring-base-300/70",
  );

  const labelColor = isInverse ? "text-base-100/65" : "text-base-content/65";
  const captionColor = isInverse ? "text-base-100/55" : "text-base-content/55";
  const ruleColor = isInverse ? "border-base-100/15" : "border-base-300";
  const quoteColor = isInverse ? "text-base-100" : "text-base-content";
  const authorColor = isInverse ? "text-base-100" : "text-base-content";
  const titleColor = isInverse ? "text-base-100/65" : "text-base-content/65";
  const ringColor = isInverse ? "ring-base-100/20" : "ring-base-300";

  return (
    <motion.figure
      className={cardClass}
      variants={{
        hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Metric block */}
      <div className="flex flex-col gap-2">
        <MetricValue
          value={item.metricValue}
          decimals={item.metricDecimals ?? 0}
          prefix={item.metricPrefix}
          suffix={item.metricSuffix}
          duration={countUpDuration}
          isInverse={isInverse}
          shouldReduceMotion={shouldReduceMotion}
        />
        <p
          className={cn(
            "text-sm font-medium uppercase tracking-[0.18em]",
            labelColor,
          )}
        >
          {item.metricLabel}
        </p>
        {item.metricCaption && (
          <p className={cn("text-xs", captionColor)}>{item.metricCaption}</p>
        )}
      </div>

      {/* Divider */}
      <div className={cn("border-t", ruleColor)} aria-hidden="true" />

      {/* Quote */}
      <blockquote
        className={cn(
          "text-base font-medium leading-snug md:text-lg",
          quoteColor,
        )}
      >
        <span aria-hidden="true" className="mr-1 opacity-30">
          &ldquo;
        </span>
        {item.quote}
        <span aria-hidden="true" className="ml-0.5 opacity-30">
          &rdquo;
        </span>
      </blockquote>

      {/* Author footer */}
      <figcaption className="mt-auto flex items-center gap-3">
        <img
          {...safeImage}
          alt={item.authorImageAlt ?? item.authorName}
          className={cn(
            "h-11 w-11 flex-shrink-0 rounded-full object-cover ring-1",
            ringColor,
          )}
          loading="lazy"
          width={44}
          height={44}
        />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className={cn("truncate text-sm font-semibold", authorColor)}>
            {item.authorName}
          </span>
          <span className={cn("truncate text-xs", titleColor)}>
            {item.authorTitle}
          </span>
        </span>
        {item.companyLogo && (
          <img
            src={item.companyLogo}
            alt={item.companyLogoAlt ?? `${item.authorName} company logo`}
            className={cn(
              "ml-auto h-5 w-auto",
              isInverse ? "opacity-85" : "opacity-65",
            )}
            loading="lazy"
          />
        )}
      </figcaption>
    </motion.figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TestimonialMetricCard -- testimonial paired with a quantified KPI outcome.
 * 1-3 cards; each card leads with a large count-up metric (animated on
 * scroll), then a hairline rule, then the customer quote and attribution.
 *
 * Use when the story is "what changed" — case studies whose proof is the
 * number, not the brand recognition.
 */
export default function TestimonialMetricCard({
  eyebrow,
  headline,
  subheadline,
  items = DEFAULT_ITEMS,
  countUpDuration = 2,
  tone = "neutral",
  className,
}: TestimonialMetricCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeItems = items.length > 0 ? items.slice(0, 3) : DEFAULT_ITEMS;
  const isInverse = tone === "inverse";

  const surfaceClass = cn(
    "w-full",
    tone === "neutral" && "bg-base-100",
    tone === "muted" && "bg-base-200",
    isInverse && "bg-base-content text-base-100",
  );

  const eyebrowColor = isInverse ? "text-base-100/55" : "text-primary";
  const headlineColor = isInverse ? "text-base-100" : "text-base-content";
  const subheadlineColor = isInverse
    ? "text-base-100/65"
    : "text-base-content/65";

  const gridColsClass =
    safeItems.length === 1
      ? "lg:grid-cols-1"
      : safeItems.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className={cn(surfaceClass, "py-16 md:py-20 lg:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {(eyebrow || headline || subheadline) && (
          <motion.div
            className="mb-12 flex max-w-2xl flex-col gap-3 md:mb-16"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {eyebrow && (
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.25em]",
                  eyebrowColor,
                )}
              >
                {eyebrow}
              </span>
            )}
            {headline && (
              <h2
                className={cn(
                  "text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl",
                  headlineColor,
                )}
              >
                {headline}
              </h2>
            )}
            {subheadline && (
              <p
                className={cn(
                  "max-w-[65ch] text-base md:text-lg",
                  subheadlineColor,
                )}
              >
                {subheadline}
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          className={cn("grid grid-cols-1 gap-6 md:gap-8", gridColsClass)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {safeItems.map((item, idx) => (
            <MetricCard
              key={`${item.authorName}-${idx}`}
              item={item}
              index={idx}
              countUpDuration={countUpDuration}
              tone={tone}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
