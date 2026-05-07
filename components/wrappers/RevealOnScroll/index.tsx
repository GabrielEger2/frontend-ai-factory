"use client";

import { Children, isValidElement } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type RevealDirection = "up" | "down" | "left" | "right" | "fade";

/**
 * RevealOnScroll is a hand-authored page-template wrapper, NOT a
 * Composer-pickable library component. It accepts arbitrary children
 * (React.ReactNode) and stagger-reveals each top-level child as it
 * enters the viewport. The whole point is wrapping nested content —
 * the AI pipeline never sees it.
 */
export interface RevealOnScrollProps {
  /** Children to reveal in sequence — each top-level child becomes one beat */
  children?: React.ReactNode;
  /** Direction of the reveal motion. Defaults to "up" */
  direction?: RevealDirection;
  /** Pixel distance the child travels into place. Defaults to 24 */
  distance?: number;
  /** Delay between each child reveal in seconds. Defaults to 0.08 */
  stagger?: number;
  /** Duration of each reveal in seconds. Defaults to 0.6 */
  duration?: number;
  /** Viewport margin for triggering the reveal (CSS string). Defaults to "-10% 0px" */
  viewportMargin?: string;
  /** Reveal each child only once. Defaults to true */
  once?: boolean;
  /** Site-wide style kit threaded by the host page */
  styleKit?: StyleKit;
  /** Informational purpose tag attached as data attribute */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_CHILDREN = (
  <>
    <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-base-content/60">
        Reveal on scroll
      </p>
      <h2 className="mt-4 text-4xl font-bold text-base-content sm:text-5xl">
        Wrap any content. Animate it in.
      </h2>
    </div>
    <div className="mx-auto grid w-full max-w-5xl gap-6 px-6 py-12 md:grid-cols-3">
      {[1, 2, 3].map((n) => (
        <div key={n} className="rounded-2xl bg-base-200 p-8 text-base-content">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-base-content/60">
            Card {n}
          </p>
          <p className="text-lg">
            Each top-level child becomes one beat in the reveal sequence,
            staggered as it enters the viewport.
          </p>
        </div>
      ))}
    </div>
    <div className="mx-auto w-full max-w-2xl px-6 py-16 text-center">
      <p className="text-base text-base-content/70 md:text-lg">
        Honors `prefers-reduced-motion`. Defaults travel 24px upward over 600ms
        with an 80ms stagger between siblings.
      </p>
    </div>
  </>
);

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitialOffset(
  direction: RevealDirection,
  distance: number,
): { x: number; y: number } {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    case "fade":
    default:
      return { x: 0, y: 0 };
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function RevealOnScroll({
  children = DEFAULT_CHILDREN,
  direction = "up",
  distance = 24,
  stagger = 0.08,
  duration = 0.6,
  viewportMargin = "-10% 0px",
  once = true,
  styleKit: _styleKit,
  purpose,
  className,
}: RevealOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();
  const offset = getInitialOffset(direction, distance);

  const items = Children.toArray(children).filter((child) => {
    if (typeof child === "string") return child.trim().length > 0;
    if (typeof child === "number") return true;
    return isValidElement(child);
  });

  return (
    <div className={cn("w-full", className)} data-purpose={purpose}>
      {items.map((child, idx) => (
        <motion.div
          key={idx}
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, x: offset.x, y: offset.y }
          }
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once, margin: viewportMargin }}
          transition={{
            duration,
            delay: idx * stagger,
            ease: "easeOut",
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
