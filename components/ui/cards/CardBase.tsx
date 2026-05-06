"use client";

import { cn } from "@lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CardBaseProps {
  /** Image URL displayed at the top of the card */
  image: string;
  /** Accessible alt text for the image */
  imageAlt: string;
  /** Card heading */
  title: string;
  /** Supporting text beneath the heading */
  description: string;
  /** CTA button text — omit to hide the CTA */
  ctaText?: string;
  /** CTA destination URL */
  ctaUrl?: string;
  /** Optional badge label displayed over the image */
  badge?: string;
  /**
   * Content mode — controls which fields are rendered.
   * - `"feature"` (default): standard card with title + description + optional CTA.
   * - `"team"`: renders `role` below the title for team/people grids.
   * - `"bare"`: borderless layout for carousel tracks — fixed-height image,
   *   optional `tag` chip below the image, no entry animation. Use when the
   *   parent already animates the card or provides the chrome.
   */
  mode?: "feature" | "team" | "bare";
  /** Person's role / job title — only rendered when `mode === "team"` */
  role?: string;
  /** Tag/category label rendered below the image — only used when `mode === "bare"` */
  tag?: string;
  /** CTA visual variant — controls which animated button style is used */
  ctaVariant?: CtaVariant;
  /** CTA color scheme — maps to design-token color families */
  ctaColorScheme?: ColorScheme;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CardBase — the foundational card layout used across all card variants.
 *
 * Renders image, optional badge, title, description, and optional CTA
 * in a consistent vertical stack with semantic tokens.
 *
 * Animation variants (flip, reveal, magic, product) wrap or compose
 * this base to add their specific interactive behavior.
 */
export default function CardBase({
  image,
  imageAlt,
  title,
  description,
  ctaText,
  ctaUrl,
  badge,
  mode = "feature",
  role,
  tag,
  ctaVariant,
  ctaColorScheme,
  className,
}: CardBaseProps) {
  const shouldReduceMotion = useReducedMotion();

  /* ----------------------------------------------------------------
   * `bare` mode — borderless tile for carousel/track contexts.
   * No entry animation: the parent track is responsible for motion.
   * ---------------------------------------------------------------- */
  if (mode === "bare") {
    return (
      <article
        className={cn(
          "group relative flex w-full flex-col overflow-hidden",
          className,
        )}
      >
        {/* Image — fixed height for predictable carousel layout */}
        <div className="relative h-[200px] overflow-hidden rounded-lg bg-base-300">
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Badge */}
          {badge && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-content shadow-sm">
              {badge}
            </span>
          )}
        </div>

        {/* Tag chip below the image */}
        {tag && (
          <span className="mt-2 inline-block rounded-md border border-base-300 px-1.5 py-1 text-xs uppercase text-base-content/60">
            {tag}
          </span>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 pt-2">
          <h3 className="text-lg font-semibold leading-tight text-base-content">
            {title}
          </h3>
          <p className="text-sm text-base-content/60">{description}</p>

          {ctaText && ctaUrl && (
            <div className="mt-auto pt-3">
              <CtaButton
                variant={ctaVariant}
                colorScheme={ctaColorScheme}
                href={ctaUrl}
                className="w-full"
              >
                {ctaText}
              </CtaButton>
            </div>
          )}
        </div>
      </article>
    );
  }

  /* ----------------------------------------------------------------
   * Default (`feature`/`team`) mode — animated, bordered card.
   * ---------------------------------------------------------------- */
  return (
    <motion.article
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-200 text-base-content shadow-sm",
        "transition-shadow duration-200",
        className,
      )}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-base-300">
        <img
          src={image}
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badge */}
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-content shadow-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4 md:p-6">
        <h3 className="text-lg font-semibold leading-tight text-base-content">
          {title}
        </h3>
        {mode === "team" && role && (
          <p className="text-sm text-base-content/60">{role}</p>
        )}
        <p className="text-sm text-base-content/60">{description}</p>

        {ctaText && ctaUrl && (
          <div className="mt-auto pt-3">
            <CtaButton
              variant={ctaVariant}
              colorScheme={ctaColorScheme}
              href={ctaUrl}
              className="w-full"
            >
              {ctaText}
            </CtaButton>
          </div>
        )}
      </div>
    </motion.article>
  );
}
