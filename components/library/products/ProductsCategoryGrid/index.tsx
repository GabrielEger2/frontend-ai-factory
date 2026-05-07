"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ProductCategory {
  /** Category name rendered as the tile title (e.g. "Pães", "Casacos"). */
  name: string;
  /** Background photograph for the tile. */
  image: string;
  /** Alt text for the tile image. */
  imageAlt: string;
  /** Optional micro-counter shown above the name (e.g. "12 itens"). */
  itemCount?: string;
  /** Optional starting price tag (e.g. "a partir de R$ 34"). */
  priceFrom?: string;
  /** Per-tile destination URL. The whole tile becomes a single click target. */
  ctaUrl: string;
}

export interface ProductsCategoryGridProps {
  /** Small label rendered above the section headline. */
  eyebrow?: string;
  /** Section headline. */
  headline: string;
  /** Optional supporting copy beneath the headline. */
  subheadline?: string;
  /**
   * Category tiles. The first tile is the featured one (spans 2fr on the
   * desktop asymmetric grid); subsequent tiles fill the 1fr columns and
   * wrap onto further rows when the list is longer than three. Library
   * convention is 4–8 entries — fewer feels thin, more starts looking
   * like an unedited catalog.
   */
  categories: ProductCategory[];
  /** Optional footer CTA label rendered below the grid. */
  ctaText?: string;
  /** Optional footer CTA destination URL. */
  ctaUrl?: string;
  /** Footer CTA visual variant. */
  ctaStyle?: CtaVariant;
  /** Footer CTA color scheme. */
  ctaColorScheme?: ColorScheme;
  /**
   * Visual tone — controls whether the section sits on the page surface
   * or an inverted dark slab. Defaults to `light`.
   */
  tone?: "light" | "dark";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProductsCategoryGrid({
  eyebrow,
  headline,
  subheadline,
  categories,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  tone = "light",
  className,
}: ProductsCategoryGridProps) {
  const prefersReducedMotion = useReducedMotion();

  const toneClasses =
    tone === "dark"
      ? {
          section: "bg-neutral text-neutral-content",
          divider: "border-neutral-content/15",
          eyebrow: "text-neutral-content/60",
          subheadline: "text-neutral-content/70",
          tileMeta: "text-neutral-content/55",
          tileBody: "text-neutral-content/70",
          tileBg: "bg-neutral-content/5",
          arrow: "text-neutral-content",
        }
      : {
          section: "bg-base-100 text-base-content",
          divider: "border-base-content/15",
          eyebrow: "text-base-content/60",
          subheadline: "text-base-content/70",
          tileMeta: "text-base-content/55",
          tileBody: "text-base-content/70",
          tileBg: "bg-base-200",
          arrow: "text-base-content",
        };

  return (
    <section
      className={cn(
        "relative isolate w-full py-12 md:py-16 lg:py-24",
        toneClasses.section,
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header — full-width above the grid. */}
        <header className="mb-10 flex flex-col gap-4 md:mb-14 lg:mb-20 lg:max-w-3xl">
          {eyebrow && (
            <span
              className={cn(
                "text-sm font-medium uppercase tracking-[0.2em]",
                toneClasses.eyebrow,
              )}
            >
              {eyebrow}
            </span>
          )}
          <h2 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {headline}
          </h2>
          {subheadline && (
            <p
              className={cn(
                "max-w-xl text-base leading-relaxed md:text-lg",
                toneClasses.subheadline,
              )}
            >
              {subheadline}
            </p>
          )}
        </header>

        {/* Editorial asymmetric grid:
              - mobile: single column stack
              - md+: 3 columns where the first column carries 2fr (the
                feature tile) and the remaining columns each carry 1fr.
              The first tile spans both grid rows of the first 2-row
              row-group, so it reads visually larger than the trailing
              tiles. Tiles 4–8 wrap into subsequent rows as a regular
              1fr/1fr/1fr grid pattern. */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-2 md:gap-6 lg:gap-8">
          {categories.map((category, i) => {
            const isFeature = i === 0;
            return (
              <a
                key={`${category.name}-${i}`}
                href={category.ctaUrl}
                className={cn(
                  "group relative flex flex-col gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4",
                  // Feature tile spans both rows of the first md row.
                  isFeature && "md:row-span-2",
                )}
              >
                {/* Image container — framer-motion handles the soft
                    scale-up on hover. overflow-hidden + rounded-2xl
                    keep the scaled image inside the tile bounds. */}
                <motion.div
                  className={cn(
                    "relative w-full overflow-hidden rounded-2xl",
                    toneClasses.tileBg,
                  )}
                  style={{ aspectRatio: "4 / 5" }}
                  whileHover={
                    prefersReducedMotion ? undefined : { scale: 1.04 }
                  }
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <img
                    src={category.image}
                    alt={category.imageAlt}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />

                  {/* Per-tile arrow chip — sits on the image so the
                      whole tile reads as a click target. The chip
                      itself doesn't move; only the icon inside slides. */}
                  <div
                    className={cn(
                      "pointer-events-none absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-base-100/85 backdrop-blur-sm",
                      "shadow-sm",
                    )}
                  >
                    <FiArrowUpRight
                      className="h-4 w-4 text-base-content transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </motion.div>

                {/* Title + meta row. Sits below the tile photograph. */}
                <div className="flex flex-col gap-1">
                  {category.itemCount && (
                    <span
                      className={cn(
                        "text-xs font-medium uppercase tracking-[0.18em]",
                        toneClasses.tileMeta,
                      )}
                    >
                      {category.itemCount}
                    </span>
                  )}
                  <h3
                    className={cn(
                      "font-semibold leading-tight tracking-tight",
                      isFeature
                        ? "text-2xl md:text-3xl lg:text-4xl"
                        : "text-xl md:text-2xl",
                    )}
                  >
                    {category.name}
                  </h3>
                  {category.priceFrom && (
                    <span
                      className={cn(
                        "text-sm leading-relaxed",
                        toneClasses.tileBody,
                      )}
                    >
                      {category.priceFrom}
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer CTA — sits below the grid, full-width. */}
        {ctaText && (
          <div
            className={cn(
              "mt-12 flex flex-wrap items-center gap-4 border-t pt-10 md:mt-16 md:pt-14",
              toneClasses.divider,
            )}
          >
            <CtaButton
              variant={ctaStyle}
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
