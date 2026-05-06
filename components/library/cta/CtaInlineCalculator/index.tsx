"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CalculatorInput {
  /** Stable key — appears in the result formula (e.g. "amount", "rate") */
  key: string;
  /** Visible label */
  label: string;
  /** Slider min, max, step */
  min: number;
  max: number;
  step: number;
  /** Initial value */
  defaultValue: number;
  /** Optional unit suffix appended to the displayed value (e.g. "%", " years") */
  unit?: string;
  /**
   * Display formatter — controls thousands separators / currency / decimal
   * places. Defaults to `defaultFormat`.
   */
  format?: "currency" | "percent" | "integer" | "decimal";
  /** ISO 4217 code for currency formatting (e.g. "BRL", "USD"). Defaults to "USD". */
  currency?: string;
  /** Optional helper hint shown below the slider */
  hint?: string;
}

export interface CalculatorOutput {
  /** Visible label */
  label: string;
  /**
   * Computation formula — expressed as a callback over the current input
   * map. Returns a numeric result that gets formatted via `format`.
   */
  compute: (values: Record<string, number>) => number;
  /** Display formatter — see CalculatorInput.format */
  format?: "currency" | "percent" | "integer" | "decimal";
  /** ISO 4217 code for currency formatting. Defaults to "USD". */
  currency?: string;
  /** Optional unit suffix appended after the formatted value */
  unit?: string;
  /** Optional helper sub-line beneath the result */
  caption?: string;
  /** When true, this output is rendered as the hero numeral. Exactly one expected. */
  primary?: boolean;
}

export interface CtaInlineCalculatorProps {
  /** Small label rendered above the headline */
  eyebrow?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph beneath the headline */
  description?: string;
  /** Calculator inputs (1–4 reads best) */
  inputs: CalculatorInput[];
  /** Computed outputs — exactly one should be marked primary */
  outputs: CalculatorOutput[];
  /** Primary CTA copy */
  ctaText: string;
  /** Primary CTA destination — receives values via querystring */
  ctaUrl: string;
  /** Optional secondary text-link CTA */
  secondaryText?: string;
  secondaryUrl?: string;
  /** Optional small footnote under the CTA (e.g. assumptions, disclaimer) */
  footnote?: string;
  /**
   * "neutral" — bg-base-100 (default)
   * "muted" — bg-base-200 surface
   */
  tone?: "neutral" | "muted";
  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatValue(
  value: number,
  format: CalculatorInput["format"] = "decimal",
  currency = "USD",
  unit?: string,
): string {
  let core: string;
  switch (format) {
    case "currency":
      core = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(value);
      break;
    case "percent":
      core = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 2,
      }).format(value);
      core = `${core}%`;
      break;
    case "integer":
      core = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 0,
      }).format(Math.round(value));
      break;
    default:
      core = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 2,
      }).format(value);
  }
  return unit ? `${core}${unit}` : core;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CtaInlineCalculator — interactive estimate widget. Use when the
 * conversion benefits from the visitor seeing a number against their own
 * inputs (mortgage payment, savings projection, plan cost) before the
 * form ask. Sliders are immediate; result numerals animate via tabular
 * font-mono so number-shifts don't reflow the layout.
 */
export default function CtaInlineCalculator({
  eyebrow,
  headline,
  description,
  inputs,
  outputs,
  ctaText,
  ctaUrl,
  secondaryText,
  secondaryUrl,
  footnote,
  tone = "neutral",
  styleKit,
  className,
}: CtaInlineCalculatorProps) {
  const shouldReduceMotion = useReducedMotion();
  const ctaVariant: CtaVariant = styleKit?.ctaVariant ?? "default";
  const ctaColorScheme: ColorScheme = styleKit?.ctaColorScheme ?? "primary";

  const [values, setValues] = useState<Record<string, number>>(() =>
    inputs.reduce<Record<string, number>>((acc, i) => {
      acc[i.key] = i.defaultValue;
      return acc;
    }, {}),
  );

  const computed = useMemo(
    () =>
      outputs.map((o) => ({
        ...o,
        value: o.compute(values),
      })),
    [outputs, values],
  );

  const primaryOutput = computed.find((o) => o.primary) ?? computed[0];
  const secondaryOutputs = computed.filter((o) => o !== primaryOutput);

  const isMuted = tone === "muted";

  // Encode inputs into the CTA URL so the next step can pre-fill its form
  const ctaHrefWithValues = useMemo(() => {
    try {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(values)) {
        params.set(k, String(v));
      }
      const sep = ctaUrl.includes("?") ? "&" : "?";
      return `${ctaUrl}${sep}${params.toString()}`;
    } catch {
      return ctaUrl;
    }
  }, [ctaUrl, values]);

  return (
    <section
      className={cn(
        "w-full py-16 md:py-24",
        isMuted ? "bg-base-200" : "bg-base-100",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          className="grid items-stretch gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Copy column */}
          <div className="flex flex-col gap-5">
            {eyebrow && (
              <motion.span
                variants={fadeUp}
                className="text-xs font-semibold uppercase tracking-[0.25em] text-primary"
              >
                {eyebrow}
              </motion.span>
            )}
            <motion.h2
              variants={fadeUp}
              className="text-balance text-3xl font-semibold tracking-tight text-base-content sm:text-4xl md:text-5xl"
            >
              {headline}
            </motion.h2>
            {description && (
              <motion.p
                variants={fadeUp}
                className="max-w-xl text-base leading-relaxed text-base-content/65 md:text-lg"
              >
                {description}
              </motion.p>
            )}

            {/* Inputs */}
            <motion.div variants={fadeUp} className="mt-4 flex flex-col gap-6">
              {inputs.map((input) => {
                const id = `calc-${input.key}`;
                const value = values[input.key] ?? input.defaultValue;
                const displayed = formatValue(
                  value,
                  input.format ?? "decimal",
                  input.currency ?? "USD",
                  input.unit,
                );
                return (
                  <div key={input.key} className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <label
                        htmlFor={id}
                        className="text-sm font-medium text-base-content"
                      >
                        {input.label}
                      </label>
                      <span className="font-mono text-sm font-semibold tabular-nums text-base-content">
                        {displayed}
                      </span>
                    </div>
                    <input
                      id={id}
                      type="range"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={value}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [input.key]: Number(e.target.value),
                        }))
                      }
                      aria-valuetext={displayed}
                      className={cn(
                        "h-2 w-full cursor-pointer appearance-none rounded-full bg-base-300",
                        "accent-primary",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100",
                      )}
                    />
                    <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-base-content/45">
                      <span>
                        {formatValue(
                          input.min,
                          input.format ?? "decimal",
                          input.currency ?? "USD",
                          input.unit,
                        )}
                      </span>
                      <span>
                        {formatValue(
                          input.max,
                          input.format ?? "decimal",
                          input.currency ?? "USD",
                          input.unit,
                        )}
                      </span>
                    </div>
                    {input.hint && (
                      <p className="text-xs leading-relaxed text-base-content/55">
                        {input.hint}
                      </p>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Result panel */}
          <motion.aside
            variants={fadeUp}
            className={cn(
              "flex flex-col gap-6 rounded-2xl p-8 md:p-10",
              isMuted
                ? "bg-base-100 ring-1 ring-base-300"
                : "bg-base-200 ring-1 ring-base-300",
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Primary output — hero numeral */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {primaryOutput.label}
              </span>
              <span className="font-mono text-5xl font-semibold leading-none tabular-nums tracking-tight text-base-content md:text-6xl">
                {formatValue(
                  primaryOutput.value,
                  primaryOutput.format ?? "decimal",
                  primaryOutput.currency ?? "USD",
                  primaryOutput.unit,
                )}
              </span>
              {primaryOutput.caption && (
                <span className="text-sm leading-relaxed text-base-content/65">
                  {primaryOutput.caption}
                </span>
              )}
            </div>

            {/* Secondary outputs */}
            {secondaryOutputs.length > 0 && (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-base-300 pt-6">
                {secondaryOutputs.map((o, i) => (
                  <li key={i} className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-base-content/55">
                      {o.label}
                    </span>
                    <span className="font-mono text-xl font-semibold tabular-nums text-base-content">
                      {formatValue(
                        o.value,
                        o.format ?? "decimal",
                        o.currency ?? "USD",
                        o.unit,
                      )}
                    </span>
                    {o.caption && (
                      <span className="text-xs leading-relaxed text-base-content/55">
                        {o.caption}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* CTA block */}
            <div className="mt-2 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <CtaButton
                  variant={ctaVariant}
                  colorScheme={ctaColorScheme}
                  href={ctaHrefWithValues}
                >
                  {ctaText}
                </CtaButton>
                {secondaryText && secondaryUrl && (
                  <a
                    href={secondaryUrl}
                    className="group inline-flex items-center gap-1 text-sm font-medium text-base-content/70 underline-offset-4 transition-colors hover:text-base-content hover:underline"
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
              {footnote && (
                <p className="text-xs leading-relaxed text-base-content/55">
                  {footnote}
                </p>
              )}
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}
