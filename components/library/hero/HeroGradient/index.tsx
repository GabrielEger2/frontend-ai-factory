import React from "react";

export interface HeroGradientProps {
  /** Primary headline text */
  headline: string;
  /** Supporting subheadline text */
  subheadline?: string;
  /** Call-to-action button label */
  ctaText?: string;
  /** Call-to-action destination URL */
  ctaUrl?: string;
  /** Eyebrow tagline above the headline */
  tagline?: string;
}

export default function HeroGradient({
  headline,
  subheadline,
  ctaText,
  ctaUrl,
  tagline,
}: HeroGradientProps) {
  return (
    <section className="hero-gradient-bg relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes hero-gradient-shift {
              0%, 100% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
            }
            .hero-gradient-bg {
              background: linear-gradient(
                135deg,
                oklch(var(--color-primary)),
                oklch(var(--color-secondary)),
                oklch(var(--color-accent)),
                oklch(var(--color-primary))
              );
              background-size: 300% 300%;
              animation: hero-gradient-shift 12s ease infinite;
            }
          `,
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
        {tagline && (
          <span className="mb-4 inline-block font-sans text-sm font-semibold uppercase tracking-widest text-primary-content/80">
            {tagline}
          </span>
        )}

        <h1 className="font-sans text-4xl font-bold leading-tight tracking-tight text-primary-content sm:text-5xl md:text-6xl">
          {headline}
        </h1>

        {subheadline && (
          <p className="mx-auto mt-6 max-w-2xl font-sans text-lg leading-relaxed text-primary-content/80 sm:text-xl">
            {subheadline}
          </p>
        )}

        {ctaText && ctaUrl && (
          <div className="mt-10">
            <a
              href={ctaUrl}
              className="inline-block rounded-box bg-base-100 px-8 py-3 font-sans text-base font-semibold text-base-content transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-base-100 focus:ring-offset-2"
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
