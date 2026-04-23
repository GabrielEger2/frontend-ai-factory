"use client";

import { cn } from "@lib/utils";
import {
  CtaButton,
  type CtaVariant,
  type ColorScheme,
  buttonStyles,
} from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CtaBannerProps {
  /** Main headline text */
  headline: string;
  /** Supporting text below the headline */
  subheadline?: string;
  /** Primary CTA button text */
  ctaText: string;
  /** Primary CTA button URL */
  ctaUrl?: string;
  /** CTA button style */
  ctaStyle?: CtaVariant;
  /** CTA color scheme */
  ctaColorScheme?: ColorScheme;
  /** Secondary CTA button text */
  secondaryCtaText?: string;
  /** Secondary CTA button URL */
  secondaryCtaUrl?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CtaBanner({
  headline,
  subheadline,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  className,
}: CtaBannerProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden py-20 md:py-28",
        className,
      )}
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
          {headline}
        </h2>
        {subheadline && (
          <p className="mt-4 text-lg opacity-70">{subheadline}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <CtaButton
            variant={ctaStyle}
            colorScheme={ctaColorScheme}
            href={ctaUrl}
          >
            {ctaText}
          </CtaButton>
          {secondaryCtaText && secondaryCtaUrl && (
            <a
              href={secondaryCtaUrl}
              className={buttonStyles({ variant: "outline" })}
            >
              {secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
