"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import {
  Button,
  CtaButton,
  type CtaVariant,
  type ColorScheme,
} from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CarouselBeforeAfterNote {
  /** Short label — e.g. "Scope", "Materials", "Outcome" */
  label: string;
  /** Single-line value — keep tight, this renders inline */
  value: string;
}

export interface CarouselBeforeAfterItem {
  /** Caption rendered above each comparison */
  title: string;
  /** Optional supporting line under the title */
  description?: string;
  /** Optional meta line above the title — e.g. "Beacon Hill, MA · 2024" */
  meta?: string;
  /** Optional structured chapter notes — definition-list rendered below the description */
  notes?: CarouselBeforeAfterNote[];
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

export interface BeforeAfterMetric {
  /** The number itself — keep it organic (e.g. "47.2%", "3,847") */
  value: string;
  /** One-line context for the number */
  label: string;
}

export interface BeforeAfterMeta {
  /** Mono-caps label — e.g. "Client", "Scope", "Year" */
  label: string;
  /** Plain-weight value */
  value: string;
}

export interface BeforeAfterPullQuote {
  /** The quote itself, no surrounding punctuation */
  quote: string;
  /** Person or organisation it is attributed to */
  attribution: string;
  /** Optional secondary attribution line — role, location, etc. */
  attributionMeta?: string;
}

export interface CarouselBeforeAfterProps {
  /** Optional eyebrow */
  eyebrow?: string;
  /** Optional section headline */
  headline?: string;
  /** Optional supporting paragraph */
  subheadline?: string;
  /** Optional section-level meta strip — renders as a 4-up dl band under the header */
  meta?: BeforeAfterMeta[];
  /** Up to 6 before/after pairs */
  items?: CarouselBeforeAfterItem[];
  /** Initial slider position (0-100). Defaults to 50 */
  initialPosition?: number;
  /** Optional pull-quote — renders between the carousel and the metrics band */
  pullQuote?: BeforeAfterPullQuote;
  /** Optional outcome metrics rendered as a dark band below the carousel */
  metrics?: BeforeAfterMetric[];
  /** Optional closing CTA — e.g. "See the full case study" */
  ctaText?: string;
  ctaUrl?: string;
  ctaVariant?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS: CarouselBeforeAfterItem[] = [
  {
    title: "Brownstone façade restoration, Beacon Hill",
    description:
      "Original 1890 lime mortar repointed and copper detail re-soldered. Eight-week scope, no ownership change. The cornice was rebuilt in matching pressed copper, sourced from a salvage yard in Quincy.",
    meta: "Beacon Hill, MA · 2024",
    notes: [
      { label: "Scope", value: "Façade · cornice · entry" },
      { label: "Crew", value: "4 masons · 2 metalworkers" },
      { label: "Outcome", value: "Historic-district approval, first pass" },
    ],
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
      "Two-bedroom apartment opened into a single floor-through with a relocated kitchen and a new west-facing reading nook. Original quaresmeira flooring sanded back and re-oiled in place.",
    meta: "São Paulo, BR · 2023",
    notes: [
      { label: "Area", value: "118 m² · single floor" },
      { label: "Walls removed", value: "3 non-load-bearing partitions" },
      { label: "Lead time", value: "11 weeks, occupied" },
    ],
    beforeImage: "https://picsum.photos/seed/beforeafter-loft-before/1280/800",
    beforeAlt: "Loft interior before conversion",
    afterImage: "https://picsum.photos/seed/beforeafter-loft-after/1280/800",
    afterAlt: "Loft interior after conversion",
  },
  {
    title: "Storefront identity refresh, Pinheiros",
    description:
      "New signage, awning, and a four-color paint palette pulled from the building's original 1928 tile work. The hand-painted sign is by Estúdio Baião, finished on site over two mornings.",
    meta: "São Paulo, BR · 2024",
    notes: [
      { label: "Surfaces", value: "Awning · sign · door · window frames" },
      { label: "Palette source", value: "1928 entrance tile" },
      { label: "Install window", value: "One weekend, store open Monday" },
    ],
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
  totalCount,
  isFirst,
}: {
  item: CarouselBeforeAfterItem;
  initialPosition: number;
  index: number;
  totalCount: number;
  isFirst: boolean;
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

  /* eager-load slide 0 for LCP, lazy-load the rest */
  const imgLoading = isFirst ? "eager" : "lazy";

  /* meta line — slide index always rendered, optional location/year suffix */
  const indexLabel = `${String(index + 1).padStart(2, "0")} / ${String(totalCount).padStart(2, "0")}`;

  return (
    <figure className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
      <div className="lg:col-span-8">
        <div
          ref={containerRef}
          className="relative aspect-[16/10] w-full cursor-ew-resize overflow-hidden rounded-3xl bg-base-200 ring-1 ring-base-300 select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* "After" image — full bleed underneath */}
          <img
            src={afterImg.src}
            onError={afterImg.onError}
            alt={item.afterAlt}
            loading={imgLoading}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          {/* "Before" image — clipped from the left, sized to full container */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <img
              src={beforeImg.src}
              onError={beforeImg.onError}
              alt={item.beforeAlt}
              loading={imgLoading}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
          </div>

          {/* Pills */}
          <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center rounded-full bg-base-content/75 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-base-100 backdrop-blur">
            {item.beforeLabel ?? "Before"}
          </span>
          <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center rounded-full bg-primary px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-content backdrop-blur">
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
      </div>

      <figcaption className="flex flex-col gap-4 lg:col-span-4 lg:pt-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-base-content/55">
          {indexLabel}
          {item.meta ? ` · ${item.meta}` : ""}
        </span>
        <h3 className="text-balance text-xl font-semibold leading-tight tracking-tight text-base-content md:text-2xl lg:text-3xl">
          {item.title}
        </h3>
        {item.description && (
          <p className="max-w-[55ch] text-base leading-relaxed text-base-content/65 md:text-lg">
            {item.description}
          </p>
        )}
        {item.notes && item.notes.length > 0 && (
          <dl className="mt-2 flex flex-col divide-y divide-base-300 border-t border-base-300">
            {item.notes.map((note, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-base-content/55 sm:w-28 sm:shrink-0">
                  {note.label}
                </dt>
                <dd className="text-sm leading-relaxed text-base-content md:text-base">
                  {note.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CarouselBeforeAfter — a button-navigated carousel of before/after
 * image comparison sliders. Each slide is a pointer-draggable reveal
 * slider with keyboard support, anchored by an editorial meta strip
 * (slide index + optional location/year) and an optional structured
 * notes block below the description. The section can be framed by a
 * project-level meta band (client / scope / year / team) above and
 * closed by a pull-quote, an outcome metrics band, and a CTA — useful
 * for restoration, redesign, and physical-result portfolios that need
 * the depth of a long-form case study, not the footprint of a widget.
 */
export default function CarouselBeforeAfter({
  eyebrow,
  headline,
  subheadline,
  meta,
  items = DEFAULT_ITEMS,
  initialPosition = 50,
  pullQuote,
  metrics,
  ctaText,
  ctaUrl,
  ctaVariant = "default",
  ctaColorScheme = "neutral",
  className,
}: CarouselBeforeAfterProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeItems = items.length > 0 ? items.slice(0, 6) : DEFAULT_ITEMS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(safeItems.length - 1, next));
      if (clamped === activeIndex) return;
      setDirection(clamped > activeIndex ? 1 : -1);
      setActiveIndex(clamped);
    },
    [activeIndex, safeItems.length],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);

  const activeItem = safeItems[activeIndex];

  const variants = {
    enter: (dir: 1 | -1) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir * 24,
    }),
    center: { opacity: 1, x: 0 },
    exit: (dir: 1 | -1) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir * -24,
    }),
  };

  return (
    <section
      className={cn("w-full bg-base-100 py-16 md:py-24 lg:py-32", className)}
      aria-roledescription="carousel"
      aria-label={headline ?? "Before and after gallery"}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {(eyebrow || headline || subheadline) && (
          <motion.div
            className="mb-10 flex max-w-3xl flex-col md:mb-14"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {eyebrow && (
              <motion.span
                variants={fadeUp}
                className="font-mono text-xs uppercase tracking-[0.25em] text-primary"
              >
                {eyebrow}
              </motion.span>
            )}
            {headline && (
              <motion.h2
                variants={fadeUp}
                className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-base-content sm:text-4xl md:text-5xl lg:text-6xl"
              >
                {headline}
              </motion.h2>
            )}
            {subheadline && (
              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-[60ch] text-base leading-relaxed text-base-content/65 md:text-lg"
              >
                {subheadline}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Section-level meta strip — frames the whole section as a project */}
        {meta && meta.length > 0 && (
          <motion.dl
            className="mb-12 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-base-300 py-6 md:mb-16 md:grid-cols-4"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {meta.map((m, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex flex-col gap-1"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-base-content/55">
                  {m.label}
                </dt>
                <dd className="text-base font-medium text-base-content">
                  {m.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        )}

        {/* Single-slide stage */}
        <div
          role="group"
          aria-roledescription="slide"
          aria-label={`${activeIndex + 1} of ${safeItems.length}: ${activeItem.title}`}
          className="relative"
        >
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                ease: "easeOut",
              }}
            >
              <BeforeAfterSlide
                item={activeItem}
                initialPosition={initialPosition}
                index={activeIndex}
                totalCount={safeItems.length}
                isFirst={activeIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination + nav */}
        {safeItems.length > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-base-300 pt-6 md:mt-10 md:pt-8">
            <div
              className="flex flex-wrap items-center gap-1"
              role="group"
              aria-label="Slides"
            >
              {safeItems.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={idx === activeIndex ? "true" : undefined}
                  onClick={() => goTo(idx)}
                  className={cn(
                    "group inline-flex h-11 min-w-11 items-center justify-center px-2",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100 rounded-full",
                  )}
                >
                  <span
                    className={cn(
                      "h-2 rounded-full transition-all duration-200",
                      idx === activeIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-base-300 group-hover:bg-base-content/40",
                    )}
                  />
                </button>
              ))}
              <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.22em] text-base-content/55">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(safeItems.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Previous slide"
                onClick={goPrev}
                disabled={activeIndex === 0}
                className="bg-base-200 hover:bg-base-300"
              >
                <FiChevronLeft />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Next slide"
                onClick={goNext}
                disabled={activeIndex === safeItems.length - 1}
                className="bg-base-200 hover:bg-base-300"
              >
                <FiChevronRight />
              </Button>
            </div>
          </div>
        )}

        {/* Pull quote — bridges the carousel to the metrics/CTA close */}
        {pullQuote && (
          <motion.figure
            className="mt-16 max-w-4xl border-l-2 border-primary pl-6 md:mt-24 md:pl-10"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <blockquote className="text-balance font-serif text-2xl leading-snug text-base-content md:text-3xl lg:text-4xl">
              &ldquo;{pullQuote.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex flex-col gap-1">
              <span className="text-sm font-medium text-base-content md:text-base">
                {pullQuote.attribution}
              </span>
              {pullQuote.attributionMeta && (
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-base-content/55">
                  {pullQuote.attributionMeta}
                </span>
              )}
            </figcaption>
          </motion.figure>
        )}

        {/* Outcome metrics band */}
        {metrics && metrics.length > 0 && (
          <motion.div
            className={cn(
              "grid grid-cols-2 gap-6 rounded-3xl bg-base-content px-6 py-10 text-base-100 md:grid-cols-4 md:px-12 md:py-14",
              pullQuote ? "mt-12 md:mt-16" : "mt-16 md:mt-24",
            )}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {metrics.map((m, i) => (
              <div key={i} className="flex flex-col items-start gap-1">
                <span className="font-mono text-3xl font-semibold tracking-tight md:text-5xl">
                  {m.value}
                </span>
                <span className="text-xs leading-snug text-base-100/70 md:text-sm">
                  {m.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Closing CTA */}
        {ctaText && (
          <div className="mt-12 flex justify-start md:mt-16">
            <CtaButton
              variant={ctaVariant}
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
