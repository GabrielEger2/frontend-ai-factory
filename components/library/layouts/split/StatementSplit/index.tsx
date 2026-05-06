"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import {
  containerVariants,
  fadeUp,
  imageReveal,
  accentReveal,
} from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface StatementSplitProps {
  /** Large statement headline — rendered in italic display font */
  headline: string;
  /** Main body text — supports line breaks via \n */
  description: string;
  /** Bold closing line appended to the description */
  descriptionEmphasis?: string;
  /** Primary section image */
  image: string;
  imageAlt: string;
  /** Floating accent image — smaller overlay in the corner of the main image */
  accentImage?: string;
  accentImageAlt?: string;
  /** Background color scheme */
  colorScheme?: "dark" | "light";
  /** Whether the headline appears on the left (default) or right */
  headlinePosition?: "left" | "right";
  /** Site-wide style configuration */
  styleKit?: StyleKit;
  /** Informational purpose tag for the section */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function StatementSplit({
  headline,
  description,
  descriptionEmphasis,
  image,
  imageAlt,
  accentImage,
  accentImageAlt,
  colorScheme = "dark",
  headlinePosition = "left",
  styleKit,
  purpose,
  className,
}: StatementSplitProps) {
  // styleKit accepted for downstream propagation; no CTA in this component
  void styleKit;
  const shouldReduceMotion = useReducedMotion();
  const safeImg = useSafeImageSrc(
    image,
    "layout-statementsplit-01-image",
    800,
    520,
  );
  const safeAccentImg = useSafeImageSrc(
    accentImage,
    "layout-statementsplit-01-accent-image",
    224,
    224,
  );

  const isDark = colorScheme === "dark";
  const isReversed = headlinePosition === "right";

  return (
    <section
      data-purpose={purpose}
      className={cn(
        "relative w-full min-h-[100dvh]",
        isDark
          ? "bg-neutral text-neutral-content"
          : "bg-base-100 text-base-content",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-16 md:px-8 md:py-0 md:min-h-[100dvh]">
        <motion.div
          className={cn(
            "flex w-full flex-col gap-10 lg:gap-12",
            isReversed
              ? "lg:flex-row-reverse lg:items-end"
              : "lg:flex-row lg:items-end",
          )}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Headline column */}
          <motion.div
            variants={fadeUp}
            className={cn(
              "max-w-xl lg:flex-none lg:self-start lg:pt-10 lg:z-10",
              isReversed ? "lg:-ml-24" : "lg:-mr-24",
            )}
          >
            <h2
              className={cn(
                "font-serif italic font-medium text-4xl leading-tight md:text-5xl lg:text-7xl",
                isDark ? "text-neutral-content" : "text-base-content",
              )}
            >
              {headline}
            </h2>
          </motion.div>

          {/* Image column */}
          <div className="relative lg:basis-[70%]">
            <motion.div
              variants={imageReveal}
              className="h-[260px] w-full overflow-hidden md:h-[380px] lg:h-[520px]"
            >
              <img
                src={safeImg.src}
                onError={safeImg.onError}
                alt={imageAlt}
                className="h-full w-full max-w-none object-cover"
                loading="lazy"
              />
            </motion.div>

            {/* Floating accent image */}
            {accentImage && (
              <motion.div
                variants={accentReveal}
                className="absolute -left-10 -bottom-10 hidden h-40 w-40 overflow-hidden md:block lg:h-56 lg:w-56"
              >
                <img
                  src={safeAccentImg.src}
                  onError={safeAccentImg.onError}
                  alt={accentImageAlt ?? ""}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            )}
          </div>

          {/* Description column */}
          <motion.div
            variants={fadeUp}
            className={cn(
              "max-w-sm",
              isReversed ? "lg:self-start" : "lg:self-end",
            )}
          >
            <p
              className={cn(
                "text-base leading-relaxed md:text-lg",
                isDark ? "text-neutral-content/80" : "text-base-content/70",
              )}
            >
              {description}
              {descriptionEmphasis && (
                <>
                  <br />
                  <br />
                  <span className="font-semibold">{descriptionEmphasis}</span>
                </>
              )}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
