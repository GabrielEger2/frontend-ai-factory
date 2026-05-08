"use client";

import { motion, useReducedMotion } from "motion/react";
import { FiCheck } from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type CheckStyle = "filled" | "outline" | "minimal";

export interface FeaturesCheckListItem {
  /** Plain text for the line item. */
  text: string;
  /** Optional substring of `text` to bold inline (e.g. a key feature word). */
  highlight?: string;
  /** Optional clarifying line rendered under the item — methodology, scope,
   *  what's-included nuance. Mirrors ComparisonSplit's per-row `note`. */
  note?: string;
}

export interface FeaturesCheckListGroup {
  /** Small section header above this group of items. */
  title: string;
  /** Optional one-line description rendered under the group header. */
  description?: string;
  /** Items belonging to this group. */
  items: FeaturesCheckListItem[];
}

export interface FeaturesCheckListMeta {
  /** Mono-caps label — e.g. "Plan", "Window", "Verified by" */
  label: string;
  /** Plain-weight value */
  value: string;
}

export interface FeaturesCheckListMetric {
  /** The number itself — keep it organic (e.g. "47.2%", "3,847") */
  value: string;
  /** One-line context for the number */
  label: string;
}

export interface FeaturesCheckListPullQuote {
  /** The quote itself, no surrounding punctuation */
  quote: string;
  /** Person or organisation it is attributed to */
  attribution: string;
  /** Optional secondary attribution line — role, location, etc. */
  attributionMeta?: string;
}

export interface FeaturesCheckListProps {
  /** Small uppercase eyebrow above the headline. */
  eyebrow?: string;
  /** Lead headline for the section. */
  headline?: string;
  /** Supporting body copy below the headline. */
  subheadline?: string;
  /** Optional section-level meta strip — renders as a 4-up dl band under the header. */
  meta?: FeaturesCheckListMeta[];
  /**
   * Flat list of feature items. Used when `groups` is not provided.
   * Recommended: 6–12 items.
   */
  items?: FeaturesCheckListItem[];
  /**
   * Grouped items rendered under small section headers. Takes precedence
   * over `items` when provided.
   */
  groups?: FeaturesCheckListGroup[];
  /** Visual style for the check icon. */
  checkStyle?: CheckStyle;
  /** Optional methodology / fine-print footnote rendered below the list. */
  footnote?: string;
  /** Optional pull-quote — renders between the list and the metrics band. */
  pullQuote?: FeaturesCheckListPullQuote;
  /** Optional outcome metrics rendered as a dark band below the list. */
  metrics?: FeaturesCheckListMetric[];
  /** Optional CTA label rendered below the list. */
  ctaText?: string;
  /** Optional CTA destination URL. */
  ctaUrl?: string;
  /** CTA visual variant. */
  ctaVariant?: CtaVariant;
  /** CTA color scheme. */
  ctaColorScheme?: ColorScheme;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Renders `text` with the first occurrence of `highlight` wrapped in <strong>.
 * Uses a case-insensitive substring split (no regex on render). Falls back to
 * plain text when `highlight` is empty or not found.
 */
function renderItemText(text: string, highlight?: string) {
  if (!highlight) return text;
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + highlight.length);
  const after = text.slice(idx + highlight.length);
  return (
    <>
      {before}
      <strong className="font-semibold text-base-content">{match}</strong>
      {after}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Check icon                                                         */
/* ------------------------------------------------------------------ */

interface CheckMarkProps {
  style: CheckStyle;
  prefersReducedMotion: boolean;
}

function CheckMark({ style, prefersReducedMotion }: CheckMarkProps) {
  const pulse = prefersReducedMotion
    ? false
    : ({
        initial: { scale: 0, opacity: 0 },
        whileInView: { scale: 1, opacity: 1 },
        viewport: { once: true, margin: "-40px" },
        transition: {
          type: "spring" as const,
          stiffness: 320,
          damping: 18,
          mass: 0.6,
        },
      } as const);

  if (style === "minimal") {
    return (
      <motion.span
        aria-hidden="true"
        {...(pulse || {})}
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-primary"
      >
        <FiCheck className="h-4 w-4" strokeWidth={2.5} />
      </motion.span>
    );
  }

  if (style === "outline") {
    return (
      <motion.span
        aria-hidden="true"
        {...(pulse || {})}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-1 ring-primary text-primary"
      >
        <FiCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
      </motion.span>
    );
  }

  // filled
  return (
    <motion.span
      aria-hidden="true"
      {...(pulse || {})}
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-content"
    >
      <FiCheck className="h-3.5 w-3.5" strokeWidth={3} />
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  Item row                                                           */
/* ------------------------------------------------------------------ */

interface ItemRowProps {
  item: FeaturesCheckListItem;
  checkStyle: CheckStyle;
  prefersReducedMotion: boolean;
}

function ItemRow({ item, checkStyle, prefersReducedMotion }: ItemRowProps) {
  return (
    <li className="flex items-start gap-3 border-b border-base-300/60 py-3 last:border-b-0 md:py-3.5">
      <span className="mt-0.5">
        <CheckMark
          style={checkStyle}
          prefersReducedMotion={prefersReducedMotion}
        />
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-base leading-relaxed text-base-content/85">
          {renderItemText(item.text, item.highlight)}
        </span>
        {item.note && (
          <span className="text-sm leading-snug text-base-content/55">
            {item.note}
          </span>
        )}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * FeaturesCheckList — a dense "everything you get" check list framed as a
 * long-form value page rather than a sidebar widget. An optional 4-up project
 * meta strip frames the list above; rows can be flat or grouped under small
 * section headers, with optional per-row notes for methodology or scope; below
 * the list, an optional footnote, pull-quote, dark outcome metrics band and
 * closing CTA let the section carry an entire plan-detail or scope-of-work
 * page on its own.
 */
export default function FeaturesCheckList({
  eyebrow,
  headline,
  subheadline,
  meta,
  items,
  groups,
  checkStyle = "filled",
  footnote,
  pullQuote,
  metrics,
  ctaText,
  ctaUrl,
  ctaVariant = "default",
  ctaColorScheme = "primary",
  className,
}: FeaturesCheckListProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const shouldReduceMotion = prefersReducedMotion;

  const useGroups = !!groups && groups.length > 0;
  const flatItems = items ?? [];

  const hasHeader = !!(eyebrow || headline || subheadline);
  const hasCta = !!(ctaText && ctaUrl);

  /* total count for the section-level summary line */
  const totalCount = useGroups
    ? groups!.reduce((acc, g) => acc + g.items.length, 0)
    : flatItems.length;

  return (
    <section
      className={cn(
        "w-full bg-base-100 text-base-content",
        "px-4 py-16 md:px-8 md:py-24 lg:px-12 lg:py-32",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        {hasHeader && (
          <motion.div
            className="mb-10 flex max-w-3xl flex-col md:mb-14"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {eyebrow && (
              <motion.span
                variants={fadeUp}
                className="font-mono text-xs uppercase tracking-[0.25em] text-primary"
              >
                {eyebrow}
              </motion.span>
            )}
            {headline && (
              <motion.h2
                variants={fadeUp}
                className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-base-content sm:text-4xl md:text-5xl lg:text-6xl"
              >
                {headline}
              </motion.h2>
            )}
            {subheadline && (
              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-[60ch] text-base leading-relaxed text-base-content/65 md:text-lg"
              >
                {subheadline}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Section-level meta strip */}
        {meta && meta.length > 0 && (
          <motion.dl
            className="mb-12 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-base-300 py-6 md:mb-16 md:grid-cols-4"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {meta.map((m, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex flex-col gap-1"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-base-content/55">
                  {m.label}
                </dt>
                <dd className="text-base font-medium text-base-content">
                  {m.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        )}

        {/* Item count — anchors a long list as a single "manifest" */}
        {totalCount > 0 && (
          <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-base-300 pb-3 md:mb-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-base-content/55">
              {useGroups
                ? `${groups!.length} groups · ${totalCount} items`
                : `${String(totalCount).padStart(2, "0")} items`}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-base-content/40">
              Included
            </span>
          </div>
        )}

        {useGroups ? (
          <div className="space-y-12">
            {groups!.map((group, gi) => (
              <div key={`group-${gi}`}>
                <div className="mb-3 flex flex-col gap-1 border-b border-base-content/15 pb-3">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-base-content/70">
                    {group.title}
                  </h3>
                  {group.description && (
                    <p className="max-w-[60ch] text-sm leading-relaxed text-base-content/55">
                      {group.description}
                    </p>
                  )}
                </div>
                <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
                  {group.items.map((item, ii) => (
                    <ItemRow
                      key={`g${gi}-i${ii}`}
                      item={item}
                      checkStyle={checkStyle}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {flatItems.map((item, i) => (
              <ItemRow
                key={`item-${i}`}
                item={item}
                checkStyle={checkStyle}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </ul>
        )}

        {/* Methodology / fine-print footnote */}
        {footnote && (
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-8 max-w-[70ch] font-mono text-[11px] leading-relaxed tracking-[0.04em] text-base-content/55"
          >
            {footnote}
          </motion.p>
        )}

        {/* Pull quote */}
        {pullQuote && (
          <motion.figure
            className="mt-16 max-w-4xl border-l-2 border-primary pl-6 md:mt-24 md:pl-10"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <blockquote className="text-balance font-serif text-2xl leading-snug text-base-content md:text-3xl lg:text-4xl">
              &ldquo;{pullQuote.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex flex-col gap-1">
              <span className="text-sm font-medium text-base-content md:text-base">
                {pullQuote.attribution}
              </span>
              {pullQuote.attributionMeta && (
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-base-content/55">
                  {pullQuote.attributionMeta}
                </span>
              )}
            </figcaption>
          </motion.figure>
        )}

        {/* Outcome metrics band */}
        {metrics && metrics.length > 0 && (
          <motion.div
            className={cn(
              "grid grid-cols-2 gap-6 rounded-3xl bg-base-content px-6 py-10 text-base-100 md:grid-cols-4 md:px-12 md:py-14",
              pullQuote ? "mt-12 md:mt-16" : "mt-16 md:mt-24",
            )}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {metrics.map((m, i) => (
              <div key={i} className="flex flex-col items-start gap-1">
                <span className="font-mono text-3xl font-semibold tracking-tight md:text-5xl">
                  {m.value}
                </span>
                <span className="text-xs leading-snug text-base-100/70 md:text-sm">
                  {m.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {hasCta && (
          <div className="mt-12 flex md:mt-16">
            <CtaButton
              variant={ctaVariant}
              colorScheme={ctaColorScheme}
              href={ctaUrl}
            >
              {ctaText}
            </CtaButton>
          </div>
        )}
      </div>
    </section>
  );
}
