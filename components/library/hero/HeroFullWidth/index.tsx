import React from "react";

export interface HeroFullWidthProps {
  /** Primary headline text */
  headline: string;
  /** Supporting subheadline text */
  subheadline?: string;
  /** Call-to-action button label */
  ctaText?: string;
  /** Call-to-action destination URL */
  ctaUrl?: string;
  /** Background image source URL */
  imageSrc?: string;
  /** Alt text for the background image */
  imageAlt?: string;
}

export default function HeroFullWidth({
  headline,
  subheadline,
  ctaText,
  ctaUrl,
  imageSrc,
  imageAlt,
}: HeroFullWidthProps) {
  return (
    <section className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden bg-base-300">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={imageAlt || ""}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Dark overlay for text legibility over the image */}
      <div className="absolute inset-0 bg-neutral/60" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
        <h1 className="font-sans text-4xl font-bold leading-tight tracking-tight text-neutral-content sm:text-5xl md:text-6xl">
          {headline}
        </h1>

        {subheadline && (
          <p className="mx-auto mt-6 max-w-2xl font-sans text-lg leading-relaxed text-neutral-content/80 sm:text-xl">
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
    </section>
  );
}
