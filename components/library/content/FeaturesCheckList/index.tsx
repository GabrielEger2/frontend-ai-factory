"use client";

import { motion, useReducedMotion } from "motion/react";
import { FiCheck } from "react-icons/fi";
import { cn } from "@lib/utils";
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
}

export interface FeaturesCheckListGroup {
  /** Small section header above this group of items. */
  title: string;
  /** Items belonging to this group. */
  items: FeaturesCheckListItem[];
}

export interface FeaturesCheckListProps {
  /** Small uppercase eyebrow above the headline. */
  eyebrow?: string;
  /** Lead headline for the section. */
  headline?: string;
  /** Supporting body copy below the headline. */
  subheadline?: string;
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
    <li className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5">
        <CheckMark
          style={checkStyle}
          prefersReducedMotion={prefersReducedMotion}
        />
      </span>
      <span className="text-base leading-relaxed text-base-content/80">
        {renderItemText(item.text, item.highlight)}
      </span>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * FeaturesCheckList — a dense, two-column "everything you get" list with
 * stylized check icons. Designed to live next to a pricing component as
 * a rhythmic reinforcement of what's included. Items can be flat or
 * grouped under small section headers.
 */
export default function FeaturesCheckList({
  eyebrow,
  headline,
  subheadline,
  items,
  groups,
  checkStyle = "filled",
  ctaText,
  ctaUrl,
  ctaVariant = "default",
  ctaColorScheme = "primary",
  className,
}: FeaturesCheckListProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const useGroups = !!groups && groups.length > 0;
  const flatItems = items ?? [];

  const hasHeader = !!(eyebrow || headline || subheadline);
  const hasCta = !!(ctaText && ctaUrl);

  return (
    <section
      className={cn(
        "w-full bg-base-100 text-base-content",
        "px-4 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20",
        className,
      )}
    >
      <div className="mx-auto max-w-5xl">
        {hasHeader && (
          <div className="mb-10 max-w-2xl md:mb-12">
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                {eyebrow}
              </p>
            )}
            {headline && (
              <h2 className="text-3xl font-bold leading-tight text-base-content md:text-4xl">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="mt-4 text-base leading-relaxed text-base-content/60 md:text-lg">
                {subheadline}
              </p>
            )}
          </div>
        )}

        {useGroups ? (
          <div className="space-y-10">
            {groups!.map((group, gi) => (
              <div key={`group-${gi}`}>
                <h3 className="mb-3 border-b border-base-300 pb-2 text-sm font-semibold uppercase tracking-[0.18em] text-base-content/70">
                  {group.title}
                </h3>
                <ul className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
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
          <ul className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
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

        {hasCta && (
          <div className="mt-10 flex md:mt-12">
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
