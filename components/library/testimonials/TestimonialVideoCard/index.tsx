"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiPlay, FiX } from "react-icons/fi";
import { cn } from "@lib/utils";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TestimonialVideoCardItem {
  /** Video poster / thumbnail URL */
  poster: string;
  /** Accessible alt for the poster */
  posterAlt: string;
  /**
   * Embed URL — YouTube, Vimeo, or direct mp4 (auto-played in lightbox).
   * For YouTube use https://www.youtube.com/embed/<id>?autoplay=1
   */
  videoUrl: string;
  /** Optional duration label (e.g. "1:42") */
  duration?: string;
  /** Pull-quote rendered under the player */
  quote: string;
  /** Author name */
  authorName: string;
  /** Author role / company */
  authorTitle: string;
  /** Optional caption (date, context) */
  caption?: string;
}

export interface TestimonialVideoCardProps {
  /** Optional eyebrow */
  eyebrow?: string;
  /** Optional section headline */
  headline?: string;
  /** Optional supporting text */
  subheadline?: string;
  /** 1-3 video testimonials. The first appears with priority width on desktop. */
  items?: TestimonialVideoCardItem[];
  /** Site-wide visual configuration — accepted for API consistency */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS: TestimonialVideoCardItem[] = [
  {
    poster: "https://picsum.photos/seed/videocard-mariana-cardoso/960/540",
    posterAlt: "Mariana Cardoso speaking at her desk",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
    duration: "2:18",
    quote:
      "Fourteen-day onboarding turned into a four-day onboarding. We didn't rewrite a single integration.",
    authorName: "Mariana Cardoso",
    authorTitle: "VP Platform, Northbeam",
    caption: "Recorded at her office in Curitiba, October 2025.",
  },
  {
    poster: "https://picsum.photos/seed/videocard-rafael-tavares/640/360",
    posterAlt: "Rafael Tavares mid-conversation in studio",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
    duration: "1:42",
    quote: "Best partner decision we've made. Period.",
    authorName: "Rafael Tavares",
    authorTitle: "Co-founder, Drift Studio",
  },
  {
    poster: "https://picsum.photos/seed/videocard-amina-hassan/640/360",
    posterAlt: "Amina Hassan in front of a brand wall",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
    duration: "0:56",
    quote: "Felt like extending our own team rather than hiring a vendor.",
    authorName: "Amina Hassan",
    authorTitle: "Head of Design, Northwave",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function VideoTile({
  item,
  isPriority,
  onPlay,
  index,
}: {
  item: TestimonialVideoCardItem;
  isPriority: boolean;
  onPlay: () => void;
  index: number;
}) {
  const safeImage = useSafeImageSrc(
    item.poster,
    `videocard-${index}`,
    isPriority ? 960 : 640,
    isPriority ? 540 : 360,
  );

  return (
    <article
      className={cn(
        "group flex flex-col gap-4",
        isPriority ? "lg:row-span-2" : "",
      )}
    >
      <button
        type="button"
        onClick={onPlay}
        aria-label={`Play video testimonial from ${item.authorName}`}
        className={cn(
          "relative block w-full overflow-hidden rounded-xl bg-base-200 ring-1 ring-base-300 transition-transform duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100",
          "hover:scale-[1.01]",
          isPriority ? "aspect-video lg:aspect-[4/5]" : "aspect-video",
        )}
      >
        <img
          {...safeImage}
          alt={item.posterAlt}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle gradient for legibility of overlays */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-base-content/55 via-transparent to-transparent"
        />
        {/* Play button */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 inline-flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-base-100/95 text-base-content shadow-lg ring-1 ring-base-100/30 transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16"
        >
          <FiPlay className="ml-0.5 h-5 w-5 md:h-6 md:w-6" />
        </span>
        {/* Duration pill */}
        {item.duration && (
          <span className="absolute bottom-3 right-3 inline-flex items-center rounded-md bg-base-content/75 px-2 py-1 font-mono text-xs text-base-100 backdrop-blur tabular-nums">
            {item.duration}
          </span>
        )}
      </button>

      {/* Quote + author */}
      <figure className="flex flex-col gap-2">
        <blockquote
          className={cn(
            "text-base font-medium leading-snug text-base-content",
            isPriority ? "md:text-xl" : "md:text-lg",
          )}
        >
          &ldquo;{item.quote}&rdquo;
        </blockquote>
        <figcaption className="text-sm text-base-content/60">
          <span className="font-semibold text-base-content">
            {item.authorName}
          </span>
          <span className="mx-1.5 text-base-content/30">&middot;</span>
          <span>{item.authorTitle}</span>
        </figcaption>
        {item.caption && (
          <p className="text-xs text-base-content/50">{item.caption}</p>
        )}
      </figure>
    </article>
  );
}

function Lightbox({
  item,
  onClose,
}: {
  item: TestimonialVideoCardItem;
  onClose: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Video testimonial from ${item.authorName}`}
        className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/85 px-4 py-6 backdrop-blur-sm"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        onClick={onClose}
      >
        <motion.div
          className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-xl bg-black shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          initial={
            shouldReduceMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.96 }
          }
          animate={{ opacity: 1, scale: 1 }}
          exit={
            shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }
          }
          transition={{
            duration: shouldReduceMotion ? 0 : 0.25,
            ease: "easeOut",
          }}
        >
          <iframe
            src={item.videoUrl}
            title={`Video testimonial from ${item.authorName}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-base-100/95 text-base-content shadow-md ring-1 ring-base-300 transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100"
          >
            <FiX className="h-4 w-4" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TestimonialVideoCard -- 1-3 video testimonial tiles. The first tile
 * gets priority width (4:5 portrait on desktop). Clicking any tile
 * opens a lightbox with an autoplaying iframe (YouTube, Vimeo, mp4).
 */
export default function TestimonialVideoCard({
  eyebrow,
  headline,
  subheadline,
  items = DEFAULT_ITEMS,
  className,
}: TestimonialVideoCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeItems = items.length > 0 ? items.slice(0, 3) : DEFAULT_ITEMS;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
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

        <motion.div
          className={cn(
            "grid grid-cols-1 gap-6 md:gap-8",
            safeItems.length === 1
              ? "lg:grid-cols-1"
              : safeItems.length === 2
                ? "lg:grid-cols-2"
                : "lg:grid-cols-[minmax(0,_3fr)_minmax(0,_2fr)] lg:grid-rows-2",
          )}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {safeItems.map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                idx === 0 && safeItems.length === 3 && "lg:row-span-2",
              )}
            >
              <VideoTile
                item={item}
                isPriority={idx === 0 && safeItems.length === 3}
                onPlay={() => setActiveIndex(idx)}
                index={idx}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {activeIndex !== null && (
        <Lightbox
          item={safeItems[activeIndex]}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </section>
  );
}
