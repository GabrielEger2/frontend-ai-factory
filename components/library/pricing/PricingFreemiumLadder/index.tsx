"use client";

import { motion, useReducedMotion } from "motion/react";
import { FiArrowRight } from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PricingLadderStep {
  /** Tier name — e.g. "Free", "Studio", "Scale" */
  name: string;
  /** Price string — "Free", "$22", "Custom" */
  price: string;
  /** Cadence suffix — "/mo", "/seat", "billed annually" */
  cadence?: string;
  /** One-line tag describing who this step is for */
  audience?: string;
  /**
   * What unlocks at this step versus the previous one. Three-to-five
   * concrete bullets. Inclusive of everything below.
   */
  unlocks: string[];
  /** Per-step CTA */
  ctaText: string;
  /** Per-step CTA destination */
  ctaUrl: string;
  /** Marks the recommended jumping-off point */
  recommended?: boolean;
}

export interface PricingFreemiumLadderProps {
  /** Eyebrow above the headline */
  label?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /**
   * Ladder steps — between 3 and 5. Order matters; rendered bottom
   * (cheapest) to top (most expensive) on desktop, top to bottom on
   * mobile.
   */
  steps: PricingLadderStep[];
  /** Footnote line below the ladder */
  footnote?: string;
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_STEPS: PricingLadderStep[] = [
  {
    name: "Free",
    price: "Free",
    audience: "Hobby projects and weekend builds",
    unlocks: [
      "1 active project",
      "5 GB asset storage",
      "Community Discord support",
    ],
    ctaText: "Start free",
    ctaUrl: "/signup?plan=free",
  },
  {
    name: "Studio",
    price: "$22",
    cadence: "/mo",
    audience: "First paid plan for solo founders",
    unlocks: [
      "Unlimited projects",
      "Custom domains and redirects",
      "Email support · 12h reply",
    ],
    ctaText: "Try Studio",
    ctaUrl: "/signup?plan=studio",
    recommended: true,
  },
  {
    name: "Team",
    price: "$74",
    cadence: "/mo",
    audience: "Small teams shipping every week",
    unlocks: [
      "Up to 5 collaborators",
      "Shared Slack support channel",
      "Branch preview URLs",
    ],
    ctaText: "Try Team",
    ctaUrl: "/signup?plan=team",
  },
  {
    name: "Scale",
    price: "$236",
    cadence: "/mo",
    audience: "Growing companies with security needs",
    unlocks: [
      "SSO, SAML, audit logs",
      "Dedicated success engineer",
      "99.95% uptime guarantee",
    ],
    ctaText: "Talk to sales",
    ctaUrl: "/contact?plan=scale",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * PricingFreemiumLadder — visual staircase showing tier progression.
 * Each step sits one rung higher than the previous, with a connector
 * line tracing the climb. The recommended step gets a soft inverted
 * surface and a subtle pulse on the badge.
 *
 * Mobile collapses to a top-to-bottom vertical list. Desktop uses
 * absolute positioning on a fixed-height stage so the staircase shape
 * actually reads — no flexbox percentage math.
 */
export default function PricingFreemiumLadder({
  label,
  headline,
  description,
  steps = DEFAULT_STEPS,
  footnote,
  styleKit,
  className,
}: PricingFreemiumLadderProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme = styleKit?.ctaColorScheme ?? "primary";
  const stepCount = Math.max(steps.length, 1);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-base-100 py-16 md:py-24",
        className,
      )}
    >
      {/* Soft diagonal background tint that suggests the climb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 0 50%, currentColor 50% 100%)",
          color: "var(--color-base-content, #111)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <motion.div
          className="mb-12 max-w-2xl md:mb-20"
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
              className="mt-4 max-w-[60ch] text-base leading-relaxed text-base-content/65"
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        {/* Mobile — vertical list */}
        <ol className="flex flex-col gap-4 md:hidden">
          {steps.map((step, i) => (
            <li
              key={i}
              className={cn(
                "relative rounded-3xl p-6",
                step.recommended
                  ? "bg-base-content text-base-100"
                  : "border border-base-300 bg-base-100",
              )}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.18em]",
                    step.recommended
                      ? "text-base-100/70"
                      : "text-base-content/55",
                  )}
                >
                  Step {i + 1} · {step.name}
                </span>
                {step.recommended && (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-content">
                    Start here
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "mt-3 flex items-baseline gap-1.5 font-mono text-3xl font-semibold tracking-tight",
                  step.recommended ? "text-base-100" : "text-base-content",
                )}
              >
                {step.price}
                {step.cadence && (
                  <span
                    className={cn(
                      "text-sm font-sans",
                      step.recommended
                        ? "text-base-100/55"
                        : "text-base-content/55",
                    )}
                  >
                    {step.cadence}
                  </span>
                )}
              </p>
              {step.audience && (
                <p
                  className={cn(
                    "mt-1 text-sm",
                    step.recommended
                      ? "text-base-100/70"
                      : "text-base-content/65",
                  )}
                >
                  {step.audience}
                </p>
              )}
              <ul className="mt-4 flex flex-col gap-2 text-sm">
                {step.unlocks.map((u, ui) => (
                  <li key={ui} className="flex items-start gap-2">
                    <FiArrowRight
                      className={cn(
                        "mt-1 h-3.5 w-3.5 shrink-0",
                        step.recommended ? "text-base-100/65" : "text-primary",
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        step.recommended
                          ? "text-base-100/85"
                          : "text-base-content/80",
                      )}
                    >
                      {u}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <CtaButton
                  variant={ctaVariant}
                  colorScheme={step.recommended ? "primary" : ctaColorScheme}
                  href={step.ctaUrl}
                  className="w-full justify-center"
                >
                  {step.ctaText}
                </CtaButton>
              </div>
            </li>
          ))}
        </ol>

        {/* Desktop — staircase */}
        <motion.div
          className="relative hidden md:block"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          // 5 steps * 80px rise = 400 + ~360 card height = ~760
          style={{ minHeight: `${stepCount * 80 + 380}px` }}
        >
          {/* Climb line — diagonal connector */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full text-base-content/12"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <line
              x1="2"
              y1="98"
              x2="98"
              y2="2"
              stroke="currentColor"
              strokeWidth={0.4}
              strokeDasharray="0.6 0.8"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {steps.map((step, i) => {
            // Bottom step (i=0) sits low-left, top step (i=last) sits high-right
            const xPct = stepCount === 1 ? 50 : (i / (stepCount - 1)) * 70 + 2;
            const bottomPx = i * 80;
            return (
              <motion.article
                key={i}
                variants={fadeUp}
                className={cn(
                  "absolute w-[31%] min-w-[280px] max-w-[360px] rounded-3xl p-6",
                  step.recommended
                    ? "bg-base-content text-base-100 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)]"
                    : "border border-base-300 bg-base-100 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.08)]",
                )}
                style={{
                  left: `${xPct}%`,
                  bottom: `${bottomPx}px`,
                  zIndex: i + 1,
                }}
              >
                {/* Step number rail */}
                <div className="flex items-baseline justify-between gap-3">
                  <span
                    className={cn(
                      "font-mono text-xs uppercase tracking-[0.18em]",
                      step.recommended
                        ? "text-base-100/65"
                        : "text-base-content/55",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")} · {step.name}
                  </span>
                  {step.recommended && (
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-content">
                      Start here
                    </span>
                  )}
                </div>

                <p
                  className={cn(
                    "mt-3 flex items-baseline gap-1.5 font-mono text-4xl font-semibold tracking-tight",
                    step.recommended ? "text-base-100" : "text-base-content",
                  )}
                >
                  {step.price}
                  {step.cadence && (
                    <span
                      className={cn(
                        "font-sans text-sm",
                        step.recommended
                          ? "text-base-100/55"
                          : "text-base-content/55",
                      )}
                    >
                      {step.cadence}
                    </span>
                  )}
                </p>

                {step.audience && (
                  <p
                    className={cn(
                      "mt-1 text-sm",
                      step.recommended
                        ? "text-base-100/70"
                        : "text-base-content/65",
                    )}
                  >
                    {step.audience}
                  </p>
                )}

                <ul className="mt-4 flex flex-col gap-2 text-sm">
                  {step.unlocks.map((u, ui) => (
                    <li key={ui} className="flex items-start gap-2">
                      <FiArrowRight
                        className={cn(
                          "mt-1 h-3.5 w-3.5 shrink-0",
                          step.recommended
                            ? "text-base-100/65"
                            : "text-primary",
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className={cn(
                          step.recommended
                            ? "text-base-100/85"
                            : "text-base-content/80",
                        )}
                      >
                        {u}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5">
                  <CtaButton
                    variant={ctaVariant}
                    colorScheme={step.recommended ? "primary" : ctaColorScheme}
                    href={step.ctaUrl}
                    className="w-full justify-center"
                  >
                    {step.ctaText}
                  </CtaButton>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {footnote && (
          <p className="mt-12 text-center text-sm text-base-content/55">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
