"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  FiClock,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
} from "react-icons/fi";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ContactSplitFormHoursRow {
  /** Day or day range (e.g. "Mon–Fri", "Sábado") */
  label: string;
  /** Hours range (e.g. "9:00 – 18:00") */
  value: string;
}

export interface ContactSplitFormProps {
  /** Optional eyebrow rendered above the headline */
  eyebrow?: string;
  /** Section heading */
  headline: string;
  /** Supporting paragraph */
  description?: string;

  /* ----- Form fields ----- */
  namePlaceholder?: string;
  emailPlaceholder?: string;
  /** Optional company input */
  companyPlaceholder?: string;
  /** Optional topic select label */
  topicLabel?: string;
  /** Topic options — when provided, renders a select instead of free-text */
  topicOptions?: string[];
  messagePlaceholder?: string;
  submitText: string;
  /** Submit button visual variant */
  ctaStyle?: CtaVariant;
  /** Submit button color scheme */
  ctaColorScheme?: ColorScheme;
  /** Optional consent line under the submit button (privacy) */
  consentText?: string;

  /* ----- Info column ----- */
  /** Optional sub-headline above the contact rows */
  infoTitle?: string;
  /** Phone link href (tel: format) */
  phoneUrl?: string;
  /** Phone display text */
  phoneText?: string;
  /** Email link (mailto: format) */
  emailUrl?: string;
  /** Email display text */
  emailText?: string;
  /** WhatsApp link (full wa.me URL) */
  whatsappUrl?: string;
  /** WhatsApp display text */
  whatsappText?: string;
  /** Address text (supports \n for line breaks) */
  addressText?: string;
  /** Optional Google Maps link for the address */
  addressMapsUrl?: string;
  /** Business hours rows */
  hours?: ContactSplitFormHoursRow[];
  /** Optional small note rendered under the hours */
  hoursNote?: string;

  /** Site-wide visual configuration */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function InfoRow({
  Icon,
  label,
  value,
  href,
}: {
  Icon: typeof FiPhone;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-base-100 text-base-content ring-1 ring-base-300"
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex flex-col">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-base-content/55">
          {label}
        </span>
        <span className="whitespace-pre-line text-sm text-base-content md:text-base">
          {value}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="group flex items-start gap-3 transition-opacity hover:opacity-80"
      >
        {content}
      </a>
    );
  }
  return <div className="flex items-start gap-3">{content}</div>;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * ContactSplitForm -- a two-column contact section with the form on
 * the left and a structured info column (phone, email, WhatsApp,
 * address, hours) on the right. Higher-density, more practical
 * counterpart to ContactShapesForm.
 */
export default function ContactSplitForm({
  eyebrow,
  headline,
  description,
  namePlaceholder = "Your full name",
  emailPlaceholder = "name@company.com",
  companyPlaceholder,
  topicLabel = "What's this about?",
  topicOptions,
  messagePlaceholder = "Tell us a little about what you're working on",
  submitText,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  consentText,
  infoTitle = "Reach us directly",
  phoneUrl,
  phoneText,
  emailUrl,
  emailText,
  whatsappUrl,
  whatsappText,
  addressText,
  addressMapsUrl,
  hours,
  hoursNote,
  className,
}: ContactSplitFormProps) {
  const shouldReduceMotion = useReducedMotion();

  const reveal = shouldReduceMotion
    ? { initial: false }
    : ({
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.3, ease: "easeOut" as const },
      } as const);

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,_3fr)_minmax(0,_2fr)] lg:gap-16">
        {/* ----- Left column — form ----- */}
        <motion.div className="flex flex-col gap-6" {...reveal}>
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

          <form
            className="mt-2 flex flex-col gap-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-split-name"
                  className="text-xs font-medium uppercase tracking-[0.16em] text-base-content/60"
                >
                  Name
                </label>
                <input
                  id="contact-split-name"
                  name="name"
                  type="text"
                  required
                  placeholder={namePlaceholder}
                  className="rounded-field border border-base-300 bg-base-100 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-split-email"
                  className="text-xs font-medium uppercase tracking-[0.16em] text-base-content/60"
                >
                  Email
                </label>
                <input
                  id="contact-split-email"
                  name="email"
                  type="email"
                  required
                  placeholder={emailPlaceholder}
                  className="rounded-field border border-base-300 bg-base-100 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {(companyPlaceholder ||
              (topicOptions && topicOptions.length > 0)) && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {companyPlaceholder && (
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-split-company"
                      className="text-xs font-medium uppercase tracking-[0.16em] text-base-content/60"
                    >
                      Company
                    </label>
                    <input
                      id="contact-split-company"
                      name="company"
                      type="text"
                      placeholder={companyPlaceholder}
                      className="rounded-field border border-base-300 bg-base-100 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                )}
                {topicOptions && topicOptions.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-split-topic"
                      className="text-xs font-medium uppercase tracking-[0.16em] text-base-content/60"
                    >
                      {topicLabel}
                    </label>
                    <select
                      id="contact-split-topic"
                      name="topic"
                      defaultValue=""
                      className="rounded-field border border-base-300 bg-base-100 px-4 py-3 text-base-content focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="" disabled>
                        Choose a topic
                      </option>
                      {topicOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-split-message"
                className="text-xs font-medium uppercase tracking-[0.16em] text-base-content/60"
              >
                Message
              </label>
              <textarea
                id="contact-split-message"
                name="message"
                required
                rows={5}
                placeholder={messagePlaceholder}
                className="resize-y rounded-field border border-base-300 bg-base-100 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex flex-col gap-2 pt-1 md:flex-row md:items-center md:justify-between">
              <div className="self-start">
                <CtaButton
                  variant={ctaStyle}
                  colorScheme={ctaColorScheme}
                  onClick={(event) => event.preventDefault()}
                >
                  {submitText}
                </CtaButton>
              </div>
              {consentText && (
                <p className="max-w-md text-xs text-base-content/55 md:text-right">
                  {consentText}
                </p>
              )}
            </div>
          </form>
        </motion.div>

        {/* ----- Right column — info ----- */}
        <motion.aside
          className="flex flex-col gap-8 rounded-2xl bg-base-200 p-6 md:p-8"
          {...reveal}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
        >
          {infoTitle && (
            <h3 className="text-lg font-semibold text-base-content md:text-xl">
              {infoTitle}
            </h3>
          )}

          <div className="flex flex-col gap-5">
            {phoneUrl && phoneText && (
              <InfoRow
                Icon={FiPhone}
                label="Phone"
                value={phoneText}
                href={phoneUrl}
              />
            )}
            {emailUrl && emailText && (
              <InfoRow
                Icon={FiMail}
                label="Email"
                value={emailText}
                href={emailUrl}
              />
            )}
            {whatsappUrl && whatsappText && (
              <InfoRow
                Icon={FiMessageCircle}
                label="WhatsApp"
                value={whatsappText}
                href={whatsappUrl}
              />
            )}
            {addressText && (
              <InfoRow
                Icon={FiMapPin}
                label="Visit"
                value={addressText}
                href={addressMapsUrl}
              />
            )}
          </div>

          {hours && hours.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-base-300 pt-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-base-content/55">
                <FiClock className="h-3.5 w-3.5" aria-hidden="true" />
                Hours
              </div>
              <ul className="flex flex-col gap-1.5 text-sm">
                {hours.map((row, idx) => (
                  <li
                    key={idx}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <span className="text-base-content/65">{row.label}</span>
                    <span className="font-mono tabular-nums text-base-content">
                      {row.value}
                    </span>
                  </li>
                ))}
              </ul>
              {hoursNote && (
                <p className="text-xs text-base-content/55">{hoursNote}</p>
              )}
            </div>
          )}
        </motion.aside>
      </div>
    </section>
  );
}
