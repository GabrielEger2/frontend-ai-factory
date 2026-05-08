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
  isLast: boolean;
}

/**
 * One chapter in the timeline. Layout is intentionally NOT alternating —
 * a single fixed rail keeps the eye moving cleanly top-to-bottom.
 *
 * Desktop grid (lg+):  [year (mono numeral)] [rail (1px + dot)] [content + portrait]
 * Mobile grid:         [rail (1px + dot)] [content stack with year chip on top]
 */
function MilestoneRow({ milestone, index, isLast }: MilestoneRowProps) {
  const safeImage = useSafeImageSrc(
    milestone.image,
    `journey-${index}-${milestone.year}`,
    640,
    800,
  );
  const hasPortrait = Boolean(
    milestone.image || milestone.personName || milestone.personRole,
  );

  return (
    <motion.li
      variants={fadeUp}
      className={cn(
        "group relative grid",
        // Mobile: rail (28px) + content
        "grid-cols-[1.75rem_minmax(0,_1fr)] gap-x-4",
        // Desktop: year (large mono) + rail (24px) + content
        "lg:grid-cols-[7rem_1.5rem_minmax(0,_1fr)] lg:gap-x-8",
        isLast ? "pb-0" : "pb-12 lg:pb-20",
      )}
    >
      {/* ---------- Desktop year column (lg+) ---------- */}
      <div className="hidden lg:col-start-1 lg:flex lg:flex-col lg:items-end lg:pt-1">
        <span
          className={cn(
            "font-mono text-3xl font-semibold leading-none tracking-tight tabular-nums",
            "text-base-content/35 transition-colors duration-300",
            "group-hover:text-primary",
            "xl:text-4xl",
          )}
        >
          {milestone.year}
        </span>
      </div>

      {/* ---------- Rail column (dot + vertical line) ---------- */}
      <div
        aria-hidden="true"
        className={cn(
          "relative col-start-1 flex justify-center",
          "lg:col-start-2",
        )}
      >
        {/* Vertical line — bridges into the next row */}
        {!isLast && (
          <span
            className={cn(
              "absolute top-3 bottom-[-3rem] w-px bg-base-300",
              "lg:top-3.5 lg:bottom-[-5rem]",
            )}
          />
        )}
        {/* Dot — subtle scale on row hover */}
        <span
          className={cn(
            "relative mt-2 h-2.5 w-2.5 shrink-0 rounded-full lg:mt-2.5",
            "bg-primary",
            "ring-4 ring-base-100",
            "transition-transform duration-300 ease-out group-hover:scale-125",
          )}
        />
        {/* Soft halo behind the dot — adds depth without neon glow */}
        <span
          className={cn(
            "absolute top-1 mt-1 h-5 w-5 rounded-full bg-primary/10",
            "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          )}
        />
      </div>

      {/* ---------- Content column ---------- */}
      <div className="col-start-2 flex flex-col gap-4 lg:col-start-3 lg:gap-5">
        {/* Mobile-only year chip — sits above the heading */}
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary lg:hidden">
          {milestone.year}
        </span>

        <div className="flex flex-col gap-3">
          <h3 className="text-balance text-xl font-semibold leading-tight tracking-tight text-base-content sm:text-2xl lg:text-[1.75rem] lg:leading-[1.15]">
            {milestone.title}
          </h3>
          <p className="max-w-[60ch] text-base leading-relaxed text-base-content/65 lg:text-[1.0625rem]">
            {milestone.description}
          </p>
        </div>

        {hasPortrait && (
          <MilestonePortrait milestone={milestone} safeImage={safeImage} />
        )}
      </div>
    </motion.li>
  );
}

interface MilestonePortraitProps {
  milestone: JourneyMilestone;
  safeImage: ReturnType<typeof useSafeImageSrc>;
}

/**
 * Editorial side-card for a chapter's person — circular portrait
 * with name + role beside it. Sits inline below the body copy,
 * accented with a left primary border so it reads as a quote-card.
 */
function MilestonePortrait({ milestone, safeImage }: MilestonePortraitProps) {
  if (!milestone.image && !milestone.personName && !milestone.personRole) {
    return null;
  }

  return (
    <figure
      className={cn(
        "mt-1 flex items-center gap-4 rounded-r-xl",
        "border-l-2 border-primary/25 bg-base-200/40 px-4 py-3",
        "transition-colors duration-300 group-hover:border-primary/70 group-hover:bg-base-200/70",
      )}
    >
      {(milestone.image || milestone.personName) && (
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-base-200 ring-1 ring-base-300 sm:h-16 sm:w-16">
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
      )}
      {(milestone.personName || milestone.personRole) && (
        <figcaption className="flex min-w-0 flex-col gap-0.5">
          {milestone.personName && (
            <span className="truncate text-sm font-semibold tracking-tight text-base-content sm:text-base">
              {milestone.personName}
            </span>
          )}
          {milestone.personRole && (
            <span className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-base-content/55 sm:text-[11px]">
              {milestone.personRole}
            </span>
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

/**
 * Closing chapter — drops out of the rail layout into a full-width
 * landing with a generous group photo. The rail line stops at the dot;
 * this node visually "lands" instead of trailing off.
 */
function TodayNode({
  todayLabel,
  todayTitle,
  todayDescription,
  todayImage,
  todayImageAlt,
}: TodayNodeProps) {
  const safe = useSafeImageSrc(todayImage, "journey-today", 1600, 900);
  const hasContent = Boolean(todayTitle || todayDescription);

  return (
    <motion.li
      variants={fadeUp}
      className={cn(
        "relative grid",
        "grid-cols-[1.75rem_minmax(0,_1fr)] gap-x-4",
        "lg:grid-cols-[7rem_1.5rem_minmax(0,_1fr)] lg:gap-x-8",
      )}
    >
      {/* Desktop: small "Today" eyebrow in the year column */}
      <div className="hidden lg:col-start-1 lg:flex lg:flex-col lg:items-end lg:pt-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          {todayLabel}
        </span>
      </div>

      {/* Rail column — terminal dot, no line after */}
      <div
        aria-hidden="true"
        className={cn(
          "relative col-start-1 flex justify-center lg:col-start-2",
        )}
      >
        {/* Filled bullseye dot — visually distinct "end" marker */}
        <span className="relative mt-2 h-3 w-3 shrink-0 rounded-full bg-primary ring-4 ring-base-100 lg:mt-2.5">
          <span className="absolute inset-[3px] rounded-full bg-primary-content" />
        </span>
      </div>

      {/* Content + group image */}
      <div className="col-start-2 flex flex-col gap-6 lg:col-start-3">
        {/* Mobile-only "Today" chip */}
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary lg:hidden">
          {todayLabel}
        </span>
        {hasContent && (
          <div className="flex flex-col gap-3">
            {todayTitle && (
              <h3 className="text-balance text-2xl font-semibold leading-[1.15] tracking-tight text-base-content sm:text-3xl lg:text-[2.125rem]">
                {todayTitle}
              </h3>
            )}
            {todayDescription && (
              <p className="max-w-[62ch] text-base leading-relaxed text-base-content/65 lg:text-[1.0625rem]">
                {todayDescription}
              </p>
            )}
          </div>
        )}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-base-200 ring-1 ring-base-300">
          <img
            src={safe.src}
            onError={safe.onError}
            alt={todayImageAlt ?? "Current team photo"}
            loading="lazy"
            className="h-full w-full object-cover"
          />
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
 * node opens up into a full-width group photo so the narrative lands
 * on a clear present-tense beat.
 *
 * Layout (lg+): three-column grid — large mono year on the left, a
 * 1px rail with primary dots in the middle, copy + inline portrait
 * card on the right. Year tints to primary on row hover and the dot
 * gets a soft halo, so each chapter feels alive without perpetual
 * motion.
 *
 * Layout (< lg): two-column collapse — fixed left rail (28px) with
 * dots, copy stacked on the right with a small year chip above each
 * heading. Stays readable and rhythmic at 320px.
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
      className={cn("w-full bg-base-100 py-16 md:py-20 lg:py-28", className)}
    >
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <motion.header
          className={cn(
            "mb-14 flex max-w-3xl flex-col gap-4 md:mb-20",
            // Indent the header to align with the content column on desktop —
            // mirrors the rail offset so eyebrow/headline sit above the copy.
            "lg:ml-[8.5rem]",
          )}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {eyebrow && (
            <motion.span
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-primary"
            >
              {eyebrow}
            </motion.span>
          )}
          <motion.h2
            variants={fadeUp}
            className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-base-content sm:text-4xl md:text-5xl lg:text-[3.25rem]"
          >
            {headline}
          </motion.h2>
          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-1 max-w-[62ch] text-base leading-relaxed text-base-content/65 md:text-lg"
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
              isLast={i === visible.length - 1 && !showToday}
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
