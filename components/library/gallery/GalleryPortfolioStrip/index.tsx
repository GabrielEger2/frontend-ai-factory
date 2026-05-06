"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PortfolioItem {
  /** Cover image */
  image: string;
  /** Alt text */
  imageAlt: string;
  /** Project title */
  title: string;
  /** Short subtitle — e.g. "Branding · 2024" */
  subtitle?: string;
  /** Optional discipline chip */
  discipline?: string;
  /** Optional click destination */
  href?: string;
}

export interface GalleryPortfolioStripProps {
  eyebrow?: string;
  headline: string;
  description?: string;
  /** Items — between 4 and 12 reads best */
  items: PortfolioItem[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface CardProps {
  item: PortfolioItem;
  index: number;
}

function StripCard({ item, index }: CardProps) {
  const safe = useSafeImageSrc(
    item.image,
    `portfolio-strip-${index}`,
    700,
    900,
  );

  const Wrapper: any = item.href ? "a" : "div";
  const wrapperProps = item.href
    ? { href: item.href, "aria-label": item.title }
    : {};

  return (
    <motion.div
      variants={fadeUp}
      className="group relative w-[78%] shrink-0 snap-start sm:w-[52%] md:w-[38%] lg:w-[28%] xl:w-[24%]"
    >
      <Wrapper
        {...wrapperProps}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 ring-offset-base-100"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-base-200">
          <img
            src={safe.src}
            onError={safe.onError}
            alt={item.imageAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          {item.discipline && (
            <span className="absolute left-3 top-3 rounded-full border border-neutral-content/20 bg-neutral/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-content backdrop-blur-md">
              {item.discipline}
            </span>
          )}

          {/* Hover meta panel */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 rounded-xl bg-base-100/95 px-4 py-3 opacity-0 shadow-[0_12px_28px_-12px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <p className="truncate text-sm font-semibold text-base-content">
              {item.title}
            </p>
            {item.subtitle && (
              <p className="truncate text-xs text-base-content/60">
                {item.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Static label below — visible always for clarity */}
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-base-content">{item.title}</p>
          {item.subtitle && (
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-base-content/55">
              {item.subtitle}
            </p>
          )}
        </div>
      </Wrapper>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * GalleryPortfolioStrip — horizontal scroll snap strip with hover meta.
 * Cards size to roughly one-and-a-quarter visible at each breakpoint so
 * the next card always peeks in from the right, signaling more.
 *
 * Prev / next chevron buttons control programmatic scrolling on desktop;
 * mobile relies on native swipe + scroll-snap.
 */
export default function GalleryPortfolioStrip({
  eyebrow,
  headline,
  description,
  items,
  className,
}: GalleryPortfolioStripProps) {
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const slack = 4;
    setCanPrev(el.scrollLeft > slack);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - slack);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollBy = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75 * direction;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section
      className={cn(
        "w-full overflow-hidden bg-base-100 py-12 md:py-20 lg:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-2xl">
            {eyebrow && (
              <motion.p
                variants={fadeUp}
                className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
              >
                {eyebrow}
              </motion.p>
            )}
            <motion.h2
              variants={fadeUp}
              className="text-balance text-3xl font-semibold tracking-tight text-base-content sm:text-4xl md:text-5xl"
            >
              {headline}
            </motion.h2>
            {description && (
              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-[55ch] text-base leading-relaxed text-base-content/65"
              >
                {description}
              </motion.p>
            )}
          </div>

          {/* Desktop scroll controls */}
          <motion.div
            variants={fadeUp}
            className="hidden items-center gap-2 md:flex"
          >
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canPrev}
              aria-label="Scroll to previous projects"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content transition-all duration-200 hover:border-base-content hover:bg-base-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                !canPrev && "cursor-not-allowed opacity-40",
              )}
            >
              <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canNext}
              aria-label="Scroll to more projects"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content transition-all duration-200 hover:border-base-content hover:bg-base-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                !canNext && "cursor-not-allowed opacity-40",
              )}
            >
              <FiArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Track — full-bleed with px gutter */}
      <motion.div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 md:px-8 [&::-webkit-scrollbar]:hidden"
        variants={containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {items.map((item, i) => (
          <StripCard key={i} item={item} index={i} />
        ))}
        {/* End spacer so last card snaps without flush-right awkwardness */}
        <div aria-hidden="true" className="w-1 shrink-0 md:w-2" />
      </motion.div>
    </section>
  );
}
