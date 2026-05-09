"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import TestimonialCard, {
  type TestimonialItem,
} from "@ui/cards/TestimonialCard";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface InfiniteScrollProps {
  /** Section headline */
  headline: string;
  /** Supporting text below the headline */
  subheadline?: string;
  /** Up to three rows of testimonials — each row scrolls independently. Empty/missing rows are skipped. */
  rows?: TestimonialItem[][];
  /** Duration in seconds for one full scroll cycle per row. Defaults to [125, 75, 275] */
  durations?: number[];
  /** Site-wide style configuration — accepted for API consistency */
  styleKit?: StyleKit;
  /** Informational purpose tag for the section */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_DURATIONS = [125, 75, 275];

const DEFAULT_INFINITE_SCROLL_ROWS: TestimonialItem[][] = [
  [
    {
      image: "https://picsum.photos/seed/infinitescroll-r0-0/80/80",
      imageAlt: "Camila Reyes",
      name: "Camila Reyes",
      title: "Head of Growth at Foxtrot Studio",
      quote:
        "We doubled our pipeline in the first quarter. The team was responsive, sharp, and a delight to work with.",
    },
    {
      image: "https://picsum.photos/seed/infinitescroll-r0-1/80/80",
      imageAlt: "Marcus Rivera",
      name: "Marcus Rivera",
      title: "Founder at BuildFast",
      quote:
        "I've worked with a dozen agencies. None shipped this quickly without dropping quality.",
    },
    {
      image: "https://picsum.photos/seed/infinitescroll-r0-2/80/80",
      imageAlt: "Priya Natarajan",
      name: "Priya Natarajan",
      title: "VP Product at Lumen",
      quote:
        "The clarity of communication alone was worth the price. We knew where things stood every week.",
    },
    {
      image: "https://picsum.photos/seed/infinitescroll-r0-3/80/80",
      imageAlt: "David Okafor",
      name: "David Okafor",
      title: "CTO at Northwind Labs",
      quote:
        "Our conversion rate jumped 38% within six weeks. The redesign paid for itself.",
    },
    {
      image: "https://picsum.photos/seed/infinitescroll-r0-4/80/80",
      imageAlt: "Elena Martinez",
      name: "Elena Martinez",
      title: "Marketing Director at Pixelworks",
      quote:
        "They didn't just build us a website — they gave us a system we can keep iterating on.",
    },
  ],
  [
    {
      image: "https://picsum.photos/seed/infinitescroll-r1-0/80/80",
      imageAlt: "Jordan Patel",
      name: "Jordan Patel",
      title: "Director of Engineering at Helix",
      quote:
        "Two weeks in and we already had a launch-ready prototype the team could test against.",
    },
    {
      image: "https://picsum.photos/seed/infinitescroll-r1-1/80/80",
      imageAlt: "Amina Hassan",
      name: "Amina Hassan",
      title: "Head of Design at Northwave",
      quote:
        "Felt like extending our own team rather than handing things off to a vendor.",
    },
    {
      image: "https://picsum.photos/seed/infinitescroll-r1-2/80/80",
      imageAlt: "Tom Whitaker",
      name: "Tom Whitaker",
      title: "Co-founder at Drift Studio",
      quote:
        "Cut our content production time in half. The framework still pays dividends a year later.",
    },
    {
      image: "https://picsum.photos/seed/infinitescroll-r1-3/80/80",
      imageAlt: "Lin Wei",
      name: "Lin Wei",
      title: "VP Operations at Quanta",
      quote:
        "The smoothest engagement we've run. Clear deliverables, no scope surprises, results that held up.",
    },
    {
      image: "https://picsum.photos/seed/infinitescroll-r1-4/80/80",
      imageAlt: "Hannah Schmitt",
      name: "Hannah Schmitt",
      title: "Founder at Morrow & Co",
      quote:
        "They asked the right uncomfortable questions early. That alone changed the direction of the project.",
    },
  ],
  [
    {
      image: "https://picsum.photos/seed/infinitescroll-r2-0/80/80",
      imageAlt: "Rafael Costa",
      name: "Rafael Costa",
      title: "Head of Product at Kinetic",
      quote:
        "Three weeks from kickoff to a redesigned site that actually felt like us. Quality I didn't expect at this pace.",
    },
    {
      image: "https://picsum.photos/seed/infinitescroll-r2-1/80/80",
      imageAlt: "Naomi Wright",
      name: "Naomi Wright",
      title: "CEO at Rivermark",
      quote: "Best money we've spent on a partner this year. Period.",
    },
    {
      image: "https://picsum.photos/seed/infinitescroll-r2-2/80/80",
      imageAlt: "Yuki Tanaka",
      name: "Yuki Tanaka",
      title: "VP Marketing at Glasscube",
      quote:
        "We finally have a brand story everyone in the company tells the same way. Worth every cent.",
    },
    {
      image: "https://picsum.photos/seed/infinitescroll-r2-3/80/80",
      imageAlt: "Felix Brandt",
      name: "Felix Brandt",
      title: "COO at Northbeam",
      quote:
        "Replaced four different tools with one cleaner workflow. The team adopted it without a single training session.",
    },
  ],
];

/* ------------------------------------------------------------------ */
/*  Marquee row                                                        */
/* ------------------------------------------------------------------ */

function MarqueeRow({
  items,
  duration,
  reverse,
  shouldReduceMotion,
}: {
  items: TestimonialItem[];
  duration: number;
  reverse?: boolean;
  shouldReduceMotion: boolean | null;
}) {
  if (!items?.length) return null;

  /* Triple the items to create seamless loop */
  const repeats = [0, 1, 2];

  return (
    <div className="flex items-center">
      {repeats.map((r) => (
        <motion.div
          key={r}
          className="flex gap-4 px-2"
          initial={{ translateX: reverse ? "-100%" : "0%" }}
          animate={{ translateX: reverse ? "0%" : "-100%" }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration, repeat: Infinity, ease: "linear" }
          }
        >
          {items.map((t, i) => (
            <TestimonialCard
              key={`${r}-${i}`}
              {...t}
              layout="horizontal"
              className="w-[290px] sm:w-[500px]"
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * InfiniteScroll -- three infinite-scrolling marquee rows of
 * testimonial cards, each moving at a different speed and direction.
 *
 * Edge gradients fade cards in/out at the viewport edges for a polished
 * overflow feel.
 */
export default function InfiniteScroll({
  headline,
  subheadline,
  rows = DEFAULT_INFINITE_SCROLL_ROWS,
  durations = DEFAULT_DURATIONS,
  styleKit,
  purpose,
  className,
}: InfiniteScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  // Tolerate any row count (1–N): filter empty/missing rows and cap to 3 visible marquees.
  const safeRows = (rows ?? DEFAULT_INFINITE_SCROLL_ROWS)
    .filter(
      (row): row is TestimonialItem[] => Array.isArray(row) && row.length > 0,
    )
    .slice(0, 3);

  return (
    <section
      data-purpose={purpose}
      data-style-kit={styleKit ? JSON.stringify(styleKit) : undefined}
      className={cn("w-full bg-neutral py-12 md:py-16 lg:py-24", className)}
    >
      {/* Header */}
      <div className="mb-8 px-4">
        <h2 className="text-center text-3xl font-semibold text-neutral-content sm:text-4xl">
          {headline}
        </h2>
        {subheadline && (
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-neutral-content/60">
            {subheadline}
          </p>
        )}
      </div>

      {/* Marquee area */}
      <div className="relative overflow-x-hidden p-4">
        {/* Left fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-neutral to-transparent" />

        {safeRows.map((row, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center",
              i < safeRows.length - 1 && "mb-4",
            )}
          >
            <MarqueeRow
              items={row}
              duration={
                durations[i] ?? DEFAULT_DURATIONS[i] ?? DEFAULT_DURATIONS[0]
              }
              reverse={i === 1}
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>
        ))}

        {/* Right fade */}
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-neutral to-transparent" />
      </div>
    </section>
  );
}
