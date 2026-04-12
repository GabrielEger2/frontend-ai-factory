"use client";

import { cn } from "@lib/utils";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CardRevealSlideProps {
  /** Background image URL */
  image: string;
  /** Accessible alt text for the image */
  imageAlt: string;
  /** Heading revealed under the image */
  title: string;
  /** Supporting text revealed under the image */
  description: string;
  /** CTA label shown in the bottom-right quadrant */
  ctaText?: string;
  /** CTA destination */
  ctaUrl?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Arrow icon (inline SVG — no external dep)           */
/* ------------------------------------------------------------------ */

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
    >
      <path
        d="M7 17L17 7M17 7H7M17 7v10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CardRevealSlide — on hover the image panel slides to the top-left
 * corner, revealing title/description underneath and a CTA link in
 * the bottom-right quadrant.
 *
 * Based on the "RevealCards" reference. Adapted to use semantic tokens,
 * slot props, and project motion conventions.
 */
export function CardRevealSlide({
  image,
  imageAlt,
  title,
  description,
  ctaText = "More",
  ctaUrl = "#",
  className,
}: CardRevealSlideProps) {
  return (
    <motion.article
      whileHover="hover"
      className={cn("relative h-[300px] w-full", className)}
      aria-label={title}
    >
      {/* Bottom-left: text content (visible after image slides) */}
      <div className="h-1/2 p-6 flex flex-col justify-center bg-neutral">
        <h3 className="mb-2 text-xl font-semibold text-neutral-content">
          {title}
        </h3>
        <p className="text-sm text-neutral-content/70">{description}</p>
      </div>

      {/* Image overlay — slides to top-left half on hover */}
      <motion.div
        initial={{ top: "0%", right: "0%" }}
        variants={{
          hover: { top: "50%", right: "50%" },
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute inset-0 z-10 bg-base-300"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        role="img"
        aria-label={imageAlt}
      />

      {/* Bottom-right: CTA link (visible after image slides) */}
      <a
        href={ctaUrl}
        className="absolute bottom-0 right-0 z-0 grid h-1/2 w-1/2 place-content-center bg-base-100 text-base-content transition-colors duration-200 hover:text-primary"
      >
        <span className="flex items-center gap-1">
          <span className="text-xs font-medium uppercase tracking-wide">
            {ctaText}
          </span>
          <ArrowUpRight className="text-lg" />
        </span>
      </a>
    </motion.article>
  );
}
