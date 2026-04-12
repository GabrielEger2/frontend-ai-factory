"use client";

import { useId } from "react";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface StripedPatternProps {
  /** Stripe width in pixels @default 4 */
  stripeWidth?: number;
  /** Gap between stripes in pixels @default 6 */
  gap?: number;
  /** Rotation angle of stripes in degrees @default 45 */
  angle?: number;
  /** Additional CSS classes for the SVG container */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function StripedPattern({
  stripeWidth = 4,
  gap = 6,
  angle = 45,
  className,
}: StripedPatternProps) {
  const id = useId();
  const patternSize = stripeWidth + gap;

  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={`${id}-stripe`}
          width={patternSize}
          height={patternSize}
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${angle})`}
        >
          <rect
            width={stripeWidth}
            height={patternSize}
            fill="oklch(var(--color-base-300) / 0.5)"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-stripe)`} />
    </svg>
  );
}
