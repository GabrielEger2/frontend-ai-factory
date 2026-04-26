"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { Highlighter } from "@ui/text-decorations/Highlighter";
import { TextReveal } from "@ui/text-decorations/TextReveal";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CtaImageBackdropProps {
  /**
   * Lead-in copy printed above the display word. Use `\n` to insert a
   * line break — the reference reads "Nosso propósito é\ntransformar o
   * seu jeito de" across two lines.
   */
  eyebrow: string;
  /**
   * Oversized italic punchline rendered beneath the eyebrow (e.g.
   * "viver bem."). This is the visual centerpiece of the section.
   */
  displayWord: string;
  /** Supporting body copy beneath the display word. */
  body: string;
  /** Full-bleed background image URL. */
  backgroundImage: string;
  /** Alt text for the background image (used by screen readers via aria-label). */
  backgroundImageAlt: string;
  /** Optional CTA label. When omitted, the section renders without a button. */
  ctaText?: string;
  ctaUrl?: string;
  ctaStyle?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  /**
   * Dark overlay opacity (0–100). Higher = more contrast for the white
   * text. Defaults to 35 — enough to keep typography legible without
   * crushing the image.
   */
  overlayOpacity?: number;
  /**
   * When true, the backdrop uses `bg-fixed` so the image stays in place
   * while the section scrolls (subtle parallax). Defaults to true.
   */
  parallax?: boolean;
  /** Content alignment. Defaults to "left" to match the reference layout. */
  align?: "left" | "center";
  /** Minimum viewport height of the section. Defaults to "80vh". */
  minHeight?: string;
  /** Optional word in the eyebrow to wrap with a Highlighter underline. */
  highlightWord?: string;
  /** Wrap the display word in a TextReveal entrance. Defaults to true. */
  revealDisplayWord?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function renderEyebrow(eyebrow: string, highlightWord?: string) {
  // Split on \n so the user can stack lines deliberately like the reference.
  const lines = eyebrow.split("\n");
  return lines.map((line, i) => {
    let node: React.ReactNode = line;
    if (highlightWord) {
      const idx = line.toLowerCase().indexOf(highlightWord.toLowerCase());
      if (idx !== -1) {
        const before = line.slice(0, idx);
        const match = line.slice(idx, idx + highlightWord.length);
        const after = line.slice(idx + highlightWord.length);
        node = (
          <>
            {before}
            <Highlighter action="underline" color="hsl(var(--primary))">
              {match}
            </Highlighter>
            {after}
          </>
        );
      }
    }
    return (
      <span key={i} className="block">
        {node}
      </span>
    );
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CtaImageBackdrop({
  eyebrow,
  displayWord,
  body,
  backgroundImage,
  backgroundImageAlt,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  overlayOpacity = 35,
  parallax = true,
  align = "left",
  minHeight = "80vh",
  highlightWord,
  revealDisplayWord = true,
  className,
}: CtaImageBackdropProps) {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = {
    initial: prefersReducedMotion ? false : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.3, ease: "easeOut" as const },
  };

  // Clamp overlay opacity into [0, 100] and convert to a 0–1 range for
  // inline rgba styling. We drive this via inline style because Tailwind
  // doesn't support arbitrary opacity values dynamically.
  const safeOverlay = Math.max(0, Math.min(100, overlayOpacity)) / 100;

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden text-neutral-content",
        className,
      )}
      style={{ minHeight }}
    >
      {/* Background image layer */}
      <div
        aria-label={backgroundImageAlt}
        role="img"
        className={cn(
          "absolute inset-0 -z-10 bg-cover bg-center",
          parallax && "bg-fixed",
        )}
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        {/* Darkening overlay — keeps the white text legible regardless
            of how busy the underlying photograph is. */}
        <div
          className="absolute inset-0 bg-neutral"
          style={{ opacity: safeOverlay }}
        />
      </div>

      {/* Content */}
      <div className="relative flex w-full items-center" style={{ minHeight }}>
        <div
          className={cn(
            "mx-auto w-full max-w-[96rem] px-4 py-16 md:px-8 md:py-24 lg:px-12",
            align === "center" && "text-center",
          )}
        >
          <motion.div
            {...fadeUp}
            className={cn(
              "flex max-w-xl flex-col gap-4 md:max-w-2xl lg:max-w-3xl",
              align === "center" && "mx-auto items-center",
            )}
          >
            <p
              className={cn(
                "font-serif italic font-medium leading-[1.05] text-neutral-content",
                "text-3xl md:text-4xl lg:text-5xl",
              )}
            >
              {renderEyebrow(eyebrow, highlightWord)}
            </p>

            <h2
              className={cn(
                "font-serif italic font-medium leading-[0.9] text-neutral-content",
                "text-6xl md:text-8xl lg:text-[8.25rem]",
              )}
            >
              {revealDisplayWord && !prefersReducedMotion ? (
                <TextReveal split="word">{displayWord}</TextReveal>
              ) : (
                displayWord
              )}
            </h2>

            <p
              className={cn(
                "mt-4 max-w-md text-base leading-relaxed text-neutral-content/90 md:text-lg",
                align === "center" && "mx-auto",
              )}
            >
              {body}
            </p>

            {ctaText && (
              <div
                className={cn(
                  "mt-6 flex flex-wrap gap-4",
                  align === "center" && "justify-center",
                )}
              >
                <CtaButton
                  variant={ctaStyle}
                  colorScheme={ctaColorScheme}
                  href={ctaUrl}
                >
                  {ctaText}
                </CtaButton>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
