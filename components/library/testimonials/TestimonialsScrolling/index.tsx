"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import TestimonialCard, {
  type TestimonialItem,
} from "@ui/cards/TestimonialCard";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TestimonialsScrollingProps {
  /** Section headline */
  headline: string;
  /** Supporting text below the headline */
  subheadline?: string;
  /** Three rows of testimonials — each row scrolls independently */
  rows: [TestimonialItem[], TestimonialItem[], TestimonialItem[]];
  /** Duration in seconds for one full scroll cycle per row. Defaults to [125, 75, 275] */
  durations?: [number, number, number];
  className?: string;
}

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
 * TestimonialsScrolling -- three infinite-scrolling marquee rows of
 * testimonial cards, each moving at a different speed and direction.
 *
 * Edge gradients fade cards in/out at the viewport edges for a polished
 * overflow feel.
 */
export default function TestimonialsScrolling({
  headline,
  subheadline,
  rows,
  durations = [125, 75, 275],
  className,
}: TestimonialsScrollingProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
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

        <div className="mb-4 flex items-center">
          <MarqueeRow
            items={rows[0]}
            duration={durations[0]}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>
        <div className="mb-4 flex items-center">
          <MarqueeRow
            items={rows[1]}
            duration={durations[1]}
            reverse
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>
        <div className="flex items-center">
          <MarqueeRow
            items={rows[2]}
            duration={durations[2]}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>

        {/* Right fade */}
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-neutral to-transparent" />
      </div>
    </section>
  );
}
