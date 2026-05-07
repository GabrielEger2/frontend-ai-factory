"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type PinnedSide = "left" | "right";

/**
 * PinnedSection is a hand-authored page-template wrapper, NOT a
 * Composer-pickable library component. Its `pinned` and `scrolling`
 * slots both accept React.ReactNode so authors can nest other
 * components (e.g. ImageText, IconListSplit, CardGrid) on either side
 * of the split. This violates the Composer primitive-receiving
 * contract by design — the AI pipeline never sees it.
 */
export interface PinnedSectionProps {
  /** Content rendered in the sticky/pinned column — typically an image, video, or visual summary */
  pinned?: React.ReactNode;
  /** Content rendered in the scrolling column — typically a stack of feature blocks, steps, or paragraphs */
  scrolling?: React.ReactNode;
  /** Which side gets pinned. Defaults to "left" */
  pinnedSide?: PinnedSide;
  /** Top offset for the sticky column in pixels. Defaults to 80 */
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

const DEFAULT_PINNED = (
  <div className="flex h-[70vh] w-full flex-col items-center justify-center rounded-3xl bg-base-200 p-12 text-center">
    <div className="mb-6 text-6xl">📌</div>
    <h3 className="text-2xl font-bold text-base-content">
      The pinned column stays.
    </h3>
    <p className="mt-3 max-w-xs text-base-content/60">
      Drop an image, a video, a chart, or a summary card here. It sticks while
      the other side scrolls past.
    </p>
  </div>
);

const DEFAULT_SCROLLING = (
  <div className="flex flex-col gap-12">
    {[
      {
        title: "Block one",
        body: "The scrolling column accepts as many children as you need. Each one gets the reader's full attention while the pinned side reinforces the visual anchor.",
      },
      {
        title: "Block two",
        body: "Use this pattern for product feature deep-dives, founder narratives, case-study walkthroughs, or anywhere a single visual benefits from staying in context.",
      },
      {
        title: "Block three",
        body: "On mobile, the layout collapses to a single column — the pinned content renders first, then everything stacks normally below it.",
      },
      {
        title: "Block four",
        body: "Set `pinnedSide='right'` to flip the layout. Adjust `stickyTop` to account for any fixed navigation that sits on top of the page.",
      },
    ].map((block) => (
      <div key={block.title} className="rounded-2xl bg-base-200 p-8">
        <h4 className="mb-3 text-xl font-semibold text-base-content">
          {block.title}
        </h4>
        <p className="text-base text-base-content/70">{block.body}</p>
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PinnedSection({
  pinned = DEFAULT_PINNED,
  scrolling = DEFAULT_SCROLLING,
  pinnedSide = "left",
  stickyTop = 80,
  styleKit: _styleKit,
  purpose,
  className,
}: PinnedSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const PinnedColumn = (
    <div className="w-full md:w-1/2">
      <div className="md:sticky" style={{ top: stickyTop }}>
        {pinned}
      </div>
    </div>
  );

  const ScrollingColumn = (
    <motion.div
      className="w-full md:w-1/2"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {scrolling}
    </motion.div>
  );

  return (
    <section
      className={cn(
        "w-full bg-base-100 px-4 py-16 md:px-8 md:py-24",
        className,
      )}
      data-purpose={purpose}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 md:flex-row md:gap-16">
        {pinnedSide === "left" ? (
          <>
            {PinnedColumn}
            {ScrollingColumn}
          </>
        ) : (
          <>
            {ScrollingColumn}
            {PinnedColumn}
          </>
        )}
      </div>
    </section>
  );
}
