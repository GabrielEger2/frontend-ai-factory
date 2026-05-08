"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface JourneyMilestone {
  /** Year or short period label (e.g. "2014", "Inverno 2019"). */
  year: string;
  /** Milestone heading — what changed at this chapter. */
  title: string;
  /** Body paragraph describing the milestone. */
  description: string;
  /**
   * Optional portrait of the person who joined or led this chapter.
   * Falls back to a seeded picsum if absent.
   */
  image?: string;
  /** Required alt text when `image` is provided. */
  imageAlt?: string;
  /** Optional name of the person tied to this chapter. */
  personName?: string;
  /** Optional role / title. */
  personRole?: string;
}

export interface TeamJourneyTimelineProps {
  /** Eyebrow above the headline (e.g. "Our story", "Since 2014"). */
  eyebrow?: string;
  /** Section headline. */
  headline: string;
  /** Optional supporting paragraph below the headline. */
  description?: string;
  /**
   * Milestones in chronological order — 4 to 7 reads best.
   * Anything past 8 is silently trimmed; the rail loses rhythm.
   */
  milestones: JourneyMilestone[];
  /** Final-node label (defaults to "Today"). */
  todayLabel?: string;
  /** Final-node title — short closing line for "where we are now". */
  todayTitle?: string;
  /** Final-node body — the present tense for the journey. */
  todayDescription?: string;
  /**
   * Optional final-node group photo or current-team grid image.
   * Falls back to seeded picsum when omitted.
   */
  todayImage?: string;
  /** Required alt text when `todayImage` is provided. */
  todayImageAlt?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface MilestoneRowProps {
  milestone: JourneyMilestone;
  index: number;
  total: number;
}

function MilestoneRow({ milestone, index, total }: MilestoneRowProps) {
  const sideRight = index % 2 === 1; // alternate sides on lg+
  const safeImage = useSafeImageSrc(
    milestone.image,
    `journey-${index}-${milestone.year}`,
    600,
    750,
  );
  const hasImage = Boolean(milestone.image || milestone.personName);

  return (
    <motion.li
      variants={fadeUp}
      className={cn(
        "relative grid grid-cols-[2.5rem_minmax(0,_1fr)] gap-x-5 pb-12 md:gap-x-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-12 lg:pb-16",
      )}
    >
      {/* Year column (mobile) — chip on the left rail */}
      <div className="flex flex-col items-center lg:hidden">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          {milestone.year}
        </span>
        <span className="mt-2 h-3 w-3 rounded-full bg-primary ring-4 ring-base-100" />
      </div>

      {/* Year column (desktop, alternating) */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col",
          sideRight ? "lg:items-end lg:text-right" : "lg:items-start",
        )}
      >
        {!sideRight && (
          <span className="font-mono text-2xl font-semibold tracking-tight text-base-content md:text-3xl">
            {milestone.year}
          </span>
        )}
        {!sideRight && hasImage && (
          <MilestonePortrait
            milestone={milestone}
            safeImage={safeImage}
            align="start"
          />
        )}
      </div>

      {/* Center rail — desktop only */}
      <div className="relative hidden lg:flex lg:w-3 lg:flex-col lg:items-center">
        <span className="absolute top-1.5 inline-flex h-3 w-3 rounded-full bg-primary ring-4 ring-base-100" />
        {index < total - 1 && (
          <span
            aria-hidden="true"
            className="absolute top-6 h-[calc(100%+1rem)] w-px bg-base-300"
          />
        )}
      </div>

      {/* Content column — single rail on mobile, alternating on desktop */}
      <div
        className={cn(
          "relative flex flex-col gap-3",
          "lg:col-start-3",
          sideRight ? "lg:items-start" : "lg:items-end lg:text-right",
        )}
      >
        {sideRight && (
          <span className="hidden font-mono text-2xl font-semibold tracking-tight text-base-content lg:block md:text-3xl">
            {milestone.year}
          </span>
        )}
        <h3 className="text-balance text-xl font-semibold leading-tight tracking-tight text-base-content sm:text-2xl">
          {milestone.title}
        </h3>
        <p className="max-w-[58ch] text-base leading-relaxed text-base-content/70">
          {milestone.description}
        </p>
        {sideRight && hasImage && (
          <MilestonePortrait
            milestone={milestone}
            safeImage={safeImage}
            align="start"
            className="lg:items-start"
          />
        )}
        {/* Mobile portrait — always rendered after copy */}
        {hasImage && (
          <div className="lg:hidden">
            <MilestonePortrait
              milestone={milestone}
              safeImage={safeImage}
              align="start"
            />
          </div>
        )}
      </div>

      {/* Mobile rail line connecting dots */}
      {index < total - 1 && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-[calc(1.25rem-0.5px)] top-7 h-[calc(100%-1.5rem)] w-px bg-base-300 lg:hidden",
          )}
        />
      )}
    </motion.li>
  );
}

interface MilestonePortraitProps {
  milestone: JourneyMilestone;
  safeImage: ReturnType<typeof useSafeImageSrc>;
  align: "start" | "end";
  className?: string;
}

function MilestonePortrait({
  milestone,
  safeImage,
  className,
}: MilestonePortraitProps) {
  return (
    <figure className={cn("mt-3 flex flex-col gap-2", className)}>
      <div className="relative aspect-[4/5] w-32 overflow-hidden rounded-xl bg-base-200 ring-1 ring-base-300 md:w-40">
        <img
          src={safeImage.src}
          onError={safeImage.onError}
          alt={
            milestone.imageAlt ??
            (milestone.personName
              ? `Portrait of ${milestone.personName}`
              : `Milestone portrait — ${milestone.year}`)
          }
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      {(milestone.personName || milestone.personRole) && (
        <figcaption className="flex flex-col gap-0.5 font-mono text-[11px] uppercase tracking-[0.16em]">
          {milestone.personName && (
            <span className="text-base-content">{milestone.personName}</span>
          )}
          {milestone.personRole && (
            <span className="text-base-content/55">{milestone.personRole}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Today node                                                         */
/* ------------------------------------------------------------------ */

interface TodayNodeProps {
  todayLabel: string;
  todayTitle?: string;
  todayDescription?: string;
  todayImage?: string;
  todayImageAlt?: string;
}

function TodayNode({
  todayLabel,
  todayTitle,
  todayDescription,
  todayImage,
  todayImageAlt,
}: TodayNodeProps) {
  const safe = useSafeImageSrc(todayImage, "journey-today", 1200, 720);

  return (
    <motion.li
      variants={fadeUp}
      className="relative grid grid-cols-[2.5rem_minmax(0,_1fr)] gap-x-5 md:gap-x-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-12"
    >
      {/* Mobile rail dot */}
      <div className="flex flex-col items-center lg:hidden">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          {todayLabel}
        </span>
        <span className="mt-2 h-3 w-3 rounded-full bg-base-content ring-4 ring-base-100" />
      </div>

      {/* Desktop spacer left */}
      <div className="hidden lg:block" />

      {/* Desktop center dot */}
      <div className="relative hidden lg:flex lg:w-3 lg:flex-col lg:items-center">
        <span className="absolute top-1.5 inline-flex h-3 w-3 rounded-full bg-base-content ring-4 ring-base-100" />
      </div>

      {/* Content + group image */}
      <div className="lg:col-start-1 lg:col-end-4 lg:row-start-1">
        <div className="rounded-2xl border border-base-300 bg-base-200 p-6 md:p-8 lg:p-10">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,_1.2fr)_minmax(0,_1fr)] lg:gap-10">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
                {todayLabel}
              </span>
              {todayTitle && (
                <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-base-content sm:text-3xl">
                  {todayTitle}
                </h3>
              )}
              {todayDescription && (
                <p className="max-w-[60ch] text-base leading-relaxed text-base-content/70">
                  {todayDescription}
                </p>
              )}
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-base-100 ring-1 ring-base-300">
              <img
                src={safe.src}
                onError={safe.onError}
                alt={todayImageAlt ?? "Current team photo"}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TeamJourneyTimeline — story-driven timeline for "our story" sections.
 * Founding chapter through today, with optional per-chapter portraits
 * of the people who joined or led at each beat. The closing "Today"
 * node sits in a soft surface card with an optional group photo,
 * giving the narrative a clear present-tense landing point.
 *
 * Layout (lg+): alternating left/right rail with year on one side and
 * copy on the other, vertical 1px divider down the middle.
 * Layout (< lg): single left rail with year chips above each dot.
 */
export default function TeamJourneyTimeline({
  eyebrow,
  headline,
  description,
  milestones,
  todayLabel = "Today",
  todayTitle,
  todayDescription,
  todayImage,
  todayImageAlt,
  className,
}: TeamJourneyTimelineProps) {
  const shouldReduceMotion = useReducedMotion();

  // Cap at 8 — the rail rhythm collapses past that.
  const visible = milestones.slice(0, 8);
  const showToday = Boolean(todayTitle || todayDescription || todayImage);

  return (
    <section
      className={cn("w-full bg-base-100 py-16 md:py-20 lg:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.header
          className="mb-12 flex max-w-3xl flex-col gap-3 md:mb-16"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
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
            className="text-balance text-3xl font-semibold leading-tight tracking-tight text-base-content sm:text-4xl md:text-5xl"
          >
            {headline}
          </motion.h2>
          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-2 max-w-[60ch] text-base leading-relaxed text-base-content/70"
            >
              {description}
            </motion.p>
          )}
        </motion.header>

        <motion.ol
          className="relative list-none"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {visible.map((m, i) => (
            <MilestoneRow
              key={`${m.year}-${i}`}
              milestone={m}
              index={i}
              total={visible.length + (showToday ? 1 : 0)}
            />
          ))}
          {showToday && (
            <TodayNode
              todayLabel={todayLabel}
              todayTitle={todayTitle}
              todayDescription={todayDescription}
              todayImage={todayImage}
              todayImageAlt={todayImageAlt}
            />
          )}
        </motion.ol>
      </div>
    </section>
  );
}
