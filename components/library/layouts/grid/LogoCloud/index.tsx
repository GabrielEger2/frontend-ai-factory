"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface LogoItem {
  /** Brand name — required for accessibility */
  name: string;
  /** Logo asset URL (SVG / PNG monochrome works best) */
  src: string;
  /** Optional outbound link */
  href?: string;
}

export interface LogoCloudProps {
  /** Small label rendered above the headline (e.g. "AS SEEN IN") */
  label?: string;
  /** Section headline — short trust-building line */
  headline?: string;
  /** Logo array — keep ≥ 5 for the marquee variant to look natural */
  logos: LogoItem[];
  /**
   * "marquee" — infinite horizontal scroll, no interaction
   * "grid" — static centered grid (4 cols ≥md, 2 cols mobile)
   * Defaults to "marquee".
   */
  variant?: "marquee" | "grid";
  /**
   * "subtle" — muted opacity-60 grayscale, hover to color
   * "stark" — full color, no filters (use for color-strong logos)
   * Defaults to "subtle".
   */
  tone?: "subtle" | "stark";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_LOGOS: LogoItem[] = [
  { name: "Vercel", src: "https://placehold.co/120x40?text=Vercel" },
  { name: "Linear", src: "https://placehold.co/120x40?text=Linear" },
  { name: "Stripe", src: "https://placehold.co/120x40?text=Stripe" },
  { name: "Figma", src: "https://placehold.co/120x40?text=Figma" },
  { name: "Notion", src: "https://placehold.co/120x40?text=Notion" },
  { name: "Loom", src: "https://placehold.co/120x40?text=Loom" },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface LogoCellProps {
  logo: LogoItem;
  tone: "subtle" | "stark";
}

function LogoCell({ logo, tone }: LogoCellProps) {
  const inner = (
    <img
      src={logo.src}
      alt={logo.name}
      loading="lazy"
      className={cn(
        "h-8 w-auto max-w-[140px] object-contain transition-all duration-300 md:h-10",
        tone === "subtle" &&
          "opacity-60 grayscale hover:opacity-100 hover:grayscale-0",
      )}
    />
  );
  return logo.href ? (
    <a
      href={logo.href}
      target="_blank"
      rel="noreferrer noopener"
      className="flex h-12 items-center justify-center px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={logo.name}
    >
      {inner}
    </a>
  ) : (
    <div className="flex h-12 items-center justify-center px-4">{inner}</div>
  );
}

interface MarqueeRowProps {
  logos: LogoItem[];
  tone: "subtle" | "stark";
  reduced: boolean;
}

function MarqueeRow({ logos, tone, reduced }: MarqueeRowProps) {
  // Duplicate the array so we can loop seamlessly with a 50% translate.
  const doubled = [...logos, ...logos];
  return (
    <div
      className="relative overflow-hidden"
      // Edge-fade mask makes the marquee feel infinite without a hard clip
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max items-center gap-12"
        animate={reduced ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduced
            ? undefined
            : {
                duration: 32,
                ease: "linear",
                repeat: Infinity,
              }
        }
      >
        {doubled.map((logo, i) => (
          <LogoCell key={`${logo.name}-${i}`} logo={logo} tone={tone} />
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * LogoCloud — trust-bar / "as featured in" strip. Use the marquee
 * variant when you have 6+ logos and want them to feel alive; use the
 * grid variant when you have 4-8 high-recognition logos that should
 * read as a careful selection rather than a wall.
 */
export default function LogoCloud({
  label,
  headline,
  logos = DEFAULT_LOGOS,
  variant = "marquee",
  tone = "subtle",
  className,
}: LogoCloudProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16", className)}
      aria-label={headline ?? label ?? "Featured in"}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {(label || headline) && (
          <motion.div
            className="mb-8 flex flex-col items-center text-center md:mb-12"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {label && (
              <motion.p
                variants={fadeUp}
                className="text-xs font-semibold uppercase tracking-[0.25em] text-base-content/50"
              >
                {label}
              </motion.p>
            )}
            {headline && (
              <motion.h2
                variants={fadeUp}
                className="mt-3 max-w-2xl text-base font-medium text-base-content/80 md:text-lg"
              >
                {headline}
              </motion.h2>
            )}
          </motion.div>
        )}

        {variant === "marquee" ? (
          <MarqueeRow
            logos={logos}
            tone={tone}
            reduced={!!shouldReduceMotion}
          />
        ) : (
          <motion.div
            className="grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {logos.map((logo, i) => (
              <motion.div key={`${logo.name}-${i}`} variants={fadeUp}>
                <LogoCell logo={logo} tone={tone} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
