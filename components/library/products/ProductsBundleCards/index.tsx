"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type BundleBadge = "popular" | "best-value" | "editor-pick";

export interface ProductBundle {
  /** Bundle name — e.g. "Kit Café da Manhã", "Combo Skincare Inverno". */
  name: string;
  /** Single-sentence framing line shown beneath the name. */
  description?: string;
  /** Optional bundle photograph (sits above the contents list). */
  image?: string;
  /** Alt text for the bundle image; required whenever `image` is set. */
  imageAlt?: string;
  /**
   * Items contained in the bundle. Cap at 6 entries — anything longer
   * looks like a feature list, not a bundle. Each renders as a checked
   * line item.
   */
  items: string[];
  /** Total price the customer pays for the bundle. */
  price: string;
  /**
   * Optional sum of items if bought separately — rendered struck-through
   * next to the bundle price to signal savings.
   */
  priceCompare?: string;
  /** Optional savings hint — "Economize R$ 80", "Você poupa 22%". */
  savingsHint?: string;
  /** Optional accent badge — `popular`, `best-value`, `editor-pick`. */
  badge?: BundleBadge | null;
  /** Per-card CTA label. */
  ctaText: string;
  /** Per-card CTA destination URL. */
  ctaUrl: string;
}

export interface ProductsBundleCardsProps {
  /** Eyebrow rendered above the section headline. */
  eyebrow?: string;
  /** Section headline. */
  headline: string;
  /** Supporting paragraph beneath the headline. */
  subheadline?: string;
  /**
   * Curated bundles. Two or three cards work — four starts to look like
   * a pricing-tier grid and breaks the bundle metaphor.
   */
  bundles: ProductBundle[];
  /** Footer CTA label — usually "Ver todos os produtos". */
  footerCtaText?: string;
  /** Footer CTA destination — usually `/products`. */
  footerCtaUrl?: string;
  /** Footer CTA visual variant. */
  footerCtaStyle?: CtaVariant;
  /** Footer CTA color scheme. */
  footerCtaColorScheme?: ColorScheme;
  /** Per-card CTA visual variant. */
  cardCtaStyle?: CtaVariant;
  /** Per-card CTA color scheme. */
  cardCtaColorScheme?: ColorScheme;
  /**
   * Visual tone — light page surface or inverted dark slab. Defaults to
   * `light`.
   */
  tone?: "light" | "dark";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Badge labels                                                       */
/* ------------------------------------------------------------------ */

const BADGE_LABELS: Record<BundleBadge, string> = {
  popular: "Mais pedido",
  "best-value": "Melhor custo",
  "editor-pick": "Escolha do chef",
};

/* ------------------------------------------------------------------ */
/*  BundleCard sub-component                                           */
/* ------------------------------------------------------------------ */

interface BundleCardProps {
  bundle: ProductBundle;
  ctaVariant: CtaVariant;
  ctaColorScheme: ColorScheme;
  tone: "light" | "dark";
}

function BundleCard({
  bundle,
  ctaVariant,
  ctaColorScheme,
  tone,
}: BundleCardProps) {
  const accented = !!bundle.badge;
  // Show at most 6 items; trim silently rather than overflow the card.
  const items = bundle.items.slice(0, 6);

  const surface =
    tone === "dark"
      ? accented
        ? "border-primary/40 bg-neutral-content/[0.04]"
        : "border-neutral-content/15 bg-neutral-content/[0.02]"
      : accented
        ? "border-primary/40 bg-base-100"
        : "border-base-300 bg-base-100";

  const muted =
    tone === "dark" ? "text-neutral-content/65" : "text-base-content/65";
  const strong = tone === "dark" ? "text-neutral-content" : "text-base-content";
  const struck =
    tone === "dark"
      ? "text-neutral-content/45 line-through decoration-neutral-content/30"
      : "text-base-content/45 line-through decoration-base-content/25";
  const savingsTone =
    tone === "dark"
      ? "bg-success/15 text-success"
      : "bg-success/10 text-success";

  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "relative flex flex-col rounded-3xl border p-6 md:p-8",
        surface,
        // Accented card lifts a few pixels on md+ to break the horizon
        // line — no glow, just contrast and elevation.
        accented &&
          "shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)] md:-translate-y-2",
      )}
    >
      {/* Badge ribbon — sits flush to the top edge with a tinted accent
          strip on the left. Subtle, not a giant glow. */}
      {bundle.badge && (
        <span
          className={cn(
            "absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
            "bg-primary text-primary-content",
          )}
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-primary-content/70"
          />
          {BADGE_LABELS[bundle.badge]}
        </span>
      )}

      {/* Optional bundle photograph — 4:3 frame, lazy-loaded. */}
      {bundle.image && (
        <div
          className={cn(
            "mb-6 overflow-hidden rounded-2xl",
            tone === "dark" ? "bg-neutral-content/5" : "bg-base-200",
          )}
          style={{ aspectRatio: "4 / 3" }}
        >
          <img
            src={bundle.image}
            alt={bundle.imageAlt ?? ""}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <header className="mb-5">
        <h3
          className={cn(
            "text-2xl font-semibold leading-tight tracking-tight md:text-3xl",
            strong,
          )}
        >
          {bundle.name}
        </h3>
        {bundle.description && (
          <p className={cn("mt-2 text-sm leading-relaxed", muted)}>
            {bundle.description}
          </p>
        )}
      </header>

      {/* Items — checkmark list, max 6. */}
      <ul className="mb-6 flex flex-col gap-2.5">
        {items.map((item, i) => (
          <li
            key={i}
            className={cn(
              "flex items-start gap-3 text-sm leading-relaxed",
              muted,
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                accented
                  ? "bg-primary/15 text-primary"
                  : tone === "dark"
                    ? "bg-neutral-content/10 text-neutral-content"
                    : "bg-base-200 text-base-content/70",
              )}
            >
              <FiCheck className="h-3 w-3" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Price block — bundle total, optional struck-through compare,
          optional savings pill. font-mono on numerals to align across
          cards. */}
      <div className="mb-6 mt-auto flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className={cn(
            "font-mono text-4xl font-semibold tracking-tight md:text-5xl",
            strong,
          )}
        >
          {bundle.price}
        </span>
        {bundle.priceCompare && (
          <span className={cn("font-mono text-base", struck)}>
            {bundle.priceCompare}
          </span>
        )}
        {bundle.savingsHint && (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              savingsTone,
            )}
          >
            {bundle.savingsHint}
          </span>
        )}
      </div>

      <CtaButton
        variant={ctaVariant}
        colorScheme={accented ? "primary" : ctaColorScheme}
        href={bundle.ctaUrl}
        className="w-full justify-center"
      >
        {bundle.ctaText}
      </CtaButton>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * ProductsBundleCards — curated kit/bundle picker for the home page.
 *
 * Surfaces 2–3 real product bundles (NOT subscription tiers): each card
 * shows what's inside the bundle, the total price with optional
 * struck-through compare price + savings hint, an optional badge
 * (popular / best-value / editor-pick), and a per-card CTA. The badged
 * card gets a subtle primary border and lifts a few pixels — no glow,
 * no neon ring.
 *
 * Pairs with category-grid and featured-strip products components and
 * with the dual-offer CTA. Avoid pairing with pricing-tier-cards on the
 * same page — the layouts are visually adjacent and would feel
 * redundant.
 */
export default function ProductsBundleCards({
  eyebrow,
  headline,
  subheadline,
  bundles,
  footerCtaText,
  footerCtaUrl,
  footerCtaStyle = "arrow",
  footerCtaColorScheme = "primary",
  cardCtaStyle = "default",
  cardCtaColorScheme = "primary",
  tone = "light",
  className,
}: ProductsBundleCardsProps) {
  const prefersReducedMotion = useReducedMotion();

  // Cap at 3 — four bundles drift into pricing-tier-cards territory.
  const visibleBundles = bundles.slice(0, 3);

  const sectionClasses =
    tone === "dark"
      ? "bg-neutral text-neutral-content"
      : "bg-base-100 text-base-content";
  const eyebrowTone =
    tone === "dark" ? "text-neutral-content/60" : "text-primary";
  const subheadTone =
    tone === "dark" ? "text-neutral-content/70" : "text-base-content/65";
  const dividerTone =
    tone === "dark" ? "border-neutral-content/15" : "border-base-content/15";

  // Two-card layout: centered max-w pair with comfortable gutter.
  // Three-card layout: full 3-column grid; the accented card lifts.
  const gridColumns =
    visibleBundles.length === 2
      ? "md:grid-cols-2 md:max-w-4xl md:mx-auto"
      : "md:grid-cols-3";

  return (
    <section
      className={cn(
        "relative w-full py-12 md:py-16 lg:py-24",
        sectionClasses,
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header — left-aligned, max-w-2xl. */}
        <motion.header
          className="mb-12 flex max-w-2xl flex-col gap-4 md:mb-16 lg:mb-20"
          variants={containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {eyebrow && (
            <motion.span
              variants={fadeUp}
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.2em]",
                eyebrowTone,
              )}
            >
              {eyebrow}
            </motion.span>
          )}
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl"
          >
            {headline}
          </motion.h2>
          {subheadline && (
            <motion.p
              variants={fadeUp}
              className={cn(
                "max-w-[60ch] text-base leading-relaxed md:text-lg",
                subheadTone,
              )}
            >
              {subheadline}
            </motion.p>
          )}
        </motion.header>

        {/* Bundle grid — staggered reveal, single column < md. */}
        <motion.div
          className={cn("grid grid-cols-1 gap-6 md:gap-8", gridColumns)}
          variants={containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {visibleBundles.map((bundle, i) => (
            <BundleCard
              key={`${bundle.name}-${i}`}
              bundle={bundle}
              ctaVariant={cardCtaStyle}
              ctaColorScheme={cardCtaColorScheme}
              tone={tone}
            />
          ))}
        </motion.div>

        {/* Footer CTA — sits below the grid behind a divider line. */}
        {footerCtaText && (
          <div
            className={cn(
              "mt-12 flex flex-wrap items-center gap-4 border-t pt-10 md:mt-16 md:pt-14",
              dividerTone,
            )}
          >
            <CtaButton
              variant={footerCtaStyle}
              colorScheme={footerCtaColorScheme}
              href={footerCtaUrl}
            >
              {footerCtaText}
            </CtaButton>
          </div>
        )}
      </div>
    </section>
  );
}
