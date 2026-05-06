"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface HeroKineticTypeProps {
  eyebrow?: string;
  /** Words rendered before the rotating slot — e.g. "We build". */
  headlinePrefix: string;
  /** Sequence of words/phrases that morph in/out in the highlighted slot. */
  rotatingWords: string[];
  /** Words rendered after the rotating slot — e.g. "for modern teams". */
  headlineSuffix?: string;
  subheadline?: string;
  ctaText: string;
  ctaUrl?: string;
  ctaStyle?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaStyle?: CtaVariant;
  secondaryCtaColorScheme?: ColorScheme;
  /** Color of the rotating word — defaults to primary */
  accentColorScheme?: ColorScheme;
  /** Milliseconds each word stays on screen — default 2400 */
  rotateIntervalMs?: number;
  /** Background motif — subtle dot grid by default */
  backgroundVariant?: "dot-grid" | "horizon-rule" | "none";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const ACCENT_TEXT: Record<ColorScheme, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  neutral: "text-neutral",
};

/* ------------------------------------------------------------------ */
/*  Sub-component — RotatingWord (memoized for perf)                   */
/* ------------------------------------------------------------------ */

interface RotatingWordProps {
  words: string[];
  intervalMs: number;
  accentClass: string;
  reducedMotion: boolean;
}

function RotatingWord({
  words,
  intervalMs,
  accentClass,
  reducedMotion,
}: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const safeWords = words.length > 0 ? words : [""];

  useEffect(() => {
    if (reducedMotion || safeWords.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % safeWords.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, reducedMotion, safeWords.length]);

  // Reserve width using the longest word so the rest of the headline doesn't shift.
  const longest = safeWords.reduce(
    (a, b) => (b.length > a.length ? b : a),
    safeWords[0],
  );

  return (
    <span
      className={cn("relative inline-block align-baseline", accentClass)}
      // Reserved sizing prevents reflow as words swap in/out.
      style={{ minWidth: `${Math.max(longest.length * 0.55, 4)}ch` }}
    >
      {/* Invisible placeholder reserves vertical and horizontal space */}
      <span aria-hidden="true" className="invisible whitespace-nowrap">
        {longest}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={safeWords[index]}
          className="absolute inset-0 whitespace-nowrap italic"
          initial={reducedMotion ? false : { opacity: 0, y: "0.2em" }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: "-0.2em" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {safeWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Background motifs                                                  */
/* ------------------------------------------------------------------ */

function BackgroundMotif({
  variant,
}: {
  variant: "dot-grid" | "horizon-rule";
}) {
  if (variant === "dot-grid") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(oklch(var(--color-base-300)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, #000 60%, transparent 100%)",
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <div className="absolute left-0 right-0 top-1/2 h-px bg-base-300" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-base-300/50" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroKineticType({
  eyebrow,
  headlinePrefix,
  rotatingWords,
  headlineSuffix,
  subheadline,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  secondaryCtaStyle = "drawOutline",
  secondaryCtaColorScheme = "primary",
  accentColorScheme = "primary",
  rotateIntervalMs = 2400,
  backgroundVariant = "dot-grid",
  className,
}: HeroKineticTypeProps) {
  const shouldReduceMotion = useReducedMotion();
  const accentClass = ACCENT_TEXT[accentColorScheme];

  return (
    <section
      className={cn(
        "relative isolate flex w-full items-center justify-center overflow-hidden bg-base-100 py-20 md:py-28 lg:py-32",
        className,
      )}
    >
      {backgroundVariant !== "none" && (
        <BackgroundMotif variant={backgroundVariant} />
      )}

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-start gap-8 px-4 md:px-8"
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {eyebrow && (
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-full border border-base-300 bg-base-200/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-base-content/70 backdrop-blur-sm"
          >
            {eyebrow}
          </motion.span>
        )}

        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight text-base-content sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="block">{headlinePrefix}</span>
          <span className="mt-2 block">
            <RotatingWord
              words={rotatingWords}
              intervalMs={rotateIntervalMs}
              accentClass={accentClass}
              reducedMotion={Boolean(shouldReduceMotion)}
            />
            {headlineSuffix && (
              <span className="ml-3 inline">{headlineSuffix}</span>
            )}
          </span>
        </motion.h1>

        {subheadline && (
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-2xl text-lg leading-relaxed text-base-content/70 md:text-xl"
          >
            {subheadline}
          </motion.p>
        )}

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-2 flex flex-wrap gap-3"
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
    </section>
  );
}
