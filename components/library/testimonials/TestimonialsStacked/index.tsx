"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import TestimonialCard, {
  type TestimonialItem,
} from "@ui/cards/TestimonialCard";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TestimonialsStackedProps {
  /** Section headline */
  headline: string;
  /** Supporting text below the headline */
  subheadline?: string;
  /** List of testimonials rendered as stacked cards */
  testimonials: TestimonialItem[];
  /** Auto-advance duration in seconds per card. Defaults to 5 */
  autoAdvanceDuration?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Progress bar                                                       */
/* ------------------------------------------------------------------ */

function ProgressBar({
  total,
  selected,
  setSelected,
  autoAdvanceDuration,
  shouldReduceMotion,
}: {
  total: number;
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
  autoAdvanceDuration: number;
  shouldReduceMotion: boolean | null;
}) {
  return (
    <div
      className="mt-8 flex gap-1"
      role="tablist"
      aria-label="Testimonial navigation"
    >
      {Array.from({ length: total }, (_, n) => (
        <button
          key={n}
          onClick={() => setSelected(n)}
          className="relative h-1.5 w-full bg-base-300"
          role="tab"
          aria-selected={selected === n}
          aria-label={`Testimonial ${n + 1}`}
        >
          {selected === n ? (
            <motion.span
              className="absolute bottom-0 left-0 top-0 bg-base-content"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: autoAdvanceDuration }
              }
              onAnimationComplete={() => {
                setSelected(selected === total - 1 ? 0 : selected + 1);
              }}
            />
          ) : (
            <span
              className="absolute bottom-0 left-0 top-0 bg-base-content"
              style={{ width: selected > n ? "100%" : "0%" }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stacked cards                                                      */
/* ------------------------------------------------------------------ */

function StackedCards({
  testimonials,
  selected,
  setSelected,
}: {
  testimonials: TestimonialItem[];
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="relative h-[450px] shadow-xl lg:h-[500px]">
      {testimonials.map((t, i) => {
        const scale = i <= selected ? 1 : 1 + 0.015 * (i - selected);
        const offset = i <= selected ? 0 : 95 + (i - selected) * 3;
        const isInverted = i % 2 === 1;

        return (
          <motion.div
            key={i}
            initial={false}
            style={{
              zIndex: i,
              transformOrigin: "left bottom",
            }}
            animate={{
              x: `${offset}%`,
              scale,
            }}
            whileHover={{
              translateX: i === selected ? 0 : -3,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            onClick={() => setSelected(i)}
            className="absolute left-0 top-0 h-full w-full"
          >
            <TestimonialCard
              {...t}
              layout="compact"
              inverted={isInverted}
              className="h-full"
            />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TestimonialsStacked -- a split-layout testimonial section where cards
 * are stacked with a subtle offset. The active card is fully visible;
 * inactive cards peek from the right edge. Auto-advances with an animated
 * progress bar.
 */
export default function TestimonialsStacked({
  headline,
  subheadline,
  testimonials,
  autoAdvanceDuration = 5,
  className,
}: TestimonialsStackedProps) {
  const [selected, setSelected] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        "w-full overflow-hidden bg-base-100 px-4 py-16 md:py-24 lg:px-8",
        className,
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-4">
        {/* Text side */}
        <div className="p-4">
          <h2 className="text-4xl font-semibold text-base-content sm:text-5xl">
            {headline}
          </h2>
          {subheadline && (
            <p className="my-4 text-base-content/60">{subheadline}</p>
          )}
          <ProgressBar
            total={testimonials.length}
            selected={selected}
            setSelected={setSelected}
            autoAdvanceDuration={autoAdvanceDuration}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>

        {/* Cards side */}
        <StackedCards
          testimonials={testimonials}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </section>
  );
}
