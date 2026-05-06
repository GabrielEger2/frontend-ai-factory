"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TestimonialLogoQuoteItem {
  /** Company logo image URL (transparent SVG / PNG ideal) */
  logo: string;
  /** Accessible alt for the logo */
  logoAlt: string;
  /** Short pull-quote (one sentence) */
  quote: string;
  /** Author name */
  authorName: string;
  /** Author role / company */
  authorTitle: string;
}

export interface TestimonialLogoQuoteRibbonProps {
  /** Optional eyebrow label rendered above the logo strip */
  eyebrow?: string;
  /** Optional headline rendered above the logo strip */
  headline?: string;
  /** Optional sub-line under the headline */
  subheadline?: string;
  /** Up to 8 logo + quote items */
  items?: TestimonialLogoQuoteItem[];
  /** Index of the item to show as the active quote on first render. Defaults to 0 */
  defaultActiveIndex?: number;
  /**
   * "neutral" — bg-base-100 (default)
   * "muted" — bg-base-200 surface
   */
  tone?: "neutral" | "muted";
  /** Site-wide visual configuration — accepted for API consistency */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS: TestimonialLogoQuoteItem[] = [
  {
    logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=NORTHWAVE",
    logoAlt: "Northwave",
    quote:
      "Felt like extending our own team rather than handing things off to a vendor.",
    authorName: "Amina Hassan",
    authorTitle: "Head of Design, Northwave",
  },
  {
    logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=KINETIC",
    logoAlt: "Kinetic Labs",
    quote:
      "Three weeks from kickoff to a redesigned site that actually felt like us.",
    authorName: "Rafael Costa",
    authorTitle: "Head of Product, Kinetic",
  },
  {
    logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=HELIX",
    logoAlt: "Helix Systems",
    quote:
      "Two weeks in and we already had a launch-ready prototype the team could test against.",
    authorName: "Jordan Patel",
    authorTitle: "Director of Engineering, Helix",
  },
  {
    logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=MORROW",
    logoAlt: "Morrow & Co",
    quote:
      "They asked the right uncomfortable questions early. That alone changed the project.",
    authorName: "Hannah Schmitt",
    authorTitle: "Founder, Morrow & Co",
  },
  {
    logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=GLASSCUBE",
    logoAlt: "Glasscube",
    quote:
      "We finally have a brand story everyone in the company tells the same way.",
    authorName: "Yuki Tanaka",
    authorTitle: "VP Marketing, Glasscube",
  },
  {
    logo: "https://placehold.co/160x40/0f172a/eeeeee/svg?text=RIVERMARK",
    logoAlt: "Rivermark",
    quote: "Best money we've spent on a partner this year. Period.",
    authorName: "Naomi Wright",
    authorTitle: "CEO, Rivermark",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TestimonialLogoQuoteRibbon -- compact social proof.
 * A horizontal ribbon of customer logos doubles as a tab strip:
 * clicking a logo cross-fades a one-line pull-quote underneath.
 *
 * The tightest social-proof slot in the library; pair with a hero or
 * place above pricing where logo recognition does most of the work.
 */
export default function TestimonialLogoQuoteRibbon({
  eyebrow,
  headline,
  subheadline,
  items = DEFAULT_ITEMS,
  defaultActiveIndex = 0,
  tone = "neutral",
  className,
}: TestimonialLogoQuoteRibbonProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeItems = items.length > 0 ? items : DEFAULT_ITEMS;
  const initial = Math.min(
    Math.max(defaultActiveIndex, 0),
    safeItems.length - 1,
  );
  const [activeIndex, setActiveIndex] = useState(initial);
  const active = safeItems[activeIndex];

  const surfaceClass = tone === "muted" ? "bg-base-200" : "bg-base-100";

  return (
    <section className={cn(surfaceClass, "w-full py-12 md:py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {(eyebrow || headline || subheadline) && (
          <motion.div
            className="mb-8 flex max-w-2xl flex-col gap-2 md:mb-10"
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
              <h2 className="text-2xl font-semibold tracking-tight text-base-content md:text-3xl">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="text-base text-base-content/65">{subheadline}</p>
            )}
          </motion.div>
        )}

        {/* Logo ribbon — also serves as tab strip */}
        <div
          role="tablist"
          aria-label="Customer logos"
          className="grid grid-cols-2 items-center gap-x-6 gap-y-6 border-y border-base-300 py-6 sm:grid-cols-3 md:grid-cols-6"
        >
          {safeItems.slice(0, 6).map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="testimonial-logo-quote-panel"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "group flex h-10 items-center justify-center transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100",
                  isActive ? "opacity-100" : "opacity-50 hover:opacity-90",
                )}
              >
                <img
                  src={item.logo}
                  alt={item.logoAlt}
                  className="max-h-7 w-auto object-contain md:max-h-8"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>

        {/* Quote panel — cross-fades when active logo changes */}
        <div
          id="testimonial-logo-quote-panel"
          role="tabpanel"
          className="relative mt-6 min-h-[5rem] md:mt-8"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={activeIndex}
              className="flex flex-col gap-3"
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.25,
                ease: "easeOut",
              }}
            >
              <blockquote className="max-w-3xl text-lg font-medium leading-snug text-base-content md:text-xl">
                <span aria-hidden="true" className="mr-1 text-base-content/30">
                  &ldquo;
                </span>
                {active.quote}
                <span
                  aria-hidden="true"
                  className="ml-0.5 text-base-content/30"
                >
                  &rdquo;
                </span>
              </blockquote>
              <figcaption className="text-sm text-base-content/60">
                <span className="font-semibold text-base-content">
                  {active.authorName}
                </span>
                <span className="mx-1.5 text-base-content/30">&middot;</span>
                <span>{active.authorTitle}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
