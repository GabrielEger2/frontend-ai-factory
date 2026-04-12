"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FeatureItem {
  /** Feature heading */
  title: string;
  /** Feature description */
  description: string;
  /** CTA text for the feature */
  ctaText?: string;
  /** CTA destination URL */
  ctaUrl?: string;
}

export interface SimpleGridProps {
  /** Small label displayed above the headline */
  label?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** List of feature items */
  features: FeatureItem[];
  /** CTA button text below the features list */
  ctaText?: string;
  /** CTA destination URL */
  ctaUrl?: string;
  /** Site-wide visual configuration — CTA variant/color comes from styleKit */
  styleKit?: StyleKit;
  /** Number of feature columns. Defaults to 4 */
  columns?: 2 | 3 | 4;
  /** Informational purpose tag rendered as a data attribute */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Column map                                                         */
/* ------------------------------------------------------------------ */

const COLUMN_MAP = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 xl:grid-cols-4",
} as const;

/* ------------------------------------------------------------------ */
/*  Arrow icon (private)                                               */
/* ------------------------------------------------------------------ */

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className={cn("h-4 w-4", className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * SimpleGrid -- a centered header with a grid of feature items,
 * each separated by a left border accent. Optional bottom CTA button.
 * Works well for service overviews, benefit lists, or capability summaries.
 */
export default function SimpleGrid({
  label,
  headline,
  description,
  features,
  ctaText,
  ctaUrl,
  styleKit,
  columns = 4,
  purpose,
  className,
}: SimpleGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme = styleKit?.ctaColorScheme ?? "primary";

  return (
    <section
      className={cn("w-full bg-base-100 py-16 md:py-24", className)}
      data-purpose={purpose}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <motion.div
          className="mb-16 flex w-full flex-col items-center text-center"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {label && (
            <motion.p
              variants={fadeUp}
              className="mb-2 text-xs font-medium uppercase tracking-widest text-primary"
            >
              {label}
            </motion.p>
          )}
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-2xl font-semibold text-base-content sm:text-3xl"
          >
            {headline}
          </motion.h2>
          {description && (
            <motion.p
              variants={fadeUp}
              className="mx-auto max-w-2xl text-base leading-relaxed text-base-content/60"
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        {/* Features grid */}
        <motion.div
          className={cn("grid grid-cols-1 gap-0", COLUMN_MAP[columns])}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="border-l-2 border-base-300 px-8 py-6"
            >
              <h3 className="mb-2 text-lg font-medium text-base-content sm:text-xl">
                {feature.title}
              </h3>
              <p className="mb-4 text-base leading-relaxed text-base-content/60">
                {feature.description}
              </p>
              {feature.ctaText && feature.ctaUrl && (
                <a
                  href={feature.ctaUrl}
                  className="inline-flex items-center text-primary transition-colors hover:text-primary/80"
                >
                  {feature.ctaText}
                  <ArrowRight className="ml-2" />
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        {ctaText && ctaUrl && (
          <motion.div
            className="mt-16 flex justify-center"
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
