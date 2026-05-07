"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { cn } from "@lib/utils";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/**
 * ProgressNarrative is a hand-authored page-template wrapper, NOT a
 * Composer-pickable library component. Each step's `content` slot
 * accepts React.ReactNode so authors can nest other components (e.g.
 * ImageText, CardGrid, IconListSplit) into each story chapter. This
 * violates the Composer primitive-receiving contract by design — the
 * AI pipeline never sees it.
 */
export interface ProgressStep {
  /** Short label rendered in the sticky rail (e.g. "01", "Discovery") */
  label: string;
  /** Step content — any React node (e.g. ImageText, CardGrid) */
  content: React.ReactNode;
}

export interface ProgressNarrativeProps {
  /** Optional section headline displayed above the narrative */
  headline?: string;
  /** Optional section sub-headline for context */
  subheadline?: string;
  /** Story chapters — each renders as a scroll block with a rail entry */
  steps?: ProgressStep[];
  /** Side of the rail. Defaults to "left" */
  railSide?: "left" | "right";
  /** Top offset for the sticky rail in pixels. Defaults to 96 */
  stickyTop?: number;
  /** Site-wide style kit threaded by the host page */
  styleKit?: StyleKit;
  /** Informational purpose tag attached as data attribute */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_STEPS: ProgressStep[] = [
  {
    label: "Discovery",
    content: (
      <div className="flex flex-col gap-4">
        <h3 className="text-3xl font-bold text-base-content md:text-4xl">
          Two weeks of listening before we touch a tool
        </h3>
        <p className="text-base text-base-content/70 md:text-lg">
          We embed with the team, audit the workflows, and write down what is
          actually happening — not what the leadership deck says is happening.
        </p>
      </div>
    ),
  },
  {
    label: "Strategy",
    content: (
      <div className="flex flex-col gap-4">
        <h3 className="text-3xl font-bold text-base-content md:text-4xl">
          A roadmap with names and dates next to every line
        </h3>
        <p className="text-base text-base-content/70 md:text-lg">
          Strategy that does not name owners is just a wishlist. Every
          initiative gets a single accountable person and a deadline a quarter
          out, maximum.
        </p>
      </div>
    ),
  },
  {
    label: "Build",
    content: (
      <div className="flex flex-col gap-4">
        <h3 className="text-3xl font-bold text-base-content md:text-4xl">
          Ship in increments small enough to reverse
        </h3>
        <p className="text-base text-base-content/70 md:text-lg">
          Every change goes live in a window where rolling it back costs less
          than a day of work. That constraint shapes the architecture more than
          any framework choice.
        </p>
      </div>
    ),
  },
  {
    label: "Handoff",
    content: (
      <div className="flex flex-col gap-4">
        <h3 className="text-3xl font-bold text-base-content md:text-4xl">
          Leave the team stronger than we found it
        </h3>
        <p className="text-base text-base-content/70 md:text-lg">
          Documentation, a recorded handoff session, and 30 days of pager
          coverage. We are not done when the code ships — we are done when the
          team owns it.
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
      className="mx-auto max-w-3xl px-4 pb-12 pt-16 text-center md:px-8 md:pt-24"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <h2 className="mb-4 text-3xl font-bold text-base-content sm:text-4xl md:text-5xl">
        {headline}
      </h2>
      {subheadline && (
        <p className="text-base text-base-content/60 md:text-lg">
          {subheadline}
        </p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProgressNarrative({
  headline,
  subheadline,
  steps = DEFAULT_STEPS,
  railSide = "left",
  stickyTop = 96,
  styleKit: _styleKit,
  purpose,
  className,
}: ProgressNarrativeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 30%", "end 70%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const clamped = Math.max(0, Math.min(0.999, latest));
    const idx = Math.floor(clamped * steps.length);
    setActiveIdx(idx);
  });

  const Rail = (
    <aside
      className="hidden w-full max-w-[200px] shrink-0 md:block"
      aria-hidden="true"
    >
      <nav className="md:sticky" style={{ top: stickyTop }}>
        <ol className="flex flex-col gap-1">
          {steps.map((step, idx) => {
            const isActive = idx === activeIdx;
            const isPast = idx < activeIdx;
            return (
              <li key={idx} className="relative flex items-start gap-3 py-2">
                <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full transition-all duration-300",
                      isActive
                        ? "scale-150 bg-primary"
                        : isPast
                          ? "bg-primary/60"
                          : "bg-base-300",
                    )}
                  />
                  {idx < steps.length - 1 && (
                    <span
                      className={cn(
                        "absolute left-1/2 top-5 h-8 w-px -translate-x-1/2 transition-colors duration-300",
                        isPast || isActive ? "bg-primary/40" : "bg-base-300",
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    isActive
                      ? "text-base-content"
                      : isPast
                        ? "text-base-content/70"
                        : "text-base-content/40",
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );

  const Content = (
    <div className="flex w-full flex-col">
      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          className="min-h-[60vh] py-16 md:py-24"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary md:hidden">
            {step.label}
          </p>
          {step.content}
        </motion.div>
      ))}
    </div>
  );

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

      <div
        ref={containerRef}
        className="mx-auto flex w-full max-w-7xl gap-10 px-4 md:px-8 md:gap-16"
      >
        {railSide === "left" ? (
          <>
            {Rail}
            {Content}
          </>
        ) : (
          <>
            {Content}
            {Rail}
          </>
        )}
      </div>
    </section>
  );
}
