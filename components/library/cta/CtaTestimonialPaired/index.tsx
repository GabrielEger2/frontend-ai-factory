"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CtaTestimonialPairedProps {
  /** Small label rendered above the headline (e.g. "Why teams switch") */
  eyebrow?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph beneath the headline */
  description?: string;
  /** Primary CTA copy */
  ctaText: string;
  /** Primary CTA destination */
  ctaUrl: string;
  /** Optional secondary text-link CTA */
  secondaryText?: string;
  secondaryUrl?: string;
  /** Optional perks rendered as inline check-bullets under the CTAs */
  perks?: string[];
  /** Quote body — keep it under ~220 chars for the layout to breathe */
  quote: string;
  /** Author full name */
  authorName: string;
  /** Author role / company (e.g. "Head of Ops, Cardume Studio") */
  authorRole: string;
  /** Optional author portrait — falls back to seeded picsum if omitted */
  authorImage?: string;
  /** Required when an author image is provided */
  authorImageAlt?: string;
  /** Optional small attribution under the quote (e.g. "Verified customer · 2025") */
  attribution?: string;
  /** Optional KPI surfaced next to the quote (e.g. "47.2%", "3,847", "9 weeks") */
  metricValue?: string;
  /** Label for the metric (e.g. "lift in conversions", "active customers") */
  metricLabel?: string;
  /**
   * "split" — copy left, quote right (default, asymmetric reads better)
   * "stacked" — copy on top, quote underneath, narrower max-width
   */
  layoutVariant?: "split" | "stacked";
  /**
   * "neutral" — bg-base-100 (default)
   * "muted" — bg-base-200 surface
   * "inverse" — bg-base-content text-base-100, high-contrast
   */
  tone?: "neutral" | "muted" | "inverse";
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-component — quote card                                         */
/* ------------------------------------------------------------------ */

interface QuoteCardProps {
  quote: string;
  authorName: string;
  authorRole: string;
  authorImage?: string;
  authorImageAlt?: string;
  attribution?: string;
  metricValue?: string;
  metricLabel?: string;
  isInverse: boolean;
}

function QuoteCard({
  quote,
  authorName,
  authorRole,
  authorImage,
  authorImageAlt,
  attribution,
  metricValue,
  metricLabel,
  isInverse,
}: QuoteCardProps) {
  const safe = useSafeImageSrc(
    authorImage,
    `cta-testimonial-${authorName}`,
    160,
    160,
  );

  return (
    <figure
      className={cn(
        "relative flex h-full flex-col gap-6 rounded-2xl p-8 md:p-10",
        isInverse
          ? "bg-base-100/[0.06] ring-1 ring-base-100/15"
          : "bg-base-200 ring-1 ring-base-300",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-7 top-6 select-none font-serif text-7xl leading-none md:text-8xl",
          isInverse ? "text-base-100/15" : "text-base-content/10",
        )}
      >
        &ldquo;
      </span>

      {metricValue && (
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "font-mono text-4xl font-semibold tabular-nums tracking-tight md:text-5xl",
              isInverse ? "text-base-100" : "text-base-content",
            )}
          >
            {metricValue}
          </span>
          {metricLabel && (
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-[0.18em]",
                isInverse ? "text-base-100/55" : "text-base-content/55",
              )}
            >
              {metricLabel}
            </span>
          )}
        </div>
      )}

      <blockquote
        className={cn(
          "relative z-10 text-balance text-lg font-medium leading-relaxed md:text-xl",
          isInverse ? "text-base-100" : "text-base-content",
        )}
      >
        {quote}
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3 pt-2">
        <span
          className={cn(
            "relative h-12 w-12 shrink-0 overflow-hidden rounded-full",
            isInverse ? "bg-base-100/10" : "bg-base-300",
          )}
        >
          <img
            src={safe.src}
            onError={safe.onError}
            alt={authorImageAlt ?? `${authorName}, ${authorRole}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </span>
        <div className="flex flex-col leading-tight">
          <span
            className={cn(
              "text-sm font-semibold",
              isInverse ? "text-base-100" : "text-base-content",
            )}
          >
            {authorName}
          </span>
          <span
            className={cn(
              "text-xs",
              isInverse ? "text-base-100/65" : "text-base-content/60",
            )}
          >
            {authorRole}
          </span>
          {attribution && (
            <span
              className={cn(
                "mt-1 text-[11px] uppercase tracking-[0.18em]",
                isInverse ? "text-base-100/45" : "text-base-content/45",
              )}
            >
              {attribution}
            </span>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CtaTestimonialPaired — primary CTA paired with an embedded social-proof
 * quote. Use when the conversion needs a gentle nudge of credibility right
 * next to the ask. Renders split (left = ask, right = proof) by default;
 * collapses to a single stacked column under md.
 */
export default function CtaTestimonialPaired({
  eyebrow,
  headline,
  description,
  ctaText,
  ctaUrl,
  secondaryText,
  secondaryUrl,
  perks,
  quote,
  authorName,
  authorRole,
  authorImage,
  authorImageAlt,
  attribution,
  metricValue,
  metricLabel,
  layoutVariant = "split",
  tone = "neutral",
  styleKit,
  className,
}: CtaTestimonialPairedProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant: CtaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme: ColorScheme = styleKit?.ctaColorScheme ?? "primary";

  const isInverse = tone === "inverse";
  const isStacked = layoutVariant === "stacked";

  const surfaceClass = cn(
    "w-full",
    tone === "neutral" && "bg-base-100",
    tone === "muted" && "bg-base-200",
    isInverse && "bg-base-content text-base-100",
  );

  const eyebrowClass = isInverse ? "text-base-100/65" : "text-primary";
  const headingClass = isInverse ? "text-base-100" : "text-base-content";
  const bodyClass = isInverse ? "text-base-100/70" : "text-base-content/65";

  return (
    <section className={cn(surfaceClass, "py-16 md:py-24", className)}>
      <div
        className={cn(
          "mx-auto px-4 md:px-8",
          isStacked ? "max-w-3xl" : "max-w-7xl",
        )}
      >
        <motion.div
          className={cn(
            "grid items-stretch gap-10",
            !isStacked && "lg:grid-cols-[1.05fr_1fr] lg:gap-16",
          )}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Copy column */}
          <div className={cn("flex flex-col gap-5", isStacked && "max-w-2xl")}>
            {eyebrow && (
              <motion.span
                variants={fadeUp}
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.25em]",
                  eyebrowClass,
                )}
              >
                {eyebrow}
              </motion.span>
            )}
            <motion.h2
              variants={fadeUp}
              className={cn(
                "text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl",
                headingClass,
              )}
            >
              {headline}
            </motion.h2>
            {description && (
              <motion.p
                variants={fadeUp}
                className={cn(
                  "max-w-xl text-base leading-relaxed md:text-lg",
                  bodyClass,
                )}
              >
                {description}
              </motion.p>
            )}

            <motion.div
              variants={fadeUp}
              className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3"
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

            {perks && perks.length > 0 && (
              <motion.ul variants={fadeUp} className="mt-2 flex flex-col gap-2">
                {perks.map((perk, i) => (
                  <li
                    key={i}
                    className={cn(
                      "flex items-start gap-2 text-sm leading-relaxed",
                      isInverse ? "text-base-100/70" : "text-base-content/70",
                    )}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        isInverse ? "text-base-100" : "text-primary",
                      )}
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.296a1 1 0 0 1 0 1.408l-7.5 7.5a1 1 0 0 1-1.408 0l-3.5-3.5a1 1 0 1 1 1.408-1.408L8.5 12.092l6.796-6.796a1 1 0 0 1 1.408 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{perk}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </div>

          {/* Quote column */}
          <motion.div
            variants={fadeUp}
            className={cn("h-full", isStacked && "mt-2")}
          >
            <QuoteCard
              quote={quote}
              authorName={authorName}
              authorRole={authorRole}
              authorImage={authorImage}
              authorImageAlt={authorImageAlt}
              attribution={attribution}
              metricValue={metricValue}
              metricLabel={metricLabel}
              isInverse={isInverse}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
