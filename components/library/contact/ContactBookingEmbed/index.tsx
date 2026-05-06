"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FiCheck, FiClock, FiVideo } from "react-icons/fi";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ContactBookingEmbedProps {
  /** Optional eyebrow above the headline */
  eyebrow?: string;
  /** Section heading */
  headline: string;
  /** Supporting paragraph */
  description?: string;

  /**
   * Embed URL — e.g. https://cal.com/your-handle/intro?embed=true
   * or https://calendly.com/your-handle/intro?embed_domain=...&embed_type=Inline
   * The component renders this in an iframe; pass any provider-specific
   * URL params (color, hide-event-details) on the URL itself.
   */
  embedUrl: string;
  /** Provider label rendered as a small footer ("Powered by Cal.com") */
  providerLabel?: string;
  /** Iframe minimum height in px. Defaults to 720 */
  embedMinHeight?: number;

  /** Bullet rows rendered in the left/info column */
  details?: Array<{
    /** Optional pre-set icon — defaults to a checkmark */
    icon?: "check" | "clock" | "video";
    /** Bold label (e.g. "30 minutes") */
    label: string;
    /** Optional supporting line */
    description?: string;
  }>;

  /** Optional fallback CTA copy when the iframe fails or the visitor prefers email */
  fallbackPromptText?: string;
  /** Email address used by the fallback "email instead" link */
  fallbackEmailUrl?: string;
  /** Display text for the fallback link */
  fallbackEmailText?: string;
  /** Visual variant for the fallback CTA */
  fallbackCtaStyle?: CtaVariant;
  /** Color scheme for the fallback CTA */
  fallbackCtaColorScheme?: ColorScheme;

  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const ICON_MAP = {
  check: FiCheck,
  clock: FiClock,
  video: FiVideo,
} as const;

/**
 * ContactBookingEmbed -- a calendar-embed contact section. Left column
 * is editorial context (headline, what to expect, fallback email);
 * right column is an iframe to Cal.com / Calendly / SavvyCal.
 *
 * The embedUrl is passed through verbatim — pass theming and event-id
 * params on the URL itself.
 */
export default function ContactBookingEmbed({
  eyebrow,
  headline,
  description,
  embedUrl,
  providerLabel = "Powered by Cal.com",
  embedMinHeight = 720,
  details,
  fallbackPromptText = "Or skip the calendar and email me directly",
  fallbackEmailUrl,
  fallbackEmailText,
  fallbackCtaStyle = "default",
  fallbackCtaColorScheme = "primary",
  className,
}: ContactBookingEmbedProps) {
  const shouldReduceMotion = useReducedMotion();

  const reveal = shouldReduceMotion
    ? { initial: false }
    : ({
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.3, ease: "easeOut" as const },
      } as const);

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_3fr)] lg:gap-16">
        {/* ----- Left — context + details ----- */}
        <motion.div className="flex flex-col gap-6" {...reveal}>
          <div className="flex flex-col gap-3">
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                {eyebrow}
              </span>
            )}
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-base-content md:text-4xl lg:text-5xl">
              {headline}
            </h2>
            {description && (
              <p className="max-w-xl text-base leading-relaxed text-base-content/65 md:text-lg">
                {description}
              </p>
            )}
          </div>

          {details && details.length > 0 && (
            <ul className="mt-2 flex flex-col gap-4 border-t border-base-300 pt-6">
              {details.map((row, idx) => {
                const Icon = ICON_MAP[row.icon ?? "check"];
                return (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-base-content md:text-base">
                        {row.label}
                      </span>
                      {row.description && (
                        <span className="text-sm text-base-content/65">
                          {row.description}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {fallbackEmailUrl && fallbackEmailText && (
            <div className="mt-2 flex flex-col gap-3 border-t border-base-300 pt-6">
              <p className="text-sm text-base-content/65">
                {fallbackPromptText}
              </p>
              <div className="self-start">
                <CtaButton
                  variant={fallbackCtaStyle}
                  colorScheme={fallbackCtaColorScheme}
                  href={fallbackEmailUrl}
                >
                  {fallbackEmailText}
                </CtaButton>
              </div>
            </div>
          )}
        </motion.div>

        {/* ----- Right — embed ----- */}
        <motion.div
          className="flex flex-col gap-3"
          {...reveal}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-base-300 bg-base-200"
            style={{ minHeight: `${embedMinHeight}px` }}
          >
            <iframe
              src={embedUrl}
              title="Booking calendar"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allow="camera; microphone; autoplay; clipboard-read; clipboard-write"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          {providerLabel && (
            <p className="text-right text-xs text-base-content/45">
              {providerLabel}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
