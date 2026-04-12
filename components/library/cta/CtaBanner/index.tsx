"use client";

import { cn } from "@lib/utils";

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
  ctaUrl: string;
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
          <a
            href={ctaUrl}
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-content"
          >
            {ctaText}
          </a>
          {secondaryCtaText && secondaryCtaUrl && (
            <a
              href={secondaryCtaUrl}
              className="rounded-lg border px-6 py-3 font-semibold"
            >
              {secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
