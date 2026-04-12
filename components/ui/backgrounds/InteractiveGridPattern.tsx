"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface InteractiveGridPatternProps {
  /** Grid cell width in pixels @default 40 */
  width?: number;
  /** Grid cell height in pixels @default 40 */
  height?: number;
  /** Number of grid columns @default 41 */
  columns?: number;
  /** Number of grid rows @default 41 */
  rows?: number;
  /** SVG stroke width for grid lines @default 1 */
  strokeWidth?: number;
  /** How many squares radiate outward from the hovered cell @default 1 */
  maxActiveSquares?: number;
  /** Additional CSS classes for the SVG container */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  columns = 41,
  rows = 41,
  strokeWidth = 1,
  maxActiveSquares = 1,
  className,
}: InteractiveGridPatternProps) {
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeSquares, setActiveSquares] = useState<
    { row: number; col: number }[]
  >([]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const col = Math.floor(x / width);
      const row = Math.floor(y / height);

      if (col < 0 || col >= columns || row < 0 || row >= rows) {
        setActiveSquares([]);
        return;
      }

      const newActive: { row: number; col: number }[] = [];
      for (let dr = -maxActiveSquares; dr <= maxActiveSquares; dr++) {
        for (let dc = -maxActiveSquares; dc <= maxActiveSquares; dc++) {
          const r = row + dr;
          const c = col + dc;
          if (r >= 0 && r < rows && c >= 0 && c < columns) {
            newActive.push({ row: r, col: c });
          }
        }
      }
      setActiveSquares(newActive);
    },
    [width, height, columns, rows, maxActiveSquares],
  );

  const handleMouseLeave = useCallback(() => {
    setActiveSquares([]);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.addEventListener("mousemove", handleMouseMove);
    svg.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      svg.removeEventListener("mousemove", handleMouseMove);
      svg.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <svg
      ref={svgRef}
      className={cn(
        "pointer-events-auto absolute inset-0 h-full w-full",
        className,
      )}
      width={columns * width}
      height={rows * height}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={`${id}-grid`}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <rect
            width={width}
            height={height}
            fill="none"
            stroke="oklch(var(--color-base-300) / 0.5)"
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill={`url(#${id}-grid)`} />

      {activeSquares.map(({ row, col }) => (
        <rect
          key={`${row}-${col}`}
          x={col * width}
          y={row * height}
          width={width}
          height={height}
          fill="oklch(var(--color-primary) / 0.15)"
          stroke="oklch(var(--color-primary) / 0.3)"
          strokeWidth={strokeWidth}
          className="transition-all duration-200 ease-out"
        />
      ))}
    </svg>
  );
}
