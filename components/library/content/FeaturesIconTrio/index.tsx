"use client";

import { motion, useReducedMotion } from "motion/react";
import type { IconType } from "react-icons";
import {
  LuActivity,
  LuChartBar,
  LuBookOpen,
  LuBriefcase,
  LuCalendar,
  LuCheck,
  LuClock,
  LuCloud,
  LuCode,
  LuCog,
  LuCompass,
  LuDatabase,
  LuFeather,
  LuFigma,
  LuFileSearch,
  LuFileText,
  LuGauge,
  LuGavel,
  LuGlobe,
  LuHandshake,
  LuHeart,
  LuKey,
  LuLandmark,
  LuLayers,
  LuLeaf,
  LuLightbulb,
  LuLock,
  LuMail,
  LuMapPin,
  LuMessageCircle,
  LuMonitor,
  LuPalette,
  LuPenTool,
  LuPhone,
  LuPiggyBank,
  LuRecycle,
  LuRocket,
  LuScale,
  LuSearch,
  LuSettings,
  LuShield,
  LuShieldCheck,
  LuSparkles,
  LuSprout,
  LuStar,
  LuTarget,
  LuTimer,
  LuTreePine,
  LuTrendingUp,
  LuUsers,
  LuWallet,
  LuZap,
} from "react-icons/lu";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FeaturesIconTrioFeature {
  /**
   * Lucide icon name in lowercase (e.g. "zap", "shield-check", "trending-up").
   * Maps to a react-icons/lu component internally. Falls back to a generic
   * sparkles glyph when an unknown name is passed.
   */
  iconName: string;
  title: string;
  description: string;
  /**
   * Optional numeric punch-line above the title — e.g. "47s", "1.7×",
   * "62%". Renders in mono so it sits as the cell's quantitative anchor.
   */
  stat?: string;
  /**
   * Optional one-line caption for the stat — clarifies what the number
   * represents without crowding the title.
   */
  statLabel?: string;
  /**
   * Optional 2–3 supporting bullets rendered as a `border-t divide-y`
   * micro-list under the description. Useful for evidence, sub-claims,
   * or scope detail without resorting to nested cards.
   */
  bullets?: string[];
}

export interface FeaturesIconTrioMeta {
  /** Mono-caps label — e.g. "Window", "Source", "Verified by" */
  label: string;
  /** Plain-weight value */
  value: string;
}

export interface FeaturesIconTrioMetric {
  /** The number itself — keep it organic (e.g. "47.2%", "3,847") */
  value: string;
  /** One-line context for the number */
  label: string;
}

export interface FeaturesIconTrioPullQuote {
  /** The quote itself, no surrounding punctuation */
  quote: string;
  /** Person or organisation it is attributed to */
  attribution: string;
  /** Optional secondary attribution line — role, location, etc. */
  attributionMeta?: string;
}

export interface FeaturesIconTrioProps {
  /** Small label rendered above the headline (e.g. "Why teams choose us"). */
  eyebrow?: string;
  /** Primary section headline. */
  headline: string;
  /** Optional supporting paragraph between headline and grid. */
  subheadline?: string;
  /**
   * Optional section-level meta strip — renders as a 4-up dl band under
   * the header (mirrors CarouselBeforeAfter / ComparisonSplit). Use it
   * to frame the section as a single engagement: source, window, verified
   * by, sample size.
   */
  meta?: FeaturesIconTrioMeta[];
  /**
   * 3 to 6 feature cells. With 3 items the grid renders as a 3-column row
   * on lg+. With 4+ items it deliberately wraps to a 2-column grid (or
   * 2x3 at lg+) rather than using a 4-or-6-across row, which is the most
   * recognizable AI-tell layout.
   */
  features: FeaturesIconTrioFeature[];
  /**
   * Optional pull-quote rendered between the grid and the metrics band —
   * primary border-l, serif, attributable. Bridges the feature grid to a
   * stronger close.
   */
  pullQuote?: FeaturesIconTrioPullQuote;
  /**
   * Optional outcome metrics rendered as a dark band below the grid. Use
   * 2 or 4 metrics — the band is a 2-up on mobile and 4-up on md+.
   */
  metrics?: FeaturesIconTrioMetric[];
  /**
   * Optional methodology / data-source footnote rendered below the grid
   * (or below the metrics band when present). Mono, small, muted.
   */
  footnote?: string;
  /** Optional CTA below the grid. Both ctaText and ctaUrl required to render. */
  ctaText?: string;
  ctaUrl?: string;
  /** CTA visual variant. */
  ctaVariant?: CtaVariant;
  /** CTA color scheme. */
  ctaColorScheme?: ColorScheme;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Icon registry                                                      */
/* ------------------------------------------------------------------ */

/**
 * Slot value to icon-component map. Names follow lucide-react's
 * kebab-case convention so the slot stays a plain JSON-serializable
 * string. The Content Agent picks one of these names; the component
 * resolves it to a react-icons/lu component at render time.
 */
const ICON_MAP: Record<string, IconType> = {
  activity: LuActivity,
  "bar-chart": LuChartBar,
  "book-open": LuBookOpen,
  briefcase: LuBriefcase,
  calendar: LuCalendar,
  check: LuCheck,
  clock: LuClock,
  cloud: LuCloud,
  code: LuCode,
  cog: LuCog,
  compass: LuCompass,
  database: LuDatabase,
  feather: LuFeather,
  figma: LuFigma,
  "file-search": LuFileSearch,
  "file-text": LuFileText,
  gauge: LuGauge,
  gavel: LuGavel,
  globe: LuGlobe,
  handshake: LuHandshake,
  heart: LuHeart,
  key: LuKey,
  landmark: LuLandmark,
  layers: LuLayers,
  leaf: LuLeaf,
  lightbulb: LuLightbulb,
  lock: LuLock,
  mail: LuMail,
  "map-pin": LuMapPin,
  "message-circle": LuMessageCircle,
  monitor: LuMonitor,
  palette: LuPalette,
  "pen-tool": LuPenTool,
  phone: LuPhone,
  "piggy-bank": LuPiggyBank,
  recycle: LuRecycle,
  rocket: LuRocket,
  scale: LuScale,
  search: LuSearch,
  settings: LuSettings,
  shield: LuShield,
  "shield-check": LuShieldCheck,
  sparkles: LuSparkles,
  sprout: LuSprout,
  star: LuStar,
  target: LuTarget,
  timer: LuTimer,
  "tree-pine": LuTreePine,
  "trending-up": LuTrendingUp,
  users: LuUsers,
  wallet: LuWallet,
  zap: LuZap,
};

function resolveIcon(name: string): IconType {
  return ICON_MAP[name.toLowerCase()] ?? LuSparkles;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * FeaturesIconTrio — flat icon-led features grid with optional editorial
 * scaffolding. The core grid renders 3 items as a 3-column row on lg+;
 * 4+ items wrap to a 2-column (or 2x3) grid to avoid the 4-or-6-across
 * "AI features row" pattern. Each cell can carry a mono stat punch-line,
 * a description, and a 2–3 item bullet list — useful when each feature
 * needs evidence, not just a tagline. Around the grid, an optional 4-up
 * meta strip, a pull-quote, an outcome metrics band, a methodology
 * footnote, and a closing CTA let the section carry the depth of a
 * long-form benefits page rather than a thin three-up row.
 */
export default function FeaturesIconTrio({
  eyebrow,
  headline,
  subheadline,
  meta,
  features,
  pullQuote,
  metrics,
  footnote,
  ctaText,
  ctaUrl,
  ctaVariant = "default",
  ctaColorScheme = "primary",
  className,
}: FeaturesIconTrioProps) {
  const prefersReducedMotion = useReducedMotion();

  const itemCount = features.length;
  // Anti-slop guard: 3 -> 3-across; 4+ -> 2-up that becomes 2x3 at lg.
  const gridCols =
    itemCount === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3";

  const showCta = Boolean(ctaText && ctaUrl);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
  };

  const itemVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0 },
      };

  return (
    <section
      className={cn(
        "relative w-full bg-base-100 text-base-content",
        "px-4 py-12 md:px-8 md:py-16 lg:px-12 lg:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.header
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          {eyebrow && (
            <div className="mb-4 inline-flex items-center gap-2">
              <span aria-hidden className="inline-block h-3 w-px bg-primary" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-base-content/60">
                {eyebrow}
              </p>
            </div>
          )}
          <h2 className="text-3xl font-bold leading-tight text-base-content md:text-4xl lg:text-5xl">
            {headline}
          </h2>
          {subheadline && (
            <p className="mx-auto mt-4 max-w-[60ch] text-base leading-relaxed text-base-content/70 md:text-lg">
              {subheadline}
            </p>
          )}
        </motion.header>

        {/* Section-level meta strip — frames the whole section */}
        {meta && meta.length > 0 && (
          <motion.dl
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
            className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-6 border-y border-base-300 py-6 md:mt-12 md:grid-cols-4"
          >
            {meta.map((m, i) => (
              <div key={i} className="flex flex-col gap-1">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-base-content/55">
                  {m.label}
                </dt>
                <dd className="text-sm font-medium text-base-content md:text-base">
                  {m.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        )}

        {/* Grid */}
        <motion.ul
          role="list"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className={cn(
            "mt-12 grid grid-cols-1 gap-y-10 md:mt-16 md:gap-y-12",
            gridCols,
          )}
        >
          {features.map((feature, i) => {
            const Icon = resolveIcon(feature.iconName);
            // Hairline divider sits on the LEFT edge of every cell that is
            // not in the first column. We approximate that with nth-child
            // logic for 3-up and 2-up layouts using Tailwind classes.
            const showLeftDivider3Up =
              itemCount === 3 ? "md:[&:not(:first-child)]:md:border-l" : "";
            const showLeftDivider2Up =
              itemCount !== 3
                ? "md:[&:nth-child(2n)]:md:border-l lg:[&:nth-child(3n+2)]:lg:border-l lg:[&:nth-child(3n)]:lg:border-l lg:[&:nth-child(2n)]:md:border-l"
                : "";

            return (
              <motion.li
                key={i}
                variants={itemVariants}
                transition={{ duration: 0.25, ease: "easeOut" }}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { y: -5, transition: { duration: 0.18, ease: "easeOut" } }
                }
                className={cn(
                  "group relative flex flex-col px-2 md:px-8",
                  "rounded-md outline outline-1 outline-transparent transition-[outline-color] duration-200",
                  "hover:outline-base-300",
                  "border-base-300/60",
                  // Vertical hairline divider, masked to fade at top/bottom.
                  // Applied via pseudo-element so we keep the cell padding stable.
                  "md:before:pointer-events-none md:before:absolute md:before:inset-y-6 md:before:left-0 md:before:w-px md:before:bg-base-300",
                  "md:before:[mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]",
                  "md:[&:first-child]:before:hidden",
                  // For 4+ items, hide the divider on the first item of each row
                  itemCount !== 3 &&
                    "md:[&:nth-child(2n+1)]:before:hidden lg:[&:nth-child(3n+1)]:before:hidden lg:[&:nth-child(2n+1)]:before:block",
                  showLeftDivider3Up,
                  showLeftDivider2Up,
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mb-5 inline-flex h-11 w-11 items-center justify-center",
                    "rounded-lg bg-primary/10 text-primary",
                    "transition-colors duration-200 group-hover:bg-primary/15",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>

                {/* Optional stat punch-line — mono numeral, primary tint */}
                {feature.stat && (
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-semibold leading-none tracking-tight text-primary md:text-3xl">
                      {feature.stat}
                    </span>
                    {feature.statLabel && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-base-content/55">
                        {feature.statLabel}
                      </span>
                    )}
                  </div>
                )}

                <h3 className="text-lg font-semibold leading-snug text-base-content md:text-xl">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/70 md:text-base">
                  {feature.description}
                </p>

                {/* Optional supporting bullets — border-t divide-y rhythm
                    keeps things flat (no card-in-card). */}
                {feature.bullets && feature.bullets.length > 0 && (
                  <ul className="mt-5 flex flex-col divide-y divide-base-300 border-t border-base-300">
                    {feature.bullets.map((bullet, bi) => (
                      <li
                        key={bi}
                        className="flex items-start gap-3 py-2.5 text-sm leading-relaxed text-base-content/75 md:text-[15px]"
                      >
                        <span
                          aria-hidden
                          className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-primary"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Pull quote — bridges the grid to the metrics/CTA close */}
        {pullQuote && (
          <motion.figure
            className="mx-auto mt-16 max-w-4xl border-l-2 border-primary pl-6 md:mt-20 md:pl-10"
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

        {/* Outcome metrics — large centred numerals on a light surface,
            split by vertical hairlines. Mirrors the trio rhythm of the
            features above (3-up centred, no chrome) instead of repeating
            the dark slab used by sibling content sections. */}
        {metrics && metrics.length > 0 && (
          <motion.div
            className={cn(
              "grid grid-cols-2 gap-y-10 bg-base-200/40 px-4 py-10 md:grid-cols-4 md:gap-y-0 md:px-8 md:py-14",
              "rounded-2xl",
              pullQuote ? "mt-12 md:mt-16" : "mt-16 md:mt-20",
            )}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {metrics.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-col items-center gap-2 px-2 text-center md:px-4",
                  // Vertical hairline dividers between adjacent columns.
                  i > 0 && i % 2 !== 0 ? "border-l border-base-300" : "",
                  i >= 2 ? "md:border-l md:border-base-300" : "",
                  i === 0 || i === 2 ? "md:border-l-0" : "",
                  i === 2 ? "md:border-l md:border-base-300" : "",
                )}
              >
                <span className="font-mono text-4xl font-semibold tracking-tight text-base-content md:text-6xl">
                  {m.value}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-base-content/60 md:text-xs">
                  {m.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Methodology footnote */}
        {footnote && (
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mx-auto mt-8 max-w-[70ch] font-mono text-[11px] leading-relaxed tracking-[0.04em] text-base-content/55 md:mt-10"
          >
            {footnote}
          </motion.p>
        )}

        {/* Optional CTA */}
        {showCta && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            className="mt-12 flex justify-center md:mt-16"
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
