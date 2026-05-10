"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import * as FiIcons from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type BentoCardSize = "large" | "medium" | "small";
export type BentoAccentScheme = "primary" | "secondary" | "accent";

export interface BentoFeatureMetric {
  /** The number itself — keep it organic ("47.2%", "3.4 hrs/wk", "1,247"). */
  value: string;
  /** One-line context for the number. */
  label: string;
}

export interface BentoFeatureItem {
  /** Visual size class — drives grid span and typography scale */
  size: BentoCardSize;
  /**
   * Optional Feather icon name from `react-icons/fi` (e.g. "FiZap",
   * "FiLayers"). Pass without the prefix is also accepted ("Zap" → "FiZap").
   * Unknown names render no icon.
   */
  iconName?: string;
  /** Optional mono-caps eyebrow rendered above the title — e.g. "Module 03" */
  eyebrow?: string;
  title: string;
  description: string;
  /** Optional inline metric — surfaces an organic number inside the tile.
   *  Renders as a mono numeral with a one-line label, anchored to the bottom. */
  metric?: BentoFeatureMetric;
  /** Optional bullet list (max 3) — renders below the description.
   *  Useful on `large` tiles to carry feature sub-points without a sub-grid. */
  bullets?: string[];
  /** Tints the corner gradient and icon backplate. Defaults to "primary". */
  accentScheme?: BentoAccentScheme;
}

/** Section-level meta strip — same shape as ComparisonSplit / CarouselBeforeAfter. */
export interface BentoMeta {
  /** Mono-caps label — e.g. "Stack", "Window", "Verified by" */
  label: string;
  /** Plain-weight value */
  value: string;
}

export interface BentoMetric {
  /** The number itself — keep it organic (e.g. "47.2%", "3,847") */
  value: string;
  /** One-line context for the number */
  label: string;
}

export interface BentoPullQuote {
  /** The quote itself, no surrounding punctuation */
  quote: string;
  /** Person or organisation it is attributed to */
  attribution: string;
  /** Optional secondary attribution line — role, location, etc. */
  attributionMeta?: string;
}

export interface FeaturesBentoGridProps {
  /** Small uppercase label rendered above the headline. */
  eyebrow?: string;
  /** Section headline. */
  headline: string;
  /** Optional supporting paragraph below the headline. */
  subheadline?: string;
  /** Optional section-level meta strip — renders as a 4-up dl band under the header. */
  meta?: BentoMeta[];
  /** 5–7 feature tiles. Mix sizes for asymmetric rhythm. */
  features: BentoFeatureItem[];
  /** Optional methodology / fine-print footnote rendered below the grid. */
  footnote?: string;
  /** Optional pull-quote — renders between the grid and the metrics band. */
  pullQuote?: BentoPullQuote;
  /** Optional outcome metrics rendered as a dark band below the grid. */
  metrics?: BentoMetric[];
  /** Optional CTA label rendered below the grid. */
  ctaText?: string;
  /** CTA destination URL. */
  ctaUrl?: string;
  /** Visual treatment for the CTA. */
  ctaVariant?: CtaVariant;
  /** CTA color family. */
  ctaColorScheme?: ColorScheme;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Lookup an `react-icons/fi` icon by name. Returns `null` if missing. */
function resolveIcon(
  name?: string,
): React.ComponentType<{ className?: string }> | null {
  if (!name) return null;
  const normalized = name.startsWith("Fi") ? name : `Fi${name}`;
  const lib = FiIcons as unknown as Record<
    string,
    React.ComponentType<{ className?: string }>
  >;
  return lib[normalized] ?? null;
}

/** Map size → grid span classes (mobile single-column, asymmetric on lg+). */
function sizeToSpan(size: BentoCardSize): string {
  switch (size) {
    case "large":
      // Hero tile — spans 2 cols and 2 rows on lg
      return "lg:col-span-2 lg:row-span-2";
    case "medium":
      // Wide tile — 2 cols, 1 row
      return "lg:col-span-2 lg:row-span-1";
    case "small":
    default:
      // Compact tile — 1 col, 1 row
      return "lg:col-span-1 lg:row-span-1";
  }
}

/** Map size → padding + min-height. */
function sizeToPadding(size: BentoCardSize): string {
  switch (size) {
    case "large":
      return "p-6 md:p-8 lg:p-10 lg:min-h-[28rem]";
    case "medium":
      return "p-5 md:p-7 lg:p-8 lg:min-h-[15rem]";
    case "small":
    default:
      return "p-5 md:p-6 lg:min-h-[15rem]";
  }
}

/** Map size → typography scale for the tile title. */
function sizeToTitleClass(size: BentoCardSize): string {
  switch (size) {
    case "large":
      return "text-2xl md:text-3xl lg:text-4xl";
    case "medium":
      return "text-xl md:text-2xl";
    case "small":
    default:
      return "text-lg md:text-xl";
  }
}

/** Mixed corner radii for organic visual rhythm — varied per index. */
function indexToRadius(index: number): string {
  // Cycle through a curated set of radii within the lg–3xl band.
  // Each index gets a deterministic but irregular pairing.
  const radii = [
    "rounded-2xl",
    "rounded-3xl",
    "rounded-xl",
    "rounded-3xl",
    "rounded-2xl",
    "rounded-xl",
    "rounded-2xl",
  ];
  return radii[index % radii.length];
}

/** Tints for accent gradients and icon backplates. */
const ACCENT_GRADIENT: Record<BentoAccentScheme, string> = {
  primary: "from-primary/25 via-primary/10 to-transparent",
  secondary: "from-secondary/25 via-secondary/10 to-transparent",
  accent: "from-accent/30 via-accent/10 to-transparent",
};

const ACCENT_ICON_BG: Record<BentoAccentScheme, string> = {
  primary: "bg-primary/15 text-primary",
  secondary: "bg-secondary/15 text-secondary",
  accent: "bg-accent/15 text-accent",
};

const ACCENT_METRIC_TEXT: Record<BentoAccentScheme, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

/* ------------------------------------------------------------------ */
/*  Sub-component — BentoTile                                          */
/* ------------------------------------------------------------------ */

interface BentoTileProps {
  item: BentoFeatureItem;
  index: number;
  prefersReducedMotion: boolean;
}

function BentoTile({ item, index, prefersReducedMotion }: BentoTileProps) {
  const Icon = resolveIcon(item.iconName);
  const accent = item.accentScheme ?? "primary";
  const tilt = index % 2 === 0 ? 0.5 : -0.5;
  const isLarge = item.size === "large";

  // Reveal animation — staggered via parent variants.
  const reveal = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  // Hover spring (premium motion) — disabled when prefers-reduced-motion is on.
  const hoverProps = prefersReducedMotion
    ? {}
    : {
        whileHover: { scale: 1.02, rotate: tilt },
        whileTap: { scale: 0.99, rotate: 0 },
      };

  return (
    <motion.article
      variants={reveal}
      transition={{
        duration: 0.35,
        ease: "easeOut" as const,
      }}
      {...hoverProps}
      // Spring physics for hover transition only — reveal still uses easeOut
      // because it's a one-shot decorative motion, per animation.md.
      style={{ transformOrigin: "center" }}
      className={cn(
        "group relative isolate flex flex-col overflow-hidden",
        "bg-base-200 border border-base-300",
        sizeToSpan(item.size),
        sizeToPadding(item.size),
        indexToRadius(index),
        // Subtle tinted shadow on hover, no neon glow.
        "shadow-[0_2px_8px_-4px_rgba(0,0,0,0.04)] transition-shadow duration-300",
        "hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)]",
      )}
    >
      {/* Corner accent gradient — sits behind content, draws the eye to the
          tile without overpowering copy. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-gradient-to-br blur-2xl opacity-70",
          "transition-opacity duration-500 group-hover:opacity-100",
          ACCENT_GRADIENT[accent],
        )}
      />

      <div className="relative flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          {Icon ? (
            <span
              className={cn(
                "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                ACCENT_ICON_BG[accent],
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
          ) : (
            <span aria-hidden className="h-10 w-10 shrink-0" />
          )}
          {item.eyebrow && (
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-base-content/55">
              {item.eyebrow}
            </span>
          )}
        </div>

        <h3
          className={cn(
            "text-balance font-semibold leading-tight tracking-tight text-base-content",
            sizeToTitleClass(item.size),
          )}
        >
          {item.title}
        </h3>

        <p
          className={cn(
            "leading-relaxed text-base-content/70",
            isLarge
              ? "text-base md:text-lg max-w-[55ch]"
              : "text-sm md:text-base max-w-[42ch]",
          )}
        >
          {item.description}
        </p>

        {item.bullets && item.bullets.length > 0 && (
          <ul className="mt-2 flex flex-col divide-y divide-base-300 border-t border-base-300">
            {item.bullets.slice(0, 3).map((bullet, i) => (
              <li
                key={i}
                className="flex items-baseline gap-3 py-2.5 text-sm leading-relaxed text-base-content/80 md:text-base"
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                    ACCENT_METRIC_TEXT[accent],
                    accent === "primary" && "bg-primary",
                    accent === "secondary" && "bg-secondary",
                    accent === "accent" && "bg-accent",
                  )}
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        {item.metric && (
          <div
            className={cn(
              "mt-auto flex items-baseline gap-3 border-t border-base-300 pt-4",
              isLarge ? "" : "pt-3",
            )}
          >
            <span
              className={cn(
                "font-mono font-semibold tracking-tight",
                ACCENT_METRIC_TEXT[accent],
                isLarge ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl",
              )}
            >
              {item.metric.value}
            </span>
            <span className="text-xs leading-snug text-base-content/55 md:text-sm">
              {item.metric.label}
            </span>
          </div>
        )}
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * FeaturesBentoGrid — an asymmetric "bento box" feature grid framed as a
 * long-form section. The grid itself uses mixed tile sizes (one large
 * hero, mediums, smalls), tilt-on-hover spring physics, per-card accent
 * tints, mixed corner radii, and optional per-tile metrics, eyebrows
 * and bullet lists. Around the grid, an optional project meta strip,
 * pull-quote, outcome metrics band, methodology footnote and CTA scaffold
 * the section to carry an entire feature page on its own. Stacks to a
 * single column below the `lg:` breakpoint.
 */
export default function FeaturesBentoGrid({
  eyebrow,
  headline,
  subheadline,
  meta,
  features,
  footnote,
  pullQuote,
  metrics,
  ctaText,
  ctaUrl,
  ctaVariant = "default",
  ctaColorScheme = "primary",
  className,
}: FeaturesBentoGridProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <section
      className={cn(
        "relative w-full bg-base-100 text-base-content",
        "px-4 py-12 md:px-8 md:py-16 lg:px-12 lg:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header — left-aligned (anti-center bias for variance ≥ 4). */}
        <motion.header
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-10 max-w-2xl md:mb-14"
        >
          {eyebrow && (
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-primary">
              {eyebrow}
            </p>
          )}
          <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-base-content md:text-4xl lg:text-5xl">
            {headline}
          </h2>
          {subheadline && (
            <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-base-content/70 md:text-lg">
              {subheadline}
            </p>
          )}
        </motion.header>

        {/* Section-level meta strip — frames the whole section as one body of work. */}
        {meta && meta.length > 0 && (
          <motion.dl
            className="mb-12 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-base-300 py-6 md:mb-16 md:grid-cols-4"
            variants={containerVariants}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {meta.slice(0, 4).map((m, i) => (
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

        {/* Asymmetric grid — single column below lg, 4-col bento on lg+. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className={cn(
            "grid grid-cols-1 gap-4 md:gap-5",
            // 4-col grid with auto rows lets large tiles span 2x2 cleanly.
            "lg:grid-cols-4 lg:auto-rows-[minmax(11rem,1fr)] lg:gap-6",
          )}
        >
          {features.map((item, index) => (
            <BentoTile
              key={`${item.title}-${index}`}
              item={item}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </motion.div>

        {/* Methodology footnote — fine print under the grid, mono small caps. */}
        {footnote && (
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-6 max-w-[70ch] font-mono text-[11px] leading-relaxed tracking-[0.04em] text-base-content/55"
          >
            {footnote}
          </motion.p>
        )}

        {/* Pull quote — bridges the grid to the metrics/CTA close. */}
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

        {/* Outcome metrics — bento-flavoured: each metric is its own small
            tinted tile with mixed corner radii, mirroring the asymmetric
            bento grid above it instead of resolving into a single dark
            slab. Keeps this section visually distinct from sibling content
            sections that use the dark slab treatment. */}
        {metrics && metrics.length > 0 && (
          <motion.div
            className={cn(
              "grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4",
              pullQuote ? "mt-12 md:mt-16" : "mt-16 md:mt-24",
            )}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {metrics.slice(0, 4).map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-col items-start justify-between gap-3 border border-base-300 bg-base-200 p-5 md:p-6",
                  indexToRadius(i),
                )}
              >
                <span className="font-mono text-3xl font-semibold tracking-tight text-primary md:text-5xl">
                  {m.value}
                </span>
                <span className="text-xs leading-snug text-base-content/70 md:text-sm">
                  {m.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {ctaText && ctaUrl && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            className="mt-10 flex justify-start md:mt-14"
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
