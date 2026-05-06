"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@lib/utils";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CarouselAvatarPeekItem {
  /** Author photo URL (square crop ideal) */
  image: string;
  /** Accessible alt for the author photo */
  imageAlt: string;
  /** Author name */
  name: string;
  /** Author title / role / company */
  title: string;
  /** The pull-quote */
  quote: string;
  /** Optional context line (date, metric) */
  caption?: string;
}

export interface CarouselTestimonialAvatarPeekProps {
  /** Optional eyebrow */
  eyebrow?: string;
  /** Optional section headline */
  headline?: string;
  /** Optional supporting paragraph */
  subheadline?: string;
  /** 3-7 testimonials. The active item shows a hero quote; the avatar strip below "peeks" prev/next neighbors. */
  items?: CarouselAvatarPeekItem[];
  /** Auto-advance milliseconds. Set 0 to disable. Defaults to 7000 */
  autoAdvanceMs?: number;
  /** Initial index. Defaults to 0 */
  defaultIndex?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS: CarouselAvatarPeekItem[] = [
  {
    image: "https://picsum.photos/seed/avatarpeek-mariana/200/200",
    imageAlt: "Mariana Cardoso",
    name: "Mariana Cardoso",
    title: "VP Platform Engineering, Northbeam",
    quote:
      "Fourteen-day onboarding turned into a four-day onboarding, and we didn't rewrite a single integration. Numbers held three quarters in.",
    caption: "Quarter-on-quarter pipeline review, October 2025.",
  },
  {
    image: "https://picsum.photos/seed/avatarpeek-rafael/200/200",
    imageAlt: "Rafael Tavares",
    name: "Rafael Tavares",
    title: "Co-founder, Drift Studio",
    quote:
      "They asked the uncomfortable questions early. Pricing, positioning, the team. The answers reshaped the launch in ways we wouldn't have arrived at alone.",
    caption: "Eight-week sprint, six-figure pipeline impact in Q1.",
  },
  {
    image: "https://picsum.photos/seed/avatarpeek-amina/200/200",
    imageAlt: "Amina Hassan",
    name: "Amina Hassan",
    title: "Head of Design, Northwave",
    quote:
      "Felt like extending our own team rather than hiring a vendor. Three of their engineers were in our Slack within a week.",
  },
  {
    image: "https://picsum.photos/seed/avatarpeek-david/200/200",
    imageAlt: "David Okafor",
    name: "Dr. David Okafor",
    title: "Chief Medical Officer, Aurora Health Network",
    quote:
      "Saímos de quarenta-e-sete dias entre referência e atendimento para onze. Nada disso teria acontecido sem o protocolo escrito da quarta semana.",
    caption: "Audited Q2-Q4 2025 across 14 clinics.",
  },
  {
    image: "https://picsum.photos/seed/avatarpeek-bianca/200/200",
    imageAlt: "Bianca Okazaki",
    name: "Bianca Okazaki",
    title: "Founder, Foxtrot Studio",
    quote:
      "I've worked with thirteen agencies in the last decade. None shipped this quickly without dropping quality, and none gave us a system we still iterate on a year later.",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function AvatarTile({
  item,
  active,
  index,
  onSelect,
}: {
  item: CarouselAvatarPeekItem;
  active: boolean;
  index: number;
  onSelect: () => void;
}) {
  const safe = useSafeImageSrc(item.image, `avatarpeek-${index}`, 200, 200);
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={`Show testimonial from ${item.name}`}
      onClick={onSelect}
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-full ring-1 transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100",
        active
          ? "h-20 w-20 ring-primary md:h-24 md:w-24"
          : "h-14 w-14 opacity-65 ring-base-300 hover:opacity-100 md:h-16 md:w-16",
      )}
    >
      <img
        {...safe}
        alt={item.imageAlt}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CarouselTestimonialAvatarPeek -- one hero quote at a time, an avatar
 * strip beneath that "peeks" two neighbours on each side. The active
 * avatar is larger and ringed primary; clicking any avatar
 * cross-fades the matching quote.
 *
 * Use when you have 3-7 high-quality testimonials and want the
 * social-proof carrier to feel premium and editorial rather than a
 * generic dot-paginated card carousel.
 */
export default function CarouselTestimonialAvatarPeek({
  eyebrow,
  headline,
  subheadline,
  items = DEFAULT_ITEMS,
  autoAdvanceMs = 7000,
  defaultIndex = 0,
  className,
}: CarouselTestimonialAvatarPeekProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeItems = items.length > 0 ? items.slice(0, 7) : DEFAULT_ITEMS;
  const safeInitial = Math.min(Math.max(defaultIndex, 0), safeItems.length - 1);
  const [activeIndex, setActiveIndex] = useState(safeInitial);
  const [isPaused, setIsPaused] = useState(false);

  /* Auto-advance */
  useEffect(() => {
    if (autoAdvanceMs <= 0 || safeItems.length <= 1 || isPaused) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % safeItems.length);
    }, autoAdvanceMs);
    return () => window.clearInterval(id);
  }, [autoAdvanceMs, safeItems.length, isPaused]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? safeItems.length - 1 : i - 1));
  }, [safeItems.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % safeItems.length);
  }, [safeItems.length]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    },
    [goPrev, goNext],
  );

  const active = safeItems[activeIndex];

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        {(eyebrow || headline || subheadline) && (
          <motion.div
            className="mb-10 max-w-2xl md:mb-14"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                {eyebrow}
              </span>
            )}
            {headline && (
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-base-content md:text-4xl">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="mt-3 text-base text-base-content/65 md:text-lg">
                {subheadline}
              </p>
            )}
          </motion.div>
        )}

        {/* Hero quote — cross-fades */}
        <div
          role="region"
          aria-label="Testimonial carousel"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="relative min-h-[16rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 ring-offset-base-100 md:min-h-[14rem]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={activeIndex}
              className="flex flex-col gap-6"
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                ease: "easeOut",
              }}
            >
              <span
                aria-hidden="true"
                className="font-serif text-5xl leading-none text-base-content/15 md:text-6xl"
              >
                &ldquo;
              </span>
              <blockquote className="text-xl font-medium leading-snug text-base-content md:text-2xl lg:text-3xl">
                {active.quote}
              </blockquote>
              <figcaption className="flex flex-col gap-1">
                <span className="text-base font-semibold text-base-content">
                  {active.name}
                </span>
                <span className="text-sm text-base-content/60">
                  {active.title}
                </span>
                {active.caption && (
                  <span className="text-xs text-base-content/45">
                    {active.caption}
                  </span>
                )}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* Avatar strip + nav */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-base-300 pt-8 md:mt-12">
          <div
            role="tablist"
            aria-label="Choose a testimonial author"
            className="flex items-center gap-3 md:gap-4"
          >
            {safeItems.map((item, idx) => (
              <AvatarTile
                key={idx}
                item={item}
                active={idx === activeIndex}
                index={idx}
                onSelect={() => setActiveIndex(idx)}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={goPrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-base-200 text-base-content transition-colors hover:bg-base-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={goNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-base-200 text-base-content transition-colors hover:bg-base-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
