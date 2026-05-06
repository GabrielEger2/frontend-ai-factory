"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import { buttonStyles } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FounderCredential {
  /** Short label (e.g. "Y Combinator W22", "Forbes 30u30 — 2024") */
  label: string;
  /** Optional URL to expand the credential */
  href?: string;
}

export interface TeamFounderSplitProps {
  /** Eyebrow above the headline (e.g. "Founder", "Quem está por trás") */
  eyebrow?: string;
  /** Section headline ("Meet Mariana", "About the founder") */
  headline: string;
  /** Founder full name */
  founderName: string;
  /** Founder role / title under the name */
  founderRole: string;
  /**
   * Bio paragraphs — each entry renders as its own <p>. 1 to 3 paragraphs
   * reads best.
   */
  bioParagraphs: string[];
  /** Founder portrait URL — falls back to seeded picsum */
  image?: string;
  /** Required alt text for the portrait */
  imageAlt?: string;
  /**
   * Optional handwritten signature image (PNG / SVG with transparent bg).
   * Renders below the bio at low opacity. When omitted, the typed name
   * ("— Mariana Cardoso") shows instead.
   */
  signatureImage?: string;
  /** Alt text for the signature image */
  signatureAlt?: string;
  /**
   * Optional credentials / proof points — short labels (awards, programs,
   * publications). Renders as a small inline list under the bio.
   */
  credentials?: FounderCredential[];
  /** Primary CTA — links to a longer bio page or contact */
  ctaText?: string;
  ctaUrl?: string;
  /** Optional secondary text-link CTA (e.g. "Read full bio") */
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  /**
   * Side the portrait sits on at desktop. Default "right".
   */
  portraitSide?: "left" | "right";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TeamFounderSplit — single-founder editorial split. Generous left
 * column with eyebrow, headline, multi-paragraph bio, optional
 * credentials and signature; right column carries a tall 4:5 portrait.
 * The portrait can swap sides via `portraitSide` for layout variety
 * across consecutive sections.
 */
export default function TeamFounderSplit({
  eyebrow,
  headline,
  founderName,
  founderRole,
  bioParagraphs,
  image,
  imageAlt,
  signatureImage,
  signatureAlt,
  credentials,
  ctaText,
  ctaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  portraitSide = "right",
  className,
}: TeamFounderSplitProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeImage = useSafeImageSrc(image, `founder-${founderName}`, 700, 875);

  const portraitFirst = portraitSide === "left";

  return (
    <section
      className={cn("w-full bg-base-100 py-16 md:py-24 lg:py-32", className)}
    >
      <div
        className={cn(
          "mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:px-8 lg:gap-16",
          "lg:grid-cols-[minmax(0,_1.05fr)_minmax(0,_1fr)]",
        )}
      >
        {/* Copy column */}
        <motion.div
          className={cn("flex flex-col gap-6", portraitFirst && "lg:order-2")}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              {eyebrow}
            </span>
          )}
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-base-content sm:text-4xl md:text-5xl">
            {headline}
          </h2>

          <div className="flex flex-col gap-1 border-l-2 border-primary/40 pl-4">
            <span className="text-base font-semibold text-base-content">
              {founderName}
            </span>
            <span className="text-sm text-base-content/65">{founderRole}</span>
          </div>

          <div className="flex max-w-[60ch] flex-col gap-4 text-base leading-relaxed text-base-content/75">
            {bioParagraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* Signature */}
          <div className="flex items-center gap-3 pt-2">
            {signatureImage ? (
              <img
                src={signatureImage}
                alt={signatureAlt ?? `Signature of ${founderName}`}
                className="h-10 w-auto opacity-80"
                loading="lazy"
              />
            ) : (
              <span className="font-serif text-xl italic text-base-content/70">
                — {founderName}
              </span>
            )}
          </div>

          {/* Credentials */}
          {credentials && credentials.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {credentials.map((c, i) => {
                const Tag: any = c.href ? "a" : "span";
                const tagProps = c.href ? { href: c.href } : {};
                return (
                  <li key={i}>
                    <Tag
                      {...tagProps}
                      className={cn(
                        "inline-flex items-center rounded-full border border-base-300 bg-base-200 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-base-content/70 transition-colors",
                        c.href &&
                          "hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      )}
                    >
                      {c.label}
                    </Tag>
                  </li>
                );
              })}
            </ul>
          )}

          {/* CTAs */}
          {(ctaText || secondaryCtaText) && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {ctaText && ctaUrl && (
                <a
                  href={ctaUrl}
                  className={buttonStyles({ variant: "primary", size: "lg" })}
                >
                  {ctaText}
                </a>
              )}
              {secondaryCtaText && secondaryCtaUrl && (
                <a
                  href={secondaryCtaUrl}
                  className="text-sm font-medium text-base-content underline-offset-4 transition hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                >
                  {secondaryCtaText} →
                </a>
              )}
            </div>
          )}
        </motion.div>

        {/* Portrait column */}
        <motion.div
          className={cn(portraitFirst && "lg:order-1")}
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-base-200 ring-1 ring-base-300">
            <img
              src={safeImage.src}
              onError={safeImage.onError}
              alt={imageAlt ?? `Portrait of ${founderName}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            {/* Soft caption ribbon */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral/70 via-neutral/15 to-transparent p-4 pt-12">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-content/85">
                {founderName} — {founderRole}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
