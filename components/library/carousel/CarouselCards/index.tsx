"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CarouselCardItem {
  /** Card image URL */
  image: string;
  /** Accessible alt text for the image */
  imageAlt: string;
  /** Badge / tag label displayed above the title */
  tag: string;
  /** Card title */
  title: string;
  /** Card description text */
  description: string;
}

export interface CarouselCardsProps {
  /** Section headline */
  headline: string;
  /** Array of card items */
  cards: CarouselCardItem[];
  /** Fixed card width in pixels. Defaults to 350 */
  cardWidth?: number;
  /** Gap between cards in pixels. Defaults to 20 */
  cardGap?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Breakpoints                                                        */
/* ------------------------------------------------------------------ */

const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
};

/* ------------------------------------------------------------------ */
/*  Arrow icon                                                         */
/* ------------------------------------------------------------------ */

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </>
      ) : (
        <>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Single card                                                        */
/* ------------------------------------------------------------------ */

function Card({
  item,
  cardWidth,
  cardGap,
  index,
}: {
  item: CarouselCardItem;
  cardWidth: number;
  cardGap: number;
  index: number;
}) {
  const safeImg = useSafeImageSrc(
    item.image,
    `carousel-cards-01-card-image-${index}`,
    600,
    200,
  );
  return (
    <div
      className="relative shrink-0 cursor-pointer transition-transform hover:-translate-y-1"
      style={{
        width: cardWidth,
        marginRight: cardGap,
      }}
    >
      <img
        src={safeImg.src}
        onError={safeImg.onError}
        alt={item.imageAlt}
        className="mb-3 h-[200px] w-full rounded-lg bg-base-300 object-cover"
        loading="lazy"
      />
      <span className="rounded-md border border-base-300 px-1.5 py-1 text-xs uppercase text-base-content/60">
        {item.tag}
      </span>
      <p className="mt-1.5 text-lg font-medium text-base-content">
        {item.title}
      </p>
      <p className="text-sm text-base-content/60">{item.description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CarouselCards -- a horizontal card carousel with arrow navigation.
 * Responsive: shows 1 card on mobile, 2 on tablet, 3 on desktop.
 * Cards shift left/right by one card width at a time with smooth
 * easeInOut animation.
 */
export default function CarouselCards({
  headline,
  cards,
  cardWidth = 350,
  cardGap = 20,
  className,
}: CarouselCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [offset, setOffset] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const cardSize = cardWidth + cardGap;

  /* Measure container width */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const visibleCards =
    containerWidth > BREAKPOINTS.lg
      ? 3
      : containerWidth > BREAKPOINTS.sm
        ? 2
        : 1;

  const canShiftLeft = offset < 0;
  const canShiftRight =
    Math.abs(offset) < cardSize * (cards.length - visibleCards);

  const shiftLeft = useCallback(() => {
    if (!canShiftLeft) return;
    setOffset((prev) => prev + cardSize);
  }, [canShiftLeft, cardSize]);

  const shiftRight = useCallback(() => {
    if (!canShiftRight) return;
    setOffset((prev) => prev - cardSize);
  }, [canShiftRight, cardSize]);

  if (cards.length === 0) return null;

  return (
    <section
      className={cn("w-full bg-base-100 py-8", className)}
      ref={containerRef}
      aria-roledescription="carousel"
      aria-label={headline}
    >
      <div className="relative overflow-hidden p-4">
        <div className="mx-auto max-w-6xl">
          {/* Header + navigation */}
          <div className="flex items-center justify-between">
            <h2 className="mb-4 text-3xl font-bold text-base-content sm:text-4xl">
              {headline}
            </h2>
            <div className="flex items-center gap-2">
              <button
                className={cn(
                  "grid h-10 w-10 place-content-center rounded-lg border border-base-300 bg-base-100 text-xl text-base-content transition-opacity",
                  !canShiftLeft && "opacity-30",
                )}
                disabled={!canShiftLeft}
                onClick={shiftLeft}
                aria-label="Previous cards"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                className={cn(
                  "grid h-10 w-10 place-content-center rounded-lg border border-base-300 bg-base-100 text-xl text-base-content transition-opacity",
                  !canShiftRight && "opacity-30",
                )}
                disabled={!canShiftRight}
                onClick={shiftRight}
                aria-label="Next cards"
              >
                <ArrowIcon direction="right" />
              </button>
            </div>
          </div>

          {/* Cards track */}
          <motion.div
            animate={{ x: offset }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { ease: "easeInOut", duration: 0.3 }
            }
            className="flex"
          >
            {cards.map((card, idx) => (
              <Card
                key={idx}
                item={card}
                cardWidth={cardWidth}
                cardGap={cardGap}
                index={idx}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
