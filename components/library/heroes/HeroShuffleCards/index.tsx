"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import {
  Button,
  CtaButton,
  type CtaVariant,
  type ColorScheme,
} from "@ui/button";
import { Highlighter } from "@ui/text-decorations/Highlighter";
import { TextReveal } from "@ui/text-decorations/TextReveal";
import { TypeWriter } from "@ui/text-decorations/TypeWriter";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface HeroShuffleCardsProps {
  headline: string;
  /** When provided, the last line cycles through these strings with a typewriter effect */
  headlineRotatingWords?: string[];
  /** Word inside `headline` to wrap with the Highlighter underline. When set, word-level TextReveal is skipped. */
  highlightWord?: string;
  /** Wrap the headline in a word-level TextReveal. Defaults to false. Ignored when `highlightWord` is set. */
  revealHeadline?: boolean;
  /** Color scheme for the Highlighter. Defaults to "primary". */
  accentColorScheme?: ColorScheme;
  subheadline: string;
  ctaText: string;
  ctaUrl?: string;
  /** CTA button style — "default" uses the standard filled button, others use animated variants */
  ctaStyle?: CtaVariant;
  /** When provided, shows an email capture form instead of a plain CTA link */
  emailPlaceholder?: string;
  /** Callback when the email form is submitted */
  onEmailSubmit?: (email: string) => void;
  cards?: Array<{
    image: string;
    imageAlt: string;
    quote: string;
    author: string;
  }>;
  className?: string;
}

type CardPosition = "front" | "middle" | "back";

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_HERO_SHUFFLE_CARDS: NonNullable<HeroShuffleCardsProps["cards"]> =
  [
    {
      image: "https://picsum.photos/seed/heroshufflecards-card-0/350/450",
      imageAlt: "Sarah Chen",
      quote:
        "Felt like the team had been with us for years. Three weeks in and the redesign was already paying for itself.",
      author: "Sarah Chen — Head of Growth at Acme",
    },
    {
      image: "https://picsum.photos/seed/heroshufflecards-card-1/350/450",
      imageAlt: "Marcus Rivera",
      quote:
        "Genuinely the smoothest engagement we've run. Clear deliverables and results that held up under load.",
      author: "Marcus Rivera — Founder at BuildFast",
    },
    {
      image: "https://picsum.photos/seed/heroshufflecards-card-2/350/450",
      imageAlt: "Priya Natarajan",
      quote:
        "We doubled the pipeline in a quarter. I've recommended them to four other founders since.",
      author: "Priya Natarajan — VP Product at Lumen",
    },
  ];

/* ------------------------------------------------------------------ */
/*  Card sub-component                                                 */
/* ------------------------------------------------------------------ */

/*
 * Card — kept bespoke intentionally.
 *
 * Drag/fan/stack mechanics (motion.div with drag, dragElastic, stacking x/rotateZ)
 * are specific to this hero interaction and cannot live in a shared primitive.
 * `TestimonialCard` is the closest primitive but requires `name`+`title` as separate
 * strings; this component uses a single `author` field ("Name — Role"). None of
 * TestimonialCard's three layouts use circular-avatar + centered quote + drag.
 * A `CardQuote` primitive is deferred until a second consumer appears.
 */
interface CardProps {
  image: string;
  imageAlt: string;
  quote: string;
  author: string;
  position: CardPosition;
  onShuffle: () => void;
  index: number;
}

function Card({
  image,
  imageAlt,
  quote,
  author,
  position,
  onShuffle,
  index,
}: CardProps) {
  const mousePosRef = useRef(0);
  const safeImg = useSafeImageSrc(
    image,
    `hero-shuffle-cards-01-card-image-${index}`,
    128,
    128,
  );

  const onDragStart = (e: MouseEvent | TouchEvent | PointerEvent) => {
    if ("clientX" in e) {
      mousePosRef.current = e.clientX;
    }
  };

  const onDragEnd = (e: MouseEvent | TouchEvent | PointerEvent) => {
    if ("clientX" in e) {
      const diff = mousePosRef.current - e.clientX;
      if (diff > 150) {
        onShuffle();
      }
    }
    mousePosRef.current = 0;
  };

  const x = position === "front" ? "0%" : position === "middle" ? "33%" : "66%";
  const rotateZ =
    position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg";
  const zIndex = position === "front" ? 2 : position === "middle" ? 1 : 0;

  const draggable = position === "front";

  return (
    <motion.div
      style={{ zIndex }}
      animate={{ rotate: rotateZ, x }}
      drag
      dragElastic={0.35}
      dragListener={draggable}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      transition={{ duration: 0.35 }}
      className={cn(
        "absolute left-0 top-0 grid h-[450px] w-[350px] select-none place-content-center space-y-6 rounded-2xl border border-base-300 bg-base-200/20 p-6 shadow-xl backdrop-blur-md",
        draggable ? "cursor-grab active:cursor-grabbing" : "",
      )}
    >
      <img
        src={safeImg.src}
        onError={safeImg.onError}
        alt={imageAlt}
        className="pointer-events-none mx-auto h-32 w-32 rounded-full border-2 border-base-300 bg-base-200 object-cover"
      />
      <span className="text-center text-lg italic text-base-content/60">
        &ldquo;{quote}&rdquo;
      </span>
      <span className="text-center text-sm font-medium text-primary">
        {author}
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Headline helpers                                                   */
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
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function HeroShuffleCards({
  headline,
  headlineRotatingWords,
  highlightWord,
  revealHeadline,
  accentColorScheme = "primary",
  subheadline,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  emailPlaceholder,
  onEmailSubmit,
  cards = DEFAULT_HERO_SHUFFLE_CARDS,
  className,
}: HeroShuffleCardsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [order, setOrder] = useState<CardPosition[]>([
    "front",
    "middle",
    "back",
  ]);
  const [email, setEmail] = useState("");

  const useHighlighter = Boolean(highlightWord);
  const useTextReveal =
    !useHighlighter && revealHeadline && !shouldReduceMotion;

  const handleShuffle = () => {
    setOrder((prev) => {
      const copy = [...prev];
      copy.unshift(copy.pop() as CardPosition);
      return copy;
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEmailSubmit?.(email);
    setEmail("");
  };

  return (
    <section
      className={cn(
        "w-full overflow-hidden text-base-content min-h-[100dvh] items-center flex bg-base-100",
        className,
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-4 md:grid-cols-2 md:gap-8 md:px-8">
        <div>
          <h2 className="text-4xl font-black leading-tight md:text-5xl lg:text-7xl">
            {useHighlighter ? (
              renderHighlightedHeadline(
                headline,
                highlightWord as string,
                accentColorScheme,
              )
            ) : useTextReveal ? (
              <TextReveal split="word" triggerOnView>
                {headline}
              </TextReveal>
            ) : (
              headline
            )}
            {headlineRotatingWords && headlineRotatingWords.length > 0 && (
              <>
                <br />
                <TypeWriter
                  text={headlineRotatingWords}
                  className="text-primary"
                  cursorClassName="text-primary"
                  speed={60}
                  deleteSpeed={40}
                  pauseDelay={2500}
                  startOnView
                />
              </>
            )}
          </h2>
          <p className="mb-8 mt-4 text-lg text-base-content/70">
            {subheadline}
          </p>

          {emailPlaceholder ? (
            <form
              onSubmit={handleEmailSubmit}
              className="flex items-center gap-2"
            >
              <input
                type="email"
                required
                placeholder={emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-transparent bg-base-200/10 px-3 py-2 text-base-content placeholder:text-base-content/40 transition-colors focus:bg-base-200/20 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" className="whitespace-nowrap">
                {ctaText}
              </Button>
            </form>
          ) : (
            <CtaButton variant={ctaStyle} href={ctaUrl} className="text-base">
              {ctaText}
            </CtaButton>
          )}
        </div>

        {/* Draggable cards */}
        <div className="relative mx-auto h-[450px] w-[350px]">
          {cards.slice(0, 3).map((card, i) => (
            <Card
              key={i}
              image={card.image}
              imageAlt={card.imageAlt}
              quote={card.quote}
              author={card.author}
              position={order[i]}
              onShuffle={handleShuffle}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
