"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { Button, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TrustBullet {
  label: string;
}

export interface HeroSplitFormProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  /** Trust bullets rendered below the headline as small icons-with-text */
  trustBullets?: TrustBullet[];
  /** Heading printed above the form card */
  formTitle: string;
  /** Helper line under the form title */
  formSubtitle?: string;
  /** Submit button label */
  submitText: string;
  /** Color of the submit button */
  submitColorScheme?: ColorScheme;
  /** Email input placeholder */
  emailPlaceholder?: string;
  /** Name input placeholder — when omitted, the name field is hidden */
  namePlaceholder?: string;
  /** Optional phone input placeholder — when omitted, the field is hidden */
  phonePlaceholder?: string;
  /** Fine-print disclaimer below the submit button */
  disclaimer?: string;
  /** Confirmation copy shown after a successful submit */
  successHeadline?: string;
  successBody?: string;
  /** Background tint variant */
  tone?: "light" | "muted" | "accent";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroSplitForm({
  eyebrow,
  headline,
  subheadline,
  trustBullets,
  formTitle,
  formSubtitle,
  submitText,
  submitColorScheme = "primary",
  emailPlaceholder = "you@company.com",
  namePlaceholder,
  phonePlaceholder,
  disclaimer,
  successHeadline = "You're on the list.",
  successBody = "We'll send the next steps to your inbox within a business day.",
  tone = "muted",
  className,
}: HeroSplitFormProps) {
  const shouldReduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  const sectionTone =
    tone === "accent"
      ? "bg-accent/5"
      : tone === "light"
        ? "bg-base-100"
        : "bg-base-200/40";

  // Map ColorScheme to button.tsx Variant — reuses primitive Button
  const buttonVariant =
    submitColorScheme === "accent"
      ? "accent"
      : submitColorScheme === "secondary"
        ? "secondary"
        : submitColorScheme === "neutral"
          ? "outline"
          : "primary";

  return (
    <section
      className={cn("relative w-full overflow-hidden", sectionTone, className)}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:gap-12 md:px-8 md:py-16 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:py-24">
        {/* -- Headline column -- */}
        <motion.div
          className="flex flex-col justify-center lg:col-span-7"
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
              className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-primary"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-balance text-3xl font-bold leading-tight text-base-content sm:text-4xl md:text-5xl lg:text-6xl"
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
              className="mt-5 max-w-xl text-base leading-relaxed text-base-content/70 md:text-lg"
            >
              {subheadline}
            </motion.p>
          )}

          {trustBullets && trustBullets.length > 0 && (
            <motion.ul
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-3"
            >
              {trustBullets.map((bullet, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-base-content/70"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  <span>{bullet.label}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </motion.div>

        {/* -- Form column -- */}
        <motion.div
          className="lg:col-span-5"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
        >
          <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] md:p-8">
            {!submitted ? (
              <>
                <h2 className="text-xl font-semibold text-base-content md:text-2xl">
                  {formTitle}
                </h2>
                {formSubtitle && (
                  <p className="mt-2 text-sm text-base-content/60">
                    {formSubtitle}
                  </p>
                )}
                <form
                  onSubmit={handleSubmit}
                  className="mt-6 flex flex-col gap-3"
                >
                  {namePlaceholder && (
                    <label className="block">
                      <span className="sr-only">Name</span>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder={namePlaceholder}
                        className="w-full rounded-lg border border-base-300 bg-base-100 px-4 py-3 text-sm text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </label>
                  )}
                  <label className="block">
                    <span className="sr-only">Email</span>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder={emailPlaceholder}
                      className="w-full rounded-lg border border-base-300 bg-base-100 px-4 py-3 text-sm text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                  {phonePlaceholder && (
                    <label className="block">
                      <span className="sr-only">Phone</span>
                      <input
                        type="tel"
                        name="phone"
                        placeholder={phonePlaceholder}
                        className="w-full rounded-lg border border-base-300 bg-base-100 px-4 py-3 text-sm text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </label>
                  )}
                  <Button
                    type="submit"
                    variant={buttonVariant}
                    size="lg"
                    className="mt-2 w-full"
                  >
                    {submitText}
                  </Button>
                </form>
                {disclaimer && (
                  <p className="mt-4 text-xs leading-relaxed text-base-content/50">
                    {disclaimer}
                  </p>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col items-start gap-2 py-4"
                role="status"
                aria-live="polite"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-base-content">
                  {successHeadline}
                </h2>
                <p className="text-sm text-base-content/70">{successBody}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
