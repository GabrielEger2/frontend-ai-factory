"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { cn } from "@lib/utils";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/**
 * HorizontalScroll is a hand-authored page-template wrapper, NOT a
 * Composer-pickable library component. Its `panels` slot accepts
 * React.ReactNode so authors can nest other components (e.g. ImageText,
 * CardGrid, IconListSplit) directly inside each horizontal panel. This
 * violates the Composer primitive-receiving contract by design — the AI
 * pipeline never sees it.
 */
export interface HorizontalPanel {
  /** Panel content — any React node (e.g. ImageText, CardGrid, IconListSplit) */
  content: React.ReactNode;
}

export interface HorizontalScrollProps {
  /** Optional section headline displayed above the pinned scroll track */
  headline?: string;
  /** Optional section sub-headline for context */
  subheadline?: string;
  /** Panels — each occupies one viewport-width slide that scrolls horizontally */
  panels?: HorizontalPanel[];
  /** Site-wide style kit threaded by the host page */
  styleKit?: StyleKit;
  /** Informational purpose tag attached as data attribute */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_PANELS: HorizontalPanel[] = [
  {
    content: (
      <div className="mx-auto flex h-full w-screen max-w-5xl flex-col items-center justify-center gap-6 px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-base-content/60">
          Step 01
        </p>
        <h3 className="text-4xl font-bold text-base-content sm:text-5xl md:text-6xl">
          Move sideways for a change
        </h3>
        <p className="max-w-xl text-base text-base-content/70 md:text-lg">
          Vertical scroll is comfortable. Horizontal scroll demands attention —
          which is exactly why a pinned horizontal track is the right pattern
          when the story benefits from focus.
        </p>
      </div>
    ),
  },
  {
    content: (
      <div className="mx-auto flex h-full w-screen max-w-5xl flex-col items-center justify-center gap-6 px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-base-content/60">
          Step 02
        </p>
        <h3 className="text-4xl font-bold text-base-content sm:text-5xl md:text-6xl">
          Pace the narrative
        </h3>
        <p className="max-w-xl text-base text-base-content/70 md:text-lg">
          Each panel gets its own beat. The reader can&apos;t scroll past three
          slides at once, so every claim, every visual, every CTA gets the time
          it deserves.
        </p>
      </div>
    ),
  },
  {
    content: (
      <div className="mx-auto flex h-full w-screen max-w-5xl flex-col items-center justify-center gap-6 px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-base-content/60">
          Step 03
        </p>
        <h3 className="text-4xl font-bold text-base-content sm:text-5xl md:text-6xl">
          Land the close
        </h3>
        <p className="max-w-xl text-base text-base-content/70 md:text-lg">
          By the final panel, the reader has spent real time inside your story —
          that&apos;s the moment to ask for the click.
        </p>
      </div>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Section header                                                     */
/* ------------------------------------------------------------------ */

interface SectionHeaderProps {
  headline: string;
  subheadline?: string;
  shouldReduceMotion: boolean | null;
}

function SectionHeader({
  headline,
  subheadline,
  shouldReduceMotion,
}: SectionHeaderProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center bg-base-100 px-4 py-16 text-center md:py-24"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <h2 className="mb-4 text-3xl font-bold text-base-content sm:text-4xl md:text-5xl">
        {headline}
      </h2>
      {subheadline && (
        <p className="max-w-2xl text-base text-base-content/60 md:text-lg">
          {subheadline}
        </p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HorizontalScroll({
  headline,
  subheadline,
  panels = DEFAULT_PANELS,
  styleKit: _styleKit,
  purpose,
  className,
}: HorizontalScrollProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: targetRef });

  // Translate from 0% to -((panels - 1) * 100%) so each panel takes one viewport
  const translatePct = -((panels.length - 1) / panels.length) * 100;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `${translatePct}%`]);

  return (
    <section
      className={cn("w-full bg-base-100", className)}
      data-purpose={purpose}
    >
      {headline && (
        <SectionHeader
          headline={headline}
          subheadline={subheadline}
          shouldReduceMotion={shouldReduceMotion}
        />
      )}

      {/* Tall scroll target — height drives how long the horizontal pin lasts */}
      <div
        ref={targetRef}
        style={{ height: `${panels.length * 100}vh` }}
        className="relative"
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          {shouldReduceMotion ? (
            <div className="flex w-full flex-col">
              {panels.map((panel, idx) => (
                <div
                  key={idx}
                  className="flex h-screen w-full items-center justify-center"
                >
                  {panel.content}
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              style={{
                x,
                width: `${panels.length * 100}vw`,
              }}
              className="flex"
            >
              {panels.map((panel, idx) => (
                <div
                  key={idx}
                  className="flex h-screen w-screen shrink-0 items-center justify-center"
                >
                  {panel.content}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
