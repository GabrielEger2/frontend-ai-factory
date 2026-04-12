"use client";

import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TestimonialItem {
  /** Author's photo URL */
  image: string;
  /** Accessible alt text for the author photo */
  imageAlt: string;
  /** Author name */
  name: string;
  /** Author title / role / company */
  title: string;
  /** Testimonial quote text */
  quote: string;
}

export interface TestimonialCardProps extends TestimonialItem {
  /** Visual layout variant */
  layout?: "horizontal" | "vertical" | "compact";
  /** Force a specific color mode for alternating card styles */
  inverted?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TestimonialCard -- shared base card for all testimonial section variants.
 *
 * Layouts:
 * - **horizontal** (default) -- image on the left, text on the right (used by scrolling marquee)
 * - **vertical** -- image + quote stacked vertically (used by stagger carousel)
 * - **compact** -- full-card text with author at the bottom (used by stacked cards)
 */
export default function TestimonialCard({
  image,
  imageAlt,
  name,
  title,
  quote,
  layout = "horizontal",
  inverted = false,
  className,
}: TestimonialCardProps) {
  const bg = inverted
    ? "bg-neutral text-neutral-content"
    : "bg-base-200 text-base-content";
  const mutedText = inverted
    ? "text-neutral-content/60"
    : "text-base-content/60";

  if (layout === "horizontal") {
    return (
      <article
        className={cn(
          "relative grid shrink-0 grid-cols-[7rem,_1fr] overflow-hidden rounded-lg",
          bg,
          className,
        )}
      >
        <img
          src={image}
          alt={imageAlt}
          className="h-44 w-full object-cover"
          loading="lazy"
        />
        <div className="p-4">
          <span className="block text-lg font-semibold">{name}</span>
          <span className={cn("mb-3 block text-sm font-medium", mutedText)}>
            {title}
          </span>
          <span className={cn("block text-sm", mutedText)}>{quote}</span>
        </div>
        <span
          className={cn(
            "absolute right-2 top-2 text-7xl leading-none",
            inverted ? "text-neutral-content/10" : "text-base-content/10",
          )}
          aria-hidden="true"
        >
          &ldquo;
        </span>
      </article>
    );
  }

  if (layout === "vertical") {
    return (
      <article className={cn("flex flex-col", bg, className)}>
        <img
          src={image}
          alt={imageAlt}
          className="mb-4 h-14 w-12 object-cover object-top"
          loading="lazy"
          style={{ boxShadow: "3px 3px 0px currentColor" }}
        />
        <p className="text-base sm:text-xl">&ldquo;{quote}&rdquo;</p>
        <p className={cn("mt-auto pt-4 text-sm italic", mutedText)}>
          - {name}, {title}
        </p>
      </article>
    );
  }

  /* compact */
  return (
    <article
      className={cn(
        "flex h-full cursor-pointer flex-col justify-between p-8 lg:p-12",
        bg,
        className,
      )}
    >
      <p className="my-8 text-lg font-light italic lg:text-xl">
        &ldquo;{quote}&rdquo;
      </p>
      <div>
        <span className="block text-lg font-semibold">{name}</span>
        <span className={cn("block text-sm", mutedText)}>{title}</span>
      </div>
    </article>
  );
}
