"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface HeroVideoBackdropProps {
  /** MP4/WebM URL — when omitted, the poster image acts as the backdrop */
  videoUrl?: string;
  /** Poster image — also used as a fallback when video is missing or motion is reduced */
  posterImage: string;
  posterAlt: string;
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
  /** Anchor for the content block over the video */
  contentAlign?: "bottom-left" | "bottom-center" | "center";
  /** Overlay tint strength — 0 (none) to 100 (full) */
  overlayStrength?: number;
  /** Optional metadata strip rendered along the bottom edge */
  metaItems?: string[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroVideoBackdrop({
  videoUrl,
  posterImage,
  posterAlt,
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
  contentAlign = "bottom-left",
  overlayStrength = 55,
  metaItems,
  className,
}: HeroVideoBackdropProps) {
  const shouldReduceMotion = useReducedMotion();
  const safePoster = useSafeImageSrc(
    posterImage,
    "hero-video-backdrop-poster",
    1600,
    900,
  );

  const tint = Math.max(0, Math.min(100, overlayStrength)) / 100;

  const alignClasses =
    contentAlign === "center"
      ? "items-center justify-center text-center"
      : contentAlign === "bottom-center"
        ? "items-center justify-end text-center pb-16 md:pb-24"
        : "items-start justify-end pb-16 md:pb-24";

  return (
    <section
      className={cn(
        "relative isolate flex w-full overflow-hidden bg-neutral text-neutral-content min-h-screen",
        className,
      )}
    >
      {/* Backdrop layer — poster always rendered; video overlays when available and motion is allowed */}
      <img
        src={safePoster.src}
        onError={safePoster.onError}
        alt={posterAlt}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        loading="eager"
      />
      {videoUrl && !shouldReduceMotion && (
        <video
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          src={videoUrl}
          poster={safePoster.src}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      )}

      {/* Tint overlay — uses neutral token for theme-consistent darkening */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[5] bg-neutral"
        style={{ opacity: tint }}
      />
      {/* Bottom gradient for legibility — semantic via gradient stops */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-[4] h-1/2 bg-gradient-to-t from-neutral/90 to-transparent"
      />

      {/* Content */}
      <motion.div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 md:px-8 lg:px-12",
          alignClasses,
        )}
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
            className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-content/70"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
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
            className="max-w-xl text-base leading-relaxed text-neutral-content/80 md:text-lg"
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
          className="mt-2 flex flex-wrap gap-4"
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

      {/* Bottom metadata strip */}
      {metaItems && metaItems.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 z-10 hidden border-t border-base-content/10 bg-neutral/40 backdrop-blur-md md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 md:px-8 lg:px-12">
            {metaItems.slice(0, 4).map((item, i) => (
              <span
                key={i}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-content/70"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
