"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import * as FiIcons from "react-icons/fi";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type BentoCardSize = "large" | "medium" | "small";
export type BentoAccentScheme = "primary" | "secondary" | "accent";

export interface BentoFeatureItem {
  /** Visual size class — drives grid span and typography scale */
  size: BentoCardSize;
  /**
   * Optional Feather icon name from `react-icons/fi` (e.g. "FiZap",
   * "FiLayers"). Pass without the prefix is also accepted ("Zap" → "FiZap").
   * Unknown names render no icon.
   */
  iconName?: string;
  title: string;
  description: string;
  /** Tints the corner gradient and icon backplate. Defaults to "primary". */
  accentScheme?: BentoAccentScheme;
}

export interface FeaturesBentoGridProps {
  /** Small uppercase label rendered above the headline. */
  eyebrow?: string;
  /** Section headline. */
  headline: string;
  /** Optional supporting paragraph below the headline. */
  subheadline?: string;
  /** 5–7 feature tiles. Mix sizes for asymmetric rhythm. */
  features: BentoFeatureItem[];
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
      return "p-6 md:p-8 lg:p-10 lg:min-h-[26rem]";
    case "medium":
      return "p-5 md:p-7 lg:p-8 lg:min-h-[14rem]";
    case "small":
    default:
      return "p-5 md:p-6 lg:min-h-[14rem]";
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
        "group relative isolate overflow-hidden",
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
        {Icon && (
          <span
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-xl",
              ACCENT_ICON_BG[accent],
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}

        <h3
          className={cn(
            "font-semibold leading-tight tracking-tight text-base-content",
            sizeToTitleClass(item.size),
          )}
        >
          {item.title}
        </h3>

        <p
          className={cn(
            "leading-relaxed text-base-content/70",
            item.size === "large"
              ? "text-base md:text-lg max-w-[55ch]"
              : "text-sm md:text-base max-w-[42ch]",
          )}
        >
          {item.description}
        </p>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * FeaturesBentoGrid — an asymmetric "bento box" feature grid with mixed
 * tile sizes (one large hero, mediums, smalls), tilt-on-hover spring
 * physics, per-card accent tints, and mixed corner radii. Designed to
 * land the playful/bold/fun mood gap. Stacks to a single column below
 * the `lg:` breakpoint.
 */
export default function FeaturesBentoGrid({
  eyebrow,
  headline,
  subheadline,
  features,
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
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-base-content md:text-4xl lg:text-5xl">
            {headline}
          </h2>
          {subheadline && (
            <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-base-content/70 md:text-lg">
              {subheadline}
            </p>
          )}
        </motion.header>

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
