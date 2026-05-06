"use client";

import { motion, useReducedMotion } from "motion/react";
import { FiCheck, FiMinus } from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PricingTierCard {
  /** Tier name — e.g. "Starter", "Studio" */
  name: string;
  /** Single-sentence positioning line */
  description?: string;
  /** Primary price — e.g. "$24", "Sob consulta" */
  price: string;
  /** Cadence suffix — "/mês", "/seat", "billed yearly" */
  cadence?: string;
  /** Optional badge for the highlighted tier */
  badge?: string;
  /** Tier-specific CTA label */
  ctaText: string;
  /** Tier-specific CTA destination */
  ctaUrl: string;
  /** Inclusive features. Prefix with "-" to render as excluded line. */
  features: string[];
  /** When true, this tier renders inverted (most-popular emphasis). */
  featured?: boolean;
}

export interface PricingTierCardsProps {
  /** Eyebrow above the headline */
  label?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** Tier cards — between 2 and 4 */
  tiers: PricingTierCard[];
  /** Footnote line below the cards (trial copy, tax note) */
  footnote?: string;
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_TIERS: PricingTierCard[] = [
  {
    name: "Solo",
    description: "For one person shipping their first project.",
    price: "$19",
    cadence: "/month",
    ctaText: "Start a project",
    ctaUrl: "/signup?plan=solo",
    features: [
      "1 active project",
      "8 GB asset storage",
      "Email support · 48h reply",
      "-Custom domains",
      "-Team workspaces",
    ],
  },
  {
    name: "Studio",
    description: "Small teams shipping every week.",
    price: "$74",
    cadence: "/month",
    badge: "Most chosen",
    featured: true,
    ctaText: "Try Studio free",
    ctaUrl: "/signup?plan=studio",
    features: [
      "Unlimited projects",
      "120 GB asset storage",
      "Custom domains and redirects",
      "Shared Slack support channel",
      "-SSO and audit logs",
    ],
  },
  {
    name: "Scale",
    description: "Growing companies with security needs.",
    price: "$236",
    cadence: "/month",
    ctaText: "Talk to sales",
    ctaUrl: "/contact?plan=scale",
    features: [
      "Everything in Studio",
      "1 TB asset storage",
      "SSO, SAML, audit logs",
      "Dedicated success engineer",
      "99.95% uptime guarantee",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface FeatureRowProps {
  raw: string;
  inverted?: boolean;
}

function FeatureRow({ raw, inverted }: FeatureRowProps) {
  const excluded = raw.startsWith("-");
  const text = excluded ? raw.slice(1).trim() : raw;
  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed">
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          excluded
            ? inverted
              ? "bg-base-100/10 text-base-100/40"
              : "bg-base-200 text-base-content/40"
            : inverted
              ? "bg-base-100/15 text-base-100"
              : "bg-primary/12 text-primary",
        )}
        aria-hidden="true"
      >
        {excluded ? (
          <FiMinus className="h-3 w-3" />
        ) : (
          <FiCheck className="h-3 w-3" />
        )}
      </span>
      <span
        className={cn(
          excluded
            ? inverted
              ? "text-base-100/45 line-through decoration-base-100/30"
              : "text-base-content/45 line-through decoration-base-content/20"
            : inverted
              ? "text-base-100/85"
              : "text-base-content/80",
        )}
      >
        {text}
      </span>
    </li>
  );
}

interface TierCardProps {
  tier: PricingTierCard;
  ctaVariant: CtaVariant;
  ctaColorScheme: ColorScheme;
}

function TierCard({ tier, ctaVariant, ctaColorScheme }: TierCardProps) {
  const inverted = !!tier.featured;
  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "relative flex flex-col rounded-3xl p-6 md:p-8",
        inverted
          ? "bg-base-content text-base-100 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]"
          : "border border-base-300 bg-base-100",
        inverted && "md:-translate-y-3",
      )}
    >
      {tier.badge && (
        <span
          className={cn(
            "absolute -top-3 left-6 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
            inverted
              ? "bg-primary text-primary-content"
              : "bg-base-content text-base-100",
          )}
        >
          {tier.badge}
        </span>
      )}

      <header className="mb-5">
        <h3
          className={cn(
            "text-base font-semibold uppercase tracking-[0.12em]",
            inverted ? "text-base-100/80" : "text-base-content/70",
          )}
        >
          {tier.name}
        </h3>
        {tier.description && (
          <p
            className={cn(
              "mt-2 text-sm leading-relaxed",
              inverted ? "text-base-100/65" : "text-base-content/60",
            )}
          >
            {tier.description}
          </p>
        )}
      </header>

      <div className="mb-8 flex items-baseline gap-1.5">
        <span
          className={cn(
            "font-mono text-5xl font-semibold tracking-tight md:text-6xl",
            inverted ? "text-base-100" : "text-base-content",
          )}
        >
          {tier.price}
        </span>
        {tier.cadence && (
          <span
            className={cn(
              "text-sm font-medium",
              inverted ? "text-base-100/60" : "text-base-content/55",
            )}
          >
            {tier.cadence}
          </span>
        )}
      </div>

      <ul className="mb-8 flex flex-col gap-3">
        {tier.features.map((f, i) => (
          <FeatureRow key={i} raw={f} inverted={inverted} />
        ))}
      </ul>

      <div className="mt-auto">
        <CtaButton
          variant={ctaVariant}
          colorScheme={inverted ? "primary" : ctaColorScheme}
          href={tier.ctaUrl}
          className="w-full justify-center"
        >
          {tier.ctaText}
        </CtaButton>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * PricingTierCards — three-up tier cards with one inverted "most popular"
 * tier that pulls focus through contrast (not glow). Inclusive features
 * use a tinted check, excluded features render with a strike-through.
 *
 * Cards do NOT collapse to a 3-equal-card row on desktop: the featured
 * tier lifts -3 to break the horizon line. Mobile stacks to a single
 * column (md:grid-cols-3 → grid-cols-1).
 */
export default function PricingTierCards({
  label,
  headline,
  description,
  tiers = DEFAULT_TIERS,
  footnote,
  styleKit,
  className,
}: PricingTierCardsProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme = styleKit?.ctaColorScheme ?? "primary";

  const tierColumns =
    tiers.length === 4
      ? "md:grid-cols-2 xl:grid-cols-4"
      : tiers.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";

  return (
    <section className={cn("w-full bg-base-100 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          className="mx-auto mb-14 flex max-w-2xl flex-col text-left md:mb-20"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {label && (
            <motion.p
              variants={fadeUp}
              className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
            >
              {label}
            </motion.p>
          )}
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-semibold tracking-tight text-base-content sm:text-4xl md:text-5xl"
          >
            {headline}
          </motion.h2>
          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-[60ch] text-base leading-relaxed text-base-content/65"
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className={cn("grid grid-cols-1 gap-6", tierColumns)}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {tiers.map((tier, i) => (
            <TierCard
              key={i}
              tier={tier}
              ctaVariant={ctaVariant}
              ctaColorScheme={ctaColorScheme}
            />
          ))}
        </motion.div>

        {footnote && (
          <p className="mt-12 text-center text-sm text-base-content/55">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
