"use client";

import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CtaFloatingProps {
  /** CTA button text */
  ctaText: string;
  /** CTA button URL */
  ctaUrl: string;
  /** CTA button style */
  ctaStyle?: CtaVariant;
  /** CTA color scheme */
  ctaColorScheme?: ColorScheme;
  /** Position on screen */
  position?: "bottom-right" | "bottom-center" | "bottom-left";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const positionClasses = {
  "bottom-right": "bottom-6 right-6",
  "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-6 left-6",
} as const;

export default function CtaFloating({
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  position = "bottom-right",
  className,
}: CtaFloatingProps) {
  return (
    <div className={cn("fixed z-50", positionClasses[position], className)}>
      <CtaButton variant={ctaStyle} colorScheme={ctaColorScheme} href={ctaUrl}>
        {ctaText}
      </CtaButton>
    </div>
  );
}
