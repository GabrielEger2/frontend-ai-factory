"use client";

import React, { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { Highlighter } from "@ui/text-decorations/Highlighter";
import { type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface StatItem {
  /** Numeric target value for the count-up animation */
  value: number;
  /** Number of decimal places to display. Defaults to 0 */
  decimals?: number;
  /** Text rendered before the number (e.g. "$", "R$") */
  prefix?: string;
  /** Text rendered after the number (e.g. "%", "K+", "M+") */
  suffix?: string;
  /** Description displayed below the number */
  label: string;
}

export interface StatsCountUpProps {
  /** Optional section headline */
  headline?: string;
  /** Optional highlighted word/phrase within the headline */
  headlineHighlight?: string;
  /** Color scheme for the Highlighter wrapping `headlineHighlight`. Defaults to "primary". */
  highlightColorScheme?: ColorScheme;
  /** Array of stats to display — each animates independently on scroll */
  stats?: StatItem[];
  /** Animation duration in seconds. Defaults to 2.5 */
  duration?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_STATS: StatItem[] = [
  { value: 200, suffix: "%", label: "Growth in 12 months" },
  { value: 12000, suffix: "+", label: "Active users" },
  { value: 98, suffix: "%", label: "Customer satisfaction" },
  { value: 4.9, decimals: 1, label: "Average rating" },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_DURATION = 2.5;

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface StatProps {
  item: StatItem;
  duration: number;
  shouldReduceMotion: boolean | null;
}

function Stat({ item, duration, shouldReduceMotion }: StatProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || !ref.current) return;

    if (shouldReduceMotion) {
      ref.current.textContent = item.value.toFixed(item.decimals ?? 0);
      return;
    }

    const controls = animate(0, item.value, {
      duration,
      onUpdate(v) {
        if (!ref.current) return;
        ref.current.textContent = v.toFixed(item.decimals ?? 0);
      },
    });

    return () => controls.stop();
  }, [item.value, item.decimals, duration, isInView, shouldReduceMotion]);

  return (
    <div className="flex w-72 flex-col items-center py-8 sm:py-0">
      <p className="mb-2 text-center text-7xl font-semibold text-base-content sm:text-6xl">
        {item.prefix && <span>{item.prefix}</span>}
        <span ref={ref}>0</span>
        {item.suffix && <span>{item.suffix}</span>}
      </p>
      <p className="max-w-48 text-center text-base-content/60">{item.label}</p>
    </div>
  );
}

function Divider() {
  return <div className="h-[1px] w-12 bg-base-300 sm:h-12 sm:w-[1px]" />;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function renderHighlightedHeadline(
  headline: string,
  highlightWord: string,
  scheme: ColorScheme,
): React.ReactNode {
  const lowerHeadline = headline.toLowerCase();
  const lowerWord = highlightWord.toLowerCase();
  const idx = lowerHeadline.indexOf(lowerWord);
  if (idx === -1) return headline;
  return (
    <>
      {headline.slice(0, idx)}
      <Highlighter action="highlight" colorScheme={scheme} triggerOnView>
        {headline.slice(idx, idx + highlightWord.length)}
      </Highlighter>
      {headline.slice(idx + highlightWord.length)}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function StatsCountUp({
  headline,
  headlineHighlight,
  highlightColorScheme = "primary",
  stats = DEFAULT_STATS,
  duration = DEFAULT_DURATION,
  className,
}: StatsCountUpProps) {
  const shouldReduceMotion = useReducedMotion();

  const renderedHeadline = (() => {
    if (!headline) return null;
    if (
      !headlineHighlight ||
      !headline.toLowerCase().includes(headlineHighlight.toLowerCase())
    ) {
      return <>{headline}</>;
    }
    return renderHighlightedHeadline(
      headline,
      headlineHighlight,
      highlightColorScheme,
    );
  })();

  return (
    <section className={cn("bg-base-100 px-4 py-20 md:py-24", className)}>
      <div className="mx-auto max-w-7xl">
        {renderedHeadline && (
          <motion.h2
            className="mb-8 text-center text-base font-semibold uppercase tracking-wide text-base-content sm:text-lg md:mb-16"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {renderedHeadline}
          </motion.h2>
        )}

        <div className="flex flex-col items-center justify-center sm:flex-row">
          {stats.map((item, idx) => (
            <div key={idx} className="contents">
              {idx > 0 && <Divider />}
              <Stat
                item={item}
                duration={duration}
                shouldReduceMotion={shouldReduceMotion}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
