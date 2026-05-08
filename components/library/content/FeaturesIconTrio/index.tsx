"use client";

import { motion, useReducedMotion } from "motion/react";
import type { IconType } from "react-icons";
import {
  LuActivity,
  LuBarChart,
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
}

export interface FeaturesIconTrioProps {
  /** Small label rendered above the headline (e.g. "Why teams choose us"). */
  eyebrow?: string;
  /** Primary section headline. */
  headline: string;
  /** Optional supporting paragraph between headline and grid. */
  subheadline?: string;
  /**
   * 3 to 6 feature cells. With 3 items the grid renders as a 3-column row
   * on lg+. With 4+ items it deliberately wraps to a 2-column grid (or
   * 2x3 at lg+) rather than using a 4-or-6-across row, which is the most
   * recognizable AI-tell layout.
   */
  features: FeaturesIconTrioFeature[];
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
  "bar-chart": LuBarChart,
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
 * FeaturesIconTrio — flat icon-led features grid. Three items render as a
 * 3-column row on lg+. Four or more items deliberately wrap to a 2-column
 * (or 2x3) grid to avoid the 4-or-6-across "AI features row" pattern.
 * Each cell has a soft hover lift, a 1px outline that activates on hover,
 * and shares a fading vertical hairline divider with its neighbor.
 */
export default function FeaturesIconTrio({
  eyebrow,
  headline,
  subheadline,
  features,
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

        {/* Grid */}
        <motion.ul
          role="list"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className={cn(
            "mt-12 grid grid-cols-1 gap-y-10 md:mt-16 md:gap-y-0",
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
                <h3 className="text-lg font-semibold leading-snug text-base-content md:text-xl">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/70 md:text-base">
                  {feature.description}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>

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
