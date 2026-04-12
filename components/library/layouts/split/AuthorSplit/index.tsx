"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp, imageReveal } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AuthorSplitProps {
  /** Large banner image at the top */
  bannerImage: string;
  bannerImageAlt: string;
  /** Author avatar (circular) */
  authorImage: string;
  authorImageAlt: string;
  /** Author name */
  authorName: string;
  /** Short tagline or bio displayed below the name */
  authorTagline: string;
  /** Main body text */
  description: string;
  /** CTA text displayed below the body text */
  ctaText?: string;
  /** CTA destination URL */
  ctaUrl?: string;
  /** Site-wide style configuration */
  styleKit?: StyleKit;
  /** Informational purpose tag for the section */
  purpose?: string;
  className?: string;
}

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
 * AuthorSplit -- a content section with a wide banner image followed
 * by a split layout: author profile on the left, long-form text on the right.
 * Great for about pages, founder stories, or team member spotlights.
 */
export default function AuthorSplit({
  bannerImage,
  bannerImageAlt,
  authorImage,
  authorImageAlt,
  authorName,
  authorTagline,
  description,
  ctaText,
  ctaUrl,
  styleKit: _styleKit,
  purpose,
  className,
}: AuthorSplitProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      data-purpose={purpose}
      className={cn("w-full bg-base-100 py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        {/* Banner image */}
        <motion.div
          className="mb-10 h-64 w-full overflow-hidden rounded-lg"
          variants={imageReveal}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <img
            src={bannerImage}
            alt={bannerImageAlt}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </motion.div>

        {/* Author + content split */}
        <motion.div
          className="flex flex-col gap-10 sm:flex-row"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Author column */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center text-center sm:w-1/3 sm:py-8 sm:pr-8"
          >
            <div className="inline-flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-base-200">
              <img
                src={authorImage}
                alt={authorImageAlt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <h2 className="mt-4 text-lg font-medium text-base-content">
              {authorName}
            </h2>
            <div className="mt-2 mb-4 h-1 w-12 rounded bg-primary" />
            <p className="text-base text-base-content/60">{authorTagline}</p>
          </motion.div>

          {/* Text column */}
          <motion.div
            variants={fadeUp}
            className="border-t border-base-300 pt-4 text-center sm:w-2/3 sm:border-l sm:border-t-0 sm:py-8 sm:pl-8 sm:text-left"
          >
            <p className="mb-4 text-lg leading-relaxed text-base-content/70">
              {description}
            </p>
            {ctaText && ctaUrl && (
              <a
                href={ctaUrl}
                className="inline-flex items-center text-primary transition-colors hover:text-primary/80"
              >
                {ctaText}
                <ArrowRight className="ml-2" />
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
