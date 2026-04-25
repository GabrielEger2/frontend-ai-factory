"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CarouselSwipeItem {
  /** Image URL */
  image: string;
  /** Accessible alt text */
  imageAlt: string;
}

export interface CarouselSwipeProps {
  /** Array of images to display in the carousel */
  items?: CarouselSwipeItem[];
  /** Auto-advance interval in milliseconds. Set to 0 to disable. Defaults to 10000 */
  autoAdvanceMs?: number;
  /** Minimum drag distance (in px) to trigger a slide change. Defaults to 50 */
  dragBuffer?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_CAROUSEL_SWIPE_ITEMS: CarouselSwipeItem[] = [
  {
    image: "https://picsum.photos/seed/carouselswipe-slide-0/1280/720",
    imageAlt: "Modern open office with natural light",
  },
  {
    image: "https://picsum.photos/seed/carouselswipe-slide-1/1280/720",
    imageAlt: "Team collaborating on a whiteboard",
  },
  {
    image: "https://picsum.photos/seed/carouselswipe-slide-2/1280/720",
    imageAlt: "Close-up of laptop and notebook on a desk",
  },
  {
    image: "https://picsum.photos/seed/carouselswipe-slide-3/1280/720",
    imageAlt: "Skyline view from a rooftop terrace",
  },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SPRING_OPTIONS = {
  type: "spring" as const,
  mass: 3,
  stiffness: 400,
  damping: 50,
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Slides({
  items,
  activeIndex,
  shouldReduceMotion,
}: {
  items: CarouselSwipeItem[];
  activeIndex: number;
  shouldReduceMotion: boolean | null;
}) {
  return (
    <>
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          style={{
            backgroundImage: `url(${item.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          animate={{
            scale: shouldReduceMotion ? 1 : activeIndex === idx ? 0.95 : 0.85,
          }}
          transition={SPRING_OPTIONS}
          className="aspect-video w-full shrink-0 rounded-xl bg-base-300"
          role="img"
          aria-label={item.imageAlt}
          aria-hidden={activeIndex !== idx}
        />
      ))}
    </>
  );
}

function Dots({
  total,
  activeIndex,
  onSelect,
}: {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="mt-4 flex w-full justify-center gap-2"
      role="tablist"
      aria-label="Carousel navigation"
    >
      {Array.from({ length: total }, (_, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={cn(
            "h-3 w-3 rounded-full transition-colors",
            idx === activeIndex
              ? "bg-neutral-content"
              : "bg-neutral-content/40",
          )}
          role="tab"
          aria-selected={idx === activeIndex}
          aria-label={`Slide ${idx + 1}`}
        />
      ))}
    </div>
  );
}

function GradientEdges() {
  return (
    <>
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-r from-neutral/50 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-l from-neutral/50 to-transparent" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CarouselSwipe -- a full-width swipeable image carousel with dot
 * navigation and gradient edge overlays. Supports drag/swipe gestures,
 * keyboard navigation, and optional auto-advance.
 */
export default function CarouselSwipe({
  items = DEFAULT_CAROUSEL_SWIPE_ITEMS,
  autoAdvanceMs = 10000,
  dragBuffer = 50,
  className,
}: CarouselSwipeProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dragX = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  /* Auto-advance timer */
  useEffect(() => {
    if (autoAdvanceMs <= 0 || items.length <= 1) return;

    const interval = setInterval(() => {
      if (dragX.get() === 0) {
        setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
      }
    }, autoAdvanceMs);

    return () => clearInterval(interval);
  }, [autoAdvanceMs, items.length, dragX]);

  const onDragEnd = useCallback(() => {
    const x = dragX.get();
    if (x <= -dragBuffer && activeIndex < items.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (x >= dragBuffer && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  }, [dragX, dragBuffer, activeIndex, items.length]);

  if (items.length === 0) return null;

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-neutral py-8",
        className,
      )}
      aria-roledescription="carousel"
      aria-label="Image carousel"
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x: dragX }}
        animate={{
          translateX: `-${activeIndex * 100}%`,
        }}
        transition={shouldReduceMotion ? { duration: 0 } : SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className="flex cursor-grab items-center active:cursor-grabbing"
      >
        <Slides
          items={items}
          activeIndex={activeIndex}
          shouldReduceMotion={shouldReduceMotion}
        />
      </motion.div>

      <Dots
        total={items.length}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
      />
      <GradientEdges />
    </section>
  );
}
