"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import type { StyleKit, CardStyle } from "@lib/style-kit";
import { buttonStyles, type CtaVariant } from "@ui/button";
import CardBase from "@ui/cards/CardBase";
import { CardFlip } from "@ui/cards/CardFlip";
import { CardRevealSlide } from "@ui/cards/CardRevealSlide";
import { CardMagic } from "@ui/cards/CardMagic";
import { CardProduct } from "@ui/cards/CardProduct";
import { CardOutlineGrid } from "@ui/cards/CardOutline";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Map CtaVariant → buttonStyles Variant (best-effort downgrade). */
function toButtonVariant(
  v?: CtaVariant,
): "primary" | "secondary" | "accent" | "outline" | "ghost" | "link" | "glow" {
  switch (v) {
    case "glow":
      return "primary";
    case "slide":
      return "accent";
    case "drawOutline":
      return "outline";
    case "dotExpand":
      return "link";
    default:
      return "primary";
  }
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Shared shape for a standard feature card */
export interface FeatureCardItem {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
  badge?: string;
}

/** Extended shape for product cards */
export interface ProductCardItem {
  image: string;
  imageAlt: string;
  title: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  rating?: number;
  badge?: string;
}

/** Extended shape for flip cards — adds back-face content */
export interface FlipCardItem extends FeatureCardItem {
  /** Heading shown on the back face */
  backTitle: string;
  /** Description shown on the back face */
  backDescription: string;
  /** CTA on the back face */
  backCtaText?: string;
  backCtaUrl?: string;
}

/** Shape for outline cards — simpler: image + title + url */
export interface OutlineCardItem {
  image: string;
  imageAlt: string;
  title: string;
  url: string;
}

export interface CardGridProps {
  /** Section headline displayed above the card grid */
  headline?: string;
  /** Supporting text below the headline */
  subheadline?: string;
  /** Site-wide visual configuration — card style comes from `styleKit.card` */
  styleKit?: StyleKit;
  /**
   * Card data — the shape depends on `styleKit.card`:
   * - `base`, `reveal`, `magic-gradient`, `magic-orb` -> `FeatureCardItem[]`
   * - `flip` -> `FlipCardItem[]`
   * - `product` -> `ProductCardItem[]`
   * - `outline` -> `OutlineCardItem[]`
   */
  cards:
    | FeatureCardItem[]
    | FlipCardItem[]
    | ProductCardItem[]
    | OutlineCardItem[];
  /** Number of grid columns on large screens. Defaults to 3 */
  columns?: 2 | 3 | 4;
  /** Flip direction — only used when card style is "flip" */
  flipDirection?: "horizontal" | "vertical";
  /** Informational purpose tag rendered as a data attribute */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Grid column map                                                    */
/* ------------------------------------------------------------------ */

const COLUMN_MAP = {
  2: "md:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/* ------------------------------------------------------------------ */
/*  Card renderers per style                                           */
/* ------------------------------------------------------------------ */

function renderBaseCards(
  cards: FeatureCardItem[],
  ctaVariant?: CtaVariant,
  ctaColorScheme?: string,
) {
  return cards.map((card, i) => (
    <CardBase
      key={i}
      image={card.image}
      imageAlt={card.imageAlt}
      title={card.title}
      description={card.description}
      ctaText={card.ctaText}
      ctaUrl={card.ctaUrl}
      badge={card.badge}
    />
  ));
}

function renderFlipCards(
  cards: FlipCardItem[],
  flipDirection: "horizontal" | "vertical",
  ctaVariant?: CtaVariant,
  ctaColorScheme?: string,
) {
  return cards.map((card, i) => (
    <CardFlip
      key={i}
      flipDirection={flipDirection}
      className="h-80 w-full"
      front={
        <div className="flex h-full flex-col">
          <div className="relative h-1/2 overflow-hidden bg-base-300">
            <img
              src={card.image}
              alt={card.imageAlt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {card.badge && (
              <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-content">
                {card.badge}
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-center p-4">
            <h3 className="text-lg font-semibold text-base-content">
              {card.title}
            </h3>
            <p className="mt-1 text-sm text-base-content/60">
              {card.description}
            </p>
          </div>
        </div>
      }
      back={
        <div className="flex h-full flex-col items-center justify-center bg-neutral p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-neutral-content">
            {card.backTitle}
          </h3>
          <p className="mb-4 text-sm text-neutral-content/70">
            {card.backDescription}
          </p>
          {card.backCtaText && card.backCtaUrl && (
            <a
              href={card.backCtaUrl}
              className={buttonStyles({
                variant: toButtonVariant(ctaVariant),
                size: "sm",
              })}
            >
              {card.backCtaText}
            </a>
          )}
        </div>
      }
    />
  ));
}

function renderRevealCards(cards: FeatureCardItem[]) {
  return cards.map((card, i) => (
    <CardRevealSlide
      key={i}
      image={card.image}
      imageAlt={card.imageAlt}
      title={card.title}
      description={card.description}
      ctaText={card.ctaText}
      ctaUrl={card.ctaUrl}
    />
  ));
}

function renderMagicCards(
  cards: FeatureCardItem[],
  mode: "gradient" | "orb",
  ctaVariant?: CtaVariant,
  ctaColorScheme?: string,
) {
  return cards.map((card, i) => (
    <CardMagic key={i} mode={mode}>
      <div className="flex flex-col gap-3 p-5">
        <div className="aspect-video overflow-hidden rounded-md bg-base-300">
          <img
            src={card.image}
            alt={card.imageAlt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <h3 className="text-lg font-semibold text-base-content">
          {card.title}
        </h3>
        <p className="text-sm text-base-content/60">{card.description}</p>
        {card.ctaText && card.ctaUrl && (
          <a
            href={card.ctaUrl}
            className={buttonStyles({
              variant: toButtonVariant(ctaVariant),
              size: "sm",
              className: "mt-1 self-start",
            })}
          >
            {card.ctaText}
          </a>
        )}
      </div>
    </CardMagic>
  ));
}

function renderProductCards(cards: ProductCardItem[]) {
  return cards.map((card, i) => (
    <CardProduct
      key={i}
      image={card.image}
      imageAlt={card.imageAlt}
      title={card.title}
      price={card.price}
      originalPrice={card.originalPrice}
      currency={card.currency}
      rating={card.rating}
      badge={card.badge}
    />
  ));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CardGrid -- a section-level layout that renders a grid of cards
 * with configurable animation styles driven by the site-wide StyleKit.
 *
 * Card styles:
 * - **base** -- standard card with image, title, description, CTA
 * - **flip** -- 3D flip card revealing back-face content on hover
 * - **reveal** -- image slides away to reveal content underneath
 * - **magic-gradient** -- cursor-following gradient border effect
 * - **magic-orb** -- cursor-following glowing orb effect
 * - **product** -- e-commerce card with price, rating, wishlist, cart
 * - **outline** -- image cards with custom cursor-snapping outline
 */
export default function CardGrid({
  headline,
  subheadline,
  styleKit,
  cards,
  columns = 3,
  flipDirection = "horizontal",
  purpose,
  className,
}: CardGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const cardStyle: CardStyle = styleKit?.card ?? "base";
  const ctaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme = styleKit?.ctaColorScheme ?? "primary";

  /* Outline cards use their own layout — delegate entirely */
  if (cardStyle === "outline") {
    return (
      <section
        className={cn("w-full bg-base-100", className)}
        data-purpose={purpose}
      >
        {(headline || subheadline) && (
          <SectionHeader
            headline={headline}
            subheadline={subheadline}
            shouldReduceMotion={shouldReduceMotion}
          />
        )}
        <CardOutlineGrid cards={cards as OutlineCardItem[]} />
      </section>
    );
  }

  /* All other styles render inside a standard grid */
  let cardElements: React.ReactNode;

  switch (cardStyle) {
    case "flip":
      cardElements = renderFlipCards(
        cards as FlipCardItem[],
        flipDirection,
        ctaVariant,
        ctaColorScheme,
      );
      break;
    case "reveal":
      cardElements = renderRevealCards(cards as FeatureCardItem[]);
      break;
    case "magic-gradient":
      cardElements = renderMagicCards(
        cards as FeatureCardItem[],
        "gradient",
        ctaVariant,
        ctaColorScheme,
      );
      break;
    case "magic-orb":
      cardElements = renderMagicCards(
        cards as FeatureCardItem[],
        "orb",
        ctaVariant,
        ctaColorScheme,
      );
      break;
    case "product":
      cardElements = renderProductCards(cards as ProductCardItem[]);
      break;
    default:
      cardElements = renderBaseCards(
        cards as FeatureCardItem[],
        ctaVariant,
        ctaColorScheme,
      );
  }

  return (
    <section
      className={cn("w-full bg-base-100 py-16 md:py-24", className)}
      data-purpose={purpose}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {(headline || subheadline) && (
          <SectionHeader
            headline={headline}
            subheadline={subheadline}
            shouldReduceMotion={shouldReduceMotion}
          />
        )}

        <motion.div
          className={cn("grid grid-cols-1 gap-6", COLUMN_MAP[columns])}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 },
            },
          }}
        >
          {cardElements}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section header (private)                                           */
/* ------------------------------------------------------------------ */

function SectionHeader({
  headline,
  subheadline,
  shouldReduceMotion,
}: {
  headline?: string;
  subheadline?: string;
  shouldReduceMotion: boolean | null;
}) {
  return (
    <motion.div
      className="mb-12 text-center"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {headline && (
        <h2 className="mb-4 text-3xl font-bold text-base-content sm:text-4xl">
          {headline}
        </h2>
      )}
      {subheadline && (
        <p className="mx-auto max-w-2xl text-base text-base-content/60 md:text-lg">
          {subheadline}
        </p>
      )}
    </motion.div>
  );
}
