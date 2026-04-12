"use client";

import { type CSSProperties, type HTMLAttributes } from "react";
import {
  motion,
  type DOMMotionComponents,
  type MotionProps,
} from "motion/react";
import { cn } from "@lib/utils";

const motionElements = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  p: motion.p,
  span: motion.span,
} as const;

type MotionElementType = Extract<
  keyof DOMMotionComponents,
  keyof typeof motionElements
>;

export interface LineShadowTextProps
  extends Omit<HTMLAttributes<HTMLElement>, keyof MotionProps>, MotionProps {
  /** The text to display with an animated line shadow behind it */
  children: string;
  /** Shadow color — use a CSS color value (default: uses base-content token via CSS variable) */
  shadowColor?: string;
  /** HTML element to render as (default: "span") */
  as?: MotionElementType;
}

export function LineShadowText({
  children,
  shadowColor,
  className,
  as: Component = "span",
  ...props
}: LineShadowTextProps) {
  const MotionComponent = motionElements[Component];

  return (
    <MotionComponent
      style={
        shadowColor
          ? ({ "--shadow-color": shadowColor } as CSSProperties)
          : undefined
      }
      className={cn(
        "relative z-0 inline-flex",
        "after:absolute after:top-[0.04em] after:left-[0.04em] after:content-[attr(data-text)]",
        "after:bg-[linear-gradient(45deg,transparent_45%,var(--shadow-color,oklch(var(--color-base-content)))_45%,var(--shadow-color,oklch(var(--color-base-content)))_55%,transparent_0)]",
        "after:-z-10 after:bg-[length:0.06em_0.06em] after:bg-clip-text after:text-transparent",
        "after:animate-line-shadow",
        className,
      )}
      data-text={children}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
