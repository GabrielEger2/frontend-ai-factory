"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@lib/utils";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CarouselBeforeAfterItem {
  /** Caption rendered above each comparison */
  title: string;
  /** Optional supporting line under the title */
  description?: string;
  /** "Before" image URL */
  beforeImage: string;
  /** Accessible alt for the before image */
  beforeAlt: string;
  /** "After" image URL */
  afterImage: string;
  /** Accessible alt for the after image */
  afterAlt: string;
  /** Optional small label rendered on the before/after pills */
  beforeLabel?: string;
  afterLabel?: string;
}

export interface CarouselBeforeAfterProps {
  /** Optional eyebrow */
  eyebrow?: string;
  /** Optional section headline */
  headline?: string;
  /** Optional supporting paragraph */
  subheadline?: string;
  /** Up to 6 before/after pairs */
  items?: CarouselBeforeAfterItem[];
  /** Initial slider position (0-100). Defaults to 50 */
  initialPosition?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS: CarouselBeforeAfterItem[] = [
  {
    title: "Brownstone façade restoration, Beacon Hill",
    description:
      "Original 1890 lime mortar repointed and copper detail re-soldered. Eight-week scope, no ownership change.",
    beforeImage:
      "https://picsum.photos/seed/beforeafter-brownstone-before/1280/800",
    beforeAlt: "Brownstone façade before restoration",
    afterImage:
      "https://picsum.photos/seed/beforeafter-brownstone-after/1280/800",
    afterAlt: "Brownstone façade after restoration",
  },
  {
    title: "Loft conversion, Vila Mariana",
    description:
      "Two-bedroom apartment opened into a single floor-through with a relocated kitchen and a new west-facing reading nook.",
    beforeImage: "https://picsum.photos/seed/beforeafter-loft-before/1280/800",
    beforeAlt: "Loft interior before conversion",
    afterImage: "https://picsum.photos/seed/beforeafter-loft-after/1280/800",
    afterAlt: "Loft interior after conversion",
  },
  {
    title: "Storefront identity refresh, Pinheiros",
    description:
      "New signage, awning, and a four-color paint palette pulled from the building's original 1928 tile work.",
    beforeImage:
      "https://picsum.photos/seed/beforeafter-storefront-before/1280/800",
    beforeAlt: "Storefront before redesign",
    afterImage:
      "https://picsum.photos/seed/beforeafter-storefront-after/1280/800",
    afterAlt: "Storefront after redesign",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-component — single before/after slide                          */
/* ------------------------------------------------------------------ */

function BeforeAfterSlide({
  item,
  initialPosition,
  index,
}: {
  item: CarouselBeforeAfterItem;
  initialPosition: number;
  index: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const beforeImg = useSafeImageSrc(
    item.beforeImage,
    `beforeafter-${index}-before`,
    1280,
    800,
  );
  const afterImg = useSafeImageSrc(
    item.afterImage,
    `beforeafter-${index}-after`,
    1280,
    800,
  );

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      setIsDragging(true);
      updateFromClientX(e.clientX);
    },
    [updateFromClientX],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      updateFromClientX(e.clientX);
    },
    [isDragging, updateFromClientX],
  );

  const onPointerUp = useCallback(() => setIsDragging(false), []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - 4));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + 4));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPosition(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPosition(100);
    }
  }, []);

  return (
    <figure className="flex flex-col gap-4">
      <div
        ref={containerRef}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-base-200 ring-1 ring-base-300 select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* "After" image — full bleed underneath */}
        <img
          {...afterImg}
          alt={item.afterAlt}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {/* "Before" image — clipped from the left, sized to full container */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            {...beforeImg}
            alt={item.beforeAlt}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        </div>

        {/* Pills */}
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center rounded-full bg-base-content/75 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-base-100 backdrop-blur">
          {item.beforeLabel ?? "Before"}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary-content backdrop-blur">
          {item.afterLabel ?? "After"}
        </span>

        {/* Slider track */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-base-100/85"
          style={{ left: `${position}%` }}
        />
        {/* Slider handle (also keyboard target) */}
        <div
          role="slider"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-label="Reveal slider — drag to compare before and after"
          onKeyDown={onKeyDown}
          className={cn(
            "absolute top-1/2 z-10 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-base-100 text-base-content shadow-lg ring-1 ring-base-300 transition-transform duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100",
            isDragging ? "scale-105" : "hover:scale-105",
          )}
          style={{ left: `${position}%` }}
        >
          <FiChevronLeft className="h-4 w-4" aria-hidden="true" />
          <FiChevronRight className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      <figcaption className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-base-content md:text-xl">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-sm text-base-content/65 md:text-base">
            {item.description}
          </p>
        )}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CarouselBeforeAfter -- a horizontally-scrolling carousel of
 * before/after image comparison sliders. Each card is a
 * pointer-draggable reveal slider with keyboard support; the row
 * scrolls horizontally on mobile and behaves as a snap track on
 * desktop. Useful for restoration, redesign, and physical-result
 * portfolios.
 */
export default function CarouselBeforeAfter({
  eyebrow,
  headline,
  subheadline,
  items = DEFAULT_ITEMS,
  initialPosition = 50,
  className,
}: CarouselBeforeAfterProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeItems = items.length > 0 ? items.slice(0, 6) : DEFAULT_ITEMS;
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollToIndex = useCallback((idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[idx] as HTMLElement | undefined;
    if (!child) return;
    track.scrollTo({
      left: child.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    });
  }, []);

  /* Update active index based on which slide is centered */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let nearestDist = Infinity;
      Array.from(track.children).forEach((child, idx) => {
        const el = child as HTMLElement;
        const childCenter = el.offsetLeft + el.clientWidth / 2;
        const dist = Math.abs(center - childCenter);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = idx;
        }
      });
      setActiveIndex(nearest);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {(eyebrow || headline || subheadline) && (
          <motion.div
            className="mb-8 max-w-2xl md:mb-12"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                {eyebrow}
              </span>
            )}
            {headline && (
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-base-content md:text-4xl">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="mt-3 text-base text-base-content/65 md:text-lg">
                {subheadline}
              </p>
            )}
          </motion.div>
        )}

        {/* Snap track */}
        <div className="-mx-4 px-4 md:-mx-8 md:px-8">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollPaddingLeft: "1rem", scrollPaddingRight: "1rem" }}
          >
            {safeItems.map((item, idx) => (
              <div
                key={idx}
                className="w-[88%] shrink-0 snap-start sm:w-[75%] lg:w-[68%]"
              >
                <BeforeAfterSlide
                  item={item}
                  initialPosition={initialPosition}
                  index={idx}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination + nav */}
        {safeItems.length > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Slides">
              {safeItems.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeIndex}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => scrollToIndex(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-200",
                    idx === activeIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-base-300 hover:bg-base-content/40",
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-base-200 text-base-content transition-colors hover:bg-base-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100 disabled:opacity-40"
                disabled={activeIndex === 0}
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() =>
                  scrollToIndex(Math.min(safeItems.length - 1, activeIndex + 1))
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-base-200 text-base-content transition-colors hover:bg-base-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100 disabled:opacity-40"
                disabled={activeIndex === safeItems.length - 1}
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
