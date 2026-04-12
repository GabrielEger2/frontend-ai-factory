"use client";

import { useLayoutEffect, useRef } from "react";
import type React from "react";
import { useInView } from "motion/react";
import { annotate } from "rough-notation";
import { type RoughAnnotation } from "rough-notation/lib/model";
import { cn } from "@lib/utils";

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

type ColorScheme =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

/** Resolve a CSS variable containing an OKLCH triplet to a usable color string. */
function resolveOklch(element: Element, varName: string): string {
  const raw = getComputedStyle(element).getPropertyValue(varName).trim();
  return raw ? `oklch(${raw})` : "";
}

export interface HighlighterProps {
  children: React.ReactNode;
  /** Rough-notation annotation style. Defaults to "highlight". */
  action?: AnnotationAction;
  /** Theme color scheme — resolves annotation color AND text content color from CSS variables. Takes precedence over `color`. */
  colorScheme?: ColorScheme;
  /** Custom annotation color (hex, rgb, etc.). Used when `colorScheme` is not set. */
  color?: string;
  /** Stroke width for the annotation drawing. */
  strokeWidth?: number;
  /** Duration of the drawing animation in ms. */
  animationDuration?: number;
  /** Number of drawing passes for a rougher look. */
  iterations?: number;
  /** Padding around the annotated element in px. */
  padding?: number;
  /** Whether the annotation should span multiple lines. */
  multiline?: boolean;
  /** When true, the annotation triggers only when scrolled into view. When false, it animates immediately. */
  triggerOnView?: boolean;
  /** Additional class names for the wrapper span. */
  className?: string;
}

export function Highlighter({
  children,
  action = "highlight",
  colorScheme,
  color,
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  triggerOnView = false,
  className,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  });

  const shouldShow = !triggerOnView || isInView;

  useLayoutEffect(() => {
    const element = elementRef.current;
    let annotation: RoughAnnotation | null = null;
    let resizeObserver: ResizeObserver | null = null;

    if (shouldShow && element) {
      let resolvedColor: string;
      let contentColor: string | undefined;

      if (colorScheme) {
        resolvedColor = resolveOklch(element, `--color-${colorScheme}`);
        contentColor = resolveOklch(element, `--color-${colorScheme}-content`);
      } else {
        resolvedColor = color ?? "#ffd1dc";
      }

      if (contentColor && action === "highlight") {
        element.style.color = contentColor;
      }

      const currentAnnotation = annotate(element, {
        type: action,
        color: resolvedColor,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      });
      annotation = currentAnnotation;
      currentAnnotation.show();

      resizeObserver = new ResizeObserver(() => {
        currentAnnotation.hide();
        currentAnnotation.show();
      });

      resizeObserver.observe(element);
      resizeObserver.observe(document.body);
    }

    return () => {
      annotation?.remove();
      resizeObserver?.disconnect();
      if (elementRef.current) {
        elementRef.current.style.color = "";
      }
    };
  }, [
    shouldShow,
    action,
    colorScheme,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
  ]);

  return (
    <span
      ref={elementRef}
      className={cn("relative inline-block bg-transparent", className)}
    >
      {children}
    </span>
  );
}
