"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type FeaturedProductBadge = "novo" | "mais-vendido" | "oferta";

export interface FeaturedProduct {
  /** Product display name. */
  name: string;
  /** Product photograph. */
  image: string;
  /** Alt text for the product image. */
  imageAlt: string;
  /** Current price string — already formatted with locale & currency. */
  price: string;
  /**
   * Optional original price. When provided it renders struck-through next
   * to `price`, signalling a discount without computing the percentage.
   */
  priceCompare?: string;
  /**
   * Optional badge — pinned to the top-left of the tile photograph.
   * Defaults to ribbon styling per badge type.
   */
  badge?: FeaturedProductBadge;
  /** Optional override for the badge label (e.g. "-20%"). Falls back to a
   *  pt-BR default per badge type. */
  badgeLabel?: string;
  /**
   * Optional variant chips (color swatches, sizes). Rendered as small pills
   * under the product name. Keep to 2–4 entries — more reads as a catalog.
   */
  variants?: string[];
  /** Per-tile destination URL. */
  ctaUrl: string;
}

export interface ProductsFeaturedStripProps {
  /** Small label rendered above the section headline. */
  eyebrow?: string;
  /** Section headline. */
  headline: string;
  /** Optional supporting copy beneath the headline. */
  subheadline?: string;
  /**
   * Featured products. Library convention: 4–8 entries — fewer reads thin,
   * more starts looking like an unedited catalog.
   *
   * On desktop the first product becomes the editorial feature tile and
   * spans 2 columns when `featureFirst` is true (the default).
   */
  products: FeaturedProduct[];
  /**
   * When true (default), the first product spans 2 columns on desktop to
   * match the asymmetric tone of `ProductsCategoryGrid`. Set to false for
   * a uniform 4-column rail.
   */
  featureFirst?: boolean;
  /** Footer CTA label — e.g. "Ver todos os produtos". */
  ctaText?: string;
  /** Footer CTA destination URL — typically /products. */
  ctaUrl?: string;
  /** Footer CTA visual variant. */
  ctaStyle?: CtaVariant;
  /** Footer CTA color scheme. */
  ctaColorScheme?: ColorScheme;
  /** Visual tone — light surface or inverted dark slab. */
  tone?: "light" | "dark";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Badge defaults (pt-BR labels)                                      */
/* ------------------------------------------------------------------ */

const DEFAULT_BADGE_LABELS: Record<FeaturedProductBadge, string> = {
  novo: "Novo",
  "mais-vendido": "Mais vendido",
  oferta: "Oferta",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProductsFeaturedStrip({
  eyebrow,
  headline,
  subheadline,
  products,
  featureFirst = true,
  ctaText,
  ctaUrl,
  ctaStyle = "arrow",
  ctaColorScheme = "primary",
  tone = "light",
  className,
}: ProductsFeaturedStripProps) {
  const prefersReducedMotion = useReducedMotion();

  const toneClasses =
    tone === "dark"
      ? {
          section: "bg-neutral text-neutral-content",
          divider: "border-neutral-content/15",
          eyebrow: "text-neutral-content/60",
          subheadline: "text-neutral-content/70",
          tileBg: "bg-neutral-content/5",
          tileBody: "text-neutral-content/70",
          tileMuted: "text-neutral-content/55",
          chip: "border-neutral-content/25 text-neutral-content/85",
          arrowChip: "bg-neutral-content/10 backdrop-blur-sm",
          arrowIcon: "text-neutral-content",
        }
      : {
          section: "bg-base-100 text-base-content",
          divider: "border-base-content/15",
          eyebrow: "text-base-content/60",
          subheadline: "text-base-content/70",
          tileBg: "bg-base-200",
          tileBody: "text-base-content/70",
          tileMuted: "text-base-content/55",
          chip: "border-base-content/20 text-base-content/80",
          arrowChip: "bg-base-100/85 backdrop-blur-sm",
          arrowIcon: "text-base-content",
        };

  const badgeClasses = (badge: FeaturedProductBadge) => {
    switch (badge) {
      case "oferta":
        return "bg-error text-error-content";
      case "mais-vendido":
        return "bg-primary text-primary-content";
      case "novo":
      default:
        return "bg-base-content text-base-100";
    }
  };

  return (
    <section
      className={cn(
        "relative isolate w-full py-12 md:py-16 lg:py-24",
        toneClasses.section,
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header — left-aligned, sized to feel editorial without competing
            with the rail below. */}
        <header className="mb-8 flex flex-col gap-4 md:mb-12 lg:mb-16 lg:max-w-3xl">
          {eyebrow && (
            <span
              className={cn(
                "text-sm font-medium uppercase tracking-[0.2em]",
                toneClasses.eyebrow,
              )}
            >
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            {headline}
          </h2>
          {subheadline && (
            <p
              className={cn(
                "max-w-xl text-base leading-relaxed md:text-lg",
                toneClasses.subheadline,
              )}
            >
              {subheadline}
            </p>
          )}
        </header>

        {/*
          Mobile (< md): horizontal scroll-snap rail.
            - `-mx-4` cancels the section's horizontal padding so the rail
              bleeds to the viewport edges; `px-4` re-pads the inside so the
              first/last tile clears the page edge.
            - `snap-x snap-mandatory` enforces tile-by-tile snapping.
            - Each tile takes ~80vw so the next one peeks in.
          Desktop (md+): asymmetric grid.
            - `featureFirst === true` -> 4 columns where item 0 spans cols 1–2.
            - `featureFirst === false` -> uniform 4-column rail.
        */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            visible: {
              transition: { staggerChildren: prefersReducedMotion ? 0 : 0.06 },
            },
          }}
          className={cn(
            // Mobile rail
            "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:overflow-visible md:px-0 md:pb-0",
            // Desktop grid
            "md:grid md:grid-cols-4 md:gap-6 lg:gap-8",
          )}
        >
          {products.map((product, i) => {
            const isFeature = featureFirst && i === 0;
            const badgeKey = product.badge;
            const badgeLabel =
              product.badgeLabel ??
              (badgeKey ? DEFAULT_BADGE_LABELS[badgeKey] : undefined);

            return (
              <motion.a
                key={`${product.name}-${i}`}
                href={product.ctaUrl}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "group relative flex min-w-[78%] shrink-0 snap-start flex-col gap-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 sm:min-w-[58%] md:min-w-0 md:shrink",
                  isFeature && "md:col-span-2 md:row-span-1",
                )}
              >
                {/* Image container — soft scale on hover, badge ribbon and
                    arrow chip overlay the photo so the whole tile reads
                    as a click target. */}
                <motion.div
                  className={cn(
                    "relative w-full overflow-hidden rounded-2xl",
                    toneClasses.tileBg,
                  )}
                  style={{
                    aspectRatio: isFeature ? "4 / 5" : "3 / 4",
                  }}
                  whileHover={
                    prefersReducedMotion ? undefined : { scale: 1.03 }
                  }
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <img
                    src={product.image}
                    alt={product.imageAlt}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />

                  {/* Badge — top-left ribbon. Skipped when no badge. */}
                  {badgeKey && badgeLabel && (
                    <span
                      className={cn(
                        "absolute left-3 top-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.12em]",
                        badgeClasses(badgeKey),
                      )}
                    >
                      {badgeLabel}
                    </span>
                  )}

                  {/* Arrow chip — top-right; icon nudges on group hover. */}
                  <div
                    className={cn(
                      "pointer-events-none absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full shadow-sm",
                      toneClasses.arrowChip,
                    )}
                  >
                    <FiArrowUpRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                        toneClasses.arrowIcon,
                      )}
                      aria-hidden="true"
                    />
                  </div>
                </motion.div>

                {/* Title + price + variants */}
                <div className="flex flex-col gap-1">
                  <h3
                    className={cn(
                      "font-semibold leading-tight tracking-tight",
                      isFeature
                        ? "text-xl md:text-2xl lg:text-3xl"
                        : "text-base md:text-lg",
                    )}
                  >
                    {product.name}
                  </h3>

                  {/* Price row — current price first, struck-through compare
                      price second when present. */}
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span
                      className={cn(
                        "font-medium",
                        isFeature
                          ? "text-base md:text-lg"
                          : "text-sm md:text-base",
                      )}
                    >
                      {product.price}
                    </span>
                    {product.priceCompare && (
                      <span
                        className={cn(
                          "text-sm line-through",
                          toneClasses.tileMuted,
                        )}
                      >
                        {product.priceCompare}
                      </span>
                    )}
                  </div>

                  {/* Variant chips — capped to 4 visible to keep the row
                      from wrapping on small tiles. */}
                  {product.variants && product.variants.length > 0 && (
                    <ul className="mt-1 flex flex-wrap gap-1.5">
                      {product.variants.slice(0, 4).map((variant) => (
                        <li
                          key={variant}
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs",
                            toneClasses.chip,
                          )}
                        >
                          {variant}
                        </li>
                      ))}
                      {product.variants.length > 4 && (
                        <li
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs",
                            toneClasses.chip,
                          )}
                        >
                          {`+${product.variants.length - 4}`}
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Footer CTA — funnels to /products. */}
        {ctaText && (
          <div
            className={cn(
              "mt-10 flex flex-wrap items-center gap-4 border-t pt-8 md:mt-14 md:pt-12",
              toneClasses.divider,
            )}
          >
            <CtaButton
              variant={ctaStyle}
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
