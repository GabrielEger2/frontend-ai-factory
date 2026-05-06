"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CtaCountdownProps {
  /** Small label rendered above the headline (e.g. "Limited drop") */
  eyebrow?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** ISO-8601 timestamp the countdown ticks down to (e.g. "2026-06-01T15:00:00Z") */
  endsAt: string;
  /** Optional copy rendered after the countdown ends — defaults to a calm confirmation */
  endedText?: string;
  /** Primary CTA copy */
  ctaText: string;
  /** Primary CTA destination */
  ctaUrl: string;
  /** Optional secondary text-link CTA */
  secondaryText?: string;
  secondaryUrl?: string;
  /**
   * "neutral" — bg-base-100 (default)
   * "muted" — bg-base-200 surface
   * "inverse" — bg-base-content text-base-100
   */
  tone?: "neutral" | "muted" | "inverse";
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function diffFromNow(target: number): TimeLeft {
  const ms = target - Date.now();
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, expired: false };
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

/* ------------------------------------------------------------------ */
/*  Sub-component — single time block                                  */
/* ------------------------------------------------------------------ */

function TimeBlock({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "neutral" | "muted" | "inverse";
}) {
  const display = pad2(value);
  const isInverse = tone === "inverse";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "flex h-20 w-16 items-center justify-center rounded-lg font-mono text-3xl font-semibold tabular-nums tracking-tight sm:h-24 sm:w-20 sm:text-4xl md:h-28 md:w-24 md:text-5xl",
          isInverse
            ? "bg-base-100/10 text-base-100 ring-1 ring-inset ring-base-100/15"
            : "bg-base-200 text-base-content ring-1 ring-inset ring-base-300",
        )}
        aria-hidden="true"
      >
        {display}
      </div>
      <span
        className={cn(
          "text-[0.65rem] font-medium uppercase tracking-[0.18em]",
          isInverse ? "text-base-100/55" : "text-base-content/55",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function Separator({ tone }: { tone: "neutral" | "muted" | "inverse" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "self-start pt-6 font-mono text-3xl font-semibold sm:pt-7 sm:text-4xl md:pt-9 md:text-5xl",
        tone === "inverse" ? "text-base-100/30" : "text-base-content/25",
      )}
    >
      :
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CtaCountdown -- urgency CTA with a live ticking countdown to a fixed
 * deadline (launch date, sale end, registration cutoff). Renders a
 * neutral bg by default; `inverse` tone produces a high-impact dark slab.
 *
 * The countdown ticks every second on the client. After `endsAt`, the
 * timer collapses to a calm `endedText` instead of negative numbers.
 */
export default function CtaCountdown({
  eyebrow,
  headline,
  description,
  endsAt,
  endedText = "This window has closed — join the waitlist for the next one",
  ctaText,
  ctaUrl,
  secondaryText,
  secondaryUrl,
  tone = "neutral",
  styleKit,
  className,
}: CtaCountdownProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant: CtaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme: ColorScheme = styleKit?.ctaColorScheme ?? "primary";

  const targetMs = new Date(endsAt).getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    diffFromNow(targetMs),
  );

  useEffect(() => {
    if (Number.isNaN(targetMs)) return;
    const tick = () => setTimeLeft(diffFromNow(targetMs));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  const isInverse = tone === "inverse";

  const surfaceClass = cn(
    "w-full",
    tone === "neutral" && "bg-base-100",
    tone === "muted" && "bg-base-200",
    isInverse && "bg-base-content text-base-100",
  );

  const eyebrowColor = isInverse ? "text-base-100/65" : "text-primary";
  const headingColor = isInverse ? "text-base-100" : "text-base-content";
  const bodyColor = isInverse ? "text-base-100/70" : "text-base-content/65";

  return (
    <section className={cn(surfaceClass, "py-14 md:py-20", className)}>
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <motion.div
          className="flex flex-col items-center gap-8 text-center"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Copy block */}
          <div className="flex max-w-2xl flex-col items-center gap-3">
            {eyebrow && (
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.25em]",
                  eyebrowColor,
                )}
              >
                {eyebrow}
              </span>
            )}
            <h2
              className={cn(
                "text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl",
                headingColor,
              )}
            >
              {headline}
            </h2>
            {description && (
              <p className={cn("text-base leading-relaxed", bodyColor)}>
                {description}
              </p>
            )}
          </div>

          {/* Countdown */}
          {timeLeft.expired ? (
            <p
              className={cn(
                "max-w-2xl text-sm font-medium md:text-base",
                isInverse ? "text-base-100/80" : "text-base-content/70",
              )}
              aria-live="polite"
            >
              {endedText}
            </p>
          ) : (
            <div
              className="flex items-start gap-2 sm:gap-3"
              role="timer"
              aria-live="off"
              aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`}
            >
              <TimeBlock value={timeLeft.days} label="Days" tone={tone} />
              <Separator tone={tone} />
              <TimeBlock value={timeLeft.hours} label="Hours" tone={tone} />
              <Separator tone={tone} />
              <TimeBlock value={timeLeft.minutes} label="Minutes" tone={tone} />
              <Separator tone={tone} />
              <TimeBlock value={timeLeft.seconds} label="Seconds" tone={tone} />
            </div>
          )}

          {/* Action block */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-2">
            <CtaButton
              variant={ctaVariant}
              colorScheme={isInverse ? "neutral" : ctaColorScheme}
              href={ctaUrl}
            >
              {ctaText}
            </CtaButton>
            {secondaryText && secondaryUrl && (
              <a
                href={secondaryUrl}
                className={cn(
                  "group inline-flex items-center gap-1 text-sm font-medium underline-offset-4 transition-colors",
                  isInverse
                    ? "text-base-100/80 hover:text-base-100 hover:underline"
                    : "text-base-content/70 hover:text-base-content hover:underline",
                )}
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
    </section>
  );
}
