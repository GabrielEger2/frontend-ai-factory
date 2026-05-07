"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CtaHoverRevealItem {
  /** Display label for the row (e.g. "Sourdough Loaves"). */
  label: string;
  /** Short supporting copy shown next to the label on larger screens. */
  caption?: string;
  /** Image revealed as the row's background on hover. */
  image: string;
  /** Alt text for the image. */
  imageAlt: string;
  /** Optional destination URL for the row. Falls back to the parent ctaUrl. */
  url?: string;
  /** Optional category counter ("01", "02", etc.). When omitted the index is auto-generated. */
  index?: string;
}

export interface CtaHoverRevealListProps {
  /** Small label above the headline ("Our Counter", "Editions", etc.). */
  eyebrow?: string;
  /** Section headline. */
  headline: string;
  /** Supporting subheadline beneath the headline. */
  subheadline?: string;
  /**
   * Items rendered as full-width hoverable rows. On desktop, hovering a row
   * reveals its image as the row's background; on touch a small inline
   * thumbnail sits beside the label so the image is still visible.
   */
  items: CtaHoverRevealItem[];
  /** Footer CTA label rendered after the list. */
  ctaText?: string;
  /** Footer CTA destination URL. */
  ctaUrl?: string;
  /**
   * Visual tone — controls whether the section sits on the page surface or
   * an inverted dark slab. Defaults to `light`.
   */
  tone?: "light" | "dark";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatIndex(i: number) {
  return String(i + 1).padStart(2, "0");
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CtaHoverRevealList({
  eyebrow,
  headline,
  subheadline,
  items,
  ctaText,
  ctaUrl,
  tone = "light",
  className,
}: CtaHoverRevealListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Tone-based color tokens for the resting state — semantic only, no raw
  // Tailwind colors. Hovered rows always switch to a white-on-image palette
  // because the image + scrim overlay obscures the underlying tone.
  const toneClasses =
    tone === "dark"
      ? {
          section: "bg-neutral text-neutral-content",
          divider: "border-neutral-content/15",
          rowLabel: "text-neutral-content",
          rowDim: "text-neutral-content/40",
          rowCaption: "text-neutral-content/60",
          eyebrow: "text-neutral-content/60",
          subheadline: "text-neutral-content/70",
          ctaBorder: "border-neutral-content/30 hover:border-neutral-content",
          ctaBg: "hover:bg-neutral-content hover:text-neutral",
        }
      : {
          section: "bg-base-100 text-base-content",
          divider: "border-base-content/15",
          rowLabel: "text-base-content",
          rowDim: "text-base-content/40",
          rowCaption: "text-base-content/60",
          eyebrow: "text-base-content/60",
          subheadline: "text-base-content/70",
          ctaBorder: "border-base-content/30 hover:border-base-content",
          ctaBg: "hover:bg-base-content hover:text-base-100",
        };

  return (
    <section
      className={cn(
        "relative isolate w-full overflow-hidden py-12 md:py-16 lg:py-24",
        toneClasses.section,
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header */}
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
                "max-w-xl text-base md:text-lg",
                toneClasses.subheadline,
              )}
            >
              {subheadline}
            </p>
          )}
        </header>

        {/* List */}
        <ul className={cn("border-t", toneClasses.divider)}>
          {items.map((item, i) => {
            const indexLabel = item.index ?? formatIndex(i);
            const href = item.url ?? ctaUrl ?? "#";
            const isHovered = hoveredIndex === i;
            const isDimmed = hoveredIndex !== null && !isHovered;

            return (
              <li
                key={`${item.label}-${i}`}
                className={cn("border-b", toneClasses.divider)}
              >
                <a
                  href={href}
                  onPointerEnter={() => setHoveredIndex(i)}
                  onPointerLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(i)}
                  onBlur={() => setHoveredIndex(null)}
                  className={cn(
                    "group relative flex items-center gap-6 overflow-hidden py-6 transition-opacity duration-300 md:py-8 lg:py-10",
                    isDimmed && "opacity-40",
                  )}
                >
                  {/* Row background image — fades + slow zoom on hover. Sits
                       behind every other element via -z-10. */}
                  <motion.div
                    className="pointer-events-none absolute inset-0 -z-10"
                    initial={false}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    aria-hidden="true"
                  >
                    <motion.img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                      initial={false}
                      animate={{ scale: isHovered ? 1 : 1.08 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                    {/* Scrim — heavier on the left where the index/label sits,
                         lighter toward the arrow. Keeps white text legible
                         over any underlying image. */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
                  </motion.div>

                  {/* Index counter */}
                  <span
                    className={cn(
                      "relative font-mono text-xs tabular-nums transition-colors duration-300 md:text-sm",
                      isHovered ? "text-white/80" : toneClasses.rowDim,
                    )}
                  >
                    {indexLabel}
                  </span>

                  {/* Label + caption */}
                  <div className="relative flex flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
                    <motion.span
                      className={cn(
                        "block text-3xl font-semibold tracking-tight transition-colors duration-300 md:text-4xl lg:text-5xl",
                        isHovered ? "text-white" : toneClasses.rowLabel,
                      )}
                      animate={{
                        x: isHovered ? 12 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 240,
                        damping: 24,
                      }}
                    >
                      {item.label}
                    </motion.span>
                    {item.caption && (
                      <span
                        className={cn(
                          "text-sm transition-colors duration-300 md:max-w-xs md:text-base",
                          isHovered ? "text-white/80" : toneClasses.rowCaption,
                        )}
                      >
                        {item.caption}
                      </span>
                    )}
                  </div>

                  {/* Mobile thumbnail — touch devices can't hover, so the
                       image sits inline as a small preview instead. */}
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md md:hidden">
                    <img
                      src={item.image}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Arrow */}
                  <motion.span
                    className={cn(
                      "relative shrink-0 transition-colors duration-300",
                      isHovered ? "text-white" : toneClasses.rowDim,
                    )}
                    animate={{
                      x: isHovered ? 6 : 0,
                      rotate: isHovered ? 0 : -45,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                    aria-hidden="true"
                  >
                    <FiArrowUpRight className="h-6 w-6 md:h-7 md:w-7" />
                  </motion.span>

                  {/* Screen-reader-only image description, since the visible
                       img is decorative. */}
                  <span className="sr-only">{item.imageAlt}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Footer CTA */}
        {ctaText && (
          <div className="mt-10 flex md:mt-14">
            <a
              href={ctaUrl ?? "#"}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-all duration-300 ease-out",
                toneClasses.ctaBorder,
                toneClasses.ctaBg,
              )}
            >
              <span>{ctaText}</span>
              <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
