"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import { buttonStyles } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SpotlightCredential {
  /** Number / metric value (e.g. "12", "47.2%", "3,847") */
  value: string;
  /** Short label below the value */
  label: string;
}

export interface TeamMemberSpotlightProps {
  /** Eyebrow above the headline (e.g. "Em destaque", "This month") */
  eyebrow?: string;
  /** Section headline above the spotlight */
  headline?: string;
  /** Member full name */
  memberName: string;
  /** Member role / title */
  memberRole: string;
  /**
   * Pull-quote — rendered hero-sized as the heart of the spotlight.
   * Keep it under 240 characters for ideal display.
   */
  quote: string;
  /** Optional shorter caption shown after the quote (date, project, context) */
  context?: string;
  /** Portrait image URL — falls back to seeded picsum */
  image?: string;
  /** Required alt text for the portrait */
  imageAlt?: string;
  /**
   * Optional credential row — small KPI-style facts about the member
   * (years in role, projects shipped, satisfaction score). 2 to 4 entries.
   */
  credentials?: SpotlightCredential[];
  /** Optional CTA — links to the full member bio or related case study */
  ctaText?: string;
  ctaUrl?: string;
  /**
   * Tone:
   * - "neutral" — bg-base-100 (default)
   * - "muted"   — bg-base-200 surface
   * - "inverse" — bg-base-content text-base-100, editorial impact
   */
  tone?: "neutral" | "muted" | "inverse";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TeamMemberSpotlight — one team member, one quote, one portrait.
 * The quote is the page; everything else (eyebrow, name, role,
 * credentials, CTA) supports it. Use to feature a single team member
 * — a new hire, a featured contributor, or a department lead — with
 * editorial weight.
 */
export default function TeamMemberSpotlight({
  eyebrow,
  headline,
  memberName,
  memberRole,
  quote,
  context,
  image,
  imageAlt,
  credentials,
  ctaText,
  ctaUrl,
  tone = "neutral",
  className,
}: TeamMemberSpotlightProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeImage = useSafeImageSrc(image, `spotlight-${memberName}`, 700, 875);

  const isInverse = tone === "inverse";

  const surfaceClass = cn(
    "w-full",
    tone === "neutral" && "bg-base-100",
    tone === "muted" && "bg-base-200",
    isInverse && "bg-base-content text-base-100",
  );

  const eyebrowColor = isInverse ? "text-base-100/60" : "text-primary";
  const headlineColor = isInverse ? "text-base-100" : "text-base-content";
  const quoteColor = isInverse ? "text-base-100" : "text-base-content";
  const nameColor = isInverse ? "text-base-100" : "text-base-content";
  const roleColor = isInverse ? "text-base-100/65" : "text-base-content/65";
  const contextColor = isInverse ? "text-base-100/55" : "text-base-content/55";
  const credValueColor = isInverse ? "text-base-100" : "text-base-content";
  const credLabelColor = isInverse
    ? "text-base-100/55"
    : "text-base-content/55";
  const dividerColor = isInverse ? "border-base-100/15" : "border-base-300";
  const ringColor = isInverse ? "ring-base-100/15" : "ring-base-300";
  const markColor = isInverse ? "text-base-100/15" : "text-base-content/10";

  return (
    <section className={cn(surfaceClass, "py-16 md:py-24 lg:py-32", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {(eyebrow || headline) && (
          <motion.header
            className="mb-12 flex max-w-2xl flex-col text-left md:mb-16"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {eyebrow && (
              <p
                className={cn(
                  "mb-3 text-xs font-semibold uppercase tracking-[0.25em]",
                  eyebrowColor,
                )}
              >
                {eyebrow}
              </p>
            )}
            {headline && (
              <h2
                className={cn(
                  "text-balance text-3xl font-semibold tracking-tight sm:text-4xl",
                  headlineColor,
                )}
              >
                {headline}
              </h2>
            )}
          </motion.header>
        )}

        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_3fr)] lg:gap-16">
          {/* Portrait */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative"
          >
            <div
              className={cn(
                "relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-base-200 ring-1",
                ringColor,
              )}
            >
              <img
                src={safeImage.src}
                onError={safeImage.onError}
                alt={imageAlt ?? `${memberName}, ${memberRole}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Quote + meta */}
          <motion.div
            className="relative flex flex-col justify-center gap-8"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
          >
            {/* Decorative open-quote glyph */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute -left-1 -top-10 select-none font-serif text-[6rem] leading-none md:-top-14 md:text-[9rem]",
                markColor,
              )}
            >
              &ldquo;
            </span>

            <blockquote
              className={cn(
                "relative z-10 text-2xl font-medium leading-tight tracking-tight md:text-3xl lg:text-[2.25rem] lg:leading-[1.2]",
                quoteColor,
              )}
            >
              {quote}
            </blockquote>

            {/* Author block */}
            <div
              className={cn("flex flex-col gap-1 border-t pt-6", dividerColor)}
            >
              <span className={cn("text-base font-semibold", nameColor)}>
                {memberName}
              </span>
              <span className={cn("text-sm", roleColor)}>{memberRole}</span>
              {context && (
                <span
                  className={cn(
                    "mt-2 font-mono text-[11px] uppercase tracking-[0.18em]",
                    contextColor,
                  )}
                >
                  {context}
                </span>
              )}
            </div>

            {/* Credentials row */}
            {credentials && credentials.length > 0 && (
              <dl
                className={cn(
                  "grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 sm:grid-cols-4",
                  dividerColor,
                )}
              >
                {credentials.map((c, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <dt
                      className={cn(
                        "order-2 text-xs uppercase tracking-[0.16em]",
                        credLabelColor,
                      )}
                    >
                      {c.label}
                    </dt>
                    <dd
                      className={cn(
                        "order-1 font-mono text-2xl font-semibold tracking-tight md:text-3xl",
                        credValueColor,
                      )}
                    >
                      {c.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {/* CTA */}
            {ctaText && ctaUrl && (
              <div className="flex">
                <a
                  href={ctaUrl}
                  className={buttonStyles({
                    variant: isInverse ? "outline" : "primary",
                    size: "md",
                    className: isInverse
                      ? "border-base-100/30 bg-transparent text-base-100 hover:bg-base-100 hover:text-base-content"
                      : undefined,
                  })}
                >
                  {ctaText}
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
