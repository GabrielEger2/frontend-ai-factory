"use client";

import { motion, useReducedMotion } from "motion/react";
import { FiCheck } from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PricingSinglePriceProps {
  /** Eyebrow above the headline */
  label?: string;
  /** Section headline (left-aligned, editorial) */
  headline: string;
  /** Long-form supporting paragraph (left-aligned, body) */
  description?: string;
  /** Bullet-style highlights rendered alongside the description */
  highlights?: string[];
  /** Optional secondary metric / proof line (e.g. "Used by 218 teams") */
  proof?: string;
  /** Plan / package name displayed inside the price card */
  packageName: string;
  /** Optional context line above the price (e.g. "One package, no upsells") */
  packageNote?: string;
  /** Headline price (e.g. "$2,400", "Sob consulta") */
  price: string;
  /** Cadence suffix (e.g. "one-time", "/year", "billed once") */
  cadence?: string;
  /** Optional original price for promo strike-through */
  originalPrice?: string;
  /** Optional discount badge (e.g. "Founders' rate · save 30%") */
  discountBadge?: string;
  /** Card-level inclusion list */
  inclusions: string[];
  /** Primary CTA label */
  ctaText: string;
  /** Primary CTA destination */
  ctaUrl: string;
  /** Optional secondary CTA — usually a "Talk to sales" / "See FAQ" link */
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  /** Footnote line below the card */
  footnote?: string;
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * PricingSinglePrice — editorial split with long-form copy on the left
 * and one anchored price card on the right. Designed for productised
 * agency packages, single-product apps, or annual flat-rate deals where
 * a tier comparison would just be theatre.
 *
 * Asymmetric desktop split (3fr / 2fr) collapses to a single column
 * below md:. The price card sticks to the top of the viewport while
 * the body text scrolls past it.
 */
export default function PricingSinglePrice({
  label,
  headline,
  description,
  highlights,
  proof,
  packageName,
  packageNote,
  price,
  cadence,
  originalPrice,
  discountBadge,
  inclusions,
  ctaText,
  ctaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  footnote,
  styleKit,
  className,
}: PricingSinglePriceProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme = styleKit?.ctaColorScheme ?? "primary";

  return (
    <section className={cn("w-full bg-base-100 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          className="grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-16"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left — editorial copy */}
          <div className="md:col-span-3">
            {label && (
              <motion.p
                variants={fadeUp}
                className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary"
              >
                {label}
              </motion.p>
            )}
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-semibold leading-[1.05] tracking-tight text-base-content sm:text-4xl md:text-5xl lg:text-6xl"
            >
              {headline}
            </motion.h2>
            {description && (
              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-[60ch] text-base leading-relaxed text-base-content/70 md:text-lg"
              >
                {description}
              </motion.p>
            )}

            {highlights && highlights.length > 0 && (
              <motion.ul
                variants={fadeUp}
                className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 border-t border-base-300 pt-3 text-sm leading-relaxed text-base-content/80"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{h}</span>
                  </li>
                ))}
              </motion.ul>
            )}

            {proof && (
              <motion.p
                variants={fadeUp}
                className="mt-10 max-w-[42ch] border-l-2 border-primary pl-4 font-mono text-sm uppercase tracking-[0.16em] text-base-content/65"
              >
                {proof}
              </motion.p>
            )}
          </div>

          {/* Right — price card */}
          <motion.aside variants={fadeUp} className="md:col-span-2">
            <div className="md:sticky md:top-8">
              <div className="relative overflow-hidden rounded-3xl bg-base-content p-7 text-base-100 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] md:p-8">
                {/* Soft tint corner */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/25 blur-3xl"
                />

                <div className="relative">
                  {discountBadge && (
                    <span className="mb-4 inline-flex items-center rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-content">
                      {discountBadge}
                    </span>
                  )}

                  {packageNote && (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-base-100/55">
                      {packageNote}
                    </p>
                  )}
                  <h3 className="mt-1 text-xl font-semibold text-base-100">
                    {packageName}
                  </h3>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-mono text-5xl font-semibold leading-none tracking-tight text-base-100 md:text-6xl">
                      {price}
                    </span>
                    {cadence && (
                      <span className="text-sm font-medium text-base-100/60">
                        {cadence}
                      </span>
                    )}
                  </div>
                  {originalPrice && (
                    <p className="mt-1 font-mono text-sm text-base-100/50 line-through decoration-base-100/40">
                      {originalPrice}
                    </p>
                  )}

                  <ul className="mt-7 flex flex-col gap-3">
                    {inclusions.map((inc, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm leading-relaxed text-base-100/85"
                      >
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-base-100/15 text-base-100"
                          aria-hidden="true"
                        >
                          <FiCheck className="h-3 w-3" />
                        </span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-col gap-3">
                    <CtaButton
                      variant={ctaVariant}
                      colorScheme={ctaColorScheme}
                      href={ctaUrl}
                      className="w-full justify-center"
                    >
                      {ctaText}
                    </CtaButton>
                    {secondaryCtaText && secondaryCtaUrl && (
                      <a
                        href={secondaryCtaUrl}
                        className="text-center text-sm font-medium text-base-100/70 underline-offset-4 transition hover:text-base-100 hover:underline"
                      >
                        {secondaryCtaText}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {footnote && (
                <p className="mt-4 text-sm leading-relaxed text-base-content/55">
                  {footnote}
                </p>
              )}
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}
