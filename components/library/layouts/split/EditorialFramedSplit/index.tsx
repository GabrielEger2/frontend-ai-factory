"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { Highlighter } from "@ui/text-decorations/Highlighter";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface EditorialFramedSplitProps {
  /** Small label rendered above the headline (e.g. "Our Studio"). */
  eyebrow?: string;
  /** Lead editorial headline rendered inside a framed card. */
  headline: string;
  /** Optional word inside the headline to wrap with a hand-drawn underline. */
  highlightWord?: string;
  /** Lead CTA label. */
  ctaText: string;
  /** Lead CTA destination URL. */
  ctaUrl: string;
  /** Lead image displayed opposite the framed headline card. */
  leadImage: string;
  /** Accessible alt text for the lead image. */
  leadImageAlt: string;
  /** Secondary image displayed below, opposite the supporting copy. */
  secondaryImage: string;
  /** Accessible alt text for the secondary image. */
  secondaryImageAlt: string;
  /** Heading for the supporting card below the lead row. */
  supportingHeadline: string;
  /** Body copy for the supporting card. */
  supportingBody: string;
  /** CTA visual variant. */
  ctaVariant?: CtaVariant;
  /** CTA color scheme. */
  ctaColorScheme?: ColorScheme;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function renderHeadlineWithHighlight(headline: string, highlightWord?: string) {
  if (!highlightWord) return headline;
  const idx = headline.toLowerCase().indexOf(highlightWord.toLowerCase());
  if (idx === -1) return headline;
  const before = headline.slice(0, idx);
  const match = headline.slice(idx, idx + highlightWord.length);
  const after = headline.slice(idx + highlightWord.length);
  return (
    <>
      {before}
      <Highlighter action="underline">{match}</Highlighter>
      {after}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * EditorialFramedSplit — a two-row, two-column editorial split where a
 * framed serif headline card sits opposite a tall lead image, with a
 * supporting image and quiet body card below. Built for studios,
 * agencies, and craft-led brands telling a story.
 */
export default function EditorialFramedSplit({
  eyebrow,
  headline,
  highlightWord,
  ctaText,
  ctaUrl,
  leadImage,
  leadImageAlt,
  secondaryImage,
  secondaryImageAlt,
  supportingHeadline,
  supportingBody,
  ctaVariant = "default",
  ctaColorScheme = "neutral",
  className,
}: EditorialFramedSplitProps) {
  const prefersReducedMotion = useReducedMotion();

  const sharedReveal = {
    initial: prefersReducedMotion ? false : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.3, ease: "easeOut" as const },
  };

  return (
    <section
      className={cn(
        "w-full bg-base-100 text-base-content",
        "px-4 py-12 md:px-8 md:py-16 lg:px-12 lg:py-24",
        className,
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Row 1 — framed headline card */}
        <motion.div
          {...sharedReveal}
          className={cn(
            "flex flex-col justify-center",
            "rounded-lg border border-base-300",
            "px-6 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20",
          )}
        >
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-base-content/60">
              {eyebrow}
            </p>
          )}
          <h2 className="font-serif text-4xl font-bold leading-tight text-base-content md:text-5xl lg:text-6xl">
            {renderHeadlineWithHighlight(headline, highlightWord)}
          </h2>
          <div className="mt-10 flex justify-end">
            <CtaButton
              variant={ctaVariant}
              colorScheme={ctaColorScheme}
              href={ctaUrl}
            >
              {ctaText}
            </CtaButton>
          </div>
        </motion.div>

        {/* Row 1 — lead image */}
        <motion.div
          {...sharedReveal}
          transition={{ ...sharedReveal.transition, delay: 0.08 }}
          className="overflow-hidden rounded-lg"
        >
          <img
            src={leadImage}
            alt={leadImageAlt}
            loading="lazy"
            className="aspect-[4/5] h-full w-full object-cover"
          />
        </motion.div>

        {/* Row 2 — secondary image */}
        <motion.div
          {...sharedReveal}
          className="overflow-hidden rounded-lg"
        >
          <img
            src={secondaryImage}
            alt={secondaryImageAlt}
            loading="lazy"
            className="aspect-[4/3] h-full w-full object-cover"
          />
        </motion.div>

        {/* Row 2 — supporting body card */}
        <motion.div
          {...sharedReveal}
          transition={{ ...sharedReveal.transition, delay: 0.08 }}
          className={cn(
            "flex flex-col justify-center",
            "rounded-lg bg-base-200",
            "px-6 py-10 md:px-10 md:py-14 lg:px-12 lg:py-16",
          )}
        >
          <h3 className="font-serif text-2xl font-bold leading-tight text-base-content md:text-3xl">
            {supportingHeadline}
          </h3>
          <p className="mt-4 font-serif text-base italic leading-relaxed text-base-content/70 md:text-lg">
            {supportingBody}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
