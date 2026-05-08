"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import { buttonStyles } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ManifestoValue {
  /** Short value heading — the verb / principle (e.g. "We ship before we polish"). */
  title: string;
  /** Body paragraph that explains how the value shows up in practice. */
  description: string;
  /** Optional supporting image — falls back to a seeded picsum if absent. */
  image?: string;
  /** Required alt text when `image` is provided (or for the picsum fallback). */
  imageAlt: string;
  /**
   * Optional caption rendered as a small monospaced overlay chip on the image
   * (e.g. "Office hours · Friday").
   */
  caption?: string;
}

export interface TeamValuesManifestoProps {
  /** Eyebrow above the headline (e.g. "What we believe"). */
  eyebrow?: string;
  /** Section headline — the manifesto title. */
  headline: string;
  /**
   * Manifesto paragraph — sets up the values list. One or two sentences;
   * keep under ~280 characters for an editorial top-of-section read.
   */
  manifesto?: string;
  /**
   * Values list — 3 to 5 entries reads best. Each value renders as an
   * alternating image-text row (zigzag: image-left/text-right, then flipped).
   */
  values: ManifestoValue[];
  /**
   * Tone:
   * - "neutral" — bg-base-100 (default)
   * - "muted"   — bg-base-200 surface for a softer editorial feel
   */
  tone?: "neutral" | "muted";
  /** Optional CTA — anchors the section (e.g. "Read the full handbook"). */
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface ValueRowProps {
  value: ManifestoValue;
  numeral: string;
  /** Even index → image-left/text-right. Odd → flipped. */
  flipped: boolean;
}

/**
 * ValueRow — one numbered value, rendered as a half/half image-text split
 * on lg+ and a stacked image-then-text on mobile. The row alternates
 * direction via the `flipped` prop; the numeral stays anchored to the text
 * column so the rhythm reads "01 → photo · 02 → photo · 03 → photo".
 */
function ValueRow({ value, numeral, flipped }: ValueRowProps) {
  const safe = useSafeImageSrc(value.image, `manifesto-${numeral}`, 900, 1100);

  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "grid grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-12 lg:gap-14",
      )}
    >
      {/* Image column — always rendered first in DOM order so screen
          readers hear the image's alt before the heading. Visual order
          on lg+ is controlled by lg:order-* utilities below. */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl bg-base-200",
          "lg:col-span-6",
          // Zig-zag: even (flipped=false) keeps image left; odd flips it right.
          flipped ? "lg:order-2" : "lg:order-1",
        )}
      >
        <div className="relative aspect-[4/5] w-full md:aspect-[5/4] lg:aspect-[4/5]">
          <img
            src={safe.src}
            onError={safe.onError}
            alt={value.imageAlt}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover",
              "transition-transform duration-700 ease-out",
              "group-hover/row:scale-[1.02]",
            )}
          />
          {/* Persistent token-driven inner ring so the photo edge sits
              cleanly against either light or dark surfaces. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-base-content/10"
          />

          {value.caption && (
            <>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
              />
              <span className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/95">
                <span className="h-px w-4 bg-white/70" aria-hidden />
                <span className="truncate">{value.caption}</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Text column */}
      <div
        className={cn(
          "flex flex-col gap-4 lg:col-span-5",
          flipped ? "lg:order-1 lg:col-start-1" : "lg:order-2 lg:col-start-8",
        )}
      >
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
            {numeral}
          </span>
          <span className="h-px w-12 bg-base-300" aria-hidden />
        </div>

        <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-base-content md:text-3xl lg:text-4xl">
          {value.title}
        </h3>

        <p className="max-w-[55ch] text-base leading-relaxed text-base-content/70 md:text-[17px]">
          {value.description}
        </p>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TeamValuesManifesto — editorial values list for About / Culture pages.
 * Opens with an eyebrow, manifesto headline, and one supporting paragraph,
 * then renders 3-5 numbered values as alternating image-text rows.
 *
 * Differs from sibling team components by leading with principles rather
 * than people — pair it with TeamLeadershipGrid or TeamFounderSplit when
 * the page also needs to introduce the humans behind the principles.
 *
 * Dials targeted: VARIANCE 6 / MOTION 5 / DENSITY 5 (team category;
 * picked a reliable zigzag rhythm over an asymmetric bento — ships
 * cleanly across breakpoints and survives sparse/long-copy content).
 */
export default function TeamValuesManifesto({
  eyebrow,
  headline,
  manifesto,
  values,
  tone = "neutral",
  ctaText,
  ctaUrl,
  className,
}: TeamValuesManifestoProps) {
  const shouldReduceMotion = useReducedMotion();

  // Cap at 5 — past that the rhythm flattens and the section overstays.
  const visibleValues = values.slice(0, 5);
  const totalLabel = `01 — ${String(visibleValues.length).padStart(2, "0")}`;

  return (
    <section
      className={cn(
        "w-full py-16 md:py-20 lg:py-24",
        tone === "muted" ? "bg-base-200" : "bg-base-100",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* ---------------------------------------------------------- */}
        {/*  Editorial header — eyebrow rail + asymmetric headline /    */}
        {/*  manifesto split.                                           */}
        {/* ---------------------------------------------------------- */}
        <motion.header
          className="mb-12 grid grid-cols-1 gap-y-6 md:mb-16 md:grid-cols-12 md:gap-x-8 md:gap-y-10 lg:mb-20"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Top rail */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-4 md:col-span-12 md:gap-6"
          >
            {eyebrow && (
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                {eyebrow}
              </span>
            )}
            <span className="h-px flex-1 bg-base-300" aria-hidden />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-base-content/45">
              {totalLabel}
            </span>
          </motion.div>

          {/* Headline left, manifesto right (aligned to bottom for editorial bite). */}
          <motion.h2
            variants={fadeUp}
            className={cn(
              "text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-base-content",
              "sm:text-4xl md:col-span-7 md:text-5xl lg:text-6xl",
            )}
          >
            {headline}
          </motion.h2>

          {manifesto && (
            <motion.div
              variants={fadeUp}
              className="md:col-span-5 md:col-start-8 md:self-end"
            >
              <span
                className="mb-3 block h-px w-10 bg-primary md:mb-4"
                aria-hidden
              />
              <p className="max-w-[52ch] text-base leading-relaxed text-base-content/70 md:text-[17px]">
                {manifesto}
              </p>
            </motion.div>
          )}
        </motion.header>

        {/* ---------------------------------------------------------- */}
        {/*  Values — alternating image-text rows                       */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          className="group/row flex flex-col gap-16 md:gap-20 lg:gap-28"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {visibleValues.map((value, idx) => (
            <ValueRow
              key={`${value.title}-${idx}`}
              value={value}
              numeral={String(idx + 1).padStart(2, "0")}
              flipped={idx % 2 === 1}
            />
          ))}
        </motion.div>

        {/* ---------------------------------------------------------- */}
        {/*  Closer — quiet hairline + CTA on the right                 */}
        {/* ---------------------------------------------------------- */}
        {ctaText && ctaUrl && (
          <motion.div
            className={cn(
              "mt-16 flex flex-col items-start gap-6 border-t border-base-300 pt-8",
              "md:mt-20 md:flex-row md:items-center md:justify-between md:gap-8 md:pt-10",
            )}
            variants={fadeUp}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-base-content/55">
                {totalLabel}
              </span>
              <span
                className="hidden h-px w-16 bg-base-300 md:block"
                aria-hidden
              />
            </div>
            <a
              href={ctaUrl}
              className={cn(
                buttonStyles({ variant: "primary", size: "md" }),
                "group/cta",
              )}
            >
              <span>{ctaText}</span>
              <span
                aria-hidden
                className="ml-1 inline-block transition-transform duration-200 ease-out group-hover/cta:translate-x-1"
              >
                →
              </span>
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
