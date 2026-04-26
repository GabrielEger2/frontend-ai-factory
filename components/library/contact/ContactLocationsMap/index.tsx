"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { Highlighter } from "@ui/text-decorations/Highlighter";
import {
  AnimatedSvgBackground,
  GEOMETRIC_SHAPES,
} from "@ui/backgrounds/AnimatedSvgBackground";
import { DotPattern } from "@ui/backgrounds/DotPattern";
import { StripedPattern } from "@ui/backgrounds/StripedPattern";
import { GradientBars } from "@ui/backgrounds/GradientBars";
import { InteractiveGridPattern } from "@ui/backgrounds/InteractiveGridPattern";

function renderMotif(bg?: string) {
  switch (bg) {
    case "animated-svg":
      return <AnimatedSvgBackground shapes={GEOMETRIC_SHAPES} />;
    case "dot-pattern":
      return <DotPattern />;
    case "striped":
      return <StripedPattern />;
    case "gradient-bars":
      return <GradientBars />;
    case "interactive-grid":
      return <InteractiveGridPattern />;
    default:
      return null;
  }
}

export interface LocationItem {
  city: string;
  address: string;
  phone?: string;
  email?: string;
  hours?: string;
}

export interface ContactLocationsMapProps {
  /** Optional section headline rendered above the featured image. */
  headline?: string;
  /** Optional supporting copy under the headline. */
  subheadline?: string;
  /** Optional word inside the headline to wrap in a Highlighter underline. */
  highlightWord?: string;
  /** Featured editorial image rendered above the locations grid. */
  featuredImage: string;
  /** Accessible description of the featured image. */
  featuredImageAlt: string;
  /** Up to six office or store locations rendered as a responsive column grid. */
  locations: LocationItem[];
  /** Optional Google Maps embed URL rendered below the locations grid. */
  mapEmbedUrl?: string;
  /** Optional motif-echo background rendered behind the section content */
  backgroundVariant?: string;
  className?: string;
}

function renderHighlightedHeadline(text: string, highlight?: string) {
  if (!highlight) return text;
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + highlight.length);
  const after = text.slice(idx + highlight.length);
  return (
    <>
      {before}
      <Highlighter action="underline" colorScheme="primary">
        {match}
      </Highlighter>
      {after}
    </>
  );
}

export default function ContactLocationsMap({
  headline,
  subheadline,
  highlightWord,
  featuredImage,
  featuredImageAlt,
  locations,
  mapEmbedUrl,
  backgroundVariant,
  className,
}: ContactLocationsMapProps) {
  const prefersReducedMotion = useReducedMotion();
  const cappedLocations = locations.slice(0, 6);
  const columnsClass =
    cappedLocations.length >= 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : cappedLocations.length === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2";

  return (
    <section
      className={cn(
        "relative isolate w-full overflow-hidden bg-base-100 px-4 py-12 md:px-8 md:py-16 lg:px-12 lg:py-24",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        {renderMotif(backgroundVariant)}
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:gap-14">
        {(headline || subheadline) && (
          <motion.header
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-3xl"
          >
            {headline && (
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-base-content md:text-4xl lg:text-5xl">
                {renderHighlightedHeadline(headline, highlightWord)}
              </h2>
            )}
            {subheadline && (
              <p className="mt-4 text-base text-base-content/70 md:text-lg">
                {subheadline}
              </p>
            )}
          </motion.header>
        )}

        <motion.figure
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="overflow-hidden rounded-lg bg-base-200"
        >
          <img
            src={featuredImage}
            alt={featuredImageAlt}
            className="aspect-[16/9] h-auto w-full object-cover"
            loading="lazy"
          />
        </motion.figure>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className={cn("grid grid-cols-1 gap-8 md:gap-10", columnsClass)}
        >
          {cappedLocations.map((location, index) => (
            <motion.li
              key={`${location.city}-${index}`}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-col gap-3 border-t border-base-300 pt-6"
            >
              <h3 className="text-xl font-bold tracking-tight text-base-content md:text-2xl">
                {location.city}
              </h3>
              <address className="not-italic text-sm leading-relaxed text-base-content/70 md:text-base">
                {location.address}
              </address>
              <dl className="flex flex-col gap-2 text-sm text-base-content/70 md:text-base">
                {location.phone && (
                  <div className="flex flex-col">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-base-content/40">
                      Phone
                    </dt>
                    <dd className="mt-0.5">
                      <a
                        href={`tel:${location.phone.replace(/\s+/g, "")}`}
                        className="transition-colors hover:text-primary"
                      >
                        {location.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {location.email && (
                  <div className="flex flex-col">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-base-content/40">
                      Email
                    </dt>
                    <dd className="mt-0.5 break-words">
                      <a
                        href={`mailto:${location.email}`}
                        className="transition-colors hover:text-primary"
                      >
                        {location.email}
                      </a>
                    </dd>
                  </div>
                )}
                {location.hours && (
                  <div className="flex flex-col">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-base-content/40">
                      Hours
                    </dt>
                    <dd className="mt-0.5">{location.hours}</dd>
                  </div>
                )}
              </dl>
            </motion.li>
          ))}
        </motion.ul>

        {mapEmbedUrl && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden rounded-lg border border-base-300 bg-base-200"
          >
            <iframe
              src={mapEmbedUrl}
              title="Map of locations"
              loading="lazy"
              className="aspect-[16/9] w-full border-0"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
