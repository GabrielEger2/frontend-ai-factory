"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ProcessStep {
  /** Stage label rendered above the title — e.g. "Week 1", "Phase 02" */
  marker?: string;
  /** Step title — short, action verb leading */
  title: string;
  /** Step description (~ 2 sentences) */
  description: string;
  /** Optional duration label rendered to the right of the title on desktop */
  duration?: string;
}

export interface ProcessTimelineProps {
  /** Small label rendered above the headline */
  label?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** Ordered list of process steps */
  steps?: ProcessStep[];
  /**
   * "vertical" — staircase layout with a connector line on the left (default)
   * "horizontal" — desktop-only horizontal rail with cards beneath
   */
  orientation?: "vertical" | "horizontal";
  /** Optional CTA below the timeline */
  ctaText?: string;
  ctaUrl?: string;
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_STEPS: ProcessStep[] = [
  {
    marker: "Week 1",
    title: "Discovery and audit",
    description:
      "We sit with your team for two half-days, map the customer journey end-to-end, and surface the friction points worth fixing first.",
    duration: "5 days",
  },
  {
    marker: "Week 2-3",
    title: "Design sprints",
    description:
      "Two iterative sprints — wireframes, then high-fidelity flows. Daily Loom updates so feedback never blocks momentum.",
    duration: "10 days",
  },
  {
    marker: "Week 4-7",
    title: "Build and integrate",
    description:
      "Production-ready Next.js with your CMS, analytics, and CRM wired in. Staging environment shared from day one.",
    duration: "20 days",
  },
  {
    marker: "Week 8",
    title: "Launch and handoff",
    description:
      "QA across devices, soft launch with the marketing list, then a 90-minute handoff session covering content updates and analytics.",
    duration: "5 days",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface VerticalStepProps {
  step: ProcessStep;
  index: number;
  isLast: boolean;
}

function VerticalStep({ step, index, isLast }: VerticalStepProps) {
  return (
    <motion.li
      variants={fadeUp}
      className="relative grid grid-cols-[auto_1fr] gap-x-6 pb-12 last:pb-0 md:gap-x-8"
    >
      {/* Connector + marker column */}
      <div className="relative flex flex-col items-center">
        <div
          className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-base-content text-base-100 font-mono text-sm font-semibold tabular-nums"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        {!isLast && (
          <span
            className="absolute left-1/2 top-12 h-full w-px -translate-x-1/2 bg-base-300"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Content column */}
      <div className="pt-1">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          {step.marker && (
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {step.marker}
            </span>
          )}
          {step.duration && (
            <span className="text-xs font-mono text-base-content/60">
              {step.duration}
            </span>
          )}
        </div>
        <h3 className="mt-2 text-xl font-semibold text-base-content md:text-2xl">
          {step.title}
        </h3>
        <p className="mt-2 max-w-xl text-base leading-relaxed text-base-content/65">
          {step.description}
        </p>
      </div>
    </motion.li>
  );
}

interface HorizontalStepProps {
  step: ProcessStep;
  index: number;
}

function HorizontalStep({ step, index }: HorizontalStepProps) {
  return (
    <motion.li variants={fadeUp} className="relative flex flex-col gap-3 pt-12">
      {/* Number node sitting on the rail */}
      <div
        className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-base-300 bg-base-100 font-mono text-sm font-semibold tabular-nums text-base-content"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div>
        {step.marker && (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {step.marker}
          </span>
        )}
        <h3 className="mt-1 text-lg font-semibold text-base-content">
          {step.title}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-base-content/65">
        {step.description}
      </p>
      {step.duration && (
        <span className="font-mono text-xs text-base-content/60">
          {step.duration}
        </span>
      )}
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * ProcessTimeline — numbered "how it works" component for B2B narratives,
 * onboarding flows, and service playbooks. Vertical staircase by default;
 * horizontal rail on desktop when orientation="horizontal".
 */
export default function ProcessTimeline({
  label,
  headline,
  description,
  steps = DEFAULT_STEPS,
  orientation = "vertical",
  ctaText,
  ctaUrl,
  styleKit,
  className,
}: ProcessTimelineProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme = styleKit?.ctaColorScheme ?? "primary";

  return (
    <section className={cn("w-full bg-base-100 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header — left-aligned for editorial feel (variance ≥ 4) */}
        <motion.div
          className="mb-12 max-w-2xl md:mb-16"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {label && (
            <motion.p
              variants={fadeUp}
              className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
            >
              {label}
            </motion.p>
          )}
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-semibold tracking-tight text-base-content sm:text-4xl md:text-5xl"
          >
            {headline}
          </motion.h2>
          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-base-content/60"
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        {orientation === "horizontal" ? (
          <>
            <motion.ol
              className={cn(
                "relative grid grid-cols-1 gap-8 sm:grid-cols-2",
                steps.length === 4 && "lg:grid-cols-4",
                steps.length === 3 && "lg:grid-cols-3",
                steps.length >= 5 && "lg:grid-cols-5",
                steps.length === 2 && "lg:grid-cols-2",
              )}
              variants={containerVariants}
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Rail behind the numbers — desktop only */}
              <span
                className="pointer-events-none absolute left-5 right-5 top-5 hidden h-px bg-base-300 lg:block"
                aria-hidden="true"
              />
              {steps.map((step, i) => (
                <HorizontalStep key={i} step={step} index={i} />
              ))}
            </motion.ol>
          </>
        ) : (
          <motion.ol
            className="relative"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {steps.map((step, i) => (
              <VerticalStep
                key={i}
                step={step}
                index={i}
                isLast={i === steps.length - 1}
              />
            ))}
          </motion.ol>
        )}

        {ctaText && ctaUrl && (
          <motion.div
            className="mt-12 flex md:mt-16"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <CtaButton
              variant={ctaVariant}
              colorScheme={ctaColorScheme}
              href={ctaUrl}
            >
              {ctaText}
            </CtaButton>
          </motion.div>
        )}
      </div>
    </section>
  );
}
