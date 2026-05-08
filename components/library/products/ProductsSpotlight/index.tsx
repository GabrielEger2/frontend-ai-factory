"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import ProductMedia from "@ui/ProductMedia";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ProductSpotlightSpec {
  /** Short attribute label (e.g. "Material", "Acabamento", "Origem"). */
  label: string;
  /** Attribute value — kept short so it pairs with `label` on a single row. */
  value: string;
}

export interface ProductSpotlightThumbnail {
  /** Thumbnail image URL. */
  image: string;
  /** Alt text for the thumbnail. */
  imageAlt: string;
}

export interface ProductsSpotlightProps {
  /** Small label above the product name (e.g. "Edição limitada"). */
  eyebrow?: string;
  /** Product display name — rendered as the section's lead heading. */
  productName: string;
  /** Optional one-line tagline that sits between the name and description. */
  tagline?: string;
  /** Short editorial description — keep tight; the home page is not a PDP. */
  description: string;
  /** Current price string — already formatted with locale & currency. */
  price: string;
  /**
   * Optional original price. When provided it renders struck-through next
   * to `price`, signalling a discount without computing the percentage.
   */
  priceCompare?: string;
  /**
   * Optional price footnote (e.g. "12x sem juros" or "Frete grátis").
   * Renders inline next to the price block.
   */
  priceNote?: string;
  /** Primary product photograph. */
  image: string;
  /** Alt text for the primary image. */
  imageAlt: string;
  /**
   * Optional autoplay-loop video that upgrades the primary image to a moving
   * loop when present. Falls back to `image` under prefers-reduced-motion or
   * when unset. Plays only while the tile is in the viewport.
   */
  videoSrc?: string;
  /**
   * Optional 1–3 mini-gallery thumbnails. Rendered as a row beneath the
   * primary image. More than 3 starts looking like a PDP rail — keep tight.
   */
  thumbnails?: ProductSpotlightThumbnail[];
  /**
   * 2–6 key product specs. Rendered as a divide-y mono-numeral list with
   * label on the left and value tabular-aligned on the right. No card box.
   */
  specs: ProductSpotlightSpec[];
  /** Primary CTA label (e.g. "Comprar agora", "Ver produto"). */
  ctaText: string;
  /** Primary CTA destination URL — typically the product page. */
  ctaUrl: string;
  /** Primary CTA visual variant. */
  ctaStyle?: CtaVariant;
  /** Primary CTA color scheme. */
  ctaColorScheme?: ColorScheme;
  /** Optional secondary CTA label (e.g. "Ver toda a coleção"). */
  secondaryCtaText?: string;
  /** Optional secondary CTA destination URL. */
  secondaryCtaUrl?: string;
  /** Secondary CTA visual variant. */
  secondaryCtaStyle?: CtaVariant;
  /** Secondary CTA color scheme. */
  secondaryCtaColorScheme?: ColorScheme;
  /**
   * When true, the image column sits on the LEFT and the content column on
   * the RIGHT. Default places the image on the right (content reads
   * left-to-right which is the natural editorial entry on mobile-first).
   */
  imageLeft?: boolean;
  /** Visual tone — light surface or inverted dark slab. */
  tone?: "light" | "dark";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProductsSpotlight({
  eyebrow,
  productName,
  tagline,
  description,
  price,
  priceCompare,
  priceNote,
  image,
  imageAlt,
  videoSrc,
  thumbnails,
  specs,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  secondaryCtaStyle = "drawOutline",
  secondaryCtaColorScheme = "neutral",
  imageLeft = false,
  tone = "light",
  className,
}: ProductsSpotlightProps) {
  const prefersReducedMotion = useReducedMotion();

  const toneClasses =
    tone === "dark"
      ? {
          section: "bg-neutral text-neutral-content",
          eyebrow: "text-neutral-content/60",
          tagline: "text-neutral-content/75",
          body: "text-neutral-content/70",
          muted: "text-neutral-content/55",
          divider: "divide-neutral-content/15",
          tileBg: "bg-neutral-content/5",
          priceNoteChip: "bg-neutral-content/10 text-neutral-content/85",
        }
      : {
          section: "bg-base-100 text-base-content",
          eyebrow: "text-base-content/60",
          tagline: "text-base-content/75",
          body: "text-base-content/70",
          muted: "text-base-content/55",
          divider: "divide-base-content/15",
          tileBg: "bg-base-200",
          priceNoteChip: "bg-base-200 text-base-content/80",
        };

  /* Cap thumbnails at 3 — anything more reads as a PDP rail. */
  const visibleThumbnails = thumbnails?.slice(0, 3) ?? [];
  /* Cap specs at 6 — keeps the list scannable at editorial density 5. */
  const visibleSpecs = specs.slice(0, 6);

  const reveal = {
    initial: prefersReducedMotion ? false : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
  };

  /* Image column — declared once and ordered via Tailwind's lg:order-* so
     the column responsibilities don't change on mobile (image stays on top). */
  const imageColumn = (
    <motion.div
      {...reveal}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "flex flex-col gap-4 lg:col-span-5",
        imageLeft ? "lg:order-1" : "lg:order-2",
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl",
          toneClasses.tileBg,
        )}
        style={{ aspectRatio: "4 / 5" }}
      >
        <ProductMedia
          image={image}
          imageAlt={imageAlt}
          videoSrc={videoSrc}
          loading="lazy"
          className="absolute inset-0"
        />
      </div>

      {visibleThumbnails.length > 0 && (
        <ul className="grid grid-cols-3 gap-3">
          {visibleThumbnails.map((thumb, i) => (
            <li
              key={`${thumb.image}-${i}`}
              className={cn(
                "relative overflow-hidden rounded-xl",
                toneClasses.tileBg,
              )}
              style={{ aspectRatio: "1 / 1" }}
            >
              <img
                src={thumb.image}
                alt={thumb.imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );

  const contentColumn = (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        visible: {
          transition: { staggerChildren: prefersReducedMotion ? 0 : 0.08 },
        },
      }}
      className={cn(
        "flex flex-col gap-6 lg:col-span-7 lg:gap-8",
        imageLeft ? "lg:order-2 lg:pl-4 xl:pl-8" : "lg:order-1 lg:pr-4 xl:pr-8",
      )}
    >
      {eyebrow && (
        <motion.span
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "text-sm font-medium uppercase tracking-[0.2em]",
            toneClasses.eyebrow,
          )}
        >
          {eyebrow}
        </motion.span>
      )}

      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl"
      >
        {productName}
      </motion.h2>

      {tagline && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "max-w-xl font-serif text-lg italic leading-snug md:text-xl",
            toneClasses.tagline,
          )}
        >
          {tagline}
        </motion.p>
      )}

      <motion.p
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "max-w-xl text-base leading-relaxed md:text-lg",
          toneClasses.body,
        )}
      >
        {description}
      </motion.p>

      {/* Price block — current price first; struck-through compare price
          second; price note (e.g. "12x sem juros") sits as a subtle chip. */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-wrap items-baseline gap-x-4 gap-y-2"
      >
        <span className="text-3xl font-semibold tabular-nums tracking-tight md:text-4xl">
          {price}
        </span>
        {priceCompare && (
          <span
            className={cn(
              "text-lg tabular-nums line-through md:text-xl",
              toneClasses.muted,
            )}
          >
            {priceCompare}
          </span>
        )}
        {priceNote && (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.14em]",
              toneClasses.priceNoteChip,
            )}
          >
            {priceNote}
          </span>
        )}
      </motion.div>

      {/* Specs — divide-y mono-numeral list. No card box per the brief. */}
      <motion.dl
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "divide-y border-y",
          toneClasses.divider,
          tone === "dark"
            ? "border-neutral-content/15"
            : "border-base-content/15",
        )}
      >
        {visibleSpecs.map((spec, i) => (
          <div
            key={`${spec.label}-${i}`}
            className="flex items-baseline justify-between gap-6 py-3"
          >
            <dt
              className={cn(
                "text-xs font-medium uppercase tracking-[0.18em]",
                toneClasses.muted,
              )}
            >
              {spec.label}
            </dt>
            <dd className="text-right font-mono text-sm tabular-nums md:text-base">
              {spec.value}
            </dd>
          </div>
        ))}
      </motion.dl>

      {/* CTA row — primary first, optional secondary stacked-or-inline. */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-wrap items-center gap-4"
      >
        <CtaButton
          variant={ctaStyle}
          colorScheme={ctaColorScheme}
          href={ctaUrl}
        >
          {ctaText}
        </CtaButton>
        {secondaryCtaText && (
          <CtaButton
            variant={secondaryCtaStyle}
            colorScheme={secondaryCtaColorScheme}
            href={secondaryCtaUrl}
          >
            {secondaryCtaText}
          </CtaButton>
        )}
      </motion.div>
    </motion.div>
  );

  return (
    <section
      className={cn(
        "relative isolate w-full py-12 md:py-16 lg:py-24",
        toneClasses.section,
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {imageColumn}
          {contentColumn}
        </div>
      </div>
    </section>
  );
}
