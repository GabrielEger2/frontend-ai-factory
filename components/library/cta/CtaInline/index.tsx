"use client";

import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CtaInlineProps {
  /** Main headline text */
  headline: string;
  /** Supporting text beside or below the headline */
  description?: string;
  /** CTA button text */
  ctaText: string;
  /** CTA button URL */
  ctaUrl?: string;
  /** CTA button style */
  ctaStyle?: CtaVariant;
  /** CTA color scheme */
  ctaColorScheme?: ColorScheme;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CtaInline({
  headline,
  description,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  className,
}: CtaInlineProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden py-16 md:py-20",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {headline}
          </h2>
          {description && (
            <p className="mt-2 text-base opacity-70">{description}</p>
          )}
        </div>
        <CtaButton
          variant={ctaStyle}
          colorScheme={ctaColorScheme}
          href={ctaUrl}
          className="shrink-0"
        >
          {ctaText}
        </CtaButton>
      </div>
    </section>
  );
}
