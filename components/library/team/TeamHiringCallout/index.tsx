"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import { buttonStyles } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface HiringTeamMember {
  /** Full name. */
  name: string;
  /** Role / title. */
  role: string;
  /** Square portrait URL — falls back to seeded picsum. */
  image?: string;
  /** Required alt text when `image` is provided. */
  imageAlt?: string;
}

export interface OpenRole {
  /** Role title (e.g. "Senior Backend Engineer"). */
  title: string;
  /** Department / team label (e.g. "Engineering", "Product"). */
  department: string;
  /** Location label (e.g. "Remote", "São Paulo · Hybrid"). */
  location: string;
  /** Apply destination (typically a Greenhouse / Ashby URL). */
  applyUrl: string;
  /** Optional employment type chip ("Full-time", "Contract"). */
  employmentType?: string;
}

export interface HiringPerk {
  /**
   * Short emoji or single-character glyph used as the perk icon.
   * Keep it tight — emoji renders inconsistently past two characters.
   */
  icon: string;
  /** Perk label (e.g. "Remote-first", "Equity for everyone"). */
  label: string;
}

export interface TeamHiringCalloutProps {
  /** Eyebrow above the headline (e.g. "We're hiring"). */
  eyebrow?: string;
  /** Section headline. */
  headline: string;
  /** Supporting paragraph beneath the headline. */
  subheadline?: string;
  /**
   * Team members — 4 to 6 entries lock into the 2x2 / 3x2 grid.
   * Past 6 silently trims; the grid breaks otherwise.
   */
  teamMembers: HiringTeamMember[];
  /**
   * Open roles — 3 to 8 entries reads best. Past 8 the list crowds
   * the perks strip below; consider a dedicated /careers page link.
   */
  roles: OpenRole[];
  /**
   * Perks — 3 to 5 entries lock into the bottom strip cleanly.
   * Past 5 wraps to a second row, which works on lg+ but feels noisy.
   */
  perks?: HiringPerk[];
  /** Bottom-strip CTA — typically "See all roles" / "Open roles page". */
  ctaText?: string;
  ctaUrl?: string;
  /** Visual tone — neutral page surface or inverted dark slab. */
  tone?: "light" | "dark";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Tone classes                                                       */
/* ------------------------------------------------------------------ */

function getToneClasses(tone: "light" | "dark") {
  return tone === "dark"
    ? {
        section: "bg-neutral text-neutral-content",
        eyebrow: "text-neutral-content/65",
        subheadline: "text-neutral-content/75",
        memberSurface: "bg-neutral-content/5",
        memberLabel: "text-neutral-content/65",
        rolesSurface: "border-neutral-content/15",
        roleHover:
          "hover:bg-neutral-content/5 focus-visible:bg-neutral-content/5",
        roleDivider: "border-neutral-content/12",
        roleMeta: "text-neutral-content/60",
        roleArrow: "text-neutral-content/55 group-hover:text-neutral-content",
        perksSurface: "bg-neutral-content/5 border-neutral-content/10",
        perksDivider: "border-neutral-content/15",
        countChip: "bg-neutral-content/10 text-neutral-content",
      }
    : {
        section: "bg-base-100 text-base-content",
        eyebrow: "text-primary",
        subheadline: "text-base-content/70",
        memberSurface: "bg-base-200",
        memberLabel: "text-base-content/60",
        rolesSurface: "border-base-300",
        roleHover: "hover:bg-base-200/70 focus-visible:bg-base-200/70",
        roleDivider: "border-base-300",
        roleMeta: "text-base-content/55",
        roleArrow: "text-base-content/45 group-hover:text-primary",
        perksSurface: "bg-base-200 border-base-300",
        perksDivider: "border-base-300",
        countChip: "bg-base-100 text-base-content",
      };
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface MemberThumbProps {
  member: HiringTeamMember;
  index: number;
  toneClasses: ReturnType<typeof getToneClasses>;
}

function MemberThumb({ member, index, toneClasses }: MemberThumbProps) {
  const safe = useSafeImageSrc(
    member.image,
    `hiring-${index}-${member.name}`,
    400,
    400,
  );

  return (
    <motion.figure
      variants={fadeUp}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-xl",
        toneClasses.memberSurface,
      )}
    >
      <img
        src={safe.src}
        onError={safe.onError}
        alt={member.imageAlt ?? `${member.name}, ${member.role}`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
      />
      <figcaption
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 flex-col gap-0.5 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 text-white opacity-0 transition-all duration-300 ease-out",
          "group-hover:translate-y-0 group-hover:opacity-100",
          "group-focus-within:translate-y-0 group-focus-within:opacity-100",
        )}
      >
        <span className="text-sm font-semibold leading-tight">
          {member.name}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/85">
          {member.role}
        </span>
      </figcaption>
    </motion.figure>
  );
}

interface RoleRowProps {
  role: OpenRole;
  toneClasses: ReturnType<typeof getToneClasses>;
  isLast: boolean;
}

function RoleRow({ role, toneClasses, isLast }: RoleRowProps) {
  return (
    <motion.li variants={fadeUp} className="list-none">
      <a
        href={role.applyUrl}
        className={cn(
          "group flex flex-col gap-3 px-4 py-5 transition-colors duration-200 ease-out md:flex-row md:items-center md:justify-between md:gap-6 md:px-6 md:py-6",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          !isLast && "border-b",
          toneClasses.roleDivider,
          toneClasses.roleHover,
        )}
      >
        <div className="flex flex-col gap-1.5">
          <h4 className="text-base font-semibold leading-tight tracking-tight md:text-lg">
            {role.title}
          </h4>
          <div
            className={cn(
              "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em]",
              toneClasses.roleMeta,
            )}
          >
            <span>{role.department}</span>
            <span aria-hidden="true">·</span>
            <span>{role.location}</span>
            {role.employmentType && (
              <>
                <span aria-hidden="true">·</span>
                <span>{role.employmentType}</span>
              </>
            )}
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-2 self-start rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 ease-out md:self-auto",
            toneClasses.roleDivider,
            toneClasses.roleArrow,
            "group-hover:translate-x-0.5",
          )}
        >
          Apply
          <FiArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </span>
      </a>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TeamHiringCallout — recruiting-funnel section that doubles as a
 * small team showcase. Left rail surfaces a compact 2x2 / 3x2 grid of
 * teammate portraits with name + role on hover; right rail lists open
 * roles with department, location, and per-row apply links. Below the
 * split, an optional perks strip (3-5 emoji + label items) and a
 * bottom CTA close the section.
 *
 * Layout (lg+): 2-column split — portraits left, roles right.
 * Layout (md): same split with smaller member grid.
 * Layout (< md): single column — members first, then roles, then perks.
 */
export default function TeamHiringCallout({
  eyebrow,
  headline,
  subheadline,
  teamMembers,
  roles,
  perks,
  ctaText,
  ctaUrl,
  tone = "light",
  className,
}: TeamHiringCalloutProps) {
  const shouldReduceMotion = useReducedMotion();
  const toneClasses = getToneClasses(tone);

  // 6-member cap — past that the 3x2 grid feels heavy alongside the roles.
  const visibleMembers = teamMembers.slice(0, 6);
  // 8-role cap — past that the list dominates the section.
  const visibleRoles = roles.slice(0, 8);
  const visiblePerks = (perks ?? []).slice(0, 5);

  // Choose 2 columns when 4 members, 3 columns when 5-6 members.
  const memberCols =
    visibleMembers.length <= 4 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3";

  return (
    <section
      className={cn(
        "w-full py-16 md:py-20 lg:py-24",
        toneClasses.section,
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
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
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.25em]",
                toneClasses.eyebrow,
              )}
            >
              {eyebrow}
            </motion.span>
          )}
          <motion.h2
            variants={fadeUp}
            className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl"
          >
            {headline}
          </motion.h2>
          {subheadline && (
            <motion.p
              variants={fadeUp}
              className={cn(
                "mt-2 max-w-[60ch] text-base leading-relaxed",
                toneClasses.subheadline,
              )}
            >
              {subheadline}
            </motion.p>
          )}
        </motion.header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,_5fr)_minmax(0,_7fr)] lg:gap-12 xl:gap-16">
          {/* Left — team thumbnails */}
          <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="flex items-center justify-between gap-4">
              <span
                className={cn(
                  "font-mono text-[11px] uppercase tracking-[0.22em]",
                  toneClasses.eyebrow,
                )}
              >
                Quem você vai sentar do lado
              </span>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
                  toneClasses.roleDivider,
                  toneClasses.countChip,
                )}
              >
                {visibleMembers.length} · de {teamMembers.length}
              </span>
            </div>
            <div className={cn("grid gap-3 md:gap-4", memberCols)}>
              {visibleMembers.map((member, i) => (
                <MemberThumb
                  key={`${member.name}-${i}`}
                  member={member}
                  index={i}
                  toneClasses={toneClasses}
                />
              ))}
            </div>
          </motion.div>

          {/* Right — open roles list */}
          <motion.div
            className={cn(
              "flex flex-col rounded-2xl border",
              toneClasses.rolesSurface,
            )}
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div
              className={cn(
                "flex items-center justify-between gap-4 border-b px-4 py-4 md:px-6",
                toneClasses.roleDivider,
              )}
            >
              <span
                className={cn(
                  "font-mono text-[11px] uppercase tracking-[0.22em]",
                  toneClasses.eyebrow,
                )}
              >
                Vagas abertas
              </span>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
                  toneClasses.roleDivider,
                  toneClasses.countChip,
                )}
              >
                {visibleRoles.length}
              </span>
            </div>
            {visibleRoles.length > 0 ? (
              <ol className="list-none">
                {visibleRoles.map((role, i) => (
                  <RoleRow
                    key={`${role.title}-${i}`}
                    role={role}
                    toneClasses={toneClasses}
                    isLast={i === visibleRoles.length - 1}
                  />
                ))}
              </ol>
            ) : (
              <p
                className={cn(
                  "px-4 py-8 text-center text-sm md:px-6",
                  toneClasses.roleMeta,
                )}
              >
                Nenhuma vaga aberta no momento. Deixe seu currículo na nossa
                lista de talentos.
              </p>
            )}
          </motion.div>
        </div>

        {/* Perks strip + CTA */}
        {(visiblePerks.length > 0 || (ctaText && ctaUrl)) && (
          <motion.div
            className={cn(
              "mt-10 flex flex-col gap-6 rounded-2xl border p-6 md:mt-14 md:flex-row md:items-center md:gap-10 md:p-8",
              toneClasses.perksSurface,
            )}
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {visiblePerks.length > 0 && (
              <ul
                className={cn(
                  "flex flex-1 flex-wrap items-center gap-x-6 gap-y-3 md:gap-x-8",
                )}
              >
                {visiblePerks.map((perk, i) => (
                  <motion.li
                    key={`${perk.label}-${i}`}
                    variants={fadeUp}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-base"
                    >
                      {perk.icon}
                    </span>
                    <span>{perk.label}</span>
                  </motion.li>
                ))}
              </ul>
            )}
            {ctaText && ctaUrl && (
              <motion.a
                variants={fadeUp}
                href={ctaUrl}
                className={buttonStyles({ variant: "primary", size: "md" })}
              >
                {ctaText}
              </motion.a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
