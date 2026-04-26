"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { Highlighter } from "@ui/text-decorations/Highlighter";
import { TextReveal } from "@ui/text-decorations/TextReveal";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ContactShapesFormProps {
  /** Bold section heading shown above the body copy */
  headline: string;
  /** Supporting paragraph (welcome note, hours, GMT, etc.) */
  body: string;
  /** Optional word inside `headline` to wrap with the Highlighter underline. When set, the word-level TextReveal is skipped. */
  highlightWord?: string;
  /** Wrap the headline in a word-level TextReveal entrance. Defaults to false. Ignored when `highlightWord` is set. */
  revealHeadline?: boolean;
  /** Placeholder for the name input */
  namePlaceholder?: string;
  /** Placeholder for the email input */
  emailPlaceholder?: string;
  /** Placeholder for the message textarea */
  messagePlaceholder?: string;
  /** Form submit button label */
  submitText: string;
  /** Submit button visual variant — animated CTA style */
  ctaStyle?: CtaVariant;
  /** Submit button color scheme — maps to design-token color families */
  ctaColorScheme?: ColorScheme;
  /** Google Maps embed URL — when provided, renders an interactive map */
  mapEmbedUrl?: string;
  /** Static map image URL — fallback when no embed URL is given */
  mapImageUrl?: string;
  /** Alt text for the static map image */
  mapImageAlt?: string;
  /** Optional pin label rendered as a floating card over the map */
  locationLabel?: string;
  /** Optional pin sub-label (address line shown under the label) */
  locationAddress?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ContactShapesForm({
  headline,
  body,
  highlightWord,
  revealHeadline = false,
  namePlaceholder = "Enter your name",
  emailPlaceholder = "Enter a valid email address",
  messagePlaceholder = "Enter your message",
  submitText,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  mapEmbedUrl,
  mapImageUrl,
  mapImageAlt,
  locationLabel,
  locationAddress,
  className,
}: ContactShapesFormProps) {
  const prefersReducedMotion = useReducedMotion();

  const reveal = prefersReducedMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.3, ease: "easeOut" },
      };

  const shapeReveal = prefersReducedMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, scale: 0.96 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.3, ease: "easeOut" },
      };

  const useHighlighter = Boolean(highlightWord);
  const useTextReveal =
    !useHighlighter && revealHeadline && !prefersReducedMotion;

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-base-100 px-4 py-12 md:px-8 md:py-16 lg:px-12 lg:py-24",
        className,
      )}
    >
      {/* Decorative shapes layer */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          {...shapeReveal}
          className="absolute right-0 top-12 hidden h-[55%] w-1/2 rounded-l-lg bg-base-200 lg:block"
        />
        <motion.div
          {...shapeReveal}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
          className="absolute bottom-16 right-12 hidden h-40 w-40 rounded-lg bg-base-300/60 lg:block"
        />
        <motion.div
          {...shapeReveal}
          className="absolute left-0 right-0 top-0 h-48 bg-base-200 lg:hidden"
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left column — heading, body, form */}
        <motion.div {...reveal} className="flex flex-col">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-base-content md:text-5xl">
            {useHighlighter ? (
              renderHighlightedHeadline(
                headline,
                highlightWord as string,
                ctaColorScheme,
              )
            ) : useTextReveal ? (
              <TextReveal split="word" triggerOnView>
                {headline}
              </TextReveal>
            ) : (
              headline
            )}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-base-content/70 md:text-lg">
            {body}
          </p>

          <form
            className="mt-10 flex flex-col gap-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="sr-only" htmlFor="contact-shapes-name">
              {namePlaceholder}
            </label>
            <input
              id="contact-shapes-name"
              name="name"
              type="text"
              required
              placeholder={namePlaceholder}
              className="w-full rounded-field border border-base-300 bg-base-100 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <label className="sr-only" htmlFor="contact-shapes-email">
              {emailPlaceholder}
            </label>
            <input
              id="contact-shapes-email"
              name="email"
              type="email"
              required
              placeholder={emailPlaceholder}
              className="w-full rounded-field border border-base-300 bg-base-100 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <label className="sr-only" htmlFor="contact-shapes-message">
              {messagePlaceholder}
            </label>
            <textarea
              id="contact-shapes-message"
              name="message"
              required
              rows={5}
              placeholder={messagePlaceholder}
              className="w-full resize-y rounded-field border border-base-300 bg-base-100 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="mt-2 self-start">
              <CtaButton
                variant={ctaStyle}
                colorScheme={ctaColorScheme}
                onClick={(event) => event.preventDefault()}
              >
                {submitText}
              </CtaButton>
            </div>
          </form>
        </motion.div>

        {/* Right column — map */}
        <motion.div
          {...reveal}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="relative min-h-[320px] lg:min-h-[480px]"
        >
          <div className="relative h-full w-full overflow-hidden rounded-lg border border-base-300 bg-base-200 shadow-sm">
            {mapEmbedUrl ? (
              <iframe
                src={mapEmbedUrl}
                title={mapImageAlt ?? locationLabel ?? "Location map"}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : mapImageUrl ? (
              <img
                src={mapImageUrl}
                alt={mapImageAlt ?? locationLabel ?? "Location map"}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-base-content/40">
                Map preview unavailable
              </div>
            )}

            {locationLabel && (
              <div className="absolute left-4 top-4 max-w-[70%] rounded-lg bg-base-100 px-4 py-3 shadow-md">
                <p className="text-sm font-semibold text-base-content">
                  {locationLabel}
                </p>
                {locationAddress && (
                  <p className="mt-1 text-xs text-base-content/60">
                    {locationAddress}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
