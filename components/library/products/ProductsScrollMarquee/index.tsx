"use client";

import { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MarqueeTile {
  /** Product display name — surfaces in the hover overlay. */
  productName: string;
  /** Product photograph or lifestyle still. */
  image: string;
  /** Alt text for the tile photograph — required for a11y. */
  imageAlt: string;
  /** Per-tile destination — typically /products/<slug>. */
  productUrl: string;
}

export interface ProductsScrollMarqueeProps {
  /** Small label rendered above the section headline. */
  eyebrow?: string;
  /** Section headline. */
  headline: string;
  /** Optional supporting copy beneath the headline. */
  subheadline?: string;
  /**
   * Product tiles. Min 8 to feel like a catalog rather than a strip;
   * 12–20 is the sweet spot. Tiles are split into two rows that scroll
   * in opposite directions; an even split is ideal but odd counts work.
   */
  tiles: MarqueeTile[];
  /**
   * Optional total catalog size. When provided, surfaces in the CTA area
   * as "Explore 120+ products" framing. Pass the rounded-down nearest
   * 10/50/100 — exact counts read as inventory data.
   */
  productCount?: number;
  /**
   * Top row scroll duration in seconds. Higher = slower. Default 60.
   */
  topDuration?: number;
  /**
   * Bottom row scroll duration in seconds. Slightly different from top
   * creates the desync that catches the eye. Default 75.
   */
  bottomDuration?: number;
  /** Centered CTA label — "Browse the catalog", "Ver tudo". */
  ctaText?: string;
  /** CTA destination URL — typically /products. */
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
/*  Tone classes                                                       */
/* ------------------------------------------------------------------ */

function getToneClasses(tone: "light" | "dark") {
  return tone === "dark"
    ? {
        section: "bg-neutral text-neutral-content",
        eyebrow: "text-neutral-content/60",
        subheadline: "text-neutral-content/70",
        countTone: "text-neutral-content/65",
        tileBg: "bg-neutral-content/5",
        fadeFrom: "from-neutral",
      }
    : {
        section: "bg-base-100 text-base-content",
        eyebrow: "text-base-content/60",
        subheadline: "text-base-content/70",
        countTone: "text-base-content/65",
        tileBg: "bg-base-200",
        fadeFrom: "from-base-100",
      };
}

/* ------------------------------------------------------------------ */
/*  Marquee row                                                        */
/* ------------------------------------------------------------------ */

interface MarqueeRowProps {
  tiles: MarqueeTile[];
  duration: number;
  reverse?: boolean;
  paused: boolean;
  shouldReduceMotion: boolean | null;
  toneClasses: ReturnType<typeof getToneClasses>;
}

function MarqueeRow({
  tiles,
  duration,
  reverse,
  paused,
  shouldReduceMotion,
  toneClasses,
}: MarqueeRowProps) {
  // Two copies side-by-side give a seamless loop. We drive a 0..1 motion
  // value with useAnimationFrame so we can deterministically pause on
  // hover without snapping the transform back to its initial position.
  // useTransform converts the 0..1 progress into a percentage translation,
  // which the GPU compositor handles as a pure transform (no reflow).
  const progress = useMotionValue(reverse ? 1 : 0);
  const x = useTransform(progress, [0, 1], ["0%", "-100%"]);
  const lastFrameRef = useRef<number | null>(null);
  const repeats = [0, 1];

  useAnimationFrame((time) => {
    if (shouldReduceMotion) {
      return;
    }
    if (paused) {
      lastFrameRef.current = null;
      return;
    }
    const last = lastFrameRef.current;
    lastFrameRef.current = time;
    if (last === null) {
      return;
    }
    const deltaSeconds = (time - last) / 1000;
    const stepPerSecond = 1 / Math.max(duration, 1);
    let next =
      progress.get() + (reverse ? -1 : 1) * stepPerSecond * deltaSeconds;
    // Wrap at 0 / 1 so the loop is seamless.
    if (next > 1) next -= 1;
    if (next < 0) next += 1;
    progress.set(next);
  });

  return (
    <div className="flex items-center">
      {repeats.map((r) => (
        <motion.ul
          key={r}
          className="flex shrink-0 gap-4 px-2"
          style={shouldReduceMotion ? undefined : { x }}
        >
          {tiles.map((tile, i) => (
            <li key={`${r}-${i}`} className="shrink-0">
              <a
                href={tile.productUrl}
                className={cn(
                  "group relative block h-40 w-40 overflow-hidden rounded-2xl sm:h-52 sm:w-52 md:h-60 md:w-60",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4",
                  toneClasses.tileBg,
                )}
              >
                <img
                  src={tile.image}
                  alt={tile.imageAlt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {/* Hover overlay — slides up gradient + name; stays clean
                    at rest. */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-0 transition-opacity duration-300 ease-out",
                    "bg-gradient-to-t from-black/75 via-black/25 to-transparent",
                    "group-hover:opacity-100 group-focus-visible:opacity-100",
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 translate-y-2 px-4 pb-4 text-sm font-medium leading-tight text-white opacity-0 transition-all duration-300 ease-out",
                    "group-hover:translate-y-0 group-hover:opacity-100",
                    "group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
                  )}
                >
                  {tile.productName}
                </div>
              </a>
            </li>
          ))}
        </motion.ul>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * ProductsScrollMarquee — two horizontal marquees stacked vertically,
 * scrolling in opposite directions at slightly different speeds. Each
 * tile reveals product name on hover. The whole rail pauses when the
 * pointer enters the marquee area so users can scan a tile they spotted.
 *
 * A centered CTA sits below the rails with an optional product-count
 * framing ("Explore 120+ products"). Funnels traffic from a homepage
 * into /products by sampling breadth.
 */
export default function ProductsScrollMarquee({
  eyebrow,
  headline,
  subheadline,
  tiles,
  productCount,
  topDuration = 60,
  bottomDuration = 75,
  ctaText,
  ctaUrl,
  ctaStyle = "arrow",
  ctaColorScheme = "primary",
  tone = "light",
  className,
}: ProductsScrollMarqueeProps) {
  const shouldReduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const toneClasses = getToneClasses(tone);

  // Need at least 4 tiles per row for the loop to read as continuous.
  // Split the deck into two rows. Odd counts give the longer row to top.
  const half = Math.ceil(tiles.length / 2);
  const topRow = tiles.slice(0, half);
  const bottomRow = tiles.slice(half).length > 0 ? tiles.slice(half) : tiles;

  // Format the count label without exact integers — round display to the
  // nearest 10 / 50 / 100 to read as catalog framing rather than a stock
  // number. Caller is expected to pre-round, but defensive guard here.
  const countLabel =
    typeof productCount === "number" && productCount > 0
      ? `${productCount}+`
      : null;

  return (
    <section
      className={cn(
        "relative isolate w-full overflow-x-hidden py-12 md:py-16 lg:py-24",
        toneClasses.section,
        className,
      )}
    >
      {/* Header — left-aligned with max-w-3xl; the marquee below is full-bleed. */}
      <div className="mx-auto mb-10 max-w-7xl px-4 md:mb-14 md:px-8 lg:px-12">
        <header className="flex flex-col gap-4 lg:max-w-3xl">
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
                "max-w-2xl text-base leading-relaxed md:text-lg",
                toneClasses.subheadline,
              )}
            >
              {subheadline}
            </p>
          )}
        </header>
      </div>

      {/* Marquee rails — full bleed, paused on hover. */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Edge fades — keep the rails feeling like a stream rather than a
            hard-cropped row. */}
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r to-transparent md:w-24",
            toneClasses.fadeFrom,
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l to-transparent md:w-24",
            toneClasses.fadeFrom,
          )}
        />

        <div className="flex flex-col gap-4">
          <MarqueeRow
            tiles={topRow}
            duration={topDuration}
            paused={paused}
            shouldReduceMotion={shouldReduceMotion}
            toneClasses={toneClasses}
          />
          <MarqueeRow
            tiles={bottomRow}
            duration={bottomDuration}
            reverse
            paused={paused}
            shouldReduceMotion={shouldReduceMotion}
            toneClasses={toneClasses}
          />
        </div>
      </div>

      {/* CTA block — centered, with optional count framing. */}
      {(ctaText || countLabel) && (
        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center gap-3 px-4 text-center md:mt-16 md:px-8">
          {countLabel && (
            <span
              className={cn(
                "text-sm font-medium uppercase tracking-[0.18em]",
                toneClasses.countTone,
              )}
            >
              {`${countLabel} produtos no catálogo`}
            </span>
          )}
          {ctaText && (
            <CtaButton
              variant={ctaStyle}
              colorScheme={ctaColorScheme}
              href={ctaUrl}
            >
              {ctaText}
            </CtaButton>
          )}
        </div>
      )}
    </section>
  );
}
