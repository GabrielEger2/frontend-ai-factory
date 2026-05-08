"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MosaicTile {
  /** Product display name — surfaces in the hover overlay. */
  productName: string;
  /** Product photograph or lifestyle still. */
  image: string;
  /** Alt text for the tile photograph — required for a11y. */
  imageAlt: string;
  /** Already-formatted price string (locale + currency). Optional. */
  price?: string;
  /** Per-tile destination — typically /products/<slug>. */
  productUrl: string;
}

export interface ProductsHoverMosaicProps {
  /** Small label rendered above the section headline. */
  eyebrow?: string;
  /** Section headline. */
  headline: string;
  /** Optional supporting copy beneath the headline. */
  subheadline?: string;
  /**
   * Hero tile — the single dominant image in the mosaic. Sits on the left
   * spanning two rows and two columns on desktop. Skipping it is allowed
   * but the asymmetric balance flattens.
   */
  hero?: MosaicTile;
  /**
   * Surrounding tiles. 4 entries lock cleanly into the 4-cell flank of the
   * desktop mosaic; 5 wraps the fifth into a short bottom strip on mobile.
   * More than 5 is silently capped — the layout breaks otherwise.
   */
  tiles: MosaicTile[];
  /** Anchor CTA label — "Shop all products", "Ver catálogo completo". */
  ctaText?: string;
  /** Anchor CTA destination — typically `/products`. */
  ctaUrl?: string;
  /** CTA visual variant. */
  ctaStyle?: CtaVariant;
  /** CTA color scheme. */
  ctaColorScheme?: ColorScheme;
  /** Visual tone — light page surface or inverted dark slab. */
  tone?: "light" | "dark";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Tile sub-component                                                 */
/* ------------------------------------------------------------------ */

interface TileProps {
  tile: MosaicTile;
  variant: "hero" | "flank";
  toneClasses: ReturnType<typeof getToneClasses>;
  prefersReducedMotion: boolean | null;
}

function MosaicTileCard({
  tile,
  variant,
  toneClasses,
  prefersReducedMotion,
}: TileProps) {
  const isHero = variant === "hero";

  return (
    <motion.a
      href={tile.productUrl}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "group relative block h-full w-full overflow-hidden rounded-3xl",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4",
        toneClasses.tileBg,
        isHero && "lg:col-span-2 lg:row-span-2",
      )}
    >
      {/* Image — soft scale on hover, slow easing so the zoom feels
          editorial rather than mechanical. */}
      <motion.img
        src={tile.image}
        alt={tile.imageAlt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Bottom-anchored gradient — only renders on hover/focus so the
          tile reads as a clean photograph at rest. */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-0 transition-opacity duration-300 ease-out",
          "bg-gradient-to-t from-black/70 via-black/20 to-transparent",
          "group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
      />

      {/* Content overlay — slides up + fades in on hover/focus. The "view"
          chip lives in the top-right corner regardless of state so the tile
          still reads as clickable on first scan. */}
      <div
        className={cn(
          "pointer-events-none absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-transform duration-300 ease-out",
          toneClasses.arrowChip,
          "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
        )}
      >
        <FiArrowUpRight
          className={cn("h-4 w-4", toneClasses.arrowIcon)}
          aria-hidden="true"
        />
      </div>

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex translate-y-3 flex-col gap-1 p-5 text-white opacity-0 transition-all duration-300 ease-out md:p-6",
          "group-hover:translate-y-0 group-hover:opacity-100",
          "group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
        )}
      >
        <h3
          className={cn(
            "font-semibold leading-tight tracking-tight",
            isHero ? "text-2xl md:text-3xl" : "text-base md:text-lg",
          )}
        >
          {tile.productName}
        </h3>
        {tile.price && (
          <span
            className={cn(
              "font-medium text-white/85",
              isHero ? "text-base md:text-lg" : "text-sm",
            )}
          >
            {tile.price}
          </span>
        )}
      </div>
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/*  Tone classes                                                       */
/* ------------------------------------------------------------------ */

function getToneClasses(tone: "light" | "dark") {
  return tone === "dark"
    ? {
        section: "bg-neutral text-neutral-content",
        eyebrow: "text-neutral-content/60",
        subheadline: "text-neutral-content/70",
        divider: "border-neutral-content/15",
        tileBg: "bg-neutral-content/5",
        arrowChip: "bg-neutral-content/15 backdrop-blur-sm",
        arrowIcon: "text-neutral-content",
      }
    : {
        section: "bg-base-100 text-base-content",
        eyebrow: "text-base-content/60",
        subheadline: "text-base-content/70",
        divider: "border-base-content/15",
        tileBg: "bg-base-200",
        arrowChip: "bg-base-100/85 backdrop-blur-sm",
        arrowIcon: "text-base-content",
      };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * ProductsHoverMosaic — asymmetric editorial grid with one dominant hero
 * tile flanked by 4–5 smaller tiles. Each tile reveals product name and
 * price on hover with a subtle image zoom. A single anchor CTA funnels
 * scrollers from the home page into /products.
 *
 * Layout (desktop, lg+):
 *   ┌───────────┬─────┬─────┐
 *   │           │  T1 │  T2 │
 *   │   HERO    ├─────┼─────┤
 *   │           │  T3 │  T4 │
 *   └───────────┴─────┴─────┘
 *
 * Layout (md): hero spans the full width on top, flank tiles in a 2×2
 * grid below.
 * Layout (< md): single column stack — hero first, then each flank tile.
 */
export default function ProductsHoverMosaic({
  eyebrow,
  headline,
  subheadline,
  hero,
  tiles,
  ctaText,
  ctaUrl,
  ctaStyle = "arrow",
  ctaColorScheme = "primary",
  tone = "light",
  className,
}: ProductsHoverMosaicProps) {
  const prefersReducedMotion = useReducedMotion();
  const toneClasses = getToneClasses(tone);

  // Cap flank tiles at 5 — the desktop grid only has cells for 4 and a
  // 5th wraps into a strip on mobile/tablet. Anything more breaks layout.
  const visibleTiles = tiles.slice(0, 5);

  return (
    <section
      className={cn(
        "relative w-full py-12 md:py-16 lg:py-24",
        toneClasses.section,
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header — left-aligned, max-w-2xl so the headline doesn't
            stretch into the mosaic. */}
        <header className="mb-8 flex flex-col gap-4 md:mb-12 lg:mb-16 lg:max-w-2xl">
          {eyebrow && (
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.22em]",
                toneClasses.eyebrow,
              )}
            >
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl">
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

        {/* Mosaic grid — staggered reveal. Asymmetric on lg+, simpler 2-up
            on md, single column < md. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            visible: {
              transition: { staggerChildren: prefersReducedMotion ? 0 : 0.06 },
            },
          }}
          className={cn(
            "grid grid-cols-1 gap-3 sm:gap-4",
            "md:grid-cols-2 md:auto-rows-[20rem]",
            "lg:grid-cols-4 lg:auto-rows-[18rem]",
            visibleTiles.length === 5 && "lg:auto-rows-[16rem]",
          )}
        >
          {/* Hero tile — full-width on md, 2x2 on lg+. */}
          {hero && (
            <div
              className={cn(
                "h-72 sm:h-96 md:col-span-2 md:h-auto md:row-span-1 lg:col-span-2 lg:row-span-2",
              )}
            >
              <MosaicTileCard
                tile={hero}
                variant="hero"
                toneClasses={toneClasses}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
          )}

          {/* Flank tiles. */}
          {visibleTiles.map((tile, i) => (
            <div
              key={`${tile.productName}-${i}`}
              className={cn(
                "h-56 sm:h-72 md:h-auto",
                // 5th tile spans the full row on lg+ so it doesn't orphan.
                visibleTiles.length === 5 && i === 4 && "lg:col-span-2",
              )}
            >
              <MosaicTileCard
                tile={tile}
                variant="flank"
                toneClasses={toneClasses}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
          ))}
        </motion.div>

        {/* Anchor CTA — sits below behind a divider line so it reads as
            the destination after scanning the mosaic. */}
        {ctaText && (
          <div
            className={cn(
              "mt-10 flex flex-wrap items-center gap-4 border-t pt-8 md:mt-14 md:pt-12",
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
