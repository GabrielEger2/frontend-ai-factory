"use client";

import type { ComponentType, SVGProps } from "react";
import {
  FiZap,
  FiShield,
  FiLayers,
  FiTarget,
  FiCpu,
  FiGitBranch,
  FiClock,
  FiTrendingUp,
  FiUsers,
  FiBox,
  FiBarChart2,
  FiHeart,
  FiAward,
  FiGlobe,
  FiLock,
  FiCompass,
} from "react-icons/fi";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Icon registry                                                      */
/* ------------------------------------------------------------------ */

const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  zap: FiZap,
  shield: FiShield,
  layers: FiLayers,
  target: FiTarget,
  cpu: FiCpu,
  branch: FiGitBranch,
  clock: FiClock,
  trending: FiTrendingUp,
  users: FiUsers,
  box: FiBox,
  chart: FiBarChart2,
  heart: FiHeart,
  award: FiAward,
  globe: FiGlobe,
  lock: FiLock,
  compass: FiCompass,
};

export type IconFeatureGridIcon = keyof typeof ICONS;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface IconFeature {
  /** Icon key from the registry — falls back to a dot when omitted/unknown */
  icon?: IconFeatureGridIcon | string;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Marks this card as the "wide" tile in the bento layout */
  emphasize?: boolean;
}

export interface IconFeatureGridProps {
  /** Small label rendered above the headline */
  label?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** Feature list — recommended 4 to 7 items for the bento layout */
  features?: IconFeature[];
  /**
   * "bento" — asymmetric grid where the first emphasized item spans 2 cols (default)
   * "zigzag" — alternating 2-col rows that offset every other item
   * Both deliberately avoid the 3-equal-card row.
   */
  variant?: "bento" | "zigzag";
  /** Optional CTA below the grid */
  ctaText?: string;
  ctaUrl?: string;
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_FEATURES: IconFeature[] = [
  {
    icon: "zap",
    title: "Builds finish in 47 seconds",
    description:
      "Incremental compilation across the monorepo means saving a single file rebuilds only the affected workspace, not the universe.",
    emphasize: true,
  },
  {
    icon: "shield",
    title: "SOC 2 Type II from day one",
    description:
      "Security posture inherited from a parent platform that is audited annually — no compliance retrofit when you grow up.",
  },
  {
    icon: "branch",
    title: "Preview URLs per pull request",
    description:
      "Every branch gets its own deploy with production-like data, shareable with stakeholders before merge.",
  },
  {
    icon: "chart",
    title: "Built-in observability",
    description:
      "Traces, logs, and request-rate metrics flow into a single timeline. Correlate a slow API to the offending DB call in two clicks.",
  },
  {
    icon: "users",
    title: "Designed for teams of 4 to 40",
    description:
      "Granular RBAC, environment scoping, and audit logs that scale from a founding team to a 40-person engineering org without restructuring.",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface IconBadgeProps {
  iconKey?: string;
  emphasized?: boolean;
}

function IconBadge({ iconKey, emphasized }: IconBadgeProps) {
  const Icon = (iconKey && ICONS[iconKey as IconFeatureGridIcon]) || null;
  return (
    <span
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
        emphasized
          ? "bg-primary text-primary-content"
          : "bg-primary/10 text-primary",
      )}
      aria-hidden="true"
    >
      {Icon ? (
        <Icon className="h-5 w-5" />
      ) : (
        <span className="h-2 w-2 rounded-full bg-current" />
      )}
    </span>
  );
}

interface FeatureTileProps {
  feature: IconFeature;
  /** Tailwind class for span — fed by the variant layout calculation */
  spanClass?: string;
  /** Whether the bento card emphasis treatment applies */
  emphasized?: boolean;
}

function FeatureTile({ feature, spanClass, emphasized }: FeatureTileProps) {
  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl p-6 transition-all duration-300 md:p-8",
        emphasized
          ? "bg-base-content text-base-100 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.25)]"
          : "border border-base-300 bg-base-100 hover:border-base-content/40",
        spanClass,
      )}
    >
      <IconBadge iconKey={feature.icon} emphasized={emphasized} />
      <div className="space-y-2">
        <h3
          className={cn(
            "text-lg font-semibold leading-tight md:text-xl",
            emphasized ? "text-base-100" : "text-base-content",
          )}
        >
          {feature.title}
        </h3>
        <p
          className={cn(
            "text-sm leading-relaxed md:text-base",
            emphasized ? "text-base-100/75" : "text-base-content/65",
          )}
        >
          {feature.description}
        </p>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Layout helpers                                                     */
/* ------------------------------------------------------------------ */

/**
 * Bento layout — desktop is a 6-column grid where:
 *  - Emphasized cards span 4 cols
 *  - Regular cards span 2 cols (3 per row) — but only at most 2 in a row
 *    by interleaving emphasized cards every 3rd item
 * The intent is NEVER a 3-equal-card horizontal row — fights the slop signature.
 */
function bentoSpan(index: number, total: number, emphasized: boolean): string {
  // The first emphasized item is the hero card
  if (emphasized) return "md:col-span-4";

  // After the hero, alternate: 2-col tile, 2-col tile, then a wider 4-col
  // tile every fourth slot. This creates an asymmetric rhythm.
  const positionAfterHero = index;
  if ((positionAfterHero + 1) % 4 === 0 && index !== total - 1) {
    return "md:col-span-4";
  }
  // Otherwise — 3 cards across (2-col each on a 6-col grid)
  // Ensure last orphan stretches if total leaves a single trailing tile
  if (index === total - 1 && total % 3 === 1) {
    return "md:col-span-6";
  }
  return "md:col-span-3";
}

/**
 * Zigzag layout — alternating 2-col rows where every other tile shifts
 * down a half-row to break the grid horizon line.
 */
function zigzagSpan(index: number): string {
  // Alternating offsets via top padding
  return cn("md:col-span-1", index % 2 === 1 && "md:translate-y-8");
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * IconFeatureGrid — the icon-led feature grid that 80% of features /
 * services / benefits sections need, but rendered as an asymmetric
 * bento (default) or alternating zigzag instead of the slop-signature
 * 3-equal-card horizontal row.
 */
export default function IconFeatureGrid({
  label,
  headline,
  description,
  features = DEFAULT_FEATURES,
  variant = "bento",
  ctaText,
  ctaUrl,
  styleKit,
  className,
}: IconFeatureGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme = styleKit?.ctaColorScheme ?? "primary";

  // Auto-emphasize the first feature when the brief didn't pick one
  const normalized = (() => {
    const hasEmphasis = features.some((f) => f.emphasize);
    if (hasEmphasis || features.length === 0 || variant !== "bento") {
      return features;
    }
    return features.map((f, i) => (i === 0 ? { ...f, emphasize: true } : f));
  })();

  return (
    <section className={cn("w-full bg-base-100 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header — left-aligned for variance ≥ 4 */}
        <motion.div
          className="mb-12 max-w-2xl md:mb-16"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {label && (
            <motion.p
              variants={fadeUp}
              className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
            >
              {label}
            </motion.p>
          )}
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-semibold tracking-tight text-base-content sm:text-4xl md:text-5xl"
          >
            {headline}
          </motion.h2>
          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-base-content/60"
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        {/* Grid */}
        <motion.div
          className={cn(
            "grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6",
            variant === "bento" && "md:grid-cols-6",
            variant === "zigzag" && "md:grid-cols-2 md:gap-x-12",
          )}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {normalized.map((feature, i) => (
            <FeatureTile
              key={i}
              feature={feature}
              emphasized={!!feature.emphasize}
              spanClass={
                variant === "bento"
                  ? bentoSpan(i, normalized.length, !!feature.emphasize)
                  : zigzagSpan(i)
              }
            />
          ))}
        </motion.div>

        {ctaText && ctaUrl && (
          <motion.div
            className="mt-12 flex md:mt-16"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
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
