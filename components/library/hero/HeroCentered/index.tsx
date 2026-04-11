import React from "react";

export interface HeroCenteredProps {
  /** Primary headline text */
  headline: string;
  /** Supporting subheadline text */
  subheadline?: string;
  /** Primary call-to-action button label */
  ctaText?: string;
  /** Primary call-to-action destination URL */
  ctaUrl?: string;
  /** Secondary call-to-action button label */
  ctaSecondaryText?: string;
  /** Secondary call-to-action destination URL */
  ctaSecondaryUrl?: string;
}

export default function HeroCentered({
  headline,
  subheadline,
  ctaText,
  ctaUrl,
  ctaSecondaryText,
  ctaSecondaryUrl,
}: HeroCenteredProps) {
  return (
    <section className="w-full bg-gradient-to-b from-primary/5 to-base-100">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32 lg:py-40">
        <h1 className="font-sans text-4xl font-bold leading-tight tracking-tight text-base-content sm:text-5xl md:text-6xl">
          {headline}
        </h1>

        {subheadline && (
          <p className="mx-auto mt-6 max-w-2xl font-sans text-lg leading-relaxed text-base-content/70 sm:text-xl">
            {subheadline}
          </p>
        )}

        {(ctaText || ctaSecondaryText) && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {ctaText && ctaUrl && (
              <a
                href={ctaUrl}
                className="inline-block rounded-box bg-primary px-8 py-3 font-sans text-base font-semibold text-primary-content transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {ctaText}
              </a>
            )}

            {ctaSecondaryText && ctaSecondaryUrl && (
              <a
                href={ctaSecondaryUrl}
                className="inline-block rounded-box border border-base-300 bg-base-100 px-8 py-3 font-sans text-base font-semibold text-base-content transition-colors hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {ctaSecondaryText}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
