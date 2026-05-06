"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Milestone {
  /** Year, quarter, or short label rendered as the rail anchor */
  marker: string;
  /** Headline for the milestone */
  title: string;
  /** Brief description (~ 1-2 sentences) */
  description?: string;
  /** Optional metric paired with the milestone (e.g. "47 employees") */
  metric?: string;
}

export interface StatsMilestoneBarProps {
  /** Small label rendered above the headline */
  label?: string;
  /** Section headline */
  headline?: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** Ordered milestones — typically 4 to 8 */
  milestones?: Milestone[];
  /** Optional footnote rendered beneath the rail */
  footnote?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_MILESTONES: Milestone[] = [
  {
    marker: "2019",
    title: "Founded in São Paulo",
    description:
      "Two co-founders, one shared office, and a single client willing to pilot the first prototype.",
    metric: "2 people",
  },
  {
    marker: "2021",
    title: "Series A and the first 100 customers",
    description:
      "Closed an $8.4M round led by a regional fund. Hired the founding engineering and design teams in the same quarter.",
    metric: "$8.4M raised",
  },
  {
    marker: "2023",
    title: "Expanded to Mexico and Colombia",
    description:
      "Opened a Mexico City office to serve Spanish-speaking customers, then added a Bogotá team within nine months.",
    metric: "47 employees",
  },
  {
    marker: "2025",
    title: "SOC 2 Type II and an enterprise tier",
    description:
      "Cleared a year-long audit and shipped the enterprise plan three months ahead of the original commitment.",
    metric: "184 customers",
  },
  {
    marker: "2026",
    title: "Public roadmap and a community of 3,847",
    description:
      "Moved the roadmap to a public Linear view and seeded a Discord community that now self-organises monthly meetups.",
    metric: "3,847 members",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface MilestoneCellProps {
  milestone: Milestone;
  index: number;
  total: number;
}

function MilestoneCell({ milestone, index, total }: MilestoneCellProps) {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  return (
    <motion.li variants={fadeUp} className="relative flex flex-col">
      {/* Rail dot — pinned to the row above the content on desktop */}
      <div className="relative h-8">
        <span
          className={cn(
            "absolute left-1/2 top-1/2 h-px bg-base-300",
            isFirst
              ? "right-0 w-1/2"
              : isLast
                ? "left-0 right-1/2 w-1/2"
                : "inset-x-0 w-full",
          )}
          aria-hidden="true"
        />
        <span
          className="absolute left-1/2 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-base-100"
          aria-hidden="true"
        />
      </div>
      <div className="mt-3 flex flex-col gap-1.5 px-3 text-center">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {milestone.marker}
        </span>
        <h3 className="text-sm font-semibold text-base-content md:text-base">
          {milestone.title}
        </h3>
        {milestone.metric && (
          <span className="font-mono text-xs text-base-content/60">
            {milestone.metric}
          </span>
        )}
        {milestone.description && (
          <p className="text-xs leading-relaxed text-base-content/60">
            {milestone.description}
          </p>
        )}
      </div>
    </motion.li>
  );
}

interface MobileMilestoneProps {
  milestone: Milestone;
  isLast: boolean;
}

function MobileMilestone({ milestone, isLast }: MobileMilestoneProps) {
  return (
    <li className="relative grid grid-cols-[auto_1fr] gap-x-5 pb-8 last:pb-0">
      <div className="relative flex flex-col items-center">
        <span
          className="z-10 mt-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-base-100"
          aria-hidden="true"
        />
        {!isLast && (
          <span
            className="absolute left-1/2 top-4 h-full w-px -translate-x-1/2 bg-base-300"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="flex flex-col gap-1.5 pb-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {milestone.marker}
        </span>
        <h3 className="text-base font-semibold text-base-content">
          {milestone.title}
        </h3>
        {milestone.metric && (
          <span className="font-mono text-xs text-base-content/60">
            {milestone.metric}
          </span>
        )}
        {milestone.description && (
          <p className="text-sm leading-relaxed text-base-content/65">
            {milestone.description}
          </p>
        )}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * StatsMilestoneBar — horizontal milestone rail (desktop) that
 * collapses to a vertical timeline on mobile. Use for company history,
 * funding journeys, product launches, or anything that benefits from
 * "look how far we've come" framing.
 */
export default function StatsMilestoneBar({
  label,
  headline,
  description,
  milestones = DEFAULT_MILESTONES,
  footnote,
  className,
}: StatsMilestoneBarProps) {
  const reduced = !!useReducedMotion();
  const total = milestones.length;

  return (
    <section className={cn("w-full bg-base-100 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {(label || headline || description) && (
          <motion.div
            className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center md:mb-16"
            variants={containerVariants}
            initial={reduced ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {label && (
              <motion.p
                variants={fadeUp}
                className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary"
              >
                {label}
              </motion.p>
            )}
            {headline && (
              <motion.h2
                variants={fadeUp}
                className="text-3xl font-semibold tracking-tight text-base-content sm:text-4xl"
              >
                {headline}
              </motion.h2>
            )}
            {description && (
              <motion.p
                variants={fadeUp}
                className="mt-4 text-base leading-relaxed text-base-content/60"
              >
                {description}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Mobile vertical timeline */}
        <ol className="md:hidden">
          {milestones.map((m, i) => (
            <MobileMilestone key={i} milestone={m} isLast={i === total - 1} />
          ))}
        </ol>

        {/* Desktop horizontal rail */}
        <motion.ol
          className={cn(
            "hidden md:grid",
            total === 4 && "md:grid-cols-4",
            total === 5 && "md:grid-cols-5",
            total === 6 && "md:grid-cols-6",
            total === 7 && "md:grid-cols-7",
            total === 8 && "md:grid-cols-8",
            total === 3 && "md:grid-cols-3",
            total === 2 && "md:grid-cols-2",
          )}
          variants={containerVariants}
          initial={reduced ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {milestones.map((m, i) => (
            <MilestoneCell key={i} milestone={m} index={i} total={total} />
          ))}
        </motion.ol>

        {footnote && (
          <p className="mt-10 text-center font-mono text-xs text-base-content/50">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
