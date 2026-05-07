"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { cn } from "@lib/utils";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/**
 * StackedReveal is a hand-authored page-template wrapper, NOT a
 * Composer-pickable library component. Its `panels` slot accepts
 * React.ReactNode so authors can nest other components (e.g. ImageText,
 * CardGrid, IconListSplit) inside each stacking panel. Sister to
 * StickyCards, but each new panel slides over the previous one and
 * scales the outgoing panel down. The AI pipeline never sees it.
 */
export interface StackedPanel {
  /** Panel content — any React node */
  content: React.ReactNode;
  /** Optional Tailwind classes for this panel's background (e.g. "bg-primary text-primary-content") */
  bgClass?: string;
}

export interface StackedRevealProps {
  /** Optional section headline displayed above the stack */
  headline?: string;
  /** Optional section sub-headline for context */
  subheadline?: string;
  /** Panels — each becomes a sticky panel that slides over the previous one */
  panels?: StackedPanel[];
  /** Site-wide style kit threaded by the host page */
  styleKit?: StyleKit;
  /** Top offset for the sticky panels in pixels. Defaults to 32 */
  stickyTop?: number;
  /** How much the outgoing panel scales down (0–1). Defaults to 0.92 */
  outgoingScale?: number;
  /** Informational purpose tag attached as data attribute */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_PANELS: StackedPanel[] = [
  {
    bgClass: "bg-primary text-primary-content",
    content: (
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center gap-6 px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest opacity-80">
          Layer 01
        </p>
        <h3 className="text-4xl font-bold sm:text-5xl md:text-6xl">
          Each panel slides over the last
        </h3>
        <p className="max-w-xl text-base opacity-80 md:text-lg">
          Outgoing panels scale down slightly behind the incoming one — the
          stack reads as deliberate hierarchy, not a slideshow.
        </p>
      </div>
    ),
  },
  {
    bgClass: "bg-secondary text-secondary-content",
    content: (
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center gap-6 px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest opacity-80">
          Layer 02
        </p>
        <h3 className="text-4xl font-bold sm:text-5xl md:text-6xl">
          The motion implies depth
        </h3>
        <p className="max-w-xl text-base opacity-80 md:text-lg">
          The slight scale-down on the outgoing layer hints that there is
          something underneath — readers understand instinctively that they can
          scroll to see more.
        </p>
      </div>
    ),
  },
  {
    bgClass: "bg-accent text-accent-content",
    content: (
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center gap-6 px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest opacity-80">
          Layer 03
        </p>
        <h3 className="text-4xl font-bold sm:text-5xl md:text-6xl">
          End on the strongest panel
        </h3>
        <p className="max-w-xl text-base opacity-80 md:text-lg">
          The final panel does not scale down. It is the resting state — the
          moment to drop the CTA the rest of the stack has earned.
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
      className="mx-auto flex min-h-[40vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center md:py-24"
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
/*  Panel                                                              */
/* ------------------------------------------------------------------ */

interface StackedPanelLayerProps {
  panel: StackedPanel;
  position: number;
  totalPanels: number;
  scrollYProgress: MotionValue<number>;
  stickyTop: number;
  outgoingScale: number;
  shouldReduceMotion: boolean | null;
}

function StackedPanelLayer({
  panel,
  position,
  totalPanels,
  scrollYProgress,
  stickyTop,
  outgoingScale,
  shouldReduceMotion,
}: StackedPanelLayerProps) {
  const isLast = position === totalPanels;

  // Each panel hands off to the next at a fixed slice of total scroll.
  // For a 3-panel stack: panel 1 scales out from 1/3 → 2/3, panel 2 from 2/3 → 1, panel 3 stays.
  // For the last panel we feed a safe [0, 1] range with identity output —
  // useTransform validates offsets against [0, 1] even when the result is unused.
  const start = isLast ? 0 : position / totalPanels;
  const end = isLast ? 1 : (position + 1) / totalPanels;

  const scale = useTransform(
    scrollYProgress,
    [start, end],
    [1, isLast ? 1 : outgoingScale],
  );
  const opacity = useTransform(
    scrollYProgress,
    [start, end],
    [1, isLast ? 1 : 0.6],
  );

  return (
    <motion.div
      style={{
        top: stickyTop + (position - 1) * 24,
        scale: shouldReduceMotion || isLast ? undefined : scale,
        opacity: shouldReduceMotion ? undefined : opacity,
      }}
      className={cn(
        "sticky mx-auto flex h-[80vh] w-full max-w-6xl origin-top items-center justify-center overflow-hidden rounded-3xl shadow-2xl",
        panel.bgClass ?? "bg-base-200 text-base-content",
      )}
    >
      {panel.content}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function StackedReveal({
  headline,
  subheadline,
  panels = DEFAULT_PANELS,
  styleKit: _styleKit,
  stickyTop = 32,
  outgoingScale = 0.92,
  purpose,
  className,
}: StackedRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      className={cn("w-full bg-base-100 px-4 md:px-8", className)}
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
        style={{ height: `${panels.length * 100}vh` }}
        className="relative"
      >
        {panels.map((panel, idx) => (
          <StackedPanelLayer
            key={idx}
            panel={panel}
            position={idx + 1}
            totalPanels={panels.length}
            scrollYProgress={scrollYProgress}
            stickyTop={stickyTop}
            outgoingScale={outgoingScale}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>
      <div className="h-16" />
    </section>
  );
}
