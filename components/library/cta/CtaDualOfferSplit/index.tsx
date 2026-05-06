"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CtaDualOfferCard {
  /** Eyebrow label (e.g. "For founders", "For agencies") */
  eyebrow?: string;
  /** Card title */
  title: string;
  /** Supporting copy */
  description: string;
  /** CTA button copy */
  ctaText: string;
  /** CTA destination */
  ctaUrl: string;
  /** Optional bullet list rendered between description and CTA */
  bullets?: string[];
  /** Optional small footnote rendered under the CTA */
  footnote?: string;
}

export interface CtaDualOfferSplitProps {
  /** Optional eyebrow label rendered above the section headline */
  eyebrow?: string;
  /** Section headline rendered above both cards */
  headline?: string;
  /** Optional supporting paragraph rendered under the headline */
  description?: string;
  /** Left-side offer */
  primary: CtaDualOfferCard;
  /** Right-side offer */
  secondary: CtaDualOfferCard;
  /**
   * "balanced" — both cards visually equal weight (default)
   * "primary-led" — primary card sits on bg-primary tone, draws focus
   */
  emphasis?: "balanced" | "primary-led";
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_PRIMARY: CtaDualOfferCard = {
  eyebrow: "For founders",
  title: "Run the platform yourself",
  description:
    "Self-serve from the dashboard, ship a preview deploy in under twenty minutes, and pay only for the workspaces you actually use.",
  ctaText: "Start a free workspace",
  ctaUrl: "/signup",
  bullets: [
    "14-day trial, no credit card",
    "Unlimited preview environments",
    "Slack-based community support",
  ],
  footnote: "Most teams of 4-12 stay on this plan.",
};

const DEFAULT_SECONDARY: CtaDualOfferCard = {
  eyebrow: "For larger teams",
  title: "Bring our team to do it with you",
  description:
    "Two senior engineers, one shared Slack channel, and a written sixty-day implementation plan. Fixed scope, fixed price, no retainer.",
  ctaText: "Book a 30-minute call",
  ctaUrl: "/contact",
  bullets: [
    "Pair-programming through cutover",
    "SOC 2 documentation included",
    "EU-only data residency available",
  ],
  footnote: "Average engagement runs 6-9 weeks.",
};

/* ------------------------------------------------------------------ */
/*  Sub-component                                                      */
/* ------------------------------------------------------------------ */

function OfferCard({
  card,
  variant,
  ctaVariant,
  ctaColorScheme,
}: {
  card: CtaDualOfferCard;
  variant: "neutral" | "primary";
  ctaVariant: CtaVariant;
  ctaColorScheme: ColorScheme;
}) {
  const isPrimary = variant === "primary";

  const surfaceClass = isPrimary
    ? "bg-primary text-primary-content ring-1 ring-primary/40"
    : "bg-base-100 text-base-content ring-1 ring-base-300";

  const eyebrowClass = isPrimary ? "text-primary-content/75" : "text-primary";

  const bodyClass = isPrimary
    ? "text-primary-content/85"
    : "text-base-content/65";

  const bulletDotClass = isPrimary ? "bg-primary-content/70" : "bg-primary";
  const bulletTextClass = isPrimary
    ? "text-primary-content/85"
    : "text-base-content/75";

  const footnoteClass = isPrimary
    ? "text-primary-content/65"
    : "text-base-content/55";

  return (
    <article
      className={cn(
        "relative flex h-full flex-col gap-6 rounded-2xl p-8 md:p-10",
        surfaceClass,
      )}
    >
      <header className="flex flex-col gap-2">
        {card.eyebrow && (
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.2em]",
              eyebrowClass,
            )}
          >
            {card.eyebrow}
          </span>
        )}
        <h3 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          {card.title}
        </h3>
      </header>

      <p className={cn("text-base leading-relaxed", bodyClass)}>
        {card.description}
      </p>

      {card.bullets && card.bullets.length > 0 && (
        <ul className="flex flex-col gap-3">
          {card.bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full",
                  bulletDotClass,
                )}
              />
              <span className={cn("text-sm md:text-base", bulletTextClass)}>
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-2">
        <div className="self-start">
          <CtaButton
            variant={ctaVariant}
            colorScheme={isPrimary ? "neutral" : ctaColorScheme}
            href={card.ctaUrl}
          >
            {card.ctaText}
          </CtaButton>
        </div>
        {card.footnote && (
          <p className={cn("text-xs", footnoteClass)}>{card.footnote}</p>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CtaDualOfferSplit -- two side-by-side CTA cards offering the visitor
 * a clear choice (self-serve vs. assisted, free vs. enterprise, etc.).
 * Either balanced, or primary-led where the left card sits on bg-primary.
 */
export default function CtaDualOfferSplit({
  eyebrow,
  headline,
  description,
  primary = DEFAULT_PRIMARY,
  secondary = DEFAULT_SECONDARY,
  emphasis = "balanced",
  styleKit,
  className,
}: CtaDualOfferSplitProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant: CtaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme: ColorScheme = styleKit?.ctaColorScheme ?? "primary";

  const primaryVariant = emphasis === "primary-led" ? "primary" : "neutral";

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {(eyebrow || headline || description) && (
          <motion.div
            className="mb-10 max-w-3xl md:mb-14"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                {eyebrow}
              </span>
            )}
            {headline && (
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-base-content md:text-4xl lg:text-5xl">
                {headline}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base leading-relaxed text-base-content/65 md:text-lg">
                {description}
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          <motion.div
            variants={{
              hidden: shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <OfferCard
              card={primary}
              variant={primaryVariant}
              ctaVariant={ctaVariant}
              ctaColorScheme={ctaColorScheme}
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <OfferCard
              card={secondary}
              variant="neutral"
              ctaVariant={ctaVariant}
              ctaColorScheme={ctaColorScheme}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
