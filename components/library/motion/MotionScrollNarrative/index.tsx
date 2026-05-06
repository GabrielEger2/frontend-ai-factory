"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@lib/utils";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MotionScrollNarrativeStep {
  /** Optional small label rendered above the title (e.g. "01") */
  label?: string;
  /** Step title */
  title: string;
  /** Step body copy */
  description: string;
  /** Optional image rendered in the pinned right panel while this step is active */
  image?: string;
  /** Accessible alt for the image */
  imageAlt?: string;
}

export interface MotionScrollNarrativeProps {
  /** Optional eyebrow above the section header */
  eyebrow?: string;
  /** Section heading */
  headline?: string;
  /** Supporting paragraph */
  subheadline?: string;
  /** 3-5 narrative steps. Each scrolls past while the right panel pins. */
  steps?: MotionScrollNarrativeStep[];
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_STEPS: MotionScrollNarrativeStep[] = [
  {
    label: "01",
    title: "Start with the brief everyone agrees with",
    description:
      "Most engagements break in week three because the brief was approximate. We write it as a contract — outcomes, owners, and what we are explicitly not doing.",
    image: "https://picsum.photos/seed/scrollnarrative-step-01/1280/1600",
    imageAlt: "Whiteboard with a written project brief",
  },
  {
    label: "02",
    title: "Prototype the riskiest assumption first",
    description:
      "Whatever the team is most unsure about — pricing, the funnel, an integration — that's what we ship to a real audience first. Three weeks, no exceptions.",
    image: "https://picsum.photos/seed/scrollnarrative-step-02/1280/1600",
    imageAlt: "Designer reviewing a prototype on a tablet",
  },
  {
    label: "03",
    title: "Instrument before you launch",
    description:
      "Analytics, error tracking, and the three or four metrics you'll actually argue about — wired and tested before the launch announcement, not after the first incident.",
    image: "https://picsum.photos/seed/scrollnarrative-step-03/1280/1600",
    imageAlt: "Dashboard with multiple analytics charts",
  },
  {
    label: "04",
    title: "Ship, measure, then ship again",
    description:
      "Weekly working sessions through the first thirty days. Decisions go in writing the same day; nothing waits for the Monday review.",
    image: "https://picsum.photos/seed/scrollnarrative-step-04/1280/1600",
    imageAlt: "Team in a working session around a laptop",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-component — pinned image cross-fade                            */
/* ------------------------------------------------------------------ */

function PinnedImage({
  step,
  position,
  total,
  scrollYProgress,
  shouldReduceMotion,
}: {
  step: MotionScrollNarrativeStep;
  position: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  shouldReduceMotion: boolean | null;
}) {
  /* Each step "owns" a slice of the parent's scroll progress.
     Step `i` peaks opacity in [(i - 0.4)/n, i/n, (i + 0.4)/n]. */
  const safe = useSafeImageSrc(
    step.image,
    `scrollnarrative-${position}`,
    1280,
    1600,
  );

  const slice = 1 / total;
  const peak = (position + 0.5) * slice;
  const start = Math.max(0, peak - slice * 0.7);
  const end = Math.min(1, peak + slice * 0.7);

  const opacity = useTransform(scrollYProgress, [start, peak, end], [0, 1, 0]);

  const scale = useTransform(
    scrollYProgress,
    [start, peak, end],
    [1.04, 1, 1.04],
  );

  if (shouldReduceMotion) {
    return position === 0 ? (
      <img
        {...safe}
        alt={step.imageAlt ?? step.title}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
    ) : null;
  }

  return (
    <motion.img
      {...safe}
      alt={step.imageAlt ?? step.title}
      style={{ opacity, scale }}
      className="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * MotionScrollNarrative -- a scroll-pinned two-column narrative.
 * The right column pins (sticky) while the visitor scrolls past 3-5
 * narrative steps in the left column; each step's image cross-fades
 * into the pinned panel when its block is in the viewport.
 *
 * On mobile (below `lg:`) the layout collapses to a single column: each
 * step renders inline with its own image. No pinning, no cross-fade.
 */
export default function MotionScrollNarrative({
  eyebrow,
  headline,
  subheadline,
  steps = DEFAULT_STEPS,
  className,
}: MotionScrollNarrativeProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeSteps = steps.length > 0 ? steps.slice(0, 5) : DEFAULT_STEPS;
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      {/* Header */}
      {(eyebrow || headline || subheadline) && (
        <motion.div
          className="mx-auto mb-12 max-w-7xl px-4 md:mb-16 md:px-8"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="max-w-2xl">
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                {eyebrow}
              </span>
            )}
            {headline && (
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-base-content md:text-4xl lg:text-5xl">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="mt-3 text-base text-base-content/65 md:text-lg">
                {subheadline}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Body — pinned grid (desktop), inline stack (mobile) */}
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div ref={scrollRef} className="relative">
          {/* Mobile: stacked steps with their own image */}
          <div className="flex flex-col gap-12 lg:hidden">
            {safeSteps.map((step, idx) => {
              const StepImage = () => {
                const safe = useSafeImageSrc(
                  step.image,
                  `scrollnarrative-mobile-${idx}`,
                  960,
                  1200,
                );
                if (!step.image) return null;
                return (
                  <img
                    {...safe}
                    alt={step.imageAlt ?? step.title}
                    className="aspect-[4/5] w-full rounded-2xl object-cover ring-1 ring-base-300"
                    loading="lazy"
                  />
                );
              };
              return (
                <article key={idx} className="flex flex-col gap-4">
                  {step.image && <StepImage />}
                  <div className="flex flex-col gap-2">
                    {step.label && (
                      <span className="font-mono text-xs font-semibold tracking-[0.2em] text-primary">
                        {step.label}
                      </span>
                    )}
                    <h3 className="text-2xl font-semibold leading-tight tracking-tight text-base-content">
                      {step.title}
                    </h3>
                    <p className="text-base leading-relaxed text-base-content/65">
                      {step.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Desktop: pinned image + scrolling text */}
          <div className="hidden lg:grid lg:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] lg:gap-16">
            {/* Scrolling text column */}
            <div className="flex flex-col gap-[80vh] py-[20vh]">
              {safeSteps.map((step, idx) => (
                <motion.article
                  key={idx}
                  className="flex flex-col gap-4"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {step.label && (
                    <span className="font-mono text-xs font-semibold tracking-[0.25em] text-primary">
                      {step.label}
                    </span>
                  )}
                  <h3 className="text-3xl font-semibold leading-tight tracking-tight text-base-content xl:text-4xl">
                    {step.title}
                  </h3>
                  <p className="max-w-md text-base leading-relaxed text-base-content/65 lg:text-lg">
                    {step.description}
                  </p>
                </motion.article>
              ))}
            </div>

            {/* Pinned image column */}
            <div className="relative">
              <div className="sticky top-1/2 -translate-y-1/2">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-base-200 ring-1 ring-base-300">
                  {safeSteps.map((step, idx) => (
                    <PinnedImage
                      key={idx}
                      step={step}
                      position={idx}
                      total={safeSteps.length}
                      scrollYProgress={scrollYProgress}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
