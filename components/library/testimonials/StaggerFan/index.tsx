"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import TestimonialCard, {
  type TestimonialItem,
} from "@ui/cards/TestimonialCard";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Internal type that adds a unique key for reorder animation */
type InternalTestimonial = TestimonialItem & { _key: number };

export interface StaggerFanProps {
  /** List of testimonials — displayed as a fan of overlapping cards */
  testimonials?: TestimonialItem[];
  /** Height of the section in pixels. Defaults to 600 */
  sectionHeight?: number;
  /** Card size on large screens in pixels. Defaults to 365 */
  cardSizeLg?: number;
  /** Card size on small screens in pixels. Defaults to 290 */
  cardSizeSm?: number;
  /** Site-wide style configuration — accepted for API consistency */
  styleKit?: StyleKit;
  /** Informational purpose tag for the section */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_STAGGER_TESTIMONIALS: TestimonialItem[] = [
  {
    image: "https://picsum.photos/seed/staggerfan-testimonial-0/80/80",
    imageAlt: "Aisha Bello",
    name: "Aisha Bello",
    title: "Head of Growth at Tideline",
    quote:
      "We doubled our pipeline in the first quarter. The team was responsive, sharp, and frankly a delight to work with.",
  },
  {
    image: "https://picsum.photos/seed/staggerfan-testimonial-1/80/80",
    imageAlt: "Marcus Rivera",
    name: "Marcus Rivera",
    title: "Founder at BuildFast",
    quote:
      "I've worked with a dozen agencies. None of them shipped this quickly without dropping quality. Genuinely impressed.",
  },
  {
    image: "https://picsum.photos/seed/staggerfan-testimonial-2/80/80",
    imageAlt: "Priya Natarajan",
    name: "Priya Natarajan",
    title: "VP Product at Lumen",
    quote:
      "The clarity of communication alone was worth the price. We knew where things stood every single week.",
  },
  {
    image: "https://picsum.photos/seed/staggerfan-testimonial-3/80/80",
    imageAlt: "David Okafor",
    name: "David Okafor",
    title: "CTO at Northwind Labs",
    quote:
      "Our conversion rate jumped 38% within six weeks. The redesign paid for itself before the next billing cycle.",
  },
  {
    image: "https://picsum.photos/seed/staggerfan-testimonial-4/80/80",
    imageAlt: "Elena Martinez",
    name: "Elena Martinez",
    title: "Marketing Director at Pixelworks",
    quote:
      "They didn't just build us a website — they gave us a system we can keep iterating on for years.",
  },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ROTATE_DEG = 2.5;
const STAGGER = 15;
const CENTER_STAGGER = -65;
const CORNER_CLIP = 50;
const BORDER_SIZE = 2;
const CORNER_LINE_LEN = Math.sqrt(
  CORNER_CLIP * CORNER_CLIP + CORNER_CLIP * CORNER_CLIP,
);

/* ------------------------------------------------------------------ */
/*  Single card                                                        */
/* ------------------------------------------------------------------ */

function StaggerCard({
  testimonial,
  position,
  cardSize,
  cardSizeMax,
  onMove,
}: {
  testimonial: InternalTestimonial;
  position: number;
  cardSize: number;
  cardSizeMax: number;
  onMove: (pos: number) => void;
}) {
  const isActive = position === 0;
  const sizeScale = cardSize / cardSizeMax;

  return (
    <motion.div
      initial={false}
      onClick={() => onMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-base-content p-8",
        isActive ? "z-10 bg-primary" : "z-0 bg-base-100",
      )}
      style={{
        width: cardSizeMax,
        height: cardSizeMax,
        borderWidth: BORDER_SIZE,
        clipPath: `polygon(${CORNER_CLIP}px 0%, calc(100% - ${CORNER_CLIP}px) 0%, 100% ${CORNER_CLIP}px, 100% 100%, calc(100% - ${CORNER_CLIP}px) 100%, ${CORNER_CLIP}px 100%, 0 100%, 0 0)`,
      }}
      animate={{
        scale: sizeScale,
        x: `calc(-50% + ${position * (cardSize / 1.5)}px)`,
        y: `calc(-50% + ${
          isActive ? CENTER_STAGGER : position % 2 ? STAGGER : -STAGGER
        }px)`,
        rotate: isActive ? 0 : position % 2 ? ROTATE_DEG : -ROTATE_DEG,
        boxShadow: isActive
          ? "0px 8px 0px 4px oklch(var(--color-base-content))"
          : "0px 0px 0px 0px oklch(var(--color-base-content))",
      }}
      transition={{
        type: "spring",
        mass: 3,
        stiffness: 400,
        damping: 50,
      }}
    >
      {/* Decorative corner line */}
      <span
        className="absolute block origin-top-right rotate-45 bg-base-content"
        style={{
          right: -BORDER_SIZE,
          top: CORNER_CLIP - BORDER_SIZE,
          width: CORNER_LINE_LEN,
          height: BORDER_SIZE,
        }}
      />
      <TestimonialCard
        {...testimonial}
        layout="vertical"
        inverted={isActive}
        className={cn(
          "h-full bg-transparent",
          isActive ? "text-primary-content" : "text-base-content",
        )}
      />
    </motion.div>
  );
}

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
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * StaggerFan -- a fan/carousel of overlapping testimonial cards
 * with a clipped corner design. The active card is centered and highlighted;
 * surrounding cards are fanned out with subtle rotation and stagger.
 *
 * Navigate with left/right arrow buttons or click any card to center it.
 */
export default function StaggerFan({
  testimonials: testimonialsProp = DEFAULT_STAGGER_TESTIMONIALS,
  sectionHeight = 600,
  cardSizeLg = 365,
  cardSizeSm = 290,
  styleKit,
  purpose,
  className,
}: StaggerFanProps) {
  const shouldReduceMotion = useReducedMotion();
  const [cardSize, setCardSize] = useState(cardSizeLg);

  /* Assign stable keys for animation identity */
  const [items, setItems] = useState<InternalTestimonial[]>(() =>
    testimonialsProp.map((t, i) => ({ ...t, _key: i })),
  );

  /* Responsive card size */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setCardSize(mq.matches ? cardSizeLg : cardSizeSm);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [cardSizeLg, cardSizeSm]);

  /* Move cards by N positions (positive = forward, negative = back) */
  const handleMove = useCallback((position: number) => {
    setItems((prev) => {
      const copy = [...prev];
      if (position > 0) {
        for (let i = 0; i < position; i++) {
          const first = copy.shift();
          if (!first) return prev;
          copy.push({ ...first, _key: Math.random() });
        }
      } else {
        for (let i = 0; i > position; i--) {
          const last = copy.pop();
          if (!last) return prev;
          copy.unshift({ ...last, _key: Math.random() });
        }
      }
      return copy;
    });
  }, []);

  return (
    <section
      data-purpose={purpose}
      data-style-kit={styleKit ? JSON.stringify(styleKit) : undefined}
      className={cn("relative w-full overflow-hidden bg-base-200", className)}
      style={{ height: sectionHeight }}
    >
      {items.map((t, idx) => {
        const center = Math.floor(items.length / 2);
        const position = idx - center;

        return (
          <StaggerCard
            key={t._key}
            testimonial={t}
            position={position}
            cardSize={cardSize}
            cardSizeMax={cardSizeLg}
            onMove={handleMove}
          />
        );
      })}

      {/* Navigation arrows */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-8">
        <button
          onClick={() => handleMove(-1)}
          className="grid h-14 w-14 place-content-center text-3xl text-base-content transition-colors hover:bg-neutral hover:text-neutral-content"
          aria-label="Previous testimonial"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          onClick={() => handleMove(1)}
          className="grid h-14 w-14 place-content-center text-3xl text-base-content transition-colors hover:bg-neutral hover:text-neutral-content"
          aria-label="Next testimonial"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </section>
  );
}
