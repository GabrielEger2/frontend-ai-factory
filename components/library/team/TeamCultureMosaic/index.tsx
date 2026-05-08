"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import { buttonStyles } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MosaicImage {
  /** Lifestyle / candid photograph URL — falls back to seeded picsum. */
  src?: string;
  /** Required alt text for the photograph. */
  alt: string;
  /**
   * Visual aspect ratio of the tile. Drives row span in the masonry
   * layout. Defaults to "square".
   */
  aspect?: "portrait" | "landscape" | "square" | "tall";
  /** Optional caption rendered as a small monospaced overlay chip. */
  caption?: string;
}

export interface MosaicValue {
  /** Short value heading (e.g. "Cooking together"). */
  title: string;
  /** Body sentence that fleshes out the value. */
  description: string;
}

export interface TeamCultureMosaicProps {
  /** Eyebrow above the headline (e.g. "How we work"). */
  eyebrow?: string;
  /** Section headline. */
  headline: string;
  /** Lead paragraph beneath the headline. */
  intro?: string;
  /**
   * Image tiles — 6 to 9 entries reads best. Mix portrait, landscape,
   * square, and tall aspect ratios for editorial rhythm. Anything past
   * 9 is silently trimmed.
   */
  images: MosaicImage[];
  /**
   * Value cards — 2 to 4 entries. Interleaved into the mosaic at fixed
   * positions (after the 2nd image, then every 3 thereafter) so the
   * grid breathes between visual and verbal beats.
   */
  values?: MosaicValue[];
  /** Optional anchor CTA — "See open roles" / "Meet the team". */
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Aspect helpers                                                     */
/* ------------------------------------------------------------------ */

const ASPECT_CLASS: Record<NonNullable<MosaicImage["aspect"]>, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  tall: "aspect-[3/5]",
};

/**
 * Span class per aspect — drives the editorial feel of the mosaic by
 * letting taller crops occupy two grid rows on lg+. The columns stay
 * fluid via CSS grid so portrait + landscape crops never tile to a
 * jagged baseline.
 */
const SPAN_CLASS: Record<NonNullable<MosaicImage["aspect"]>, string> = {
  portrait: "lg:row-span-2",
  landscape: "lg:row-span-1",
  square: "lg:row-span-1",
  tall: "lg:row-span-2",
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface MosaicTileProps {
  image: MosaicImage;
  index: number;
}

function MosaicTile({ image, index }: MosaicTileProps) {
  const aspect = image.aspect ?? "square";
  const safe = useSafeImageSrc(
    image.src,
    `culture-mosaic-${index}`,
    aspect === "landscape" ? 900 : 700,
    aspect === "landscape" ? 675 : aspect === "tall" ? 1166 : 933,
  );

  return (
    <motion.figure
      variants={fadeUp}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-base-200 ring-1 ring-base-300/60",
        ASPECT_CLASS[aspect],
        SPAN_CLASS[aspect],
      )}
    >
      <img
        src={safe.src}
        onError={safe.onError}
        alt={image.alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      {image.caption && (
        <figcaption className="pointer-events-none absolute left-3 top-3 rounded-full bg-base-100/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-base-content/75 backdrop-blur-sm">
          {image.caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

interface ValueCardProps {
  value: MosaicValue;
  numeral: string;
}

function ValueCard({ value, numeral }: ValueCardProps) {
  return (
    <motion.article
      variants={fadeUp}
      className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-base-300 bg-base-100 p-6 lg:row-span-1"
    >
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
        {numeral}
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="text-balance text-lg font-semibold leading-tight tracking-tight text-base-content md:text-xl">
          {value.title}
        </h3>
        <p className="text-sm leading-relaxed text-base-content/70">
          {value.description}
        </p>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Interleaving                                                       */
/* ------------------------------------------------------------------ */

type CellType =
  | { kind: "image"; image: MosaicImage; idx: number }
  | { kind: "value"; value: MosaicValue; numeral: string };

/**
 * Interleave images and values at deterministic positions so the
 * mood-board reads with rhythm. Values land after image 2, then every
 * 3 images thereafter — close enough to feel woven, far enough that
 * adjacent value cards never crowd each other.
 */
function interleave(images: MosaicImage[], values: MosaicValue[]): CellType[] {
  const cells: CellType[] = [];
  let nextValueIdx = 0;
  const insertAfter = new Set<number>();

  if (values.length > 0) {
    insertAfter.add(1);
    let cursor = 1 + 3;
    while (
      nextValueIdx + insertAfter.size < values.length &&
      cursor < images.length
    ) {
      insertAfter.add(cursor);
      cursor += 3;
    }
  }

  images.forEach((image, idx) => {
    cells.push({ kind: "image", image, idx });
    if (insertAfter.has(idx) && nextValueIdx < values.length) {
      const value = values[nextValueIdx];
      cells.push({
        kind: "value",
        value,
        numeral: String(nextValueIdx + 1).padStart(2, "0"),
      });
      nextValueIdx++;
    }
  });

  // Append any leftover value cards at the end (in case images < expected).
  while (nextValueIdx < values.length) {
    const value = values[nextValueIdx];
    cells.push({
      kind: "value",
      value,
      numeral: String(nextValueIdx + 1).padStart(2, "0"),
    });
    nextValueIdx++;
  }

  return cells;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TeamCultureMosaic — editorial mood-board for "how we work" / culture
 * sections. Mixed-aspect candid photography interleaved with two to
 * four short value cards, plus an optional anchor CTA. Skews lifestyle,
 * NOT polished headshots — designed for studios, restaurants, and
 * brands where culture is the trust signal.
 *
 * Layout (lg+): asymmetric 4-column grid with portrait/tall tiles
 * spanning two rows. Layout (md): 3-column with relaxed spans.
 * Layout (< md): single column stack.
 */
export default function TeamCultureMosaic({
  eyebrow,
  headline,
  intro,
  images,
  values,
  ctaText,
  ctaUrl,
  className,
}: TeamCultureMosaicProps) {
  const shouldReduceMotion = useReducedMotion();

  // Cap images at 9 — past that the masonry rhythm collapses into noise.
  const visibleImages = images.slice(0, 9);
  const visibleValues = (values ?? []).slice(0, 4);

  const cells = interleave(visibleImages, visibleValues);

  return (
    <section
      className={cn("w-full bg-base-100 py-16 md:py-20 lg:py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.header
          className="mb-12 grid grid-cols-1 gap-6 md:mb-16 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] lg:items-end lg:gap-12"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="flex flex-col gap-3">
            {eyebrow && (
              <motion.span
                variants={fadeUp}
                className="text-xs font-semibold uppercase tracking-[0.25em] text-primary"
              >
                {eyebrow}
              </motion.span>
            )}
            <motion.h2
              variants={fadeUp}
              className="text-balance text-3xl font-semibold leading-tight tracking-tight text-base-content sm:text-4xl md:text-5xl"
            >
              {headline}
            </motion.h2>
          </div>
          {intro && (
            <motion.p
              variants={fadeUp}
              className="max-w-[60ch] text-base leading-relaxed text-base-content/70 md:text-lg"
            >
              {intro}
            </motion.p>
          )}
        </motion.header>

        <motion.div
          className={cn(
            "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5",
            "md:grid-cols-3",
            "lg:grid-cols-4 lg:auto-rows-[14rem]",
          )}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {cells.map((cell, i) =>
            cell.kind === "image" ? (
              <MosaicTile
                key={`image-${cell.idx}`}
                image={cell.image}
                index={cell.idx}
              />
            ) : (
              <ValueCard
                key={`value-${cell.numeral}`}
                value={cell.value}
                numeral={cell.numeral}
              />
            ),
          )}
        </motion.div>

        {ctaText && ctaUrl && (
          <motion.div
            className="mt-12 flex flex-wrap items-center gap-4 border-t border-base-300 pt-8 md:mt-16 md:pt-10"
            variants={fadeUp}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <a
              href={ctaUrl}
              className={buttonStyles({ variant: "outline", size: "md" })}
            >
              {ctaText}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
