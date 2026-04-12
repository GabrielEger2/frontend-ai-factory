"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Shape types                                                        */
/* ------------------------------------------------------------------ */

interface ShapeBase {
  /** Extra delay (seconds) on top of stagger. Defaults to 0. */
  delay?: number;
}

interface PathShape extends ShapeBase {
  type: "path";
  d: string;
}

interface CircleShape extends ShapeBase {
  type: "circle";
  cx: number;
  cy: number;
  r: number;
}

interface LineShape extends ShapeBase {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface RectShape extends ShapeBase {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  ry?: number;
}

interface EllipseShape extends ShapeBase {
  type: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export type SvgShape =
  | PathShape
  | CircleShape
  | LineShape
  | RectShape
  | EllipseShape;

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface AnimatedSvgBackgroundProps {
  /** Array of SVG shapes to draw. Use a preset like GEOMETRIC_SHAPES or define your own. */
  shapes: SvgShape[];
  /** Stroke color. Defaults to the theme's base-300 at 70% opacity. */
  stroke?: string;
  /** Stroke width. Defaults to 1. */
  strokeWidth?: number;
  /** SVG viewBox. Defaults to "0 0 1440 720". */
  viewBox?: string;
  /** Draw animation duration in seconds per shape. Defaults to 1.25. */
  duration?: number;
  /** Stagger delay between shapes in seconds. Defaults to 0.1. */
  stagger?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

function drawVariants(duration: number, delay: number) {
  return {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration, ease: "easeInOut" as const, delay },
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Shape renderer                                                     */
/* ------------------------------------------------------------------ */

function ShapeElement({
  shape,
  stroke,
  strokeWidth,
  duration,
}: {
  shape: SvgShape;
  stroke: string;
  strokeWidth: number;
  duration: number;
}) {
  const variants = drawVariants(duration, shape.delay ?? 0);
  const common = {
    style: { stroke },
    strokeWidth,
    fill: "none" as const,
    variants,
  };

  switch (shape.type) {
    case "path":
      return <motion.path d={shape.d} {...common} />;
    case "circle":
      return (
        <motion.circle cx={shape.cx} cy={shape.cy} r={shape.r} {...common} />
      );
    case "line":
      return (
        <motion.line
          x1={shape.x1}
          y1={shape.y1}
          x2={shape.x2}
          y2={shape.y2}
          {...common}
        />
      );
    case "rect":
      return (
        <motion.rect
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={shape.rx}
          ry={shape.ry}
          {...common}
        />
      );
    case "ellipse":
      return (
        <motion.ellipse
          cx={shape.cx}
          cy={shape.cy}
          rx={shape.rx}
          ry={shape.ry}
          {...common}
        />
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_STROKE = "oklch(var(--color-base-300) / 0.7)";

export function AnimatedSvgBackground({
  shapes,
  stroke = DEFAULT_STROKE,
  strokeWidth = 1,
  viewBox = "0 0 1440 720",
  duration = 1.25,
  stagger = 0.1,
  className,
}: AnimatedSvgBackgroundProps) {
  const ref = useRef<SVGSVGElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true });

  const animate = shouldReduceMotion || isInView ? "visible" : "hidden";

  return (
    <motion.svg
      ref={ref}
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 h-full w-full",
        className,
      )}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      variants={containerVariants}
      custom={stagger}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate={animate}
    >
      {shapes.map((shape, i) => (
        <ShapeElement
          key={i}
          shape={shape}
          stroke={stroke}
          strokeWidth={strokeWidth}
          duration={duration}
        />
      ))}
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Presets                                                            */
/* ------------------------------------------------------------------ */

/** The geometric pattern from HeroGeometric — circles and horizontal lines. */
export const GEOMETRIC_SHAPES: SvgShape[] = [
  { type: "path", d: "M-15.227 702.342H1439.7", delay: 0 },
  { type: "circle", cx: 711.819, cy: 372.562, r: 308.334, delay: 0.05 },
  { type: "circle", cx: 16.942, cy: 20.834, r: 308.334, delay: 0.15 },
  { type: "path", d: "M-15.227 573.66H1439.7", delay: 0.1 },
  { type: "path", d: "M-15.227 164.029H1439.7", delay: 0.2 },
  { type: "circle", cx: 782.595, cy: 411.166, r: 308.334, delay: 0.25 },
];
