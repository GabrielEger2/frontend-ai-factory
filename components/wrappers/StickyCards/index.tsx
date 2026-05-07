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
 * StickyCards is a hand-authored page-template wrapper, NOT a
 * Composer-pickable library component. Its `content` slot accepts
 * React.ReactNode so authors can nest other components (e.g. ImageText,
 * CardGrid, IconListSplit) directly inside each card. This violates the
 * Composer primitive-receiving contract by design — the AI pipeline
 * never sees it.
 */
export interface StickyCard {
  /** Card content — any React node (e.g. ImageText, CardGrid, IconListSplit) */
  content: React.ReactNode;
}

export interface StickyCardsProps {
  /** Optional section headline displayed above the cards */
  headline?: string;
  /** Optional section sub-headline for context */
  subheadline?: string;
  /** Cards — each becomes a full-viewport sticky panel */
  cards?: StickyCard[];
  /** Site-wide style kit threaded by the host page */
  styleKit?: StyleKit;
  /** Height of each card section in px — controls scroll pacing. Defaults to 600 */
  cardHeight?: number;
  /** Informational purpose tag attached as data attribute */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_STICKY_CARDS: StickyCard[] = [
  {
    content: (
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 text-center md:px-8">
        <h3 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
          Define the problem worth solving
        </h3>
        <p className="max-w-lg text-base text-base-content/70">
          Most teams skip this step and pay for it later. We start with a sharp
          written brief everyone in the room agrees with.
        </p>
      </div>
    ),
  },
  {
    content: (
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 text-center md:px-8">
        <h3 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
          Prototype before you commit
        </h3>
        <p className="max-w-lg text-base text-base-content/70">
          A clickable prototype, in front of real users, in under two weeks. The
          feedback rewrites the roadmap — every time.
        </p>
      </div>
    ),
  },
  {
    content: (
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 text-center md:px-8">
        <h3 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
          Ship, measure, then ship again
        </h3>
        <p className="max-w-lg text-base text-base-content/70">
          We instrument the launch from day one and meet weekly to decide what
          stays, what goes, and what gets doubled down on.
        </p>
      </div>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_CARD_HEIGHT = 600;

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface StickyCardPanelProps {
  card: StickyCard;
  position: number;
  totalCards: number;
  scrollYProgress: MotionValue<number>;
  cardHeight: number;
  shouldReduceMotion: boolean | null;
}

function StickyCardPanel({
  card,
  position,
  totalCards,
  scrollYProgress,
  cardHeight,
  shouldReduceMotion,
}: StickyCardPanelProps) {
  const isLast = position === totalCards;
  const scaleFromPct = (position - 1) / totalCards;
  const y = useTransform(scrollYProgress, [scaleFromPct, 1], [0, -cardHeight]);

  return (
    <motion.div
      style={{
        height: cardHeight,
        y: shouldReduceMotion || isLast ? undefined : y,
      }}
      className="sticky top-0 flex w-full origin-top items-center justify-center bg-base-100"
    >
      {card.content}
    </motion.div>
  );
}

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
      className="flex min-h-[40vh] flex-col items-center justify-center bg-base-100 px-4 py-16 text-center md:py-24"
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

export default function StickyCards({
  headline,
  subheadline,
  cards = DEFAULT_STICKY_CARDS,
  styleKit: _styleKit,
  cardHeight = DEFAULT_CARD_HEIGHT,
  purpose,
  className,
}: StickyCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <section className={cn("w-full", className)} data-purpose={purpose}>
      {headline && (
        <SectionHeader
          headline={headline}
          subheadline={subheadline}
          shouldReduceMotion={shouldReduceMotion}
        />
      )}

      <div ref={ref} className="relative">
        {cards.map((card, idx) => (
          <StickyCardPanel
            key={idx}
            card={card}
            position={idx + 1}
            totalCards={cards.length}
            scrollYProgress={scrollYProgress}
            cardHeight={cardHeight}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>
    </section>
  );
}
