"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import { buttonStyles } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TeamMember {
  /** Full name */
  name: string;
  /** Role / title (e.g. "Head of Design", "Co-founder") */
  role: string;
  /** Optional one-line tagline shown below the role */
  tagline?: string;
  /** Portrait image URL — falls back to seeded picsum if omitted */
  image?: string;
  /** Required alt text for the portrait */
  imageAlt?: string;
  /** Optional LinkedIn / personal-site URL */
  href?: string;
  /** Optional location ("São Paulo", "Lisbon · Remote") */
  location?: string;
}

export interface TeamLeadershipGridProps {
  /** Eyebrow above the headline (e.g. "Liderança", "Who runs the place") */
  eyebrow?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** Members — between 4 and 12 reads best */
  members: TeamMember[];
  /** Number of desktop columns (3 or 4). Defaults to 4. */
  columns?: 3 | 4;
  /**
   * Card mood:
   * - "calm" — soft surface, no border (default)
   * - "framed" — bordered cards on bg-base-100
   */
  cardMood?: "calm" | "framed";
  /** Optional CTA at the bottom of the section */
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface MemberCardProps {
  member: TeamMember;
  index: number;
  cardMood: "calm" | "framed";
}

function MemberCard({ member, index, cardMood }: MemberCardProps) {
  const safe = useSafeImageSrc(
    member.image,
    `team-leadership-${index}-${member.name}`,
    600,
    750,
  );

  const Wrapper: any = member.href ? "a" : "div";
  const wrapperProps = member.href
    ? {
        href: member.href,
        "aria-label": `${member.name}, ${member.role}`,
      }
    : {};

  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "group relative flex flex-col gap-4",
        cardMood === "framed" &&
          "rounded-2xl border border-base-300 bg-base-100 p-4",
      )}
    >
      <Wrapper
        {...wrapperProps}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-base-200">
          <img
            src={safe.src}
            onError={safe.onError}
            alt={member.imageAlt ?? `${member.name}, ${member.role}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          {member.location && (
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-base-100/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-base-content/75 backdrop-blur-sm">
              {member.location}
            </span>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <h3 className="text-base font-semibold tracking-tight text-base-content md:text-lg">
            {member.name}
          </h3>
          <p className="text-sm text-primary">{member.role}</p>
          {member.tagline && (
            <p className="mt-1 text-sm leading-relaxed text-base-content/65">
              {member.tagline}
            </p>
          )}
        </div>
      </Wrapper>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TeamLeadershipGrid — portrait grid for leadership / founding-team
 * pages. Each member surfaces a 4:5 portrait, name, role, optional
 * tagline + location chip, and an optional outbound link. Cards collapse
 * to a single column under md and gently scale their portrait on hover.
 */
export default function TeamLeadershipGrid({
  eyebrow,
  headline,
  description,
  members,
  columns = 4,
  cardMood = "calm",
  ctaText,
  ctaUrl,
  className,
}: TeamLeadershipGridProps) {
  const shouldReduceMotion = useReducedMotion();

  const colClass =
    columns === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <section
      className={cn("w-full bg-base-100 py-16 md:py-20 lg:py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.header
          className="mb-12 flex max-w-3xl flex-col text-left md:mb-16"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {eyebrow && (
            <motion.p
              variants={fadeUp}
              className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary"
            >
              {eyebrow}
            </motion.p>
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
              className="mt-4 max-w-[60ch] text-base leading-relaxed text-base-content/65"
            >
              {description}
            </motion.p>
          )}
        </motion.header>

        <motion.div
          className={cn("grid grid-cols-1 gap-x-6 gap-y-12", colClass)}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {members.map((member, i) => (
            <MemberCard
              key={`${member.name}-${i}`}
              member={member}
              index={i}
              cardMood={cardMood}
            />
          ))}
        </motion.div>

        {ctaText && ctaUrl && (
          <motion.div
            className="mt-14 flex justify-start"
            variants={fadeUp}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <a
              href={ctaUrl}
              className={buttonStyles({ variant: "outline", size: "md" })}
            >
              {ctaText}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
