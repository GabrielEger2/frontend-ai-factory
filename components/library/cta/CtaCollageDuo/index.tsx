"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { Highlighter } from "@ui/text-decorations/Highlighter";
import { TextReveal } from "@ui/text-decorations/TextReveal";

export interface CtaCollageDuoProps {
  /** Bold uppercase headline rendered in the brand primary color. */
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
  /** Foreground image (3:4 portrait) — anchors the top of the collage. */
  primaryImage: string;
  /** Alt text for the primary image. */
  primaryImageAlt: string;
  /** Secondary image (4:3 landscape) — overlaps the primary image bottom-right. */
  secondaryImage: string;
  /** Alt text for the secondary image. */
  secondaryImageAlt: string;
  /** Optional attribution prefix shown below the body (e.g. "Images from"). */
  attributionText?: string;
  /** Optional attribution link label (e.g. "Freepik"). */
  attributionLinkText?: string;
  /** Optional attribution destination URL. */
  attributionUrl?: string;
  /** Optional word in the headline to wrap in a Highlighter underline. */
  highlightWord?: string;
  /** Wrap the headline in a TextReveal word-by-word entrance. Default off. */
  revealHeadline?: boolean;
  className?: string;
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

export default function CtaCollageDuo({
  headline,
  body,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  primaryImage,
  primaryImageAlt,
  secondaryImage,
  secondaryImageAlt,
  attributionText,
  attributionLinkText,
  attributionUrl,
  highlightWord,
  revealHeadline = false,
  className,
}: CtaCollageDuoProps) {
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
        "relative w-full bg-neutral text-neutral-content py-12 md:py-16 lg:py-24",
        className,
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-4 md:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
        {/* Left column: paired collage of two images */}
        <div className="relative lg:col-span-6">
          <motion.div
            {...fadeUp}
            className="relative w-full overflow-hidden rounded-lg shadow-lg"
          >
            <img
              src={primaryImage}
              alt={primaryImageAlt}
              className="h-full w-full object-cover"
              style={{ aspectRatio: "3 / 4" }}
              loading="lazy"
            />
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            className={cn(
              "relative -mt-12 ml-auto w-[80%] overflow-hidden rounded-lg shadow-xl",
              "md:-mt-16 md:w-[70%]",
              "lg:absolute lg:-bottom-12 lg:-right-8 lg:mt-0 lg:w-[68%]",
            )}
          >
            <img
              src={secondaryImage}
              alt={secondaryImageAlt}
              className="h-full w-full object-cover"
              style={{ aspectRatio: "4 / 3" }}
              loading="lazy"
            />
          </motion.div>
        </div>

        {/* Right column: headline, body, CTA, attribution */}
        <div className="flex flex-col gap-6 lg:col-span-6 lg:pt-6">
          <motion.h2
            {...fadeUp}
            className="font-sans text-4xl font-bold uppercase leading-tight tracking-tight text-primary md:text-5xl lg:text-6xl"
          >
            {revealHeadline && !prefersReducedMotion ? (
              <TextReveal split="word">{headline}</TextReveal>
            ) : (
              headlineNode
            )}
          </motion.h2>

          <motion.p
            {...fadeUp}
            className="max-w-xl text-base text-neutral-content/80 md:text-lg"
          >
            {body}
          </motion.p>

          {(attributionText || attributionLinkText) && (
            <motion.p
              {...fadeUp}
              className="text-sm italic text-neutral-content/60 md:text-base"
            >
              {attributionText}
              {attributionText && attributionLinkText ? " " : null}
              {attributionLinkText && (
                <a
                  href={attributionUrl ?? "#"}
                  className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
                  target={attributionUrl ? "_blank" : undefined}
                  rel={attributionUrl ? "noopener noreferrer" : undefined}
                >
                  {attributionLinkText}
                </a>
              )}
            </motion.p>
          )}

          <motion.div {...fadeUp} className="flex flex-wrap items-center gap-4 pt-2">
            <CtaButton
              variant={ctaStyle}
              colorScheme={ctaColorScheme}
              href={ctaUrl}
            >
              {ctaText}
            </CtaButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
