"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MotionMarqueeRow {
  /**
   * Items in this row.
   * - For "words": plain string entries — rendered as styled text spans.
   * - For "logos": each entry should be `{ src, alt }` (rendered <img>).
   * - For "badges": object form `{ text, href? }` (rendered as pills, optionally linked).
   */
  items: Array<
    string | { text: string; href?: string } | { src: string; alt: string }
  >;
  /** Direction — "left" scrolls right-to-left (default), "right" scrolls left-to-right */
  direction?: "left" | "right";
  /** Duration in seconds for one full cycle. Defaults to 35 */
  durationSec?: number;
}

export interface MotionMarqueeProps {
  /** Optional eyebrow rendered above the marquee */
  eyebrow?: string;
  /** Optional headline rendered above the marquee */
  headline?: string;
  /**
   * Visual variant:
   * - "words" — large editorial text in a single row
   * - "logos" — translucent customer logos in a strip (1-2 rows)
   * - "badges" — pill-shaped tag track (1-2 rows)
   */
  variant?: "words" | "logos" | "badges";
  /** 1-3 rows. Each row scrolls independently. */
  rows?: MotionMarqueeRow[];
  /** Whether to fade the edges of the marquee track. Defaults to true */
  fadeEdges?: boolean;
  /**
   * "neutral" — bg-base-100 (default)
   * "muted" — bg-base-200
   * "inverse" — bg-base-content text-base-100
   */
  tone?: "neutral" | "muted" | "inverse";
  /** Site-wide visual configuration — accepted for API consistency */
  styleKit?: StyleKit;
  /** Vertical padding scale — "compact" trims to py-8/py-10 */
  spacing?: "default" | "compact";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_ROWS: MotionMarqueeRow[] = [
  {
    items: [
      "Editorial design",
      "Brand systems",
      "Production engineering",
      "Motion + interaction",
      "Pricing strategy",
      "Founder advisory",
      "Content + voice",
    ],
    direction: "left",
    durationSec: 38,
  },
];

const DEFAULT_LOGOS: MotionMarqueeRow[] = [
  {
    items: [
      {
        src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=NORTHBEAM",
        alt: "Northbeam",
      },
      {
        src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=KINETIC",
        alt: "Kinetic",
      },
      {
        src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=HELIX",
        alt: "Helix",
      },
      {
        src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=GLASSCUBE",
        alt: "Glasscube",
      },
      {
        src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=DRIFT",
        alt: "Drift",
      },
      {
        src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=RIVERMARK",
        alt: "Rivermark",
      },
      {
        src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=MORROW",
        alt: "Morrow & Co",
      },
      {
        src: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=NORTHWAVE",
        alt: "Northwave",
      },
    ],
    direction: "left",
    durationSec: 42,
  },
];

const DEFAULT_BADGES: MotionMarqueeRow[] = [
  {
    items: [
      { text: "Next.js" },
      { text: "TypeScript" },
      { text: "Tailwind CSS" },
      { text: "React 19" },
      { text: "Framer Motion" },
      { text: "Postgres" },
      { text: "Vercel Edge" },
      { text: "Cloudflare R2" },
      { text: "Stripe" },
    ],
    direction: "left",
    durationSec: 32,
  },
  {
    items: [
      { text: "OpenTelemetry" },
      { text: "OAuth2.1" },
      { text: "GraphQL" },
      { text: "AWS Lambda" },
      { text: "ARM64" },
      { text: "OKLCH tokens" },
      { text: "Vitest" },
    ],
    direction: "right",
    durationSec: 38,
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-component — single scrolling row                               */
/* ------------------------------------------------------------------ */

function MarqueeRow({
  row,
  variant,
  tone,
  shouldReduceMotion,
}: {
  row: MotionMarqueeRow;
  variant: "words" | "logos" | "badges";
  tone: "neutral" | "muted" | "inverse";
  shouldReduceMotion: boolean | null;
}) {
  const reverse = row.direction === "right";
  const duration = row.durationSec ?? 35;
  /* Triple the items so the loop wraps seamlessly */
  const repeats = useMemo(() => [0, 1, 2], []);

  const isInverse = tone === "inverse";

  const wordClass = cn(
    "shrink-0 px-6 font-semibold leading-none tracking-tight",
    "text-[clamp(2.25rem,6vw,5rem)]",
    isInverse ? "text-base-100" : "text-base-content",
  );

  const wordSepClass = cn(
    "shrink-0 self-center text-[clamp(1.5rem,4vw,3rem)]",
    isInverse ? "text-base-100/35" : "text-base-content/25",
  );

  const badgeClass = cn(
    "shrink-0 rounded-full border px-4 py-2 text-sm font-medium",
    isInverse
      ? "border-base-100/15 bg-base-100/5 text-base-100/85"
      : "border-base-300 bg-base-100 text-base-content/80",
  );

  const linkBadgeClass = cn(
    badgeClass,
    "transition-colors",
    isInverse
      ? "hover:bg-base-100 hover:text-base-content"
      : "hover:bg-base-content hover:text-base-100",
  );

  const logoClass = cn(
    "h-7 w-auto shrink-0 object-contain px-6 md:h-8",
    isInverse ? "opacity-90 invert" : "opacity-65 hover:opacity-100",
  );

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        className="flex w-max items-center"
        initial={{ x: reverse ? "-33.333%" : "0%" }}
        animate={{ x: reverse ? "0%" : "-33.333%" }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration, repeat: Infinity, ease: "linear" }
        }
      >
        {repeats.map((repeatIdx) => (
          <div key={repeatIdx} className="flex items-center">
            {row.items.map((item, idx) => {
              const key = `${repeatIdx}-${idx}`;
              if (variant === "words") {
                const text =
                  typeof item === "string"
                    ? item
                    : ((item as { text: string }).text ?? "");
                const showSep =
                  idx < row.items.length - 1 || repeats.length > 1;
                return (
                  <div className="flex items-center" key={key}>
                    <span className={wordClass}>{text}</span>
                    {showSep && (
                      <span aria-hidden="true" className={wordSepClass}>
                        &bull;
                      </span>
                    )}
                  </div>
                );
              }

              if (variant === "logos") {
                if (typeof item === "string" || !("src" in item)) return null;
                return (
                  <img
                    key={key}
                    src={item.src}
                    alt={item.alt}
                    className={logoClass}
                    loading="lazy"
                  />
                );
              }

              /* badges */
              if (typeof item === "string") {
                return (
                  <span key={key} className={cn(badgeClass, "mx-2")}>
                    {item}
                  </span>
                );
              }
              if ("text" in item) {
                const inner = item.text;
                if (item.href) {
                  return (
                    <a
                      key={key}
                      href={item.href}
                      className={cn(linkBadgeClass, "mx-2")}
                    >
                      {inner}
                    </a>
                  );
                }
                return (
                  <span key={key} className={cn(badgeClass, "mx-2")}>
                    {inner}
                  </span>
                );
              }
              return null;
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * MotionMarquee -- a single-section motion ticker. Three variants:
 * - "words" — large editorial text on infinite loop (e.g. capabilities,
 *   service tags, brand statements)
 * - "logos" — translucent customer logo strip on infinite loop
 * - "badges" — small pill tags on 1-2 rows scrolling opposite directions
 */
export default function MotionMarquee({
  eyebrow,
  headline,
  variant = "words",
  rows,
  fadeEdges = true,
  tone = "neutral",
  spacing = "default",
  className,
}: MotionMarqueeProps) {
  const shouldReduceMotion = useReducedMotion();

  /* Per-variant defaults */
  const resolvedRows =
    rows && rows.length > 0
      ? rows
      : variant === "logos"
        ? DEFAULT_LOGOS
        : variant === "badges"
          ? DEFAULT_BADGES
          : DEFAULT_ROWS;

  const isInverse = tone === "inverse";
  const surfaceClass = cn(
    "w-full",
    tone === "neutral" && "bg-base-100",
    tone === "muted" && "bg-base-200",
    isInverse && "bg-base-content text-base-100",
  );

  const fadeFromColor = isInverse
    ? "from-base-content"
    : tone === "muted"
      ? "from-base-200"
      : "from-base-100";

  const verticalPadding =
    spacing === "compact" ? "py-8 md:py-10" : "py-12 md:py-16";

  return (
    <section className={cn(surfaceClass, verticalPadding, className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {(eyebrow || headline) && (
          <div className="mb-8 max-w-2xl md:mb-10">
            {eyebrow && (
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.25em]",
                  isInverse ? "text-base-100/55" : "text-primary",
                )}
              >
                {eyebrow}
              </span>
            )}
            {headline && (
              <h2
                className={cn(
                  "mt-3 text-2xl font-semibold tracking-tight md:text-3xl",
                  isInverse ? "text-base-100" : "text-base-content",
                )}
              >
                {headline}
              </h2>
            )}
          </div>
        )}
      </div>

      {/* Marquee track — full-bleed; fades clip the page-edge padding */}
      <div className="relative">
        <div
          className={cn(
            "flex flex-col",
            variant === "words" ? "gap-0" : "gap-3 md:gap-4",
          )}
        >
          {resolvedRows.map((row, idx) => (
            <MarqueeRow
              key={idx}
              row={row}
              variant={variant}
              tone={tone}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>

        {fadeEdges && (
          <>
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r to-transparent md:w-24",
                fadeFromColor,
              )}
            />
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l to-transparent md:w-24",
                fadeFromColor,
              )}
            />
          </>
        )}
      </div>
    </section>
  );
}
