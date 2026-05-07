"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiZoomIn } from "react-icons/fi";
import { cn } from "@lib/utils";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CarouselThumbnailNavItem {
  /** Full-resolution image URL */
  image: string;
  /** Accessible alt text used on both the main image and the thumbnail */
  imageAlt: string;
  /** Optional smaller thumbnail URL — falls back to `image` if omitted */
  thumbnail?: string;
  /** Optional caption rendered under the main image */
  caption?: string;
}

export interface CarouselThumbnailNavProps {
  /** Optional eyebrow displayed above the headline */
  eyebrow?: string;
  /** Optional section headline */
  headline?: string;
  /** Optional supporting paragraph below the headline */
  description?: string;
  /** Items to display — typically 3–8 reads best */
  items?: CarouselThumbnailNavItem[];
  /** Aspect ratio of the main image. Defaults to "4:3". */
  aspectRatio?: "1:1" | "4:3" | "3:2" | "16:9";
  /** Show prev/next arrow buttons over the main image. Defaults to true. */
  showArrows?: boolean;
  /** Show a small zoom icon in the corner of the main image. Defaults to false. */
  zoomHint?: boolean;
  /** Minimum drag distance (px) on the main image to advance. Defaults to 60. */
  dragBuffer?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS: CarouselThumbnailNavItem[] = [
  {
    image: "https://picsum.photos/seed/thumbnav-front/1280/960",
    imageAlt: "Front view of the product on a neutral backdrop",
    caption: "Front view",
  },
  {
    image: "https://picsum.photos/seed/thumbnav-side/1280/960",
    imageAlt: "Side profile showing the silhouette and stitching",
    caption: "Side profile",
  },
  {
    image: "https://picsum.photos/seed/thumbnav-detail/1280/960",
    imageAlt: "Macro shot of the material weave",
    caption: "Material detail",
  },
  {
    image: "https://picsum.photos/seed/thumbnav-styled/1280/960",
    imageAlt: "Styled in context on a wooden table",
    caption: "Styled in context",
  },
];

const ASPECT_CLASS: Record<
  NonNullable<CarouselThumbnailNavProps["aspectRatio"]>,
  string
> = {
  "1:1": "aspect-square",
  "4:3": "aspect-[4/3]",
  "3:2": "aspect-[3/2]",
  "16:9": "aspect-video",
};

const SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 32,
  mass: 0.6,
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface MainStageProps {
  item: CarouselThumbnailNavItem;
  index: number;
  direction: 1 | -1;
  aspectRatio: NonNullable<CarouselThumbnailNavProps["aspectRatio"]>;
  shouldReduceMotion: boolean | null;
}

function MainStage({
  item,
  index,
  direction,
  aspectRatio,
  shouldReduceMotion,
}: MainStageProps) {
  const safe = useSafeImageSrc(
    item.image,
    `carousel-thumbnail-nav-main-${index}`,
    1280,
    960,
  );

  const variants = {
    enter: (dir: 1 | -1) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir * 24,
      scale: shouldReduceMotion ? 1 : 1.01,
    }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: 1 | -1) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir * -24,
      scale: shouldReduceMotion ? 1 : 0.99,
    }),
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-base-200 ring-1 ring-base-300",
        ASPECT_CLASS[aspectRatio],
      )}
    >
      <AnimatePresence custom={direction} initial={false} mode="popLayout">
        <motion.img
          key={index}
          src={safe.src}
          onError={safe.onError}
          alt={item.imageAlt}
          loading="eager"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={shouldReduceMotion ? { duration: 0 } : SPRING}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </AnimatePresence>
    </div>
  );
}

interface ArrowProps {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}

function ArrowButton({ direction, disabled, onClick }: ArrowProps) {
  const Icon = direction === "prev" ? FiArrowLeft : FiArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous image" : "Next image"}
      className={cn(
        "pointer-events-auto grid h-11 w-11 place-content-center rounded-full",
        "bg-base-100/85 text-base-content backdrop-blur-md",
        "ring-1 ring-base-300 transition-all duration-200",
        "hover:bg-base-100 hover:text-primary hover:ring-primary/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-30",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

interface ThumbProps {
  item: CarouselThumbnailNavItem;
  index: number;
  active: boolean;
  onSelect: (index: number) => void;
}

function Thumbnail({ item, index, active, onSelect }: ThumbProps) {
  const src = item.thumbnail ?? item.image;
  const safe = useSafeImageSrc(
    src,
    `carousel-thumbnail-nav-thumb-${index}`,
    240,
    240,
  );
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`Show image ${index + 1}: ${item.imageAlt}`}
      aria-current={active}
      className={cn(
        "relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-base-200 transition-all duration-200 sm:w-24",
        "ring-1 ring-base-300",
        "hover:ring-primary/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        active && "ring-2 ring-primary",
      )}
    >
      <img
        src={safe.src}
        onError={safe.onError}
        alt=""
        loading="lazy"
        className={cn(
          "h-full w-full object-cover transition-opacity duration-200",
          !active && "opacity-70 hover:opacity-100",
        )}
      />
      {active && (
        <motion.span
          layoutId="thumbnail-nav-active"
          className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-primary"
          transition={SPRING}
        />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CarouselThumbnailNav -- a main-image + thumbnail-strip carousel
 * patterned after e-commerce product viewers. The main stage swaps with
 * a directional spring animation, while the thumbnail row keeps the
 * full set in view and snap-scrolls on overflow. Supports keyboard
 * arrows, drag-to-advance, and a reduced-motion fallback.
 */
export default function CarouselThumbnailNav({
  eyebrow,
  headline,
  description,
  items = DEFAULT_ITEMS,
  aspectRatio = "4:3",
  showArrows = true,
  zoomHint = false,
  dragBuffer = 60,
  className,
}: CarouselThumbnailNavProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const dragX = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const thumbStripRef = useRef<HTMLDivElement>(null);

  const total = items.length;
  const safeIndex = useMemo(
    () => Math.min(Math.max(activeIndex, 0), Math.max(total - 1, 0)),
    [activeIndex, total],
  );

  const goTo = useCallback(
    (next: number) => {
      if (next === safeIndex) return;
      setDirection(next > safeIndex ? 1 : -1);
      setActiveIndex(next);
    },
    [safeIndex],
  );

  const next = useCallback(() => {
    if (safeIndex < total - 1) goTo(safeIndex + 1);
  }, [goTo, safeIndex, total]);

  const prev = useCallback(() => {
    if (safeIndex > 0) goTo(safeIndex - 1);
  }, [goTo, safeIndex]);

  /* Scroll the active thumbnail into view on selection */
  useEffect(() => {
    const el = thumbStripRef.current;
    if (!el) return;
    const child = el.children[safeIndex] as HTMLElement | undefined;
    if (!child) return;
    const childCenter = child.offsetLeft + child.clientWidth / 2;
    const target = childCenter - el.clientWidth / 2;
    el.scrollTo({
      left: Math.max(0, target),
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }, [safeIndex, shouldReduceMotion]);

  /* Keyboard support — only when the stage has focus */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
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

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-20", className)}
      aria-roledescription="carousel"
      aria-label={headline ?? "Image gallery"}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:px-8 lg:gap-10">
        {(eyebrow || headline || description) && (
          <header className="flex max-w-3xl flex-col gap-3">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </p>
            )}
            {headline && (
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-base-content sm:text-4xl md:text-5xl">
                {headline}
              </h2>
            )}
            {description && (
              <p className="max-w-[55ch] text-base leading-relaxed text-base-content/65">
                {description}
              </p>
            )}
          </header>
        )}

        {/* Stage + drag layer */}
        <div
          ref={stageRef}
          tabIndex={0}
          role="group"
          aria-roledescription="slide"
          aria-label={`${safeIndex + 1} of ${total}: ${activeItem.imageAlt}`}
          onKeyDown={handleKeyDown}
          className={cn(
            "relative w-full focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-base-100 rounded-2xl",
          )}
        >
          <motion.div
            drag={total > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            style={{ x: dragX }}
            onDragEnd={onDragEnd}
            className="relative cursor-grab touch-pan-y active:cursor-grabbing"
          >
            <MainStage
              item={activeItem}
              index={safeIndex}
              direction={direction}
              aspectRatio={aspectRatio}
              shouldReduceMotion={shouldReduceMotion}
            />
          </motion.div>

          {/* Counter pill */}
          <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-base-100/85 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-base-content/75 backdrop-blur-md">
            {String(safeIndex + 1).padStart(2, "0")}{" "}
            <span className="text-base-content/40">/</span>{" "}
            {String(total).padStart(2, "0")}
          </div>

          {zoomHint && (
            <div className="pointer-events-none absolute right-4 top-4 grid h-9 w-9 place-content-center rounded-full bg-base-100/85 text-base-content/70 backdrop-blur-md">
              <FiZoomIn className="h-4 w-4" />
            </div>
          )}

          {showArrows && total > 1 && (
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 sm:px-4">
              <ArrowButton
                direction="prev"
                disabled={safeIndex === 0}
                onClick={prev}
              />
              <ArrowButton
                direction="next"
                disabled={safeIndex === total - 1}
                onClick={next}
              />
            </div>
          )}
        </div>

        {activeItem.caption && (
          <p className="text-sm leading-relaxed text-base-content/60">
            {activeItem.caption}
          </p>
        )}

        {/* Thumbnail strip */}
        {total > 1 && (
          <div
            ref={thumbStripRef}
            role="tablist"
            aria-label="Image thumbnails"
            className={cn(
              "flex w-full snap-x gap-3 overflow-x-auto pb-2",
              "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-base-300",
            )}
          >
            {items.map((item, idx) => (
              <div key={idx} className="snap-start" role="presentation">
                <Thumbnail
                  item={item}
                  index={idx}
                  active={idx === safeIndex}
                  onSelect={goTo}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
