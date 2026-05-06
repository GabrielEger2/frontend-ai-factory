"use client";

import { motion, useReducedMotion } from "motion/react";
import { FiCheck, FiX } from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PricingTier {
  /** Tier name — e.g. "Starter", "Studio", "Enterprise" */
  name: string;
  /** Short description rendered below the tier name */
  description?: string;
  /** Primary price string. Use "Custom" or "Sob consulta" for enterprise. */
  price: string;
  /** Optional pricing cadence — e.g. "/mês", "/seat", "billed yearly" */
  cadence?: string;
  /** Optional badge text for the highlighted tier (e.g. "Most popular") */
  badge?: string;
  /** Tier-specific CTA label */
  ctaText: string;
  /** Tier-specific CTA destination */
  ctaUrl: string;
  /** Feature bullets — strings prefixed with "-" render as excluded */
  features: string[];
  /** When true, this tier is visually emphasized */
  featured?: boolean;
}

export interface PricingTiersProps {
  /** Small label rendered above the headline */
  label?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** Optional billing-period toggle copy ("Monthly / Yearly") */
  billingToggle?: { monthly: string; yearly: string; activeIsYearly?: boolean };
  /** Pricing tiers — between 2 and 4 tiles */
  tiers: PricingTier[];
  /** Optional footer note (e.g. "All plans include a 14-day trial.") */
  footnote?: string;
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_TIERS: PricingTier[] = [
  {
    name: "Starter",
    description: "For solo founders shipping their first product.",
    price: "$24",
    cadence: "/month",
    ctaText: "Start free trial",
    ctaUrl: "/signup",
    features: [
      "Up to 3 active projects",
      "5 GB asset storage",
      "Email support within 48h",
      "-Custom domains",
      "-SSO and SAML",
    ],
  },
  {
    name: "Studio",
    description: "For small teams shipping every week.",
    price: "$79",
    cadence: "/month",
    badge: "Most chosen",
    featured: true,
    ctaText: "Start free trial",
    ctaUrl: "/signup",
    features: [
      "Unlimited active projects",
      "100 GB asset storage",
      "Custom domains and redirects",
      "Slack-shared support channel",
      "-SSO and SAML",
    ],
  },
  {
    name: "Scale",
    description: "For growing companies with security needs.",
    price: "$249",
    cadence: "/month",
    ctaText: "Talk to sales",
    ctaUrl: "/contact",
    features: [
      "Everything in Studio",
      "1 TB asset storage",
      "SSO, SAML, audit logs",
      "Dedicated success engineer",
      "99.95% uptime SLA",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FeatureLine({ raw }: { raw: string }) {
  const excluded = raw.startsWith("-");
  const text = excluded ? raw.slice(1).trim() : raw;
  return (
    <li
      className={cn(
        "flex items-start gap-3 text-sm leading-relaxed",
        excluded ? "text-base-content/40" : "text-base-content/80",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          excluded
            ? "bg-base-200 text-base-content/40"
            : "bg-primary/10 text-primary",
        )}
        aria-hidden="true"
      >
        {excluded ? (
          <FiX className="h-3 w-3" />
        ) : (
          <FiCheck className="h-3 w-3" />
        )}
      </span>
      <span>{text}</span>
    </li>
  );
}

interface TierCardProps {
  tier: PricingTier;
  ctaVariant: CtaVariant;
  ctaColorScheme: ColorScheme;
}

function TierCard({ tier, ctaVariant, ctaColorScheme }: TierCardProps) {
  const featured = !!tier.featured;
  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "relative flex flex-col rounded-2xl p-6 md:p-8",
        featured
          ? "bg-base-content text-base-100 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.25)]"
          : "border border-base-300 bg-base-100",
      )}
    >
      {tier.badge && (
        <span
          className={cn(
            "absolute -top-3 left-6 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            featured
              ? "bg-primary text-primary-content"
              : "bg-base-content text-base-100",
          )}
        >
          {tier.badge}
        </span>
      )}

      <header className="mb-6">
        <h3
          className={cn(
            "text-lg font-semibold",
            featured ? "text-base-100" : "text-base-content",
          )}
        >
          {tier.name}
        </h3>
        {tier.description && (
          <p
            className={cn(
              "mt-1 text-sm leading-relaxed",
              featured ? "text-base-100/70" : "text-base-content/60",
            )}
          >
            {tier.description}
          </p>
        )}
      </header>

      <div className="mb-6 flex items-baseline gap-1">
        <span
          className={cn(
            "font-mono text-4xl font-semibold tracking-tight md:text-5xl",
            featured ? "text-base-100" : "text-base-content",
          )}
        >
          {tier.price}
        </span>
        {tier.cadence && (
          <span
            className={cn(
              "text-sm",
              featured ? "text-base-100/60" : "text-base-content/50",
            )}
          >
            {tier.cadence}
          </span>
        )}
      </div>

      <ul
        className={cn(
          "mb-8 flex flex-col gap-3",
          featured &&
            "[&_li]:text-base-100/85 [&_li.text-base-content\\/40]:text-base-100/40",
        )}
      >
        {tier.features.map((f, i) => (
          <FeatureLine key={i} raw={f} />
        ))}
      </ul>

      <div className="mt-auto">
        <CtaButton
          variant={ctaVariant}
          colorScheme={featured ? "primary" : ctaColorScheme}
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
 * PricingTiers — comparison-friendly tiered pricing table with one
 * featured tier and inclusive/excluded feature lines. Designed to slot
 * before a final CTA or FAQ.
 */
export default function PricingTiers({
  label,
  headline,
  description,
  billingToggle,
  tiers = DEFAULT_TIERS,
  footnote,
  styleKit,
  className,
}: PricingTiersProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme = styleKit?.ctaColorScheme ?? "primary";

  // Three tiers => 3 columns; two => 2; four => 2x2 on tablet, 4 on desktop
  const tierColumns =
    tiers.length === 4
      ? "md:grid-cols-2 xl:grid-cols-4"
      : tiers.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";

  return (
    <section className={cn("w-full bg-base-100 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <motion.div
          className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center md:mb-16"
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
              className="mt-4 text-base leading-relaxed text-base-content/60"
            >
              {description}
            </motion.p>
          )}
          {billingToggle && (
            <motion.div
              variants={fadeUp}
              className="mt-6 inline-flex items-center rounded-full border border-base-300 p-1"
              role="tablist"
              aria-label="Billing period"
            >
              <span
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  !billingToggle.activeIsYearly
                    ? "bg-base-content text-base-100"
                    : "text-base-content/70",
                )}
              >
                {billingToggle.monthly}
              </span>
              <span
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  billingToggle.activeIsYearly
                    ? "bg-base-content text-base-100"
                    : "text-base-content/70",
                )}
              >
                {billingToggle.yearly}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Tiers */}
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
          <p className="mt-10 text-center text-sm text-base-content/50">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
