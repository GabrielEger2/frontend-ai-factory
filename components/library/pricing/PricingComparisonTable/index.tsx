"use client";

import { motion, useReducedMotion } from "motion/react";
import { FiCheck, FiMinus } from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PricingComparisonColumn {
  /** Column / plan name */
  name: string;
  /** Headline price (e.g. "$74", "Custom") */
  price: string;
  /** Cadence suffix — "/mo", "billed yearly" */
  cadence?: string;
  /** Optional badge text on the highlighted column */
  badge?: string;
  /** Per-column CTA */
  ctaText: string;
  /** Per-column CTA destination */
  ctaUrl: string;
  /** Visual emphasis — vertical fill that anchors the eye on this column */
  featured?: boolean;
}

export interface PricingComparisonRow {
  /** Feature row label */
  label: string;
  /** Optional row description / tooltip line */
  hint?: string;
  /**
   * Per-column value, indexed in the same order as `columns`.
   *
   * Strings render as-is (e.g. "5 GB", "Unlimited"), `true` renders a
   * check, `false` or omitted renders a muted dash.
   */
  values: Array<string | boolean | null>;
}

export interface PricingComparisonGroup {
  /** Group heading rendered above the rows (e.g. "Limits", "Security") */
  title: string;
  rows: PricingComparisonRow[];
}

export interface PricingComparisonTableProps {
  /** Eyebrow above the headline */
  label?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** Plan columns — between 2 and 4 */
  columns: PricingComparisonColumn[];
  /** Grouped rows — typically 2 to 4 groups */
  groups: PricingComparisonGroup[];
  /** Footnote line below the table */
  footnote?: string;
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_COLUMNS: PricingComparisonColumn[] = [
  {
    name: "Solo",
    price: "$22",
    cadence: "/mo",
    ctaText: "Try free",
    ctaUrl: "/signup?plan=solo",
  },
  {
    name: "Studio",
    price: "$74",
    cadence: "/mo",
    badge: "Most chosen",
    featured: true,
    ctaText: "Try Studio free",
    ctaUrl: "/signup?plan=studio",
  },
  {
    name: "Scale",
    price: "$236",
    cadence: "/mo",
    ctaText: "Talk to sales",
    ctaUrl: "/contact?plan=scale",
  },
];

const DEFAULT_GROUPS: PricingComparisonGroup[] = [
  {
    title: "Limits",
    rows: [
      { label: "Active projects", values: ["1", "Unlimited", "Unlimited"] },
      { label: "Asset storage", values: ["8 GB", "120 GB", "1 TB"] },
      { label: "Seats included", values: ["1", "5", "25"] },
    ],
  },
  {
    title: "Collaboration",
    rows: [
      { label: "Custom domains", values: [false, true, true] },
      { label: "Workspaces", values: [false, true, true] },
      { label: "Branch previews", values: [false, true, true] },
    ],
  },
  {
    title: "Security & support",
    rows: [
      { label: "Email support", values: ["48h", "12h", "12h"] },
      {
        label: "Shared Slack channel",
        values: [false, true, true],
      },
      { label: "SSO and audit logs", values: [false, false, true] },
      {
        label: "Uptime guarantee",
        hint: "Service-credit refund when missed.",
        values: ["99.5%", "99.9%", "99.95%"],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Cell renderer                                                      */
/* ------------------------------------------------------------------ */

function ValueCell({ raw }: { raw: string | boolean | null }) {
  if (raw === true) {
    return (
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/12 text-primary"
        aria-label="Included"
      >
        <FiCheck className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    );
  }
  if (raw === false || raw === null || raw === undefined) {
    return (
      <span
        className="inline-flex h-6 w-6 items-center justify-center text-base-content/30"
        aria-label="Not included"
      >
        <FiMinus className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    );
  }
  return <span className="font-mono text-sm text-base-content/85">{raw}</span>;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * PricingComparisonTable — divider-led feature × plan matrix. Designed
 * for buyers who need the full feature footprint visible at once
 * instead of three brochure cards. Cockpit density (font-mono numerals,
 * divide-y rows, no card boxes) per taste-dials density 8.
 */
export default function PricingComparisonTable({
  label,
  headline,
  description,
  columns = DEFAULT_COLUMNS,
  groups = DEFAULT_GROUPS,
  footnote,
  styleKit,
  className,
}: PricingComparisonTableProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme = styleKit?.ctaColorScheme ?? "primary";
  const colCount = columns.length;
  // Mobile column template: feature label takes 1.4fr; each column 1fr.
  const desktopGrid = `[grid-template-columns:minmax(0,1.6fr)_repeat(${colCount},minmax(0,1fr))]`;

  return (
    <section className={cn("w-full bg-base-100 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Header */}
        <motion.div
          className="mb-10 max-w-2xl md:mb-14"
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

        {/* Mobile — stacked column cards */}
        <div className="md:hidden">
          <div className="flex flex-col gap-8">
            {columns.map((col, ci) => (
              <article
                key={ci}
                className={cn(
                  "rounded-3xl p-6",
                  col.featured
                    ? "bg-base-content text-base-100"
                    : "border border-base-300 bg-base-100",
                )}
              >
                {col.badge && (
                  <span
                    className={cn(
                      "mb-3 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                      col.featured
                        ? "bg-primary text-primary-content"
                        : "bg-base-content text-base-100",
                    )}
                  >
                    {col.badge}
                  </span>
                )}
                <h3
                  className={cn(
                    "text-sm font-semibold uppercase tracking-[0.14em]",
                    col.featured ? "text-base-100/75" : "text-base-content/65",
                  )}
                >
                  {col.name}
                </h3>
                <div className="mb-4 mt-2 flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      "font-mono text-4xl font-semibold tracking-tight",
                      col.featured ? "text-base-100" : "text-base-content",
                    )}
                  >
                    {col.price}
                  </span>
                  {col.cadence && (
                    <span
                      className={cn(
                        "text-sm",
                        col.featured
                          ? "text-base-100/55"
                          : "text-base-content/55",
                      )}
                    >
                      {col.cadence}
                    </span>
                  )}
                </div>

                <div className="mb-6 flex flex-col divide-y divide-base-content/10">
                  {groups.map((g, gi) => (
                    <div key={gi} className="py-4 first:pt-0">
                      <p
                        className={cn(
                          "mb-3 text-xs font-semibold uppercase tracking-[0.16em]",
                          col.featured
                            ? "text-base-100/55"
                            : "text-base-content/55",
                        )}
                      >
                        {g.title}
                      </p>
                      <ul className="flex flex-col gap-2.5">
                        {g.rows.map((row, ri) => (
                          <li
                            key={ri}
                            className="flex items-baseline justify-between gap-4 text-sm"
                          >
                            <span
                              className={cn(
                                col.featured
                                  ? "text-base-100/85"
                                  : "text-base-content/80",
                              )}
                            >
                              {row.label}
                            </span>
                            <span
                              className={cn(
                                "font-mono text-sm",
                                col.featured
                                  ? "text-base-100"
                                  : "text-base-content",
                              )}
                            >
                              {(() => {
                                const v = row.values[ci];
                                if (v === true) return "Included";
                                if (
                                  v === false ||
                                  v === null ||
                                  v === undefined
                                )
                                  return "—";
                                return v;
                              })()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <CtaButton
                  variant={ctaVariant}
                  colorScheme={col.featured ? "primary" : ctaColorScheme}
                  href={col.ctaUrl}
                  className="w-full justify-center"
                >
                  {col.ctaText}
                </CtaButton>
              </article>
            ))}
          </div>
        </div>

        {/* Desktop — grid table */}
        <motion.div
          className={cn("relative hidden overflow-hidden md:block")}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Featured column highlight band */}
          {columns.findIndex((c) => c.featured) > -1 && (
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 rounded-2xl bg-base-content/[0.04]",
              )}
              style={{
                gridColumn: `${columns.findIndex((c) => c.featured) + 2} / span 1`,
              }}
              aria-hidden="true"
            />
          )}

          {/* Header row */}
          <motion.div
            variants={fadeUp}
            className={cn(
              "grid items-end gap-6 border-b border-base-300 pb-6",
              desktopGrid,
            )}
          >
            <div className="text-sm font-semibold text-base-content/65">
              Compare plans
            </div>
            {columns.map((col, i) => (
              <div key={i} className="text-left">
                {col.badge && (
                  <span className="mb-2 inline-flex items-center rounded-full bg-primary/12 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                    {col.badge}
                  </span>
                )}
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-base-content/65">
                  {col.name}
                </p>
                <p className="mt-2 flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-semibold tracking-tight text-base-content">
                    {col.price}
                  </span>
                  {col.cadence && (
                    <span className="text-xs text-base-content/55">
                      {col.cadence}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Groups */}
          {groups.map((g, gi) => (
            <motion.div
              key={gi}
              variants={fadeUp}
              className="border-b border-base-300/70 last:border-0"
            >
              <p
                className={cn(
                  "grid pb-3 pt-7 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/55",
                  desktopGrid,
                )}
              >
                <span>{g.title}</span>
              </p>
              <ul className="divide-y divide-base-content/[0.06]">
                {g.rows.map((row, ri) => (
                  <li
                    key={ri}
                    className={cn(
                      "grid items-center gap-6 py-3.5 text-sm",
                      desktopGrid,
                    )}
                  >
                    <div>
                      <p className="text-base-content/85">{row.label}</p>
                      {row.hint && (
                        <p className="mt-0.5 text-xs text-base-content/50">
                          {row.hint}
                        </p>
                      )}
                    </div>
                    {columns.map((_, ci) => (
                      <div key={ci} className="text-left">
                        <ValueCell raw={row.values[ci]} />
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* CTA row */}
          <motion.div
            variants={fadeUp}
            className={cn("grid items-center gap-6 pt-6", desktopGrid)}
          >
            <div className="text-sm text-base-content/55">Pick your plan</div>
            {columns.map((col, i) => (
              <div key={i}>
                <CtaButton
                  variant={ctaVariant}
                  colorScheme={col.featured ? "primary" : ctaColorScheme}
                  href={col.ctaUrl}
                  className="w-full justify-center"
                >
                  {col.ctaText}
                </CtaButton>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {footnote && (
          <p className="mt-10 text-center text-sm text-base-content/55">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
