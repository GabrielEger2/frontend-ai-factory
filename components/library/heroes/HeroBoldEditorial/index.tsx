"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { Highlighter } from "@ui/text-decorations/Highlighter";
import { TextReveal } from "@ui/text-decorations/TextReveal";
import {
  AnimatedSvgBackground,
  GEOMETRIC_SHAPES,
} from "@ui/backgrounds/AnimatedSvgBackground";
import { DotPattern } from "@ui/backgrounds/DotPattern";
import { StripedPattern } from "@ui/backgrounds/StripedPattern";
import { GradientBars } from "@ui/backgrounds/GradientBars";
import { InteractiveGridPattern } from "@ui/backgrounds/InteractiveGridPattern";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface HeroBoldEditorialProps {
  /** Small intro sentence printed above the display headline */
  eyebrow?: string;
  /** Main display headline — rendered with an oversized serif face */
  headline: string;
  /** Word inside `headline` to wrap with the Highlighter underline. When set, the word-level TextReveal is skipped. */
  highlightWord?: string;
  /** Wrap the headline in a word-level TextReveal. Defaults to true. Ignored when `highlightWord` is set. */
  revealHeadline?: boolean;
  /** Tall portrait image displayed inside the colored accent column */
  primaryImage: string;
  primaryImageAlt: string;
  /** Italic serif word/phrase laid over the primary image (e.g. "good ideas") */
  primaryImageOverlayText?: string;
  /** Optional secondary image floated to the bottom-right of the headline column */
  accentImage?: string;
  accentImageAlt?: string;
  /** Primary CTA — when omitted, the section renders headline-only */
  ctaText?: string;
  ctaUrl?: string;
  ctaStyle?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaStyle?: CtaVariant;
  secondaryCtaColorScheme?: ColorScheme;
  /** Token used for the colored accent column — defaults to "primary" */
  accentColorScheme?: ColorScheme;
  /** Optional motif-echo background rendered behind the section content */
  backgroundVariant?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Motif renderer                                                     */
/* ------------------------------------------------------------------ */

function renderMotif(bg?: string) {
  switch (bg) {
    case "animated-svg":
      return <AnimatedSvgBackground shapes={GEOMETRIC_SHAPES} />;
    case "dot-pattern":
      return <DotPattern />;
    case "striped":
      return <StripedPattern />;
    case "gradient-bars":
      return <GradientBars />;
    case "interactive-grid":
      return <InteractiveGridPattern />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const ACCENT_BG: Record<ColorScheme, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  neutral: "bg-neutral",
};

const ACCENT_CONTENT: Record<ColorScheme, string> = {
  primary: "text-primary-content",
  secondary: "text-secondary-content",
  accent: "text-accent-content",
  neutral: "text-neutral-content",
};

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
/*  Animations                                                         */
/* ------------------------------------------------------------------ */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const imageReveal = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const overlayReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const, delay: 0.3 },
  },
};

const accentImageReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const, delay: 0.25 },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroBoldEditorial({
  eyebrow,
  headline,
  highlightWord,
  revealHeadline = true,
  primaryImage,
  primaryImageAlt,
  primaryImageOverlayText,
  accentImage,
  accentImageAlt,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "neutral",
  secondaryCtaText,
  secondaryCtaUrl,
  secondaryCtaStyle = "drawOutline",
  secondaryCtaColorScheme = "neutral",
  accentColorScheme = "primary",
  backgroundVariant,
  className,
}: HeroBoldEditorialProps) {
  const prefersReducedMotion = useReducedMotion();
  const accentBg = ACCENT_BG[accentColorScheme];
  const accentContent = ACCENT_CONTENT[accentColorScheme];

  const useHighlighter = Boolean(highlightWord);
  const useTextReveal =
    !useHighlighter && revealHeadline && !prefersReducedMotion;

  return (
    <section
      className={cn(
        "relative isolate w-full overflow-hidden bg-base-100",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        {renderMotif(backgroundVariant)}
      </div>
      <div className="relative grid min-h-[640px] w-full grid-cols-1 lg:min-h-[720px] lg:grid-cols-12">
        {/* -- Accent column with primary image -- */}
        <motion.div
          variants={container}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={cn(
            "relative flex items-center justify-center px-6 py-16 md:px-10 lg:col-span-5 lg:px-14 lg:py-24",
            accentBg,
            accentContent,
          )}
        >
          <motion.div
            variants={imageReveal}
            className="relative aspect-[3/4] w-full max-w-sm overflow-hidden"
          >
            <img
              src={primaryImage}
              alt={primaryImageAlt}
              className="h-full w-full object-cover grayscale"
              loading="eager"
            />

            {primaryImageOverlayText && (
              <motion.span
                variants={overlayReveal}
                className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 text-center font-serif text-3xl italic leading-none drop-shadow-md md:text-4xl"
              >
                {primaryImageOverlayText}
              </motion.span>
            )}
          </motion.div>
        </motion.div>

        {/* -- Headline column -- */}
        <motion.div
          variants={container}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative flex flex-col justify-center gap-8 px-6 py-16 md:px-10 lg:col-span-7 lg:px-16 lg:py-24"
        >
          {eyebrow && (
            <motion.p
              variants={fadeUp}
              className="max-w-md text-sm leading-relaxed text-base-content/60 md:text-base"
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h1
            variants={fadeUp}
            className="font-serif text-5xl font-bold leading-[0.95] tracking-tight text-base-content sm:text-6xl md:text-7xl lg:text-8xl"
          >
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
          </motion.h1>

          {(ctaText || secondaryCtaText) && (
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              {ctaText && (
                <CtaButton
                  variant={ctaStyle}
                  colorScheme={ctaColorScheme}
                  href={ctaUrl}
                >
                  {ctaText}
                </CtaButton>
              )}
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
          )}

          {accentImage && (
            <motion.div
              variants={accentImageReveal}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mt-4 aspect-square w-40 self-end overflow-hidden border border-base-300 shadow-lg sm:w-48 md:w-56"
            >
              <img
                src={accentImage}
                alt={accentImageAlt ?? ""}
                className="h-full w-full object-cover grayscale"
                loading="lazy"
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
