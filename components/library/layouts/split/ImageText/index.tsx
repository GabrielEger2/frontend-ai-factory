"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { CtaButton } from "@ui/button";
import { containerVariants, fadeUp, imageReveal } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ImageTextProps {
  /** Section heading — large display text */
  headline: string;
  /** Body text below the heading */
  description: string;
  /** CTA button text */
  ctaText: string;
  /** CTA destination URL */
  ctaUrl: string;
  /** Site-wide style configuration — provides ctaVariant and ctaColorScheme */
  styleKit?: StyleKit;
  /** Section image */
  image: string;
  imageAlt: string;
  /** Small label displayed above the headline */
  label?: string;
  /** Whether image appears on the left (default) or right */
  imagePosition?: "left" | "right";
  /** Background color scheme */
  colorScheme?: "light" | "dark";
  /** Informational purpose tag for the section */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ImageText({
  headline,
  description,
  ctaText,
  ctaUrl,
  styleKit,
  image,
  imageAlt,
  label,
  imagePosition = "left",
  colorScheme = "light",
  purpose,
  className,
}: ImageTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeImg = useSafeImageSrc(image, "layout-imagetext-01-image", 600, 400);

  const isDark = colorScheme === "dark";
  const isReversed = imagePosition === "right";

  return (
    <section
      data-purpose={purpose}
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
            src={safeImg.src}
            onError={safeImg.onError}
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
              variant={styleKit?.ctaVariant ?? "default"}
              colorScheme={styleKit?.ctaColorScheme ?? "primary"}
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
