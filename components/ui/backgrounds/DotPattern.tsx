"use client";

import { useId } from "react";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DotPatternProps {
  /** Horizontal spacing between dots @default 16 */
  width?: number;
  /** Vertical spacing between dots @default 16 */
  height?: number;
  /** Dot x offset within the cell @default 1 */
  x?: number;
  /** Dot y offset within the cell @default 1 */
  y?: number;
  /** Dot radius in pixels @default 1 */
  radius?: number;
  /** Additional CSS classes for the SVG container */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  radius = 1,
  className,
}: DotPatternProps) {
  const id = useId();

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
          id={`${id}-dot`}
          x={x}
          y={y}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="oklch(var(--color-base-300) / 0.7)"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-dot)`} />
    </svg>
  );
}
