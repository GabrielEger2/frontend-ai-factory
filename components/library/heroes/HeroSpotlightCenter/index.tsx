"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FloatingChip {
  label: string;
  /** Position quadrant — keeps chips off the headline */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Optional icon image — small avatar or product thumbnail */
  image?: string;
  imageAlt?: string;
}

export interface HeroSpotlightCenterProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  ctaText: string;
  ctaUrl?: string;
  ctaStyle?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaStyle?: CtaVariant;
  secondaryCtaColorScheme?: ColorScheme;
  /** Optional centered product/portrait image rendered behind the headline */
  spotlightImage?: string;
  spotlightImageAlt?: string;
  /** Floating chips orbiting the headline — max 4, one per corner */
  chips?: FloatingChip[];
  /** Soft radial light source behind the headline */
  showRadialGlow?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const POSITION_CLASSES: Record<
  NonNullable<FloatingChip["position"]>,
  string
> = {
  "top-left": "left-4 top-8 md:left-12 md:top-16",
  "top-right": "right-4 top-8 md:right-12 md:top-16",
  "bottom-left": "left-4 bottom-24 md:left-12 md:bottom-32",
  "bottom-right": "right-4 bottom-24 md:right-12 md:bottom-32",
};

interface ChipCardProps {
  chip: FloatingChip;
  index: number;
}

function ChipCard({ chip, index }: ChipCardProps) {
  const safe = useSafeImageSrc(
    chip.image,
    `hero-spotlight-chip-${index}`,
    64,
    64,
  );
  const positionClass = POSITION_CLASSES[chip.position ?? "top-left"];
  const float = index % 2 === 0 ? [-4, 4, -4] : [4, -4, 4];
  return (
    <motion.div
      className={cn(
        "absolute z-20 hidden items-center gap-3 rounded-full border border-base-300 bg-base-100/90 px-3 py-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] backdrop-blur-md md:flex",
        positionClass,
      )}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: 0.2 + index * 0.1,
      }}
    >
      <motion.div
        className="flex items-center gap-3"
        animate={{ y: float }}
        transition={{
          duration: 4 + index,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {chip.image && (
          <img
            src={safe.src}
            onError={safe.onError}
            alt={chip.imageAlt ?? ""}
            className="h-7 w-7 shrink-0 rounded-full object-cover"
            loading="lazy"
          />
        )}
        <span className="text-xs font-medium text-base-content">
          {chip.label}
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroSpotlightCenter({
  eyebrow,
  headline,
  subheadline,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  secondaryCtaStyle = "drawOutline",
  secondaryCtaColorScheme = "primary",
  spotlightImage,
  spotlightImageAlt,
  chips,
  showRadialGlow = true,
  className,
}: HeroSpotlightCenterProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeSpotlight = useSafeImageSrc(
    spotlightImage,
    "hero-spotlight-image",
    600,
    600,
  );

  return (
    <section
      className={cn(
        "relative isolate flex w-full items-center justify-center overflow-hidden bg-base-100 min-h-[100dvh]",
        className,
      )}
    >
      {/* Radial glow — semantic accent token, low intensity */}
      {showRadialGlow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]"
        />
      )}

      {/* Spotlight portrait — sits behind headline at low opacity */}
      {spotlightImage && (
        <motion.img
          src={safeSpotlight.src}
          onError={safeSpotlight.onError}
          alt={spotlightImageAlt ?? ""}
          className="pointer-events-none absolute left-1/2 top-1/2 -z-[5] h-[420px] w-[420px] -translate-x-1/2 -translate-y-[55%] rounded-full object-cover opacity-30 mix-blend-multiply md:h-[520px] md:w-[520px]"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={shouldReduceMotion ? undefined : { opacity: 0.3, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          loading="eager"
        />
      )}

      {/* Floating chips */}
      {chips?.slice(0, 4).map((chip, i) => (
        <ChipCard key={i} chip={chip} index={i} />
      ))}

      {/* Centered content */}
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center md:px-8 md:py-24"
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {eyebrow && (
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-full border border-base-300 bg-base-200/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-base-content/70 backdrop-blur-sm"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-base-content sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {headline}
        </motion.h1>
        {subheadline && (
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-xl text-base leading-relaxed text-base-content/70 md:text-lg"
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
          className="mt-2 flex flex-wrap items-center justify-center gap-4"
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
      </motion.div>
    </section>
  );
}
