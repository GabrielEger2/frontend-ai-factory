"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { cn } from "@lib/utils";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CarouselHorizontalScrollItem {
  /** Card image URL */
  image: string;
  /** Accessible alt text for the image */
  imageAlt: string;
  /** Title overlaid on the card. When omitted the card shows only the image */
  title?: string;
}

export interface CarouselHorizontalScrollProps {
  /** Optional section headline displayed above the carousel */
  headline?: string;
  /** Optional supporting copy below the headline */
  subheadline?: string;
  /** Optional hint label rendered before/after the carousel (e.g. "Scroll down") */
  scrollHintBefore?: string;
  /** Optional hint label rendered after the carousel (e.g. "Scroll up") */
  scrollHintAfter?: string;
  /** Cards to display in the horizontal track */
  items?: CarouselHorizontalScrollItem[];
  /**
   * Total scroll height of the section as a multiplier of the viewport
   * height. Higher numbers slow the horizontal pacing. Defaults to 3.
   */
  scrollHeightVh?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS: CarouselHorizontalScrollItem[] = [
  {
    image: "https://picsum.photos/seed/carouselhorizontal-0/900/900",
    imageAlt: "Aerial view of a winding coastal road at golden hour",
    title: "Coastline",
  },
  {
    image: "https://picsum.photos/seed/carouselhorizontal-1/900/900",
    imageAlt: "Sunrise over a mountain range with low clouds",
    title: "Summit",
  },
  {
    image: "https://picsum.photos/seed/carouselhorizontal-2/900/900",
    imageAlt: "Dense forest canopy from above",
    title: "Canopy",
  },
  {
    image: "https://picsum.photos/seed/carouselhorizontal-3/900/900",
    imageAlt: "Frozen lake reflecting the northern lights",
    title: "Aurora",
  },
  {
    image: "https://picsum.photos/seed/carouselhorizontal-4/900/900",
    imageAlt: "Sand dunes shaped by wind under a clear sky",
    title: "Dunes",
  },
  {
    image: "https://picsum.photos/seed/carouselhorizontal-5/900/900",
    imageAlt: "Cobblestone alley lit by a single street lamp",
    title: "Alley",
  },
  {
    image: "https://picsum.photos/seed/carouselhorizontal-6/900/900",
    imageAlt: "Rolling hills covered in early morning mist",
    title: "Mist",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ScrollHint({ label }: { label: string }) {
  return (
    <div className="flex h-48 items-center justify-center bg-neutral text-neutral-content">
      <span className="text-sm font-semibold uppercase tracking-widest text-neutral-content/50">
        {label}
      </span>
    </div>
  );
}

function SectionHeader({
  headline,
  subheadline,
}: {
  headline?: string;
  subheadline?: string;
}) {
  if (!headline && !subheadline) return null;
  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-16 text-center md:px-8 md:pb-12 md:pt-24">
      {headline && (
        <h2 className="text-3xl font-bold text-neutral-content sm:text-4xl md:text-5xl">
          {headline}
        </h2>
      )}
      {subheadline && (
        <p className="mt-4 text-base text-neutral-content/60 md:text-lg">
          {subheadline}
        </p>
      )}
    </div>
  );
}

interface CardProps {
  item: CarouselHorizontalScrollItem;
  index: number;
}

/*
 * Card — kept bespoke intentionally.
 *
 * This card is a fixed-square (300×300 → 450×450) full-bleed image tile with
 * an optional glassmorphism overlay. Its dimensions are architecturally coupled
 * to the scroll track's layout — passing them via a shared primitive would be
 * a 1:1 pass-through with no code savings. `acceptsStyleKit.card: false` and
 * there is no CTA, badge, or interactive content. A `CardImageOverlay` primitive
 * would only be warranted if a second consumer with the same shape appeared.
 */
function Card({ item, index }: CardProps) {
  const safeImg = useSafeImageSrc(
    item.image,
    `carousel-horizontal-scroll-01-card-${index}`,
    900,
    900,
  );

  return (
    <div className="group relative h-[300px] w-[300px] shrink-0 overflow-hidden rounded-xl bg-base-200 sm:h-[400px] sm:w-[400px] md:h-[450px] md:w-[450px]">
      <img
        src={safeImg.src}
        onError={safeImg.onError}
        alt={item.imageAlt}
        loading="lazy"
        className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      {item.title && (
        <div className="absolute inset-0 z-10 grid place-content-center">
          <p className="bg-gradient-to-br from-neutral-content/20 to-neutral-content/0 p-6 text-4xl font-black uppercase tracking-tight text-neutral-content backdrop-blur-md sm:p-8 sm:text-5xl md:text-6xl">
            {item.title}
          </p>
        </div>
      )}
    </div>
  );
}

interface TrackProps {
  items: CarouselHorizontalScrollItem[];
  x: MotionValue<string>;
  shouldReduceMotion: boolean | null;
}

function Track({ items, x, shouldReduceMotion }: TrackProps) {
  return (
    <motion.div
      style={shouldReduceMotion ? undefined : { x }}
      className={cn(
        "flex gap-4",
        shouldReduceMotion && "flex-wrap justify-center px-4",
      )}
    >
      {items.map((item, idx) => (
        <Card key={idx} item={item} index={idx} />
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CarouselHorizontalScroll -- a sticky-section carousel where a tall
 * scroll container drives a horizontal translation of the card track.
 * As the visitor scrolls vertically through the section, the cards
 * slide left to reveal the rest of the content. Falls back to a wrapped
 * grid when the user prefers reduced motion.
 */
export default function CarouselHorizontalScroll({
  headline,
  subheadline,
  scrollHintBefore,
  scrollHintAfter,
  items = DEFAULT_ITEMS,
  scrollHeightVh = 3,
  className,
}: CarouselHorizontalScrollProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  if (items.length === 0) return null;

  const sectionHeight = `${Math.max(1, scrollHeightVh) * 100}vh`;

  return (
    <section
      className={cn("w-full bg-neutral", className)}
      aria-roledescription="carousel"
      aria-label={headline ?? "Horizontal scrolling carousel"}
    >
      <SectionHeader headline={headline} subheadline={subheadline} />

      {scrollHintBefore && <ScrollHint label={scrollHintBefore} />}

      <div
        ref={targetRef}
        className="relative bg-neutral"
        style={shouldReduceMotion ? undefined : { height: sectionHeight }}
      >
        <div
          className={cn(
            "flex items-center overflow-hidden",
            shouldReduceMotion ? "py-12" : "sticky top-0 h-[100dvh]",
          )}
        >
          <Track items={items} x={x} shouldReduceMotion={shouldReduceMotion} />
        </div>
      </div>

      {scrollHintAfter && <ScrollHint label={scrollHintAfter} />}
    </section>
  );
}
