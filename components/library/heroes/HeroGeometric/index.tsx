"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { TypeWriter } from "@ui/text-decorations/TypeWriter";
import {
  AnimatedSvgBackground,
  GEOMETRIC_SHAPES,
} from "@ui/backgrounds/AnimatedSvgBackground";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SocialProofAvatar {
  image: string;
  imageAlt: string;
}

export interface HeroGeometricProps {
  headline: string;
  /** When provided, the last line cycles through these strings with a typewriter effect */
  headlineRotatingWords?: string[];
  subheadline: string;
  ctaText: string;
  ctaUrl: string;
  /** CTA button style */
  ctaStyle?: CtaVariant;
  /** CTA color scheme */
  ctaColorScheme?: ColorScheme;
  /** Secondary CTA text — when provided, renders a second button */
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaStyle?: CtaVariant;
  secondaryCtaColorScheme?: ColorScheme;
  /** Main hero image displayed on the right side */
  image: string;
  imageAlt: string;
  /** Social proof badge — when provided, renders an avatar stack with label above the headline */
  socialProofAvatars?: SocialProofAvatar[];
  socialProofLabel?: string;
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
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface SocialProofBadgeProps {
  avatars: SocialProofAvatar[];
  label: string;
}

function SocialProofBadge({ avatars, label }: SocialProofBadgeProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-base-300 p-1.5 text-xs text-base-content/60 md:justify-start">
      <div className="flex items-center">
        {avatars.map((avatar, i) => (
          <img
            key={i}
            className={cn(
              "h-7 w-7 rounded-full border-[3px] border-base-100 bg-base-200 object-cover",
              i > 0 && "-ml-2",
            )}
            src={avatar.image}
            alt={avatar.imageAlt}
            loading="lazy"
          />
        ))}
      </div>
      <p className={avatars.length > 0 ? "-ml-1" : ""}>{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroGeometric({
  headline,
  headlineRotatingWords,
  subheadline,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  secondaryCtaStyle = "drawOutline",
  secondaryCtaColorScheme = "primary",
  image,
  imageAlt,
  socialProofAvatars,
  socialProofLabel,
  className,
}: HeroGeometricProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        "relative isolate flex w-full items-center overflow-hidden bg-base-100 min-h-screen",
        className,
      )}
    >
      <AnimatedSvgBackground shapes={GEOMETRIC_SHAPES} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-12 md:grid-cols-2 md:gap-8 md:px-8 md:py-16 lg:px-12 lg:py-24">
        {/* -- Text column -- */}
        <motion.div
          className="flex flex-col items-center md:items-start"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {socialProofAvatars &&
            socialProofAvatars.length > 0 &&
            socialProofLabel && (
              <motion.div variants={fadeUp}>
                <SocialProofBadge
                  avatars={socialProofAvatars}
                  label={socialProofLabel}
                />
              </motion.div>
            )}

          <motion.h1
            variants={fadeUp}
            className="mt-4 text-balance text-center text-4xl font-medium leading-tight text-base-content sm:text-5xl md:text-left md:text-6xl md:leading-[1.15]"
          >
            {headline}
            {headlineRotatingWords && headlineRotatingWords.length > 0 && (
              <>
                <br />
                <TypeWriter
                  text={headlineRotatingWords}
                  className="font-semibold text-primary"
                  cursorClassName="text-primary"
                  speed={60}
                  deleteSpeed={40}
                  pauseDelay={2500}
                  startOnView
                />
              </>
            )}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-lg text-center text-sm leading-relaxed text-base-content/60 md:text-left md:text-base"
          >
            {subheadline}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-4 text-sm"
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

        {/* -- Image column -- */}
        <motion.div
          variants={imageReveal}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex justify-center md:justify-end"
        >
          <img
            src={image}
            alt={imageAlt}
            className="max-w-xs rounded-lg transition-all duration-300 sm:max-w-sm lg:max-w-md"
            loading="eager"
          />
        </motion.div>
      </div>
    </section>
  );
}
