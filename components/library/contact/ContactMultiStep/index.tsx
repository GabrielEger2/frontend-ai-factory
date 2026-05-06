"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiHelpCircle,
  FiHeart,
  FiLink2,
  FiMail,
  FiPhone,
  FiUser,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ContactMultiStepRouteIcon =
  | "briefcase"
  | "help"
  | "users"
  | "heart"
  | "handshake"
  | "zap"
  | "user"
  | "mail"
  | "phone";

export interface ContactMultiStepRoute {
  /** Stable id used as the routed value when submitting */
  id: string;
  /** Card label (e.g. "Sales", "Support", "Partnerships") */
  label: string;
  /** Short supporting line under the label */
  description: string;
  /** Optional pre-set icon — defaults to "help" */
  icon?: ContactMultiStepRouteIcon;
  /** Optional eyebrow caption shown above the next-step heading */
  nextStepEyebrow?: string;
  /** Override the default next-step prompt for this route */
  nextStepHeadline?: string;
}

export interface ContactMultiStepProps {
  /** Optional eyebrow above the headline */
  eyebrow?: string;
  /** Section heading */
  headline: string;
  /** Supporting paragraph */
  description?: string;

  /** Routing options — each renders as a selectable card on step 1 */
  routes: ContactMultiStepRoute[];

  /** Fallback prompt headline used on step 2 when a route doesn't override */
  defaultStepTwoHeadline?: string;

  /** Form placeholders + labels */
  namePlaceholder?: string;
  emailPlaceholder?: string;
  companyPlaceholder?: string;
  phonePlaceholder?: string;
  messagePlaceholder?: string;

  /** Whether to render the optional company input on step 2 */
  collectCompany?: boolean;
  /** Whether to render the optional phone input on step 2 */
  collectPhone?: boolean;

  /** Submit button copy on step 3 */
  submitText: string;
  /** Submit button variant */
  ctaStyle?: CtaVariant;
  /** Submit button color scheme */
  ctaColorScheme?: ColorScheme;

  /** Optional consent line under the submit button (privacy) */
  consentText?: string;

  /** Headline shown after submit */
  successHeadline?: string;
  /** Body text shown after submit */
  successDescription?: string;

  /** Step labels — defaults to ["Route", "Details", "Message"] */
  stepLabels?: [string, string, string];

  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const ROUTE_ICON_MAP: Record<ContactMultiStepRouteIcon, typeof FiBriefcase> = {
  briefcase: FiBriefcase,
  help: FiHelpCircle,
  users: FiUsers,
  heart: FiHeart,
  handshake: FiLink2,
  zap: FiZap,
  user: FiUser,
  mail: FiMail,
  phone: FiPhone,
};

const DEFAULT_STEP_LABELS: [string, string, string] = [
  "Route",
  "Details",
  "Message",
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StepProgress({
  step,
  totalSteps,
  labels,
  shouldReduceMotion,
}: {
  step: number;
  totalSteps: number;
  labels: [string, string, string];
  shouldReduceMotion: boolean;
}) {
  const percent = Math.min(
    100,
    Math.max(0, ((step - 1) / (totalSteps - 1)) * 100),
  );
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-base-content/55">
        {labels.map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === step;
          const isComplete = stepNum < step;
          return (
            <span
              key={label}
              className={cn(
                "transition-colors",
                isActive && "text-base-content",
                isComplete && "text-primary",
              )}
            >
              {String(stepNum).padStart(2, "0")} · {label}
            </span>
          );
        })}
      </div>
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-base-300">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-primary"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 110, damping: 22 }
          }
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * ContactMultiStep -- a wizard-style routing contact form. Step 1 routes
 * the visitor to the correct department (sales / support / partnership);
 * Step 2 collects identity (name, email, optional company / phone);
 * Step 3 captures the actual message and submits. A spring-driven progress
 * bar marks position; AnimatePresence cross-fades between steps; submit
 * resolves to a success panel rather than a page reload.
 *
 * Submission is intentionally inert (preventDefault) — the form posts a
 * shaped object to the consumer-supplied integration. Wire it up in the
 * deploy pipeline rather than inside the component.
 */
export default function ContactMultiStep({
  eyebrow,
  headline,
  description,
  routes,
  defaultStepTwoHeadline = "Tell us who's reaching out",
  namePlaceholder = "Your full name",
  emailPlaceholder = "name@company.com",
  companyPlaceholder = "Company (optional)",
  phonePlaceholder = "+1 555 000 0000",
  messagePlaceholder = "Share the context — we'll route this to the right person.",
  collectCompany = true,
  collectPhone = false,
  submitText,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  consentText,
  successHeadline = "Message sent — thank you",
  successDescription = "We've routed your note to the right team. Expect a reply at the email you provided within one business day.",
  stepLabels = DEFAULT_STEP_LABELS,
  className,
}: ContactMultiStepProps) {
  const shouldReduceMotion = useReducedMotion();
  const formId = useId();

  type Step = 1 | 2 | 3 | "done";
  const [step, setStep] = useState<Step>(1);
  const [routeId, setRouteId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const selectedRoute = useMemo(
    () => routes.find((r) => r.id === routeId) ?? null,
    [routes, routeId],
  );

  const stepTwoHeadline =
    selectedRoute?.nextStepHeadline ?? defaultStepTwoHeadline;

  const canAdvanceFromOne = routeId !== null;
  const canAdvanceFromTwo = name.trim().length > 0 && email.trim().length > 0;
  const canSubmit = message.trim().length > 0;

  const handleSelectRoute = (id: string) => {
    setRouteId(id);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setStep("done");
  };

  const stepNum =
    step === "done" ? 3 : (step as number); /* progress shows full bar */

  const motionTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: "easeOut" as const };

  const stepVariants = {
    enter: shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 },
    center: { opacity: 1, x: 0 },
    exit: shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 },
  };

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_3fr)] lg:gap-16">
        {/* ----- Left — context ----- */}
        <motion.div
          className="flex flex-col gap-6"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-3">
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                {eyebrow}
              </span>
            )}
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-base-content md:text-4xl lg:text-5xl">
              {headline}
            </h2>
            {description && (
              <p className="max-w-xl text-base leading-relaxed text-base-content/65 md:text-lg">
                {description}
              </p>
            )}
          </div>

          <ul className="mt-2 flex flex-col gap-3 border-t border-base-300 pt-6 text-sm text-base-content/65">
            {stepLabels.map((label, idx) => {
              const stepIdx = idx + 1;
              const isActive = stepIdx === stepNum && step !== "done";
              const isComplete = stepIdx < stepNum || step === "done";
              return (
                <li
                  key={label}
                  className={cn(
                    "flex items-center gap-3 transition-colors",
                    isActive && "text-base-content",
                    isComplete && "text-primary",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                      isComplete
                        ? "border-primary bg-primary text-primary-content"
                        : isActive
                          ? "border-base-content text-base-content"
                          : "border-base-300 text-base-content/55",
                    )}
                  >
                    {isComplete ? <FiCheck className="h-3.5 w-3.5" /> : stepIdx}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium md:text-base",
                      isActive && "text-base-content",
                    )}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* ----- Right — wizard ----- */}
        <motion.div
          className="flex flex-col gap-6 rounded-2xl border border-base-300 bg-base-200 p-6 md:p-8"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
        >
          {step !== "done" ? (
            <>
              <StepProgress
                step={stepNum}
                totalSteps={3}
                labels={stepLabels}
                shouldReduceMotion={shouldReduceMotion ?? false}
              />

              <AnimatePresence mode="wait" initial={false}>
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={stepVariants}
                    transition={motionTransition}
                    className="flex flex-col gap-5"
                  >
                    <h3 className="text-lg font-semibold text-base-content md:text-xl">
                      Where should this go?
                    </h3>
                    <div
                      role="radiogroup"
                      aria-label="Select a routing destination"
                      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                      {routes.map((route) => {
                        const Icon = ROUTE_ICON_MAP[route.icon ?? "help"];
                        const isSelected = routeId === route.id;
                        return (
                          <button
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            key={route.id}
                            onClick={() => handleSelectRoute(route.id)}
                            className={cn(
                              "group relative flex flex-col gap-2 rounded-xl border bg-base-100 p-4 text-left transition-colors",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-200",
                              isSelected
                                ? "border-primary ring-2 ring-primary/30"
                                : "border-base-300 hover:border-base-content/40",
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={cn(
                                "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                                isSelected
                                  ? "bg-primary text-primary-content"
                                  : "bg-primary/10 text-primary",
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="text-sm font-semibold text-base-content md:text-base">
                              {route.label}
                            </span>
                            <span className="text-xs text-base-content/65 md:text-sm">
                              {route.description}
                            </span>
                            {isSelected && (
                              <motion.span
                                layoutId="route-checkmark"
                                className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-content"
                                transition={motionTransition}
                                aria-hidden="true"
                              >
                                <FiCheck className="h-3.5 w-3.5" />
                              </motion.span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2 flex items-center justify-end gap-3 border-t border-base-300 pt-5">
                      <button
                        type="button"
                        disabled={!canAdvanceFromOne}
                        onClick={() => setStep(2)}
                        className={cn(
                          "inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-all",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-200",
                          canAdvanceFromOne
                            ? "bg-primary text-primary-content hover:opacity-90"
                            : "cursor-not-allowed bg-base-300 text-base-content/45",
                        )}
                      >
                        Continue <FiArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.form
                    key="step-2"
                    id={`${formId}-step-2`}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={stepVariants}
                    transition={motionTransition}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (canAdvanceFromTwo) setStep(3);
                    }}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-2">
                      {selectedRoute?.nextStepEyebrow && (
                        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                          {selectedRoute.nextStepEyebrow}
                        </span>
                      )}
                      <h3 className="text-lg font-semibold text-base-content md:text-xl">
                        {stepTwoHeadline}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor={`${formId}-name`}
                          className="text-xs font-medium uppercase tracking-[0.16em] text-base-content/60"
                        >
                          Name
                        </label>
                        <input
                          id={`${formId}-name`}
                          name="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={namePlaceholder}
                          className="rounded-field border border-base-300 bg-base-100 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor={`${formId}-email`}
                          className="text-xs font-medium uppercase tracking-[0.16em] text-base-content/60"
                        >
                          Email
                        </label>
                        <input
                          id={`${formId}-email`}
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={emailPlaceholder}
                          className="rounded-field border border-base-300 bg-base-100 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>

                    {(collectCompany || collectPhone) && (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {collectCompany && (
                          <div className="flex flex-col gap-1.5">
                            <label
                              htmlFor={`${formId}-company`}
                              className="text-xs font-medium uppercase tracking-[0.16em] text-base-content/60"
                            >
                              Company
                            </label>
                            <input
                              id={`${formId}-company`}
                              name="company"
                              type="text"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              placeholder={companyPlaceholder}
                              className="rounded-field border border-base-300 bg-base-100 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                        )}
                        {collectPhone && (
                          <div className="flex flex-col gap-1.5">
                            <label
                              htmlFor={`${formId}-phone`}
                              className="text-xs font-medium uppercase tracking-[0.16em] text-base-content/60"
                            >
                              Phone
                            </label>
                            <input
                              id={`${formId}-phone`}
                              name="phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder={phonePlaceholder}
                              className="rounded-field border border-base-300 bg-base-100 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-2 flex items-center justify-between gap-3 border-t border-base-300 pt-5">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-base-content/70 transition-colors hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-200"
                      >
                        <FiArrowLeft className="h-4 w-4" /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={!canAdvanceFromTwo}
                        className={cn(
                          "inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-all",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-200",
                          canAdvanceFromTwo
                            ? "bg-primary text-primary-content hover:opacity-90"
                            : "cursor-not-allowed bg-base-300 text-base-content/45",
                        )}
                      >
                        Continue <FiArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.form>
                )}

                {step === 3 && (
                  <motion.form
                    key="step-3"
                    id={`${formId}-step-3`}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={stepVariants}
                    transition={motionTransition}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-base-content md:text-xl">
                        What's the message?
                      </h3>
                      {selectedRoute && (
                        <p className="text-sm text-base-content/60">
                          Going to{" "}
                          <span className="font-medium text-base-content">
                            {selectedRoute.label}
                          </span>{" "}
                          · From{" "}
                          <span className="font-medium text-base-content">
                            {name}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor={`${formId}-message`}
                        className="text-xs font-medium uppercase tracking-[0.16em] text-base-content/60"
                      >
                        Message
                      </label>
                      <textarea
                        id={`${formId}-message`}
                        name="message"
                        required
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={messagePlaceholder}
                        className="resize-y rounded-field border border-base-300 bg-base-100 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>

                    <div className="mt-1 flex flex-col gap-3 border-t border-base-300 pt-5 md:flex-row md:items-center md:justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-base-content/70 transition-colors hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-200"
                      >
                        <FiArrowLeft className="h-4 w-4" /> Back
                      </button>
                      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-4">
                        {consentText && (
                          <p className="max-w-sm text-xs text-base-content/55 md:text-right">
                            {consentText}
                          </p>
                        )}
                        <CtaButton
                          variant={ctaStyle}
                          colorScheme={ctaColorScheme}
                          onClick={(e) => {
                            // Submit the host form rather than navigating
                            e.preventDefault();
                            const form = (
                              e.currentTarget as HTMLElement
                            ).closest("form");
                            form?.requestSubmit();
                          }}
                        >
                          {submitText}
                        </CtaButton>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              key="done"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col items-start gap-4"
              role="status"
              aria-live="polite"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-content"
              >
                <FiCheck className="h-6 w-6" />
              </span>
              <h3 className="text-2xl font-semibold leading-tight text-base-content md:text-3xl">
                {successHeadline}
              </h3>
              <p className="max-w-md text-base text-base-content/65 md:text-lg">
                {successDescription}
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setRouteId(null);
                  setName("");
                  setEmail("");
                  setCompany("");
                  setPhone("");
                  setMessage("");
                }}
                className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-200"
              >
                Send another message
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
