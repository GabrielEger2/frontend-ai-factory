"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ComparisonFeature {
  /** Row label — the criterion being compared */
  label: string;
  /** Optional row group — features sharing the same group string render
   *  under a single mono-caps section header inside the table */
  group?: string;
  /** Optional supporting line under the label — clarifies the criterion */
  note?: string;
  /** Value for the left column. `true`/`false` render as check/cross icons,
   *  any string renders as inline text */
  optionA: boolean | string;
  /** Value for the right (preferred) column */
  optionB: boolean | string;
}

export interface ComparisonMeta {
  /** Mono-caps label — e.g. "Source", "Window", "Verified by" */
  label: string;
  /** Plain-weight value */
  value: string;
}

export interface ComparisonMetric {
  /** The number itself — keep it organic (e.g. "47.2%", "3,847") */
  value: string;
  /** One-line context for the number */
  label: string;
}

export interface ComparisonPullQuote {
  /** The quote itself, no surrounding punctuation */
  quote: string;
  /** Person or organisation it is attributed to */
  attribution: string;
  /** Optional secondary attribution line — role, location, etc. */
  attributionMeta?: string;
}

export interface ComparisonSplitProps {
  eyebrow?: string;
  headline: string;
  description?: string;
  /** Optional section-level meta strip — renders as a 4-up dl band under the header */
  meta?: ComparisonMeta[];
  optionALabel: string;
  optionASubtext?: string;
  optionBLabel: string;
  optionBSubtext?: string;
  features?: ComparisonFeature[];
  /** Optional footnote rendered below the comparison table — methodology,
   *  data source, last-updated stamp */
  footnote?: string;
  /** Optional pull-quote — renders between the table and the metrics band */
  pullQuote?: ComparisonPullQuote;
  /** Optional outcome metrics rendered as a dark band below the table */
  metrics?: ComparisonMetric[];
  ctaText?: string;
  ctaUrl?: string;
  ctaStyle?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  colorScheme?: "light" | "dark";
  styleKit?: StyleKit;
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_FEATURES: ComparisonFeature[] = [
  { label: "Project setup time", optionA: "1–2 weeks", optionB: "Same day" },
  { label: "AI-generated copy", optionA: false, optionB: true },
  { label: "Mobile-optimized layout", optionA: false, optionB: true },
  { label: "SEO-ready metadata", optionA: false, optionB: true },
  { label: "Custom domain included", optionA: false, optionB: true },
  {
    label: "Revisions per round",
    optionA: "Unlimited (slow)",
    optionB: "3 fast rounds",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components — inline check / cross / text values                */
/* ------------------------------------------------------------------ */

function FeatureValue({
  value,
  isDark,
}: {
  value: boolean | string;
  isDark: boolean;
}) {
  if (value === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-3.5 w-3.5"
          aria-hidden="true"
        >
          <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
        </svg>
        <span className="sr-only">Yes</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-full",
          isDark
            ? "bg-base-content/10 text-neutral-content/30"
            : "bg-base-200 text-base-content/30",
        )}
      >
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-3.5 w-3.5"
          aria-hidden="true"
        >
          <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
        </svg>
        <span className="sr-only">No</span>
      </span>
    );
  }
  return (
    <span
      className={cn(
        "text-sm leading-snug md:text-base",
        isDark ? "text-neutral-content/85" : "text-base-content/85",
      )}
    >
      {value}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * ComparisonSplit — editorial two-column comparison table framed as a
 * long-form decision aid. An optional project meta strip (source / window
 * / verified-by) anchors the section above; the table itself groups
 * feature rows under optional mono-caps section headers, with the
 * preferred column visually elevated and labelled in the primary tint;
 * optional row notes clarify each criterion. Below the table, a methodology
 * footnote, a pull-quote, an outcome metrics band, and a closing CTA let
 * the section carry an entire decision page on its own. Useful for
 * before/after rebuilds, plan tier comparisons, DIY-vs-service framings,
 * and head-to-head competitor positioning.
 */
export default function ComparisonSplit({
  eyebrow,
  headline,
  description,
  meta,
  optionALabel,
  optionASubtext,
  optionBLabel,
  optionBSubtext,
  features = DEFAULT_FEATURES,
  footnote,
  pullQuote,
  metrics,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  colorScheme = "light",
  styleKit,
  purpose,
  className,
}: ComparisonSplitProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDark = colorScheme === "dark";

  /* Group rows by `group` while preserving order. Rows without a group
     stay in their own implicit "default" bucket rendered first. */
  const groupedFeatures = (() => {
    const groups: { group: string | undefined; rows: ComparisonFeature[] }[] =
      [];
    let current: {
      group: string | undefined;
      rows: ComparisonFeature[];
    } | null = null;
    for (const feature of features) {
      if (!current || current.group !== feature.group) {
        current = { group: feature.group, rows: [] };
        groups.push(current);
      }
      current.rows.push(feature);
    }
    return groups;
  })();

  const hasGroups = groupedFeatures.some((g) => g.group);

  return (
    <section
      data-purpose={purpose}
      className={cn(
        "relative w-full overflow-hidden py-16 md:py-24 lg:py-32",
        isDark
          ? "bg-neutral text-neutral-content"
          : "bg-base-100 text-base-content",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* ---------- Header ---------- */}
        <motion.div
          className="mb-10 flex max-w-3xl flex-col md:mb-14"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {eyebrow && (
            <motion.span
              variants={fadeUp}
              className="font-mono text-xs uppercase tracking-[0.25em] text-primary"
            >
              {eyebrow}
            </motion.span>
          )}
          <motion.h2
            variants={fadeUp}
            className={cn(
              "mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl",
              isDark ? "text-neutral-content" : "text-base-content",
            )}
          >
            {headline}
          </motion.h2>
          {description && (
            <motion.p
              variants={fadeUp}
              className={cn(
                "mt-5 max-w-[60ch] text-base leading-relaxed md:text-lg",
                isDark ? "text-neutral-content/70" : "text-base-content/70",
              )}
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        {/* ---------- Section-level meta strip ---------- */}
        {meta && meta.length > 0 && (
          <motion.dl
            className={cn(
              "mb-12 grid grid-cols-2 gap-x-6 gap-y-6 border-y py-6 md:mb-16 md:grid-cols-4",
              isDark ? "border-base-content/15" : "border-base-300",
            )}
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {meta.map((m, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex flex-col gap-1"
              >
                <dt
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-[0.2em]",
                    isDark ? "text-neutral-content/55" : "text-base-content/55",
                  )}
                >
                  {m.label}
                </dt>
                <dd
                  className={cn(
                    "text-base font-medium",
                    isDark ? "text-neutral-content" : "text-base-content",
                  )}
                >
                  {m.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        )}

        {/* ---------- Comparison table ---------- */}
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={cn(
            "overflow-hidden rounded-3xl border",
            isDark ? "border-base-content/15" : "border-base-300",
          )}
        >
          {/* Header row — column labels */}
          <div
            className={cn(
              "grid grid-cols-[1.4fr_1fr_1fr] border-b md:grid-cols-[1.6fr_1fr_1fr]",
              isDark ? "border-base-content/15" : "border-base-300",
            )}
          >
            <div
              className={cn(
                "px-4 py-6 md:px-8 md:py-8",
                isDark ? "bg-neutral" : "bg-base-100",
              )}
            >
              <p
                className={cn(
                  "font-mono text-[10px] uppercase tracking-[0.22em]",
                  isDark ? "text-neutral-content/55" : "text-base-content/55",
                )}
              >
                Criterion
              </p>
            </div>
            <div
              className={cn(
                "border-x px-4 py-6 md:px-8 md:py-8",
                isDark
                  ? "border-base-content/15 bg-neutral"
                  : "border-base-300 bg-base-100",
              )}
            >
              <p
                className={cn(
                  "font-mono text-[10px] uppercase tracking-[0.22em]",
                  isDark ? "text-neutral-content/55" : "text-base-content/55",
                )}
              >
                Option A
              </p>
              <p
                className={cn(
                  "mt-2 text-base font-semibold leading-tight md:text-lg",
                  isDark ? "text-neutral-content" : "text-base-content",
                )}
              >
                {optionALabel}
              </p>
              {optionASubtext && (
                <p
                  className={cn(
                    "mt-1 text-xs md:text-sm",
                    isDark ? "text-neutral-content/55" : "text-base-content/55",
                  )}
                >
                  {optionASubtext}
                </p>
              )}
            </div>
            <div
              className={cn(
                "relative px-4 py-6 md:px-8 md:py-8",
                isDark ? "bg-primary/15" : "bg-primary/8",
              )}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 bg-primary"
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                Option B · Recommended
              </p>
              <p
                className={cn(
                  "mt-2 text-base font-semibold leading-tight md:text-lg",
                  isDark ? "text-neutral-content" : "text-base-content",
                )}
              >
                {optionBLabel}
              </p>
              {optionBSubtext && (
                <p className="mt-1 text-xs text-primary/70 md:text-sm">
                  {optionBSubtext}
                </p>
              )}
            </div>
          </div>

          {/* Body — grouped rows */}
          {groupedFeatures.map((group, gi) => (
            <div key={gi}>
              {hasGroups && group.group && (
                <motion.div
                  variants={fadeUp}
                  className={cn(
                    "grid grid-cols-[1.4fr_1fr_1fr] border-b md:grid-cols-[1.6fr_1fr_1fr]",
                    isDark
                      ? "border-base-content/15 bg-base-content/5"
                      : "border-base-300 bg-base-200/50",
                  )}
                >
                  <div className="col-span-3 px-4 py-3 md:px-8">
                    <span
                      className={cn(
                        "font-mono text-[10px] uppercase tracking-[0.22em]",
                        isDark
                          ? "text-neutral-content/60"
                          : "text-base-content/60",
                      )}
                    >
                      {group.group}
                    </span>
                  </div>
                </motion.div>
              )}
              {group.rows.map((feature, i) => {
                const rowIndex =
                  groupedFeatures
                    .slice(0, gi)
                    .reduce((acc, g) => acc + g.rows.length, 0) + i;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className={cn(
                      "grid grid-cols-[1.4fr_1fr_1fr] border-b last:border-b-0 md:grid-cols-[1.6fr_1fr_1fr]",
                      isDark ? "border-base-content/15" : "border-base-300",
                      rowIndex % 2 === 0
                        ? isDark
                          ? "bg-neutral"
                          : "bg-base-100"
                        : isDark
                          ? "bg-base-content/5"
                          : "bg-base-200/40",
                    )}
                  >
                    <div className="flex flex-col justify-center gap-1 px-4 py-5 md:px-8 md:py-6">
                      <span
                        className={cn(
                          "text-sm font-medium md:text-base",
                          isDark ? "text-neutral-content" : "text-base-content",
                        )}
                      >
                        {feature.label}
                      </span>
                      {feature.note && (
                        <span
                          className={cn(
                            "text-xs leading-snug md:text-sm",
                            isDark
                              ? "text-neutral-content/55"
                              : "text-base-content/55",
                          )}
                        >
                          {feature.note}
                        </span>
                      )}
                    </div>
                    <div
                      className={cn(
                        "flex items-center justify-center border-x px-4 py-5 md:px-8 md:py-6",
                        isDark ? "border-base-content/15" : "border-base-300",
                      )}
                    >
                      <FeatureValue value={feature.optionA} isDark={isDark} />
                    </div>
                    <div
                      className={cn(
                        "flex items-center justify-center px-4 py-5 md:px-8 md:py-6",
                        isDark ? "bg-primary/10" : "bg-primary/5",
                      )}
                    >
                      <FeatureValue value={feature.optionB} isDark={isDark} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </motion.div>

        {/* ---------- Methodology footnote ---------- */}
        {footnote && (
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "mt-5 max-w-[70ch] font-mono text-[11px] leading-relaxed tracking-[0.04em]",
              isDark ? "text-neutral-content/55" : "text-base-content/55",
            )}
          >
            {footnote}
          </motion.p>
        )}

        {/* ---------- Pull quote ---------- */}
        {pullQuote && (
          <motion.figure
            className="mt-16 max-w-4xl border-l-2 border-primary pl-6 md:mt-24 md:pl-10"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <blockquote
              className={cn(
                "text-balance font-serif text-2xl leading-snug md:text-3xl lg:text-4xl",
                isDark ? "text-neutral-content" : "text-base-content",
              )}
            >
              &ldquo;{pullQuote.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex flex-col gap-1">
              <span
                className={cn(
                  "text-sm font-medium md:text-base",
                  isDark ? "text-neutral-content" : "text-base-content",
                )}
              >
                {pullQuote.attribution}
              </span>
              {pullQuote.attributionMeta && (
                <span
                  className={cn(
                    "font-mono text-[11px] uppercase tracking-[0.22em]",
                    isDark ? "text-neutral-content/55" : "text-base-content/55",
                  )}
                >
                  {pullQuote.attributionMeta}
                </span>
              )}
            </figcaption>
          </motion.figure>
        )}

        {/* ---------- Outcome metrics band ---------- */}
        {metrics && metrics.length > 0 && (
          <motion.div
            className={cn(
              "grid grid-cols-2 gap-6 rounded-3xl px-6 py-10 md:grid-cols-4 md:px-12 md:py-14",
              isDark
                ? "bg-base-content text-neutral"
                : "bg-base-content text-base-100",
              pullQuote ? "mt-12 md:mt-16" : "mt-16 md:mt-24",
            )}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {metrics.map((m, i) => (
              <div key={i} className="flex flex-col items-start gap-1">
                <span className="font-mono text-3xl font-semibold tracking-tight md:text-5xl">
                  {m.value}
                </span>
                <span
                  className={cn(
                    "text-xs leading-snug md:text-sm",
                    isDark ? "text-neutral/70" : "text-base-100/70",
                  )}
                >
                  {m.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* ---------- Closing CTA ---------- */}
        {ctaText && ctaUrl && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-12 flex justify-start md:mt-16"
          >
            <CtaButton
              variant={styleKit?.ctaVariant ?? ctaStyle}
              colorScheme={styleKit?.ctaColorScheme ?? ctaColorScheme}
              href={ctaUrl}
            >
              {ctaText}
            </CtaButton>
          </motion.div>
        )}
      </div>
    </section>
  );
}
