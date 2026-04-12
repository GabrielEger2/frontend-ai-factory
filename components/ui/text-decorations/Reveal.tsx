"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "motion/react";

export interface RevealProps {
  children: React.ReactNode;
  /** Color of the sliding overlay. Defaults to the theme's accent color. */
  color?: string;
}

export function Reveal({ children, color }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      slideControls.start("visible");
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <div ref={ref} className="relative overflow-hidden w-fit">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>

      <motion.div
        variants={{
          hidden: { x: 0 },
          visible: { x: "101%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: 0.5, ease: "easeIn" }}
        className="absolute top-0 left-0 h-full w-full z-20 will-change-transform transform-gpu bg-accent"
        style={color ? { backgroundColor: color } : undefined}
      />
    </div>
  );
}
