"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TestimonialSpotlightQuoteProps {
  /** Optional eyebrow label rendered above the quote (e.g. "From the field") */
  eyebrow?: string;
  /** The pull-quote — rendered hero-sized */
  quote: string;
  /** Author full name */
  authorName: string;
  /** Author title / role / company */
  authorTitle: string;
  /** Author photo URL — when omitted, useSafeImageSrc picks a deterministic placeholder */
  authorImage?: string;
  /** Accessible alt text for the author photo */
  authorImageAlt?: string;
  /** Optional company logo URL (small, displayed under author title) */
  companyLogo?: string;
  /** Accessible alt for the company logo */
  companyLogoAlt?: string;
  /** Optional small caption rendered after the author block (e.g. metric, date) */
  caption?: string;
  /**
   * "neutral" — bg-base-100 / text-base-content (default)
   * "muted" — bg-base-200 surface
   * "inverse" — bg-base-content text-base-100, editorial impact
   */
  tone?: "neutral" | "muted" | "inverse";
  /** Site-wide visual configuration — accepted for API consistency */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TestimonialSpotlightQuote -- a hero-sized single-quote testimonial.
 * The quote is the page; one author, one piece of copy, generous
 * whitespace, and a calm portrait off to the side. Use when one customer
 * voice is doing the heavy social-proof lifting.
 */
export default function TestimonialSpotlightQuote({
  eyebrow,
  quote,
  authorName,
  authorTitle,
  authorImage,
  authorImageAlt,
  companyLogo,
  companyLogoAlt,
  caption,
  tone = "neutral",
  className,
}: TestimonialSpotlightQuoteProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeImage = useSafeImageSrc(
    authorImage,
    `spotlight-${authorName}`,
    480,
    480,
  );

  const isInverse = tone === "inverse";

  const surfaceClass = cn(
    "w-full",
    tone === "neutral" && "bg-base-100",
    tone === "muted" && "bg-base-200",
    isInverse && "bg-base-content text-base-100",
  );

  const eyebrowColor = isInverse ? "text-base-100/55" : "text-primary";
  const quoteColor = isInverse ? "text-base-100" : "text-base-content";
  const nameColor = isInverse ? "text-base-100" : "text-base-content";
  const titleColor = isInverse ? "text-base-100/65" : "text-base-content/65";
  const ringColor = isInverse ? "ring-base-100/15" : "ring-base-300";
  const captionColor = isInverse ? "text-base-100/55" : "text-base-content/55";
  const markColor = isInverse ? "text-base-100/15" : "text-base-content/10";

  return (
    <section className={cn(surfaceClass, "py-16 md:py-24 lg:py-32", className)}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,_3fr)_minmax(0,_2fr)] lg:gap-16">
        {/* Quote column */}
        <motion.div
          className="relative flex flex-col gap-8"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Decorative open-quote glyph */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute -left-2 -top-12 select-none font-serif text-[8rem] leading-none md:-top-16 md:text-[12rem]",
              markColor,
            )}
          >
            &ldquo;
          </span>

          <div className="relative z-10 flex flex-col gap-6">
            {eyebrow && (
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.25em]",
                  eyebrowColor,
                )}
              >
                {eyebrow}
              </span>
            )}

            <blockquote
              className={cn(
                "text-2xl font-medium leading-tight tracking-tight md:text-3xl lg:text-[2.5rem] lg:leading-[1.15]",
                quoteColor,
              )}
            >
              {quote}
            </blockquote>

            {/* Author block */}
            <div className="flex items-center gap-4 pt-2">
              <div className="lg:hidden">
                <img
                  {...safeImage}
                  alt={authorImageAlt ?? authorName}
                  className={cn(
                    "h-12 w-12 rounded-full object-cover ring-1",
                    ringColor,
                  )}
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className={cn("text-base font-semibold", nameColor)}>
                  {authorName}
                </span>
                <span className={cn("text-sm", titleColor)}>{authorTitle}</span>
                {companyLogo && (
                  <img
                    src={companyLogo}
                    alt={companyLogoAlt ?? `${authorName} company logo`}
                    className={cn(
                      "mt-2 h-5 w-auto",
                      isInverse ? "opacity-80" : "opacity-70",
                    )}
                    loading="lazy"
                  />
                )}
              </div>
            </div>

            {caption && (
              <p
                className={cn(
                  "border-t pt-4 text-sm",
                  isInverse ? "border-base-100/15" : "border-base-300",
                  captionColor,
                )}
              >
                {caption}
              </p>
            )}
          </div>
        </motion.div>

        {/* Portrait column — desktop only, larger format */}
        <motion.div
          className="hidden lg:block"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div
            className={cn(
              "relative aspect-[4/5] w-full overflow-hidden rounded-2xl ring-1",
              ringColor,
            )}
          >
            <img
              {...safeImage}
              alt={authorImageAlt ?? authorName}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
