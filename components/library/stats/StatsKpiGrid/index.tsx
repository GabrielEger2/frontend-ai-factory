"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface KpiItem {
  /** Numeric target — drives the count-up animation */
  value: number;
  /** Decimal places, default 0 */
  decimals?: number;
  /** Rendered before the number (e.g. "$", "R$") */
  prefix?: string;
  /** Rendered after the number (e.g. "%", "K", "M+") */
  suffix?: string;
  /** Headline label for the metric */
  label: string;
  /** Tiny supporting note rendered beneath the label */
  caption?: string;
  /**
   * Optional comparison delta — e.g. "+18.4%", "-3 pts".
   * Direction is inferred from the leading sign character; pass
   * trend explicitly to override.
   */
  delta?: string;
  /** "up" / "down" / "flat" — overrides the sign-based inference */
  trend?: "up" | "down" | "flat";
}

export interface StatsKpiGridProps {
  /** Small label rendered above the headline */
  label?: string;
  /** Section headline */
  headline?: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** KPI metrics — typically 3 to 6 */
  metrics?: KpiItem[];
  /**
   * "divided" — divider-line grouping, no boxes (default, density 7+)
   * "boxed" — subtle bordered cards on a base-200 surface
   */
  variant?: "divided" | "boxed";
  /** Optional context line shown beneath the grid (e.g. "Updated 2026-04-30") */
  footnote?: string;
  /** Animation duration in seconds. Defaults to 1.8 */
  duration?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_METRICS: KpiItem[] = [
  {
    value: 47.2,
    decimals: 1,
    suffix: "%",
    label: "Conversion lift",
    caption: "Vs. control variant, 28-day rolling window",
    delta: "+8.4 pts",
    trend: "up",
  },
  {
    value: 3847,
    label: "Deliveries this month",
    caption: "Across 38 metro areas",
    delta: "+12.1%",
    trend: "up",
  },
  {
    value: 1.42,
    decimals: 2,
    suffix: "s",
    label: "Median load time",
    caption: "P75 LCP across mobile sessions",
    delta: "-0.18s",
    trend: "up",
  },
  {
    value: 99.94,
    decimals: 2,
    suffix: "%",
    label: "Uptime",
    caption: "Trailing 90 days, region-weighted",
    delta: "0.00",
    trend: "flat",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface CountUpProps {
  value: number;
  decimals: number;
  duration: number;
  reduced: boolean;
}

function CountUp({ value, decimals, duration, reduced }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!ref.current) return;
    if (reduced || !isInView) {
      ref.current.textContent = value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate(v) {
        if (!ref.current) return;
        ref.current.textContent = v.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      },
    });
    return () => controls.stop();
  }, [value, decimals, duration, reduced, isInView]);

  return <span ref={ref}>0</span>;
}

interface DeltaPillProps {
  delta: string;
  trend: "up" | "down" | "flat";
}

function DeltaPill({ delta, trend }: DeltaPillProps) {
  const isUp = trend === "up";
  const isDown = trend === "down";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs font-medium tabular-nums",
        isUp && "bg-success/10 text-success",
        isDown && "bg-error/10 text-error",
        !isUp && !isDown && "bg-base-200 text-base-content/60",
      )}
      aria-label={`Trend ${trend}, change ${delta}`}
    >
      {isUp && <FiArrowUpRight className="h-3 w-3" aria-hidden="true" />}
      {isDown && <FiArrowDownRight className="h-3 w-3" aria-hidden="true" />}
      <span>{delta}</span>
    </span>
  );
}

function inferTrend(item: KpiItem): "up" | "down" | "flat" {
  if (item.trend) return item.trend;
  if (!item.delta) return "flat";
  const trimmed = item.delta.trim();
  if (trimmed.startsWith("+")) return "up";
  if (trimmed.startsWith("-")) return "down";
  return "flat";
}

interface KpiCellProps {
  item: KpiItem;
  duration: number;
  reduced: boolean;
  variant: "divided" | "boxed";
}

function KpiCell({ item, duration, reduced, variant }: KpiCellProps) {
  const trend = inferTrend(item);
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "flex flex-col gap-2 px-6 py-6 md:py-8",
        variant === "boxed" &&
          "rounded-2xl border border-base-300 bg-base-100 px-6 py-6",
      )}
    >
      <div className="flex items-baseline gap-3">
        <p className="font-mono text-4xl font-semibold tracking-tight tabular-nums text-base-content md:text-5xl">
          {item.prefix && <span className="mr-0.5">{item.prefix}</span>}
          <CountUp
            value={item.value}
            decimals={item.decimals ?? 0}
            duration={duration}
            reduced={reduced}
          />
          {item.suffix && (
            <span className="ml-0.5 text-2xl text-base-content/60 md:text-3xl">
              {item.suffix}
            </span>
          )}
        </p>
        {item.delta && <DeltaPill delta={item.delta} trend={trend} />}
      </div>
      <p className="text-sm font-medium text-base-content">{item.label}</p>
      {item.caption && (
        <p className="text-xs leading-relaxed text-base-content/55">
          {item.caption}
        </p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * StatsKpiGrid — dashboard-density metric grid with monospaced numerals
 * and trend deltas. Uses divider-line grouping by default (no boxes)
 * to satisfy the high-density / no-card-overuse rule.
 */
export default function StatsKpiGrid({
  label,
  headline,
  description,
  metrics = DEFAULT_METRICS,
  variant = "divided",
  footnote,
  duration = 1.8,
  className,
}: StatsKpiGridProps) {
  const reduced = !!useReducedMotion();

  // Pick the column count that keeps each cell scannable on desktop
  const gridCols =
    metrics.length >= 4
      ? "md:grid-cols-2 lg:grid-cols-4"
      : metrics.length === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-2";

  return (
    <section className={cn("w-full bg-base-100 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {(label || headline || description) && (
          <motion.div
            className="mb-10 max-w-2xl md:mb-14"
            variants={containerVariants}
            initial={reduced ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {label && (
              <motion.p
                variants={fadeUp}
                className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary"
              >
                {label}
              </motion.p>
            )}
            {headline && (
              <motion.h2
                variants={fadeUp}
                className="text-3xl font-semibold tracking-tight text-base-content sm:text-4xl"
              >
                {headline}
              </motion.h2>
            )}
            {description && (
              <motion.p
                variants={fadeUp}
                className="mt-4 text-base leading-relaxed text-base-content/60"
              >
                {description}
              </motion.p>
            )}
          </motion.div>
        )}

        <motion.div
          className={cn(
            "grid grid-cols-1",
            variant === "divided" &&
              cn(
                "divide-y divide-base-300 border-y border-base-300 sm:divide-x sm:divide-y-0",
                "sm:grid-cols-2",
                metrics.length >= 4 && "lg:grid-cols-4 lg:divide-x",
                metrics.length === 3 && "md:grid-cols-3 md:divide-x",
              ),
            variant === "boxed" && cn("gap-4 sm:grid-cols-2", gridCols),
          )}
          variants={containerVariants}
          initial={reduced ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {metrics.map((m, i) => (
            <KpiCell
              key={i}
              item={m}
              duration={duration}
              reduced={reduced}
              variant={variant}
            />
          ))}
        </motion.div>

        {footnote && (
          <p className="mt-6 font-mono text-xs text-base-content/50">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
