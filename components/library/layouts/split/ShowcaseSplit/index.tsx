"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import type { StyleKit } from "@lib/style-kit";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ShowcaseItem {
  /** Large photo of the showcase author */
  image: string;
  imageAlt: string;
  /** Author name */
  name: string;
  /** Author role / company */
  title: string;
  /** Quote text */
  quote: string;
}

export interface ShowcaseSplitProps {
  /** Small label displayed above the headline */
  label?: string;
  /** Section headline */
  headline: string;
  /** List of showcase items */
  testimonials?: ShowcaseItem[];
  /** Site-wide style configuration -- accepted for API consistency */
  styleKit?: StyleKit;
  /** Informational purpose tag for the section */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    image: "https://picsum.photos/seed/showcasesplit-item-0/416/576",
    imageAlt: "Sarah Chen",
    name: "Sarah Chen",
    title: "Head of Growth at Acme",
    quote:
      "We doubled our pipeline in the first quarter. The team was responsive, sharp, and frankly a delight to work with.",
  },
  {
    image: "https://picsum.photos/seed/showcasesplit-item-1/416/576",
    imageAlt: "Marcus Rivera",
    name: "Marcus Rivera",
    title: "Founder at BuildFast",
    quote:
      "I've worked with a dozen agencies. None shipped this quickly without dropping quality. Genuinely impressed.",
  },
  {
    image: "https://picsum.photos/seed/showcasesplit-item-2/416/576",
    imageAlt: "Priya Natarajan",
    name: "Priya Natarajan",
    title: "VP Product at Lumen",
    quote:
      "The clarity of communication alone was worth the price. We knew where things stood every single week.",
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

/* ------------------------------------------------------------------ */
/*  Navigation arrows (private)                                        */
/* ------------------------------------------------------------------ */

function NavArrow({
  direction,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="rounded-full border border-primary-content/30 p-2 text-primary-content transition-colors duration-200 hover:bg-primary/60"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={direction === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * ShowcaseSplit -- a bold split-layout section with a large author photo
 * alongside the quote text, wrapped in a colored background card.
 * Previous/next navigation arrows cycle through items with a sliding
 * transition.
 */
export default function ShowcaseSplit({
  label,
  headline,
  testimonials = DEFAULT_SHOWCASE_ITEMS,
  styleKit,
  purpose,
  className,
}: ShowcaseSplitProps) {
  const [[activeIndex, direction], setActive] = useState([0, 0]);
  const shouldReduceMotion = useReducedMotion();

  const paginate = useCallback(
    (newDirection: number) => {
      setActive(([prev]) => {
        const next =
          (prev + newDirection + testimonials.length) % testimonials.length;
        return [next, newDirection];
      });
    },
    [testimonials.length],
  );

  if (!testimonials.length) return null;

  const current = testimonials[activeIndex];
  const safeImg = useSafeImageSrc(
    current.image,
    `layout-showcasesplit-01-image-${activeIndex}`,
    416,
    576,
  );

  return (
    <section
      data-purpose={purpose}
      data-style-kit={styleKit ? JSON.stringify(styleKit) : undefined}
      className={cn("w-full bg-base-100 py-12 md:py-16", className)}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          {label && (
            <p className="mb-2 text-xl font-medium text-primary">{label}</p>
          )}
          <h2 className="text-2xl font-semibold text-base-content lg:text-3xl">
            {headline}
          </h2>
        </motion.div>

        {/* Showcase card */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-primary">
          <div className="flex w-full flex-col items-center p-6 md:flex-row md:items-center md:justify-evenly md:p-0 lg:px-12">
            {/* Author image */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={`image-${activeIndex}`}
                src={safeImg.src}
                onError={safeImg.onError}
                alt={current.imageAlt}
                className="h-24 w-24 rounded-full object-cover shadow-md md:mx-6 md:h-[32rem] md:w-80 md:rounded-2xl lg:h-[36rem] lg:w-[26rem]"
                loading="lazy"
                custom={direction}
                variants={shouldReduceMotion ? undefined : slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </AnimatePresence>

            {/* Text + navigation */}
            <div className="mt-4 md:mx-6 md:mt-0">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`text-${activeIndex}`}
                  custom={direction}
                  variants={shouldReduceMotion ? undefined : slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <p className="text-xl font-medium tracking-tight text-primary-content">
                    {current.name}
                  </p>
                  <p className="text-primary-content/60">{current.title}</p>
                  <p className="mt-4 text-lg leading-relaxed text-primary-content md:text-xl">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              {testimonials.length > 1 && (
                <div className="mt-6 flex items-center gap-4 md:justify-start">
                  <NavArrow
                    direction="prev"
                    onClick={() => paginate(-1)}
                    label="Previous testimonial"
                  />
                  <NavArrow
                    direction="next"
                    onClick={() => paginate(1)}
                    label="Next testimonial"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
