"use client";

import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CtaFloatingProps {
  /** CTA button text */
  ctaText: string;
  /** CTA button URL */
  ctaUrl: string;
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
  position = "bottom-right",
  className,
}: CtaFloatingProps) {
  return (
    <div className={cn("fixed z-50", positionClasses[position], className)}>
      <a
        href={ctaUrl}
        className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg"
      >
        {ctaText}
      </a>
    </div>
  );
}
