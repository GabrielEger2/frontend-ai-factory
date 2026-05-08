"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PeekImage {
  image: string;
  imageAlt: string;
}

export interface HeroAsymmetricStackProps {
  eyebrow?: string;
  /** Three text rows that stack into the display headline */
  headlineLines: [string, string, string];
  /** Optional italic accent rendered in the second line column */
  accentWord?: string;
  /** Color scheme for the accent word */
  accentColorScheme?: ColorScheme;
  subheadline?: string;
  ctaText: string;
  ctaUrl?: string;
  ctaStyle?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaStyle?: CtaVariant;
  secondaryCtaColorScheme?: ColorScheme;
  /** Two peeking image cards rotated and offset across the layout */
  peekImages?: [PeekImage, PeekImage] | [PeekImage] | [];
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface PeekCardProps {
  image: PeekImage;
  index: number;
}

function PeekCard({ image, index }: PeekCardProps) {
  const safe = useSafeImageSrc(
    image.image,
    `hero-asymmetric-peek-${index}`,
    480,
    600,
  );
  // First card: top-right, slight rotation; second: bottom-left, opposite rotation
  const positioning =
    index === 0
      ? "right-[-2rem] top-12 rotate-3 md:right-8 md:top-16 md:rotate-6"
      : "left-[-2rem] bottom-12 -rotate-2 md:left-12 md:bottom-20 md:-rotate-3";

  return (
    <motion.div
      className={cn(
        "absolute z-0 hidden aspect-[4/5] w-44 overflow-hidden rounded-xl border border-base-300 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.25)] md:block md:w-56 lg:w-64",
        positioning,
      )}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
        delay: 0.3 + index * 0.12,
      }}
    >
      <img
        src={safe.src}
        onError={safe.onError}
        alt={image.imageAlt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const ACCENT_TEXT: Record<ColorScheme, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  neutral: "text-base-content/80",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroAsymmetricStack({
  eyebrow,
  headlineLines,
  accentWord,
  accentColorScheme = "primary",
  subheadline,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  secondaryCtaStyle = "drawOutline",
  secondaryCtaColorScheme = "primary",
  peekImages,
  className,
}: HeroAsymmetricStackProps) {
  const shouldReduceMotion = useReducedMotion();
  const accentClass = ACCENT_TEXT[accentColorScheme];

  return (
    <section
      className={cn(
        "relative isolate flex w-full items-center overflow-hidden bg-base-100 min-h-screen",
        className,
      )}
    >
      {/* Decorative peek images */}
      {peekImages?.[0] && <PeekCard image={peekImages[0]} index={0} />}
      {peekImages?.[1] && <PeekCard image={peekImages[1]} index={1} />}

      <motion.div
        className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-16 md:px-8 md:py-24 lg:px-12"
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {eyebrow && (
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-base-content/60"
          >
            <span
              aria-hidden="true"
              className="inline-block h-px w-8 bg-base-content/40"
            />
            {eyebrow}
          </motion.p>
        )}

        {/* Asymmetric stacked headline — three rows, each with its own offset */}
        <h1 className="flex flex-col text-balance font-serif font-semibold leading-[0.92] tracking-tight text-base-content">
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="block text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[7.5rem]"
          >
            {headlineLines[0]}
          </motion.span>
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="block self-end pr-4 text-5xl italic sm:text-6xl md:pr-16 md:text-7xl lg:pr-24 lg:text-[6.5rem] xl:text-[7.5rem]"
          >
            {accentWord ? (
              <span className={cn("not-italic", accentClass)}>
                {accentWord}
              </span>
            ) : null}
            {accentWord && " "}
            <span className="font-serif italic">{headlineLines[1]}</span>
          </motion.span>
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="block pl-4 text-5xl sm:text-6xl md:pl-24 md:text-7xl lg:pl-40 lg:text-[6.5rem] xl:text-[7.5rem]"
          >
            {headlineLines[2]}
          </motion.span>
        </h1>

        {/* Subheadline + CTAs row, stitched in opposite alignment to break symmetry */}
        <div className="mt-12 grid gap-8 md:grid-cols-12 md:gap-10">
          {subheadline && (
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-prose text-base leading-relaxed text-base-content/70 md:col-span-6 md:col-start-2 md:text-lg"
            >
              {subheadline}
            </motion.p>
          )}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-4 md:col-span-4 md:col-start-9 md:justify-end"
          >
            <CtaButton
              variant={ctaStyle}
              colorScheme={ctaColorScheme}
              href={ctaUrl}
            >
              {ctaText}
            </CtaButton>
            {secondaryCtaText && (
              <CtaButton
                variant={secondaryCtaStyle}
                colorScheme={secondaryCtaColorScheme}
                href={secondaryCtaUrl}
              >
                {secondaryCtaText}
              </CtaButton>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
