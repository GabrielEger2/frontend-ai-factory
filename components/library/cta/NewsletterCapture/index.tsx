"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { FiCheck, FiArrowRight } from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface NewsletterCaptureProps {
  /** Small label rendered above the headline */
  label?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** Email input placeholder */
  emailPlaceholder?: string;
  /** Submit button copy */
  ctaText?: string;
  /** POST endpoint — when omitted, the form short-circuits to the success state */
  formAction?: string;
  /** Bullet list of perks shown beneath the form */
  perks?: string[];
  /** Tiny disclaimer beneath the perks (privacy / unsubscribe) */
  disclaimer?: string;
  /** Success message shown after submit */
  successMessage?: string;
  /**
   * "split" — copy left, form right (default)
   * "stacked" — copy on top, form beneath, narrower max-width
   */
  layoutVariant?: "split" | "stacked";
  /**
   * "neutral" — bg-base-200 surface (default, calmer)
   * "inverse" — bg-base-content / text-base-100 (darker, more attention)
   */
  tone?: "neutral" | "inverse";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_PERKS = [
  "One essay every Sunday morning",
  "Subscriber-only deep-dives once a month",
  "Unsubscribe in two clicks, archive stays open",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * NewsletterCapture — pre-footer email capture for blogs, communities,
 * and product launches. Handles its own success state via local state
 * when no `formAction` is provided; otherwise posts to the endpoint.
 */
export default function NewsletterCapture({
  label,
  headline,
  description,
  emailPlaceholder = "you@yourcompany.com",
  ctaText = "Subscribe",
  formAction,
  perks = DEFAULT_PERKS,
  disclaimer,
  successMessage = "You're in. Check your inbox for a confirmation.",
  layoutVariant = "split",
  tone = "neutral",
  className,
}: NewsletterCaptureProps) {
  const shouldReduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);

  const isInverse = tone === "inverse";
  const isStacked = layoutVariant === "stacked";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (formAction) return; // let the browser POST naturally
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      className={cn(
        "w-full py-16 md:py-24",
        isInverse ? "bg-base-content text-base-100" : "bg-base-200",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto px-4 md:px-8",
          isStacked ? "max-w-2xl text-center" : "max-w-7xl",
        )}
      >
        <motion.div
          className={cn(
            "grid items-center gap-10",
            !isStacked && "lg:grid-cols-2 lg:gap-16",
          )}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Copy column */}
          <div className={cn(isStacked && "mx-auto")}>
            {label && (
              <motion.p
                variants={fadeUp}
                className={cn(
                  "mb-3 text-xs font-semibold uppercase tracking-[0.25em]",
                  isInverse ? "text-base-100/60" : "text-primary",
                )}
              >
                {label}
              </motion.p>
            )}
            <motion.h2
              variants={fadeUp}
              className={cn(
                "text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl",
                isInverse ? "text-base-100" : "text-base-content",
              )}
            >
              {headline}
            </motion.h2>
            {description && (
              <motion.p
                variants={fadeUp}
                className={cn(
                  "mt-4 max-w-xl text-base leading-relaxed",
                  isStacked && "mx-auto",
                  isInverse ? "text-base-100/70" : "text-base-content/65",
                )}
              >
                {description}
              </motion.p>
            )}
          </div>

          {/* Form column */}
          <motion.div
            variants={fadeUp}
            className={cn("w-full", isStacked && "mt-2")}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl p-6",
                    isInverse
                      ? "bg-base-100/10 text-base-100"
                      : "bg-base-100 text-base-content",
                  )}
                  role="status"
                  aria-live="polite"
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      isInverse
                        ? "bg-base-100 text-base-content"
                        : "bg-primary text-primary-content",
                    )}
                    aria-hidden="true"
                  >
                    <FiCheck className="h-4 w-4" />
                  </span>
                  <p className="text-base leading-relaxed">{successMessage}</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onSubmit={handleSubmit}
                  action={formAction}
                  method="post"
                  className="w-full"
                >
                  <div
                    className={cn(
                      "flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2",
                      "rounded-2xl p-2",
                      isInverse
                        ? "bg-base-100/10 ring-1 ring-base-100/20"
                        : "bg-base-100 ring-1 ring-base-300",
                    )}
                  >
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      name="email"
                      required
                      placeholder={emailPlaceholder}
                      autoComplete="email"
                      className={cn(
                        "h-11 w-full flex-1 bg-transparent px-3 text-base outline-none",
                        isInverse
                          ? "text-base-100 placeholder:text-base-100/40"
                          : "text-base-content placeholder:text-base-content/40",
                      )}
                    />
                    <button
                      type="submit"
                      className={cn(
                        "group inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                        isInverse
                          ? "bg-base-100 text-base-content hover:bg-base-100/90 focus-visible:ring-offset-base-content"
                          : "bg-base-content text-base-100 hover:bg-base-content/90 focus-visible:ring-offset-base-100",
                      )}
                    >
                      <span>{ctaText}</span>
                      <FiArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                  </div>

                  {perks && perks.length > 0 && (
                    <ul
                      className={cn(
                        "mt-5 flex flex-col gap-2",
                        isStacked && "items-center",
                      )}
                    >
                      {perks.map((p, i) => (
                        <li
                          key={i}
                          className={cn(
                            "flex items-start gap-2 text-sm leading-relaxed",
                            isInverse
                              ? "text-base-100/70"
                              : "text-base-content/70",
                          )}
                        >
                          <FiCheck
                            className={cn(
                              "mt-0.5 h-4 w-4 shrink-0",
                              isInverse ? "text-base-100" : "text-primary",
                            )}
                            aria-hidden="true"
                          />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {disclaimer && (
                    <p
                      className={cn(
                        "mt-4 text-xs leading-relaxed",
                        isInverse ? "text-base-100/50" : "text-base-content/50",
                      )}
                    >
                      {disclaimer}
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
