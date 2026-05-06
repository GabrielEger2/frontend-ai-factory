"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface HeroMarqueeStripProps {
  /** Eyebrow line printed above the marquee */
  eyebrow?: string;
  /** Marquee phrases — repeated and scrolled horizontally as the visual headline */
  marqueeWords: string[];
  /** Secondary headline below the marquee */
  headline: string;
  /** Supporting paragraph */
  subheadline?: string;
  ctaText: string;
  ctaUrl?: string;
  ctaStyle?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaStyle?: CtaVariant;
  secondaryCtaColorScheme?: ColorScheme;
  /** Direction of the marquee — left or right */
  direction?: "left" | "right";
  /** Seconds for one full loop. Lower = faster */
  speed?: number;
  /** Optional separator glyph between phrases */
  separator?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroMarqueeStrip({
  eyebrow,
  marqueeWords,
  headline,
  subheadline,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  secondaryCtaStyle = "drawOutline",
  secondaryCtaColorScheme = "primary",
  direction = "left",
  speed = 30,
  separator = "/",
  className,
}: HeroMarqueeStripProps) {
  const shouldReduceMotion = useReducedMotion();

  // Repeat words enough times to fill any viewport width without seams
  const loop = [
    ...marqueeWords,
    ...marqueeWords,
    ...marqueeWords,
    ...marqueeWords,
  ];

  const xFrom = direction === "left" ? "0%" : "-50%";
  const xTo = direction === "left" ? "-50%" : "0%";

  return (
    <section
      className={cn(
        "relative flex w-full flex-col justify-center overflow-hidden bg-base-100 min-h-[100dvh]",
        className,
      )}
    >
      {/* Top marquee row */}
      <div className="relative w-full border-y border-base-300 bg-base-200/40 py-6 md:py-10">
        <motion.div
          className="flex whitespace-nowrap"
          animate={shouldReduceMotion ? undefined : { x: [xFrom, xTo] }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {loop.map((word, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-6 px-6 font-serif text-5xl font-semibold tracking-tight text-base-content md:text-7xl lg:text-8xl"
            >
              {word}
              <span className="text-primary" aria-hidden="true">
                {separator}
              </span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Below-marquee content block */}
      <motion.div
        className="relative z-10 mx-auto grid w-full max-w-7xl items-end gap-10 px-4 py-16 md:grid-cols-12 md:px-8 md:py-24 lg:px-12"
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="md:col-span-6"
        >
          {eyebrow && (
            <p className="mb-4 text-xs font-mono uppercase tracking-[0.2em] text-base-content/60">
              {eyebrow}
            </p>
          )}
          <h1 className="text-balance text-3xl font-bold leading-tight text-base-content sm:text-4xl md:text-5xl">
            {headline}
          </h1>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col gap-6 md:col-span-5 md:col-start-8"
        >
          {subheadline && (
            <p className="max-w-prose text-base leading-relaxed text-base-content/70 md:text-lg">
              {subheadline}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
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
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom marquee row — opposite direction for visual rhythm */}
      <div className="relative w-full border-y border-base-300 bg-base-200/40 py-6 md:py-10">
        <motion.div
          className="flex whitespace-nowrap"
          animate={shouldReduceMotion ? undefined : { x: [xTo, xFrom] }}
          transition={{
            duration: speed * 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {loop.map((word, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-6 px-6 font-serif text-4xl italic tracking-tight text-base-content/40 md:text-6xl lg:text-7xl"
            >
              {word}
              <span className="text-primary/40" aria-hidden="true">
                {separator}
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
