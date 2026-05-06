"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import CardBase from "@ui/cards/CardBase";
import { Highlighter } from "@ui/text-decorations/Highlighter";
import { TextReveal } from "@ui/text-decorations/TextReveal";

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
  /** Word inside `headline` to wrap with the Highlighter underline. When set, the word-level TextReveal is skipped. */
  highlightWord?: string;
  /** Wrap the headline in a word-level TextReveal. Defaults to true. Ignored when `highlightWord` is set. */
  revealHeadline?: boolean;
  /** Supporting text rendered below the headline */
  subheadline?: string;
  /** Array of card items */
  cards?: CarouselCardItem[];
  /** Primary CTA — when provided, renders a button next to the carousel arrows */
  ctaText?: string;
  ctaUrl?: string;
  /** CTA animation style — text/button decoration */
  ctaStyle?: CtaVariant;
  /** CTA color scheme */
  ctaColorScheme?: ColorScheme;
  /** Color scheme used by the headline highlighter — defaults to "primary" */
  highlightColorScheme?: ColorScheme;
  /** Fixed card width in pixels. Defaults to 350 */
  cardWidth?: number;
  /** Gap between cards in pixels. Defaults to 20 */
  cardGap?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_CAROUSEL_CARDS: CarouselCardItem[] = [
  {
    image: "https://picsum.photos/seed/carouselcards-card-0/640/400",
    imageAlt: "Designer reviewing mockups on a tablet",
    tag: "Design",
    title: "Brand systems that scale",
    description:
      "Build a visual language that holds together across every channel — without redoing the work each time.",
  },
  {
    image: "https://picsum.photos/seed/carouselcards-card-1/640/400",
    imageAlt: "Developers pair-programming on dual monitors",
    tag: "Engineering",
    title: "Ship features, not tickets",
    description:
      "We pair with your engineers to clear backlogs and rebuild the foundations that keep slowing things down.",
  },
  {
    image: "https://picsum.photos/seed/carouselcards-card-2/640/400",
    imageAlt: "Marketer analyzing dashboard charts",
    tag: "Growth",
    title: "Marketing that compounds",
    description:
      "Channels, content, and conversion experiments stitched into one engine — measured weekly, refined monthly.",
  },
  {
    image: "https://picsum.photos/seed/carouselcards-card-3/640/400",
    imageAlt: "Strategist mapping a customer journey",
    tag: "Strategy",
    title: "From positioning to plan",
    description:
      "We turn fuzzy ambitions into a 12-month roadmap your team will actually want to ship.",
  },
];

/* ------------------------------------------------------------------ */
/*  Breakpoints                                                        */
/* ------------------------------------------------------------------ */

const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function renderHighlightedHeadline(
  headline: string,
  highlightWord: string,
  scheme: ColorScheme,
) {
  const idx = headline.toLowerCase().indexOf(highlightWord.toLowerCase());
  if (idx === -1) return headline;
  const before = headline.slice(0, idx);
  const match = headline.slice(idx, idx + highlightWord.length);
  const after = headline.slice(idx + highlightWord.length);
  return (
    <>
      {before}
      <Highlighter action="underline" colorScheme={scheme} triggerOnView>
        {match}
      </Highlighter>
      {after}
    </>
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
/*  Single card                                                        */
/* ------------------------------------------------------------------ */

function Card({
  item,
  cardWidth,
  cardGap,
}: {
  item: CarouselCardItem;
  cardWidth: number;
  cardGap: number;
}) {
  return (
    <div
      className="relative shrink-0 cursor-pointer transition-transform hover:-translate-y-1"
      style={{
        width: cardWidth,
        marginRight: cardGap,
      }}
    >
      <CardBase
        mode="bare"
        image={item.image}
        imageAlt={item.imageAlt}
        tag={item.tag}
        title={item.title}
        description={item.description}
      />
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
 *
 * Accepts:
 *  - text decorations on the headline (`highlightWord` for an inline underline,
 *    or `revealHeadline` for a word-level TextReveal on scroll)
 *  - a button decoration via `ctaText` + `ctaStyle` + `ctaColorScheme`
 *    rendered alongside the navigation arrows
 *  - a `subheadline` paragraph below the headline
 */
export default function CarouselCards({
  headline,
  highlightWord,
  revealHeadline = true,
  subheadline,
  cards = DEFAULT_CAROUSEL_CARDS,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  highlightColorScheme = "primary",
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

  const useHighlighter = Boolean(highlightWord);
  const useTextReveal =
    !useHighlighter && revealHeadline && !shouldReduceMotion;

  return (
    <section
      className={cn("w-full bg-base-100 py-8", className)}
      ref={containerRef}
      aria-roledescription="carousel"
      aria-label={headline}
    >
      <div className="relative overflow-hidden p-4">
        <div className="mx-auto max-w-7xl">
          {/* Header + navigation */}
          <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-balance text-3xl font-bold leading-tight text-base-content sm:text-4xl">
                {useHighlighter ? (
                  renderHighlightedHeadline(
                    headline,
                    highlightWord as string,
                    highlightColorScheme,
                  )
                ) : useTextReveal ? (
                  <TextReveal split="word" triggerOnView>
                    {headline}
                  </TextReveal>
                ) : (
                  headline
                )}
              </h2>
              {subheadline && (
                <p className="mt-3 text-base leading-relaxed text-base-content/60 sm:text-lg">
                  {subheadline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {ctaText && (
                <CtaButton
                  variant={ctaStyle}
                  colorScheme={ctaColorScheme}
                  href={ctaUrl}
                >
                  {ctaText}
                </CtaButton>
              )}
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
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
