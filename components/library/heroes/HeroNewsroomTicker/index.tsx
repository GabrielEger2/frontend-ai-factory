"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TickerItem {
  /** Short symbol-like label, rendered in mono */
  label: string;
  /** Adjacent text — usually a number, percent, or short phrase */
  value: string;
  /** Up/down/flat sentiment tint */
  trend?: "up" | "down" | "flat";
}

export interface FeaturedHeadline {
  kicker: string;
  title: string;
  url?: string;
  /** Reading time / byline / date stub */
  meta?: string;
  /** Optional thumbnail */
  image?: string;
  imageAlt?: string;
}

export interface HeroNewsroomTickerProps {
  /** Top edge ticker — repeats horizontally */
  tickerItems: TickerItem[];
  /** Issue / volume / date label below the ticker */
  issueLabel?: string;
  /** Display headline (serif, oversized) */
  headline: string;
  /** Lede paragraph below the headline */
  lede: string;
  ctaText: string;
  ctaUrl?: string;
  ctaStyle?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaStyle?: CtaVariant;
  secondaryCtaColorScheme?: ColorScheme;
  /** Side rail of featured stories — 2 to 4 items */
  featuredHeadlines?: FeaturedHeadline[];
  /** Section heading printed above the side rail */
  featuredHeadlinesLabel?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const TREND_TINT: Record<NonNullable<TickerItem["trend"]>, string> = {
  up: "text-success",
  down: "text-error",
  flat: "text-base-content/60",
};

const TREND_GLYPH: Record<NonNullable<TickerItem["trend"]>, string> = {
  up: "▲",
  down: "▼",
  flat: "·",
};

interface FeaturedItemProps {
  item: FeaturedHeadline;
  index: number;
}

function FeaturedItem({ item, index }: FeaturedItemProps) {
  const safe = useSafeImageSrc(
    item.image,
    `hero-newsroom-featured-${index}`,
    160,
    120,
  );
  const Wrapper = item.url ? "a" : "div";
  return (
    <Wrapper
      href={item.url}
      className={cn(
        "group flex items-start gap-3 border-b border-base-300 py-4 last:border-b-0",
        item.url &&
          "transition-colors hover:bg-base-200/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      )}
    >
      {item.image !== undefined && (
        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md bg-base-200">
          <img
            src={safe.src}
            onError={safe.onError}
            alt={item.imageAlt ?? ""}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          {item.kicker}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-base-content md:text-base">
          {item.title}
        </h3>
        {item.meta && (
          <p className="mt-1 font-mono text-[11px] text-base-content/60">
            {item.meta}
          </p>
        )}
      </div>
    </Wrapper>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroNewsroomTicker({
  tickerItems,
  issueLabel,
  headline,
  lede,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  secondaryCtaStyle = "drawOutline",
  secondaryCtaColorScheme = "primary",
  featuredHeadlines,
  featuredHeadlinesLabel,
  className,
}: HeroNewsroomTickerProps) {
  const shouldReduceMotion = useReducedMotion();
  const tickerLoop = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <section
      className={cn("relative w-full overflow-hidden bg-base-100", className)}
    >
      {/* Top ticker row */}
      <div className="relative w-full overflow-hidden border-b border-base-300 bg-base-200/40 py-2">
        <motion.div
          className="flex whitespace-nowrap"
          animate={shouldReduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {tickerLoop.map((item, i) => {
            const trend = item.trend ?? "flat";
            return (
              <span
                key={i}
                className="flex shrink-0 items-center gap-2 px-5 font-mono text-[11px] uppercase tracking-[0.18em]"
              >
                <span className="text-base-content/60">{item.label}</span>
                <span className={TREND_TINT[trend]} aria-hidden="true">
                  {TREND_GLYPH[trend]}
                </span>
                <span className={cn("font-semibold", TREND_TINT[trend])}>
                  {item.value}
                </span>
                <span className="text-base-content/60" aria-hidden="true">
                  ·
                </span>
              </span>
            );
          })}
        </motion.div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:px-8 md:py-16 lg:grid-cols-12 lg:gap-14 lg:px-12 lg:py-20">
        {/* -- Headline column -- */}
        <motion.div
          className="lg:col-span-8"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {issueLabel && (
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mb-6 inline-block border-l-2 border-primary py-1 pl-3 font-mono text-xs uppercase tracking-[0.2em] text-base-content/70"
            >
              {issueLabel}
            </motion.p>
          )}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-base-content sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {headline}
          </motion.h1>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-6 max-w-2xl border-t border-base-300 pt-6 text-base leading-relaxed text-base-content/75 md:text-lg"
          >
            {lede}
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <CtaButton
              variant={ctaStyle}
              colorScheme={ctaColorScheme}
              href={ctaUrl}
            >
              {ctaText}
            </CtaButton>
            {secondaryCtaText && (
              <CtaButton
                variant={secondaryCtaStyle}
                colorScheme={secondaryCtaColorScheme}
                href={secondaryCtaUrl}
              >
                {secondaryCtaText}
              </CtaButton>
            )}
          </motion.div>
        </motion.div>

        {/* -- Side rail of featured headlines -- */}
        {featuredHeadlines && featuredHeadlines.length > 0 && (
          <aside className="lg:col-span-4">
            <div className="sticky top-8 border-t-2 border-base-content/80 pt-4">
              {featuredHeadlinesLabel && (
                <h2 className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-base-content/70">
                  {featuredHeadlinesLabel}
                </h2>
              )}
              <div className="flex flex-col">
                {featuredHeadlines.slice(0, 4).map((item, i) => (
                  <FeaturedItem key={i} item={item} index={i} />
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
