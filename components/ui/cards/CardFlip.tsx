"use client";

import { cn } from "@lib/utils";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CardFlipProps {
  /** Content rendered on the front face */
  front: React.ReactNode;
  /** Content rendered on the back face */
  back: React.ReactNode;
  /** Flip transition speed in seconds. Defaults to 0.3 */
  duration?: number;
  /** Flip axis. Defaults to "horizontal" */
  flipDirection?: "horizontal" | "vertical";
  /** Direction the card rotates. Defaults to "forward" */
  flipRotation?: "forward" | "reverse";
  className?: string;
  /** Classes applied to both front and back panels */
  panelClassName?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CardFlip — a 3D flip card that reveals a back face on hover.
 *
 * Accepts arbitrary `front` and `back` ReactNode content so it can
 * wrap any card layout (including `<CardBase />`).
 */
export function CardFlip({
  front,
  back,
  duration = 0.3,
  className,
  panelClassName,
  flipDirection = "horizontal",
  flipRotation = "forward",
}: CardFlipProps) {
  const rotate = useMotionValue(0);
  const rotateSpring = useSpring(rotate, {
    stiffness: (1 / duration) * 50,
    damping: 30,
  });

  const handleMouseEnter = () => {
    const isVertical = flipDirection === "vertical";
    const isForward = flipRotation === "forward";

    const angle = isVertical
      ? isForward
        ? -180
        : 180
      : isForward
        ? 180
        : -180;

    rotate.set(angle);
  };

  const handleMouseLeave = () => rotate.set(0);

  const rotateStyle =
    flipDirection === "horizontal"
      ? { rotateY: rotateSpring }
      : { rotateX: rotateSpring };

  const backfaceTransform =
    flipDirection === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)";

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className={cn("relative h-72 w-56", className)}
    >
      <motion.div
        style={{
          ...rotateStyle,
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        {/* Front face */}
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-full overflow-hidden rounded-box border border-base-300 bg-base-200 shadow-sm [backface-visibility:hidden]",
            panelClassName,
          )}
        >
          {front}
        </div>

        {/* Back face */}
        <div
          style={{ transform: backfaceTransform }}
          className={cn(
            "absolute left-0 top-0 h-full w-full overflow-hidden rounded-box border border-base-300 bg-base-200 shadow-sm [backface-visibility:hidden]",
            panelClassName,
          )}
        >
          {back}
        </div>
      </motion.div>
    </motion.div>
  );
}
