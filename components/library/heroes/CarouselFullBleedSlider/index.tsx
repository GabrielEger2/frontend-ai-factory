"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiPause, FiPlay } from "react-icons/fi";
import { cn } from "@lib/utils";
import { buttonStyles } from "@ui/button";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CarouselFullBleedSliderItem {
  /** Background image URL */
  image: string;
  /** Accessible alt text */
  imageAlt: string;
  /** Optional eyebrow / category label rendered above the headline */
  eyebrow?: string;
  /** Headline overlaid on the image */
  headline?: string;
  /** Supporting paragraph beneath the headline */
  description?: string;
  /** Optional CTA label */
  ctaText?: string;
  /** Optional CTA href */
  ctaUrl?: string;
}

export interface CarouselFullBleedSliderProps {
  /** Slides — typically 3–6 reads best */
  items?: CarouselFullBleedSliderItem[];
  /** Where the caption block sits inside the slide. Defaults to "bottom-left". */
  captionAlignment?: "bottom-left" | "bottom-center" | "center-left" | "center";
  /** Section height behavior. "tall" = 80vh (recommended), "full" = 100dvh, "short" = 60vh */
  height?: "short" | "tall" | "full";
  /** Auto-advance interval in milliseconds. Set to 0 to disable. Defaults to 7000. */
  autoAdvanceMs?: number;
  /** Show prev/next arrow buttons. Defaults to true. */
  showArrows?: boolean;
  /** Show pagination dots beneath the captions. Defaults to true. */
  showDots?: boolean;
  /** Show a play/pause toggle for auto-advance. Defaults to true when autoAdvanceMs > 0. */
  showPlayPause?: boolean;
  /** Minimum drag distance (px) to advance. Defaults to 60. */
  dragBuffer?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS: CarouselFullBleedSliderItem[] = [
  {
    image: "https://picsum.photos/seed/fullbleed-summit/1920/1080",
    imageAlt: "Aerial photograph of a snow-capped mountain range at sunrise",
    eyebrow: "Field notebook · 02",
    headline: "Above the cloud line, before the city wakes",
    description:
      "A four-day traverse across the Cordillera Blanca with a pack of mostly the wrong things. We came back with seventeen hours of footage and a calmer plan.",
    ctaText: "Read the notebook",
    ctaUrl: "#notebook-02",
  },
  {
    image: "https://picsum.photos/seed/fullbleed-coast/1920/1080",
    imageAlt: "Coastal cliffs with a winding road photographed from above",
    eyebrow: "Field notebook · 03",
    headline: "The road that nearly didn't happen",
    description:
      "Fourteen permits, two reroutes, and a single afternoon of clean weather. The Pan-American detour through Cabo Polonio earned its place on the wall.",
    ctaText: "See the route",
    ctaUrl: "#notebook-03",
  },
  {
    image: "https://picsum.photos/seed/fullbleed-forest/1920/1080",
    imageAlt: "Misty forest canopy seen from above, light breaking through",
    eyebrow: "Field notebook · 04",
    headline: "Three weeks in the canopy at Iracambi",
    description:
      "Mapping bromeliad density across 12 hectares of secondary forest with the Iracambi research station. Slow work, surprisingly good coffee.",
    ctaText: "Open the dataset",
    ctaUrl: "#notebook-04",
  },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const HEIGHT_CLASS: Record<
  NonNullable<CarouselFullBleedSliderProps["height"]>,
  string
> = {
  short: "h-[60vh] min-h-[420px]",
  tall: "h-[80vh] min-h-[520px]",
  full: "h-[100dvh] min-h-[560px]",
};

const ALIGN_WRAPPER: Record<
  NonNullable<CarouselFullBleedSliderProps["captionAlignment"]>,
  string
> = {
  "bottom-left": "items-end justify-start text-left",
  "bottom-center": "items-end justify-center text-center",
  "center-left": "items-center justify-start text-left",
  center: "items-center justify-center text-center",
};

const SLIDE_TRANSITION = {
  type: "spring" as const,
  stiffness: 220,
  damping: 32,
  mass: 0.8,
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface SlideMediaProps {
  item: CarouselFullBleedSliderItem;
  index: number;
  direction: 1 | -1;
  shouldReduceMotion: boolean | null;
}

function SlideMedia({
  item,
  index,
  direction,
  shouldReduceMotion,
}: SlideMediaProps) {
  const safe = useSafeImageSrc(
    item.image,
    `carousel-full-bleed-slider-${index}`,
    1920,
    1080,
  );

  return (
    <AnimatePresence custom={direction} initial={false} mode="popLayout">
      <motion.div
        key={index}
        custom={direction}
        initial={
          shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.06 }
        }
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { ...SLIDE_TRANSITION, opacity: { duration: 0.45 } }
        }
        className="absolute inset-0 will-change-transform"
      >
        <img
          src={safe.src}
          onError={safe.onError}
          alt={item.imageAlt}
          loading={index === 0 ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {/* Tonal overlay for caption legibility — no pure black, uses neutral token */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral/80 via-neutral/35 to-neutral/15" />
      </motion.div>
    </AnimatePresence>
  );
}

interface CaptionProps {
  item: CarouselFullBleedSliderItem;
  index: number;
  alignment: NonNullable<CarouselFullBleedSliderProps["captionAlignment"]>;
  shouldReduceMotion: boolean | null;
}

function Caption({ item, index, alignment, shouldReduceMotion }: CaptionProps) {
  const isCenter = alignment === "center" || alignment === "bottom-center";
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={index}
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
        }
        className={cn(
          "flex max-w-2xl flex-col gap-4 text-neutral-content",
          isCenter && "items-center",
        )}
      >
        {item.eyebrow && (
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-content/75">
            {item.eyebrow}
          </p>
        )}
        {item.headline && (
          <h2 className="text-balance text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {item.headline}
          </h2>
        )}
        {item.description && (
          <p className="max-w-[55ch] text-base leading-relaxed text-neutral-content/85 sm:text-lg">
            {item.description}
          </p>
        )}
        {item.ctaText && item.ctaUrl && (
          <a
            href={item.ctaUrl}
            className={cn(
              buttonStyles({ variant: "primary", size: "lg" }),
              "mt-2 self-start",
              isCenter && "self-center",
            )}
          >
            {item.ctaText}
          </a>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

interface ArrowProps {
  direction: "prev" | "next";
  onClick: () => void;
}

function Arrow({ direction, onClick }: ArrowProps) {
  const Icon = direction === "prev" ? FiArrowLeft : FiArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      className={cn(
        "pointer-events-auto grid h-12 w-12 place-content-center rounded-full",
        "bg-neutral-content/10 text-neutral-content backdrop-blur-md",
        "ring-1 ring-neutral-content/20 transition-all duration-200",
        "hover:bg-neutral-content/20 hover:ring-neutral-content/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral",
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

interface DotsProps {
  total: number;
  active: number;
  onSelect: (index: number) => void;
  progressKey: number;
  autoAdvanceMs: number;
  paused: boolean;
  shouldReduceMotion: boolean | null;
}

function Dots({
  total,
  active,
  onSelect,
  progressKey,
  autoAdvanceMs,
  paused,
  shouldReduceMotion,
}: DotsProps) {
  return (
    <div
      className="flex items-center gap-2"
      role="tablist"
      aria-label="Slide navigation"
    >
      {Array.from({ length: total }, (_, idx) => {
        const isActive = idx === active;
        return (
          <button
            key={idx}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => onSelect(idx)}
            className={cn(
              "group relative h-2 overflow-hidden rounded-full transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral",
              isActive
                ? "w-12 bg-neutral-content/25"
                : "w-2 bg-neutral-content/40 hover:bg-neutral-content/60",
            )}
          >
            {isActive && autoAdvanceMs > 0 && !shouldReduceMotion && (
              <motion.span
                key={progressKey}
                initial={{ width: "0%" }}
                animate={{ width: paused ? "0%" : "100%" }}
                transition={{
                  duration: autoAdvanceMs / 1000,
                  ease: "linear",
                }}
                className="absolute inset-y-0 left-0 bg-neutral-content"
              />
            )}
            {isActive && (autoAdvanceMs === 0 || shouldReduceMotion) && (
              <span className="absolute inset-0 bg-neutral-content" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CarouselFullBleedSlider -- an edge-to-edge image rotator with a
 * caption block (eyebrow, headline, description, CTA) overlaid on each
 * slide. Auto-advances by default with a play/pause toggle, supports
 * keyboard arrows, drag/swipe, and pagination dots that double as a
 * progress bar for the active slide.
 */
export default function CarouselFullBleedSlider({
  items = DEFAULT_ITEMS,
  captionAlignment = "bottom-left",
  height = "tall",
  autoAdvanceMs = 7000,
  showArrows = true,
  showDots = true,
  showPlayPause,
  dragBuffer = 60,
  className,
}: CarouselFullBleedSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const dragX = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const total = items.length;
  const safeIndex = useMemo(
    () => Math.min(Math.max(activeIndex, 0), Math.max(total - 1, 0)),
    [activeIndex, total],
  );

  const goTo = useCallback(
    (next: number) => {
      const clamped = ((next % total) + total) % total;
      setDirection(
        clamped > safeIndex || (safeIndex === total - 1 && clamped === 0)
          ? 1
          : -1,
      );
      setActiveIndex(clamped);
      setProgressKey((k) => k + 1);
    },
    [safeIndex, total],
  );

  const next = useCallback(() => goTo(safeIndex + 1), [goTo, safeIndex]);
  const prev = useCallback(() => goTo(safeIndex - 1), [goTo, safeIndex]);

  /* Auto-advance — pauses on drag / hover / explicit pause */
  useEffect(() => {
    if (autoAdvanceMs <= 0 || paused || total <= 1 || shouldReduceMotion)
      return;
    const id = setTimeout(() => {
      if (dragX.get() === 0) next();
    }, autoAdvanceMs);
    return () => clearTimeout(id);
  }, [
    autoAdvanceMs,
    paused,
    total,
    next,
    dragX,
    shouldReduceMotion,
    safeIndex,
  ]);

  /* Keyboard navigation */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    },
    [next, prev],
  );

  const onDragEnd = useCallback(() => {
    const x = dragX.get();
    if (x <= -dragBuffer) next();
    else if (x >= dragBuffer) prev();
  }, [dragX, dragBuffer, next, prev]);

  if (total === 0) return null;

  const activeItem = items[safeIndex];
  const showPause =
    showPlayPause ?? (autoAdvanceMs > 0 && total > 1 && !shouldReduceMotion);

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={activeItem.headline ?? "Featured slider"}
      className={cn(
        "relative w-full overflow-hidden bg-neutral text-neutral-content",
        "focus-visible:outline-none",
        HEIGHT_CLASS[height],
        className,
      )}
    >
      {/* Drag layer covers the whole stage */}
      <motion.div
        drag={total > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        style={{ x: dragX }}
        onDragEnd={onDragEnd}
        className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
      >
        <SlideMedia
          item={activeItem}
          index={safeIndex}
          direction={direction}
          shouldReduceMotion={shouldReduceMotion}
        />
      </motion.div>

      {/* Caption layer */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 flex px-6 py-12 sm:px-10 md:px-16 md:py-16 lg:px-24 lg:py-20",
          ALIGN_WRAPPER[captionAlignment],
        )}
      >
        <div className="pointer-events-auto">
          <Caption
            item={activeItem}
            index={safeIndex}
            alignment={captionAlignment}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>
      </div>

      {/* Arrows — vertically centered, hidden on very small screens to free space */}
      {showArrows && total > 1 && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 hidden items-center justify-between px-4 sm:flex md:px-8">
          <Arrow direction="prev" onClick={prev} />
          <Arrow direction="next" onClick={next} />
        </div>
      )}

      {/* Bottom control bar — counter, dots, pause */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex items-center justify-between gap-4 px-4 sm:bottom-6 sm:px-8">
        <span className="pointer-events-auto rounded-full bg-neutral-content/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-content/75 backdrop-blur-md">
          {String(safeIndex + 1).padStart(2, "0")}{" "}
          <span className="text-neutral-content/40">/</span>{" "}
          {String(total).padStart(2, "0")}
        </span>

        {showDots && total > 1 && (
          <div className="pointer-events-auto">
            <Dots
              total={total}
              active={safeIndex}
              onSelect={goTo}
              progressKey={progressKey}
              autoAdvanceMs={autoAdvanceMs}
              paused={paused}
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>
        )}

        {showPause ? (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Resume auto-advance" : "Pause auto-advance"}
            aria-pressed={paused}
            className={cn(
              "pointer-events-auto grid h-9 w-9 place-content-center rounded-full",
              "bg-neutral-content/10 text-neutral-content backdrop-blur-md",
              "ring-1 ring-neutral-content/20 transition-all duration-200",
              "hover:bg-neutral-content/20 hover:ring-neutral-content/40",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral",
            )}
          >
            {paused ? (
              <FiPlay className="h-3.5 w-3.5" />
            ) : (
              <FiPause className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span aria-hidden="true" className="h-9 w-9" />
        )}
      </div>
    </section>
  );
}
