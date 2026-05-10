"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface EditorialEntry {
  /** Small label — "Chapter 01", "Reportage", year/issue, etc. */
  label?: string;
  /** Entry headline */
  heading: string;
  /** Body — single paragraph reads best */
  body: string;
  /** Cover image */
  image: string;
  /** Alt text */
  imageAlt: string;
  /** Optional photo credit / caption shown under the image */
  imageCaption?: string;
  /**
   * Aspect ratio for the image. Defaults to 4:5 portrait so entries
   * read like magazine spreads.
   */
  imageAspect?: "4:5" | "3:4" | "1:1" | "3:2" | "16:9";
}

export interface GalleryImageTextEditorialProps {
  eyebrow?: string;
  headline: string;
  description?: string;
  /** Editorial entries — 3 to 6 reads best */
  entries: EditorialEntry[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const ASPECT_CLASS: Record<
  NonNullable<EditorialEntry["imageAspect"]>,
  string
> = {
  "4:5": "aspect-[4/5]",
  "3:4": "aspect-[3/4]",
  "1:1": "aspect-square",
  "3:2": "aspect-[3/2]",
  "16:9": "aspect-video",
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface EntryProps {
  entry: EditorialEntry;
  index: number;
}

function EditorialRow({ entry, index }: EntryProps) {
  const reversed = index % 2 === 1;
  const aspect = entry.imageAspect ?? "4:5";
  const safe = useSafeImageSrc(
    entry.image,
    `editorial-spread-${index}`,
    900,
    1200,
  );

  return (
    <motion.article
      className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Image column — alternating side, slightly offset for editorial drift */}
      <motion.figure
        variants={fadeUp}
        className={cn(
          "relative lg:col-span-7",
          reversed
            ? "lg:order-2 lg:translate-y-4"
            : "lg:order-1 lg:-translate-y-4",
        )}
      >
        <div
          className={cn(
            "overflow-hidden rounded-2xl bg-base-200",
            ASPECT_CLASS[aspect],
          )}
        >
          <img
            src={safe.src}
            onError={safe.onError}
            alt={entry.imageAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
          />
        </div>
        {entry.imageCaption && (
          <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-base-content/55">
            {entry.imageCaption}
          </figcaption>
        )}
      </motion.figure>

      {/* Copy column */}
      <motion.div
        variants={fadeUp}
        className={cn("lg:col-span-5", reversed ? "lg:order-1" : "lg:order-2")}
      >
        <div aria-hidden="true" className="mb-6 h-px w-12 bg-base-content/40" />
        {entry.label && (
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
            {entry.label}
          </p>
        )}
        <h3 className="text-balance font-serif text-3xl font-semibold leading-[1.1] tracking-tight text-base-content md:text-4xl lg:text-[2.75rem]">
          {entry.heading}
        </h3>
        <p className="mt-5 max-w-[55ch] text-base leading-relaxed text-base-content/70 md:text-lg">
          {entry.body}
        </p>
      </motion.div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * GalleryImageTextEditorial — alternating image-and-caption editorial
 * spread. Each entry zig-zags the image side and applies a small
 * vertical offset so the column drifts like a magazine layout. Headings
 * use the serif stack; body uses the sans-serif default.
 *
 * Built for portfolio narratives, magazine archives, and story-driven
 * brand pages where each entry deserves its own moment.
 */
export default function GalleryImageTextEditorial({
  eyebrow,
  headline,
  description,
  entries,
  className,
}: GalleryImageTextEditorialProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className={cn("w-full bg-base-100 py-16 md:py-24 lg:py-32", className)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          className="mx-auto mb-16 max-w-2xl md:mb-24"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {eyebrow && (
            <motion.p
              variants={fadeUp}
              className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-primary"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h2
            variants={fadeUp}
            className="text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-base-content sm:text-5xl md:text-6xl"
          >
            {headline}
          </motion.h2>
          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-[60ch] text-base leading-relaxed text-base-content/65 md:text-lg"
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        {/* Entries */}
        <div className="flex flex-col gap-20 md:gap-28 lg:gap-32">
          {entries.map((entry, i) => (
            <EditorialRow key={i} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
