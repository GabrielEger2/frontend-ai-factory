"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { cn } from "@lib/utils";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FeatureCard {
  /** Icon rendered above the title — emoji, SVG string, or React node */
  icon?: React.ReactNode;
  /** Optional image displayed alongside the content */
  image?: string;
  imageAlt?: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
}

export interface StickyCardsProps {
  /** Optional section headline displayed above the cards */
  headline?: string;
  /** Optional section sub-headline for context */
  subheadline?: string;
  /** Feature cards — each becomes a full-viewport sticky section */
  cards?: FeatureCard[];
  /** Site-wide style kit threaded by the Assembler */
  styleKit?: StyleKit;
  /** Height of each card section in px — controls scroll pacing. Defaults to 600 */
  cardHeight?: number;
  /** Informational purpose tag attached as data attribute */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_STICKY_CARDS: FeatureCard[] = [
  {
    title: "Define the problem worth solving",
    description:
      "Most teams skip this step and pay for it later. We start with a sharp written brief everyone in the room agrees with.",
    ctaText: "Read the framework",
    ctaUrl: "#",
  },
  {
    title: "Prototype before you commit",
    description:
      "A clickable prototype, in front of real users, in under two weeks. The feedback rewrites the roadmap — every time.",
    ctaText: "See an example",
    ctaUrl: "#",
  },
  {
    title: "Ship, measure, then ship again",
    description:
      "We instrument the launch from day one and meet weekly to decide what stays, what goes, and what gets doubled down on.",
    ctaText: "Book a working session",
    ctaUrl: "#",
  },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_CARD_HEIGHT = 600;

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface StickyCardProps {
  card: FeatureCard;
  position: number;
  totalCards: number;
  scrollYProgress: MotionValue<number>;
  cardHeight: number;
  isOdd: boolean;
  ctaStyle: CtaVariant;
  ctaColorScheme: ColorScheme;
  shouldReduceMotion: boolean | null;
  index: number;
}

function StickyCard({
  card,
  position,
  totalCards,
  scrollYProgress,
  cardHeight,
  isOdd,
  ctaStyle,
  ctaColorScheme,
  shouldReduceMotion,
  index,
}: StickyCardProps) {
  const isLast = position === totalCards;
  const scaleFromPct = (position - 1) / totalCards;
  const y = useTransform(scrollYProgress, [scaleFromPct, 1], [0, -cardHeight]);
  const safeImg = useSafeImageSrc(
    card.image,
    `layout-stickycards-01-card-image-${index}`,
    400,
    320,
  );

  return (
    <motion.div
      style={{
        height: cardHeight,
        y: shouldReduceMotion || isLast ? undefined : y,
      }}
      className={cn(
        "sticky top-0 flex w-full origin-top flex-col items-center justify-center px-4",
        isOdd
          ? "bg-neutral text-neutral-content"
          : "bg-base-100 text-base-content",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 md:px-8",
          card.image && "md:flex-row md:gap-12",
        )}
      >
        {/* Image column */}
        <div className="flex w-full shrink-0 justify-center md:w-2/5">
          <img
            src={safeImg.src}
            onError={safeImg.onError}
            alt={card.imageAlt ?? ""}
            className="max-h-64 w-auto rounded-lg object-cover md:max-h-80"
            loading="lazy"
          />
        </div>

        {/* Content column */}
        <div
          className={cn(
            "flex flex-col items-center",
            card.image ? "md:items-start" : "items-center",
          )}
        >
          {card.icon && <div className="mb-4 text-4xl">{card.icon}</div>}

          <h3
            className={cn(
              "mb-4 text-center text-3xl font-semibold sm:text-4xl md:text-5xl",
              card.image && "md:text-left",
            )}
          >
            {card.title}
          </h3>

          <p
            className={cn(
              "mb-8 max-w-lg text-center text-sm md:text-base",
              isOdd ? "text-neutral-content/70" : "text-base-content/70",
              card.image && "md:text-left",
            )}
          >
            {card.description}
          </p>

          <CtaButton
            variant={ctaStyle}
            colorScheme={ctaColorScheme}
            href={card.ctaUrl}
          >
            {card.ctaText}
          </CtaButton>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section header                                                     */
/* ------------------------------------------------------------------ */

interface SectionHeaderProps {
  headline: string;
  subheadline?: string;
  shouldReduceMotion: boolean | null;
}

function SectionHeader({
  headline,
  subheadline,
  shouldReduceMotion,
}: SectionHeaderProps) {
  return (
    <motion.div
      className="flex min-h-[40vh] flex-col items-center justify-center bg-base-100 px-4 py-16 text-center md:py-24"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <h2 className="mb-4 text-3xl font-bold text-base-content sm:text-4xl md:text-5xl">
        {headline}
      </h2>
      {subheadline && (
        <p className="max-w-2xl text-base text-base-content/60 md:text-lg">
          {subheadline}
        </p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function StickyCards({
  headline,
  subheadline,
  cards = DEFAULT_STICKY_CARDS,
  styleKit,
  cardHeight = DEFAULT_CARD_HEIGHT,
  purpose,
  className,
}: StickyCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const ctaStyle: CtaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme: ColorScheme = styleKit?.ctaColorScheme ?? "primary";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <section className={cn("w-full", className)} data-purpose={purpose}>
      {headline && (
        <SectionHeader
          headline={headline}
          subheadline={subheadline}
          shouldReduceMotion={shouldReduceMotion}
        />
      )}

      <div ref={ref} className="relative">
        {cards.map((card, idx) => (
          <StickyCard
            key={idx}
            card={card}
            position={idx + 1}
            totalCards={cards.length}
            scrollYProgress={scrollYProgress}
            cardHeight={cardHeight}
            isOdd={(idx + 1) % 2 === 1}
            ctaStyle={ctaStyle}
            ctaColorScheme={ctaColorScheme}
            shouldReduceMotion={shouldReduceMotion}
            index={idx}
          />
        ))}
      </div>
    </section>
  );
}
