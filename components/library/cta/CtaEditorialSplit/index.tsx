"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import {
  CtaButton,
  type CtaVariant,
  type ColorScheme,
  buttonStyles,
} from "@ui/button";
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

export interface CtaEditorialSplitProps {
  /** Bold callout block text (uppercase headline placed over the primary image). */
  eyebrowCallout: string;
  /** Editorial subheadline rendered next to the secondary image. */
  headline: string;
  /** Supporting body copy beneath the headline. */
  body: string;
  /** Primary CTA label. */
  ctaText: string;
  /** Primary CTA destination URL. */
  ctaUrl?: string;
  /** Primary CTA visual variant. */
  ctaStyle?: CtaVariant;
  /** Primary CTA color scheme. */
  ctaColorScheme?: ColorScheme;
  /** Optional secondary CTA label (rendered as outline link). */
  secondaryCtaText?: string;
  /** Optional secondary CTA destination URL. */
  secondaryCtaUrl?: string;
  /** Foreground image (3:4 portrait) — appears beneath the callout block. */
  primaryImage: string;
  /** Alt text for the primary image. */
  primaryImageAlt: string;
  /** Side image (4:5) — appears next to the headline column. */
  secondaryImage: string;
  /** Alt text for the secondary image. */
  secondaryImageAlt: string;
  /** Optional word in the headline to wrap in a Highlighter underline. */
  highlightWord?: string;
  /** Wrap the headline in a TextReveal word-by-word entrance. Default off. */
  revealHeadline?: boolean;
  /** Optional motif-echo background rendered behind the section content */
  backgroundVariant?: string;
  className?: string;
}

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

function renderHeadline(headline: string, highlightWord?: string) {
  if (!highlightWord) return headline;
  const idx = headline.toLowerCase().indexOf(highlightWord.toLowerCase());
  if (idx === -1) return headline;
  const before = headline.slice(0, idx);
  const match = headline.slice(idx, idx + highlightWord.length);
  const after = headline.slice(idx + highlightWord.length);
  return (
    <>
      {before}
      <Highlighter action="underline" color="hsl(var(--primary))">
        {match}
      </Highlighter>
      {after}
    </>
  );
}

export default function CtaEditorialSplit({
  eyebrowCallout,
  headline,
  body,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  primaryImage,
  primaryImageAlt,
  secondaryImage,
  secondaryImageAlt,
  highlightWord,
  revealHeadline = false,
  backgroundVariant,
  className,
}: CtaEditorialSplitProps) {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = {
    initial: prefersReducedMotion ? false : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.3, ease: "easeOut" as const },
  };

  const headlineNode = renderHeadline(headline, highlightWord);

  return (
    <section
      className={cn(
        "relative isolate w-full overflow-hidden bg-base-100 py-12 md:py-16 lg:py-24",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        {renderMotif(backgroundVariant)}
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
        {/* Left column: portrait image + headline + body + CTAs */}
        <div className="flex flex-col gap-8 lg:col-span-6">
          <motion.div
            {...fadeUp}
            className="relative w-full overflow-hidden rounded-lg"
          >
            <img
              src={primaryImage}
              alt={primaryImageAlt}
              className="h-full w-full object-cover"
              style={{ aspectRatio: "3 / 4" }}
              loading="lazy"
            />
          </motion.div>

          <motion.div {...fadeUp} className="flex flex-col gap-6">
            <h2 className="font-serif text-3xl font-bold leading-tight text-base-content md:text-4xl lg:text-5xl">
              {revealHeadline && !prefersReducedMotion ? (
                <TextReveal split="word">{headline}</TextReveal>
              ) : (
                headlineNode
              )}
            </h2>
            <p className="max-w-xl text-base text-base-content/70 md:text-lg">
              {body}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <CtaButton
                variant={ctaStyle}
                colorScheme={ctaColorScheme}
                href={ctaUrl}
              >
                {ctaText}
              </CtaButton>
              {secondaryCtaText && (
                <a
                  href={secondaryCtaUrl ?? "#"}
                  className={buttonStyles({ variant: "outline" })}
                >
                  {secondaryCtaText}
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right column: tall image with overlaid callout block */}
        <div className="relative lg:col-span-6">
          <motion.div
            {...fadeUp}
            className="relative w-full overflow-hidden rounded-lg"
          >
            <img
              src={secondaryImage}
              alt={secondaryImageAlt}
              className="h-full w-full object-cover"
              style={{ aspectRatio: "4 / 5" }}
              loading="lazy"
            />
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            className={cn(
              "relative -mt-12 ml-auto w-[88%] bg-neutral px-6 py-6 text-neutral-content shadow-lg",
              "md:absolute md:top-12 md:-left-10 md:mt-0 md:w-[70%] md:px-10 md:py-8",
              "lg:top-16 lg:-left-16 lg:w-[78%] lg:px-12 lg:py-10",
            )}
          >
            <p className="font-sans text-2xl font-bold uppercase tracking-tight md:text-3xl lg:text-4xl">
              {eyebrowCallout}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
