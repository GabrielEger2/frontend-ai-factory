"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ContentImageTextProps {
  /** Section heading — large display text */
  headline: string;
  /** Body text below the heading */
  description: string;
  /** CTA button text */
  ctaText: string;
  /** CTA destination URL */
  ctaUrl: string;
  /** CTA button style */
  ctaStyle?: CtaVariant;
  /** CTA color scheme */
  ctaColorScheme?: ColorScheme;
  /** Section image */
  image: string;
  imageAlt: string;
  /** Small label displayed above the headline */
  label?: string;
  /** Whether image appears on the left (default) or right */
  imagePosition?: "left" | "right";
  /** Background color scheme */
  colorScheme?: "light" | "dark";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const imageReveal = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ContentImageText({
  headline,
  description,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  image,
  imageAlt,
  label,
  imagePosition = "left",
  colorScheme = "light",
  className,
}: ContentImageTextProps) {
  const shouldReduceMotion = useReducedMotion();

  const isDark = colorScheme === "dark";
  const isReversed = imagePosition === "right";

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        isDark
          ? "bg-neutral text-neutral-content"
          : "bg-base-100 text-base-content",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 md:px-8 md:py-24 lg:flex-row lg:items-center",
          isReversed && "lg:flex-row-reverse",
        )}
      >
        {/* Image column */}
        <motion.div
          className="relative w-full lg:w-[45%]"
          variants={imageReveal}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <img
            src={image}
            alt={imageAlt}
            className="h-auto w-full object-cover"
            loading="lazy"
          />
        </motion.div>

        {/* Text column */}
        <motion.div
          className="w-full space-y-6 lg:w-[55%]"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {label && (
            <motion.p
              variants={fadeUp}
              className={cn(
                "text-sm font-semibold uppercase tracking-widest",
                isDark ? "text-primary" : "text-primary",
              )}
            >
              {label}
            </motion.p>
          )}

          <motion.h2
            variants={fadeUp}
            className={cn(
              "font-serif italic font-semibold text-4xl leading-[0.95] md:text-5xl lg:text-7xl",
              isDark ? "text-neutral-content" : "text-base-content",
            )}
          >
            {headline}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className={cn(
              "max-w-xl text-base leading-relaxed md:text-lg",
              isDark ? "text-neutral-content/70" : "text-base-content/70",
            )}
          >
            {description}
          </motion.p>

          <motion.div variants={fadeUp} className="pt-2">
            <CtaButton
              variant={ctaStyle}
              colorScheme={ctaColorScheme}
              href={ctaUrl}
            >
              {ctaText}
            </CtaButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
