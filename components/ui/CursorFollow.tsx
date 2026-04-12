"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@lib/utils";
import { useCursorPosition } from "@hooks/useCursorPosition";

export interface CursorFollowProps {
  /** Content to render inside the cursor-tracking area */
  children: React.ReactNode;
  /** Additional CSS classes for the outer container */
  className?: string;
  /** Size of the default cursor dot in pixels (default: 16) */
  dotSize?: number;
  /** Height of the expanded text bubble in pixels (default: 40) */
  bubbleHeight?: number;
  /** Minimum width of the expanded text bubble in pixels (default: 40) */
  minBubbleWidth?: number;
  /** Horizontal padding inside the text bubble in pixels (default: 16) */
  textPadding?: number;
  /** Spring stiffness for cursor follow (default: 350) */
  stiffness?: number;
  /** Spring damping for cursor follow (default: 40) */
  damping?: number;
}

const EASE_CURSOR: [number, number, number, number] = [0.645, 0.045, 0.355, 1];

export function CursorFollow({
  children,
  className,
  dotSize = 16,
  bubbleHeight: bubbleHeightProp = 40,
  minBubbleWidth = 40,
  textPadding = 32,
  stiffness = 350,
  damping = 40,
}: CursorFollowProps) {
  const { x: mouseX, y: mouseY } = useCursorPosition();
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [textWidth, setTextWidth] = useState<number>(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness, damping });
  const springY = useSpring(y, { stiffness, damping });

  const bubbleWidth = cursorText
    ? Math.max(textWidth + textPadding, minBubbleWidth)
    : dotSize;
  const bubbleHeight = cursorText ? bubbleHeightProp : dotSize;

  useEffect(() => {
    x.set(mouseX - bubbleWidth / 2);
    y.set(mouseY - bubbleHeight / 2);
  }, [mouseX, mouseY, bubbleWidth, bubbleHeight, x, y]);

  useEffect(() => {
    if (pendingText && measureRef.current) {
      const width = measureRef.current.offsetWidth;
      setTextWidth(width);
      setCursorText(pendingText);
      setPendingText(null);
    }
    if (!(pendingText || cursorText)) {
      setTextWidth(0);
    }
  }, [pendingText, cursorText]);

  const handleMouseOver = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const text = target.getAttribute("data-cursor-text");
    if (text) {
      setPendingText(text);
    }
  };

  const handleMouseOut = () => {
    setCursorText(null);
    setPendingText(null);
  };

  const handleFocus = (e: React.FocusEvent) => {
    const target = e.target as HTMLElement;
    const text = target.getAttribute("data-cursor-text");
    if (text) {
      setPendingText(text);
    }
  };

  const handleBlur = () => {
    setCursorText(null);
    setPendingText(null);
  };

  return (
    <div
      className={cn("relative h-full w-full", className)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseOver}
      role="application"
      aria-label="Interactive area with custom cursor"
      style={{ minHeight: 300, cursor: "none" }}
      tabIndex={0}
    >
      {children}

      <motion.div
        animate={
          shouldReduceMotion
            ? { opacity: 1, scale: 1 }
            : {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.25, ease: EASE_CURSOR },
              }
        }
        className="pointer-events-none fixed z-50"
        exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.7 }}
        initial={
          shouldReduceMotion
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.7 }
        }
        style={{ left: 0, top: 0, x: springX, y: springY }}
      >
        <motion.div
          animate={
            cursorText
              ? {
                  width: bubbleWidth,
                  height: bubbleHeightProp,
                  borderRadius: bubbleHeightProp / 2,
                  paddingLeft: textPadding / 2,
                  paddingRight: textPadding / 2,
                  minWidth: minBubbleWidth,
                  minHeight: 32,
                  scale: 1.1,
                }
              : {
                  width: dotSize,
                  height: dotSize,
                  borderRadius: 999,
                  paddingLeft: 0,
                  paddingRight: 0,
                  minWidth: dotSize,
                  minHeight: dotSize,
                  scale: 1,
                }
          }
          className={cn(
            "flex items-center justify-center font-medium text-xs",
            "bg-primary text-primary-content shadow-lg",
          )}
          layout
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.25, ease: EASE_CURSOR }
          }
        >
          {cursorText && (
            <motion.span
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              initial={{ opacity: 0, filter: "blur(8px)" }}
              className="w-full whitespace-nowrap text-center text-primary-content"
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.2, delay: 0.05, ease: EASE_CURSOR }
              }
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>

        {/* Hidden span for pre-measuring text width */}
        {(pendingText || cursorText) && (
          <span
            ref={measureRef}
            className="pointer-events-none invisible absolute whitespace-nowrap text-xs font-medium"
            style={{
              paddingLeft: textPadding / 2,
              paddingRight: textPadding / 2,
            }}
          >
            {pendingText || cursorText}
          </span>
        )}
      </motion.div>
    </div>
  );
}
