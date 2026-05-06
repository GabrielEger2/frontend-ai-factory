"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type TerminalLineKind =
  | "command"
  | "output"
  | "comment"
  | "success"
  | "error";

export interface TerminalLine {
  /** Visual treatment for the line */
  kind: TerminalLineKind;
  /** Line text — kept verbatim, monospaced */
  text: string;
}

export interface PlatformBadge {
  label: string;
}

export interface HeroTerminalConsoleProps {
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
  /** Title bar of the terminal window */
  terminalTitle?: string;
  /** Stagger-revealed terminal lines */
  terminalLines: TerminalLine[];
  /** Small platform badges below the CTAs (e.g. macOS, Linux, npm) */
  platformBadges?: PlatformBadge[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const LINE_TINT: Record<TerminalLineKind, string> = {
  command: "text-base-content",
  output: "text-base-content/70",
  comment: "text-base-content/40 italic",
  success: "text-success",
  error: "text-error",
};

const LINE_PREFIX: Record<TerminalLineKind, string> = {
  command: "$",
  output: " ",
  comment: "#",
  success: "+",
  error: "!",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroTerminalConsole({
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
  terminalTitle = "~/projects",
  terminalLines,
  platformBadges,
  className,
}: HeroTerminalConsoleProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className={cn("relative w-full overflow-hidden bg-base-100", className)}
    >
      {/* Subtle grid pattern background using neutral token */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(var(--color-base-300)) 1px, transparent 1px), linear-gradient(to bottom, oklch(var(--color-base-300)) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-12 md:gap-12 md:px-8 md:py-16 lg:grid-cols-12 lg:gap-14 lg:px-12 lg:py-24">
        {/* -- Headline column -- */}
        <motion.div
          className="lg:col-span-5"
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
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-base-content/70"
            >
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-success"
              />
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-balance text-3xl font-semibold leading-tight tracking-tight text-base-content sm:text-4xl md:text-5xl"
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
              className="mt-5 max-w-md text-base leading-relaxed text-base-content/70 md:text-lg"
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
            className="mt-7 flex flex-wrap gap-3"
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
          {platformBadges && platformBadges.length > 0 && (
            <motion.ul
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {platformBadges.map((badge, i) => (
                <li
                  key={i}
                  className="rounded-md border border-base-300 bg-base-200/60 px-2 py-1 font-mono text-[11px] tracking-tight text-base-content/70"
                >
                  {badge.label}
                </li>
              ))}
            </motion.ul>
          )}
        </motion.div>

        {/* -- Terminal window -- */}
        <motion.div
          className="lg:col-span-7"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
        >
          <div className="overflow-hidden rounded-xl border border-base-300 bg-base-200 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-base-300 bg-base-300/60 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-error/80"
                  aria-hidden="true"
                />
                <span
                  className="h-2.5 w-2.5 rounded-full bg-warning/80"
                  aria-hidden="true"
                />
                <span
                  className="h-2.5 w-2.5 rounded-full bg-success/80"
                  aria-hidden="true"
                />
              </div>
              <span className="ml-3 font-mono text-[11px] text-base-content/60">
                {terminalTitle}
              </span>
            </div>
            {/* Body */}
            <motion.div
              className="p-5 font-mono text-[13px] leading-relaxed md:text-sm"
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.25 },
                },
              }}
            >
              {terminalLines.map((line, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={cn("flex gap-3", LINE_TINT[line.kind])}
                >
                  <span
                    aria-hidden="true"
                    className="select-none text-base-content/40"
                  >
                    {LINE_PREFIX[line.kind]}
                  </span>
                  <span className="break-words">{line.text}</span>
                </motion.div>
              ))}
              {/* Blinking cursor */}
              <div className="mt-3 flex items-center gap-3 text-base-content">
                <span
                  aria-hidden="true"
                  className="select-none text-base-content/40"
                >
                  $
                </span>
                <motion.span
                  aria-hidden="true"
                  className="inline-block h-4 w-2 bg-primary"
                  animate={
                    shouldReduceMotion ? undefined : { opacity: [1, 0, 1] }
                  }
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
