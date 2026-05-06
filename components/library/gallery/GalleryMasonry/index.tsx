"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MasonryItem {
  /** Image src (full URL, /public path, or empty for picsum fallback) */
  image: string;
  /** Required alt text for accessibility */
  imageAlt: string;
  /** Optional title revealed on hover */
  title?: string;
  /** Optional category chip (e.g. "Branding", "Editorial") */
  category?: string;
  /**
   * Aspect ratio bias — controls the column-span weight of the tile.
   * "tall" doubles vertical space, "wide" doubles horizontal, default is square-ish.
   */
  shape?: "default" | "tall" | "wide";
  /** Optional click destination */
  href?: string;
}

export interface GalleryMasonryProps {
  /** Eyebrow above the headline */
  eyebrow?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** Masonry tiles — between 6 and 16 reads best */
  items: MasonryItem[];
  /** Number of desktop columns (3 or 4) */
  columns?: 3 | 4;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface TileProps {
  item: MasonryItem;
  index: number;
}

function MasonryTile({ item, index }: TileProps) {
  const dims =
    item.shape === "tall"
      ? { w: 600, h: 900 }
      : item.shape === "wide"
        ? { w: 900, h: 600 }
        : { w: 700, h: 700 };

  const safe = useSafeImageSrc(
    item.image,
    `gallery-masonry-${index}`,
    dims.w,
    dims.h,
  );

  const aspectClass =
    item.shape === "tall"
      ? "aspect-[2/3]"
      : item.shape === "wide"
        ? "aspect-[3/2]"
        : "aspect-square";

  const Wrapper: any = item.href ? "a" : "div";
  const wrapperProps = item.href
    ? { href: item.href, "aria-label": item.title || item.imageAlt }
    : {};

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-base-200",
        aspectClass,
      )}
    >
      <Wrapper
        {...wrapperProps}
        className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <img
          src={safe.src}
          onError={safe.onError}
          alt={item.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {/* Bottom gradient + meta — only when meta exists */}
        {(item.title || item.category) && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral/85 via-neutral/40 to-transparent p-4 pt-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <div className="flex flex-col gap-1">
              {item.category && (
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-content/75">
                  {item.category}
                </span>
              )}
              {item.title && (
                <span className="text-base font-medium leading-tight text-neutral-content">
                  {item.title}
                </span>
              )}
            </div>
          </div>
        )}
      </Wrapper>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * GalleryMasonry — Pinterest-style asymmetric column layout using CSS
 * `columns` for true masonry without JavaScript layout math. Tiles vary
 * height via `shape: "tall" | "wide" | "default"`. Hover surfaces a
 * gradient + title + category chip; focus-within mirrors the same so the
 * meta is keyboard-discoverable.
 */
export default function GalleryMasonry({
  eyebrow,
  headline,
  description,
  items,
  columns = 3,
  className,
}: GalleryMasonryProps) {
  const shouldReduceMotion = useReducedMotion();

  const colClass =
    columns === 4
      ? "sm:columns-2 md:columns-3 xl:columns-4"
      : "sm:columns-2 lg:columns-3";

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-20 lg:py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          className="mx-auto mb-12 flex max-w-2xl flex-col text-left md:mb-16"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {eyebrow && (
            <motion.p
              variants={fadeUp}
              className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h2
            variants={fadeUp}
            className="text-balance text-3xl font-semibold tracking-tight text-base-content sm:text-4xl md:text-5xl"
          >
            {headline}
          </motion.h2>
          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-[60ch] text-base leading-relaxed text-base-content/65"
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className={cn("columns-1 gap-4", colClass)}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {items.map((item, i) => (
            <MasonryTile key={i} item={item} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
