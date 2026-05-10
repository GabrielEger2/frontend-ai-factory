"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CaseStudyChapter {
  /** Section label — e.g. "Problem", "Approach", "Result" */
  label: string;
  /** Section heading */
  heading: string;
  /** Body copy — single paragraph reads best */
  body: string;
  /** Optional supporting image */
  image?: string;
  /** Alt text required when image is set */
  imageAlt?: string;
}

export interface CaseStudyMetric {
  /** The number itself — keep it organic (e.g. "47.2%", "3,847") */
  value: string;
  /** One-line context for the number */
  label: string;
}

export interface GalleryCaseStudyProps {
  /** Eyebrow above the title (e.g. "Case study · 2024") */
  eyebrow?: string;
  /** Project title */
  title: string;
  /** One-sentence summary of the engagement */
  summary: string;
  /** Hero image displayed above the chapters */
  heroImage: string;
  /** Alt text for the hero image */
  heroImageAlt: string;
  /** Project meta — client, role, year, team */
  meta?: Array<{ label: string; value: string }>;
  /** Three chapters: Problem / Approach / Result reads best */
  chapters: CaseStudyChapter[];
  /** Quantified outcomes rendered as a stat band */
  metrics?: CaseStudyMetric[];
  /** Optional closing CTA — link to next case study or contact */
  ctaText?: string;
  ctaUrl?: string;
  ctaVariant?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface ChapterImageProps {
  src?: string;
  alt?: string;
  seed: string;
}

function ChapterImage({ src, alt, seed }: ChapterImageProps) {
  const safe = useSafeImageSrc(src, seed, 900, 600);
  if (!src && !seed) return null;
  return (
    <div className="overflow-hidden rounded-2xl bg-base-200">
      <img
        src={safe.src}
        onError={safe.onError}
        alt={alt || ""}
        loading="lazy"
        className="aspect-[3/2] h-full w-full object-cover"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * GalleryCaseStudy — long-form case-study layout. A wide hero image
 * anchors the page; three alternating chapters (Problem / Approach /
 * Result) zig-zag image versus copy; an organic-numbers metric band
 * lifts the outcomes; an optional closing CTA points to the next study.
 *
 * Generous breathing room (`py-24+`) — this is editorial density, not
 * cockpit.
 */
export default function GalleryCaseStudy({
  eyebrow,
  title,
  summary,
  heroImage,
  heroImageAlt,
  meta,
  chapters,
  metrics,
  ctaText,
  ctaUrl,
  ctaVariant = "default",
  ctaColorScheme = "neutral",
  className,
}: GalleryCaseStudyProps) {
  const shouldReduceMotion = useReducedMotion();
  const heroSafe = useSafeImageSrc(heroImage, "case-study-hero", 1600, 900);

  return (
    <section
      className={cn("w-full bg-base-100 py-16 md:py-24 lg:py-32", className)}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Header */}
        <motion.header
          className="mb-10 flex max-w-3xl flex-col md:mb-14"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {eyebrow && (
            <motion.p
              variants={fadeUp}
              className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h2
            variants={fadeUp}
            className="text-balance text-4xl font-semibold tracking-tight text-base-content sm:text-5xl md:text-6xl"
          >
            {title}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-[60ch] text-lg leading-relaxed text-base-content/70"
          >
            {summary}
          </motion.p>
        </motion.header>

        {/* Hero image */}
        <motion.div
          className="mb-10 overflow-hidden rounded-3xl bg-base-200 md:mb-16"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <img
            src={heroSafe.src}
            onError={heroSafe.onError}
            alt={heroImageAlt}
            loading="lazy"
            className="aspect-[16/9] h-full w-full object-cover"
          />
        </motion.div>

        {/* Meta strip */}
        {meta && meta.length > 0 && (
          <motion.dl
            className="mb-16 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-base-300 py-6 md:mb-24 md:grid-cols-4"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {meta.map((m, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex flex-col gap-1"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-base-content/55">
                  {m.label}
                </dt>
                <dd className="text-base font-medium text-base-content">
                  {m.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        )}

        {/* Chapters — zig-zag */}
        <div className="flex flex-col gap-16 md:gap-24">
          {chapters.map((chapter, i) => {
            const reversed = i % 2 === 1;
            return (
              <motion.article
                key={i}
                className={cn(
                  "grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-14",
                )}
                variants={containerVariants}
                initial={shouldReduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.div
                  variants={fadeUp}
                  className={cn(
                    "lg:col-span-5",
                    reversed ? "lg:order-2" : "lg:order-1",
                  )}
                >
                  <span className="mb-4 inline-block font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                    {String(i + 1).padStart(2, "0")} · {chapter.label}
                  </span>
                  <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-base-content md:text-3xl lg:text-4xl">
                    {chapter.heading}
                  </h3>
                  <p className="mt-5 max-w-[55ch] text-base leading-relaxed text-base-content/70 md:text-lg">
                    {chapter.body}
                  </p>
                </motion.div>

                {chapter.image && (
                  <motion.div
                    variants={fadeUp}
                    className={cn(
                      "lg:col-span-7",
                      reversed ? "lg:order-1" : "lg:order-2",
                    )}
                  >
                    <ChapterImage
                      src={chapter.image}
                      alt={chapter.imageAlt}
                      seed={`case-study-chapter-${i}`}
                    />
                  </motion.div>
                )}
              </motion.article>
            );
          })}
        </div>

        {/* Metrics band — ruled editorial grid: a single hairline frame with
            serif numerals and column dividers. Distinct from the dark slab
            used by CarouselBeforeAfter / FeaturesBentoGrid so two content
            sections in a row don't collapse into a single dark stripe. */}
        {metrics && metrics.length > 0 && (
          <motion.div
            className="mt-20 grid grid-cols-2 border-y border-base-content/15 md:mt-28 md:grid-cols-4"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={cn(
                  "flex flex-col items-start gap-2 px-4 py-8 md:px-8 md:py-12",
                  // Vertical dividers between columns on md+, and between
                  // the two stacked rows on mobile.
                  i % 2 === 1 ? "border-l border-base-content/15" : "",
                  i < 2 ? "border-b border-base-content/15 md:border-b-0" : "",
                  i >= 2 ? "md:border-l md:border-base-content/15" : "",
                  i === 0 ? "md:border-l-0" : "",
                  i === 2 ? "md:border-l md:border-base-content/15" : "",
                )}
              >
                <span className="font-serif text-4xl font-semibold tracking-tight text-base-content md:text-6xl">
                  {m.value}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-base-content/55 md:text-xs">
                  {m.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        {ctaText && (
          <div className="mt-16 flex justify-start md:mt-20">
            <CtaButton
              variant={ctaVariant}
              colorScheme={ctaColorScheme}
              href={ctaUrl}
            >
              {ctaText}
            </CtaButton>
          </div>
        )}
      </div>
    </section>
  );
}
