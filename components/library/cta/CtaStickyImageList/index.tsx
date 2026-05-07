"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CtaStickyImageListItem {
  /** Two-character index counter ("01", "02", ...). Auto-generated when omitted. */
  index?: string;
  /** Bold short label rendered above the title (e.g. "Atelier", "Studio"). */
  eyebrow?: string;
  /** Item headline — the main pitch for this row. */
  title: string;
  /** One-paragraph supporting copy. */
  description: string;
  /** Per-item CTA label rendered as a small inline link. */
  ctaText?: string;
  /** Per-item CTA destination URL. */
  ctaUrl?: string;
  /**
   * Image rendered in the sticky column when this item is the active one
   * (i.e. closest to the viewport center as the user scrolls). Each item
   * carries its own image so the picture cross-fades as you read down the
   * list, but the image element itself stays anchored to the side.
   */
  image: string;
  /** Alt text for the per-item image. */
  imageAlt: string;
}

export interface CtaStickyImageListProps {
  /** Small label rendered above the section headline. */
  eyebrow?: string;
  /** Section headline rendered at the top of the right column. */
  headline: string;
  /** Optional supporting copy beneath the headline. */
  subheadline?: string;
  /**
   * Items rendered as a vertical stack on the right. As the user scrolls
   * past each item, the sticky image on the left cross-fades to that
   * item's image — so the photograph never leaves the viewport even when
   * the bottom CTAs come into view.
   */
  items: CtaStickyImageListItem[];
  /** Footer CTA label rendered after the list. */
  ctaText?: string;
  /** Footer CTA destination URL. */
  ctaUrl?: string;
  /** Footer CTA visual variant. */
  ctaStyle?: CtaVariant;
  /** Footer CTA color scheme. */
  ctaColorScheme?: ColorScheme;
  /**
   * Side the sticky image sits on. Defaults to `left` — the editorial
   * "image leads, story follows" reading order.
   */
  imageSide?: "left" | "right";
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

export default function CtaStickyImageList({
  eyebrow,
  headline,
  subheadline,
  items,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  imageSide = "left",
  tone = "light",
  className,
}: CtaStickyImageListProps) {
  const prefersReducedMotion = useReducedMotion();
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  /* Track which item is closest to the viewport center so the sticky
     image can cross-fade to match. IntersectionObserver fires once per
     scroll-tick — far cheaper than a scroll listener. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the largest intersection ratio that's
        // currently intersecting — that's the item the eye is on.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = Number(
            (visible[0].target as HTMLElement).dataset.itemIndex,
          );
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      },
      {
        // Anchor the trigger band around the vertical center of the
        // viewport — top 40%, bottom 40% margins leave a 20% sweet zone.
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.5, 1],
      },
    );

    itemRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [items.length]);

  const toneClasses =
    tone === "dark"
      ? {
          section: "bg-neutral text-neutral-content",
          divider: "border-neutral-content/15",
          eyebrow: "text-neutral-content/60",
          subheadline: "text-neutral-content/70",
          itemDim: "text-neutral-content/40",
          itemBody: "text-neutral-content/70",
          inlineCta: "text-neutral-content hover:text-primary",
          imageBg: "bg-neutral-content/5",
        }
      : {
          section: "bg-base-100 text-base-content",
          divider: "border-base-content/15",
          eyebrow: "text-base-content/60",
          subheadline: "text-base-content/70",
          itemDim: "text-base-content/40",
          itemBody: "text-base-content/70",
          inlineCta: "text-base-content hover:text-primary",
          imageBg: "bg-base-200",
        };

  const stickyColumnOrder = imageSide === "right" ? "lg:order-2" : "lg:order-1";
  const listColumnOrder = imageSide === "right" ? "lg:order-1" : "lg:order-2";

  return (
    <section
      className={cn(
        "relative isolate w-full py-12 md:py-16 lg:py-24",
        toneClasses.section,
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header — full-width above the split */}
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

        {/* Two-column split — sticky image + scrolling list */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Sticky image column. On mobile this becomes a normal in-flow
               block at the top; on lg+ it sticks to the viewport top so it
               stays visible while the right column scrolls past. */}
          <div
            className={cn(
              "relative lg:col-span-5 xl:col-span-5",
              stickyColumnOrder,
            )}
          >
            <div className="lg:sticky lg:top-24">
              <div
                className={cn(
                  "relative w-full overflow-hidden rounded-2xl",
                  toneClasses.imageBg,
                )}
                style={{ aspectRatio: "4 / 5" }}
              >
                <AnimatePresence initial={false} mode="sync">
                  <motion.img
                    key={items[activeIndex]?.image ?? "empty"}
                    src={items[activeIndex]?.image}
                    alt={items[activeIndex]?.imageAlt ?? ""}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 0, scale: 1.04 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.98 }
                    }
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </AnimatePresence>

                {/* Active-index pill — small typographic anchor that ties
                     the image to whichever row is currently being read. */}
                <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 font-mono text-xs tabular-nums text-white backdrop-blur-sm">
                  <span>
                    {items[activeIndex]?.index ?? formatIndex(activeIndex)}
                  </span>
                  <span className="opacity-50">/</span>
                  <span className="opacity-70">
                    {String(items.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling list of CTA items. */}
          <ol
            className={cn(
              "lg:col-span-7 xl:col-span-7",
              listColumnOrder,
              "flex flex-col",
            )}
          >
            {items.map((item, i) => {
              const indexLabel = item.index ?? formatIndex(i);
              const isActive = i === activeIndex;
              const isFirst = i === 0;

              return (
                <li
                  key={`${item.title}-${i}`}
                  ref={(node) => {
                    itemRefs.current[i] = node;
                  }}
                  data-item-index={i}
                  className={cn(
                    "relative flex flex-col gap-4 py-10 md:py-14 lg:py-16",
                    !isFirst && "border-t",
                    !isFirst && toneClasses.divider,
                  )}
                >
                  {/* Index + eyebrow row */}
                  <div className="flex items-baseline gap-4">
                    <motion.span
                      animate={{
                        opacity: isActive ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={cn(
                        "font-mono text-xs tabular-nums tracking-widest",
                        isActive ? "text-primary" : toneClasses.itemDim,
                      )}
                    >
                      {indexLabel}
                    </motion.span>
                    {item.eyebrow && (
                      <span
                        className={cn(
                          "text-xs font-semibold uppercase tracking-[0.2em]",
                          toneClasses.eyebrow,
                        )}
                      >
                        {item.eyebrow}
                      </span>
                    )}
                  </div>

                  {/* Title — animates a subtle weight/scale shift when active. */}
                  <motion.h3
                    animate={
                      prefersReducedMotion ? undefined : { x: isActive ? 4 : 0 }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 26,
                    }}
                    className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
                  >
                    {item.title}
                  </motion.h3>

                  {/* Description */}
                  <p
                    className={cn(
                      "max-w-xl text-base leading-relaxed md:text-lg",
                      toneClasses.itemBody,
                    )}
                  >
                    {item.description}
                  </p>

                  {/* Per-item inline CTA */}
                  {item.ctaText && (
                    <a
                      href={item.ctaUrl ?? "#"}
                      className={cn(
                        "group mt-1 inline-flex items-center gap-2 self-start text-sm font-medium underline-offset-4 transition-colors duration-200 hover:underline",
                        toneClasses.inlineCta,
                      )}
                    >
                      <span>{item.ctaText}</span>
                      <FiArrowUpRight
                        className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  )}

                  {/* Mobile-only inline image — on lg+ the sticky column
                       carries the image; below lg the column collapses, so
                       each item carries its own image inline. */}
                  <div
                    className={cn(
                      "relative mt-2 w-full overflow-hidden rounded-xl lg:hidden",
                      toneClasses.imageBg,
                    )}
                    style={{ aspectRatio: "4 / 3" }}
                  >
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Footer CTA — sits below the split, full-width. */}
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
