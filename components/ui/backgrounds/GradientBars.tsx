"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface GradientBarsProps {
  /** Number of vertical bars @default 20 */
  bars?: number;
  /** CSS gradient color stops (from bottom to top) @default ["oklch(var(--color-primary))", "transparent"] */
  colors?: string[];
  /** Additional CSS classes for the container */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function GradientBars({
  bars = 20,
  colors,
  className,
}: GradientBarsProps) {
  const shouldReduceMotion = useReducedMotion();

  const defaultColors = ["oklch(var(--color-primary))", "transparent"];
  const resolvedColors = colors ?? defaultColors;
  const gradientStyle = `linear-gradient(to top, ${resolvedColors.join(", ")})`;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex h-full w-full">
        {Array.from({ length: bars }).map((_, index) => {
          const position = index / (bars - 1);
          const center = 0.5;
          const distance = Math.abs(position - center);
          const scale = 0.3 + 0.7 * Math.pow(distance * 2, 1.2);

          return (
            <motion.div
              key={`bg-bar-${index}`}
              className="flex-1 origin-bottom"
              style={{ background: gradientStyle }}
              animate={
                shouldReduceMotion
                  ? { scaleY: scale, opacity: 1 }
                  : {
                      scaleY: [scale, scale + 0.1, scale],
                      opacity: [1, 0.95, 1],
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 3,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: index * 0.5,
                    }
              }
            />
          );
        })}
      </div>
    </div>
  );
}
