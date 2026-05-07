"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ComparisonFeature {
  label: string;
  optionA: boolean | string;
  optionB: boolean | string;
}

export interface ComparisonSplitProps {
  eyebrow?: string;
  headline: string;
  description?: string;
  optionALabel: string;
  optionASubtext?: string;
  optionBLabel: string;
  optionBSubtext?: string;
  features?: ComparisonFeature[];
  ctaText?: string;
  ctaUrl?: string;
  ctaStyle?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  colorScheme?: "light" | "dark";
  styleKit?: StyleKit;
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_FEATURES: ComparisonFeature[] = [
  { label: "Project setup time", optionA: "1–2 weeks", optionB: "Same day" },
  { label: "AI-generated copy", optionA: false, optionB: true },
  { label: "Mobile-optimized layout", optionA: false, optionB: true },
  { label: "SEO-ready metadata", optionA: false, optionB: true },
  { label: "Custom domain included", optionA: false, optionB: true },
  {
    label: "Revisions per round",
    optionA: "Unlimited (slow)",
    optionB: "3 fast rounds",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components — inline check / cross / text values                */
/* ------------------------------------------------------------------ */

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-3 w-3"
          aria-hidden="true"
        >
          <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
        </svg>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-base-200 text-base-content/30">
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-3 w-3"
          aria-hidden="true"
        >
          <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
        </svg>
      </span>
    );
  }
  return <span className="text-sm text-base-content/80">{value}</span>;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * ComparisonSplit — two-column comparison table showing option A vs. option B
 * with a feature row list. Option B column is visually elevated to guide
 * toward the preferred choice. Ideal for before/after, plan comparison, or
 * DIY-vs-service contexts.
 */
export default function ComparisonSplit({
  eyebrow,
  headline,
  description,
  optionALabel,
  optionASubtext,
  optionBLabel,
  optionBSubtext,
  features = DEFAULT_FEATURES,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  colorScheme = "light",
  styleKit,
  purpose,
  className,
}: ComparisonSplitProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDark = colorScheme === "dark";

  return (
    <section
      data-purpose={purpose}
      className={cn(
        "relative w-full overflow-hidden py-16 md:py-24",
        isDark
          ? "bg-neutral text-neutral-content"
          : "bg-base-100 text-base-content",
        className,
      )}
    >
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <motion.div
          className="mb-12 max-w-2xl"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {eyebrow && (
            <motion.p
              variants={fadeUp}
              className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h2
            variants={fadeUp}
            className={cn(
              "text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl",
              isDark ? "text-neutral-content" : "text-base-content",
            )}
          >
            {headline}
          </motion.h2>
          {description && (
            <motion.p
              variants={fadeUp}
              className={cn(
                "mt-4 text-base leading-relaxed md:text-lg",
                isDark ? "text-neutral-content/70" : "text-base-content/70",
              )}
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="overflow-hidden rounded-2xl border border-base-300"
        >
          <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-base-300 md:grid-cols-[1fr_1fr_1fr]">
            <div
              className={cn(
                "px-4 py-5 md:px-6",
                isDark ? "bg-neutral" : "bg-base-100",
              )}
            />
            <div
              className={cn(
                "border-x border-base-300 px-4 py-5 md:px-6",
                isDark ? "bg-neutral" : "bg-base-100",
              )}
            >
              <p
                className={cn(
                  "text-xs font-semibold uppercase tracking-wide md:text-sm",
                  isDark ? "text-neutral-content/60" : "text-base-content/60",
                )}
              >
                {optionALabel}
              </p>
              {optionASubtext && (
                <p
                  className={cn(
                    "mt-1 text-[10px] md:text-xs",
                    isDark ? "text-neutral-content/40" : "text-base-content/40",
                  )}
                >
                  {optionASubtext}
                </p>
              )}
            </div>
            <div
              className={cn(
                "rounded-tr-2xl px-4 py-5 md:px-6",
                isDark ? "bg-primary/10" : "bg-primary/5",
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-primary md:text-sm">
                {optionBLabel}
              </p>
              {optionBSubtext && (
                <p className="mt-1 text-[10px] text-primary/60 md:text-xs">
                  {optionBSubtext}
                </p>
              )}
            </div>
          </div>

          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={cn(
                "grid grid-cols-[1.4fr_1fr_1fr] border-b border-base-300 last:border-b-0 md:grid-cols-[1fr_1fr_1fr]",
                i % 2 === 0
                  ? isDark
                    ? "bg-neutral"
                    : "bg-base-100"
                  : isDark
                    ? "bg-base-300/10"
                    : "bg-base-200/40",
              )}
            >
              <div className="flex items-center px-4 py-4 md:px-6">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isDark ? "text-neutral-content/80" : "text-base-content/80",
                  )}
                >
                  {feature.label}
                </span>
              </div>
              <div className="flex items-center justify-center border-x border-base-300 px-4 py-4 md:px-6">
                <FeatureValue value={feature.optionA} />
              </div>
              <div
                className={cn(
                  "flex items-center justify-center px-4 py-4 md:px-6",
                  isDark ? "bg-primary/5" : "bg-primary/5",
                )}
              >
                <FeatureValue value={feature.optionB} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {ctaText && ctaUrl && (
          <motion.div
            variants={fadeUp}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-10 flex justify-end"
          >
            <CtaButton
              variant={styleKit?.ctaVariant ?? ctaStyle}
              colorScheme={styleKit?.ctaColorScheme ?? ctaColorScheme}
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
