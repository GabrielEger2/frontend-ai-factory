"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiPause, FiPlay, FiVolume2, FiVolumeX } from "react-icons/fi";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CtaVideoBackdropProps {
  /** Small label rendered above the headline */
  eyebrow?: string;
  /** Section headline — kept short for the high-contrast overlay */
  headline: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** Primary CTA copy */
  ctaText: string;
  /** Primary CTA destination */
  ctaUrl: string;
  /** Optional secondary text-link CTA */
  secondaryText?: string;
  secondaryUrl?: string;
  /**
   * Looping background video URL — should be a short MP4 (≤ 8s, ~1–3 MB)
   * encoded with H.264 baseline for the broadest device support.
   */
  videoSrc: string;
  /** Optional secondary source for browsers that prefer WebM */
  videoSrcWebm?: string;
  /**
   * Poster frame shown until the video can play — also the fallback for
   * users with reduced-motion or autoplay restrictions.
   */
  poster: string;
  /** Alt-equivalent caption for the video, used by screen readers */
  videoAriaLabel: string;
  /**
   * Dark overlay opacity (0–100). Higher = more contrast for the white
   * text. Defaults to 45 — enough to keep typography legible without
   * crushing the underlying motion.
   */
  overlayOpacity?: number;
  /** Content alignment. Defaults to "left" for editorial asymmetry. */
  align?: "left" | "center";
  /** Minimum viewport height of the section. Defaults to "85vh". */
  minHeight?: string;
  /**
   * When true, surfaces a small play/pause + mute control in the bottom
   * corner. Honors prefers-reduced-motion regardless. Defaults to true.
   */
  showControls?: boolean;
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CtaVideoBackdrop — a high-impact CTA with a looping muted background
 * video. Designed for product launches, brand statements, and conversion
 * moments where motion adds emotional weight beyond what a still image
 * can carry.
 *
 * The video autoplays silently and respects prefers-reduced-motion: when
 * the visitor opts out, only the poster frame is shown and the video
 * never starts. A small play/mute control is always offered so visitors
 * can still opt in.
 */
export default function CtaVideoBackdrop({
  eyebrow,
  headline,
  description,
  ctaText,
  ctaUrl,
  secondaryText,
  secondaryUrl,
  videoSrc,
  videoSrcWebm,
  poster,
  videoAriaLabel,
  overlayOpacity = 45,
  align = "left",
  minHeight = "85vh",
  showControls = true,
  styleKit,
  className,
}: CtaVideoBackdropProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant: CtaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme: ColorScheme = styleKit?.ctaColorScheme ?? "primary";

  const safePoster = useSafeImageSrc(
    poster,
    `cta-video-poster-${headline}`,
    1920,
    1080,
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(!shouldReduceMotion);
  const [isMuted, setIsMuted] = useState(true);

  // Sync play state with reduced-motion preference. If the user opts out
  // of motion, hold the poster frame and never start the video.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (shouldReduceMotion) {
      v.pause();
      setIsPlaying(false);
      return;
    }
    v.play().catch(() => {
      // Autoplay can still be blocked on iOS Low Power Mode etc. — show
      // the poster and let the user opt in via the control.
      setIsPlaying(false);
    });
  }, [shouldReduceMotion]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const safeOverlay = Math.max(0, Math.min(100, overlayOpacity)) / 100;

  return (
    <section
      className={cn(
        "relative isolate w-full overflow-hidden text-neutral-content",
        className,
      )}
      style={{ minHeight }}
    >
      {/* Video layer */}
      <video
        ref={videoRef}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        autoPlay={!shouldReduceMotion}
        loop
        muted
        playsInline
        preload="metadata"
        poster={safePoster.src}
        aria-label={videoAriaLabel}
      >
        {videoSrcWebm && <source src={videoSrcWebm} type="video/webm" />}
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Darkening overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-neutral"
        style={{ opacity: safeOverlay }}
      />

      {/* Content */}
      <div className="relative flex w-full items-center" style={{ minHeight }}>
        <div
          className={cn(
            "mx-auto w-full max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12",
            align === "center" && "text-center",
          )}
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
              "flex max-w-xl flex-col gap-5 md:max-w-2xl lg:max-w-3xl",
              align === "center" && "mx-auto items-center",
            )}
          >
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-content/80">
                {eyebrow}
              </span>
            )}
            <h2
              className={cn(
                "text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-content md:text-6xl lg:text-7xl",
              )}
            >
              {headline}
            </h2>
            {description && (
              <p
                className={cn(
                  "max-w-xl text-base leading-relaxed text-neutral-content/85 md:text-lg",
                  align === "center" && "mx-auto",
                )}
              >
                {description}
              </p>
            )}

            <div
              className={cn(
                "mt-4 flex flex-wrap items-center gap-x-6 gap-y-3",
                align === "center" && "justify-center",
              )}
            >
              <CtaButton
                variant={ctaVariant}
                colorScheme={ctaColorScheme}
                href={ctaUrl}
              >
                {ctaText}
              </CtaButton>
              {secondaryText && secondaryUrl && (
                <a
                  href={secondaryUrl}
                  className="group inline-flex items-center gap-1 text-sm font-medium text-neutral-content/85 underline-offset-4 transition-colors hover:text-neutral-content hover:underline"
                >
                  <span>{secondaryText}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    &rarr;
                  </span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Playback controls */}
      {showControls && (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full bg-neutral/40 p-1.5 backdrop-blur-md ring-1 ring-neutral-content/15">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={
              isPlaying ? "Pause background video" : "Play background video"
            }
            aria-pressed={isPlaying}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-content transition-colors hover:bg-neutral-content/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-content"
          >
            {isPlaying ? (
              <FiPause className="h-4 w-4" />
            ) : (
              <FiPlay className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={
              isMuted ? "Unmute background video" : "Mute background video"
            }
            aria-pressed={!isMuted}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-content transition-colors hover:bg-neutral-content/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-content"
          >
            {isMuted ? (
              <FiVolumeX className="h-4 w-4" />
            ) : (
              <FiVolume2 className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
    </section>
  );
}
