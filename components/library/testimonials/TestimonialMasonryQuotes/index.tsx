"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TestimonialMasonryQuoteItem {
  /** Pull-quote text — short copy renders compact tile, long copy renders tall tile */
  quote: string;
  /** Author full name */
  authorName: string;
  /** Author title / company */
  authorTitle: string;
  /** Optional author photo URL — when omitted, useSafeImageSrc picks a deterministic placeholder */
  authorImage?: string;
  /** Accessible alt for the author photo */
  authorImageAlt?: string;
  /** Optional company logo (small mark, rendered in the tile footer) */
  companyLogo?: string;
  /** Accessible alt for the company logo */
  companyLogoAlt?: string;
  /** Optional context tag (e.g. "Q3 case study", "G2 review") */
  tag?: string;
  /**
   * Optional accent for the tile — used by every 5th tile by default to break the rhythm.
   * "muted" — bg-base-200 (default for most tiles)
   * "elevated" — bg-base-100 with a stronger ring (subtle elevation)
   * "accent" — bg-primary text-primary-content for editorial pop
   * "outline" — transparent with a 1px ring, no fill
   */
  tone?: "muted" | "elevated" | "accent" | "outline";
}

export interface TestimonialMasonryQuotesProps {
  /** Optional eyebrow */
  eyebrow?: string;
  /** Optional section headline */
  headline?: string;
  /** Optional supporting copy under the headline */
  subheadline?: string;
  /** 6-12 quote items — masonry sizes itself from the array length */
  items?: TestimonialMasonryQuoteItem[];
  /** Number of columns on lg+ screens. Defaults to 3 (mobile is always single column, md is 2). */
  columns?: 2 | 3 | 4;
  /**
   * "neutral" — bg-base-100 (default)
   * "muted" — bg-base-200
   */
  tone?: "neutral" | "muted";
  /** Site-wide visual configuration — accepted for API consistency */
  styleKit?: StyleKit;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS: TestimonialMasonryQuoteItem[] = [
  {
    quote:
      "Three weeks in, the platform team migrated 84 services without filing a single ticket against us. That's never happened before.",
    authorName: "Mariana Cardoso",
    authorTitle: "VP Platform Engineering, Northbeam",
    authorImage: "https://picsum.photos/seed/masonry-mariana-cardoso/120/120",
    authorImageAlt: "Mariana Cardoso",
    tag: "Q3 platform migration",
    tone: "elevated",
  },
  {
    quote:
      "We replaced four different observability tools with one cleaner workflow.",
    authorName: "Rafael Tavares",
    authorTitle: "Co-founder, Drift Studio",
    authorImage: "https://picsum.photos/seed/masonry-rafael-tavares/120/120",
    authorImageAlt: "Rafael Tavares",
  },
  {
    quote:
      "I've worked with thirteen agencies in the last decade. None shipped this quickly without dropping quality.",
    authorName: "Bianca Okazaki",
    authorTitle: "Founder, Foxtrot Studio",
    authorImage: "https://picsum.photos/seed/masonry-bianca-okazaki/120/120",
    authorImageAlt: "Bianca Okazaki",
    tone: "accent",
  },
  {
    quote: "Onboarding for new engineers dropped from two weeks to four days.",
    authorName: "Amina Hassan",
    authorTitle: "Head of Design, Northwave",
    authorImage: "https://picsum.photos/seed/masonry-amina-hassan/120/120",
    authorImageAlt: "Amina Hassan",
    tag: "G2 review",
  },
  {
    quote:
      "The clarity of communication alone was worth the price. We knew where things stood every single Friday at 4pm.",
    authorName: "Camila Reyes Rodrigues",
    authorTitle: "Diretora de Operações, Casa Reyes",
    authorImage: "https://picsum.photos/seed/masonry-camila-reyes/120/120",
    authorImageAlt: "Camila Reyes Rodrigues",
    tone: "outline",
  },
  {
    quote:
      "We finally have a brand story everyone in the company tells the same way. Sales calls feel different now.",
    authorName: "Yuki Tanaka",
    authorTitle: "VP Marketing, Glasscube",
    authorImage: "https://picsum.photos/seed/masonry-yuki-tanaka/120/120",
    authorImageAlt: "Yuki Tanaka",
    tag: "Brand refresh, 2025",
  },
  {
    quote:
      "Pipeline up 47.2% in the first quarter. The redesign paid for itself before the next billing cycle.",
    authorName: "David Okafor",
    authorTitle: "CTO, Northwind Labs",
    authorImage: "https://picsum.photos/seed/masonry-david-okafor/120/120",
    authorImageAlt: "David Okafor",
    tone: "elevated",
  },
  {
    quote: "Best money we've spent on a partner this year. Period.",
    authorName: "Naomi Wright",
    authorTitle: "CEO, Rivermark",
    authorImage: "https://picsum.photos/seed/masonry-naomi-wright/120/120",
    authorImageAlt: "Naomi Wright",
  },
  {
    quote:
      "They asked the uncomfortable questions in week one — about pricing, about positioning, about the team. The answers reshaped the launch.",
    authorName: "Hannah Schmitt",
    authorTitle: "Founder, Morrow & Co",
    authorImage: "https://picsum.photos/seed/masonry-hannah-schmitt/120/120",
    authorImageAlt: "Hannah Schmitt",
    tag: "Launch strategy",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function MasonryTile({
  item,
  index,
  shouldReduceMotion,
}: {
  item: TestimonialMasonryQuoteItem;
  index: number;
  shouldReduceMotion: boolean | null;
}) {
  const safeImage = useSafeImageSrc(
    item.authorImage,
    `masonry-${index}-${item.authorName}`,
    120,
    120,
  );

  /* Auto-tone fallback: every 5th tile gets a light accent break */
  const resolvedTone =
    item.tone ??
    (index % 5 === 4 ? "accent" : index % 4 === 0 ? "elevated" : "muted");
  const isAccent = resolvedTone === "accent";

  /* Quote-length-driven sizing: short quotes stay compact, long ones break the column rhythm */
  const charCount = item.quote.length;
  const quoteSize =
    charCount > 180
      ? "text-lg leading-snug md:text-xl"
      : charCount > 100
        ? "text-base leading-snug md:text-lg"
        : "text-base leading-snug";

  const surfaceClass = cn(
    "break-inside-avoid mb-4 md:mb-6 flex flex-col gap-5 rounded-2xl p-6 md:p-7 transition-all duration-300 ease-out",
    resolvedTone === "muted" && "bg-base-200 ring-1 ring-base-300/60",
    resolvedTone === "elevated" &&
      "bg-base-100 ring-1 ring-base-300 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.12)]",
    resolvedTone === "accent" && "bg-primary text-primary-content",
    resolvedTone === "outline" && "ring-1 ring-base-300",
    "hover:-translate-y-0.5",
  );

  const quoteColor = isAccent ? "text-primary-content" : "text-base-content";
  const nameColor = isAccent ? "text-primary-content" : "text-base-content";
  const titleColor = isAccent
    ? "text-primary-content/75"
    : "text-base-content/65";
  const ringColor = isAccent ? "ring-primary-content/25" : "ring-base-300";
  const tagColor = isAccent
    ? "text-primary-content/85 ring-primary-content/35"
    : "text-base-content/65 ring-base-300";

  return (
    <motion.figure
      className={surfaceClass}
      variants={{
        hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {item.tag && (
        <span
          className={cn(
            "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.18em] ring-1",
            tagColor,
          )}
        >
          {item.tag}
        </span>
      )}

      <blockquote
        className={cn("font-medium tracking-tight", quoteSize, quoteColor)}
      >
        <span aria-hidden="true" className="mr-1 opacity-30">
          &ldquo;
        </span>
        {item.quote}
        <span aria-hidden="true" className="ml-0.5 opacity-30">
          &rdquo;
        </span>
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3 pt-2">
        <img
          {...safeImage}
          alt={item.authorImageAlt ?? item.authorName}
          className={cn(
            "h-10 w-10 flex-shrink-0 rounded-full object-cover ring-1",
            ringColor,
          )}
          loading="lazy"
          width={40}
          height={40}
        />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className={cn("truncate text-sm font-semibold", nameColor)}>
            {item.authorName}
          </span>
          <span className={cn("truncate text-xs", titleColor)}>
            {item.authorTitle}
          </span>
        </span>
        {item.companyLogo && (
          <img
            src={item.companyLogo}
            alt={item.companyLogoAlt ?? `${item.authorName} company logo`}
            className={cn(
              "ml-auto h-4 w-auto",
              isAccent ? "opacity-90" : "opacity-65",
            )}
            loading="lazy"
          />
        )}
      </figcaption>
    </motion.figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TestimonialMasonryQuotes -- a Pinterest-style social-proof wall.
 * 6-12 quote tiles laid out in a CSS columns masonry, with quote-length-driven
 * vertical sizing and an automatic accent-tile rhythm every 5th card.
 *
 * Use when sheer volume of social proof is the message — many short voices
 * carrying more weight than one long quote.
 */
export default function TestimonialMasonryQuotes({
  eyebrow,
  headline,
  subheadline,
  items = DEFAULT_ITEMS,
  columns = 3,
  tone = "neutral",
  className,
}: TestimonialMasonryQuotesProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeItems = items.length > 0 ? items : DEFAULT_ITEMS;

  const surfaceClass = tone === "muted" ? "bg-base-200" : "bg-base-100";

  const columnsClass =
    columns === 2
      ? "md:columns-2"
      : columns === 4
        ? "md:columns-2 lg:columns-4"
        : "md:columns-2 lg:columns-3";

  return (
    <section
      className={cn(surfaceClass, "w-full py-16 md:py-20 lg:py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {(eyebrow || headline || subheadline) && (
          <motion.div
            className="mx-auto mb-12 flex max-w-2xl flex-col items-start gap-3 md:mb-16"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                {eyebrow}
              </span>
            )}
            {headline && (
              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-base-content md:text-4xl lg:text-5xl">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="max-w-[65ch] text-base text-base-content/65 md:text-lg">
                {subheadline}
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          className={cn("columns-1 gap-4 md:gap-6", columnsClass)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {safeItems.map((item, idx) => (
            <MasonryTile
              key={`${item.authorName}-${idx}`}
              item={item}
              index={idx}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
