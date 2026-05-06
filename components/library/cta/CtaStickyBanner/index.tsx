"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CtaStickyBannerProps {
  /** Optional small label rendered before the headline (e.g. "New") */
  badge?: string;
  /** Section headline / message */
  headline: string;
  /** Optional supporting copy beside the headline */
  description?: string;
  /** Primary CTA copy */
  ctaText: string;
  /** Primary CTA destination */
  ctaUrl: string;
  /** Optional secondary text-link CTA */
  secondaryText?: string;
  secondaryUrl?: string;
  /** Pixels of vertical scroll before the banner appears. Defaults to 480 */
  appearAfterPx?: number;
  /** Whether to show the dismiss (X) control. Defaults to true */
  dismissible?: boolean;
  /**
   * "neutral" — bg-base-100 with hairline (default)
   * "muted" — bg-base-200 surface
   * "inverse" — bg-base-content text-base-100
   * "primary" — bg-primary text-primary-content
   */
  tone?: "neutral" | "muted" | "inverse" | "primary";
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CtaStickyBanner -- a fixed-bottom CTA banner that slides into view
 * after the visitor scrolls past `appearAfterPx`. Includes an optional
 * dismiss control and four tone variants.
 *
 * Sits at z-40 above the page; remember to leave room for any fixed
 * footer chat-widget your site uses (this clears the bottom edge by
 * default — see `bottom-4` below).
 */
export default function CtaStickyBanner({
  badge,
  headline,
  description,
  ctaText,
  ctaUrl,
  secondaryText,
  secondaryUrl,
  appearAfterPx = 480,
  dismissible = true,
  tone = "neutral",
  styleKit,
  className,
}: CtaStickyBannerProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant: CtaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme: ColorScheme = styleKit?.ctaColorScheme ?? "primary";

  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY >= appearAfterPx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [appearAfterPx]);

  const isInverse = tone === "inverse";
  const isPrimaryTone = tone === "primary";

  const surfaceClass = cn(
    "rounded-2xl ring-1 backdrop-blur",
    tone === "neutral" && "bg-base-100/95 ring-base-300",
    tone === "muted" && "bg-base-200/95 ring-base-300",
    isInverse && "bg-base-content/95 text-base-100 ring-base-100/15",
    isPrimaryTone && "bg-primary/95 text-primary-content ring-primary/30",
  );

  const headingClass = cn(
    "text-sm font-semibold leading-snug md:text-base",
    isInverse
      ? "text-base-100"
      : isPrimaryTone
        ? "text-primary-content"
        : "text-base-content",
  );

  const bodyClass = cn(
    "text-xs md:text-sm",
    isInverse
      ? "text-base-100/70"
      : isPrimaryTone
        ? "text-primary-content/85"
        : "text-base-content/65",
  );

  const badgeClass = cn(
    "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]",
    isInverse
      ? "bg-base-100/15 text-base-100"
      : isPrimaryTone
        ? "bg-primary-content/15 text-primary-content"
        : "bg-primary/10 text-primary",
  );

  const secondaryLinkClass = cn(
    "inline-flex items-center gap-1 text-sm font-medium underline-offset-4 transition-colors",
    isInverse
      ? "text-base-100/80 hover:text-base-100 hover:underline"
      : isPrimaryTone
        ? "text-primary-content/85 hover:text-primary-content hover:underline"
        : "text-base-content/70 hover:text-base-content hover:underline",
  );

  const dismissBtnClass = cn(
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100",
    isInverse
      ? "text-base-100/65 hover:bg-base-100/10 hover:text-base-100"
      : isPrimaryTone
        ? "text-primary-content/75 hover:bg-primary-content/10 hover:text-primary-content"
        : "text-base-content/55 hover:bg-base-200 hover:text-base-content",
  );

  const shouldRender = isVisible && !isDismissed;

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          role="region"
          aria-label="Site-wide promotion"
          className={cn(
            "pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 md:px-6 md:pb-4",
            className,
          )}
          initial={
            shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.25,
            ease: "easeOut",
          }}
        >
          <div className="pointer-events-auto mx-auto max-w-5xl">
            <div
              className={cn(
                "flex flex-col gap-3 px-4 py-3 shadow-lg md:flex-row md:items-center md:gap-5 md:py-3",
                surfaceClass,
              )}
            >
              {/* Copy */}
              <div className="flex flex-1 flex-wrap items-start gap-x-3 gap-y-1 md:items-center">
                {badge && <span className={badgeClass}>{badge}</span>}
                <p className={headingClass}>{headline}</p>
                {description && (
                  <p className={cn("hidden md:inline", bodyClass)}>
                    {description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {secondaryText && secondaryUrl && (
                  <a
                    href={secondaryUrl}
                    className={cn("hidden md:inline-flex", secondaryLinkClass)}
                  >
                    <span>{secondaryText}</span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                )}
                <CtaButton
                  variant={ctaVariant}
                  colorScheme={
                    isInverse
                      ? "neutral"
                      : isPrimaryTone
                        ? "neutral"
                        : ctaColorScheme
                  }
                  href={ctaUrl}
                  className="text-sm"
                >
                  {ctaText}
                </CtaButton>
                {dismissible && (
                  <button
                    type="button"
                    aria-label="Dismiss banner"
                    onClick={() => setIsDismissed(true)}
                    className={dismissBtnClass}
                  >
                    <FiX className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
