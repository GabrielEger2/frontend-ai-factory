"use client";

import { cn } from "@lib/utils";
import { motion, useReducedMotion } from "motion/react";

export interface TextRevealProps {
  /** The text string to animate */
  children: string;
  /** Additional CSS classes applied to each segment span */
  className?: string;
  /** Blur amount in px applied during the reveal (default: 10) */
  blur?: number;
  /** Stagger delay in seconds between each segment (default: 0.08) */
  delay?: number;
  /** Duration in seconds for each segment animation (default: 0.3) */
  duration?: number;
  /** Direction segments animate from (default: "bottom") */
  from?: "top" | "bottom";
  /** Split text by word or individual letter (default: "word") */
  split?: "word" | "letter";
  /** Trigger animation when element scrolls into view instead of on mount (default: true) */
  triggerOnView?: boolean;
}

export function TextReveal({
  children,
  className,
  blur = 10,
  delay = 0.08,
  duration = 0.3,
  from = "bottom",
  split = "word",
  triggerOnView = true,
}: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const segments =
    split === "word" ? children.split(" ") : children.split(/(?=.)/);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: delay },
    },
  };

  const segmentVariants = {
    hidden: {
      opacity: 0,
      y: from === "bottom" ? "50%" : "-50%",
      filter: `blur(${blur}px)`,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        ease: [0.18, 0.89, 0.82, 1.04] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.span
      className="inline"
      variants={containerVariants}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      {...(triggerOnView
        ? { whileInView: "visible", viewport: { once: true, margin: "-100px" } }
        : { animate: "visible" })}
      aria-label={children}
    >
      {segments.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          variants={segmentVariants}
          className={cn(
            "inline-block leading-none",
            split === "word" ? "mr-[0.25em]" : "",
            className,
          )}
        >
          {segment === " " ? "\u00A0" : segment}
        </motion.span>
      ))}
      <span className="sr-only">{children}</span>
    </motion.span>
  );
}
