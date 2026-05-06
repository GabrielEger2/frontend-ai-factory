"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CtaMinimalStripProps {
  /** Small label rendered above the headline */
  label?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph below the headline (centered variant only) */
  description?: string;
  /** Primary CTA copy */
  ctaText: string;
  /** Primary CTA destination */
  ctaUrl: string;
  /** Optional secondary text-link CTA */
  secondaryText?: string;
  secondaryUrl?: string;
  /**
   * "centered" — calm centered block, generous whitespace (default)
   * "inline" — single-row strip with copy left, CTA right
   * "bordered" — centered, framed by top + bottom hairlines
   */
  layoutVariant?: "centered" | "inline" | "bordered";
  /**
   * "neutral" — bg-base-100, text-base-content (default)
   * "muted" — bg-base-200 surface
   * "inverse" — bg-base-content, text-base-100
   */
  tone?: "neutral" | "muted" | "inverse";
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CtaMinimalStrip — restrained centered or inline CTA strip without
 * decorative imagery. Use when the rest of the page already carries
 * the visual weight and the closing ask should be calm and obvious.
 */
export default function CtaMinimalStrip({
  label,
  headline,
  description,
  ctaText,
  ctaUrl,
  secondaryText,
  secondaryUrl,
  layoutVariant = "centered",
  tone = "neutral",
  styleKit,
  className,
}: CtaMinimalStripProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme = styleKit?.ctaColorScheme ?? "primary";

  const isInverse = tone === "inverse";
  const isInline = layoutVariant === "inline";
  const isBordered = layoutVariant === "bordered";

  const surfaceClass = cn(
    "w-full",
    tone === "neutral" && "bg-base-100",
    tone === "muted" && "bg-base-200",
    isInverse && "bg-base-content text-base-100",
  );

  const headingColor = isInverse ? "text-base-100" : "text-base-content";
  const bodyColor = isInverse ? "text-base-100/70" : "text-base-content/65";
  const labelColor = isInverse ? "text-base-100/60" : "text-primary";
  const dividerColor = isInverse ? "border-base-100/15" : "border-base-300";

  return (
    <section
      className={cn(
        surfaceClass,
        "py-14 md:py-20",
        isBordered && cn("border-y", dividerColor),
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          className={cn(
            "flex flex-col gap-6",
            isInline
              ? "md:flex-row md:items-center md:justify-between md:gap-12"
              : "items-center text-center",
          )}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Copy block */}
          <div
            className={cn(
              "flex flex-col gap-3",
              isInline ? "max-w-2xl" : "max-w-2xl items-center",
            )}
          >
            {label && (
              <motion.p
                variants={fadeUp}
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.25em]",
                  labelColor,
                )}
              >
                {label}
              </motion.p>
            )}
            <motion.h2
              variants={fadeUp}
              className={cn(
                "text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl",
                headingColor,
              )}
            >
              {headline}
            </motion.h2>
            {description && !isInline && (
              <motion.p
                variants={fadeUp}
                className={cn("text-base leading-relaxed", bodyColor)}
              >
                {description}
              </motion.p>
            )}
          </div>

          {/* Action block */}
          <motion.div
            variants={fadeUp}
            className={cn(
              "flex flex-wrap items-center gap-x-6 gap-y-3",
              !isInline && "mt-2 justify-center",
            )}
          >
            <CtaButton
              variant={ctaVariant}
              colorScheme={isInverse ? "neutral" : ctaColorScheme}
              href={ctaUrl}
            >
              {ctaText}
            </CtaButton>
            {secondaryText && secondaryUrl && (
              <a
                href={secondaryUrl}
                className={cn(
                  "group inline-flex items-center gap-1 text-sm font-medium underline-offset-4 transition-colors",
                  isInverse
                    ? "text-base-100/80 hover:text-base-100 hover:underline"
                    : "text-base-content/70 hover:text-base-content hover:underline",
                )}
              >
                <span>{secondaryText}</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  &rarr;
                </span>
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
