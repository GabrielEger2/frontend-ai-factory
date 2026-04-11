import React from "react";

export interface HeroSplitProps {
  /** Primary headline text */
  headline: string;
  /** Supporting subheadline text */
  subheadline?: string;
  /** Call-to-action button label */
  ctaText?: string;
  /** Call-to-action destination URL */
  ctaUrl?: string;
  /** Hero image source URL */
  imageSrc?: string;
  /** Alt text for the hero image */
  imageAlt?: string;
  /** Eyebrow badge label above the headline */
  badgeText?: string;
}

export default function HeroSplit({
  headline,
  subheadline,
  ctaText,
  ctaUrl,
  imageSrc,
  imageAlt,
  badgeText,
}: HeroSplitProps) {
  return (
    <section className="w-full bg-base-100">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-6 py-20 lg:flex-row lg:gap-16 lg:py-28">
        {/* Text column */}
        <div className="flex flex-1 flex-col items-start">
          {badgeText && (
            <span className="mb-4 inline-block rounded-selector bg-primary/10 px-3 py-1 font-sans text-sm font-semibold tracking-wide text-primary">
              {badgeText}
            </span>
          )}

          <h1 className="font-sans text-4xl font-bold leading-tight tracking-tight text-base-content sm:text-5xl">
            {headline}
          </h1>

          {subheadline && (
            <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-base-content/70">
              {subheadline}
            </p>
          )}

          {ctaText && ctaUrl && (
            <div className="mt-10">
              <a
                href={ctaUrl}
                className="inline-block rounded-box bg-primary px-8 py-3 font-sans text-base font-semibold text-primary-content transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {ctaText}
              </a>
            </div>
          )}
        </div>

        {/* Image column */}
        <div className="flex flex-1 items-center justify-center">
          {imageSrc && (
            <img
              src={imageSrc}
              alt={imageAlt || ""}
              className="aspect-[4/3] w-full rounded-box object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
