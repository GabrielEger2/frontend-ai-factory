"use client";

import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FaqSolutionsItem {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  image: string;
  imageAlt: string;
}

export interface FaqSolutionsProps {
  /** Section heading */
  headline: string;
  /** Optional supporting text below the headline */
  subheadline?: string;
  /** Array of solution items with title, description, CTA, and image */
  items?: FaqSolutionsItem[];
  /** Index of the item to expand by default (default: 0) */
  defaultOpenIndex?: number;
  /** CTA button style */
  ctaStyle?: CtaVariant;
  /** CTA color scheme */
  ctaColorScheme?: ColorScheme;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_FAQ_SOLUTIONS_ITEMS: FaqSolutionsItem[] = [
  {
    title: "Move from spreadsheets to a real system",
    description:
      "Stop chasing data across tabs. We migrate your existing workflow into a single source of truth — usually in under a week.",
    ctaText: "See migration guide",
    ctaUrl: "#",
    image: "https://picsum.photos/seed/faqsolutions-item-0/640/400",
    imageAlt: "Clean dashboard replacing a cluttered spreadsheet",
  },
  {
    title: "Run a tighter weekly review",
    description:
      "Pre-built templates for the meetings that actually move the business — quarterly planning, weekly retros, and monthly business reviews.",
    ctaText: "Browse templates",
    ctaUrl: "#",
    image: "https://picsum.photos/seed/faqsolutions-item-1/640/400",
    imageAlt: "Team gathered around a planning board",
  },
  {
    title: "Onboard new hires in their first week",
    description:
      "Shareable checklists, role-based access, and built-in document signing — so day one feels organized instead of overwhelming.",
    ctaText: "See an onboarding flow",
    ctaUrl: "#",
    image: "https://picsum.photos/seed/faqsolutions-item-2/640/400",
    imageAlt: "New employee reviewing onboarding tasks on a laptop",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-component — individual solution panel                          */
/* ------------------------------------------------------------------ */

function SolutionItem({
  item,
  index,
  isOpen,
  onSelect,
  ctaStyle,
  ctaColorScheme,
}: {
  item: FaqSolutionsItem;
  index: number;
  isOpen: boolean;
  onSelect: () => void;
  ctaStyle?: CtaVariant;
  ctaColorScheme?: ColorScheme;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={isOpen}
      className="relative cursor-pointer overflow-hidden rounded-lg p-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100"
    >
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 240 : 72,
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.25,
          ease: "easeOut",
        }}
        className="relative z-20 flex flex-col justify-between rounded-[7px] bg-base-100 p-6"
      >
        <div>
          <p
            className={cn(
              "w-fit text-xl font-medium transition-colors duration-200",
              isOpen ? "text-primary" : "text-base-content",
            )}
          >
            {item.title}
          </p>
          <motion.p
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.2,
              ease: "easeOut",
            }}
            className="mt-4 text-base-content/70"
          >
            {item.description}
          </motion.p>
        </div>
        <motion.div
          initial={false}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.2,
            ease: "easeOut",
          }}
        >
          <CtaButton
            variant={ctaStyle}
            colorScheme={ctaColorScheme}
            href={item.ctaUrl}
            className="-mx-6 -mb-6 mt-4 w-full rounded-t-none"
            onClick={(e) => e.stopPropagation()}
          >
            {item.ctaText}
          </CtaButton>
        </motion.div>
      </motion.div>

      {/* Active indicator — gradient border */}
      <motion.div
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.2,
          ease: "easeOut",
        }}
        className="absolute inset-0 z-10 rounded-lg bg-primary"
      />
      {/* Inactive background */}
      <div className="absolute inset-0 z-0 rounded-lg bg-base-300" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FaqSolutions({
  headline,
  subheadline,
  items = DEFAULT_FAQ_SOLUTIONS_ITEMS,
  defaultOpenIndex = 0,
  ctaStyle,
  ctaColorScheme,
  className,
}: FaqSolutionsProps) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  const activeImage = items[openIndex]?.image;
  const activeImageAlt = items[openIndex]?.imageAlt ?? "";
  const safeImg = useSafeImageSrc(
    activeImage,
    `faq-solutions-01-item-image-${openIndex ?? 0}`,
    600,
    450,
  );

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 md:px-8 lg:grid-cols-[1fr_350px]">
        <div>
          {/* Header */}
          <h2 className="mb-2 text-3xl font-bold leading-tight text-base-content md:text-4xl">
            {headline}
          </h2>
          {subheadline && (
            <p className="mb-8 text-base text-base-content/60 md:text-lg">
              {subheadline}
            </p>
          )}
          {!subheadline && <div className="mb-8" />}

          {/* Solution list */}
          <div className="flex flex-col gap-4">
            {items.map((item, index) => (
              <SolutionItem
                key={index}
                item={item}
                index={index}
                isOpen={openIndex === index}
                onSelect={() => setOpenIndex(index)}
                ctaStyle={ctaStyle}
                ctaColorScheme={ctaColorScheme}
              />
            ))}
          </div>
        </div>

        {/* Image panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="hidden aspect-[4/3] overflow-hidden rounded-2xl bg-base-200 lg:block lg:aspect-auto"
          >
            <img
              src={safeImg.src}
              onError={safeImg.onError}
              alt={activeImageAlt}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
