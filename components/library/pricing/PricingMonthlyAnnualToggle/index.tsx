"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { FiCheck, FiMinus } from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PricingTogglePlan {
  /** Plan name */
  name: string;
  /** Short positioning line */
  description?: string;
  /** Monthly billing price (string — formatted with currency) */
  monthlyPrice: string;
  /** Annual billing price displayed per-month equivalent */
  annualPrice: string;
  /**
   * Optional total annual price (e.g. "$888 billed yearly") shown beneath
   * the per-month figure when annual is selected.
   */
  annualTotal?: string;
  /** Optional badge for the highlighted plan */
  badge?: string;
  /** CTA label */
  ctaText: string;
  /** CTA destination */
  ctaUrl: string;
  /** Inclusive features. Prefix with "-" to render as excluded line. */
  features: string[];
  /** When true, this plan renders inverted */
  featured?: boolean;
}

export interface PricingMonthlyAnnualToggleProps {
  /** Eyebrow above the headline */
  label?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** Toggle copy — left (monthly) and right (annual) labels */
  monthlyLabel?: string;
  annualLabel?: string;
  /** Discount badge text shown next to the annual label (e.g. "Save 18%") */
  annualDiscountBadge?: string;
  /** Initial billing cycle — defaults to "monthly" */
  defaultCycle?: "monthly" | "annual";
  /** Plan tiles — between 2 and 4 */
  plans: PricingTogglePlan[];
  /** Footnote */
  footnote?: string;
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_PLANS: PricingTogglePlan[] = [
  {
    name: "Solo",
    description: "For one founder validating an idea.",
    monthlyPrice: "$22",
    annualPrice: "$18",
    annualTotal: "$216 billed yearly",
    ctaText: "Try free",
    ctaUrl: "/signup?plan=solo",
    features: [
      "1 active project",
      "8 GB asset storage",
      "Email support · 48h reply",
      "-Custom domains",
    ],
  },
  {
    name: "Studio",
    description: "Small teams shipping every week.",
    monthlyPrice: "$74",
    annualPrice: "$59",
    annualTotal: "$708 billed yearly",
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
    monthlyPrice: "$236",
    annualPrice: "$199",
    annualTotal: "$2,388 billed yearly",
    ctaText: "Talk to sales",
    ctaUrl: "/contact?plan=scale",
    features: [
      "Everything in Studio",
      "1 TB asset storage",
      "SSO, SAML, audit logs",
      "Dedicated success engineer",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface ToggleProps {
  cycle: "monthly" | "annual";
  monthlyLabel: string;
  annualLabel: string;
  annualDiscountBadge?: string;
  onChange: (next: "monthly" | "annual") => void;
}

function BillingToggle({
  cycle,
  monthlyLabel,
  annualLabel,
  annualDiscountBadge,
  onChange,
}: ToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Billing period"
      className="relative inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/60 p-1"
    >
      <button
        type="button"
        role="tab"
        aria-selected={cycle === "monthly"}
        onClick={() => onChange("monthly")}
        className={cn(
          "relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors",
          cycle === "monthly"
            ? "text-base-100"
            : "text-base-content/65 hover:text-base-content",
        )}
      >
        {cycle === "monthly" && (
          <motion.span
            layoutId="cycle-pill"
            className="absolute inset-0 -z-10 rounded-full bg-base-content"
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          />
        )}
        {monthlyLabel}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={cycle === "annual"}
        onClick={() => onChange("annual")}
        className={cn(
          "relative z-10 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors",
          cycle === "annual"
            ? "text-base-100"
            : "text-base-content/65 hover:text-base-content",
        )}
      >
        {cycle === "annual" && (
          <motion.span
            layoutId="cycle-pill"
            className="absolute inset-0 -z-10 rounded-full bg-base-content"
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          />
        )}
        <span>{annualLabel}</span>
        {annualDiscountBadge && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors",
              cycle === "annual"
                ? "bg-primary text-primary-content"
                : "bg-primary/12 text-primary",
            )}
          >
            {annualDiscountBadge}
          </span>
        )}
      </button>
    </div>
  );
}

function FeatureLine({ raw, inverted }: { raw: string; inverted?: boolean }) {
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

interface PlanCardProps {
  plan: PricingTogglePlan;
  cycle: "monthly" | "annual";
  ctaVariant: CtaVariant;
  ctaColorScheme: ColorScheme;
  monthlyCadenceLabel: string;
  annualCadenceLabel: string;
}

function PlanCard({
  plan,
  cycle,
  ctaVariant,
  ctaColorScheme,
  monthlyCadenceLabel,
  annualCadenceLabel,
}: PlanCardProps) {
  const inverted = !!plan.featured;
  const price = cycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
  const cadence =
    cycle === "monthly" ? monthlyCadenceLabel : annualCadenceLabel;

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
      {plan.badge && (
        <span
          className={cn(
            "absolute -top-3 left-6 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
            inverted
              ? "bg-primary text-primary-content"
              : "bg-base-content text-base-100",
          )}
        >
          {plan.badge}
        </span>
      )}

      <header className="mb-5">
        <h3
          className={cn(
            "text-base font-semibold uppercase tracking-[0.12em]",
            inverted ? "text-base-100/80" : "text-base-content/70",
          )}
        >
          {plan.name}
        </h3>
        {plan.description && (
          <p
            className={cn(
              "mt-2 text-sm leading-relaxed",
              inverted ? "text-base-100/65" : "text-base-content/60",
            )}
          >
            {plan.description}
          </p>
        )}
      </header>

      {/* Price — animates between monthly/annual via AnimatePresence */}
      <div className="mb-2 min-h-[3.75rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${cycle}-${price}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-baseline gap-1.5"
          >
            <span
              className={cn(
                "font-mono text-5xl font-semibold tracking-tight md:text-6xl",
                inverted ? "text-base-100" : "text-base-content",
              )}
            >
              {price}
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                inverted ? "text-base-100/60" : "text-base-content/55",
              )}
            >
              {cadence}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mb-7 min-h-[1.25rem]">
        <AnimatePresence mode="wait" initial={false}>
          {cycle === "annual" && plan.annualTotal && (
            <motion.p
              key="annual-total"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={cn(
                "text-xs",
                inverted ? "text-base-100/55" : "text-base-content/55",
              )}
            >
              {plan.annualTotal}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <ul className="mb-8 flex flex-col gap-3">
        {plan.features.map((f, i) => (
          <FeatureLine key={i} raw={f} inverted={inverted} />
        ))}
      </ul>

      <div className="mt-auto">
        <CtaButton
          variant={ctaVariant}
          colorScheme={inverted ? "primary" : ctaColorScheme}
          href={plan.ctaUrl}
          className="w-full justify-center"
        >
          {plan.ctaText}
        </CtaButton>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * PricingMonthlyAnnualToggle — animated billing-cycle switch with a
 * sliding pill (shared layoutId), per-plan price cross-fade on change,
 * and an annual-discount badge that pulls focus only when active.
 *
 * Toggle is keyboard-accessible (role="tablist", aria-selected). The
 * featured plan lifts -3 to break the horizon line so the desktop row
 * is never three equal cards.
 */
export default function PricingMonthlyAnnualToggle({
  label,
  headline,
  description,
  monthlyLabel = "Monthly",
  annualLabel = "Annual",
  annualDiscountBadge,
  defaultCycle = "monthly",
  plans = DEFAULT_PLANS,
  footnote,
  styleKit,
  className,
}: PricingMonthlyAnnualToggleProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme = styleKit?.ctaColorScheme ?? "primary";
  const [cycle, setCycle] = useState<"monthly" | "annual">(defaultCycle);

  const planColumns =
    plans.length === 4
      ? "md:grid-cols-2 xl:grid-cols-4"
      : plans.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";

  return (
    <section className={cn("w-full bg-base-100 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header + toggle */}
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
              className="mt-4 max-w-[58ch] text-base leading-relaxed text-base-content/65"
            >
              {description}
            </motion.p>
          )}
          <motion.div variants={fadeUp} className="mt-7">
            <BillingToggle
              cycle={cycle}
              monthlyLabel={monthlyLabel}
              annualLabel={annualLabel}
              annualDiscountBadge={annualDiscountBadge}
              onChange={setCycle}
            />
          </motion.div>
        </motion.div>

        {/* Plans */}
        <motion.div
          className={cn("grid grid-cols-1 gap-6", planColumns)}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {plans.map((plan, i) => (
            <PlanCard
              key={i}
              plan={plan}
              cycle={cycle}
              ctaVariant={ctaVariant}
              ctaColorScheme={ctaColorScheme}
              monthlyCadenceLabel="/mo"
              annualCadenceLabel="/mo · billed yearly"
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
