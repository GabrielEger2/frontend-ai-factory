"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CategoryTile {
  /** Category display name — e.g. "Sapatos", "Mobília", "Skincare". */
  name: string;
  /** Lifestyle background photograph for the tile. */
  backgroundImage: string;
  /** Alt text for the background photograph. */
  imageAlt: string;
  /**
   * Bestseller thumbnail — small floating image anchored to the bottom-left
   * of the tile. Acts as a tangible preview hook.
   */
  bestsellerThumb: string;
  /** Alt text for the bestseller thumbnail. */
  bestsellerThumbAlt: string;
  /** Bestseller name — surfaces beneath the category name. */
  bestsellerName: string;
  /**
   * Number of products in the category. Surfaces as the count chip in the
   * top-right corner ("32 produtos"). Pass the rounded display value the
   * brand uses publicly — exact stock counts read as inventory data.
   */
  productCount: number;
  /**
   * Optional already-localized count label override. When present, replaces
   * the auto-generated `<count> produtos` string entirely (e.g. "32 itens",
   * "9 coleções").
   */
  countLabel?: string;
  /** Category landing URL — typically /products?category=<slug>. */
  categoryUrl: string;
}

export interface ProductsCategoryHubProps {
  /** Small label rendered above the section headline. */
  eyebrow?: string;
  /** Section headline. */
  headline: string;
  /** Optional supporting copy beneath the headline. */
  subheadline?: string;
  /**
   * Category tiles. 3 entries lock into the 1-large + 2-stacked layout;
   * 4 entries expand into 1-large + 3-stacked. More than 4 fragments the
   * mosaic and is silently capped.
   */
  categories: CategoryTile[];
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
        tileBg: "bg-neutral-content/5",
        countChip:
          "bg-neutral-content/15 text-neutral-content backdrop-blur-sm",
        thumbFrame: "border-neutral bg-neutral",
        bestsellerLabel: "text-neutral-content/75",
        arrowChip: "bg-neutral-content/15 backdrop-blur-sm",
        arrowIcon: "text-neutral-content",
      }
    : {
        section: "bg-base-100 text-base-content",
        eyebrow: "text-base-content/60",
        subheadline: "text-base-content/70",
        tileBg: "bg-base-200",
        countChip: "bg-base-100/85 text-base-content backdrop-blur-sm",
        thumbFrame: "border-base-100 bg-base-100",
        bestsellerLabel: "text-base-content/75",
        arrowChip: "bg-base-100/85 backdrop-blur-sm",
        arrowIcon: "text-base-content",
      };
}

/* ------------------------------------------------------------------ */
/*  Tile sub-component                                                 */
/* ------------------------------------------------------------------ */

interface TileProps {
  category: CategoryTile;
  variant: "lead" | "follow";
  toneClasses: ReturnType<typeof getToneClasses>;
  prefersReducedMotion: boolean | null;
}

function CategoryHubTile({
  category,
  variant,
  toneClasses,
  prefersReducedMotion,
}: TileProps) {
  const isLead = variant === "lead";
  const countLabel = category.countLabel ?? `${category.productCount} produtos`;

  return (
    <motion.a
      href={category.categoryUrl}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "group relative flex h-full w-full flex-col justify-end overflow-hidden rounded-3xl",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4",
        toneClasses.tileBg,
      )}
    >
      {/* Background photograph — gentle scale on hover. */}
      <motion.img
        src={category.backgroundImage}
        alt={category.imageAlt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Permanent bottom gradient — keeps the category name legible
          regardless of background photograph contrast. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Top-right count chip — pinned regardless of state. */}
      <span
        className={cn(
          "absolute right-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
          toneClasses.countChip,
        )}
      >
        {countLabel}
      </span>

      {/* Top-left arrow chip — nudges on hover so the whole tile reads as
          interactive. */}
      <div
        className={cn(
          "absolute left-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-transform duration-300 ease-out",
          toneClasses.arrowChip,
          "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
        )}
      >
        <FiArrowUpRight
          className={cn("h-4 w-4", toneClasses.arrowIcon)}
          aria-hidden="true"
        />
      </div>

      {/* Bottom block — bestseller thumbnail + names. */}
      <div className="relative z-10 flex items-end gap-4 p-5 md:p-6">
        {/* Bestseller thumbnail — round-cornered framed thumb, doubles as
            tangible preview hook. */}
        <div
          className={cn(
            "shrink-0 overflow-hidden rounded-xl border-2 shadow-md",
            toneClasses.thumbFrame,
            isLead ? "h-20 w-20 md:h-24 md:w-24" : "h-16 w-16 md:h-20 md:w-20",
          )}
        >
          <img
            src={category.bestsellerThumb}
            alt={category.bestsellerThumbAlt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1 text-white">
          <h3
            className={cn(
              "font-semibold leading-tight tracking-tight",
              isLead ? "text-2xl md:text-4xl" : "text-xl md:text-2xl",
            )}
          >
            {category.name}
          </h3>
          <span className={cn("truncate text-sm", "text-white/75")}>
            {`Mais vendido: ${category.bestsellerName}`}
          </span>
        </div>
      </div>
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * ProductsCategoryHub — 3 or 4 large image-led category tiles in a
 * mosaic. The first tile is the lead and spans 2 columns / 2 rows on
 * desktop; the remaining tiles stack vertically on the right.
 *
 * Each tile shows a lifestyle background photograph, the category name,
 * a small floating bestseller thumbnail, the bestseller's name, and a
 * product-count chip. The whole tile is the click target and deep-links
 * to `/products?category=<slug>` (or whatever the brand uses).
 *
 * Layout (desktop, lg+, 3 tiles):
 *   ┌─────────────┬───────────┐
 *   │             │   FOLLOW  │
 *   │    LEAD     ├───────────┤
 *   │             │   FOLLOW  │
 *   └─────────────┴───────────┘
 *
 * Layout (desktop, lg+, 4 tiles): lead spans 2 rows on the left, three
 * follow tiles stack on the right.
 * Layout (md): lead full-width on top, follow tiles in a 2-up row below.
 * Layout (< md): single column stack.
 */
export default function ProductsCategoryHub({
  eyebrow,
  headline,
  subheadline,
  categories,
  tone = "light",
  className,
}: ProductsCategoryHubProps) {
  const prefersReducedMotion = useReducedMotion();
  const toneClasses = getToneClasses(tone);

  // Cap at 4 — anything more fragments the mosaic into a generic grid.
  const visible = categories.slice(0, 4);
  const lead = visible[0];
  const follow = visible.slice(1);

  if (!lead) {
    return null;
  }

  return (
    <section
      className={cn(
        "relative w-full py-12 md:py-16 lg:py-24",
        toneClasses.section,
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header — left-aligned. */}
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

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: prefersReducedMotion ? 0 : 0.08,
              },
            },
          }}
          className={cn(
            "grid grid-cols-1 gap-4 sm:gap-5",
            // md+: lead on top full-width, follow as 2-up below.
            "md:grid-cols-2",
            // lg+: lead spans 2 cols on left, follow stacks on right.
            "lg:grid-cols-3",
            // Row heights tuned by follow count.
            follow.length <= 2
              ? "lg:auto-rows-[18rem]"
              : "lg:auto-rows-[12rem]",
          )}
        >
          {/* Lead tile. */}
          <div
            className={cn(
              "h-80 sm:h-96 md:col-span-2 md:h-[26rem] lg:col-span-2",
              follow.length === 0
                ? "lg:row-span-1"
                : follow.length <= 2
                  ? "lg:row-span-2"
                  : "lg:row-span-3",
            )}
          >
            <CategoryHubTile
              category={lead}
              variant="lead"
              toneClasses={toneClasses}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>

          {/* Follow tiles. */}
          {follow.map((cat, i) => (
            <div
              key={`${cat.name}-${i}`}
              className={cn(
                "h-56 sm:h-64 md:h-72 lg:h-auto",
                // On md (2 cols), the follow tiles share a 2-up row;
                // on lg+ (3 cols), each follow tile slots into the
                // right column row by row.
                "lg:col-span-1",
              )}
            >
              <CategoryHubTile
                category={cat}
                variant="follow"
                toneClasses={toneClasses}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
