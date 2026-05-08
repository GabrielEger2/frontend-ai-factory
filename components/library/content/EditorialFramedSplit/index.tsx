"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { Highlighter } from "@ui/text-decorations/Highlighter";
import {
  AnimatedSvgBackground,
  GEOMETRIC_SHAPES,
} from "@ui/backgrounds/AnimatedSvgBackground";
import { DotPattern } from "@ui/backgrounds/DotPattern";
import { StripedPattern } from "@ui/backgrounds/StripedPattern";
import { GradientBars } from "@ui/backgrounds/GradientBars";
import { InteractiveGridPattern } from "@ui/backgrounds/InteractiveGridPattern";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface EditorialFramedSplitMeta {
  /** Mono-caps label — e.g. "Practice", "Established", "Verified by" */
  label: string;
  /** Plain-weight value */
  value: string;
}

export interface EditorialFramedSplitChapter {
  /** Optional mono-caps index — e.g. "01", "I", "Chapter One" */
  index?: string;
  /** Short label rendered as the chapter heading */
  label: string;
  /** Single-line value or supporting clause */
  value: string;
}

export interface EditorialFramedSplitMetric {
  /** The number itself — keep it organic (e.g. "47.2%", "3,847") */
  value: string;
  /** One-line context for the number */
  label: string;
}

export interface EditorialFramedSplitPullQuote {
  /** The quote itself, no surrounding punctuation */
  quote: string;
  /** Person or organisation it is attributed to */
  attribution: string;
  /** Optional secondary attribution line — role, location, etc. */
  attributionMeta?: string;
}

export interface EditorialFramedSplitProps {
  /** Small label rendered above the headline (e.g. "Our Studio"). */
  eyebrow?: string;
  /** Lead editorial headline rendered inside a framed card. */
  headline: string;
  /** Optional word inside the headline to wrap with a hand-drawn underline. */
  highlightWord?: string;
  /** Optional standfirst paragraph rendered under the headline inside the framed card. */
  standfirst?: string;
  /** Optional 4-up section-level meta strip rendered between the header and the lead row. */
  meta?: EditorialFramedSplitMeta[];
  /** Lead CTA label. */
  ctaText: string;
  /** Lead CTA destination URL. */
  ctaUrl: string;
  /** Lead image displayed opposite the framed headline card. */
  leadImage: string;
  /** Accessible alt text for the lead image. */
  leadImageAlt: string;
  /** Optional caption rendered under the lead image — photo credit, location, year. */
  leadImageCaption?: string;
  /** Secondary image displayed below, opposite the supporting copy. */
  secondaryImage: string;
  /** Accessible alt text for the secondary image. */
  secondaryImageAlt: string;
  /** Optional caption rendered under the secondary image. */
  secondaryImageCaption?: string;
  /** Heading for the supporting card below the lead row. */
  supportingHeadline: string;
  /** Body copy for the supporting card. */
  supportingBody: string;
  /** Optional structured chapter list rendered as a definition-list inside the supporting card. */
  chapters?: EditorialFramedSplitChapter[];
  /** Optional pull quote rendered between the editorial grid and the metrics band. */
  pullQuote?: EditorialFramedSplitPullQuote;
  /** Optional outcome metrics rendered as a dark band below the editorial grid. */
  metrics?: EditorialFramedSplitMetric[];
  /** Optional closing CTA — e.g. "Read the founding letter". Renders below metrics. */
  closingCtaText?: string;
  /** Optional closing CTA destination URL. */
  closingCtaUrl?: string;
  /** Optional methodology / credit footnote rendered at the bottom of the section. */
  footnote?: string;
  /** CTA visual variant. */
  ctaVariant?: CtaVariant;
  /** CTA color scheme. */
  ctaColorScheme?: ColorScheme;
  /** Optional motif-echo background rendered behind the section content */
  backgroundVariant?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Motif renderer                                                     */
/* ------------------------------------------------------------------ */

function renderMotif(bg?: string) {
  switch (bg) {
    case "animated-svg":
      return <AnimatedSvgBackground shapes={GEOMETRIC_SHAPES} />;
    case "dot-pattern":
      return <DotPattern />;
    case "striped":
      return <StripedPattern />;
    case "gradient-bars":
      return <GradientBars />;
    case "interactive-grid":
      return <InteractiveGridPattern />;
    default:
      return null;
  }
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
 * EditorialFramedSplit — a long-form editorial split where a framed
 * serif headline card sits opposite a tall lead image, with a
 * supporting image and a chapter-rich body card below. Optional
 * section-level meta strip, image captions, pull-quote, dark outcome
 * metrics band, closing CTA and methodology footnote let the section
 * carry an entire about/story page on its own. Built for studios,
 * agencies, heritage brands and craft-led businesses telling a
 * detailed story.
 */
export default function EditorialFramedSplit({
  eyebrow,
  headline,
  highlightWord,
  standfirst,
  meta,
  ctaText,
  ctaUrl,
  leadImage,
  leadImageAlt,
  leadImageCaption,
  secondaryImage,
  secondaryImageAlt,
  secondaryImageCaption,
  supportingHeadline,
  supportingBody,
  chapters,
  pullQuote,
  metrics,
  closingCtaText,
  closingCtaUrl,
  footnote,
  ctaVariant = "default",
  ctaColorScheme = "neutral",
  backgroundVariant,
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
        "relative isolate w-full overflow-hidden bg-base-100 text-base-content",
        "px-4 py-12 md:px-8 md:py-16 lg:px-12 lg:py-24",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        {renderMotif(backgroundVariant)}
      </div>

      <div className="mx-auto max-w-7xl">
        {/* ---------- Section-level meta strip ---------- */}
        {meta && meta.length > 0 && (
          <motion.dl
            className="mb-10 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-base-300 py-6 md:mb-14 md:grid-cols-4"
            variants={containerVariants}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {meta.map((m, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex flex-col gap-1"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-base-content/55">
                  {m.label}
                </dt>
                <dd className="text-base font-medium text-base-content">
                  {m.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        )}

        {/* ---------- Editorial grid ---------- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
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
              <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-base-content/60">
                {eyebrow}
              </p>
            )}
            <h2 className="font-serif text-4xl font-bold leading-tight text-base-content md:text-5xl lg:text-6xl">
              {renderHeadlineWithHighlight(headline, highlightWord)}
            </h2>
            {standfirst && (
              <p className="mt-6 max-w-[48ch] font-serif text-lg leading-relaxed text-base-content/70 md:text-xl">
                {standfirst}
              </p>
            )}
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
          <motion.figure
            {...sharedReveal}
            transition={{ ...sharedReveal.transition, delay: 0.08 }}
            className="flex flex-col gap-3"
          >
            <div className="overflow-hidden rounded-lg">
              <img
                src={leadImage}
                alt={leadImageAlt}
                loading="lazy"
                className="aspect-[4/5] h-full w-full object-cover"
              />
            </div>
            {leadImageCaption && (
              <figcaption className="font-mono text-[11px] uppercase tracking-[0.2em] text-base-content/55">
                {leadImageCaption}
              </figcaption>
            )}
          </motion.figure>

          {/* Row 2 — secondary image */}
          <motion.figure {...sharedReveal} className="flex flex-col gap-3">
            <div className="overflow-hidden rounded-lg">
              <img
                src={secondaryImage}
                alt={secondaryImageAlt}
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
            {secondaryImageCaption && (
              <figcaption className="font-mono text-[11px] uppercase tracking-[0.2em] text-base-content/55">
                {secondaryImageCaption}
              </figcaption>
            )}
          </motion.figure>

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

            {chapters && chapters.length > 0 && (
              <dl className="mt-8 flex flex-col divide-y divide-base-300 border-t border-base-300">
                {chapters.map((chapter, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <dt className="flex shrink-0 items-baseline gap-2 sm:w-32">
                      {chapter.index && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-base-content/45">
                          {chapter.index}
                        </span>
                      )}
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-base-content/60">
                        {chapter.label}
                      </span>
                    </dt>
                    <dd className="text-sm leading-relaxed text-base-content md:text-base">
                      {chapter.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </motion.div>
        </div>

        {/* ---------- Pull quote ---------- */}
        {pullQuote && (
          <motion.figure
            className="mt-16 max-w-4xl border-l-2 border-primary pl-6 md:mt-24 md:pl-10"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <blockquote className="text-balance font-serif text-2xl leading-snug text-base-content md:text-3xl lg:text-4xl">
              &ldquo;{pullQuote.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex flex-col gap-1">
              <span className="text-sm font-medium text-base-content md:text-base">
                {pullQuote.attribution}
              </span>
              {pullQuote.attributionMeta && (
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-base-content/55">
                  {pullQuote.attributionMeta}
                </span>
              )}
            </figcaption>
          </motion.figure>
        )}

        {/* ---------- Outcome metrics band ---------- */}
        {metrics && metrics.length > 0 && (
          <motion.div
            className={cn(
              "grid grid-cols-2 gap-6 rounded-3xl bg-base-content px-6 py-10 text-base-100 md:grid-cols-4 md:px-12 md:py-14",
              pullQuote ? "mt-12 md:mt-16" : "mt-16 md:mt-24",
            )}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {metrics.map((m, i) => (
              <div key={i} className="flex flex-col items-start gap-1">
                <span className="font-mono text-3xl font-semibold tracking-tight md:text-5xl">
                  {m.value}
                </span>
                <span className="text-xs leading-snug text-base-100/70 md:text-sm">
                  {m.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* ---------- Closing CTA ---------- */}
        {closingCtaText && closingCtaUrl && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-12 flex justify-start md:mt-16"
          >
            <CtaButton
              variant={ctaVariant}
              colorScheme={ctaColorScheme}
              href={closingCtaUrl}
            >
              {closingCtaText}
            </CtaButton>
          </motion.div>
        )}

        {/* ---------- Methodology footnote ---------- */}
        {footnote && (
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "max-w-[70ch] font-mono text-[11px] leading-relaxed tracking-[0.04em] text-base-content/55",
              metrics || closingCtaText ? "mt-10" : "mt-16 md:mt-20",
            )}
          >
            {footnote}
          </motion.p>
        )}
      </div>
    </section>
  );
}
