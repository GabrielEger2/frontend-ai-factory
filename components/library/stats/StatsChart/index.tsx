"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface StatsChartBar {
  /** Label rendered next to the bar */
  label: string;
  /** Numeric value used for the bar length */
  value: number;
  /** Optional suffix appended to the rendered value (e.g. "%", "k", "ms") */
  suffix?: string;
  /** Optional decimals to display. Defaults to 0 */
  decimals?: number;
  /** Optional caption rendered under the label */
  caption?: string;
  /** Optional override color tone — defaults to "primary" */
  tone?: "primary" | "accent" | "neutral";
}

export interface StatsChartSparklinePoint {
  /** X-axis label (e.g. "Q1", "Jan") */
  label: string;
  /** Numeric value */
  value: number;
}

export interface StatsChartProps {
  /** Optional small label above the headline */
  eyebrow?: string;
  /** Section headline */
  headline?: string;
  /** Supporting paragraph */
  description?: string;
  /**
   * "bars" — horizontal bar chart with animated fill (default)
   * "sparkline" — single-line sparkline with anchored end-value
   */
  variant?: "bars" | "sparkline";
  /** Bars rendered when variant === "bars". Up to 8. */
  bars?: StatsChartBar[];
  /** Headline metric for the sparkline variant (e.g. "$1.42M ARR") */
  sparklineMetric?: string;
  /** Caption under the metric (e.g. "trailing 12 months") */
  sparklineCaption?: string;
  /** Trend pill text rendered next to the metric (e.g. "+38.2% YoY") */
  sparklineTrend?: string;
  /** Trend direction — controls the trend pill color */
  sparklineTrendDirection?: "up" | "down" | "flat";
  /** Sparkline data points (>= 2). Used when variant === "sparkline". */
  sparklinePoints?: StatsChartSparklinePoint[];
  /** Animation duration in seconds. Defaults to 1.6 */
  duration?: number;
  /** Optional footnote rendered under the chart (source, date) */
  footnote?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_BARS: StatsChartBar[] = [
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
];

const DEFAULT_SPARKLINE_POINTS: StatsChartSparklinePoint[] = [
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
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toneFillClass(tone: StatsChartBar["tone"] = "primary") {
  if (tone === "accent") return "bg-accent";
  if (tone === "neutral") return "bg-neutral";
  return "bg-primary";
}

function toneTextClass(tone: StatsChartBar["tone"] = "primary") {
  if (tone === "accent") return "text-accent";
  if (tone === "neutral") return "text-neutral";
  return "text-primary";
}

function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function AnimatedNumber({
  target,
  decimals = 0,
  prefix,
  suffix,
  duration,
  shouldReduceMotion,
}: {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration: number;
  shouldReduceMotion: boolean | null;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inViewRef = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(inViewRef, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    if (shouldReduceMotion) {
      ref.current.textContent = formatNumber(target, decimals);
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = formatNumber(v, decimals);
      },
    });
    return () => controls.stop();
  }, [isInView, target, decimals, duration, shouldReduceMotion]);

  return (
    <span ref={inViewRef} className="inline-flex items-baseline tabular-nums">
      {prefix && <span>{prefix}</span>}
      <span ref={ref}>{formatNumber(0, decimals)}</span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

function BarRow({
  bar,
  maxValue,
  duration,
  shouldReduceMotion,
}: {
  bar: StatsChartBar;
  maxValue: number;
  duration: number;
  shouldReduceMotion: boolean | null;
}) {
  const widthPct = maxValue > 0 ? Math.max((bar.value / maxValue) * 100, 4) : 4;

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,_2fr)_minmax(0,_3fr)] md:items-center md:gap-6">
      {/* Label column */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-base-content md:text-base">
          {bar.label}
        </span>
        {bar.caption && (
          <span className="text-xs text-base-content/55">{bar.caption}</span>
        )}
      </div>

      {/* Bar column */}
      <div className="flex items-center gap-3">
        <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-base-200">
          <motion.div
            className={cn("h-full rounded-full", toneFillClass(bar.tone))}
            initial={
              shouldReduceMotion ? { width: `${widthPct}%` } : { width: 0 }
            }
            whileInView={{ width: `${widthPct}%` }}
            viewport={{ once: true, margin: "-80px" }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration, ease: "easeOut" }
            }
          />
        </div>
        <span
          className={cn(
            "min-w-[5rem] text-right text-sm font-semibold tabular-nums md:text-base",
            toneTextClass(bar.tone),
          )}
        >
          <AnimatedNumber
            target={bar.value}
            decimals={bar.decimals ?? 0}
            suffix={bar.suffix}
            duration={duration}
            shouldReduceMotion={shouldReduceMotion}
          />
        </span>
      </div>
    </div>
  );
}

function Sparkline({
  points,
  metric,
  caption,
  trend,
  direction = "up",
  duration,
  shouldReduceMotion,
}: {
  points: StatsChartSparklinePoint[];
  metric?: string;
  caption?: string;
  trend?: string;
  direction?: "up" | "down" | "flat";
  duration: number;
  shouldReduceMotion: boolean | null;
}) {
  const ref = useRef<SVGPathElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  /* SVG geometry — viewBox stays 0,0,400,120 so layout is stable */
  const w = 400;
  const h = 120;
  const padX = 8;
  const padY = 12;

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);

  const stepX = (w - padX * 2) / Math.max(points.length - 1, 1);
  const coords = points.map((p, i) => {
    const x = padX + stepX * i;
    const y = padY + (1 - (p.value - min) / span) * (h - padY * 2);
    return { x, y };
  });

  const pathD = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(2)},${c.y.toFixed(2)}`)
    .join(" ");

  const areaD = `${pathD} L${coords[coords.length - 1].x.toFixed(2)},${h - padY} L${coords[0].x.toFixed(2)},${h - padY} Z`;

  /* Stroke draw-on animation */
  useEffect(() => {
    const path = ref.current;
    if (!path || !isInView) return;
    const length = path.getTotalLength();
    if (shouldReduceMotion) {
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
      return;
    }
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    const controls = animate(length, 0, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        path.style.strokeDashoffset = `${v}`;
      },
    });
    return () => controls.stop();
  }, [isInView, duration, shouldReduceMotion, pathD]);

  const trendPillClass =
    direction === "down"
      ? "bg-error/10 text-error"
      : direction === "flat"
        ? "bg-base-200 text-base-content/70"
        : "bg-success/10 text-success";

  const lastPoint = coords[coords.length - 1];

  return (
    <div ref={containerRef} className="flex flex-col gap-6">
      {/* Headline metric row */}
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
        {metric && (
          <span className="text-4xl font-semibold tracking-tight text-base-content tabular-nums md:text-5xl lg:text-6xl">
            {metric}
          </span>
        )}
        {trend && (
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium tabular-nums",
              trendPillClass,
            )}
          >
            {trend}
          </span>
        )}
      </div>
      {caption && (
        <p className="text-sm text-base-content/60 md:text-base">{caption}</p>
      )}

      {/* SVG sparkline */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          className="h-32 w-full md:h-40"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="stats-chart-spark-fill"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="oklch(var(--p))"
                stopOpacity="0.18"
              />
              <stop offset="100%" stopColor="oklch(var(--p))" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* baseline */}
          <line
            x1={padX}
            x2={w - padX}
            y1={h - padY}
            y2={h - padY}
            className="stroke-base-300"
            strokeWidth={1}
          />
          {/* area */}
          <path d={areaD} fill="url(#stats-chart-spark-fill)" />
          {/* line */}
          <path
            ref={ref}
            d={pathD}
            fill="none"
            className="stroke-primary"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* end dot */}
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r={4}
            className="fill-primary"
          />
        </svg>
      </div>

      {/* X-axis labels — first / mid / last only to avoid clutter */}
      <div className="flex justify-between text-xs text-base-content/50 tabular-nums">
        <span>{points[0]?.label}</span>
        {points.length > 2 && (
          <span>{points[Math.floor(points.length / 2)]?.label}</span>
        )}
        <span>{points[points.length - 1]?.label}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * StatsChart -- a chart-style stats section with two variants:
 * "bars" (horizontal bar chart with animated fill, count-up labels) or
 * "sparkline" (single-line trend with anchored headline metric).
 *
 * Higher density than StatsCountUp/StatsKpiGrid -- use when the page
 * needs comparative or longitudinal numbers, not just hero figures.
 */
export default function StatsChart({
  eyebrow,
  headline,
  description,
  variant = "bars",
  bars = DEFAULT_BARS,
  sparklineMetric = "$1.42M",
  sparklineCaption = "Trailing twelve-month ARR",
  sparklineTrend = "+38.2% YoY",
  sparklineTrendDirection = "up",
  sparklinePoints = DEFAULT_SPARKLINE_POINTS,
  duration = 1.6,
  footnote,
  className,
}: StatsChartProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeBars = bars.length > 0 ? bars : DEFAULT_BARS;
  const safePoints =
    sparklinePoints.length > 1 ? sparklinePoints : DEFAULT_SPARKLINE_POINTS;
  const maxValue = Math.max(...safeBars.map((b) => b.value));

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_3fr)] lg:gap-16">
          {/* Header column */}
          <motion.div
            className="flex flex-col gap-3"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </span>
            )}
            {headline && (
              <h2 className="text-3xl font-semibold tracking-tight text-base-content md:text-4xl">
                {headline}
              </h2>
            )}
            {description && (
              <p className="text-base leading-relaxed text-base-content/65">
                {description}
              </p>
            )}
          </motion.div>

          {/* Chart column */}
          <div className="flex flex-col gap-6">
            {variant === "bars" ? (
              <div className="flex flex-col gap-6 md:gap-7">
                {safeBars.map((bar, idx) => (
                  <BarRow
                    key={idx}
                    bar={bar}
                    maxValue={maxValue}
                    duration={duration}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                ))}
              </div>
            ) : (
              <Sparkline
                points={safePoints}
                metric={sparklineMetric}
                caption={sparklineCaption}
                trend={sparklineTrend}
                direction={sparklineTrendDirection}
                duration={duration}
                shouldReduceMotion={shouldReduceMotion}
              />
            )}

            {footnote && (
              <p className="border-t border-base-300 pt-4 text-xs text-base-content/50">
                {footnote}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
