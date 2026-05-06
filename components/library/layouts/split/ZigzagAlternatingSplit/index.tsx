"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp, imageReveal } from "@lib/motion-variants";
import type { StyleKit } from "@lib/style-kit";
import { CtaButton } from "@ui/button";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ZigzagSection {
  /** Small label rendered above the heading (e.g. "Step 01" or "Sourcing"). */
  eyebrow?: string;
  /** Section heading. */
  heading: string;
  /** Body copy describing this section. */
  description: string;
  /** Optional bullet list of supporting points. */
  bullets?: string[];
  /** Optional CTA text per row. */
  ctaText?: string;
  /** Optional CTA url per row. */
  ctaUrl?: string;
  /** Section image. */
  image: string;
  /** Accessible alt text for the image. */
  imageAlt: string;
}

export interface ZigzagAlternatingSplitProps {
  /** Optional small kicker label rendered at the top of the section. */
  eyebrow?: string;
  /** Optional section-level headline above the rows. */
  headline?: string;
  /** Optional supporting paragraph below the headline. */
  intro?: string;
  /** Ordered rows; rows alternate image left / image right starting from `firstSide`. */
  sections: ZigzagSection[];
  /** Whether the first row places the image on the left (default) or right. */
  firstSide?: "left" | "right";
  /** Background color scheme. */
  colorScheme?: "light" | "dark";
  /** Site-wide style configuration — provides ctaVariant and ctaColorScheme. */
  styleKit?: StyleKit;
  /** Informational purpose tag for the section. */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_SECTIONS: ZigzagSection[] = [
  {
    eyebrow: "01 — Discovery",
    heading: "We start where the brief is still uncertain",
    description:
      "Two weeks of paired interviews with the people who actually build, sell, and support the product. We leave with a written hypothesis the whole team can argue against.",
    bullets: [
      "8 to 12 stakeholder conversations",
      "Audit of analytics, support tickets, and CRM notes",
      "Written hypothesis — not a deck",
    ],
    image: "https://picsum.photos/seed/zigzag-discovery/720/540",
    imageAlt:
      "Team mapping a customer journey on a glass wall covered in sticky notes",
  },
  {
    eyebrow: "02 — Direction",
    heading: "Three concepts, defended on their merits",
    description:
      "We ship three distinct directions, each with a written rationale and a worked example on the highest-traffic page. You pick one. We don't average them.",
    bullets: [
      "Three concepts, each end-to-end on one flow",
      "Written rationale for the trade-offs in each",
      "One feedback round before commit",
    ],
    image: "https://picsum.photos/seed/zigzag-direction/720/540",
    imageAlt:
      "Designer sketching three competing layout options on tracing paper",
  },
  {
    eyebrow: "03 — Delivery",
    heading: "We sit beside the engineers who ship it",
    description:
      "Our designers pair with your engineers in the same Linear, the same Slack, the same standups. Handoff isn't an event — it's the absence of one.",
    image: "https://picsum.photos/seed/zigzag-delivery/720/540",
    imageAlt:
      "Designer and engineer reviewing a PR together at a single monitor",
  },
];

/* ------------------------------------------------------------------ */
/*  Row image (private — calls hook per row)                           */
/* ------------------------------------------------------------------ */

interface RowImageProps {
  image: string;
  imageAlt: string;
  index: number;
}

function RowImage({ image, imageAlt, index }: RowImageProps) {
  const safeImg = useSafeImageSrc(
    image,
    `layout-zigzagalternatingsplit-01-row-${index}`,
    720,
    540,
  );
  return (
    <img
      src={safeImg.src}
      onError={safeImg.onError}
      alt={imageAlt}
      loading="lazy"
      className="h-full w-full object-cover"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * ZigzagAlternatingSplit — multiple rows of image + text where the image
 * alternates sides every row. Ideal for process steps, feature tours,
 * brand narrative chapters, or any sequence that benefits from rhythm.
 */
export default function ZigzagAlternatingSplit({
  eyebrow,
  headline,
  intro,
  sections = DEFAULT_SECTIONS,
  firstSide = "left",
  colorScheme = "light",
  styleKit,
  purpose,
  className,
}: ZigzagAlternatingSplitProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDark = colorScheme === "dark";

  return (
    <section
      data-purpose={purpose}
      className={cn(
        "relative w-full overflow-hidden",
        isDark
          ? "bg-neutral text-neutral-content"
          : "bg-base-100 text-base-content",
        "py-16 md:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Optional section header */}
        {(eyebrow || headline || intro) && (
          <motion.div
            className="mb-12 max-w-2xl md:mb-20"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {eyebrow && (
              <motion.p
                variants={fadeUp}
                className={cn(
                  "mb-4 text-xs font-semibold uppercase tracking-[0.3em]",
                  isDark ? "text-primary" : "text-primary",
                )}
              >
                {eyebrow}
              </motion.p>
            )}
            {headline && (
              <motion.h2
                variants={fadeUp}
                className={cn(
                  "text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl",
                  isDark ? "text-neutral-content" : "text-base-content",
                )}
              >
                {headline}
              </motion.h2>
            )}
            {intro && (
              <motion.p
                variants={fadeUp}
                className={cn(
                  "mt-5 max-w-xl text-base leading-relaxed md:text-lg",
                  isDark ? "text-neutral-content/70" : "text-base-content/70",
                )}
              >
                {intro}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Zigzag rows */}
        <div className="space-y-20 md:space-y-28">
          {sections.map((section, i) => {
            const startsLeft = firstSide === "left";
            const imageOnLeft = startsLeft ? i % 2 === 0 : i % 2 === 1;

            return (
              <motion.div
                key={i}
                className={cn(
                  "grid grid-cols-1 items-center gap-10 md:gap-14 lg:grid-cols-2",
                )}
                variants={containerVariants}
                initial={shouldReduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Image */}
                <motion.div
                  variants={imageReveal}
                  className={cn(
                    "relative aspect-[4/3] w-full overflow-hidden rounded-2xl",
                    isDark ? "bg-base-300/20" : "bg-base-200",
                    imageOnLeft ? "lg:order-1" : "lg:order-2",
                  )}
                >
                  <RowImage
                    image={section.image}
                    imageAlt={section.imageAlt}
                    index={i}
                  />
                </motion.div>

                {/* Text */}
                <motion.div
                  variants={fadeUp}
                  className={cn(
                    "flex flex-col gap-5",
                    imageOnLeft ? "lg:order-2 lg:pl-4" : "lg:order-1 lg:pr-4",
                  )}
                >
                  {section.eyebrow && (
                    <p
                      className={cn(
                        "text-xs font-semibold uppercase tracking-[0.3em]",
                        isDark ? "text-primary" : "text-primary",
                      )}
                    >
                      {section.eyebrow}
                    </p>
                  )}
                  <h3
                    className={cn(
                      "text-2xl font-semibold leading-tight md:text-3xl lg:text-4xl",
                      isDark ? "text-neutral-content" : "text-base-content",
                    )}
                  >
                    {section.heading}
                  </h3>
                  <p
                    className={cn(
                      "max-w-xl text-base leading-relaxed md:text-lg",
                      isDark
                        ? "text-neutral-content/70"
                        : "text-base-content/70",
                    )}
                  >
                    {section.description}
                  </p>

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-1 space-y-2">
                      {section.bullets.map((bullet, j) => (
                        <li
                          key={j}
                          className={cn(
                            "flex items-start gap-3 text-base",
                            isDark
                              ? "text-neutral-content/80"
                              : "text-base-content/80",
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.ctaText && section.ctaUrl && (
                    <div className="pt-2">
                      <CtaButton
                        variant={styleKit?.ctaVariant ?? "default"}
                        colorScheme={styleKit?.ctaColorScheme ?? "primary"}
                        href={section.ctaUrl}
                      >
                        {section.ctaText}
                      </CtaButton>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
